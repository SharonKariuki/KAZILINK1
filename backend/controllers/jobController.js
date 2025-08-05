// File: controllers/jobController.js

const Job = require('../models/jobModels');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const JOB_FIELDS = [
  'jobTitle',
  'location',
  'jobType',
  'yearsOfExperience',
  'minSalary',
  'maxSalary',
  'remoteWork',
  'jobDescription',
  'skills',
  'qualifications',
  'latitude',
  'longitude',
  'city'
];

// Create a new job post
exports.createJob = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please provide a valid token.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Extract data from request
    const jobData = JOB_FIELDS.reduce((acc, field) => {
      if (req.body[field] !== undefined) acc[field] = req.body[field];
      return acc;
    }, { postedBy: decoded.id });

    // Handle geolocation
    if (
      jobData.latitude !== undefined &&
      jobData.longitude !== undefined
    ) {
      jobData.locationGeo = {
        type: 'Point',
        coordinates: [
          parseFloat(jobData.longitude),
          parseFloat(jobData.latitude)
        ],
        city: jobData.city || undefined
      };
    }

    // Remove latitude/longitude/city from top-level fields
    delete jobData.latitude;
    delete jobData.longitude;
    delete jobData.city;

    const job = new Job(jobData);
    await job.save();

    return res.status(201).json({
      success: true,
      message: 'Job post created successfully',
      data: job
    });

  } catch (error) {
    console.error('Job creation error:', error);
    const statusCode = error.name === 'JsonWebTokenError' ? 401 : 400;
    return res.status(statusCode).json({
      success: false,
      message: error.name === 'JsonWebTokenError'
        ? 'Invalid authentication token'
        : error.message
    });
  }
};

// Get jobs posted by a specific employer
exports.getJobsByEmployer = async (req, res) => {
  try {
    const { employerId } = req.params;
    if (!employerId) {
      return res.status(400).json({
        success: false,
        message: 'Employer ID is required'
      });
    }

    const jobs = await Job.find({ postedBy: employerId })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });

  } catch (error) {
    console.error('Error fetching employer jobs:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve jobs. Please try again later.'
    });
  }
};

// Get all jobs (with pagination)
exports.getAllJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      Job.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Job.countDocuments()
    ]);

    return res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: jobs
    });

  } catch (error) {
    console.error('Error fetching all jobs:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve jobs. Please try again later.'
    });
  }
};

// Get a job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).lean();

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job post not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: job
    });

  } catch (error) {
    console.error('Error fetching job by ID:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid job ID format'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve job details'
    });
  }
};

// Update a job post
exports.updateJob = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const updateData = JOB_FIELDS.reduce((acc, field) => {
      if (req.body[field] !== undefined) acc[field] = req.body[field];
      return acc;
    }, {});

    // Handle geolocation if updating location
    if (
      updateData.latitude !== undefined &&
      updateData.longitude !== undefined
    ) {
      updateData.locationGeo = {
        type: 'Point',
        coordinates: [
          parseFloat(updateData.longitude),
          parseFloat(updateData.latitude)
        ],
        city: updateData.city || undefined
      };
    }

    delete updateData.latitude;
    delete updateData.longitude;
    delete updateData.city;

    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, postedBy: decoded.id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or you are not authorized to update this job'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: job
    });

  } catch (error) {
    console.error('Job update error:', error);
    const statusCode = error.name === 'JsonWebTokenError' ? 401 : 400;
    return res.status(statusCode).json({
      success: false,
      message: error.name === 'JsonWebTokenError'
        ? 'Invalid authentication token'
        : error.message
    });
  }
};

// Delete a job post
exports.deleteJob = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      postedBy: decoded.id
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or you are not authorized to delete this job'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });

  } catch (error) {
    console.error('Job deletion error:', error);
    const statusCode = error.name === 'JsonWebTokenError' ? 401 : 500;
    return res.status(statusCode).json({
      success: false,
      message: error.name === 'JsonWebTokenError'
        ? 'Invalid authentication token'
        : 'Failed to delete job'
    });
  }
};

