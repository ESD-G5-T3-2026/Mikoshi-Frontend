import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
  const [sessionChecked, setSessionChecked] = useState(false)
  const isLoading = useSelector((state) => state.loading.isLoading)
  const user = useSelector((state) => state.auth.user)

  useEffect(() => {
    let isMounted = true

    const hydrateSession = async () => {
      dispatch(hydrateUserRequest())
      try {
        const sessionData = await getSession()
        if (sessionData?.user) {
          dispatch(hydrateUserSuccess(sessionData.user))
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
      {(!sessionChecked || user) && <Navbar user={user} />}
      <AppRoutes sessionChecked={sessionChecked} />
      <GlobalToast />
      {isLoading && <GlobalSpinner />}
    </>
  )
}

export default App
