const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const User = require("../models/User");
const Worker = require("../models/Worker");
const Employer = require("../models/Employer");
const Job = require("../models/jobModels");
const Review = require("../models/Review");
const Banner = require("../models/Banner");

/* ---------------------------------- Auth ---------------------------------- */

// 🔐 Generate Admin JWT
const signAdminToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
      email: admin.email,
      role: "admin",
      isVerified: admin.isVerified,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// 🟩 Admin Sign In
exports.adminSignin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin) {
      return res.status(401).json({ message: "Admin not found or invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = signAdminToken(admin);

    res.status(200).json({
      token,
      user: {
        id: admin._id,
        email: admin.email,
        role: "admin",
      },
    });
  } catch (error) {
    console.error("Admin signin error:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

/* ---------------------------------- Users ---------------------------------- */

// 📋 Get all users with related profiles
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate("worker", "-__v")
      .populate("employer", "-__v");
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// 🕵️ Get users with incomplete or unapproved profiles
exports.getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await User.find({ profileApproved: false })
      .populate("worker", "-__v")
      .populate("employer", "-__v");
    res.status(200).json(pendingUsers);
  } catch (err) {
    console.error("Error fetching pending users:", err);
    res.status(500).json({ message: "Failed to fetch pending users" });
  }
};

// ✅ Approve or reject user profile
exports.updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { profileApproved } = req.body;

  if (typeof profileApproved !== "boolean") {
    return res.status(400).json({ message: "'profileApproved' must be a boolean." });
  }

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found." });

    if (user.role === "worker") {
      await Worker.findOneAndUpdate({ user: id }, { profileApproved });
    } else if (user.role === "employer") {
      await Employer.findOneAndUpdate({ user: id }, { profileApproved });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        profileApproved,
        isProfileComplete: profileApproved,
      },
      { new: true }
    ).populate("worker").populate("employer");

    res.status(200).json({
      message: `User profile ${profileApproved ? "approved" : "rejected"} successfully.`,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ message: "Failed to update user status." });
  }
};

/* ----------------------------------- KYC ---------------------------------- */

// 📄 Get workers with pending KYC
exports.getPendingKYC = async (req, res) => {
  try {
    const pending = await Worker.find({ kycStatus: "pending" })
      .select("firstName lastName email phone selfie idFront idBack submittedAt user")
      .populate("user", "email");

    res.status(200).json(pending);
  } catch (error) {
    console.error("Error fetching pending KYC workers:", error);
    res.status(500).json({ message: "Failed to fetch KYC data" });
  }
};

// ✅ Approve or reject worker KYC
exports.updateKYCStatus = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;

  if (!["approve", "reject"].includes(action)) {
    return res.status(400).json({ message: "Invalid action. Must be 'approve' or 'reject'." });
  }

  const kycStatus = action === "approve" ? "verified" : "rejected";
  const profileApproved = action === "approve";

  try {
    const worker = await Worker.findByIdAndUpdate(
      id,
      { kycStatus, profileApproved },
      { new: true }
    );
    if (!worker) return res.status(404).json({ message: "Worker not found." });

    await User.findByIdAndUpdate(worker.user, {
      profileApproved,
      isProfileComplete: profileApproved,
    });

    res.status(200).json({
      message: `KYC ${kycStatus} successfully.`,
      worker,
    });
  } catch (err) {
    console.error("Error updating KYC status:", err);
    res.status(500).json({ message: "Failed to update KYC status" });
  }
};

/* ---------------------------------- Stats --------------------------------- */

// 📊 Dashboard Stats
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const workers = await Worker.countDocuments();
    const employers = await Employer.countDocuments();
    const verifiedWorkers = await Worker.countDocuments({ kycStatus: "verified" });
    const jobs = await Job.countDocuments();
    const pendingKYC = await Worker.countDocuments({ kycStatus: "pending" });
    const activeJobs = await Job.countDocuments({ status: "active" });

    res.status(200).json({ totalUsers, workers, employers, verifiedWorkers, jobs, activeJobs, pendingKYC });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};

/* ------------------------------ Jobs Management ---------------------------- */

// 📄 Get all job posts
exports.getJobPosts = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

// 🔄 Update job post status
exports.updateJobStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const job = await Job.findByIdAndUpdate(id, { status }, { new: true });
    if (!job) return res.status(404).json({ message: "Job not found." });

    res.status(200).json(job);
  } catch (err) {
    console.error("Error updating job status:", err);
    res.status(500).json({ message: "Failed to update job" });
  }
};

/* ------------------------------ Reviews Management ------------------------- */

// ⭐ Get all reviews
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.status(200).json(reviews);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

// ❌ Delete review
exports.deleteReview = async (req, res) => {
  const { id } = req.params;

  try {
    const review = await Review.findByIdAndDelete(id);
    if (!review) return res.status(404).json({ message: "Review not found." });

    res.status(200).json({ message: "Review deleted" });
  } catch (err) {
    console.error("Error deleting review:", err);
    res.status(500).json({ message: "Failed to delete review" });
  }
};

/* ----------------------------- Banners Management -------------------------- */

// 🖼️ Get all banners
exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.status(200).json(banners);
  } catch (err) {
    console.error("Error fetching banners:", err);
    res.status(500).json({ message: "Failed to fetch banners" });
  }
};

// ➕ Add new banner
exports.addBanner = async (req, res) => {
  const { imageUrl, title, link } = req.body;

  try {
    const banner = await Banner.create({ imageUrl, title, link });
    res.status(201).json(banner);
  } catch (err) {
    console.error("Error adding banner:", err);
    res.status(500).json({ message: "Failed to add banner" });
  }
};
