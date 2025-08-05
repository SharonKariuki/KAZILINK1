import mongoose from "mongoose";

const workerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  dob: String,
  gender: String,
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  },
  occupation: String,
  experience: Number,
  skills: [String],
  education: {
    institution: String,
    degree: String,
    field: String,
    completionYear: String,
  },
  certifications: {
    name: String,
    issuingOrg: String,
    date: String,
    file: String,
  },
  criminalRecord: String,
  explanation: String,
  confirmInfo: Boolean,
  consent: Boolean,
  files: {
    cv: String,
    idFront: String,
    idBack: String,
  },
  trustStatus: {
    type: String,
    enum: ["trusted", "unverified"],
    default: "unverified",
  },
  availability: {
    type: Boolean,
    default: true,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: false,
    },
  },
});

// Add a 2dsphere index for geospatial search
workerSchema.index({ location: "2dsphere" });

export default mongoose.model("Worker", workerSchema);
