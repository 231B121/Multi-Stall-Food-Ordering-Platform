const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, mobile, email, password, referralCode } = req.body;

    if (!name || !mobile || !password) {
      return res.status(400).json({
        error: 'Name, mobile, and password are required',
      });
    }

    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      return res.status(409).json({
        error: 'User with this mobile already exists',
      });
    }

    let referredByUser = null;
    if (referralCode) {
      referredByUser = await User.findOne({ referralCode });
      if (!referredByUser) {
        return res.status(400).json({
          error: 'Invalid referral code',
        });
      }
    }

    const user = new User({
      name,
      mobile,
      email,
      password,
      referredBy: referredByUser ? referredByUser._id : null,
    });

    await user.save();

    const tokens = generateTokens(user);

    res.status(201).json({
      message: 'User registered successfully',
      user: user.toJSON(),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
    });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({
      error: error.message || 'Registration failed',
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
      return res.status(400).json({
        error: 'Mobile and password are required',
      });
    }

    const user = await User.findOne({ mobile }).select('+password');
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid credentials',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        error: 'Account is deactivated',
      });
    }

    const tokens = generateTokens(user);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: 'Login successful',
      user: user.toJSON(),
      accessToken: tokens.accessToken,
      expiresIn: tokens.expiresIn,
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({
      error: error.message || 'Login failed',
    });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        error: 'Refresh token not found',
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        error: 'User not found or account is deactivated',
      });
    }

    const tokens = generateTokens(user);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken: tokens.accessToken,
      expiresIn: tokens.expiresIn,
    });
  } catch (error) {
    console.error('Refresh token error:', error.message);
    res.status(401).json({
      error: 'Invalid refresh token',
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    res.json({
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || 'Failed to fetch user',
    });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('refreshToken');
  res.json({
    message: 'Logged out successfully',
  });
};

function generateTokens(user) {
  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return {
    accessToken,
    refreshToken,
    expiresIn: 3600,
  };
}