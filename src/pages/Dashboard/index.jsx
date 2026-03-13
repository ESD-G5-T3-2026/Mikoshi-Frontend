import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logoutRequest, logoutSuccess, logoutFailure } from '../../store/auth'
import { logoutApi } from '../../services/loginApi'
import DashboardContent from './components/DashboardContent'
import './Dashboard.css'

function DashboardPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)

  const handleLogout = async () => {
    dispatch(logoutRequest())
    try {
      await logoutApi()
      dispatch(logoutSuccess())
      navigate('/')
    } catch (error) {
      dispatch(logoutFailure(error?.message || 'Logout failed'))
    }
  }

  return (
    <main className="dashboard-page">
      <DashboardContent onLogout={handleLogout} user={user} />
    </main>
  )
}

export default DashboardPage
