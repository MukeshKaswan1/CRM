

const express = require('express');
const router = express.Router();
const leadSchema = require('../models/leadSchema');

router.post('/', async (req, res) => {
    try{
        console.log(req.body);
        const { name, email, linkedIn, company, notes, tags } = req.body;
        const newLead = new leadSchema({
            name,
            email,
            linkedIn,
            company,
            notes,
            tags
        });
        await newLead.save();
        return res.status(200).json({ message: 'Lead created successfully', lead: newLead });
    }
    catch(err){
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
})

router.get('/', async (req, res) => {
    try {
        const leads = await leadSchema.find();
        return res.status(200).json(leads);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
})

module.exports = router;