const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const { promisify } = require('util');

// Generate JWT
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

/**
 * @desc    Register user and send email verification
 * @route   POST /api/auth/signup
 * @access  Public
 */
exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email already in use. Please login or use another email.'
      });
    }

    const newUser = await User.create({ firstName, lastName, email, password });

    const rawToken = newUser.createVerificationToken();
    await newUser.save({ validateBeforeSave: false });

    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${rawToken}`;

    const html = `
      <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px; color: #111;">
        <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); overflow: hidden;">
          <div style="background: linear-gradient(to right, #6366f1, #3b82f6); padding: 20px;">
            <h2 style="color: white; margin: 0;">Welcome to KaziLink, ${newUser.firstName}!</h2>
          </div>
          <div style="padding: 30px;">
            <p>Thank you for registering at <strong>KaziLink</strong>. Please verify your email to activate your account.</p>
            <a href="${verificationUrl}" style="
              display: inline-block;
              background-color: #3b82f6;
              color: white;
              text-decoration: none;
              padding: 12px 24px;
              border-radius: 6px;
              font-weight: bold;
              margin: 20px 0;
            ">
              Verify Email
            </a>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn’t request this, you can safely ignore this email.</p>
          </div>
          <div style="background: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
            &copy; ${new Date().getFullYear()} KaziLink. All rights reserved.
          </div>
        </div>
      </div>
    `;

    await sendEmail({
      email: newUser.email,
      subject: 'Verify Your Email - KaziLink',
      message: '', // plain text (optional)
      html
    });

    res.status(201).json({
      status: 'success',
      message: 'Verification email sent! Please check your inbox.'
    });

  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ status: 'fail', message: 'Something went wrong. Please try again.' });
  }
};


/**
 * @desc    Verify email
 * @route   GET /api/auth/verify-email/:token
 * @access  Public
 */
exports.verifyEmail = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid or expired token.'
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });

    const token = signToken(user._id);

  res.status(200).json({
  status: 'success',
  message: 'Email verified successfully.',
  token
});


  } catch (err) {
    console.error('Verify email error:', err);
    res.status(500).json({ status: 'fail', message: 'Email verification failed.' });
  }
};

// controllers/authController.js

exports.setRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!['employer', 'worker'].includes(role)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid role value' });
    }

    const user = await User.findByIdAndUpdate(userId, { role }, { new: true });

    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }

    res.status(200).json({ status: 'success', data: { user } });
  } catch (error) {
    console.error('Set role error:', error);
    res.status(500).json({ status: 'error', message: 'Something went wrong' });
  }
};

/**
 * @desc    Sign in user
 * @route   POST /api/auth/signin
 * @access  Public
 */
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password.'
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password.'
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        status: 'fail',
        message: 'Please verify your email before logging in.'
      });
    }
    // Generate JWT token
  const token = signToken(user._id);

// Redirect to the frontend with the JWT token in the URL
res.status(200).json({
      status: 'success',
      token,
      user: {
        id: user._id,
        role: user.role,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });

  } catch (err) {
    console.error('Signin error:', err);
    res.status(500).json({ status: 'fail', message: 'Login failed. Please try again.' });
  }
};

/**
 * @desc    Middleware to protect routes
 */
exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'Not authorized. Please login first.'
      });
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'User no longer exists.'
      });
    }

    // Optional: Check if password was changed after token was issued
    if (user.changedPasswordAfter && user.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        status: 'fail',
        message: 'Password recently changed. Please login again.'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Protect middleware error:', err);
    res.status(401).json({ status: 'fail', message: 'Unauthorized access.' });
  }
};
