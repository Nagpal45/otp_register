const nodemailer = require('nodemailer');
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});


function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    console.log(token);
  
    if (!token) {
      return res.status(401).json({ error: 'Token not provided' });
    }
  
    jwt.verify(token, process.env.SECRET , (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }
  
      req.userId = decodedToken.userId;
      next();
    });
  };

module.exports = {
    transporter,
    generateOTP,
    verifyToken
}