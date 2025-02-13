import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';

// Define the Product type
interface Product {
  name: string;
  price: number;
}

const Products: React.FC = () => {
  const [loggedInUser, setLoggedInUser] = useState<string | null>('');
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setLoggedInUser(localStorage.getItem('loggedInUser'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    handleSuccess('User Logged out');
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };
  

  const fetchProducts = async () => {
    try {
      const url = "http://localhost:8080/products";
      const headers = {
        headers: {
          'Authorization': localStorage.getItem('token') || '',
        },
      };
      const response = await fetch(url, headers);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result: Product[] = await response.json();
      if (!result) {
        throw new Error(`No products available`);
      }
      setProducts(result);
    } catch (err: unknown) {
        if (err instanceof Error) {
          handleError(err.message);
        } else {
          handleError('An unknown error occurred');
        }
    } 
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
    <div className='container'>
      <h1>Welcome {loggedInUser}</h1>
      <button onClick={handleLogout}>Logout</button>
      <div>
        {products && products.map((item, index) => (
          <ul key={index}>
            <span>{item.name} : {item.price}</span>
          </ul>
        ))}
      </div>
    </div>
    <ToastContainer />
    </div>
  );
};

export default Products;
