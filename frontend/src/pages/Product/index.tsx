import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Grid, Typography, Card, CardMedia, CardContent, TextField, Button, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import { Review } from "../../types/product.ts";
import { useProductStore } from "../../store/productStore.ts";

const ProductPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { product, loading, error, fetchProductById } = useProductStore();
  const [newReview, setNewReview] = useState<string>("");
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (productId) {
      fetchProductById(productId); // ✅ Fetch product using Zustand store
    }
  }, [productId, fetchProductById]);

  useEffect(() => {
    if (product) {
      setReviews(product.reviews);
    }
  }, [product]);

  const handleReviewSubmit = async () => {
    if (!newReview.trim()) return;

    try {
      // Demo Simulating review submission
      const newReviewObj: Review = {
        id: Math.random().toString(),
        userId: "current-user-id",
        userName: "You",
        rating: 5,
        comment: newReview,
        createdAt: new Date().toISOString(),
      };

      setReviews([...reviews, newReviewObj]);
      setNewReview(""); // Clear input field
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!product) return <Typography>No product found</Typography>;

  return (
    <motion.div
      initial={{ x: "100vw", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100vw", opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Card sx={{ p: 2 }}>
          <Grid container spacing={3}>
            {/* Product Image (Left) */}
            <Grid item xs={12} md={5}>
              <CardMedia component="img" image={product.image} alt={product.name} sx={{ width: "100%", borderRadius: 2 }} />
            </Grid>

            {/* Product Details (Right) */}
            <Grid item xs={12} md={7}>
              <CardContent>
                <Typography variant="h4" gutterBottom>{product.name}</Typography>
                <Typography variant="h5" color="primary">${product.price}</Typography>
                <Typography variant="body1">Rating: {product.rating} ⭐</Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>{product.description}</Typography>
              </CardContent>
            </Grid>

            {/* Product Reviews (Below) */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 3 }}>Reviews:</Typography>
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <Card key={review.id} sx={{ mt: 2, p: 2 }}>
                    <Typography variant="subtitle1"><strong>{review.userName}</strong> - {new Date(review.createdAt).toLocaleDateString()}</Typography>
                    <Typography variant="body2">Rating: {review.rating} ⭐</Typography>
                    <Typography variant="body1">{review.comment}</Typography>
                  </Card>
                ))
              ) : (
                <Typography>No reviews yet.</Typography>
              )}

              {/* Add Review Input */}
              <TextField
                fullWidth
                label="Write a review..."
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                variant="outlined"
                sx={{ mt: 2 }}
              />
              <Button variant="contained" sx={{ mt: 2 }} onClick={handleReviewSubmit}>Submit Review</Button>
            </Grid>
          </Grid>
        </Card>
      </Container>
    </motion.div>
  );
};

export default ProductPage;
