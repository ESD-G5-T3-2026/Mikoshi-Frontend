import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Route, Routes } from 'react-router-dom'
import DashboardPage from '../pages/Dashboard'
import LoginPage from '../pages/Login'
import MeetingPage from '../pages/Meeting'
import InsightsPage from '../pages/Insights'
import PersonnelPage from '../pages/Personnel'
import { showToast } from '../store/toast'

function ProtectedRoute({ sessionChecked, children }) {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const lastAuthEvent = useSelector((state) => state.auth.lastAuthEvent)

  useEffect(() => {
    if (sessionChecked && !user && lastAuthEvent !== 'logout-success') {
      dispatch(showToast('Please log in to access dashboard.', 'error'))
    }
  }, [dispatch, lastAuthEvent, sessionChecked, user])

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
  const lastAuthEvent = useSelector((state) => state.auth.lastAuthEvent)

  useEffect(() => {
    if (sessionChecked && user && lastAuthEvent !== 'login-success') {
      dispatch(showToast('Logout to go back to login page', 'error'))
    }
  }, [dispatch, lastAuthEvent, sessionChecked, user])

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
      <Route
        path="/meeting"
        element={
          <ProtectedRoute sessionChecked={sessionChecked}>
            <MeetingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/insights"
        element={
          <ProtectedRoute sessionChecked={sessionChecked}>
            <InsightsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/personnel"
        element={
          <ProtectedRoute sessionChecked={sessionChecked}>
            <PersonnelPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
