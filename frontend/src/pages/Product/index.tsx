import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Grid, Typography, Card, CardMedia, CardContent, TextField, Button, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import { Review } from "../../types/product.ts";
import { useProductStore } from "../../store/productStore.ts";
import { ShoppingCart, Heart } from "lucide-react";
import { useCartStore } from "../../store/cartStore.ts";
import { useAuthStore } from "../../store/authStore.ts";
import { useFavoritesStore } from "../../store/favoritesStore.ts";
import { api } from "../../util/axios.ts";

const ProductPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { product, loading, error, fetchProductById } = useProductStore();
  const [newReview, setNewReview] = useState<string>("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem, items } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { toggleFavorite } = useFavoritesStore();

  useEffect(() => {
    if (productId) {
      fetchProductById(productId);
    }
  }, [productId]);

  useEffect(() => {
    if(product?.productId == productId && product?.favourite){
      setIsFavorite(true);
    }
    },[product, productId]);
  
  useEffect(() => {
    setAddedToCart(items.some((cart) => cart.productId === productId ));
  },[items, productId]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get(`/products/review/${productId}`);
  
        if (response.status === 200) {
          const fetchedReviews: Review[] = response.data.reviews;
  
          setReviews(fetchedReviews);
        }
      } catch (err: any) {
        console.error("Error fetching reviews:", err.response?.data || err.message);
      }
    };
  
    fetchReviews();
  }, [productId]);
  


  const handleAddToCart = () => {
    if(product){
      addItem(product);
    }
  };

  const handleToggleFavorite = () => {
    if(product){
      setIsFavorite(!isFavorite);
      toggleFavorite(product);
    }
  };

  const handleReviewSubmit = async () => {
    if (!newReview.trim()) return;
  
    try {
      const response = await api.post(`/products/review/${productId}`, {
        rating: 5,
        comment: newReview,
      });
  
      if (response.status === 201) {
        const addedReview : Review = response.data.reviews;
  
        setReviews((reviews) => [
          ...reviews,
          addedReview
        ]);
        
        setNewReview("");
      }
    } catch (err : any) {
      console.error("Error submitting review:", err.response?.data || err.message);
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
            
            <Grid item xs={12} md={5}>
              <CardMedia component="img" image={product.image} alt={product.name} sx={{ width: "100%", borderRadius: 2 }} />
            </Grid>

            
            <Grid item xs={12} md={7}>
              <CardContent>
                <Typography variant="h4" gutterBottom>{product.name}</Typography>
                <Typography variant="h5" color="primary">${product.price}</Typography>
                <Typography variant="body1">Rating: {product.rating} ⭐</Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>{product.description}</Typography>

                
                <Typography sx={{ display: 'flex', gap: 2, mt: 3 }}>
                  <Button
                    variant="contained"
                    startIcon={<ShoppingCart size={20} />}
                    fullWidth
                    onClick={handleAddToCart}
                    disabled={!isAuthenticated || addedToCart}
                    sx={{
                      borderRadius: 2,
                      paddingY: 1.2,
                      fontSize: "1rem",
                      fontWeight: "bold",
                      transition: "0.3s",
                    }}
                  >
                    {!isAuthenticated ? "Add to Cart" : addedToCart ? "Added to Cart" : "Add to Cart"}
                  </Button>

                  {isAuthenticated && (
                    <Button
                      onClick={handleToggleFavorite}
                      variant="outlined"
                      sx={{
                        minWidth: 'auto' }}
                    >
                      <Heart size={22} color={isFavorite ? "red" : "grey"} fill={isFavorite ? "red" : "none"} />
                    </Button>
                  )}
                </Typography>
              </CardContent>
            </Grid>


            
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 3 }}>Reviews:</Typography>
              {reviews.length > 0 ? (
                reviews
                .map((review) => (
                  <Card key={review.id} sx={{ mt: 2, p: 2 }}>
                    <Typography variant="subtitle1"><strong>{review.userName}</strong> - {new Date(review.createdAt).toLocaleDateString()}</Typography>
                    <Typography variant="body2">Rating: {review.rating} ⭐</Typography>
                    <Typography variant="body1">{review.comment}</Typography>
                  </Card>
                ))
              ) : (
                <Typography>No reviews yet.</Typography>
              )}

              
              <TextField
                fullWidth
                label="Write a review..."
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                variant="outlined"
                sx={{ mt: 2 }}
              />
              <Button variant="contained" sx={{ mt: 2 }} disabled={!isAuthenticated} onClick={handleReviewSubmit}>Submit Review</Button>
            </Grid>
          </Grid>
        </Card>
      </Container>
    </motion.div>
  );
};

export default ProductPage;
