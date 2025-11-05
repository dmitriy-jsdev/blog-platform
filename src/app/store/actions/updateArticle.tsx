import {
  START_LOADING,
  ARTICLE_UPDATED,
  END_LOADING,
  SET_ERROR,
} from './constantsActions';
import type { AppDispatch } from '../store';
import type { Article } from '../reducers/articlesReducer';

type UpdateArticlePayload = {
  title?: string;
  description?: string;
  body?: string;
  tagList?: string[];
};

type UpdateArticleResponse = {
  article: Article;
};

export const updateArticle =
  (slug: string, articleData: UpdateArticlePayload, token?: string) =>
  async (dispatch: AppDispatch): Promise<void> => {
    dispatch({ type: START_LOADING });

    try {
      const response = await fetch(
        `https://blog-platform.kata.academy/api/articles/${slug}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Token ${token ?? ''}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ article: articleData }),
        },
      );

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }

      const updated = (await response.json()) as UpdateArticleResponse;
      dispatch({ type: ARTICLE_UPDATED, payload: updated.article });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      dispatch({ type: SET_ERROR, payload: message });
    } finally {
      dispatch({ type: END_LOADING });
    }
  };
