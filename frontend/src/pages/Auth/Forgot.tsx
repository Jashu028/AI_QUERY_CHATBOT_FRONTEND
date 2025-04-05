import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
} from '@mui/material';
import { api } from '../../util/axios';

const Forget = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
        const response = await api.post('/forget-password', { email });
      if (response.status === 200) {
        setMessage(response.data.message || 'Reset link sent!');
      } else {
        setError(response.data.error || 'Something went wrong!');
      }
    } catch (err: any) {
        setError(err.response?.data?.message || 'An unexpected error occurred');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom textAlign="center">
          Reset Password
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        {error && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                {error}
            </Typography>
        )}
        {message && (
            <Typography color="success.main" variant="body2" sx={{ mt: 2 }}>
                {message}
            </Typography>
        )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{ mt: 3 }}
          >
            Send Reset Link
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Forget;
