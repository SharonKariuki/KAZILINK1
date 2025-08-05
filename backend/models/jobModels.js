const mongoose = require('mongoose');

const JOB_TYPES = ['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Temporary'];
const REMOTE_OPTIONS = ['On-site only', 'Hybrid', 'Remote only'];

const geoPointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true,
    default: 'Point'
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true
  },
  city: { type: String }
}, { _id: false });

const jobSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
//   occupation: {
//   type: String,
//   required: true,
//   trim: true,
//   maxlength: 100
// },

  location: {
    type: String,
    required: true,
    maxlength: 100
  },
  locationGeo: geoPointSchema,
  jobType: {
    type: String,
    required: true,
    enum: JOB_TYPES
  },
  yearsOfExperience: {
    type: Number,
    required: true,
    min: 0,
    max: 50
  },
  salaryRange: {
    min: {
      type: Number,
      min: 0
    },
    max: {
      type: Number,
      min: 0
    }
  },
  remoteWork: {
    type: String,
    required: true,
    enum: REMOTE_OPTIONS
  },
  jobDescription: {
    type: String,
    required: true,
    minlength: 50,
    maxlength: 5000
  },
  skills: {
    type: [String],
    required: true,
    validate: skills => skills.length > 0
  },
  // qualifications: {
  //   type: [String],
  //   required: true,
  //   validate: qualifications => qualifications.length > 0
  // },
  status: {
    type: String,
    enum: ['Active', 'Closed', 'Draft'],
    default: 'Active'
  }
}, {
  timestamps: {
    createdAt: 'postedAt',
    updatedAt: 'lastUpdated'
  },
  toJSON: {
    virtuals: true,
    transform: (_, ret) => {
      delete ret.__v;
      ret.id = ret._id;
      delete ret._id;
    }
  },
  toObject: { virtuals: true }
});

// Indexes
jobSchema.index({ jobTitle: 'text', jobDescription: 'text' });
jobSchema.index({ postedBy: 1, status: 1 });
jobSchema.index({ locationGeo: '2dsphere' });

// Virtual
jobSchema.virtual('formattedSalary').get(function () {
  if (!this.salaryRange?.min && !this.salaryRange?.max) return 'Negotiable';
  if (!this.salaryRange?.max) return `From $${this.salaryRange.min}`;
  return `$${this.salaryRange.min} - $${this.salaryRange.max}`;
});

// Pre-save: clean skills/qualifications
jobSchema.pre('save', function (next) {
  if (this.skills) this.skills = this.skills.map(s => s.trim());
  if (this.qualifications) this.qualifications = this.qualifications.map(q => q.trim());
  next();
});

module.exports = mongoose.model('Job', jobSchema);
