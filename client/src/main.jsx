import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import axios from 'axios'; // 1. הוספנו את הייבוא הזה
import App from './App.jsx';
import './index.css';

// 2. הוספנו את הגדרות האבטחה הגלובליות ל-Axios
axios.defaults.withCredentials = true; 
axios.defaults.xsrfCookieName = 'XSRF-TOKEN'; 
axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';

// Create a client for React Query
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster position="bottom-center" />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);