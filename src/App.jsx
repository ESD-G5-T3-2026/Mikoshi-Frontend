import { useSelector } from 'react-redux'
import GlobalSpinner from './components/GlobalSpinner'
import GlobalToast from './components/GlobalToast'
import AppRoutes from './routes/AppRoutes'

function App() {
  const isLoading = useSelector((state) => state.loading.isLoading)

  return (
    <>
      <AppRoutes />
      <GlobalToast />
      {isLoading && <GlobalSpinner />}
    </>
  )
}

export default App
