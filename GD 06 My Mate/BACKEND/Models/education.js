const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema(
  {
    userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user", // Refers to the user who's education is this
        },
    institution: {
      type: String,
      required: true,
    },
    degree: {
      type: String,
      required: true,
    },
    duration: {
      type: String, // E.g., "2019 - 2023"
      required: true,
    },
    grade: {
      type: String, // E.g., "A", "B", "First Class"
      required: true,
    },
    skills: {
      type: [String], // Array of skills like ["JavaScript", "React", "Node"]
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("education", educationSchema);
