import {
  START_LOADING,
  UPDATE_USER_DATA,
  USER_LOGGED_OUT,
  END_LOADING,
  SET_ERROR,
  CLEAR_ERROR,
} from './constantsActions';
import type { AppDispatch } from '../store';
import type { AuthUser } from '../reducers/userReducer';

type LoginResponse = {
  user: AuthUser;
};

export const loginUser =
  (email: string, password: string) =>
  async (dispatch: AppDispatch): Promise<void> => {
    dispatch({ type: START_LOADING });

    try {
      const response = await fetch(
        'https://blog-platform.kata.academy/api/users/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user: { email, password } }),
        },
      );

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }

      const data = (await response.json()) as LoginResponse;

      localStorage.setItem('user', JSON.stringify(data.user));
      dispatch({ type: UPDATE_USER_DATA, payload: data.user });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      dispatch({ type: SET_ERROR, payload: message });
    } finally {
      dispatch({ type: END_LOADING });
    }
  };

export const userLoggedOut = (): { type: typeof USER_LOGGED_OUT } => ({
  type: USER_LOGGED_OUT,
});

export const clearError = (): { type: typeof CLEAR_ERROR } => ({
  type: CLEAR_ERROR,
});
