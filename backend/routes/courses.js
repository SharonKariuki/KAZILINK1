const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Course = require("../models/Course");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});
const upload = multer({ storage });

// ✅ Get all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

// ✅ Add course (handling FormData)
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const {
      title,
      description,
      externalUrl,
      published,
    } = req.body;

    // Ensure required fields
    if (!title) {
      return res.status(400).json({ error: "Title is required." });
    }

    const newCourse = new Course({
      title,
      description: description || "",
      published: published === "true", // FormData sends booleans as strings
    });

    if (externalUrl) {
      newCourse.externalUrl = externalUrl;
    }

    if (req.file) {
      // Save file path relative for frontend access
      newCourse.fileUrl = `/uploads/${req.file.filename}`;
    }

    await newCourse.save();

    res.status(201).json(newCourse);
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ error: "Failed to create course" });
  }
});

// ✅ Edit course
router.put("/:id", async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ error: "Failed to update course" });
  }
});

// ✅ Delete course
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.status(200).json({ message: "Deleted" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ error: "Failed to delete course" });
  }
});

module.exports = router;
