import React from 'react';
import { Grid, Typography, Container } from '@mui/material';
import { ProductCard } from '../../components/Product/ProductCard';

// Temporary mock data until we connect to the backend
const mockProducts = [
  {
    productId: '1',
    name: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    reviews: []
  },
  {
    productId: '2',
    name: 'Smart Watch Pro',
    description: 'Advanced smartwatch with health monitoring features',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviews: []
  },
  {
    productId: '3',
    name: 'Laptop Stand',
    description: 'Ergonomic aluminum laptop stand',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
    rating: 4.2,
    reviews: []
  }
];

const Home = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h1" component="h1" sx={{ mb: 4, textAlign: 'center' }}>
        Welcome to AI Shop
      </Typography>
      <Typography variant="h2" sx={{ mb: 3 }}>
        Featured Products
      </Typography>
      <Grid container spacing={3}>
        {mockProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.productId}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;