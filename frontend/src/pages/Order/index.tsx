import {
  Container,
  Typography,
  Paper,
  Box,
  Divider,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useOrderStore } from '../../store/orderStore';

const MyOrders = () => {
  const { orders, loading, error, fetchOrders, returnOrder } = useOrderStore();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [reason, setReason] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleReturnClick = (orderId: string) => {
    setSelectedOrder(orderId);
    setOpenDialog(true);
  };

  const submitReturn = async () => {
    if (selectedOrder) {
      await returnOrder(selectedOrder, reason);
      setOpenDialog(false);
      setReason('');
      setSelectedOrder(null);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>No Orders Found</Typography>
          <Typography variant="body2">Looks like you haven’t placed any orders yet.</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>My Orders</Typography>

      {orders.map((order) => (
        <Paper key={order._id} elevation={3} sx={{ p: 3, mb: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Order ID: {order.orderId}</Typography>
            <Chip
              label={
                order.returnRequested
                  ? `Return: ${order.returnStatus}`
                  : order.orderStatus
              }
              color={order.returnRequested ? 'warning' : 'primary'}
              variant="outlined"
            />
          </Box>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Placed on: {new Date(order.createdAt).toLocaleString()}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {order.products.map((prod, index) => (
            <Box key={index} mb={2}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={2}>
                  <img
                    src={prod.image}
                    alt={prod.name}
                    style={{ width: '100%', borderRadius: 8 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">{prod.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Price: ${prod.amount.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography>Qty: {prod.quantity}</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography>
                    Total: ${(prod.amount * prod.quantity).toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
              <Divider sx={{ mt: 1, mb: 1 }} />
            </Box>
          ))}

          <Box display="flex" justifyContent="space-between" mt={2}>
            <Typography variant="subtitle1">Order Total:</Typography>
            <Typography variant="subtitle1">${order.totalAmount.toFixed(2)}</Typography>
          </Box>

          {['Pending', 'Confirmed'].includes(order.orderStatus) && !order.returnRequested && (
            <Box mt={2}>
              <Button variant="outlined" color="error" onClick={() => handleReturnClick(order.orderId)}>
                Request Return
              </Button>
            </Box>
          )}
        </Paper>
      ))}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth
  maxWidth="sm">
        <DialogTitle>Return Order</DialogTitle>
        <DialogContent>
          <TextField
            label="Reason for Return"
            fullWidth
            multiline
            minRows={3}
            sx={{ mt: 2 }}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={submitReturn} color="primary">Submit</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyOrders;
