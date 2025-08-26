import React from 'react';
import { Container, Typography, Button, Box, Alert } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
          <Box textAlign="center">
            <Typography variant="h4" gutterBottom>
              Oops! Something went wrong 😕
            </Typography>
            <Alert severity="error" sx={{ mb: 3 }}>
              <Typography variant="body1">
                The application encountered an unexpected error. Please try refreshing the page.
              </Typography>
            </Alert>
            <Button 
              variant="contained" 
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
