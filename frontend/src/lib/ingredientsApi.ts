import api from './api';

export interface IngredientData {
  id: string;
  categoria: string;
  names: {
    es: string;
    en: string;
  };
  allowedUnits: string[];
}

export const ingredientsApi = {
  // Buscar ingredientes
  search: async (query: string, lang: 'es' | 'en' = 'es') => {
    const response = await api.get('/ingredients', { params: { query, lang } });
    return response.data;
  },

  // Obtener todos los ingredientes
  getAll: async (lang: 'es' | 'en' = 'es') => {
    const response = await api.get('/ingredients', { params: { lang } });
    return response.data;
  },

  // Obtener por ID
  getById: async (id: string) => {
    const response = await api.get(`/ingredients/${id}`);
    return response.data;
  },

  // Obtener por categoría
  getByCategory: async (category: string) => {
    const response = await api.get(`/ingredients/category/${category}`);
    return response.data;
  },
};