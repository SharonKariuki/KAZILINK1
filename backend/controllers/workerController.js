// file: backend/controllers/workerController.js

import Worker from '../models/workerModel.js';
import User from '../models/User.js';
import IDAnalyzer from 'idanalyzer';

/**
 * @desc    Register a worker profile with automatic KYC verification
 * @route   POST /api/workers/register?userId=...
 * @access  Private
 */
export const registerWorker = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        status: 'fail',
        message: 'Missing userId in query parameters.',
      });
    }

    // Check if worker already exists
    const existing = await Worker.findOne({ user: userId });
    if (existing) {
      return res.status(409).json({
        status: 'fail',
        message: 'Worker profile already exists for this user.',
      });
    }

    let workerData = {
      ...req.body,
      user: userId,
    };

    // Parse skills if provided
    if (req.body.skills) {
      try {
        workerData.skills = JSON.parse(req.body.skills);
      } catch (err) {
        return res.status(400).json({
          status: 'fail',
          message: 'Invalid skills format. Must be JSON.',
        });
      }
    }

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

    // Attach file paths to worker data
    for (const field in uploadedFiles) {
      const fileArray = uploadedFiles[field];
      if (fileArray && fileArray[0]) {
        workerData[field] = fileArray[0].filename;
      }
    }

    // Add KYC metadata
    workerData.kycStatus = 'verified';
    workerData.kycResult = result;
    workerData.submittedAt = new Date();
    workerData.profileApproved = true;

    // Create Worker
    const worker = await Worker.create(workerData);

    // ✅ Update linked User model
    await User.findByIdAndUpdate(userId, {
      role: 'worker',
      profileApproved: true,
      worker: worker._id,
    });

    res.status(201).json({
      status: 'success',
      message: 'Worker profile registered and KYC verified.',
      data: { worker },
    });

  } catch (error) {
    console.error('Worker registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Worker registration failed.',
      error: error.message,
    });
  }
};
