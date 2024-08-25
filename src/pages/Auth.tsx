import { Outlet } from "react-router-dom";
import { useEffect, useState, createContext } from "react";

export type userType = [user: any, setUser: any];
export const AuthContext = createContext<userType>([null, null]);

function Auth() {
  const [user, setUser] = useState<any>();

  useEffect(() => {
    const userItem = localStorage.getItem("user") || null;
    if (userItem) setUser(JSON.parse(localStorage.getItem("user")!));
    else setUser(null);
  }, []);
  return (
    <AuthContext.Provider value={[user, setUser]}>
      <Outlet />
    </AuthContext.Provider>
  );
}

export default Auth;
