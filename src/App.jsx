import { useSelector } from 'react-redux'
import GlobalSpinner from './components/GlobalSpinner'
import GlobalToast from './components/GlobalToast'
import Navbar from './components/Navbar'
import AppRoutes from './routes/AppRoutes'

function App() {
  const isLoading = useSelector((state) => state.loading.isLoading)
  const user = useSelector((state) => state.auth.user)

  return (
    <>
      {user && <Navbar user={user} />}
      <AppRoutes />
      <GlobalToast />
      {isLoading && <GlobalSpinner />}
    </>
  )
}

export default App
