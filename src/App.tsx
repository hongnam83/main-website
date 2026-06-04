/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import BackToTop from './components/BackToTop';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import FAQPage from './pages/FAQPage';
import FloatingContact from './components/FloatingContact';
import { ShippingPolicyPage, ReturnPolicyPage, PrivacyPolicyPage, ShoppingGuidePage, OrderTrackingPage } from './pages/SupportPages';
import AdminPage from './pages/AdminPage';
import { SiteSettingsProvider } from './contexts/SiteSettingsContext';

export default function App() {
  return (
    <SiteSettingsProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={
            <div className="min-h-screen bg-brand-50 selection:bg-brand-200 selection:text-brand-900 font-sans flex flex-col">
              <Header />
              <div className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:id" element={<BlogDetailPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
                  <Route path="/return-policy" element={<ReturnPolicyPage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="/shopping-guide" element={<ShoppingGuidePage />} />
                  <Route path="/order-tracking" element={<OrderTrackingPage />} />
                </Routes>
              </div>
              <FloatingContact />
              <BackToTop />
              <Footer />
            </div>
          } />
        </Routes>
      </Router>
    </SiteSettingsProvider>
  );
}
