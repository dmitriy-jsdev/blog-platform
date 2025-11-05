import { SET_LIKE, SET_ERROR } from './constantsActions';
import type { AppDispatch } from '../store';

type LikeResponse = {
  article: {
    slug: string;
    favorited: boolean;
    favoritesCount: number;
  };
};

export const addLike =
  (slug: string, token?: string) =>
  async (dispatch: AppDispatch): Promise<void> => {
    try {
      const response = await fetch(
        `https://blog-platform.kata.academy/api/articles/${slug}/favorite`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token ?? ''}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }

      const data = (await response.json()) as LikeResponse;
      dispatch({ type: SET_LIKE, payload: data });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      dispatch({ type: SET_ERROR, payload: message });
    }
  };
