import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../lib/authApi';
import toast from 'react-hot-toast';

interface User {
  id: string;  // ✅ Usa 'id' (sin guión bajo)
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ loading: true, error: null });
        try {
          const response = await authApi.login({ email, password });
          
          // DEBUG: Verifica que el usuario tenga 'id'
          console.log('🔐 Login response:', response);
          console.log('👤 User from API:', response.user);
          console.log('🆔 User ID (should be "id"):', response.user?.id);
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            loading: false,
          });
          toast.success('¡Inicio de sesión exitoso!');
        } catch (error: any) {
          const message = error.response?.data?.error || 'Error al iniciar sesión';
          set({ error: message, loading: false });
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
    }
  )
);