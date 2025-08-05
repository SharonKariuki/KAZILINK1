const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    role: {
      type: String,
      enum: ['employer', 'worker', 'admin'],
      default: undefined
    },
    isVerified: { type: Boolean, default: false },
    isProfileComplete: { type: Boolean, default: false },
    profileApproved: { type: Boolean, default: false },
    trustBadge: { type: Boolean, default: false },
    verificationToken: String,
    verificationTokenExpires: Date,

    // ✅ Add these to fix populate error
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Worker',
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employer',
    },
  },
  {
    timestamps: true
  }
);

// Password hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Password comparison
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Email verification token generation
userSchema.methods.createVerificationToken = function () {
  const rawToken = crypto.randomBytes(32).toString('hex');
  this.verificationToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  this.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  return rawToken;
};

module.exports = mongoose.model('User', userSchema);
