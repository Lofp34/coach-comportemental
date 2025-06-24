
import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAVIGATION_ITEMS } from '../constants';

const BottomNavBar: React.FC = () => {
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
        </ul>
      </div>
    </nav>
  );
};

export default BottomNavBar;
