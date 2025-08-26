import React from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8, mb: 8, textAlign: 'center' }}>
        {/* Hero Section */}
        <Typography variant="h2" component="h1" gutterBottom>
          AI Blog Generator
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Generate high-quality blog posts instantly with the power of AI
        </Typography>
        
        {user ? (
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/dashboard"
            sx={{ mt: 3 }}
          >
            Go to Dashboard
          </Button>
        ) : (
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/register"
              sx={{ mr: 2 }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/login"
            >
              Login
            </Button>
          </Box>
        )}
      </Box>

      {/* Features Section */}
      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                🚀 Fast Generation
              </Typography>
              <Typography>
                Generate comprehensive blog posts in seconds, not hours.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                📝 High Quality
              </Typography>
              <Typography>
                AI-powered content that's engaging, informative, and well-structured.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                💾 Save & Manage
              </Typography>
              <Typography>
                Keep track of all your generated content with our dashboard.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
