import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Box,
  Button,
  Grid,
} from '@mui/material';
import { useAdminStore } from '../../store/adminStore';
import { Order } from '../../types/admin';

const OrderPanel = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [updatedOrders, setUpdatedOrders] = useState<Record<string, Partial<Order>>>({});
  const fetchAllOrders = useAdminStore(state => state.fetchAllOrders);
  const updateOrderStatus = useAdminStore(state => state.updateOrderStatus);

  const fetchOrders = async () => {
    const data = await fetchAllOrders();
    setOrders(data);
    console.log(data);
    const updates: Record<string, Partial<Order>> = {};
    data.forEach(order => {
      updates[order._id] = {
        orderStatus: order.orderStatus,
        returnStatus: order.returnStatus,
      };
    });
    setUpdatedOrders(updates);
  };

  const handleChange = (orderId: string, field: keyof Order, value: string) => {
    setUpdatedOrders(prev => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [field]: value,
      },
    }));
  };

  const handleUpdate = async (orderId: string) => {
    await updateOrderStatus(orderId, updatedOrders[orderId]);
    fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Manage Orders</Typography>
      {orders.map(order => (
        <Card key={order._id} sx={{ mb: 3 }}>
          <CardContent>
            <Typography><strong>Order ID:</strong> {order.orderId}</Typography>
            <Typography><strong>Status:</strong> {order.orderStatus}</Typography>
            <Typography><strong>Return Status:</strong> {order.returnStatus}</Typography>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  select
                  label="Order Status"
                  value={updatedOrders[order._id]?.orderStatus || ''}
                  onChange={e => handleChange(order._id, 'orderStatus', e.target.value)}
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Confirmed">Confirmed</MenuItem>
                  <MenuItem value="Shipped">Shipped</MenuItem>
                  <MenuItem value="Delivered">Delivered</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={5}>
                <TextField
                  fullWidth
                  select
                  label="Return Status"
                  value={updatedOrders[order._id]?.returnStatus || ''}
                  onChange={e => handleChange(order._id, 'returnStatus', e.target.value)}
                >
                  <MenuItem value="Not Requested">Not Requested</MenuItem>
                  <MenuItem value="Requested">Requested</MenuItem>
                  <MenuItem value="Approved">Approved</MenuItem>
                  <MenuItem value="Rejected">Rejected</MenuItem>
                  <MenuItem value="Processed">Processed</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={3} display="flex" alignItems="center">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleUpdate(order._id)}
                  fullWidth
                >
                  Update
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default OrderPanel;
