import React, { useState, useCallback, useEffect } from 'react';

interface MyComponentProps {
  children: React.ReactNode; // Specifies the type of children (any React Node)
}

interface AuthContextProps {
  token: string;
  isLoggedIn: boolean;
  login: (token: string, user: any) => void; // Use a more generic type for user
  logout: () => void;
  user: any; // Use a more generic type for user
}

const AuthContext = React.createContext<AuthContextProps>({
  token: '',
  isLoggedIn: false,
  login: () => { },
  logout: () => { },
  user: null,
});

const retrieveStoredToken = (): { token: string } => {
  const storedToken = localStorage.getItem('token');
  return storedToken ? { token: storedToken } : { token: '' };
};

export const AuthContextProvider: React.FC<MyComponentProps> = (props) => {
  const tokenData = retrieveStoredToken();

  const [token, setToken] = useState<string>(tokenData.token);
  const [user, setUser] = useState<any>(null); // Use a more generic type for user

  const userIsLoggedIn = !!token;

  useEffect(() => {
    if (userIsLoggedIn && user === null) {
      try {
        const getData = async () => {
          const res = await fetch(`${import.meta.env.VITE_BASE_URL}/user/verify`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer :${token}`,
            },
          });

          const res_data = await res.json();
          if (res.status !== 201)
            throw new Error('Not Authorized')
          setUser(res_data.user);
        };

        getData();
      } catch (e) {
        logoutHandler();
      }
    }
  }, [user]);

  const logoutHandler = useCallback(() => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
  }, []);

  const loginHandler = (token: string, user: any) => {
    setToken(token);
    setUser(user);
    localStorage.setItem('token', token);
  };

  const contextValue: AuthContextProps = {
    token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
    user,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props?.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
