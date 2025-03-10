import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box, IconButton } from '@mui/material';
import { ShoppingCart, Heart, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const Navbar = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Button color="inherit" sx={{ fontSize: '1.2rem' }}>
            AI Shop
          </Button>
        </Link>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
              <IconButton
                color="inherit"
                component={Link}
                to="/favorites"
                size="small"
              >
                <Heart size={20} />
              </IconButton>

              <IconButton
                color="inherit"
                component={Link}
                to="/cart"
                size="small"
                sx={{ position: 'relative' }}
              >
                <ShoppingCart size={20} />
              </IconButton>

              <IconButton
                color="inherit"
                component={Link}
                to="/profile"
                size="small"
              >
                <User size={20} />
              </IconButton>

              <IconButton
                color="inherit"
                onClick={handleLogout}
                size="small"
              >
                <LogOut size={20} />
              </IconButton>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};