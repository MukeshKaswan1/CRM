

const express = require('express');
const router = express.Router();
const conversationSchema = require('../models/conversationSchema');

router.post('/createLog', async (req, res) => {
    try {
        const { leadId, type, summary, followUp } = req.body;
        const newConversation = new conversationSchema({
            leadId,
            type,
            summary,
            followUp
        });
        await newConversation.save();
        return res.status(200).json({ message: 'Log created successfully', log: newConversation });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
})

router.get('/getLogs/:leadId', async (req, res) => {
    try {
        const leadId = req.params.leadId;
        const logs = await conversationSchema
            .find({ leadId: leadId })
            .sort({ createdAt: -1 });

        if (!logs) {
            return res.status(404).json({ error: 'Logs not found' });
        }
        return res.status(200).json(logs);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;