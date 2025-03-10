import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function PrivateRoutes({ children }) {
  const isAuthenticate = useSelector((state) => state.auth.isAuthenticated);

  //console.log(userStore, children);

  if (!isAuthenticate) {
    return <Navigate to="/signin" />;
  }

  return <>{children}</>;
}
