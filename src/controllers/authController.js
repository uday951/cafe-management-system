import User from '../models/User.js';
import Business from '../models/Business.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });
};

export const register = async (req, res) => {
  try {
    const { email, password, businessName, businessType, phone, address } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create new owner user
    const user = await User.create({
      email,
      passwordHash,
      role: 'owner',
      name: req.body.name || email.split('@')[0], // Fallback to email prefix
      phone,
    });

    if (user) {
      // Create business
      const business = await Business.create({
        ownerId: user._id,
        name: businessName,
        businessType: businessType || 'restaurant', // Default fallback
        email,
        phone,
        address,
      });

      // Link business to user
      user.businessId = business._id;
      await user.save();

      res.status(201).json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          businessId: user.businessId,
        },
        token: generateToken(user._id),
        businessId: business._id
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      res.json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          businessId: user.businessId,
        },
        token: generateToken(user._id),
        businessId: user.businessId,
        role: user.role
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const logout = async (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
};

export const verify = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    if (user) {
      res.json({ user, businessId: user.businessId });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  // Implementation stub for email sender
  res.status(200).json({ message: 'Reset link sent if email exists' });
};
