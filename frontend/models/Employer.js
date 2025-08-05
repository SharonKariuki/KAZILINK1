import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  title: String,
  location: String,
  type: String,
  description: String,
});

const EmployerSchema = new mongoose.Schema({
  name: String,
  company: String,
  location: String,
  email: String,
  phone: String,
  industry: String,
  companySize: String,
  foundedYear: Number,
  bio: String,
  jobs: [JobSchema],
});

export default mongoose.models.Employer || mongoose.model("Employer", EmployerSchema);
