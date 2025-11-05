import {
  START_LOADING,
  SET_ARTICLES,
  SET_ARTICLE,
  END_LOADING,
  SET_ERROR,
} from './constantsActions';
import type { AppDispatch } from '../store';
import type { Article } from '../reducers/articlesReducer';

type ArticlesResponse = {
  articles: Article[];
  articlesCount: number;
};

type SingleArticleResponse = {
  article: Article;
};

export const getArticles =
  (limit = 5, offset = 0) =>
  async (dispatch: AppDispatch): Promise<void> => {
    dispatch({ type: START_LOADING });

    try {
      const token = localStorage.getItem('token') ?? '';

      const response = await fetch(
        `https://blog-platform.kata.academy/api/articles?limit=${limit}&offset=${offset}`,
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
  async (dispatch: AppDispatch): Promise<void> => {
    dispatch({ type: START_LOADING });

    try {
      const token = localStorage.getItem('token') ?? '';

      const response = await fetch(
        `https://blog-platform.kata.academy/api/articles/${slug}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Article could not be fetched!');
      }

      const data = (await response.json()) as SingleArticleResponse;
      dispatch({ type: SET_ARTICLE, payload: data.article });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      dispatch({ type: SET_ERROR, payload: message });
    } finally {
      dispatch({ type: END_LOADING });
    }
  };
