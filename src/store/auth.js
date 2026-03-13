const LOGIN_REQUEST = "auth/LOGIN_REQUEST";
const LOGIN_SUCCESS = "auth/LOGIN_SUCCESS";
const LOGIN_FAILURE = "auth/LOGIN_FAILURE";
const LOGOUT_REQUEST = "auth/LOGOUT_REQUEST";
const LOGOUT_SUCCESS = "auth/LOGOUT_SUCCESS";
const LOGOUT_FAILURE = "auth/LOGOUT_FAILURE";

const initialState = {
	user: null,
	error: null,
};

export function authReducer(state = initialState, action) {
	switch (action.type) {
		case LOGIN_REQUEST:
			return {
				...state,
				error: null,
			};
		case LOGIN_SUCCESS:
			return {
				user: action.payload,
				error: null,
			};
		case LOGIN_FAILURE:
			return {
				...state,
				error: action.payload,
			};
		case LOGOUT_REQUEST:
			return { ...state, error: null };
		case LOGOUT_SUCCESS:
			return { user: null, error: null };
		case LOGOUT_FAILURE:
			return { ...state, error: action.payload };
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
