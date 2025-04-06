import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Divider,
  IconButton,
  Grid,
  Alert,
} from '@mui/material';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { api } from '../../util/axios';
import { useState } from 'react';

const Cart = () => {
  const { items, removeItem, updateQuantity, fetchCart, total } = useCartStore();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const orderItems = items.map(item => ({
    productId: item.productId,
    quantity: item.quantity,
    price: item.price,
  }));

  const placeOrder = async () => {
    try {
      const Order = {
        items: orderItems,
        totalAmount: total,
      };
  
      const response = await api.post("/products/order", Order);
      if (response.status === 201) {
        console.log("Order placed!");
        setMessage(response.data.message);
        fetchCart();
      }
    } catch (error: any) {
      setError(error.response?.data?.error);
      console.error("Failed to place order", error);
    }
  };
  

  const handleUpdateQuantity = (productId: string, currentQuantity: number, delta: number) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    }
  };

  if (items.length === 0) {
    return (
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: 'center' }}>
        {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
        )}
        {message && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {message}
            </Alert>
        )}
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Button variant="contained" color="primary" href="/" sx={{ mt: 2 }}>
            Continue Shopping
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
        Shopping Cart
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2 }}>
            {items.map((item) => (
              <Box key={item.productId}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={3}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: '8px',
                      }}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <Typography variant="h6">{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      ${item.price.toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity, -1)}
                      >
                        <Minus size={16} />
                      </IconButton>
                      <Typography>{item.quantity}</Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity, 1)}
                      >
                        <Plus size={16} />
                      </IconButton>
                    </Box>
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton
                      color="error"
                      onClick={() => removeItem(item.productId)}
                    >
                      <Trash2 size={20} />
                    </IconButton>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 2 }} />
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Box sx={{ my: 2 }}>
              <Grid container justifyContent="space-between">
                <Typography>Subtotal</Typography>
                <Typography>${total.toFixed(2)}</Typography>
              </Grid>
              <Grid container justifyContent="space-between">
                <Typography>Shipping</Typography>
                <Typography>Free</Typography>
              </Grid>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Grid container justifyContent="space-between">
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">${total.toFixed(2)}</Typography>
            </Grid>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={placeOrder}
              size="large"
              sx={{ mt: 3 }}
            >
              Place Order
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart;