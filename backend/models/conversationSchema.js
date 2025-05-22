const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    leadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lead',
        required: true,
    },
    type: {
        type: String,
        enum: ['email', 'call', 'meeting', 'linkedin', 'other'],
        required: true, 
    },
    summary: {
        type: String,
        required: true,
        trim: true,
    },
    followUp: {
        date: {
            type: Date,
        },
        message: {
            type: String,
            trim: true,
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create and export the Conversation model
module.exports = mongoose.model('Conversation', conversationSchema);