import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import GlobalSpinner from './components/GlobalSpinner'
import GlobalToast from './components/GlobalToast'
import Navbar from './components/Navbar'
import AppRoutes from './routes/AppRoutes'
import { getSession } from './services/loginApi'
import {
  clearAuthRequest,
  clearAuthSuccess,
  hydrateUserFailure,
  hydrateUserRequest,
  hydrateUserSuccess,
} from './store/auth'

function App() {
  const dispatch = useDispatch()
  const location = useLocation()
  const [sessionChecked, setSessionChecked] = useState(false)
  const isLoading = useSelector((state) => state.loading.isLoading)
  const user = useSelector((state) => state.auth.user)
  const isLoginRoute = location.pathname === '/'
  const shouldShowNavbar = user || (!sessionChecked && !isLoginRoute)

  useEffect(() => {
    let isMounted = true

    const hydrateSession = async () => {
      dispatch(hydrateUserRequest())
      try {
        const sessionUser = await getSession()
        if (sessionUser) {
          dispatch(hydrateUserSuccess(sessionUser))
        } else {
          dispatch(hydrateUserFailure('No active session'))
          dispatch(clearAuthRequest())
          dispatch(clearAuthSuccess())
        }
      } catch {
        dispatch(hydrateUserFailure('Session check failed'))
        dispatch(clearAuthRequest())
        dispatch(clearAuthSuccess())
      } finally {
        if (isMounted) {
          setSessionChecked(true)
        }
      }
    }

    hydrateSession()

    return () => {
      isMounted = false
    }
  }, [dispatch])

  return (
    <>
      {shouldShowNavbar && <Navbar user={user} />}
      <AppRoutes sessionChecked={sessionChecked} />
      <GlobalToast />
      {isLoading && <GlobalSpinner />}
    </>
  )
}

export default App
