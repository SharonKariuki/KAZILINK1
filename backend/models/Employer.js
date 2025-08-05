const mongoose = require('mongoose');

// Embedded Address Subschema
const addressSchema = new mongoose.Schema(
  {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  },
  { _id: false }
);

// Embedded Criminal Record Subschema
const criminalRecordSchema = new mongoose.Schema(
  {
    hasRecord: { type: Boolean, default: false },
    explanation: String,
  },
  { _id: false }
);

const employerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    role: {
      type: String,
      enum: ['employer'],
      default: 'employer',
    },

    // Personal Info
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    dob: { type: String, required: true },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },

    address: addressSchema,

    // Employer-specific business info
    companyName: { type: String },
    companyWebsite: { type: String },

    // Criminal record
    criminalRecord: criminalRecordSchema,

    // KYC document filenames
    idFront: { type: String, required: true },
    idBack: { type: String, required: true },
    selfie: { type: String, required: true },
    cv: { type: String },  // optional in case future employer profiles upload docs

    // Path fields for KYC (future integrations)
    selfiePath: { type: String },
    idDocPath: { type: String },

    kycResult: { type: Object },

    kycStatus: {
      type: String,
      enum: ['pending', 'pendingApproval', 'verified', 'rejected'],
      default: 'pending',
    },

    // Approval and Admin status
    profileApproved: { type: Boolean, default: false },
    isApprovedToWork: { type: Boolean, default: false }, // match Worker model logic

    // Ratings & Reviews
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },

    // User consent fields
    confirmInfo: { type: Boolean, required: true },
    consent: { type: Boolean, required: true },

    submittedAt: {
      type: Date,
    },

    // Employer profile photo
    profilePhoto: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Employer', employerSchema);
