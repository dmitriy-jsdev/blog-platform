import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { createSelector } from 'reselect';
import Markdown from 'react-markdown';
import { format } from 'date-fns';
import type { SyntheticEvent } from 'react';
import Popconfirm from '../../shared/ui/Popconfirm/Popconfirm';
import { getArticle } from '../../app/store/actions/getArticles';
import { deleteArticle } from '../../app/store/actions/deleteArticle';
import type { Article } from '../../app/store/reducers/articlesReducer';
import like from '../../shared/assets/like.svg';
import likeRed from '../../shared/assets/likeRed.svg';
import { addLike } from '../../app/store/actions/addLike';
import { deleteLike } from '../../app/store/actions/deleteLike';
import Spinner from '../../shared/ui/Spinner/Spinner';
import NotFound from '../NotFound/NotFound';
import type { RootState, AppDispatch } from '../../app/store/store';
import { DEFAULT_AVATAR_URL } from '../../shared/config/api';
import styles from './ArticlePage.module.css';

type ArticlePageStatus = 'loading' | 'loaded' | 'notFound' | 'error';

const ArticlePage = (): JSX.Element => {
  const selectArticles = (state: RootState) =>
    state.articles.articlesData.articles;
  const selectUser = (state: RootState) => state.user.user;

  const makeSelectArticleBySlug = (slug: string) =>
    createSelector([selectArticles], (articles) =>
      articles.find((article: Article) => article.slug === slug),
    );

  const makeSelectArticleState = (slug: string) =>
    createSelector(
      [makeSelectArticleBySlug(slug), selectUser],
      (article, user) => ({
        article,
        user,
        username: user?.username,
        token: user?.token,
      }),
    );

  const { slug } = useParams<{ slug: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [pageStatus, setPageStatus] = useState<ArticlePageStatus>('loading');
  const [pageError, setPageError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const selectArticleState = useMemo(
    () => (slug ? makeSelectArticleState(slug) : null),
    [slug],
  );

  const { article, user, username, token } = useSelector(
    (state: RootState) =>
      (selectArticleState ? selectArticleState(state) : {}) as {
        article: Article | undefined;
        user: { username?: string; token?: string } | null;
        username?: string;
        token?: string;
      },
  );

  useEffect(() => {
    if (!slug) {
      setPageStatus('notFound');
      return;
    }

    setPageStatus('loading');
    setPageError(null);
    window.scrollTo(0, 0);

    dispatch(getArticle(slug)).then((result) => {
      if (result.ok) {
        setPageStatus('loaded');
        return;
      }

      if (result.notFound) {
        setPageStatus('notFound');
        return;
      }

      setPageStatus('error');
      setPageError(result.error);
    });
  }, [dispatch, slug]);

  const handleDelete = (): void => {
    if (!slug) return;
    setDeleteError(null);
    dispatch(deleteArticle(slug, token)).then((result) => {
      if (result.ok) {
        navigate('/');
        return;
      }

      setDeleteError(result.error);
    });
  };

  const handleLike = (): void => {
    if (!user || !slug || !article) return;
    dispatch(
      article.favorited ? deleteLike(slug, token) : addLike(slug, token),
    );
  };

  if (pageStatus === 'loading') return <Spinner />;
  if (pageStatus === 'notFound') return <NotFound />;
  if (pageStatus === 'error') {
    return (
      <div className={styles.error}>
        {pageError ?? 'Error! No data received!'}
      </div>
    );
  }
  if (!article) return <Spinner />;

  const {
    title = '',
    body = '',
    tagList = [],
    author,
    createdAt,
    favorited,
    favoritesCount,
  } = article;

  const authorName = author?.username ?? '';
  const authorImage = author?.image || DEFAULT_AVATAR_URL;
  const formattedDate = createdAt
    ? format(new Date(createdAt), 'MMMM d, yyyy')
    : '';

  const handleAvatarError = (e: SyntheticEvent<HTMLImageElement>): void => {
    if (e.currentTarget.src !== DEFAULT_AVATAR_URL) {
      e.currentTarget.src = DEFAULT_AVATAR_URL;
    }
  };

  return (
    <div className={styles.article}>
      <div className={styles.articleData}>
        <div className={styles.titleWrap}>
          <div className={styles.titleArticle}>{title}</div>
          <div className={styles.likeWrap}>
            <button
              type="button"
              onClick={handleLike}
              className={styles.buttonLike}
            >
              <img
                className={styles.likeImg}
                src={favorited && user ? likeRed : like}
                alt="like"
              />
            </button>
            <span className={styles.likeCount}>{favoritesCount}</span>
          </div>
        </div>

        <ul className={styles.tagList}>
          {(tagList ?? []).slice(0, 20).map((tag: string, index: number) => (
            <li key={index} className={styles.tag}>
              {tag}
            </li>
          ))}
        </ul>

        <div className={styles.descrArticle}>
          <Markdown>{body}</Markdown>
        </div>
      </div>

      <div className={styles.wrapper}>
        <div className={styles.authorData}>
          <div className={styles.dataWrap}>
            <span className={styles.nameAuthor}>{authorName}</span>
            <span className={styles.articleDate}>{formattedDate}</span>
          </div>
          <img
            className={styles.avatarImg}
            src={authorImage}
            alt="avatar"
            onError={handleAvatarError}
          />
        </div>

        <div className={styles.wrapButtons}>
          {username === authorName && (
            <>
              <Popconfirm deleteArticle={handleDelete}>
                <button type="button" className={styles.buttonDelete}>
                  Delete
                </button>
              </Popconfirm>
              <Link to={`/articles/${slug}/edit`} className={styles.linkEdit}>
                Edit
              </Link>
            </>
          )}
        </div>
        {deleteError && <div className={styles.error}>{deleteError}</div>}
      </div>
    </div>
  );
};

export default ArticlePage;
