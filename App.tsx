import React, { useContext } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthScreen from './components/AuthScreen';
import BottomNavBar from './components/BottomNavBar';
import CoachIAScreen from './screens/CoachIAScreen';
import ProfileTestScreen from './screens/ProfileTestScreen';
import AdaptabilityTestScreen from './screens/AdaptabilityTestScreen';
import ProfileSheetsScreen from './screens/ProfileSheetsScreen';
import { AppContext } from './contexts/AppContext';

const App: React.FC = () => {
  const { isAuthenticated } = useContext(AppContext);

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/test-profil" /> : <AuthScreen />} />
          <Route path="/coach-ia" element={isAuthenticated ? <CoachIAScreen /> : <Navigate to="/" />} />
          <Route path="/test-profil" element={isAuthenticated ? <ProfileTestScreen /> : <Navigate to="/" />} />
          <Route path="/mon-adaptabilite" element={isAuthenticated ? <AdaptabilityTestScreen /> : <Navigate to="/" />} />
          <Route path="/fiches-profils/*" element={isAuthenticated ? <ProfileSheetsScreen /> : <Navigate to="/" />} />
        </Routes>
        {isAuthenticated && <BottomNavBar />}
      </div>
    </HashRouter>
  );
};

export default App;
