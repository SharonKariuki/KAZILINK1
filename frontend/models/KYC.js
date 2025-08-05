import mongoose from "mongoose";

const KYCschema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    documentType: {
      type: String,
      required: true,
      trim: true,
    },
    documentNumber: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Avoid recompiling model during hot reloads in Next.js
export default mongoose.models.KYC || mongoose.model("KYC", KYCschema);
