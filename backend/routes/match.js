const express = require('express');
const router = express.Router();
const Worker = require('../models/Worker');
const Job = require('../models/jobModels');

// ✅ Match jobs based on occupation and skill overlap
router.get('/:workerId', async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.workerId);
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    const { occupation, skills } = worker;

    if (!occupation || !skills || skills.length === 0) {
      return res.status(400).json({ message: 'Worker occupation or skills are missing' });
    }

    // 🔍 Find jobs where:
    // - jobTitle matches worker's occupation
    // - at least one job skill is in worker's skills
    const matchedJobs = await Job.find({
      jobTitle: occupation,
      skills: { $in: skills }
    });

    res.status(200).json({ jobs: matchedJobs });
  } catch (err) {
    console.error('Job matching error:', err);
    res.status(500).json({ message: 'Server error while matching jobs' });
  }
});

module.exports = router;
