import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Check } from 'lucide-react';
import { useIngredients } from '../../hooks/useIngredients';
import type { IngredientData } from '../../lib/ingredientsApi';

interface IngredientSelectorProps {
  value: {
    ingredient: string; // ID o nombre
    quantity: number;
    unit: string;
  };
  onChange: (value: { ingredient: string; quantity: number; unit: string }) => void;
  onRemove?: () => void;
  index: number;
}

const IngredientSelector: React.FC<IngredientSelectorProps> = ({
  value,
  onChange,
  onRemove,
  index,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState<IngredientData | null>(null);
  const { searchIngredients, getIngredientById, getDefaultUnit } = useIngredients();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const suggestions = searchIngredients(searchQuery);

  // Cargar ingrediente seleccionado
  useEffect(() => {
    if (value.ingredient && !selectedIngredient) {
      // Si es un ID, buscar el ingrediente
      if (value.ingredient.match(/^\d{6}$/)) {
        const ingredient = getIngredientById(value.ingredient);
        if (ingredient) {
          setSelectedIngredient(ingredient);
          setSearchQuery(ingredient.names.es);
        }
      } else {
        // Si es un nombre, buscar coincidencia
        const results = searchIngredients(value.ingredient);
        if (results.length > 0) {
          setSelectedIngredient(results[0]);
          setSearchQuery(results[0].names.es);
        } else {
          setSearchQuery(value.ingredient);
        }
      }
    }
  }, [value.ingredient]);

  const handleSelectIngredient = (ingredient: IngredientData) => {
    setSelectedIngredient(ingredient);
    setSearchQuery(ingredient.names.es);
    setShowSuggestions(false);
    
    onChange({
      ingredient: ingredient.id,
      quantity: value.quantity || 1,
      unit: value.unit || getDefaultUnit(ingredient.id),
    });
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseFloat(e.target.value) || 0;
    onChange({
      ...value,
      quantity: newQuantity,
    });
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...value,
      unit: e.target.value,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowSuggestions(true);
    
    if (!query.trim()) {
      setSelectedIngredient(null);
      onChange({
        ...value,
        ingredient: '',
      });
    }
  };

  // Cerrar sugerencias al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-2 p-4 bg-gray-50 rounded-lg" ref={wrapperRef}>
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-gray-700">Ingrediente {index + 1}</span>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-red-500 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Búsqueda de ingrediente */}
      <div className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Buscar ingrediente..."
            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Sugerencias */}
        {showSuggestions && searchQuery && suggestions.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
            {suggestions.map((ingredient) => (
              <button
                key={ingredient.id}
                type="button"
                onClick={() => handleSelectIngredient(ingredient)}
                className="w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">{ingredient.names.es}</div>
                  <div className="text-sm text-gray-500">{ingredient.names.en}</div>
                </div>
                {selectedIngredient?.id === ingredient.id && (
                  <Check className="h-4 w-4 text-green-500" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Cantidad y unidad */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cantidad
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={value.quantity}
            onChange={handleQuantityChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Unidad
          </label>
          <select
            value={value.unit}
            onChange={handleUnitChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!selectedIngredient}
          >
            {selectedIngredient ? (
              selectedIngredient.allowedUnits.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))
            ) : (
              <option value="unit">Seleccione ingrediente</option>
            )}
          </select>
        </div>
      </div>

      {/* Info del ingrediente seleccionado */}
      {selectedIngredient && (
        <div className="mt-2 p-2 bg-blue-50 rounded-lg">
          <div className="text-sm">
            <span className="font-medium text-blue-800">
              {selectedIngredient.names.es}
            </span>
            <span className="text-blue-600 ml-2">
              ({selectedIngredient.categoria})
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default IngredientSelector;