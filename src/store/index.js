import { applyMiddleware, combineReducers, createStore } from 'redux'
import { authReducer } from './auth'
import { loadingReducer } from './loading'
import { apiLoadingMiddleware } from './middleware/apiLoadingMiddleware'
import { toastMiddleware } from './middleware/toastMiddleware'
import { toastReducer } from './toast'

const rootReducer = combineReducers({
  auth: authReducer,
  loading: loadingReducer,
  toast: toastReducer,
})

const store = createStore(rootReducer, applyMiddleware(apiLoadingMiddleware, toastMiddleware))

export default store
