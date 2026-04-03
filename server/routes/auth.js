const express = require('express');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET; // add to .env + Render dashboard
const MAGIC_EXPIRY = '15m';

// Send magic link
// Send magic link
router.post('/send-magic', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ msg: 'Email required' });

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ email });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '15m' });

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    // Add these to prevent hanging forever
    connectionTimeout: 10000,   // 10 seconds
    socketTimeout: 10000,
    debug: true,                // logs more info (remove later)
    logger: true
  });

  const magicLink = `${process.env.FRONTEND_URL}/auth/verify?token=${token}`;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Your Blog Login Link',
      html: `<p>Click here to log in: <a href="${magicLink}">${magicLink}</a></p>
             <p>This link expires in 15 minutes.</p>`
    });

    res.json({ msg: 'Magic link sent to your email!' });
  } catch (err) {
    console.error('Email send error:', err.message);
    res.status(500).json({ 
      msg: 'Failed to send email. This may be due to hosting restrictions.' 
    });
  }
});

module.exports = router;
