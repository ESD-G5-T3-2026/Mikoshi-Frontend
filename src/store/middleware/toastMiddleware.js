import { showToast } from '../toast'

export const toastMiddleware = ({ dispatch }) => (next) => (action) => {
  const result = next(action)

  if (!action?.meta?.toast) {
    return result
  }

  const toastConfig = typeof action.meta.toast === 'object' ? action.meta.toast : {}
  const type = toastConfig.type || (action.type.endsWith('_FAILURE') ? 'error' : 'success')
  const fallbackMessage = action.type.endsWith('_FAILURE') ? 'Action failed' : 'Action successful'
  const message =
    toastConfig.message ||
    (typeof action.payload === 'string' ? action.payload : '') ||
    fallbackMessage

  dispatch(showToast(message, type))

  return result
}
