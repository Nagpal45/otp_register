const express = require('express')
const bcrypt = require('bcrypt');
const User = require('./model');
const { generateOTP, transporter } = require('./utils');

const router = express.Router();

router.post('/register', async (req, res) => {
    const { email, password } = req.body;
  
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
  
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'OTP for Account Verification',
      text: `Your OTP for account verification is: ${otp}`,
    };
    console.log(transporter);
  
    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        return res.status(500).json({ error: 'Error sending OTP' });
      }
  
      const newUser = new User({ email, password: hashedPassword, otp });
      newUser.save()
        .then(() => {
          res.status(201).json({ message: 'User registered successfully. Check your email for OTP.' });
        })
        .catch((err) => {
          res.status(500).json({ error: 'Error saving user to database' });
        });
    });
  });

module.exports = router;