const express = require('express')
const bcrypt = require('bcrypt');
const User = require('./model');
const jwt = require("jsonwebtoken")
const { generateOTP, transporter, verifyToken } = require('./utils');

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

  router.post('/verifyOtp', async (req, res) => {
    const { email, otp, location, age, work } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.otp !== otp) {
      return res.status(401).json({ error: 'Invalid OTP' });
    }
    user.location = location;
    user.age = age;
    user.work = work;
    user.otp = '';
    await user.save();
  
    res.json({ message: 'User information updated successfully' });
  });

  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.SECRET , { expiresIn: '1h' });
    console.log(token);
    res.json({ token });
  });

  router.get('/user', verifyToken, async (req, res) => {
    const userId = req.userId;
    console.log(userId);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
  
    res.json({ user });
  });
  
  

module.exports = router;