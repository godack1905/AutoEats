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
  difficulty: 'easy' | 'medium' | 'hard';
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
  difficulty: 'easy' | 'medium' | 'hard';
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
  // Obtain all recipes
  getAll: async (params?: { search?: string; page?: number; limit?: number }) => {
    const response = await api.get('/api/recipes', { params });
    return response.data;
  },

  // Obtain recipe by ID
  getById: async (id: string) => {
    const response = await api.get(`/api/recipes/${id}`);
    return response.data;
  },

  // Create recipe
  create: async (data: CreateRecipeData) => {
    const response = await api.post('/api/recipes', data);
    return response.data;
  },

  // Update recipe
  update: async (id: string, data: Partial<CreateRecipeData>): Promise<Recipe> => {
    const response = await api.put(`/api/recipes/${id}`, data);
    return response.data;
  },

  // Delete recipe
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/recipes/${id}`);
  },

  // Toggle favorite
  toggleFavorite: async (id: string) => {
    const response = await api.post(`/api/recipes/${id}/favorite`);
    return response.data;
  },

  // Obtain favorites
  getFavorites: async () => {
    const response = await api.get('/api/recipes/user/favorites');
    return response.data;
  },
};