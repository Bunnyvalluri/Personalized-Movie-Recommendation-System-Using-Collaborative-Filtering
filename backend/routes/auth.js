const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const router = express.Router();

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 10 * 60 * 1000; // 10 minutes

// @desc    Register user
// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'farmer',
      verificationToken
    });

    // In a real app, send email here
    console.log(`Verification token for ${email}: ${verificationToken}`);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your email.',
      // For demo purposes, we return a token immediately
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return res.status(423).json({ 
        error: `Too many attempts. Account locked. Try again in ${remainingTime} minutes.` 
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      // Increment login attempts
      user.loginAttempts += 1;
      
      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = Date.now() + LOCK_TIME;
        user.loginAttempts = 0; // Reset for after lock expires
      }
      
      await user.save();

      // IMPORTANT: Use generic error message
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Reset attempts on successful login
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({ success: true, message: 'If that email exists, a reset link was sent.' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 mins
    await user.save();

    // In a real app, send email here
    console.log(`Reset token for ${user.email}: ${resetToken}`);

    res.json({ 
      success: true, 
      message: 'If that email exists, a reset link was sent.',
      // Demo:
      resetToken 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc    Verify Email
// @route   GET /api/auth/verify/:token
router.get('/verify/:token', async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
