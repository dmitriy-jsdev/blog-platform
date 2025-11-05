import {
  START_LOADING,
  ARTICLE_DELETED,
  END_LOADING,
  SET_ERROR,
} from './constantsActions';
import type { AppDispatch } from '../store';
import { API_BASE_URL } from '../../../shared/config/api';

type ArticleMutationResult = { ok: true } | { ok: false; error: string };

export const deleteArticle =
  (slug: string, token?: string) =>
  async (dispatch: AppDispatch): Promise<ArticleMutationResult> => {
    dispatch({ type: START_LOADING });

    try {
      const response = await fetch(`${API_BASE_URL}/articles/${slug}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Token ${token ?? ''}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }

      dispatch({ type: ARTICLE_DELETED, payload: slug });
      return { ok: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      dispatch({ type: SET_ERROR, payload: message });
      return { ok: false, error: message };
    } finally {
      dispatch({ type: END_LOADING });
    }
  };
