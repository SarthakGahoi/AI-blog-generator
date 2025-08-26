import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: '1px solid #e0e0e0',
        mt: 'auto',
        py: 3,
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          © 2025 AI Blog Generator. Built with ❤️ using React & Node.js
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
          Made for educational purposes • 
          <Link href="https://github.com" target="_blank" rel="noopener" sx={{ ml: 1 }}>
            View Source Code
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
