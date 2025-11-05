# Blog Platform (frontend)

Фронтенд для блога на React + TypeScript. Проект работает с API в формате RealWorld/Conduit.

Демо: <https://blog-platform-beige-phi.vercel.app/>

## Что реализовано

- регистрация, вход и выход;
- редактирование профиля;
- лента статей с пагинацией (5 на страницу);
- страница статьи с рендером Markdown;
- создание, редактирование и удаление статей (для автора);
- лайк/анлайк статьи;
- обработка loading/error состояний.

## Технологии

- React 18 + TypeScript;
- React Router v6;
- Redux Toolkit + react-redux + redux-thunk;
- react-hook-form, date-fns, react-markdown, reselect;
- CSS Modules;
- Create React App (`react-scripts@5`);
- архитектура Feature-Sliced Design.

## Локальный запуск

```bash
npm install
npm start
```

Сборка:

```bash
npm run build
```

## Переменные окружения

Используется одна переменная:

- `REACT_APP_API_BASE_URL` — базовый адрес API.

Фактическое поведение:

- в `development`, если переменная не задана, используется `http://localhost:3001/api`;
- в `production` переменная обязательна;
- если указать адрес без `/api`, приложение добавит `/api` автоматически.

Примеры:

```bash
# создайте .env и укажите:
# локальный API
REACT_APP_API_BASE_URL=http://localhost:3001

# Render API
REACT_APP_API_BASE_URL=https://blog-platform-api-7ru7.onrender.com
```

Если фронтенд запущен локально, а API удалённый, на стороне API в `CORS_ORIGINS` должен быть origin фронта: `http://localhost:3000` и/или `http://localhost:5173`.
