import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';

// Define the type for the login information
interface LoginInfo {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [loginInfo, setLoginInfo] = useState<LoginInfo>({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginInfo({ ...loginInfo, [name]: value });
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = loginInfo;

    if (!email || !password) {
      return handleError('Email and password are required');
    }

    try {
      const url = `http://localhost:8080/auth/login`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginInfo),
      });

      const result = await response.json();
      const { success, message, jwtToken, error, name} = result;

      if (success) {
        handleSuccess(message);
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('loggedInUser', name);
        setTimeout(() => {
          navigate('/home');
        }, 1000);
      } else if (error) {
        handleError(error?.details[0]?.message || 'An error occurred');
      } else {
        handleError(message);
      }
    } catch (err: unknown) {
        if (err instanceof Error) {
            handleError(err.message);
        } else {
            handleError('An unknown error occurred');
        }
    } 
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", minWidth: "100vw"}}>
    <div className='container'>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor='email'>Email</label>
          <input
            onChange={handleChange}
            type='email'
            name='email'
            placeholder='Enter your email...'
            value={loginInfo.email}
          />
        </div>
        <div>
          <label htmlFor='password'>Password</label>
          <input
            onChange={handleChange}
            type='password'
            name='password'
            placeholder='Enter your password...'
            value={loginInfo.password}
          />
        </div>
        <button type='submit'>Login</button>
        <span>
          Doesn't have an account? <Link to='/signup'>Signup</Link>
        </span>
      </form>
    </div>
    </div>
  );
};

export default Login;
