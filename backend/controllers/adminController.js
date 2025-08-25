const User = require('../models/User');
const BlogPost = require('../models/BlogPost');

class AdminController {
  // Get usage statistics
  async getStats(req, res) {
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

      const avgGenerationTime = await BlogPost.aggregate([
        { $group: { _id: null, avg: { $avg: '$generationTime' } } }
      ]);

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
        avgGenerationTime: Math.round(avgGenerationTime[0]?.avg || 0),
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Admin stats error:', error);
      res.status(500).json({ message: 'Server error fetching stats' });
    }
  }

  // Get recent generations
  async getRecentGenerations(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 20;
      
      const recentBlogs = await BlogPost.find()
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('title topic wordCount generationTime createdAt userId status');

      res.json({ recentGenerations: recentBlogs });
    } catch (error) {
      console.error('Admin recent generations error:', error);
      res.status(500).json({ message: 'Server error fetching recent generations' });
    }
  }

  // Get all users
  async getUsers(req, res) {
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
  }
}

module.exports = new AdminController();
