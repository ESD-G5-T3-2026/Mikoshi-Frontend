const LOGIN_REQUEST = "auth/LOGIN_REQUEST";
const LOGIN_SUCCESS = "auth/LOGIN_SUCCESS";
const LOGIN_FAILURE = "auth/LOGIN_FAILURE";
const LOGOUT_REQUEST = "auth/LOGOUT_REQUEST";
const LOGOUT_SUCCESS = "auth/LOGOUT_SUCCESS";
const LOGOUT_FAILURE = "auth/LOGOUT_FAILURE";
const HYDRATE_USER_REQUEST = "auth/HYDRATE_USER_REQUEST";
const HYDRATE_USER_SUCCESS = "auth/HYDRATE_USER_SUCCESS";
const HYDRATE_USER_FAILURE = "auth/HYDRATE_USER_FAILURE";
const CLEAR_AUTH_REQUEST = "auth/CLEAR_AUTH_REQUEST";
const CLEAR_AUTH_SUCCESS = "auth/CLEAR_AUTH_SUCCESS";
const CLEAR_AUTH_FAILURE = "auth/CLEAR_AUTH_FAILURE";

const initialState = {
	user: null,
	error: null,
	lastAuthEvent: null,
};

export function authReducer(state = initialState, action) {
	switch (action.type) {
		case LOGIN_REQUEST:
			return {
				...state,
				error: null,
				lastAuthEvent: null,
			};
		case LOGIN_SUCCESS:
			return {
				user: action.payload,
				error: null,
				lastAuthEvent: "login-success",
			};
		case LOGIN_FAILURE:
			return {
				...state,
				error: action.payload,
				lastAuthEvent: null,
			};
		case LOGOUT_REQUEST:
			return { ...state, error: null, lastAuthEvent: null };
		case LOGOUT_SUCCESS:
			return { user: null, error: null, lastAuthEvent: "logout-success" };
		case LOGOUT_FAILURE:
			return { ...state, error: action.payload, lastAuthEvent: null };
		case HYDRATE_USER_REQUEST:
			return { ...state, error: null, lastAuthEvent: null };
		case HYDRATE_USER_SUCCESS:
			return {
				user: action.payload,
				error: null,
				lastAuthEvent: null,
			};
		case HYDRATE_USER_FAILURE:
			return {
				...state,
				user: null,
				error: action.payload || null,
				lastAuthEvent: null,
			};
		case CLEAR_AUTH_REQUEST:
			return { ...state, error: null, lastAuthEvent: null };
		case CLEAR_AUTH_SUCCESS:
			return {
				user: null,
				error: null,
				lastAuthEvent: null,
			};
		case CLEAR_AUTH_FAILURE:
			return {
				...state,
				error: action.payload || null,
				lastAuthEvent: null,
			};
		default:
			return state;
	}
}

export function loginRequest() {
	return { type: LOGIN_REQUEST };
}

export function loginSuccess(user) {
	return {
		type: LOGIN_SUCCESS,
		payload: user,
		meta: {
			toast: {
				type: "success",
				message: "Login successful",
			},
		},
	};
}

export function loginFailure(message) {
	return {
		type: LOGIN_FAILURE,
		payload: message,
		meta: {
			toast: {
				type: "error",
				message: message || "Login failed",
			},
		},
	};
}

export function logoutRequest() {
	return { type: LOGOUT_REQUEST };
}

export function logoutSuccess() {
	return {
		type: LOGOUT_SUCCESS,
		meta: {
			toast: {
				type: "success",
				message: "Logged out successfully",
			},
		},
	};
}

export function logoutFailure(message) {
	return {
		type: LOGOUT_FAILURE,
		payload: message,
		meta: {
			toast: {
				type: "error",
				message: message || "Logout failed",
			},
		},
	};
}

export function hydrateUserRequest() {
	return {
		type: HYDRATE_USER_REQUEST,
	};
}

export function hydrateUserSuccess(user) {
	return {
		type: HYDRATE_USER_SUCCESS,
		payload: user,
	};
}

export function hydrateUserFailure(message) {
	return {
		type: HYDRATE_USER_FAILURE,
		payload: message,
	};
}

export function clearAuthRequest() {
	return {
		type: CLEAR_AUTH_REQUEST,
	};
}

export function clearAuthSuccess() {
	return {
		type: CLEAR_AUTH_SUCCESS,
	};
}

export function clearAuthFailure(message) {
	return {
		type: CLEAR_AUTH_FAILURE,
		payload: message,
	};
}
