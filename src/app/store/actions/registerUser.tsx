import {
  START_LOADING,
  UPDATE_USER_DATA,
  END_LOADING,
  SET_ERROR,
} from './constantsActions';
import type { AppDispatch } from '../store';
import type { AuthUser } from '../reducers/userReducer';

type RegisterOk = { user: AuthUser };
type RegisterErr = { errors?: Record<string, string[]> };

const extractRegisterError = (err: RegisterErr): string => {
  if (!err.errors || typeof err.errors !== 'object') {
    return 'An error occurred';
  }

  const [field, messages] = Object.entries(err.errors)[0] ?? [];
  if (Array.isArray(messages) && messages.length > 0) {
    return `${field}: ${messages.join(', ')}`;
  }

  return 'An error occurred';
};

export const registerUser =
  (username: string, email: string, password: string) =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    dispatch({ type: START_LOADING });

    try {
      const response = await fetch(
        'https://blog-platform.kata.academy/api/users',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user: { username, email, password } }),
        },
      );

      const data = (await response.json()) as RegisterOk | RegisterErr;

      if (!response.ok) {
        const message = extractRegisterError(data as RegisterErr);
        dispatch({ type: SET_ERROR, payload: message });
        return false;
      }

      dispatch({ type: UPDATE_USER_DATA, payload: (data as RegisterOk).user });
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      dispatch({ type: SET_ERROR, payload: message });
      return false;
    } finally {
      dispatch({ type: END_LOADING });
    }
  };
