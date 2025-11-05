import arrowBack from '../../assets/arrowBack.svg';
import arrowNext from '../../assets/arrowNext.svg';
import styles from './Pagination.module.css';

type PaginationProps = {
  total: number;
  currentPage: number;
  setPage: (page: number) => void;
};

const Pagination = ({
  total,
  currentPage,
  setPage,
}: PaginationProps): JSX.Element => {
  const PAGE_WINDOW = 9;
  const pageCount = Math.max(1, total);

  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= pageCount;

  const half = Math.floor(PAGE_WINDOW / 2);
  let startPage = 1;
  let endPage = pageCount;

  if (pageCount > PAGE_WINDOW) {
    startPage = Math.max(
      1,
      Math.min(currentPage - half, pageCount - PAGE_WINDOW + 1),
    );
    endPage = startPage + PAGE_WINDOW - 1;
  }

  const handleSetPage = (newPage: number) => {
    const page = Math.min(Math.max(newPage, 1), pageCount);
    if (page !== currentPage) {
      setPage(page);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 0);
    }
  };

  return (
    <div className={styles.pagination}>
      <button
        className={`${styles.btn} ${styles.arrow} ${isFirstPage ? styles.inactiveArrow : ''}`}
        type="button"
        onClick={() => handleSetPage(currentPage - 1)}
        disabled={isFirstPage}
        aria-label="Previous page"
      >
        <img src={arrowBack} alt="arrow back" />
      </button>

      {Array.from(
        { length: Math.max(0, endPage - startPage + 1) },
        (_, i) => startPage + i,
      ).map((number) => (
        <button
          key={number}
          className={`${styles.btn} ${currentPage === number ? styles.active : ''}`}
          type="button"
          onClick={() => handleSetPage(number)}
          aria-current={currentPage === number ? 'page' : undefined}
        >
          {number}
        </button>
      ))}

      <button
        className={`${styles.btn} ${styles.arrow} ${isLastPage ? styles.inactiveArrow : ''}`}
        type="button"
        onClick={() => handleSetPage(currentPage + 1)}
        disabled={isLastPage}
        aria-label="Next page"
      >
        <img src={arrowNext} alt="arrow next" />
      </button>
    </div>
  );
};

export default Pagination;
