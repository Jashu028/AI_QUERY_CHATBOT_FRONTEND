import { useEffect, useState } from 'react';
import { Button, Typography, Box } from '@mui/material';
import OrdersPanel from './Orders';
import ProductsPanel from './Products';
import { useAdminStore } from '../../store/adminStore';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const { admin, fetchAdmin } = useAdminStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdmin()
  },[fetchAdmin]);

  if (!isAuthenticated) {
    navigate('/',{replace: true});
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Hi, {admin?.name || 'Admin'}
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button
          variant={activeTab === 'orders' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </Button>
        <Button
          variant={activeTab === 'products' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('products')}
        >
          Products
        </Button>
      </Box>

      {activeTab === 'orders' ? <OrdersPanel /> : <ProductsPanel />}
    </Box>
  );
};

export default AdminDashboard;
