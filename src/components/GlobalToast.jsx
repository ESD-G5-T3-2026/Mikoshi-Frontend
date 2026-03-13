import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { hideToast } from '../store/toast'
import './GlobalToast.css'

function GlobalToast() {
  const dispatch = useDispatch()
  const { visible, message, type } = useSelector((state) => state.toast)

  useEffect(() => {
    if (!visible) {
      return undefined
    }

    const timeoutId = setTimeout(() => {
      dispatch(hideToast())
    }, 3000)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [dispatch, visible, message])

  if (!visible) {
    return null
  }

  return (
    <div className={`global-toast global-toast-${type}`} role="status" aria-live="polite">
      {message}
    </div>
  )
}

export default GlobalToast
