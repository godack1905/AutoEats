import { useState, useEffect } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday, 
  addMonths, 
  subMonths,
  startOfWeek,
  endOfWeek
} from 'date-fns';

import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useMealPlanStore } from '../store/mealPlanStore';
import { useRecipeStore } from '../store/recipeStore';
import MealPlanModal from '../components/ai/MealPlanModal';
import AIGenerateModal from '../components/ai/AIGenerateModal';

import { useTranslation } from "react-i18next";
import { es, enUS } from 'date-fns/locale';

const locales = {
  en: enUS,
  es: es,
};

const CalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAIGenerate, setShowAIGenerate] = useState(false);
  const { mealPlans, fetchMealPlans, upsertMealPlan } = useMealPlanStore();
  const { recipes, fetchRecipes } = useRecipeStore();
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || '').split('-')[0] as keyof typeof locales;
  const dfLocale = locales[lang] ?? es;

  useEffect(() => {
    // Load meal plans for current month +/- 1 month to have some buffer
    const start = format(subMonths(currentMonth, 1), 'yyyy-MM-dd');
    const end = format(addMonths(currentMonth, 1), 'yyyy-MM-dd');
    fetchMealPlans(start, end);
    fetchRecipes(); // Load recipes for AI generation
  }, [currentMonth, fetchMealPlans, fetchRecipes]);

  // Get weeks in the current month for calendar display
  const getCalendarWeeks = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    
    // Beginning of the week is monday
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    // End of the week is sunday
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    
    // Obtain all days in the interval
    const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    
    // Group days into weeks
    const weeks = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      weeks.push(calendarDays.slice(i, i + 7));
    }
    
    return weeks;
  };

  const getMealPlanForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return mealPlans.find(plan => {
      const planDate = new Date(plan.date);
      return format(planDate, 'yyyy-MM-dd') === dateStr;
    });
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
  };

  const handleAIGenerate = async (mealPlans) => {
    try {
      // Save each meal plan
      const promises = Object.entries(mealPlans).map(([date, meals]) => {
        return upsertMealPlan({ date, meals });
      });
      
      await Promise.all(promises);
      
      // Reload meal plans
      const start = format(subMonths(currentMonth, 1), 'yyyy-MM-dd');
      const end = format(addMonths(currentMonth, 1), 'yyyy-MM-dd');
      fetchMealPlans(start, end);
      
      setShowAIGenerate(false);
      alert(t("calendar.aiSuccess", { days: Object.keys(mealPlans).length }));
    } catch (error) {
      console.error('Error saving meal plans:', error);
      alert(t("calendar.aiError"));
    }
  };

  const calendarWeeks = getCalendarWeeks();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{t("calendar.title")}</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              setShowAIGenerate(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            <Sparkles className="w-5 h-5" />
            <span>{t("calendar.aiPlan")}</span>
          </button>
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold text-gray-700">
              {format(currentMonth, 'MMMM yyyy', { locale: dfLocale  })}
            </h2>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="grid grid-cols-7 gap-2 mb-4">
          {t("calendar.weekdays", { returnObjects: true }).map(day => (
            <div key={day} className="p-4 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-rows-6 gap-2">
          {calendarWeeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-2">
              {week.map(day => {
                const mealPlan = getMealPlanForDate(day);
                const hasMeals = mealPlan && Object.values(mealPlan.meals).some(meals => meals.length > 0);
                const isCurrentMonth = isSameMonth(day, currentMonth);

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => handleDayClick(day)}
                    className={`
                      p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors min-h-[120px]
                      ${isToday(day) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                      ${!isCurrentMonth ? 'text-gray-400 bg-gray-50' : 'text-gray-900'}
                    `}
                  >
                    <div className={`text-sm font-medium mb-2 ${isToday(day) ? 'text-blue-600' : ''}`}>
                      {format(day, 'd')}
                    </div>
                    {isCurrentMonth && hasMeals && (
                      <div className="space-y-1">
                        {Object.entries(mealPlan.meals).map(([mealType, meals]) =>
                          meals.length > 0 && (
                            <div key={mealType} className="text-xs text-gray-600 truncate">
                              {mealType === 'breakfast' && t("calendar.mealType.breakfast")}
                              {mealType === 'snack' && t("calendar.mealType.snack")}
                              {mealType === 'lunch' && t("calendar.mealType.lunch")}
                              {mealType === 'afternoonSnack' && t("calendar.mealType.afternoonSnack")}
                              {mealType === 'dinner' && t("calendar.mealType.dinner")}
                              : {meals.map(m => m.recipe?.title || 'Receta').slice(0, 2).join(', ')}{meals.length > 2 ? '...' : ''}
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {selectedDate && (
        <MealPlanModal
          date={selectedDate}
          onClose={() => setSelectedDate(null)}
        />
      )}

      {showAIGenerate && (
        <AIGenerateModal
          onClose={() => {
            setShowAIGenerate(false);
          }}
          onGenerate={handleAIGenerate}
          recipes={recipes}
        />
      )}
    </div>
  );
};

export default CalendarPage;