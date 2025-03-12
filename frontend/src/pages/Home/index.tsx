import React, { useState, useEffect } from "react";
import { Grid, Typography, Container } from "@mui/material";
import { ProductCard } from "../../components/Product/ProductCard";
import {api} from "../../util/axios.ts";
import {Product} from "../../types/product.ts";

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get<Product[]>("/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography variant="h1" sx={{ mb: 4, textAlign: "center" }}>
        Welcome to AI Shop
      </Typography>
      <Typography variant="h2" sx={{ mb: 3 }}>
        Featured Products
      </Typography>

      {loading ? (
        <Typography>Loading products...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.productId}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Home;