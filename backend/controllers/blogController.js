const BlogPost = require('../models/BlogPost');
const User = require('../models/User');
const openaiService = require('../services/openaiService');

class BlogController {
  // Generate new blog post
  async generateBlog(req, res) {
    try {
      const { topic } = req.body;
      const userId = req.user._id;
      
      if (!topic || topic.trim().length === 0) {
        return res.status(400).json({ message: 'Topic is required' });
      }

      // Set up SSE headers
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
      });

      const startTime = Date.now();
      
      try {
        // Generate blog post with streaming
        const fullContent = await openaiService.generateBlogPost(topic, res);
        const generationTime = Date.now() - startTime;

        // Extract title from content (first line or heading)
        const lines = fullContent.split('\n').filter(line => line.trim());
        const title = lines[0]?.replace(/^#+\s*/, '') || topic;

        // Save to database
        const blogPost = new BlogPost({
          title,
          content: fullContent,
          topic,
          userId,
          generationTime,
          status: 'completed'
        });

        await blogPost.save();

        // Update user generation count
        await User.findByIdAndUpdate(userId, {
          $inc: { generationCount: 1 }
        });

        // Send final data
        res.write(`data: ${JSON.stringify({ 
          type: 'saved', 
          postId: blogPost._id,
          title,
          generationTime 
        })}\n\n`);

      } catch (error) {
        console.error('Generation error:', error);
        res.write(`data: ${JSON.stringify({ 
          type: 'error', 
          message: 'Failed to generate blog post' 
        })}\n\n`);
      }

      res.end();
    } catch (error) {
      console.error('Blog generation error:', error);
      res.status(500).json({ message: 'Server error during blog generation' });
    }
  }

  // Get user's blog posts
  async getUserBlogs(req, res) {
    try {
      const userId = req.user._id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const blogs = await BlogPost.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('title topic wordCount createdAt generationTime status');

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
  }

  // Get specific blog post
  async getBlog(req, res) {
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
  }

  // Delete blog post
  async deleteBlog(req, res) {
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
  }
}

module.exports = new BlogController();
