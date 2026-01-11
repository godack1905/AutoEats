import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChefHat, Plus, Search, Edit, Trash2, Clock, Users, Heart, Globe, Lock } from 'lucide-react';
import { useRecipeStore } from '../store/recipeStore';
import { useAuthStore } from '../store/authStore';

const Recipes = () => {
  const [search, setSearch] = useState('');
  const { recipes, loading, fetchRecipes, deleteRecipe, toggleFavorite, isFavorite } = useRecipeStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(search.toLowerCase()) ||
    recipe.description?.toLowerCase().includes(search.toLowerCase()) ||
    recipe.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de que quieres eliminar esta receta?')) {
      try {
        await deleteRecipe(id); // Ya no necesitamos verificar el resultado
      } catch (error) {
        // El error ya se maneja en el store con toast
        console.error('Error al eliminar receta:', error);
      }
    }
  };

  const handleToggleFavorite = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleFavorite(id);
  };

  const handleCardClick = (id: string) => {
    navigate(`/recipes/${id}`);
  };

  if (loading && recipes.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Recetas</h1>
            <p className="text-gray-600 mt-2">
              {recipes.length} {recipes.length === 1 ? 'receta' : 'recetas'} en total
            </p>
          </div>
          <Link
            to="/recipes/new"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Receta
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar recetas por título, descripción o etiquetas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => {
          const isOwner = user?.id === recipe.createdBy._id;
          const isFavoriteRecipe = isFavorite(recipe.id);

          console.log('Receta:', recipe.title);
          console.log('Usuario actual ID:', user?.id);
          console.log('Creador receta ID:', recipe.createdBy._id);
          console.log('isOwner:', isOwner);
          console.log('recipe.createdBy:', recipe.createdBy);
          
          return (
            <div 
              key={recipe.id} 
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleCardClick(recipe.id)}
            >
              {/* Recipe Image Placeholder */}
              <div className="h-48 bg-gradient-to-r from-blue-100 to-green-100 flex items-center justify-center relative">
                <ChefHat className="h-16 w-16 text-blue-600" />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex space-x-2">
                  {recipe.isPublic ? (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                      <Globe className="h-3 w-3 mr-1" />
                      Pública
                    </span>
                  ) : (
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full flex items-center">
                      <Lock className="h-3 w-3 mr-1" />
                      Privada
                    </span>
                  )}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    recipe.difficulty === 'Fácil' ? 'bg-green-100 text-green-800' :
                    recipe.difficulty === 'Media' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {recipe.difficulty}
                  </span>
                </div>
                
                {/* Favorite button */}
                <button
                  onClick={(e) => handleToggleFavorite(recipe.id, e)}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow hover:bg-gray-50"
                >
                  <Heart className={`h-5 w-5 ${isFavoriteRecipe ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
                </button>
              </div>
              
              {/* Recipe Content */}
              <div className="p-6">
                <div className="mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 line-clamp-1 hover:text-blue-600">
                    {recipe.title}
                  </h3>
                  <p className="text-sm text-gray-500">Por {recipe.createdBy.username}</p>
                </div>
                
                {recipe.description && (
                  <p className="text-gray-600 mb-4 line-clamp-2">{recipe.description}</p>
                )}
                
                {/* Recipe Info */}
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{recipe.servings} personas</span>
                  </div>
                </div>
                
                {/* Tags */}
                {recipe.tags && recipe.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-6">
                    {recipe.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                    {recipe.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{recipe.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
                
                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/recipes/${recipe.id}/edit`);
                    }}
                    disabled={!isOwner}
                    className={`flex-1 flex items-center justify-center px-4 py-2 border rounded-lg ${
                      isOwner 
                        ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        : 'border-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                    title={isOwner ? 'Editar receta' : 'Solo el creador puede editar'}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </button>
                  <button
                    onClick={(e) => handleDelete(recipe.id, e)}
                    disabled={!isOwner}
                    className={`flex-1 flex items-center justify-center px-4 py-2 border rounded-lg ${
                      isOwner 
                        ? 'border-red-300 text-red-700 hover:bg-red-50'
                        : 'border-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                    title={isOwner ? 'Eliminar receta' : 'Solo el creador puede eliminar'}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredRecipes.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full p-4 inline-flex">
            <Search className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No se encontraron recetas</h3>
          <p className="mt-2 text-gray-600">
            {search ? 'Intenta con otros términos de búsqueda.' : 'Crea tu primera receta.'}
          </p>
          {!search && (
            <div className="mt-6">
              <Link
                to="/recipes/new"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear primera receta
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Recipes;