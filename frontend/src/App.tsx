import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Layout } from './components/Layout/Layout';
import { theme } from './theme';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { useCartStore } from './store/cartStore';


// Lazy load pages
const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Auth/Login'));
const Register = React.lazy(() => import('./pages/Auth/Register'));
const Forgot = React.lazy(() => import('./pages/Auth/Forgot'));
const ForgotPassword = React.lazy(() => import('./pages/Auth/ForgotPassword'));
const VerifyAccount = React.lazy(() => import('./pages/Auth/VerifyAccount'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Cart = React.lazy(() => import('./pages/Cart'));
const Favorites = React.lazy(() => import('./pages/Favorites'));
const ProductPage = React.lazy(()=> import('./pages/Product'));

function App() {

  useEffect(() => {
    const saveCartBeforeUnload = () => {
      useCartStore.getState().fetchCart();
      useCartStore.getState().saveCartToDB();
    };

    window.addEventListener("beforeunload", saveCartBeforeUnload);
    return () => window.removeEventListener("beforeunload", saveCartBeforeUnload);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <React.Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/favorites"
                element={
                  <ProtectedRoute>
                    <Favorites />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/product/:productId"
                element={
                  <ProductPage />
                }
              />
              <Route
                path="/forgot"
                element={
                  <Forgot />
                }
              />
              <Route
                path="/reset-password/:token"
                element={
                  <ForgotPassword />
                }
              />
              <Route
                path="/verify-account/:token"
                element={
                  <VerifyAccount />
                }
              />
            </Routes>
          </React.Suspense>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;