import {
  START_LOADING,
  ARTICLE_DELETED,
  END_LOADING,
  SET_ERROR,
} from './constantsActions';
import type { AppDispatch } from '../store';

export const deleteArticle =
  (slug: string, token?: string) =>
  async (dispatch: AppDispatch): Promise<void> => {
    dispatch({ type: START_LOADING });

    try {
      const response = await fetch(
        `https://blog-platform.kata.academy/api/articles/${slug}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Token ${token ?? ''}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }

      dispatch({ type: ARTICLE_DELETED, payload: slug });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      dispatch({ type: SET_ERROR, payload: message });
    } finally {
      dispatch({ type: END_LOADING });
    }
  };
