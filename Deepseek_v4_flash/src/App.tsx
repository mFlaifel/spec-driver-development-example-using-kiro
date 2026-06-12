import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './locales/i18n';
import MainLayout from './components/MainLayout';
import { Loading } from './components/Loading';
import { initializeMockData } from './services/mockService';

const HomePage = lazy(() => import('./components/HomePage'));
const ProductsPage = lazy(() => import('./components/ProductsPage'));
const ProductDetailPage = lazy(() => import('./components/ProductDetailPage'));
const CartPage = lazy(() => import('./components/CartPage'));
const CheckoutPage = lazy(() => import('./components/CheckoutPage'));
const OrderConfirmation = lazy(() => import('./components/OrderConfirmation'));
const NotFoundPage = lazy(() => import('./components/NotFoundPage'));

export default function App() {
  useEffect(() => {
    initializeMockData();
  }, []);

  return (
    <BrowserRouter>
      <MainLayout>
        <Suspense fallback={<Loading size="large" />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </MainLayout>
    </BrowserRouter>
  );
}
