import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../lib/authApi';
import api from '../lib/api'; // Importa tu instancia de axios
import toast from 'react-hot-toast';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  initialLoading: boolean; // Para carga inicial
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  initializeAuth: () => Promise<void>; // Nuevo método
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      initialLoading: true, // Empieza en true
      error: null,

      initializeAuth: async () => {
        const token = localStorage.getItem('token');
        
        if (!token) {
          set({ initialLoading: false });
          return;
        }
        
        try {
          // Configurar el token en axios
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Opcional: Hacer una petición para verificar el token
          // const response = await api.get('/auth/verify');
          // Si es exitoso, establecer el usuario
          
          set({ 
            token,
            isAuthenticated: true,
            initialLoading: false 
          });
        } catch (error) {
          // Token inválido, limpiar
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
          set({ 
            token: null,
            isAuthenticated: false,
            initialLoading: false 
          });
        }
      },

      login: async (email: string, password: string) => {
        set({ loading: true, error: null });
        try {
          const response = await authApi.login({ email, password });
          
          // Guardar token en localStorage y configurar axios
          localStorage.setItem('token', response.token);
          api.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            loading: false,
            initialLoading: false,
          });
          toast.success('¡Inicio de sesión exitoso!');
        } catch (error: any) {
          const message = error.response?.data?.error || 'Error al iniciar sesión';
          set({ error: message, loading: false, initialLoading: false });
          toast.error(message);
        }
      },

      register: async (username: string, email: string, password: string) => {
        set({ loading: true, error: null });
        try {
          await authApi.register({ username, email, password });
          set({ loading: false });
          toast.success('¡Registro exitoso! Ahora puedes iniciar sesión.');
        } catch (error: any) {
          const message = error.response?.data?.error || 'Error al registrar';
          set({ error: message, loading: false });
          toast.error(message);
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        toast.success('Sesión cerrada');
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      // Solo persistir estos campos
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);