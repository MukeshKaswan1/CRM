const mongoose = require("mongoose")

const LeadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, "Invalid email address"]
  },

  linkedin: {
    type: String,
    trim: true,
    default: ""
  },

  company: {
    type: String,
    trim: true,
    default: ""
  },

  notes: {
    type: String,
    trim: true,
    default: ""
  },

  tags: {
    type: [String],
    default: []
  },

  status: {
    type: String,
    enum: ["new", "contacted", "converted", "closed"],
    default: "new"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model("Lead", LeadSchema)