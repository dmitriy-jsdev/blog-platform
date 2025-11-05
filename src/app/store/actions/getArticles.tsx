import {
  START_LOADING,
  SET_ARTICLES,
  SET_ARTICLE,
  END_LOADING,
  SET_ERROR,
} from './constantsActions';
import type { AppDispatch } from '../store';
import type { Article } from '../reducers/articlesReducer';
import { API_BASE_URL } from '../../../shared/config/api';

type ArticlesResponse = {
  articles: Article[];
  articlesCount: number;
};

type SingleArticleResponse = {
  article: Article;
};

export type GetArticleResult =
  | { ok: true }
  | { ok: false; notFound?: boolean; error: string };

export const getArticles =
  (limit = 5, offset = 0) =>
  async (dispatch: AppDispatch): Promise<void> => {
    dispatch({ type: START_LOADING });

    try {
      const token = localStorage.getItem('token') ?? '';

      const response = await fetch(
        `${API_BASE_URL}/articles?limit=${limit}&offset=${offset}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }

      const data = (await response.json()) as ArticlesResponse;
      dispatch({ type: SET_ARTICLES, payload: data });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      dispatch({ type: SET_ERROR, payload: message });
    } finally {
      dispatch({ type: END_LOADING });
    }
  };

export const getArticle =
  (slug: string) =>
  async (dispatch: AppDispatch): Promise<GetArticleResult> => {
    dispatch({ type: START_LOADING });

    try {
      const token = localStorage.getItem('token') ?? '';

      const response = await fetch(`${API_BASE_URL}/articles/${slug}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) {
        const message =
          response.status === 404
            ? 'Article not found'
            : `Ошибка: ${response.status}`;

        if (response.status === 404) {
          dispatch({ type: END_LOADING });
          return { ok: false, notFound: true, error: message };
        }

        throw new Error(message);
      }

      const data = (await response.json()) as SingleArticleResponse;
      dispatch({ type: SET_ARTICLE, payload: data.article });
      return { ok: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      dispatch({ type: SET_ERROR, payload: message });
      return { ok: false, error: message };
    } finally {
      dispatch({ type: END_LOADING });
    }
  };
