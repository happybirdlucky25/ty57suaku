import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { SearchPage } from './pages/SearchPage'
import { LandingPage } from './pages/LandingPage'
import { AdminPage } from './pages/AdminPage'
import { BillDetailPage } from './pages/BillDetailPage'
import { CampaignsPage } from './pages/CampaignsPage'
import { ProfilePage } from './pages/ProfilePage'
import { PricingPage } from './pages/PricingPage'
import './App.css'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<LoginPage />} />
        <Route path="/admin" element={
          <ProtectedRoute requiredRoles={['free', 'paid']}>
            <AdminPage />
          </ProtectedRoute>
        } />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute requiredRoles={['free', 'paid']}>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Functional pages */}
        <Route path="/bill/:billId" element={<BillDetailPage />} />
        <Route path="/campaigns" element={
          <ProtectedRoute requiredRoles={['free', 'paid']}>
            <CampaignsPage />
          </ProtectedRoute>
        } />
        <Route path="/campaign/:id" element={
          <ProtectedRoute requiredRoles={['paid']}>
            <div>Campaign Workspace - Coming Soon</div>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute requiredRoles={['free', 'paid']}>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/pricing" element={<PricingPage />} />
        
        {/* 404 Route */}
        <Route path="*" element={<div className="text-center">Page not found</div>} />
      </Routes>
    </Layout>
  )
}

export default App