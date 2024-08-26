import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../pages/Auth";
import Header from "./Header";

function Protected() {
  const [user] = useContext(AuthContext);
  if (!user) console.log(user);

  if (!user) return <Navigate to="/login" />;
  if (!user?.token) return <Navigate to="/login" />;
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default Protected;
