import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { ChatBubbleLeftRightIcon, UserCircleIcon, AdjustmentsHorizontalIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { ArrowLeftOnRectangleIcon } from './icons';
import { NAVIGATION_ITEMS } from '../constants';
import { AppContext } from '../contexts/AppContext';

const navItems = [
  { to: '/coach-ia', icon: ChatBubbleLeftRightIcon, label: 'Coach IA' },
  { to: '/test-profil', icon: UserCircleIcon, label: 'Test Profil' },
  { to: '/adaptabilite', icon: AdjustmentsHorizontalIcon, label: 'Adaptabilité' },
  { to: '/fiches-profils', icon: DocumentTextIcon, label: 'Fiches Profils' },
];

const BottomNavBar: React.FC = () => {
  const { signOut } = useContext(AppContext);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-t-lg border-t border-slate-200 z-50">
      <div className="max-w-screen-xl mx-auto px-2 sm:px-4">
        <ul className="flex justify-around items-center h-16">
          {NAVIGATION_ITEMS.map((item) => (
            <li key={item.path} className="flex-1 text-center">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `inline-flex flex-col items-center justify-center px-2 py-1 rounded-md transition-colors duration-150 ease-in-out group ${
                    isActive
                      ? 'text-sky-600'
                      : 'text-slate-500 hover:text-sky-500 hover:bg-sky-50'
                  }`
                }
              >
                <item.icon className="w-6 h-6 mb-0.5" />
                <span className="text-xs font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
          <li className="flex-1 text-center">
            <button
              onClick={signOut}
              className="inline-flex flex-col items-center justify-center px-2 py-1 rounded-md transition-colors duration-150 ease-in-out group text-slate-500 hover:text-red-500 hover:bg-red-50"
            >
              <ArrowLeftOnRectangleIcon className="w-6 h-6 mb-0.5" />
              <span className="text-xs font-medium">Déconnexion</span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default BottomNavBar;
