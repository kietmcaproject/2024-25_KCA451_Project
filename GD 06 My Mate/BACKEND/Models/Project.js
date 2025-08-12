const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    technologies: {
      type: [String], // Array of technologies
      required: true,
    },
    teamMembers: {
      type: [String], // Array of team members (you can later reference User model if needed)
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    user: { // Reference to the User who created the project
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
