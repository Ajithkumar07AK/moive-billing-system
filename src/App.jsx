import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { BookingProvider } from './context/BookingContext.jsx';

import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Movies from './pages/Movies.jsx';
import MovieDetails from './pages/MovieDetails.jsx';
import SelectScreen from './pages/SelectScreen.jsx';
import SelectSeats from './pages/SelectSeats.jsx';
import Payment from './pages/Payment.jsx';
import BookingSuccess from './pages/BookingSuccess.jsx';
import MyBookings from './pages/MyBookings.jsx';
import Help from './pages/Help.jsx';
import NotFound from './pages/NotFound.jsx';

function AppLayout() {
  const location = useLocation();
  // Don't show footer on seat selection or payment for distraction-free checkout
  const hideFooter =
    location.pathname.includes('/select-seats') ||
    location.pathname.includes('/payment');

  return (
    <div className="flex flex-col min-h-screen bg-[#05030f] text-slate-100 selection:bg-indigo-600 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MovieDetails />} />
          <Route path="/movies/:id/select-screen" element={<SelectScreen />} />
          <Route path="/shows/:id/select-seats" element={<SelectSeats />} />
          <Route
            path="/shows/:id/payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking-success"
            element={
              <ProtectedRoute>
                <BookingSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />
          <Route path="/help" element={<Help />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <Router>
          <AppLayout />
        </Router>
      </BookingProvider>
    </AuthProvider>
  );
}
