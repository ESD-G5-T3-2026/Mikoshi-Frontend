import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Route, Routes } from 'react-router-dom'
import DashboardPage from '../pages/Dashboard'
import LoginPage from '../pages/Login'
import { showToast } from '../store/toast'

function ProtectedRoute({ sessionChecked, children }) {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)

  useEffect(() => {
    if (sessionChecked && !user) {
      dispatch(showToast('Please log in to access dashboard.', 'error'))
    }
  }, [dispatch, sessionChecked, user])

  if (!sessionChecked) {
    return null
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  return children
}

function PublicOnlyRoute({ sessionChecked, children }) {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)

  useEffect(() => {
    if (sessionChecked && user) {
      dispatch(showToast('Logout to go back to login page', 'error'))
    }
  }, [dispatch, sessionChecked, user])

  if (!sessionChecked) {
    return null
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function AppRoutes({ sessionChecked }) {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicOnlyRoute sessionChecked={sessionChecked}>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute sessionChecked={sessionChecked}>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
