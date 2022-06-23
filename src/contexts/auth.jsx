import { createContext, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { createSession} from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const recoveredUser = localStorage.getItem('user');

    if (recoveredUser) {
      setUser(JSON.parse(recoveredUser));
    }

    setLoading(false);
  }, [])

  const login = async ( email, password ) => {
    
    const response = await createSession(email, password);

    console.log("login", response.data);

    const loggedUser = response.data.user;
    const token = response.data.token;

    localStorage.setItem("user", JSON.stringify(loggedUser));
    localStorage.setItem("token", JSON.stringify(token));

    setUser(loggedUser);
    navigate("/");
  };

  const logout = () => {
    console.log("logout");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate('/login');
  };

  return(
    <AuthContext.Provider value={{ authenticated: !!user, user, loading, login, logout }} >
      {children}
    </AuthContext.Provider>
  )
}