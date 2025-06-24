
import React, { useState } from 'react';
import { APP_NAME } from '../constants';
import { UserIcon, LockIcon, LightBulbIcon } from './icons';

interface AuthScreenProps {
  onAuthSuccess: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = () => {
    // Mock authentication: simply call onAuthSuccess
    // In a real app, this would involve API calls to Supabase or other backend
    onAuthSuccess();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-sky-700 p-4">
      <div className="bg-white p-8 md:p-12 rounded-xl shadow-2xl w-full max-w-md transform transition-all hover:scale-105 duration-300">
        <div className="text-center mb-8">
          <LightBulbIcon className="w-16 h-16 text-sky-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-slate-800">{APP_NAME}</h1>
          <p className="text-slate-600 mt-2">Identifiez, comprenez, adaptez-vous.</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleAuth(); }}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Adresse e-mail
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                required
              />
            </div>
          </div>

          <div className="mb-8">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockIcon className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 transition-all duration-150 ease-in-out transform hover:-translate-y-0.5"
          >
            Se connecter
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-600">
          Pas encore de compte ?{' '}
          <button
            onClick={handleAuth} // Mock: "Créer un compte" also leads to app
            className="font-medium text-sky-600 hover:text-sky-500 hover:underline"
          >
            Créer un compte
          </button>
        </p>
         <p className="mt-4 text-center text-xs text-slate-500">
            Phase 1: Authentification factice. Cliquez pour entrer.
        </p>
      </div>
    </div>
  );
};

export default AuthScreen;
