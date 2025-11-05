import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import Header from '../widgets/Header/Header';
import ArticlesList from '../pages/ArticlesList/ArticlesList';
import ArticlePage from '../pages/ArticlePage/ArticlePage';
import SignIn from '../pages/SignIn/SignIn';
import SignUp from '../pages/SignUp/SignUp';
import EditProfile from '../pages/EditProfile/EditProfile';
import CreateArticle from '../pages/CreateArticle/CreateArticle';
import EditArticle from '../pages/EditArticle/EditArticle';
import NotFound from '../pages/NotFound/NotFound';
import { store } from './store/store';
import RequireAuth from './RequireAuth';
import styles from './App.module.css';

const App = (): JSX.Element => (
  <Router>
    <div className={styles.App}>
      <Provider store={store}>
        <Header />
        <Routes>
          <Route path="/" element={<ArticlesList />} />
          <Route path="/articles" element={<ArticlesList />} />
          <Route path="/articles/:slug" element={<ArticlePage />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route element={<RequireAuth />}>
            <Route path="/profile" element={<EditProfile />} />
            <Route path="/new-article" element={<CreateArticle />} />
            <Route path="/articles/:slug/edit" element={<EditArticle />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Provider>
    </div>
  </Router>
);

export default App;
