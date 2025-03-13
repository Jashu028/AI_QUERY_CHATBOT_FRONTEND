import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Rating, Button, Box } from '@mui/material';
import { ShoppingCart, Heart } from 'lucide-react';
import { Product } from '../../types/product';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useFavoritesStore } from '../../store/favoritesStore';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { toggleFavorite, favorites } = useFavoritesStore();
  
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(favorites.some((fav) => fav.productId === product.productId));
  }, [favorites, product.productId]);

  const handleAddToCart = () => {
    addItem(product);
  };

  const handleToggleFavorite = () => {
    toggleFavorite(product);
  };
  
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={product.image}
        alt={product.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {product.description}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={product.rating} precision={0.5} readOnly />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({product.rating})
          </Typography>
        </Box>
        <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
          ${product.price.toFixed(2)}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<ShoppingCart size={20} />}
            fullWidth
            onClick={handleAddToCart}
            disabled={!isAuthenticated}
          >
            Add to Cart
          </Button>
          {isAuthenticated && (
            <Button onClick={handleToggleFavorite}
              variant="outlined"
              sx={{ minWidth: 'auto' }}
            >
              <Heart size={20} color={isFavorite ? "red" : "grey"} fill={isFavorite ? "red" : "none"} />
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};