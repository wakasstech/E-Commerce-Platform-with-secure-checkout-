
import { Navigate } from "react-router-dom";


export const AdminRoute = ({ children }) => {
 

  const role = "admin";
  if (role == "admin" || role =='teacher') {
    return (
      <>
          {children}
      </>
    );
  }
  return <Navigate to="/" />;
};
