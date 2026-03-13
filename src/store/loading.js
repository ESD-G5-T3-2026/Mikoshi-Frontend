const LOADING_START = 'loading/start'
const LOADING_END = 'loading/end'

const initialState = {
  pendingRequests: 0,
  isLoading: false,
}

export function loadingReducer(state = initialState, action) {
  switch (action.type) {
    case LOADING_START: {
      const pendingRequests = state.pendingRequests + 1
      return {
        pendingRequests,
        isLoading: pendingRequests > 0,
      }
    }
    case LOADING_END: {
      const pendingRequests = Math.max(state.pendingRequests - 1, 0)
      return {
        pendingRequests,
        isLoading: pendingRequests > 0,
      }
    }
    default:
      return state
  }
}

export function loadingStart() {
  return { type: LOADING_START }
}

export function loadingEnd() {
  return { type: LOADING_END }
}
