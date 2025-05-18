

const express = require('express');
const router = express.Router();
const leadSchema = require('../models/leadSchema');
const conversationSchema = require('../models/conversationSchema');

router.post('/', async (req, res) => {
    try {
        const { name, email, linkedin, company, notes, tags } = req.body;
        const newLead = new leadSchema({
            name,
            email,
            linkedin,
            company,
            notes,
            tags
        });
        await newLead.save();
        return res.status(200).json({ message: 'Lead created successfully', lead: newLead });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
})

router.get('/', async (req, res) => {
    try {
        const search = req.query.search?.toLowerCase();
        const status = req.query.filter?.toLowerCase();
        const leads = await leadSchema.find({
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { company: { $regex: search, $options: 'i' } },
                { tags: { $elemMatch: { $regex: search, $options: 'i' } } },
            ],
            $and: [
                { status: { $regex: status, $options: 'i' } }
            ]
        }); return res.status(200).json(leads);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
})

router.get('/getLead/:id', async (req, res) => {
    try {
        const leadId = req.params.id;
        const lead = await leadSchema.findById(leadId);
        if (!lead) {
            return res.status(404).json({ error: 'Lead not found' });
        }
        return res.status(200).json(lead);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
})

router.put('/updateLead/:id', async (req, res) => {
    try {
        const leadId = req.params.id;
        const { name, email, linkedin, company, notes, tags, status } = req.body;
        const updatedLead = await leadSchema.findByIdAndUpdate(leadId, {
            name,
            email,
            linkedin,
            company,
            notes,
            tags,
            status
        });
        if (!updatedLead) {
            return res.status(404).json({ error: 'Lead not found' });
        }
        return res.status(200).json({ message: 'Lead updated successfully', lead: updatedLead });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
})



module.exports = router;