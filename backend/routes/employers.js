const express = require('express');
const router = express.Router();
const upload = require('../middleware/multerConfig');
const Employer = require('../models/Employer');
const User = require('../models/User');

// Upload middleware for ID & selfie
const multiUpload = upload.fields([
  { name: 'idFront', maxCount: 1 },
  { name: 'idBack', maxCount: 1 },
  { name: 'selfie', maxCount: 1 }
]);

// ✅ Register employer with inline logic (like worker)
router.post('/register', multiUpload, async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ message: 'Missing user ID in query' });
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      dob,
      gender,
      street,
      city,
      state,
      zip,
      country,
      hasCriminalRecord,
      explanation,
      confirmInfo,
      consent,
      role
    } = req.body;

    const uploadedFiles = req.files || {};
    const selfieFile = uploadedFiles.selfie?.[0];
    const idFrontFile = uploadedFiles.idFront?.[0];
    const idBackFile = uploadedFiles.idBack?.[0];

    if (!selfieFile || !idFrontFile) {
      return res.status(400).json({ message: 'Selfie and ID front are required.' });
    }

    const newEmployer = new Employer({
      user: userId,
      role: role || 'employer',
      firstName,
      lastName,
      email,
      phone,
      dob,
      gender,
      address: {
        street,
        city,
        state,
        zip,
        country,
      },
      criminalRecord: {
        hasRecord: hasCriminalRecord === 'yes',
        explanation,
      },
      idFront: idFrontFile.filename,
      idBack: idBackFile?.filename || '',
      selfie: selfieFile.filename,
      confirmInfo: confirmInfo === 'true' || confirmInfo === true,
      consent: consent === 'true' || consent === true,
      submittedAt: new Date(),
      profileApproved: false, // Admin will manually approve
    });

    await newEmployer.save();

    await User.findByIdAndUpdate(userId, {
      role: 'employer',
      profileApproved: false
    });

    res.status(201).json({ message: 'Employer registered successfully! Awaiting admin review.' });
  } catch (err) {
    console.error('Employer registration error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ✅ Fetch employer by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const employer = await Employer.findOne({ user: req.params.userId }).populate('user');
    if (!employer) {
      return res.status(404).json({ message: 'Employer not found' });
    }
    res.status(200).json(employer);
  } catch (err) {
    console.error('Employer fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Optional: Upload employer profile photo
router.post('/upload-profile-photo/:employerId', upload.single('photo'), async (req, res) => {
  try {
    const employer = await Employer.findById(req.params.employerId);
    if (!employer) return res.status(404).json({ message: 'Employer not found' });

    employer.profilePhoto = req.file.filename;
    await employer.save();

    res.json({ message: 'Profile photo updated', profilePhoto: req.file.filename });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed' });
  }
});

module.exports = router;
