import {
  START_LOADING,
  ARTICLE_CREATED,
  END_LOADING,
  SET_ERROR,
} from './constantsActions';
import type { AppDispatch } from '../store';
import type { Article } from '../reducers/articlesReducer';

type NewArticlePayload = {
  title: string;
  description: string;
  body: string;
  tagList: string[];
};

type PostArticleResponse = {
  article: Article;
};

const extractBodyErrors = (payload: unknown): string[] => {
  if (typeof payload !== 'object' || payload === null) return [];

  const obj = payload as Record<string, unknown>;
  const { errors } = obj as { errors?: unknown };
  if (typeof errors !== 'object' || errors === null) return [];

  const { body } = errors as { body?: unknown };
  if (!Array.isArray(body)) return [];

  const messages = body.filter(
    (message): message is string => typeof message === 'string',
  );
  return messages;
};

export const postArticle =
  (articleData: NewArticlePayload, token?: string) =>
  async (dispatch: AppDispatch): Promise<void> => {
    dispatch({ type: START_LOADING });

    try {
      const response = await fetch(
        'https://blog-platform.kata.academy/api/articles',
        {
          method: 'POST',
          headers: {
            Authorization: `Token ${token ?? ''}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ article: articleData }),
        },
      );

      if (!response.ok) {
        let message = `Ошибка: ${response.status}`;
        try {
          const raw = (await response.json()) as unknown;
          const bodyErrors = extractBodyErrors(raw);
          if (bodyErrors.length) {
            message += `, Сообщение: ${bodyErrors.join(', ')}`;
          }
        } catch {}
        throw new Error(message);
      }

      const data = (await response.json()) as PostArticleResponse;
      dispatch({ type: ARTICLE_CREATED, payload: data.article });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      dispatch({ type: SET_ERROR, payload: message });
    } finally {
      dispatch({ type: END_LOADING });
    }
  };
