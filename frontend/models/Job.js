import mongoose from 'mongoose';

const { Schema } = mongoose;

const JobSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    status: {
      type: String,
      enum: ['active', 'draft', 'closed'],
      default: 'draft',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    location: {
      type: String,
      default: 'Remote',
    },
    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
      default: 'Full-time',
    },
    applications: {
      type: Number,
      default: 0,
    },
    salaryRange: {
      min: {
        type: Number,
        required: [true, 'Minimum salary is required'],
      },
      max: {
        type: Number,
        required: [true, 'Maximum salary is required'],
      },
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite in dev
export default mongoose.models.Job || mongoose.model('Job', JobSchema);
