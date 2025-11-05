import ReactDOM from 'react-dom/client';
import App from './app/App';
import { loginUser } from './app/store/actions/loginUser';
import { store } from './app/store/store';

const container = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(container);

store.dispatch(loginUser('111@mail.ru', '111111'));

root.render(<App />);
