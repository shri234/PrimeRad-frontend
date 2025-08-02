export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const LOGOUT = "LOGOUT";
export const SIGNUP_SUCCESS = "SIGNUP_SUCCESS";
export const SIGNUP_FAILURE = "SIGNUP_FAILURE";

export const loginSuccess = (user, token) => ({
  type: LOGIN_SUCCESS,
  payload: { user, token },
});

export const loginFailure = (error) => ({
  type: LOGIN_FAILURE,
  payload: { error },
});

export const logout = () => {
  // Remove stored user data and token from localStorage
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("userId"); // if you're storing it separately

  return {
    type: LOGOUT,
  };
};
export const signupSuccess = (user, token) => ({
  type: SIGNUP_SUCCESS,
  payload: { user, token },
});

export const signupFailure = (error) => ({
  type: SIGNUP_FAILURE,
  payload: { error },
});
