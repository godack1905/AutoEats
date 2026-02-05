import api from './api';

export interface IngredientData {
  id: string;
  categoria: string;
  name: string;
  standardUnit: string;
  allowedMeasures: string[];
}

export const ingredientsApi = {
  // Search ingredients
  search: async (query: string) => {
    const response = await api.get('/api/ingredients', { params: { query } });
    return response.data;
  },

  // Get all ingredients
  getAll: async () => {
    const response = await api.get('/api/ingredients');
    return response.data;
  },

  // Obtain by name
  getByName: async (name: string) => {
    const response = await api.get(`/api/ingredients/${name}`);
    return response.data;
  },

  // Obtain by category
  getByCategory: async (category: string) => {
    const response = await api.get(`/api/ingredients/category/${category}`);
    return response.data;
  },
};