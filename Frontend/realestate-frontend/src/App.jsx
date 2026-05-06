import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import './App.css'

import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import Home from './pages/Home'
import PropertyList from './pages/PropertyList'
import PropertyDetail from './pages/PropertyDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import MyFavorites from './pages/buyer/MyFavorites'
import MyVisits from './pages/buyer/MyVisits'
import MyInquiries from './pages/buyer/MyInquiries'
import MyPayments from './pages/buyer/MyPayments'
import MyProperties from './pages/owner/MyProperties'
import AddProperty from './pages/owner/AddProperty'
import PropertyInquiries from './pages/owner/PropertyInquiries'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminProperties from './pages/admin/AdminProperties'
import AdminPayments from './pages/admin/AdminPayments'
import AdminTickets from './pages/admin/AdminTickets'
import AdminVisits from './pages/admin/AdminVisits'
import AdminReviews from './pages/admin/AdminReviews'
import SupportPage from './pages/SupportPage'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth()
  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>
  if (!user) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<PropertyList />} />
        <Route path="/property/:id" element={<PropertyDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/buyer/favorites" element={<ProtectedRoute allowedRoles={['BUYER']}><MyFavorites /></ProtectedRoute>} />
        <Route path="/buyer/visits" element={<ProtectedRoute allowedRoles={['BUYER']}><MyVisits /></ProtectedRoute>} />
        <Route path="/buyer/inquiries" element={<ProtectedRoute allowedRoles={['BUYER']}><MyInquiries /></ProtectedRoute>} />
        <Route path="/buyer/payments" element={<ProtectedRoute allowedRoles={['BUYER']}><MyPayments /></ProtectedRoute>} />
        <Route path="/owner/properties" element={<ProtectedRoute allowedRoles={['OWNER','AGENT','ADMIN']}><MyProperties /></ProtectedRoute>} />
        <Route path="/owner/add-property" element={<ProtectedRoute allowedRoles={['OWNER','AGENT','ADMIN']}><AddProperty /></ProtectedRoute>} />
        <Route path="/owner/inquiries/:propertyId" element={<ProtectedRoute allowedRoles={['OWNER','AGENT','ADMIN']}><PropertyInquiries /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/properties" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminProperties /></ProtectedRoute>} />
        <Route path="/admin/payments" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminPayments /></ProtectedRoute>} />
        <Route path="/admin/tickets" element={<ProtectedRoute allowedRoles={['ADMIN','SUPPORT']}><AdminTickets /></ProtectedRoute>} />
        <Route path="/admin/visits" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminVisits /></ProtectedRoute>} />
        <Route path="/admin/reviews" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminReviews /></ProtectedRoute>} />
        <Route path="/support" element={<ProtectedRoute><SupportPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000, style: { fontFamily: 'var(--font-sans)', borderRadius: '8px' } }} />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
