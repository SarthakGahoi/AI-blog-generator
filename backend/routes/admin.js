const express = require('express');
const User = require('../models/User');
const BlogPost = require('../models/BlogPost');
const { adminAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Admin routes working perfectly!' });
});

// Get usage statistics
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBlogs = await BlogPost.countDocuments();
    
    const totalWords = await BlogPost.aggregate([
      { $group: { _id: null, total: { $sum: '$wordCount' } } }
    ]);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const todayUsers = await User.countDocuments({ 
      createdAt: { $gte: todayStart } 
    });
    
    const todayBlogs = await BlogPost.countDocuments({ 
      createdAt: { $gte: todayStart } 
    });

    res.json({
      total: {
        users: totalUsers,
        blogs: totalBlogs,
        words: totalWords[0]?.total || 0
      },
      today: {
        users: todayUsers,
        blogs: todayBlogs
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ message: 'Server error fetching stats' });
  }
});

// Get recent generations
router.get('/recent-generations', adminAuth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    
    const recentBlogs = await BlogPost.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('title topic wordCount createdAt userId status');

    res.json({ recentGenerations: recentBlogs });
  } catch (error) {
    console.error('Admin recent generations error:', error);
    res.status(500).json({ message: 'Server error fetching recent generations' });
  }
});

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      users,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

// Make user admin (for testing)
router.patch('/make-admin/:userId', adminAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findByIdAndUpdate(
      userId, 
      { isAdmin: true }, 
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User promoted to admin', user });
  } catch (error) {
    console.error('Make admin error:', error);
    res.status(500).json({ message: 'Server error updating user' });
  }
});

module.exports = router;
