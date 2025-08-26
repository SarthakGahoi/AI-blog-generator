import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { blogAPI } from '../services/api';
import LoadingSpinner from '../components/Layout/LoadingSpinner';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [topic, setTopic] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedBlog, setGeneratedBlog] = useState(null);
  const [myBlogs, setMyBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New state for blog detail modal
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [blogDetailOpen, setBlogDetailOpen] = useState(false);

  // Load user's blogs when component mounts
  useEffect(() => {
    loadMyBlogs();
  }, []);

  const loadMyBlogs = async () => {
    try {
      const response = await blogAPI.getMyBlogs();
      setMyBlogs(response.data.blogs);
    } catch (error) {
      toast.error('Failed to load your blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setGenerating(true);
    try {
      const response = await blogAPI.generate(topic);
      setGeneratedBlog(response.data.blog);
      setTopic('');
      toast.success('Blog generated successfully!');
      // Reload blogs list
      loadMyBlogs();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to generate blog';
      toast.error(message);
    } finally {
      setGenerating(false);
    }
  };

  // New function to handle view blog
  const handleViewBlog = async (blogId) => {
    try {
      const response = await blogAPI.getBlog(blogId);
      setSelectedBlog(response.data.blog);
      setBlogDetailOpen(true);
    } catch (error) {
      toast.error('Failed to load blog details');
    }
  };

  // New function to close modal
  const handleCloseModal = () => {
    setBlogDetailOpen(false);
    setSelectedBlog(null);
  };

  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard!');
  };

  const downloadBlog = (blog) => {
    const element = document.createElement('a');
    const file = new Blob([blog.content], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${blog.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Welcome Section */}
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.name}! 👋
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        You've generated {user?.generationCount || 0} blog posts so far.
      </Typography>

      <Grid container spacing={4}>
        {/* Blog Generator Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Generate New Blog Post
            </Typography>
            
            <form onSubmit={handleGenerate}>
              <TextField
                fullWidth
                label="Blog Topic or Headline"
                placeholder="e.g., The Future of Artificial Intelligence"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                margin="normal"
                multiline
                rows={3}
                disabled={generating}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={generating}
                sx={{ mt: 2 }}
              >
                {generating ? 'Generating...' : 'Generate Blog Post'}
              </Button>
            </form>

            {generating && (
              <Box sx={{ mt: 2 }}>
                <LoadingSpinner message="AI is writing your blog post..." />
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Generated Blog Preview */}
        <Grid item xs={12} md={6}>
          {generatedBlog && (
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                ✨ Latest Generated Blog
              </Typography>
              
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {generatedBlog.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Topic: {generatedBlog.topic}
                  </Typography>
                  <Chip 
                    label={`${generatedBlog.wordCount} words`} 
                    size="small" 
                    sx={{ mt: 1 }}
                  />
                </CardContent>
                <CardActions>
                  <Button 
                    size="small"
                    onClick={() => copyToClipboard(generatedBlog.content)}
                  >
                    Copy
                  </Button>
                  <Button 
                    size="small"
                    onClick={() => downloadBlog(generatedBlog)}
                  >
                    Download
                  </Button>
                </CardActions>
              </Card>
            </Paper>
          )}
        </Grid>

        {/* My Blogs Section */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              My Blog Posts ({myBlogs.length})
            </Typography>
            
            {myBlogs.length === 0 ? (
              <Alert severity="info">
                No blog posts yet. Generate your first one above!
              </Alert>
            ) : (
              <Grid container spacing={2}>
                {myBlogs.map((blog) => (
                  <Grid item xs={12} md={6} lg={4} key={blog._id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom noWrap>
                          {blog.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {blog.topic}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          <Chip 
                            label={`${blog.wordCount} words`} 
                            size="small" 
                          />
                          <Chip 
                            label={new Date(blog.createdAt).toLocaleDateString()} 
                            size="small" 
                            variant="outlined"
                          />
                        </Box>
                      </CardContent>
                      <CardActions>
                        <Button 
                          size="small"
                          onClick={() => handleViewBlog(blog._id)}
                        >
                          View
                        </Button>
                        <Button 
                          size="small"
                          onClick={() => downloadBlog(blog)}
                        >
                          Download
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Blog Detail Modal */}
      <Dialog
        open={blogDetailOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { minHeight: '70vh' }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              {selectedBlog?.title}
            </Typography>
            <IconButton onClick={handleCloseModal} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedBlog && (
            <Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Topic: {selectedBlog.topic}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Chip label={`${selectedBlog.wordCount} words`} size="small" />
                  <Chip 
                    label={new Date(selectedBlog.createdAt).toLocaleString()} 
                    size="small" 
                    variant="outlined"
                  />
                </Box>
              </Box>
              
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography
                  component="pre"
                  sx={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    fontFamily: 'inherit',
                    margin: 0
                  }}
                >
                  {selectedBlog.content}
                </Typography>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => copyToClipboard(selectedBlog?.content || '')}
            variant="outlined"
          >
            Copy Content
          </Button>
          <Button 
            onClick={() => downloadBlog(selectedBlog)}
            variant="contained"
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;
