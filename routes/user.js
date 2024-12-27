const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Add JWT
const { User } = require('../models/index');

// Secret key for signing the token
require('dotenv').config()
const JWT_SECRET =process.env.ACCESS_TOKEN; // Replace with a secure key



router.route('/auth').get(async(req,res)=>{

    
    const header= req.headers['authorization']
   

    const token =header.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET); 

        // Respond with success and the decoded token (e.g., user info)
        res.json({
            message: 'OK',
            user: decoded, // This contains the token's payload (e.g., userId and username)
        });
    } catch (error) {
        // If token verification fails, send error
        res.status(401).json({ message: 'Invalid token', error });
    }
    
})



// User registration route
router.route('/create').post(async (req, res) => {
    const { username, password } = req.body;

    // Input validation
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    const user = await User.findOne({ username });
    if(user){
        return res.status(400).json({ message: 'Username already exists' });
    }
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user in the database
        const newUser = await User.create({
            username,
            password: hashedPassword,
        });

        // Respond with success message
        res.json({
            message: 'OK',
            user: newUser,
        });
    } catch (error) {
        // Handle errors (e.g., database errors, etc.)
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// User login route
router.route('/login').post(async (req, res) => {
    const { username, password } = req.body;

    // Input validation
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare provided password with stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, {
            expiresIn: '150 sec', 
        });

        // Respond with the token and user details
        res.json({
            message: 'Login successful',
            token,  // Send the token to the user
            user,
        });
    } catch (error) {
        // Handle errors
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
