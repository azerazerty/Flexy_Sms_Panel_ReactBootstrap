import { useEffect, useState, createContext, PropsWithChildren } from "react";

export type userType = [user: any, setUser: any];
export const AuthContext = createContext<userType>([null, null]);

function Auth({ children }: PropsWithChildren) {
  const [user, setUser] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user) {
      const userItem = localStorage.getItem("user");
      if (userItem) console.log("exist");
      if (userItem) setUser(JSON.parse(localStorage.getItem("user")!));
      else setUser(null);
      setLoading(false);
    }
  }, [loading]);
  return (
    <>
      {loading ? (
        <></>
      ) : (
        <AuthContext.Provider value={[user, setUser]}>
          {children}
        </AuthContext.Provider>
      )}
    </>
  );
}

export default Auth;
