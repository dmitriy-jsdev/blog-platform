import type { Reducer, UnknownAction } from 'redux';

type Author = {
  username: string;
  image?: string | null;
};

export type Article = {
  slug: string;
  favorited: boolean;
  favoritesCount: number;
  title?: string;
  description?: string;
  body?: string;
  tagList?: string[];
  createdAt?: string;
  author?: Author;
};

export type ArticlesState = {
  articlesData: {
    articles: Article[];
    articlesCount: number;
  };
  loading: boolean;
  error: unknown | null;
};

export const initialState: ArticlesState = {
  articlesData: {
    articles: [],
    articlesCount: 0,
  },
  loading: false,
  error: null,
};

type ArticlesAction = UnknownAction & {
  payload?: unknown;
};

export const articlesReducer: Reducer<ArticlesState, ArticlesAction> = (
  state: ArticlesState | undefined,
  action: ArticlesAction,
): ArticlesState => {
  const currentState = state ?? initialState;

  switch (action.type) {
    case 'START_LOADING':
      return { ...currentState, loading: true, error: null };

    case 'END_LOADING':
      return { ...currentState, loading: false };

    case 'SET_ERROR':
      return {
        ...currentState,
        loading: false,
        error: action.payload ?? null,
      };

    case 'SET_ARTICLES': {
      const payload = action.payload as {
        articles: Article[];
        articlesCount: number;
      };
      return {
        ...currentState,
        articlesData: {
          articles: payload.articles,
          articlesCount: payload.articlesCount,
        },
        loading: false,
      };
    }

    case 'SET_ARTICLE': {
      const payload = action.payload as Article;
      return {
        ...currentState,
        articlesData: {
          ...currentState.articlesData,
          articles: currentState.articlesData.articles.map((article) =>
            article.slug === payload.slug ? payload : article,
          ),
        },
        loading: false,
      };
    }

    case 'ARTICLE_CREATED': {
      const payload = action.payload as Article;
      return {
        ...currentState,
        articlesData: {
          ...currentState.articlesData,
          articles: [...currentState.articlesData.articles, payload],
          articlesCount: currentState.articlesData.articlesCount + 1,
        },
        loading: false,
        error: null,
      };
    }

    case 'ARTICLE_DELETED': {
      const slug = action.payload as string;
      return {
        ...currentState,
        articlesData: {
          ...currentState.articlesData,
          articles: currentState.articlesData.articles.filter(
            (article) => article.slug !== slug,
          ),
          articlesCount: Math.max(
            0,
            currentState.articlesData.articlesCount - 1,
          ),
        },
        loading: false,
        error: null,
      };
    }

    case 'ARTICLE_UPDATED': {
      const payload = action.payload as Article;
      return {
        ...currentState,
        articlesData: {
          ...currentState.articlesData,
          articles: currentState.articlesData.articles.map((article) =>
            article.slug === payload.slug
              ? { ...article, ...payload }
              : article,
          ),
        },
        loading: false,
        error: null,
      };
    }

    case 'SET_LIKE': {
      const payload = action.payload as {
        article: Pick<Article, 'slug' | 'favorited' | 'favoritesCount'>;
      };
      const updated = currentState.articlesData.articles.map((article) =>
        article.slug === payload.article.slug
          ? {
              ...article,
              favorited: payload.article.favorited,
              favoritesCount: payload.article.favoritesCount,
            }
          : article,
      );
      return {
        ...currentState,
        articlesData: { ...currentState.articlesData, articles: updated },
        loading: false,
      };
    }

    case 'UNSET_LIKE': {
      const payload = action.payload as {
        article: Pick<Article, 'slug' | 'favorited' | 'favoritesCount'>;
      };
      const updated = currentState.articlesData.articles.map((article) =>
        article.slug === payload.article.slug
          ? {
              ...article,
              favorited: payload.article.favorited,
              favoritesCount: payload.article.favoritesCount,
            }
          : article,
      );
      return {
        ...currentState,
        articlesData: { ...currentState.articlesData, articles: updated },
        loading: false,
      };
    }

    default:
      return currentState;
  }
};
