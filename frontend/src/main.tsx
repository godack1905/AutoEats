import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { useAuthStore } from './store/authStore';
import './index.css';

// Componente wrapper para inicializar la autenticación
const AppWrapper = () => {
  const { initializeAuth, initialLoading } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (initialLoading) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }

  return <App />;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);