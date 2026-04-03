const express = require('express');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET; // add to .env + Render dashboard
const MAGIC_EXPIRY = '15m';

// Send magic link - using SendGrid (works on Render free tier)
router.post('/send-magic', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ msg: 'Email required' });

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ email });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '15m' });

  // ← FIXED: Prevent double slash
  const frontendUrl = process.env.FRONTEND_URL.replace(/\/$/, '');
  const magicLink = `${frontendUrl}/auth/verify?token=${token}`;
//  const magicLink = `${process.env.FRONTEND_URL}/auth/verify?token=${token}`;

  try {
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    await sgMail.send({
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: 'Your Blog Login Link',
      html: `
        <p>Click here to log in to the blog:</p>
        <p><a href="${magicLink}" style="font-size:18px;">${magicLink}</a></p>
        <p>This link expires in 15 minutes.</p>
      `
    });

    res.json({ msg: 'Magic link sent to your email!' });
  } catch (err) {
    console.error('SendGrid error:', err.response ? err.response.body : err);
    res.status(500).json({ msg: 'Failed to send magic link. Please try again.' });
  }
});

// Verify magic link and return a session token
router.get('/verify', async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).json({ msg: 'Token required' });
  }

  try {
    // Verify the magic token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email } = decoded;

    // Find or create user (ensure they exist)
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email });
    }

    // Create a new session token (longer lived, e.g., 7 days)
    const sessionToken = jwt.sign(
      { email: user.email, role: user.role || 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return token + user data (without sensitive info)
    res.json({
      token: sessionToken,
      user: {
        email: user.email,
        role: user.role || 'user'
      }
    });
  } catch (err) {
    console.error('Verify error:', err.message);
    res.status(401).json({ msg: 'Invalid or expired magic link' });
  }
});

module.exports = router;
