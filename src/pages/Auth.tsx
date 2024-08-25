import { Navigate, Outlet } from "react-router-dom";

function Auth() {
  const user = localStorage.getItem("user") || null;
  if (!user) return <Outlet />;
  return <Navigate to="/" />;
}

export default Auth;
