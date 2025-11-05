import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Article from '../../entities/Article/Article';
import { getArticles } from '../../app/store/actions/getArticles';
import Spinner from '../../shared/ui/Spinner/Spinner';
import Pagination from '../../shared/ui/Pagination/Pagination';
import type { AppDispatch } from '../../app/store/store';
import styles from './ArticlesList.module.css';

type ArticleListItem = {
  title: string;
  description: string;
  favoritesCount: number;
  tagList: string[];
  author: { username: string; image?: string | null };
  createdAt: string;
  slug: string;
};

type RootStatePart = {
  articles: {
    articlesData: { articles: ArticleListItem[]; articlesCount: number };
    loading: boolean;
    error: unknown;
  };
};

const ArticlesList = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 5;

  const articles = useSelector(
    (state: RootStatePart) => state.articles.articlesData.articles,
  );
  const articlesCount = useSelector(
    (state: RootStatePart) => state.articles.articlesData.articlesCount,
  );
  const loading = useSelector((state: RootStatePart) => state.articles.loading);
  const error = useSelector((state: RootStatePart) => state.articles.error);

  useEffect(() => {
    const offset = (currentPage - 1) * pageSize;
    dispatch(getArticles(pageSize, offset));
  }, [dispatch, currentPage, pageSize]);

  if (loading) return <Spinner />;
  if (error)
    return <div className={styles.error}>Error! No data received!</div>;

  return (
    <div className={styles.articlesList}>
      {articles.map((article) => (
        <Article
          key={article.slug}
          title={article.title}
          descr={article.description}
          likeCount={article.favoritesCount}
          tagList={article.tagList}
          author={article.author}
          createdDate={article.createdAt}
          slug={article.slug}
        />
      ))}
      <Pagination
        total={Math.ceil(articlesCount / pageSize)}
        currentPage={currentPage}
        setPage={setCurrentPage}
      />
    </div>
  );
};

export default ArticlesList;
