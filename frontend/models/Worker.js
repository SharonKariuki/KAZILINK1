import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  duration: String,
  description: String,
});

const workerSchema = new mongoose.Schema(
  {
    name: String,
    title: String,
    location: String,
    experience: Number,
    bio: String,
    email: String,
    phone: String,
    category: String,
    availability: String,
    rate: Number,
    skills: [String],
    experiences: [experienceSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Worker || mongoose.model('Worker', workerSchema);
