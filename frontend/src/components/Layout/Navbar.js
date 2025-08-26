import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Container,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar sx={{ px: { xs: 0, sm: 0 } }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link 
              to="/" 
              style={{ 
                textDecoration: 'none', 
                color: 'inherit' 
              }}
            >
              {process.env.REACT_APP_APP_NAME || 'AI Blog Generator'}
            </Link>
          </Typography>

          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button 
                color="inherit" 
                component={Link} 
                to="/dashboard"
                sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
              >
                Dashboard
              </Button>
              {isAdmin && (
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/admin"
                  sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                >
                  Admin
                </Button>
              )}
              <Avatar
                sx={{ 
                  ml: 1, 
                  cursor: 'pointer',
                  width: 32,
                  height: 32,
                  fontSize: '0.875rem'
                }}
                onClick={handleMenu}
              >
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem disabled>
                  <Box>
                    <Typography variant="subtitle2">{user.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>
                </MenuItem>
                <MenuItem onClick={handleClose} component={Link} to="/dashboard">
                  Dashboard
                </MenuItem>
                {isAdmin && (
                  <MenuItem onClick={handleClose} component={Link} to="/admin">
                    Admin Panel
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
