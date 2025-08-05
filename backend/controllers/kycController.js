const Worker = require("../models/Worker");
const User = require("../models/User");

const submitKYC = async (req, res) => {
  try {
    const { userId } = req.query;
    const selfie = req.files?.selfie?.[0];
    const idFront = req.files?.idFront?.[0];
    const idBack = req.files?.idBack?.[0];

    if (!userId) {
      return res.status(400).json({ success: false, message: "Missing userId in query parameters." });
    }

    if (!selfie || !idFront) {
      return res.status(400).json({ success: false, message: "Missing required KYC files: 'selfie' and 'idFront' are required." });
    }

    const updatedWorker = await Worker.findOneAndUpdate(
      { user: userId },
      {
        selfie: selfie.filename,
        idFront: idFront.filename,
        idBack: idBack?.filename || "",
        kycStatus: "pending",
        submittedAt: new Date()
      },
      { new: true }
    );

    if (!updatedWorker) {
      return res.status(404).json({ success: false, message: "Worker profile not found. Please complete your profile first." });
    }

    await User.findByIdAndUpdate(userId, { profileApproved: false });

    return res.status(200).json({
      success: true,
      message: "KYC documents submitted successfully. Awaiting admin review.",
      worker: updatedWorker
    });
  } catch (err) {
    console.error("Manual KYC submission error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error during KYC submission.",
      error: err.message
    });
  }
};
const getPendingKYCs = async (req, res) => {
  try {
    const workers = await Worker.find({ kycStatus: "pending" })
      .populate("user", "firstName lastName email") // bring user info
      .select("selfie idFront idBack submittedAt");

    const formatted = workers.map(w => ({
      _id: w._id,
      firstName: w.user.firstName,
      lastName: w.user.lastName,
      email: w.user.email,
      idFront: w.idFront,
      idBack: w.idBack,
      selfie: w.selfie,
      submittedAt: w.submittedAt
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error("Error fetching pending KYCs:", err);
    res.status(500).json({ message: "Failed to fetch pending KYCs" });
  }
};
const updateKYCStatus = async (req, res) => {
  try {
    const { workerId } = req.params;
    const { action } = req.body; // approve or reject

    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    const newStatus = action === "approve" ? "approved" : "rejected";
    const worker = await Worker.findByIdAndUpdate(
      workerId,
      { kycStatus: newStatus },
      { new: true }
    );

    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    res.json({ message: `KYC ${newStatus}`, worker });
  } catch (err) {
    console.error("Error updating KYC status:", err);
    res.status(500).json({ message: "Failed to update KYC status" });
  }
};


const getKYCDocuments = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ success: false, message: "Missing userId in query parameters." });
    }

    const worker = await Worker.findOne({ user: userId }).select("selfie idFront idBack kycStatus submittedAt");

    if (!worker) {
      return res.status(404).json({ success: false, message: "Worker profile not found." });
    }

    return res.status(200).json({
      success: true,
      documents: {
        selfie: worker.selfie,
        idFront: worker.idFront,
        idBack: worker.idBack,
        kycStatus: worker.kycStatus,
        submittedAt: worker.submittedAt
      }
    });
  } catch (err) {
    console.error("Error fetching KYC documents:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching KYC documents.",
      error: err.message
    });
  }
};

module.exports = { submitKYC, getKYCDocuments };
