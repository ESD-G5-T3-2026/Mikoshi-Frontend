import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login } from '../../services/loginApi'
import { loginFailure, loginRequest, loginSuccess } from '../../store/auth'
import LoginForm from './components/LoginForm'
import './Login.css'

function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isLoading = useSelector((state) => state.loading.isLoading)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = formData.get('email')
    const password = formData.get('password')

    dispatch(loginRequest())

    try {
      const userData = await login({ email, password })
      dispatch(loginSuccess(userData))
      navigate('/dashboard')
    } catch (error) {
      dispatch(loginFailure(error?.message || 'Login failed'))
    }
  }

  return (
    <main className="login-page">
      <div className="login-jumbotron">
        <h1 className="jumbotron-title">Welcome to Clubify!</h1>
        <p className="jumbotron-sub">Your all-in-one campus club platform</p>
      </div>
      <section className="login-card" aria-label="Login form">
        <h1>Login</h1>
        <p className="subtitle">Sign in to continue</p>
        <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />
      </section>
    </main>
  )
}

export default LoginPage
