import {
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
} from "./actions";
import { initialState } from "./state";

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
    case SIGNUP_SUCCESS:
      console.log(action.payload.user, action);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);

      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case LOGIN_FAILURE:
    case SIGNUP_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload.error,
      };
    case LOGOUT:
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null,
      };
    default:
      return state;
  }
};
