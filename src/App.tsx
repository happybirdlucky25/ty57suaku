import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import './App.css'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<LoginPage />} />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute requiredRoles={['free', 'paid']}>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Placeholder routes for future development */}
        <Route path="/bill/:id" element={<div>Bill Detail Page - Coming Soon</div>} />
        <Route path="/campaigns" element={
          <ProtectedRoute requiredRoles={['paid']}>
            <div>Campaigns Page - Coming Soon</div>
          </ProtectedRoute>
        } />
        <Route path="/campaign/:id" element={
          <ProtectedRoute requiredRoles={['paid']}>
            <div>Campaign Workspace - Coming Soon</div>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute requiredRoles={['free', 'paid']}>
            <div>Profile Page - Coming Soon</div>
          </ProtectedRoute>
        } />
        <Route path="/pricing" element={<div>Pricing Page - Coming Soon</div>} />
        
        {/* 404 Route */}
        <Route path="*" element={<div className="text-center">Page not found</div>} />
      </Routes>
    </Layout>
  )
}

export default App