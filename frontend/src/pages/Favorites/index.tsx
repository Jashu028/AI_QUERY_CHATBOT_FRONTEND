import React, { useEffect } from "react";
import { Container, Typography, Grid, Paper } from "@mui/material";
import { ProductCard } from "../../components/Product/ProductCard";
import { useFavoritesStore } from "../../store/favoritesStore";

const Favorites = () => {
  const { favorites, fetchFavorites } = useFavoritesStore();

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ my: 4 }}>
        My Favorites
      </Typography>

      {favorites.length === 0 ? (
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" gutterBottom>
            You haven't added any favorites yet
          </Typography>
          <Typography color="text.secondary">
            Browse our products and click the heart icon to add items to your favorites
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {favorites.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.productId}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Favorites;