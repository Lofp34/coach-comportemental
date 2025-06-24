
import React, { useState } from 'react';
import { Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { ProfileSheet, ProfileColor } from '../types';
import { PROFILE_SHEETS_DATA, PROFILE_COLORS_TW } from '../constants';
import { ArrowLeftIcon, ChevronRightIcon } from '../components/icons';

const ProfileCard: React.FC<{ sheet: ProfileSheet }> = ({ sheet }) => {
  const colors = PROFILE_COLORS_TW[sheet.profileColor];
  return (
    <Link 
        to={`${sheet.profileColor.toLowerCase()}`} 
        className={`block p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${colors.bg} text-white bg-opacity-80 hover:bg-opacity-100`}
    >
      <div className="flex items-center mb-3">
        <sheet.icon className="w-10 h-10 mr-4" />
        <h2 className="text-2xl font-bold">{sheet.title}</h2>
      </div>
      <p className="text-sm opacity-90 mb-4">{sheet.keywords.slice(0,3).join(', ')}...</p>
      <div className="text-right">
        <span className="inline-flex items-center text-sm font-medium">
          En savoir plus <ChevronRightIcon className="w-4 h-4 ml-1" />
        </span>
      </div>
    </Link>
  );
};

const ProfileDetail: React.FC = () => {
  const { profileName } = useParams<{ profileName: string }>();
  const navigate = useNavigate();
  
  const profileColorKey = profileName ? profileName.charAt(0).toUpperCase() + profileName.slice(1) as ProfileColor : undefined;

  const sheet = PROFILE_SHEETS_DATA.find(
    (s) => s.profileColor === profileColorKey
  );

  if (!sheet) {
    return (
        <div className="text-center p-8">
            <p className="text-xl text-red-500">Profil non trouvé.</p>
            <button
                onClick={() => navigate('/fiches-profils')}
                className="mt-4 inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700"
            >
                <ArrowLeftIcon className="w-5 h-5 mr-2" /> Retour à la sélection
            </button>
        </div>
    );
  }
  
  const colors = PROFILE_COLORS_TW[sheet.profileColor];

  return (
    <div className={`p-4 md:p-6 bg-white shadow-xl rounded-lg max-w-3xl mx-auto`}>
      <button
        onClick={() => navigate('/fiches-profils')}
        className="mb-6 inline-flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
      >
        <ArrowLeftIcon className="w-5 h-5 mr-2" /> Retour à la sélection
      </button>

      <div className={`p-6 rounded-lg mb-6 ${colors.bg} bg-opacity-10 border ${colors.border}`}>
        <div className="flex items-center mb-3">
            <sheet.icon className={`w-12 h-12 mr-4 ${colors.text}`} />
            <h1 className={`text-3xl font-bold ${colors.text}`}>{sheet.title}</h1>
        </div>
        <p className={`text-md ${colors.text} opacity-80`}>Mots-clés : {sheet.keywords.join(', ')}</p>
      </div>

      <div className="space-y-5 text-slate-700">
        {(Object.keys(sheet) as Array<keyof ProfileSheet>).map(key => {
          if (key === 'profileColor' || key === 'title' || key === 'icon' || key === 'keywords') return null;
          const value = sheet[key];
          let displayValue: React.ReactNode;
          if (Array.isArray(value)) {
            displayValue = <ul className="list-disc list-inside ml-4 space-y-1 text-sm">{(value as string[]).map((item, i) => <li key={i}>{item}</li>)}</ul>;
          } else {
            displayValue = <p className="text-sm">{value as string}</p>;
          }
          
          const labelMap: {[key:string]: string} = {
            timeManagement: "Gestion du temps",
            communication: "Communication",
            expectations: "Attentes",
            strengths: "Forces",
            weaknesses: "Points de vigilance",
            motivation: "Sources de motivation",
            stressTriggers: "Déclencheurs de stress",
            tip: "Conseil clé"
          };

          return (
            <div key={key} className="pb-3 border-b border-slate-200 last:border-b-0">
              <h3 className="text-lg font-semibold text-slate-800 mb-1.5">{labelMap[key] || key}</h3>
              {displayValue}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ProfileSelection: React.FC = () => {
    return (
         <div className="space-y-8">
            <h1 className="text-3xl font-bold text-slate-800 text-center">Fiches Profils de Référence</h1>
            <p className="text-center text-slate-600 max-w-2xl mx-auto">
                Explorez les caractéristiques, les forces, les points de vigilance et les stratégies de communication pour chaque profil comportemental de base.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {PROFILE_SHEETS_DATA.map((sheet) => (
                <ProfileCard key={sheet.profileColor} sheet={sheet} />
                ))}
            </div>
        </div>
    )
}

const ProfileSheetsScreen: React.FC = () => {
  return (
      <Routes>
        <Route index element={<ProfileSelection />} />
        <Route path=":profileName" element={<ProfileDetail />} />
      </Routes>
  );
};

export default ProfileSheetsScreen;
