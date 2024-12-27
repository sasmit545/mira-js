const express = require("express");
const { Leads } = require("../models/index"); // Assuming your Lead model is exported from models/index.js
const nodemailer = require("nodemailer");

const router = express.Router();

// Route to start automation and send personalized emails
router.post("/", async (req, res) => {
    const { leadId, html, myemail, emailpassword } = req.body; // Extract the lead ID, HTML content, email, and password

    if (!leadId || !html || !myemail || !emailpassword) {
        return res.status(400).json({ error: "Missing required fields (leadId, html, myemail, or emailpassword)" });
    }

    try {
        // Find the lead by ID
        const lead = await Leads.findById(leadId);
        if (!lead) {
            return res.status(404).json({ error: "Lead not found" });
        }

        const recipients = lead.data;
        const transporter = nodemailer.createTransport({
            service: "gmail", // Use your email service (e.g., Gmail, SMTP server, etc.)
            auth: {
                user: myemail, // Sender email
                pass: emailpassword, // Email password from request
            },
        });

        let successCount = 0;
        let failureCount = 0;

        // Loop through each recipient and send a personalized email
        for (let recipient of recipients) {
            const placeholders = {
                "{{first_name}}": recipient.first_name,
                "{{last_name}}": recipient.last_name,
                "{{email}}": recipient.email,
            };
            
            const personalizedHtml = Object.keys(placeholders).reduce(
                (result, placeholder) => result.replaceAll(placeholder, placeholders[placeholder]),
                html
            );
            

            const mailOptions = {
                from: myemail, // Sender email
                to: recipient.email, // Recipient's email
                subject: `Hello ${recipient.first_name}, A Special Message for You`,
                html: personalizedHtml, // Personalized HTML content
            };

            try {
                await transporter.sendMail(mailOptions);
                successCount++;
            } catch (error) {
                console.error(`Error sending email to ${recipient.email}:`, error);
                failureCount++;
            }
        }

        res.status(200).json({
            message: `Emails sent successfully! ${successCount} sent, ${failureCount} failed.`,
        });
    } catch (error) {
        console.error("Error sending emails:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Export the router
module.exports = router;
