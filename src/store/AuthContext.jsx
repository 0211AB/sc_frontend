import React, { useState, useCallback, useEffect } from 'react';

const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  login: () => { },
  logout: () => { },
  user: null,
});

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem('token');
  return storedToken ? { token: storedToken } : { token: '' };
};

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();

  const [token, setToken] = useState(tokenData.token);
  const [user, setUser] = useState(null); // Use a more generic type for user

  const userIsLoggedIn = !!token;

  useEffect(() => {
    if (userIsLoggedIn && user === null) {
      try {
        const getData = async () => {
          const res = await fetch(`${process.env.REACT_APP_BASE_URL}/user/verify`, {
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
    // eslint-disable-next-line
  }, [user]);

  const logoutHandler = useCallback(() => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
  }, []);

  const loginHandler = (token, user) => {
    setToken(token);
    setUser(user);
    localStorage.setItem('token', token);
  };

  const contextValue = {
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
