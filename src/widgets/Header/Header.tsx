import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { SyntheticEvent } from 'react';
import { userLoggedOut } from '../../app/store/actions/loginUser';
import avatarPlaceholder from '../../shared/assets/avatarPlaceholder.svg';
import type { AppDispatch, RootState } from '../../app/store/store';
import styles from './Header.module.css';

const Header = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.user.user);
  const username = user?.username;
  const avatar = user?.image;

  const handleLogout = (): void => {
    navigate('/sign-in');
    localStorage.removeItem('user');
    dispatch(userLoggedOut());
  };

  const handleError = (e: SyntheticEvent<HTMLImageElement>): void => {
    e.currentTarget.src = avatarPlaceholder;
  };

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.blogName}>
        Realworld Blog
      </Link>
      <div className={styles.authWrap}>
        {username ? (
          <>
            <Link to="/new-article" className={styles.createArticle}>
              Create article
            </Link>
            <Link to="/profile" className={styles.username}>
              {username}
            </Link>
            <img
              src={avatar || avatarPlaceholder}
              alt="Profile"
              className={styles.userImage}
              onError={handleError}
            />
            <button
              className={styles.logout}
              type="button"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link to="/sign-in">
              <button className={styles.signIn} type="button">
                Sign In
              </button>
            </Link>
            <Link to="/sign-up">
              <button className={styles.signUp} type="button">
                Sign Up
              </button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
