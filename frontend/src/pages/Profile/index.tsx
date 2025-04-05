import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
} from '@mui/material';
import { User, Package, CreditCard, Settings } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const Profile = () => {
  const { user } = useAuthStore();

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: 'primary.main',
              fontSize: '2.5rem',
            }}
          >
            {user?.name?.[0]?.toUpperCase() || <User size={40} />}
          </Avatar>
          <Box sx={{ ml: 3 }}>
            <Typography variant="h4">{user?.name || 'User'}</Typography>
            <Typography color="text.secondary">{user?.email}</Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <List>
          <ListItem>
            <Package size={24} />
            <ListItemText
              primary="My Orders"
              secondary="View your order history"
              sx={{ ml: 2 }}
            />
          </ListItem>
          <ListItem>
            <CreditCard size={24} />
            <ListItemText
              primary="Payment Methods"
              secondary="Manage your payment options"
              sx={{ ml: 2 }}
            />
          </ListItem>
          <ListItem>
            <Settings size={24} />
            <ListItemText
              primary="Account Settings"
              secondary="Update your profile and preferences"
              sx={{ ml: 2 }}
            />
          </ListItem>
        </List>

        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
          >
            Edit Profile
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;