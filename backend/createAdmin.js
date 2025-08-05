// createAdmin.js
const mongoose = require("mongoose");
const Admin = require("./models/Admin"); // adjust path if needed
require("dotenv").config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI); // your MongoDB URI from .env

    const admin = new Admin({
      name: "Mugure Kariuki",
      email: "mugurekariuki1@gmail.com",
      password: "pass123", // 🔐 plain password (will be hashed automatically)
      isVerified: true,
      role: "admin"
    });

    await admin.save();
    console.log("✅ Admin created successfully!");
    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    mongoose.disconnect();
  }
}

createAdmin();
