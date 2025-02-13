import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './main-index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import 'react-toastify/ReactToastify.css';

// Ensure TypeScript knows the element will not be null with a non-null assertion (!)
const rootElement = document.getElementById('root') as HTMLElement; /*?*/

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
