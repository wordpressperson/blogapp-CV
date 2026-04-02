const express = require('express');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET; // add to .env + Render dashboard
const MAGIC_EXPIRY = '15m';

// Send magic link
router.post('/send-magic', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ msg: 'Email required' });

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ email }); // default role = 'user'
  }

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: MAGIC_EXPIRY });

  // Configure your email (use SendGrid / Resend in production — Gmail works for testing)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: true,                    // true for port 465 (SMTPS)
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const magicLink = `${process.env.FRONTEND_URL}/auth/verify?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Your Blog Login Link',
    html: `<p>Click here to log in: <a href="${magicLink}">${magicLink}</a></p><p>Link expires in 15 minutes.</p>`
  });

  res.json({ msg: 'Magic link sent!' });
});

// Verify magic link + issue real session token
router.get('/verify', async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).json({ msg: 'No token' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const sessionToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token: sessionToken, user: { id: user._id, email: user.email, role: user.role } });
  } catch (err) {
    res.status(401).json({ msg: 'Invalid or expired link' });
  }
});

module.exports = router;
