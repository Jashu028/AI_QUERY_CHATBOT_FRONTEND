import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Typography, Container, CircularProgress, Box } from '@mui/material';
import { api } from '../../util/axios';

const VerifyAccount = () => {
  const { token } = useParams<{ token: string }>();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const from = '/login';

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await api.get(`/verify-account/${token}`);
        setTimeout(() => navigate(from, { replace: true }), 1500);
        setMessage(res.data.message);
      } catch (err: any) {
        setMessage(err.response?.data?.message || "Verification failed");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        {loading ? <CircularProgress /> : (
          <Typography variant="h5" color="primary">
            {message}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default VerifyAccount;
