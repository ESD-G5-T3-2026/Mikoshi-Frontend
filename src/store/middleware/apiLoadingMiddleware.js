import { loadingEnd, loadingStart } from '../loading'

export const apiLoadingMiddleware = ({ dispatch }) => (next) => (action) => {
  if (typeof action?.type !== 'string') {
    return next(action)
  }

  if (action.type.endsWith('_REQUEST')) {
    dispatch(loadingStart())
    return next(action)
  }

  if (action.type.endsWith('_SUCCESS') || action.type.endsWith('_FAILURE')) {
    const result = next(action)
    dispatch(loadingEnd())
    return result
  }

  return next(action)
}
