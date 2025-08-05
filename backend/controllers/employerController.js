const Employer = require('../models/Employer');
const User = require('../models/User');
const IDAnalyzer = require('idanalyzer');

/**
 * @desc    Register an employer profile with automatic KYC verification
 * @route   POST /api/employers/register?userId=...
 * @access  Private
 */
exports.registerEmployer = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        status: 'fail',
        message: 'Missing userId in query parameters.',
      });
    }

    // Check if employer already exists
    const existing = await Employer.findOne({ user: userId });
    if (existing) {
      return res.status(409).json({
        status: 'fail',
        message: 'Employer profile already exists for this user.',
      });
    }

    let employerData = {
      ...req.body,
      user: userId,
    };

    // Parse any JSON fields here if applicable in future
    // For example:
    // if (req.body.skills) {
    //   try {
    //     employerData.skills = JSON.parse(req.body.skills);
    //   } catch (err) {
    //     return res.status(400).json({
    //       status: 'fail',
    //       message: 'Invalid skills format. Must be JSON.',
    //     });
    //   }
    // }

    // Extract Multer file paths
    const uploadedFiles = req.files || {};
    const selfie = uploadedFiles.selfie?.[0];
    const idFront = uploadedFiles.idFront?.[0];
    const idBack = uploadedFiles.idBack?.[0];

    if (!selfie || !idFront) {
      return res.status(400).json({
        status: 'fail',
        message: 'Selfie and government-issued ID front are required for KYC.',
      });
    }

    // ✅ KYC verification using IDAnalyzer
    const coreapi = new IDAnalyzer.CoreAPI(process.env.IDANALYZER_API_KEY, 'US');
    const verification = await coreapi.verify({
      document_primary: idFront.path,
      document_secondary: idBack?.path,
      biometric_photo: selfie.path,
      face_match: true,
    });

    const result = verification || {};
    const isVerified = result.result === 1 && result.face_match === true;

    if (!isVerified) {
      return res.status(400).json({
        status: 'fail',
        message: 'KYC failed: face mismatch or invalid document.',
        result,
      });
    }

    // Dynamically attach filenames
    for (const field in uploadedFiles) {
      const fileArray = uploadedFiles[field];
      if (fileArray && fileArray[0]) {
        employerData[field] = fileArray[0].filename;
      }
    }

    // Map address sub-document
    employerData.address = {
      street: req.body.street,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip,
      country: req.body.country,
    };

    // Map criminal record sub-document
    employerData.criminalRecord = {
      hasRecord: req.body.hasCriminalRecord === 'yes',
      explanation:
        req.body.hasCriminalRecord === 'yes' ? req.body.explanation : '',
    };

    // Coerce booleans from strings
    employerData.confirmInfo = req.body.confirmInfo === 'true';
    employerData.consent = req.body.consent === 'true';

    // KYC metadata
    employerData.kycStatus = 'verified';
    employerData.kycResult = result;
    employerData.submittedAt = new Date();
    employerData.profileApproved = true;

    // Create Employer
    const employer = await Employer.create(employerData);

    // ✅ Update linked User model
    await User.findByIdAndUpdate(userId, {
      role: 'employer',
      profileApproved: true,
      employer: employer._id,
    });

    res.status(201).json({
      status: 'success',
      message: 'Employer profile registered and KYC verified.',
      data: { employer },
    });

  } catch (error) {
    console.error('Employer registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Employer registration failed.',
      error: error.message,
    });
  }
};

