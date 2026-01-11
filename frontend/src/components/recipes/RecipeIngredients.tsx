import React, { useState, useEffect, useMemo } from 'react';
import { Package, CheckCircle, AlertCircle } from 'lucide-react';
import { useIngredients } from '../../hooks/useIngredients';
import type { IngredientData } from '../../lib/ingredientsApi';

interface RecipeIngredient {
  ingredient: string;
  quantity: number;
  unit: string;
}

// Cuando el backend envía el ingrediente ya con nombre, se incluye opcionalmente
// `ingredientName` y `category` para evitar peticiones adicionales.
interface RecipeIngredientWithName extends RecipeIngredient {
  ingredientName?: string;
  category?: string;
}

interface RecipeIngredientsProps {
  ingredients: RecipeIngredientWithName[];
  title?: string;
}

const RecipeIngredients: React.FC<RecipeIngredientsProps> = ({
  ingredients,
  title = 'Ingredientes',
}) => {
  const { fetchIngredientsByIds, getIngredientName, getIngredientCategory } = useIngredients();
  const [loadedIngredients, setLoadedIngredients] = useState<Map<string, IngredientData>>(new Map());
  const [loading, setLoading] = useState(true);

  // Memoizar los IDs de ingredientes para evitar re-cálculos
  // Solo pedir IDs que sean numéricos y que NO vengan ya con `ingredientName` desde el backend
  const ingredientIds = useMemo(() => {
    const ids: string[] = [];
    ingredients.forEach((ing) => {
      if (!ing.ingredientName && typeof ing.ingredient === 'string' && /^\d{6}$/.test(ing.ingredient)) {
        ids.push(ing.ingredient);
      }
    });
    return ids;
  }, [ingredients]);

  const uniqueIds = useMemo(() => [...new Set(ingredientIds)], [ingredientIds]);

  // Cargar ingredientes solo cuando cambian los IDs
  useEffect(() => {
    let isMounted = true;
    
    const loadIngredients = async () => {
      if (uniqueIds.length === 0) {
        if (isMounted) {
          setLoading(false);
        }
        return;
      }
      
      try {
        setLoading(true);
        
        console.log(`🔄 Loading ${uniqueIds.length} unique ingredients...`);
        const fetchedIngredients = await fetchIngredientsByIds(uniqueIds);
        
        if (isMounted) {
          // Crear mapa para acceso rápido
            const ingredientMap = new Map<string, IngredientData>();
            fetchedIngredients.forEach(ing => {
              ingredientMap.set(ing.id, ing);
            });
          
          setLoadedIngredients(ingredientMap);
          console.log(`✅ Ingredients loaded: ${fetchedIngredients.length}/${uniqueIds.length}`);
        }
      } catch (error) {
        console.error('❌ Error loading recipe ingredients:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadIngredients();
    
    return () => {
      isMounted = false;
    };
  }, [uniqueIds, fetchIngredientsByIds]);

  // Calcular estadísticas memoizadas
  const stats = useMemo(() => {
    const loaded = Array.from(loadedIngredients.values()).length;
    return {
      total: ingredients.length,
      loaded,
      missing: uniqueIds.length - loaded,
    };
  }, [ingredients.length, loadedIngredients, uniqueIds.length]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Cargando ingredientes...</p>
          </div>
        </div>
      </div>
    );
  }

  // Memoizar la lista de ingredientes renderizada
  const ingredientList = useMemo(() => {
    return (ingredients as RecipeIngredientWithName[]).map((ingredient, index) => {
      const ingredientInfo = loadedIngredients.get(ingredient.ingredient);
      const displayName = ingredient.ingredientName || getIngredientName(ingredient.ingredient);
      const category = ingredient.category || getIngredientCategory(ingredient.ingredient);
      const isID = typeof ingredient.ingredient === 'string' && /^\d{6}$/.test(ingredient.ingredient);
      
      return (
        <div key={`${ingredient.ingredient}-${index}`} className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
            <span className="text-blue-600 text-sm font-bold">{index + 1}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center">
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline flex-wrap">
                  <span className={`font-medium truncate mr-2 ${
                    ingredientInfo ? 'text-gray-900' : 'text-amber-700'
                  }`}>
                    {displayName}
                  </span>
                  <span className="text-gray-600 whitespace-nowrap">
                    {ingredient.quantity} {ingredient.unit}
                  </span>
                </div>
                
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  {ingredientInfo ? (
                    <>
                      {category && category !== 'Sin categoría' && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          {category}
                        </span>
                      )}
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">
                        ✅ Verificado
                      </span>
                    </>
                  ) : isID ? (
                    <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      ID no encontrado: {ingredient.ingredient}
                    </span>
                  ) : (
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      📝 Por nombre
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  }, [ingredients, loadedIngredients, getIngredientName, getIngredientCategory]);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* Header con estadísticas */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Package className="h-5 w-5 mr-2" />
          {title}
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({stats.total})
          </span>
        </h2>
        
        <div className="flex items-center space-x-2">
          {stats.loaded > 0 && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
              <CheckCircle className="h-3 w-3 mr-1" />
              {stats.loaded} cargados
            </span>
          )}
          {stats.missing > 0 && (
            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              {stats.missing} no encontrados
            </span>
          )}
        </div>
      </div>

      {/* Lista de ingredientes */}
      <div className="space-y-2">
        {ingredientList}
      </div>

      {/* Pie de página con resumen */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          {stats.missing === 0 ? (
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-4 w-4 mr-2" />
              Todos los ingredientes fueron cargados correctamente
            </div>
          ) : (
            <div className="flex items-center text-amber-600">
              <AlertCircle className="h-4 w-4 mr-2" />
              {stats.missing} ingrediente(s) no se encontraron en la base de datos
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeIngredients;