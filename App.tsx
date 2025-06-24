
import React, { useState, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthScreen from './components/AuthScreen';
import BottomNavBar from './components/BottomNavBar';
import CoachIAScreen from './screens/CoachIAScreen';
import ProfileTestScreen from './screens/ProfileTestScreen';
import AdaptabilityTestScreen from './screens/AdaptabilityTestScreen';
import ProfileSheetsScreen from './screens/ProfileSheetsScreen';
import { AppContext } from './contexts/AppContext';

const App: React.FC = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AppContext);

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        {isAuthenticated ? (
          <>
            <main className="flex-grow container mx-auto p-4 pb-20"> {/* padding-bottom to avoid overlap with navbar */}
              <Routes>
                <Route path="/" element={<Navigate to="/coach-ia" replace />} />
                <Route path="/coach-ia" element={<CoachIAScreen />} />
                <Route path="/test-profil" element={<ProfileTestScreen />} />
                <Route path="/mon-adaptabilite" element={<AdaptabilityTestScreen />} />
                <Route path="/fiches-profils/*" element={<ProfileSheetsScreen />} />
                <Route path="*" element={<Navigate to="/coach-ia" replace />} />
              </Routes>
            </main>
            <BottomNavBar />
          </>
        ) : (
          <Routes>
            <Route path="/auth" element={<AuthScreen onAuthSuccess={() => setIsAuthenticated(true)} />} />
            <Route path="*" element={<Navigate to="/auth" replace />} />
          </Routes>
        )}
      </div>
    </HashRouter>
  );
};

export default App;
