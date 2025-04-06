import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  IconButton,
  CardMedia
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useAdminStore } from '../../store/adminStore';
import { Product } from '../../types/admin';
// import { Grid } from 'lucide-react';

const ProductPanel = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    productId: '',
    description: '',
    image: '',
    price: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedProduct, setEditedProduct] = useState<Partial<Product>>({});

  const fetchAllProducts = useAdminStore(state => state.fetchAllProducts);
  const addProduct = useAdminStore(state => state.addProduct);
  const updateProduct = useAdminStore(state => state.updateProduct);
  const deleteProduct = useAdminStore(state => state.deleteProduct);

  const fetchProducts = async () => {
    const data = await fetchAllProducts();
    setProducts(data);
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.productId || !newProduct.price) return;

    await addProduct({
      ...newProduct,
      price: parseFloat(newProduct.price)
    });
    setNewProduct({
      name: '',
      productId: '',
      description: '',
      image: '',
      price: ''
    });
    fetchProducts();
  };

  const handleEditProduct = async (id: string) => {
    await updateProduct(id, editedProduct);
    setEditingId(null);
    setEditedProduct({});
    fetchProducts();
  };

  const handleDeleteProduct = async (id: string) => {
    await deleteProduct(id);
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Box>
      <Typography variant="h5">Manage Products</Typography>
      <Box display="flex" gap={2} my={2} flexWrap="wrap">
        <TextField label="Name" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
        <TextField label="Product ID" value={newProduct.productId} onChange={e => setNewProduct({ ...newProduct, productId: e.target.value })} />
        <TextField label="Description" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
        <TextField label="Image URL" value={newProduct.image} onChange={e => setNewProduct({ ...newProduct, image: e.target.value })} />
        <TextField label="Price" type="number" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
        <Button variant="contained" onClick={handleAddProduct}>Add Product</Button>
      </Box>



        <Grid container spacing={2}>
          {products.map(p => (
            <Grid item xs={12} sm={6} md={4} key={p._id}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out", 
                '&:hover': { transform: "scale(1.02)", boxShadow: 3 } 
              }}>
                {editingId === p._id ? (
                  <CardContent>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <TextField
                        label="Name"
                        value={editedProduct.name ?? p.name}
                        onChange={e => setEditedProduct(prev => ({ ...prev, name: e.target.value }))}
                      />
                      <TextField
                        label="Description"
                        value={editedProduct.description ?? p.description}
                        onChange={e => setEditedProduct(prev => ({ ...prev, description: e.target.value }))}
                      />
                      <TextField
                        label="Price"
                        type="number"
                        value={editedProduct.price ?? p.price}
                        onChange={e => setEditedProduct(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                      />
                      <TextField
                        label="Image URL"
                        value={editedProduct.image ?? p.image}
                        onChange={e => setEditedProduct(prev => ({ ...prev, image: e.target.value }))}
                      />
                      <Button variant="contained" onClick={() => handleEditProduct(p._id)}>Save</Button>
                    </Box>
                  </CardContent>
                ) : (
                  <>
                    {p.image && (
                      <CardMedia
                        component="img"
                        image={p.image}
                        alt={p.name}
                        sx={{
                          height: 200,
                          objectFit: "cover",
                          borderTopLeftRadius: 4,
                          borderTopRightRadius: 4
                        }}
                      />
                    )}
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6">{p.name}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {p.description}
                      </Typography>
                      <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                        ${p.price}
                      </Typography>
                      <Box display="flex" gap={1}>
                        <IconButton onClick={() => { setEditingId(p._id); setEditedProduct(p); }}><Edit /></IconButton>
                        <IconButton onClick={() => handleDeleteProduct(p._id)}><Delete /></IconButton>
                      </Box>
                    </CardContent>
                  </>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
    </Box>
  );
};

export default ProductPanel;
