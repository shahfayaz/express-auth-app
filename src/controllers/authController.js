const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password_hash: hashedPassword,
    });
    res.status(201).json({ message: 'User registered successfully', userId: user.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const AUTH_EXPIRATION = parseInt(process.env.AUTH_EXPIRATION) || 3600000;
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: AUTH_EXPIRATION / 1000 }); // expiresIn is in seconds

    // Create session
    req.session.userId = user.id;
    req.session.user = user;

    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Could not log out' });
    }
    res.json({ message: 'Logout successful' });
  });
};

exports.getProfile = async (req, res) => {
    // This controller can be used for both JWT and Session auth verification
    // The user object should be attached to req by the middleware
    const user = req.user || req.session.user;
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    // Return safe user data
    res.json({
        id: user.id,
        username: user.username,
        email: user.email
    });
};
