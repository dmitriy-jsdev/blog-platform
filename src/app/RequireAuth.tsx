import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

type AuthUser = {
  token?: string | null;
};

type RootStatePart = {
  user: { user?: AuthUser | null };
};

const RequireAuth = (): JSX.Element => {
  const location = useLocation();
  const user = useSelector((state: RootStatePart) => state.user.user);
  const isAuthorized = Boolean(user?.token);

  if (!isAuthorized) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
