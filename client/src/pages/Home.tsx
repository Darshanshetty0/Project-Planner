import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { handleSuccess } from '../utils';
import Navbar from '../components/Navbar';
import Employees from './HomePages/Employees';
import Projects from './HomePages/Projects';
import Calendar from './HomePages/Calendars';
import Sidebar from '../components/Sidebar';
import Dashboard from './HomePages/Dashboard';

const Home: React.FC = () => {
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoggedInUser(localStorage.getItem('loggedInUser'));

    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return; 
      }
  
      try {
        const response = await fetch('http://localhost:8080/home/auth/validate', {
          headers: {
            'Authorization': token,
          },
        });
  
        if (!response.ok) {
          throw new Error('Invalid token 1');
        }
  
        const data = await response.json();
        if (!data.valid) {
          throw new Error('Invalid token 2');
        }
        
        console.log('User authenticated:', data.user);
      } catch (error) {
        console.error(error);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    validateToken();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('loggedInEmail');
    handleSuccess('User Logged out');
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  }

  return (
    <>
    <Navbar username={loggedInUser} onLogout={handleLogout} />
    <div style={{display: 'flex', flexDirection: 'column'}}>
        <div className="content" style={{display: 'flex', flexDirection: 'row'}}>
          <Sidebar/>
          <div>
            <div>
              <Routes>
                <Route path="/*" element={<Calendar />} />
                <Route path="/dashboard" element={<Dashboard/>} />
                <Route path="/employees/*" element={<Employees />} />
                <Route path="/projects/*" element={<Projects />} />
                <Route path="/calendar/*" element={<Calendar/>} />
              </Routes>
            </div>
          </div>
        </div>
    </div>
    </>
  );
};

export default Home;
