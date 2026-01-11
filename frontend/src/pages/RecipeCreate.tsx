// @ts-ignore
import AddRecipeForm from '../components/recipes/AddRecipeForm';

const RecipeCreate = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Crear Nueva Receta</h1>
        <p className="text-gray-600">Comparte tu creación culinaria con la comunidad</p>
      </div>
      
      <AddRecipeForm />
    </div>
  );
};

export default RecipeCreate;