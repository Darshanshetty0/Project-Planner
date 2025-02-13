import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Define the type for the setIsAuthenticated prop
interface RefreshHandlerProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const RefreshHandler: React.FC<RefreshHandlerProps> = ({ setIsAuthenticated }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setIsAuthenticated(true);
      if (
        location.pathname === '/' ||
        location.pathname === '/login' ||
        location.pathname === '/signup'
      ) {
        navigate('/home/*', { replace: false });
      }
    }
  }, [location, navigate, setIsAuthenticated]);

  return null;
};

export default RefreshHandler;
