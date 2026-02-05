export const MEAL_TYPE_TAGS = [
  // Type of meals
  'breakfast',
  'launch', 
  'snack',
  'dinner',
  
  // Type of dishes
  'uniqueDish',
  'firstCourse',
  'secondCourse',
  'starter',
  'dessert',
  'sideDish',
  
  // Characteristics
  'healthy',
  'vegetarian',
  'vegan',
  'economical',
  'special',
  
  // Primary ingredients
  'meat',
  'chicken',
  'fish',
  'seafood',
  'vegetables',
  'pasta',
  'rice',
  'eggs',
  'legumes',
  'cheese',
  'fruit'
] as const;

export type MealTag = typeof MEAL_TYPE_TAGS[number];

// Grouping tags into categories
export const TAG_CATEGORIES = {
  'typeOfMeal': ['breakfast', 'launch', 'snack', 'dinner'],
  'typeOfDish': ['uniqueDish', 'firstCourse', 'secondCourse', 'starter', 'dessert', 'sideDish'],
  'characteristics': ['healthy', 'vegetarian', 'vegan', 'economical', 'special'],
  'primaryIngredients': ['meat', 'chicken', 'fish', 'seafood', 'vegetables', 'pasta', 'rice', 'eggs', 'legumes', 'cheese', 'fruit']
} as const;

// Tag validation function
export function isValidTag(tag: string): boolean {
  return MEAL_TYPE_TAGS.includes(tag as MealTag);
}