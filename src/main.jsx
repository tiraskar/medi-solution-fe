import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Toaster } from 'react-hot-toast';
import 'antd/dist/reset.css'; // for Ant Design v5+


createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <>
    <Toaster
      position="top-right"
      reverseOrder={false}
    />
    <App />
  </>
  // </StrictMode>,
);
