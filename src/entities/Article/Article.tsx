import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import like from '../../shared/assets/like.svg';
import likeRed from '../../shared/assets/likeRed.svg';
import { addLike } from '../../app/store/actions/addLike';
import { deleteLike } from '../../app/store/actions/deleteLike';
import type { AppDispatch } from '../../app/store/store';
import styles from './Article.module.css';

type Author = {
  username: string;
  image?: string | null;
};

type ArticleProps = {
  title: string;
  descr?: string;
  likeCount?: number;
  tagList?: string[];
  author?: Author;
  createdDate: string;
  slug: string;
};

type AuthUser = {
  username?: string;
  image?: string | null;
  token?: string;
};

type ArticleListItem = {
  slug: string;
  favorited: boolean;
};

type RootStatePart = {
  user: { user?: AuthUser | null };
  articles: { articlesData: { articles: ArticleListItem[] } };
};

const Article = ({
  title,
  descr = '',
  likeCount = 0,
  tagList = [],
  author = { username: '', image: '' },
  createdDate,
  slug,
}: ArticleProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootStatePart) => state.user.user);
  const token = useSelector((state: RootStatePart) => state.user.user?.token);
  const favoritedArticle = useSelector(
    (state: RootStatePart) =>
      state.articles.articlesData.articles.find(
        (article) => article.slug === slug,
      )?.favorited,
  );

  const formattedDate = format(new Date(createdDate), 'MMMM d, yyyy');

  const handleLike = (): void => {
    if (!user) return;

    if (favoritedArticle) {
      dispatch(deleteLike(slug, token));
    } else {
      dispatch(addLike(slug, token));
    }
  };

  return (
    <div className={styles.article}>
      <div className={styles.articleData}>
        <div className={styles.titleWrap}>
          <Link to={`/articles/${slug}`} className={styles.titleArticle}>
            {title}
          </Link>
          <button
            type="button"
            onClick={handleLike}
            className={styles.buttonLike}
          >
            <img
              className={styles.likeImg}
              src={favoritedArticle && user ? likeRed : like}
              alt="like"
            />
          </button>
          <span className={styles.likeCount}>{likeCount}</span>
        </div>

        <ul className={styles.tagList}>
          {tagList.slice(0, 5).map((tag, index) => (
            <li key={index} className={styles.tag}>
              {tag}
            </li>
          ))}
        </ul>

        <p className={styles.descrArticle}>{descr}</p>
      </div>

      <div className={styles.authorData}>
        <div className={styles.dataWrap}>
          <span className={styles.nameAuthor}>{author.username}</span>
          <span className={styles.articleDate}>{formattedDate}</span>
        </div>
        <img
          className={styles.avatarImg}
          src={author.image || ''}
          alt="avatar"
        />
      </div>
    </div>
  );
};

export default Article;
