import type { Reducer, UnknownAction } from 'redux';

export type AuthUser = {
  username?: string;
  email?: string;
  token?: string;
  image?: string | null;
};

export type UserState = {
  isLoading: boolean;
  user: AuthUser | null;
  error: unknown | null;
};

export const initialState: UserState = {
  isLoading: false,
  user: null,
  error: null,
};

type UserAction = UnknownAction & {
  payload?: unknown;
};

const userReducer: Reducer<UserState, UserAction> = (
  state: UserState | undefined,
  action: UserAction,
): UserState => {
  const currentState = state ?? initialState;

  switch (action.type) {
    case 'START_LOADING':
      return { ...currentState, isLoading: true, error: null };

    case 'UPDATE_USER_DATA': {
      const user = action.payload as AuthUser;
      return {
        ...currentState,
        isLoading: false,
        user,
        error: null,
      };
    }

    case 'SET_ERROR': {
      const error = action.payload ?? null;
      return {
        ...currentState,
        isLoading: false,
        error,
      };
    }

    case 'CLEAR_ERROR':
      return { ...currentState, error: null };

    case 'END_LOADING':
      return { ...currentState, isLoading: false };

    case 'USER_LOGGED_OUT':
      return { ...initialState };

    default:
      return currentState;
  }
};

export default userReducer;
