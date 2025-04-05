import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box, IconButton } from '@mui/material';
import { ShoppingCart, Heart, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';

export const Navbar = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const { items } = useCartStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    logout();
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
                {items.length > 0 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      backgroundColor: 'primary.main',
                      color: 'white',
                      borderRadius: '50%',
                      width: 18,
                      height: 18,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                    }}
                  >
                    {items.length}
                  </Box>
                )}
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