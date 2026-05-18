import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import { useAuth } from './context/AuthContext'


// Auth
import Login from './pages/auth/Login'

// Layout
import Layout from './components/layout/Layout'

// Pages
import Dashboard from './pages/dashboard/Dashboard'
import Subscriptions from './pages/subscriptions/Subscriptions'
import Statistics from './pages/statistics/Statistics'
import Users from './pages/users/Users'
import ActivitiesIndex from './pages/activities/ActivitiesIndex'
import ActivityCreate from './pages/activities/ActivityCreate'
import ActivityEdit from './pages/activities/ActivityEdit'
import PacksIndex from './pages/packs/PacksIndex'
import PackCreate from './pages/packs/PackCreate'
import PackEdit from './pages/packs/PackEdit'
import Payments from './pages/Payments'
import Coupons from './pages/Coupons'
import Settings from './pages/Settings'

// Errors
import NotFound from './pages/errors/NotFound'
import AccessDenied from './pages/errors/AccessDenied'
import ServerError from './pages/errors/ServerError'
import Maintenance from './pages/errors/Maintenance'



function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      </div>
    )
  }

  return token ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
     
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="users" element={<Users />} />
          <Route path="activities" element={<ActivitiesIndex />} />
          <Route path="activities/create" element={<ActivityCreate />} />
          <Route path="activities/:id/edit" element={<ActivityEdit />} />
          <Route path="packs" element={<PacksIndex />} />
          <Route path="packs/create" element={<PackCreate />} />
          <Route path="packs/:id/edit" element={<PackEdit />} />
          <Route path="payments" element={<Payments />} />
          <Route path="coupons" element={<Coupons />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="/403" element={<AccessDenied />} />
        <Route path="/500" element={<ServerError />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}