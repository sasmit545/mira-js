const express = require("express");
const { Leads } = require("../models/index"); // Assuming your Lead model is exported from models/index.js

const router = express.Router();

// Route to create a new lead set
router.post("/", async (req, res) => {
    
    try {
    const { title,name, date, data } = req.body;

    if (!title || !date || !data || !Array.isArray(data)) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    const newLead = new Leads({ name,title, date, data });
    await newLead.save();

    res.status(201).json({ message: "Lead data uploaded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving lead data" });
  }
});


// Export the router
module.exports = router;
