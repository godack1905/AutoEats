import React from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, BookOpen, PlusCircle } from 'lucide-react';
import { t } from 'i18next';

const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/recipes', icon: BookOpen, label: t("recipes"), end: true},
    { to: '/new-recipe', icon: PlusCircle, label: t("recipe.createRecipe") },
    { to: '/calendar', icon: Calendar, label: t("calendar.calendar") }
  ];

  return (
    <aside className="w-64 bg-white shadow-lg min-h-[calc(100vh-80px)]">
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;