import React from 'react';
import { useParams, useNavigate, Routes, Route } from 'react-router-dom';
import { PROFILES_DATA } from '../constants';
import { ArrowLeftIcon, ArrowTrendingUpIcon, SunIcon, ScaleIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';

const icons: { [key: string]: React.ElementType } = {
  ArrowTrendingUpIcon,
  SunIcon,
  ScaleIcon,
  ShieldCheckIcon,
};

const ProfileCard = ({ profile }: { profile: any }) => {
  const navigate = useNavigate();
  const IconComponent = icons[profile.icon];

  return (
    <div
      className={`p-6 rounded-xl shadow-lg cursor-pointer transition-transform transform hover:scale-105 ${profile.bgColor} ${profile.textColor}`}
      onClick={() => navigate(`/fiches-profils/${profile.id}`)}
    >
      <div className="flex items-center space-x-4">
        {IconComponent && <IconComponent className="h-10 w-10" />}
        <div>
          <h3 className="text-xl font-bold">{profile.name}</h3>
          <p className="text-sm">{profile.keywords}</p>
        </div>
      </div>
      <div className="text-right mt-4 font-semibold">
        En savoir plus &gt;
      </div>
    </div>
  );
};

const ProfileDetail = () => {
    const { profileId } = useParams<{ profileId: string }>();
    const navigate = useNavigate();
    
    // Find the profile data based on profileId, ensuring profileId is not undefined
    const profile = profileId ? Object.values(PROFILES_DATA).find(p => p.id === profileId) : undefined;

    if (!profile) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold">Profil non trouvé</h2>
                <button
                    onClick={() => navigate('/fiches-profils')}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                    Retour à la liste
                </button>
            </div>
        );
    }

    const IconComponent = icons[profile.icon];

    return (
        <div className="p-4 bg-gray-50 min-h-full pb-24">
            <button
                onClick={() => navigate('/fiches-profils')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 font-semibold mb-6"
            >
                <ArrowLeftIcon className="h-5 w-5" />
                <span>Retour à la sélection</span>
            </button>

            <div className={`p-6 rounded-xl shadow-lg mb-8 ${profile.bgColor} ${profile.textColor}`}>
                <div className="flex items-center space-x-4">
                    {IconComponent && <IconComponent className="h-10 w-10" />}
                    <div>
                        <h1 className="text-2xl font-bold">{profile.title}</h1>
                        <p className="font-semibold">Mots-clés : {profile.fullKeywords}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {Object.entries(profile.sections).map(([title, content]) => (
                    <div key={title} className="bg-white p-5 rounded-lg shadow">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
                        {Array.isArray(content) ? (
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                                {content.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-700">{content as string}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};


const ProfileList = () => {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-center text-gray-800">Fiches Profils de Référence</h1>
      <p className="text-center text-gray-600 max-w-2xl mx-auto">
        Explorez les caractéristiques, les forces, les points de vigilance et les stratégies de communication pour chaque profil comportemental de base.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.values(PROFILES_DATA).map(profile => (
          <ProfileCard key={profile.id} profile={profile} />
        ))}
      </div>
    </div>
  );
};

const ProfileSheetsScreen = () => {
  return (
    <Routes>
      <Route path="/" element={<ProfileList />} />
      <Route path=":profileId" element={<ProfileDetail />} />
    </Routes>
  );
};

export default ProfileSheetsScreen;
