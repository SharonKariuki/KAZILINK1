const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Admin must have a name"],
  },
  email: {
    type: String,
    required: [true, "Admin must have an email"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Admin must have a password"],
    minlength: 6,
    select: false,
  },
  isVerified: {
    type: Boolean,
    default: true,
  },
  role: {
    type: String,
    default: "admin",
  },
});

// Hash password before saving
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare passwords
adminSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Admin", adminSchema);
