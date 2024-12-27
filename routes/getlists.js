const express = require('express');
const app = express();
const { Leads } = require("../models/index"); // Assuming your Lead model is exported from models/index.js

const router = express.Router();

// GET /leads
router.get('/', async (req, res) => {
    const { name } = req.query; // Use req.query for GET requests
  

    try {
        // If no name is provided, return all leads
        const query = name ? { name } : {}; 
        const leads = await Leads.find(query);

        // If leads are found, map the necessary data
        const data = leads.map(item => ({
            title: item.title,
            date: item.date,
            id: item._id // Use _id to get the document ID (MongoDB default)
        }));

        // Respond with the leads data
        res.status(200).json(data);
    } catch (error) {
        console.log("Error fetching leads:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/lead/:id', async (req, res) => {
    const { id } = req.params; // Extract the lead ID from the URL

    try {
        // Find the lead by ID
        const lead = await Leads.findById(id);

        if (!lead) {
            return res.status(404).json({ error: "Lead not found" });
        }

        // Send back detailed lead information
        const leadDetails = {
            title: lead.title,
            date: lead.date,
            name: lead.name,
            data: lead.data // Include the array of data (first_name, last_name, email)
        };

        res.status(200).json(leadDetails);
    } catch (error) {
        console.log("Error fetching lead details:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



module.exports = router;
