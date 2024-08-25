import { Navigate, Outlet } from "react-router-dom";
import Header from "./Header";

function Protected() {
  if (localStorage.getItem("user") == null) return <Navigate to="/login" />;
  if (JSON.parse(localStorage.getItem("user") || "{}")?.token == null)
    return <Navigate to="/login" />;
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default Protected;
