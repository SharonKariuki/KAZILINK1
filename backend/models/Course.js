const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true
  },
  published: {
    type: Boolean,
    default: false
  },

  // Optional external or local content
  externalUrl: {
    type: String,
    trim: true
  },
  fileUrl: {
    type: String,
    trim: true
  },

  tags: [
    {
      type: String,
      trim: true
    }
  ],
  videoUrl: {
    type: String,
    trim: true
  },
  thumbnailUrl: {
    type: String,
    trim: true
  },
  content: {
    type: String
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Course", courseSchema);
