const SHOW_TOAST = 'toast/show'
const HIDE_TOAST = 'toast/hide'

const initialState = {
  visible: false,
  message: '',
  type: 'success',
}

export function toastReducer(state = initialState, action) {
  switch (action.type) {
    case SHOW_TOAST:
      return {
        visible: true,
        message: action.payload.message,
        type: action.payload.type,
      }
    case HIDE_TOAST:
      return {
        ...state,
        visible: false,
      }
    default:
      return state
  }
}

export function showToast(message, type = 'success') {
  return {
    type: SHOW_TOAST,
    payload: { message, type },
  }
}

export function hideToast() {
  return { type: HIDE_TOAST }
}
