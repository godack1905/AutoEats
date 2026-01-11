import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChefHat, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <ChefHat className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-800">Recipe Manager</span>
          </Link>

          {/* User Info */}
          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-700">
                <User className="h-5 w-5" />
                <span>{user.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-red-600 hover:text-red-800 transition px-3 py-2 rounded-lg hover:bg-red-50"
              >
                <LogOut className="h-5 w-5" />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;