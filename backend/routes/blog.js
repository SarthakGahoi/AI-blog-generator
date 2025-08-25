const express = require('express');
const BlogPost = require('../models/BlogPost');
const User = require('../models/User');
const openaiService = require('../services/openaiService');
const { auth } = require('../middleware/authMiddleware');

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Blog routes working perfectly!' });
});

// Generate new blog post
router.post('/generate', auth, async (req, res) => {
  try {
    const { topic } = req.body;
    const userId = req.user._id;
    
    if (!topic || topic.trim().length === 0) {
      return res.status(400).json({ message: 'Topic is required' });
    }

    console.log(`📝 Generating blog for topic: ${topic}`);

    // Generate blog post using OpenAI
    const { title, content } = await openaiService.generateBlogPost(topic);

    // Save to database
    const blogPost = new BlogPost({
      title,
      content,
      topic,
      userId,
      status: 'completed'
    });

    await blogPost.save();

    // Update user generation count
    await User.findByIdAndUpdate(userId, {
      $inc: { generationCount: 1 }
    });

    console.log(`✅ Blog generated successfully: ${title}`);

    res.json({
      message: 'Blog post generated successfully',
      blog: {
        id: blogPost._id,
        title: blogPost.title,
        content: blogPost.content,
        topic: blogPost.topic,
        wordCount: blogPost.wordCount,
        createdAt: blogPost.createdAt
      }
    });
  } catch (error) {
    console.error('Blog generation error:', error);
    res.status(500).json({ 
      message: 'Failed to generate blog post',
      error: error.message 
    });
  }
});

// Get user's blog posts
router.get('/my-blogs', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const blogs = await BlogPost.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('title topic wordCount createdAt status');

    const total = await BlogPost.countDocuments({ userId });

    res.json({
      blogs,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get user blogs error:', error);
    res.status(500).json({ message: 'Server error fetching blogs' });
  }
});

// Get specific blog post
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const blog = await BlogPost.findOne({ _id: id, userId });
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.json({ blog });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({ message: 'Server error fetching blog' });
  }
});

// Delete blog post
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const blog = await BlogPost.findOneAndDelete({ _id: id, userId });
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ message: 'Server error deleting blog' });
  }
});

module.exports = router;
