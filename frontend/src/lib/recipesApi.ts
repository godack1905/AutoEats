import api from './api';

export interface Ingredient {
  ingredient: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  servings: number;
  prepTime?: number;
  difficulty: 'Fácil' | 'Media' | 'Difícil';
  ingredients: Ingredient[];
  steps: string[];
  tags: string[];
  createdBy: {
    _id: string;
    username: string;
  };
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRecipeData {
  title: string;
  description?: string;
  servings: number;
  prepTime?: number;
  difficulty: 'Fácil' | 'Media' | 'Difícil';
  ingredients: {
    ingredient: string; // nombre del ingrediente
    quantity: number;
    unit: string;
  }[];
  steps: string[];
  tags: string[];
  isPublic: boolean;
}

export const recipesApi = {
  // Obtener todas las recetas
  getAll: async (params?: { search?: string; page?: number; limit?: number }) => {
    const response = await api.get('/api/recipes', { params });
    return response.data;
  },

  // Obtener receta por ID
  getById: async (id: string) => {
    const response = await api.get(`/api//recipes/${id}`);
    return response.data;
  },

  // Crear receta
  create: async (data: CreateRecipeData) => {
    const response = await api.post('/api//recipes', data);
    return response.data;
  },

  // Actualizar receta
  update: async (id: string, data: Partial<CreateRecipeData>): Promise<Recipe> => {
    const response = await api.put(`/api//recipes/${id}`, data);
    return response.data;
  },

  // Eliminar receta
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/recipes/${id}`);
  },

  // Alternar favorito
  toggleFavorite: async (id: string) => {
    const response = await api.post(`/api/recipes/${id}/favorite`);
    return response.data;
  },

  // Obtener favoritos
  getFavorites: async () => {
    const response = await api.get('/api/recipes/user/favorites');
    return response.data;
  },
};