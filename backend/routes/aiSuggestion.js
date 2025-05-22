const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const Lead = require("../models/leadSchema")
const Conversation = require("../models/conversationSchema")

const getMockSuggestion = ({ lead, latestConversation }) => {
  const { status } = lead
  const { type } = latestConversation || { type: "email" } // Fallback for latestConversation

  const suggestions = {
    new: {
      email: "Wait 1–2 days and follow up with a call.",
      call: "Send a LinkedIn connection request.",
      default: "Send a friendly introduction email.",
    },
    contacted: {
      email: "Follow up on the last email in 2 days.",
      call: "Send a recap email with action items.",
      linkedin: "Like and comment on their latest post.",
      default: "Send a calendar invite for a quick call.",
    },
    converted: "Send a thank-you email and mark lead as Closed-Won.",
    closed: "Check back in 2–3 weeks to see if timing has improved.",
  }

  return suggestions[status]?.[type] || suggestions[status]?.default || "No clear next step. Review recent activity and decide."
}

router.get("/suggestion/:leadId", async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.leadId).lean()
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" })
    }

    const lastConversation = await Conversation.find({ leadId: lead._id })
      .sort({ createdAt: -1 })
      .limit(1) // Fetch only the latest conversation
      .lean()

    const suggestion = getMockSuggestion({
      lead,
      latestConversation: lastConversation[0], // Get the latest conversation or undefined
    })

    res.json({ suggestion })
  } catch (err) {
    console.error("Error fetching suggestion:", err)
    res.status(500).json({ message: "Failed to generate mock suggestion" })
  }
})

module.exports = router;
