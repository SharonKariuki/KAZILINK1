//file: backend/models/Worker.js
const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  zip: String,
  country: String
}, { _id: false });

const educationSchema = new mongoose.Schema({
  education: String,
  degree: String,
  field: String,
  completionYear: String
}, { _id: false });

const certificationSchema = new mongoose.Schema({
  certificationName: String,
  issuingOrg: String,
  certificationDate: String
}, { _id: false });

const criminalRecordSchema = new mongoose.Schema({
  hasRecord: { type: Boolean, default: false },
  explanation: String
}, { _id: false });

const workerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  role: { type: String, enum: ['worker'], default: 'worker' },

  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  phone: { type: String, required: true },
  dob: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },

  address: addressSchema,
  occupation: { type: String, required: true },
  experience: { type: Number, min: 0 },
  skills: { type: [String], default: [] },
  education: educationSchema,
  certification: certificationSchema,
  criminalRecord: criminalRecordSchema,

  idFront: { type: String, required: true },
  idBack: { type: String, required: true },
  cv: { type: String },

  selfiePath: { type: String },
  idDocPath: { type: String },
  kycResult: { type: Object }, // from ID Analyzer
  kycStatus: {
    type: String,
    enum: ['pending', 'pendingApproval', 'verified', 'rejected'],
    default: 'pending'
  },

  isApprovedToWork: { type: Boolean, default: false },

  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },

  confirmInfo: { type: Boolean, required: true },
  consent: { type: Boolean, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Worker', workerSchema); 