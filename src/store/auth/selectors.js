import { createSelector } from "reselect";

const selectAuth = (state) => state.auth;

export const selectIsAuthenticated = createSelector(
  [selectAuth],
  (auth) => auth.isAuthenticated
);

export const selectUser = createSelector([selectAuth], (auth) => auth.user);

export const selectAuthToken = createSelector(
  [selectAuth],
  (auth) => auth.token
);

export const selectAuthError = createSelector(
  [selectAuth],
  (auth) => auth.error
);
