import {
  START_LOADING,
  UPDATE_USER_DATA,
  END_LOADING,
  SET_ERROR,
} from './constantsActions';
import type { AppDispatch } from '../store';
import type { AuthUser } from '../reducers/userReducer';

type UpdateUserResponse = { user: AuthUser };
type ErrorResponse = { errors?: { body?: string[] } };

export const updateUser =
  (
    username: string,
    email: string,
    password: string | undefined,
    image: string | undefined,
    token?: string,
  ) =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    dispatch({ type: START_LOADING });

    try {
      const userPayload: Record<string, unknown> = {
        email,
        username,
        bio: "I'm a programmer",
      };
      if (image) userPayload.image = image;
      if (password) userPayload.password = password;

      const response = await fetch(
        'https://blog-platform.kata.academy/api/user',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token ?? ''}`,
          },
          body: JSON.stringify({ user: userPayload }),
        },
      );

      if (!response.ok) {
        let message = `Ошибка: ${response.status}`;
        try {
          const err = (await response.json()) as ErrorResponse;
          const [firstError] = err?.errors?.body ?? [];
          if (firstError) message = firstError;
        } catch {}
        dispatch({ type: SET_ERROR, payload: message });
        return false;
      }

      const data = (await response.json()) as UpdateUserResponse;
      dispatch({ type: UPDATE_USER_DATA, payload: data.user });
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      dispatch({ type: SET_ERROR, payload: message });
      return false;
    } finally {
      dispatch({ type: END_LOADING });
    }
  };
