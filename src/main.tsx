import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ToastProvider } from './context/ToastContext';
import { RouterProvider } from './context/RouterContext';
import { AuthProvider } from './context/AuthContext';
import { EventDataProvider } from './context/EventDataContext';

createRoot(document.getElementById('root')!).render(
  <ToastProvider>
    <RouterProvider>
      <AuthProvider>
        <EventDataProvider>
          <App />
        </EventDataProvider>
      </AuthProvider>
    </RouterProvider>
  </ToastProvider>
);

