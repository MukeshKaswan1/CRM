
const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const Lead = require("../models/leadSchema")
const Conversation = require("../models/conversationSchema")

function getMockSuggestion({ lead, latestConversation }) {
  const { status } = lead
  const { type } = latestConversation

  if (status === "new") {
    if (type === "email") return "Wait 1–2 days and follow up with a call."
    if (type === "call") return "Send a LinkedIn connection request."
    return "Send a friendly introduction email."
  }

  if (status === "contacted") {
    if (type === "email") return "Follow up on the last email in 2 days."
    if (type === "call") return "Send a recap email with action items."
    if (type === "linkedin") return "Like and comment on their latest post."
    return "Send a calendar invite for a quick call."
  }

  if (status === "converted") {
    return "Send a thank-you email and mark lead as Closed-Won."
  }

  if (status === "closed") {
    return "Check back in 2–3 weeks to see if timing has improved."

  }

  return "No clear next step. Review recent activity and decide."
}

router.get("/suggestion/:leadId", async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.leadId).lean()
    const lastConversation = await Conversation.find({ leadId: lead._id })
      .sort({ createdAt: -1 })
      .lean()

    const suggestion = getMockSuggestion({
      lead,
      latestConversation: lastConversation || { type: "email" }, // fallback
    })

    res.json({ suggestion })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to generate mock suggestion" })
  }
})

module.exports = router;
