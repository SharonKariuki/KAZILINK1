const mongoose = require('mongoose');
const Worker = require('../models/Worker');
const Job = require('../models/jobModels');

// @desc    Match jobs based on worker's skills and optional location
// @route   GET /api/match/:workerId
// @access  Public
exports.matchJobs = async (req, res) => {
  const { workerId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(workerId)) {
    return res.status(400).json({ success: false, message: 'Invalid worker ID' });
  }

  try {
    const worker = await Worker.findById(workerId);
    if (!worker) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }

    const { skills = [], address } = worker;
    if (!skills.length) {
      return res.status(400).json({ success: false, message: 'Worker has no skills for matching' });
    }

    const query = {
      skills: { $in: skills },
      status: 'Active'
    };

    if (address?.city) {
      query.location = { $regex: address.city, $options: 'i' };
    }

    console.log('🔍 Match query:', query);

    const jobs = await Job.find(query).sort({ postedAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });

  } catch (error) {
    console.error('❌ Match error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
