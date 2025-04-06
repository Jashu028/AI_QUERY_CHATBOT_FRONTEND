import React from 'react';
import { Box, Container } from '@mui/material';
import { Navbar } from './Navbar';
import { Chatbot } from '../ChatBot/Chatbot';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container component="main" sx={{ flex: 1, py: 4 }}>
        {children}
      </Container>
      {!isAdminPath && <Chatbot />}
    </Box>
  );
};