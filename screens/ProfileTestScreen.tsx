
import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../contexts/AppContext';
import { SavedProfile, ProfileTestQuestion, DominantSecondaryProfile, ProfileColor } from '../types';
import { PROFILE_TEST_QUESTIONS, PROFILE_GRID, getAssertivenessCategory, getExpressivenessCategory, PROFILE_SHEETS_DATA, PROFILE_COLORS_TW } from '../constants';
import Modal from '../components/Modal';
import { PlusCircleIcon, ChevronRightIcon, SaveIcon, UserCircleIcon, TrashIcon, PencilSquareIcon, CheckCircleIcon } from '../components/icons';

type TestView = 'list' | 'questionnaire' | 'result';

const ProfileTestScreen: React.FC = () => {
  const { userProfile, savedProfiles, addProfile, updateProfile, deleteProfile, setAsPrimaryProfile } = useContext(AppContext);
  const [currentView, setCurrentView] = useState<TestView>('list');
  // Initialize answers with a default value (e.g., 2 for a 1-4 range) that's valid for calculations
  const [answers, setAnswers] = useState<number[]>(() => new Array(PROFILE_TEST_QUESTIONS.length).fill(2));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [calculatedProfile, setCalculatedProfile] = useState<DominantSecondaryProfile | null>(null);
  const [profileName, setProfileName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<SavedProfile | null>(null); // Profile being edited or retaken
  const [viewingProfileResult, setViewingProfileResult] = useState<SavedProfile | null>(null); // Profile whose results are being viewed (read-only context initially)


  const handleStartNewTest = () => {
    setAnswers(new Array(PROFILE_TEST_QUESTIONS.length).fill(2)); 
    setCurrentQuestionIndex(0);
    setCalculatedProfile(null);
    setEditingProfile(null); // Clear any editing context
    setViewingProfileResult(null);
    setCurrentView('questionnaire');
  };

  const handleAnswerChange = (questionIndex: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = value;
    setAnswers(newAnswers);
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < PROFILE_TEST_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateAndShowResult();
    }
  };

  const calculateAndShowResult = () => {
    let sumAssertiveness = 0;
    let sumExpressiveness = 0;

    PROFILE_TEST_QUESTIONS.forEach((q, index) => {
      const score = answers[index]; 
      if (q.dimension === 'assertiveness') {
        sumAssertiveness += score;
      } else {
        sumExpressiveness += score;
      }
    });
    
    const assertivenessCat = getAssertivenessCategory(sumAssertiveness);
    const expressivenessCat = getExpressivenessCategory(sumExpressiveness);
    
    const result = PROFILE_GRID[expressivenessCat][assertivenessCat];
    setCalculatedProfile(result);
    setCurrentView('result');
  };

  const handleSaveProfile = () => {
    // calculatedProfile must be valid if we are saving (either new or after retake)
    // For a simple name edit (not after retake), calculatedProfile holds the original profile's result.
    if (!calculatedProfile || !profileName.trim()) return; 
    
    if (editingProfile) { // Existing profile is being updated (name change or retake results)
        const updated: SavedProfile = {
            ...editingProfile, // Retains ID and other original properties like isPrimaryUser initially
            name: profileName,
            profileResult: calculatedProfile, // Freshly calculated (retake) or original (name edit)
            answers: answers, // Fresh answers from retake or original (name edit)
        };
        // If "Moi-même" is chosen for an existing profile, ensure it becomes primary
        if (profileName.toLowerCase() === 'moi-même' && !updated.isPrimaryUser) {
            setAsPrimaryProfile(updated.id); // This also updates the profile in the list via AppContext
        } else {
            updateProfile(updated);
        }
        if (updated.isPrimaryUser && (userProfile?.id !== updated.id || userProfile?.name !== updated.name || userProfile.profileResult !== updated.profileResult)) {
            // If the primary profile was edited, update userProfile in context
             setAsPrimaryProfile(updated.id); //This will update the userProfile in context
        }


    } else { // New profile is being added
        addProfile({ name: profileName, profileResult: calculatedProfile, answers: answers });
    }
    
    setIsModalOpen(false);
    setProfileName('');
    setCurrentView('list');
    setEditingProfile(null);
    // viewingProfileResult should be cleared if we came from there and saved
    if (viewingProfileResult && viewingProfileResult.id === editingProfile?.id) {
        setViewingProfileResult(null);
    }
  };
  
  // Call this to open the modal, prepared for either new save or edit.
  // For new profiles, `answers` and `calculatedProfile` are already set from test.
  // For editing (pencil icon), caller should set `answers` and `calculatedProfile` from stored profile first.
  // For saving after retake, `answers` and `calculatedProfile` are fresh; `profileToEdit` provides ID and original name.
  const openSaveModal = (profileDataToEdit?: SavedProfile) => {
    if (profileDataToEdit) {
        setEditingProfile(profileDataToEdit); // Indicates we're updating this specific profile
        setProfileName(profileDataToEdit.name); // Pre-fill name from existing
        // `answers` and `calculatedProfile` state are assumed to be current:
        // - either fresh from a retake (if `profileDataToEdit` is passed after retake)
        // - or loaded from `profileDataToEdit` by the caller (if pencil icon was clicked for name edit)
    } else {
        // New profile: `answers` and `calculatedProfile` are already fresh from the test.
        setEditingProfile(null);
        setProfileName(userProfile ? '' : 'Moi-même'); // Suggest "Moi-même" if no primary profile
    }
    setIsModalOpen(true);
  };

  const handleViewResult = (profile: SavedProfile) => {
    setViewingProfileResult(profile);
    // Load this profile's data into main state for display and potential retake
    setAnswers(profile.answers || new Array(PROFILE_TEST_QUESTIONS.length).fill(2));
    setCalculatedProfile(profile.profileResult); 
    setEditingProfile(null); // Not editing yet, just viewing
    setCurrentView('result');
  };

  const renderProfileCard = (profile: SavedProfile) => {
    const [dominantColorStr, secondaryColorStr] = profile.profileResult.split(' / ') as [ProfileColor, ProfileColor];
    const dominantColorStyle = PROFILE_COLORS_TW[dominantColorStr];
    const secondaryColorStyle = PROFILE_COLORS_TW[secondaryColorStr];

    return (
        <div key={profile.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col justify-between">
            <div>
                <div className="flex items-center mb-2">
                    <div className={`w-3 h-6 rounded-l-md ${dominantColorStyle.bg}`}></div>
                    <div className={`w-3 h-6 rounded-r-md ${secondaryColorStyle.bg} mr-3`}></div>
                    <h3 className="text-lg font-semibold text-slate-700 truncate" title={profile.name}>{profile.name}</h3>
                </div>
                <p className="text-sm text-slate-600 mb-1">Profil: {profile.profileResult}</p>
                {profile.isPrimaryUser && (
                    <span className="text-xs bg-sky-100 text-sky-700 font-medium px-2 py-0.5 rounded-full">Profil principal</span>
                )}
            </div>
            <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
                {!profile.isPrimaryUser && (
                     <button 
                        onClick={() => setAsPrimaryProfile(profile.id)}
                        className="text-xs text-sky-600 hover:text-sky-800 p-1 rounded hover:bg-sky-100 transition-colors"
                        title="Définir comme profil principal"
                    >
                        <CheckCircleIcon className="w-5 h-5" />
                    </button>
                )}
                 <button 
                    onClick={() => {
                        // Prepare for editing this profile's name (or other attributes if modal expanded)
                        // Load its current data into state, then open modal
                        setAnswers(profile.answers || new Array(PROFILE_TEST_QUESTIONS.length).fill(2));
                        setCalculatedProfile(profile.profileResult);
                        openSaveModal(profile); 
                    }}
                    className="text-xs text-slate-500 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition-colors"
                    title="Modifier le nom"
                >
                    <PencilSquareIcon className="w-5 h-5" />
                </button>
                <button 
                    onClick={() => handleViewResult(profile)}
                    className="text-xs text-sky-600 hover:text-sky-800 p-1 rounded hover:bg-sky-100 transition-colors"
                    title="Voir le résultat"
                >
                    <ChevronRightIcon className="w-5 h-5" />
                </button>
                <button 
                    onClick={() => deleteProfile(profile.id)}
                    className="text-xs text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-100 transition-colors"
                    title="Supprimer"
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
  };


  if (currentView === 'questionnaire') {
    const question = PROFILE_TEST_QUESTIONS[currentQuestionIndex];
    return (
      <div className="p-4 md:p-6 bg-white shadow-xl rounded-lg max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold text-slate-800 mb-2">Test de Profil {editingProfile ? `pour ${editingProfile.name}` : ''}</h2>
        <p className="text-slate-600 mb-6">Question {currentQuestionIndex + 1} sur {PROFILE_TEST_QUESTIONS.length}</p>
        
        <div className="bg-slate-50 p-6 rounded-lg mb-6">
            <p className="text-lg font-medium text-center text-slate-700 mb-1">Je suis une personne qui...</p>
            <p className="text-lg text-center text-slate-700 mb-4">{question.textNegative} <span className="text-slate-400 mx-2">vs</span> {question.textPositive}</p>
          
            <div className="flex items-center justify-between text-sm text-slate-500 mb-1 px-1">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
            </div>
            <input
                type="range"
                min="1"
                max="4"
                step="1"
                value={answers[currentQuestionIndex]}
                onChange={(e) => handleAnswerChange(currentQuestionIndex, parseInt(e.target.value))}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
            <div className="flex items-center justify-between text-xs text-slate-600 mt-1 px-1">
                <span className="w-1/4 text-left">{question.textNegative}</span>
                <span className="w-1/4 text-center">Plutôt {question.textNegative}</span>
                <span className="w-1/4 text-center">Plutôt {question.textPositive}</span>
                <span className="w-1/4 text-right">{question.textPositive}</span>
            </div>
        </div>

        <div className="flex justify-between items-center">
            <button
                onClick={() => { setCurrentView('list'); setEditingProfile(null); setViewingProfileResult(null);}}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors"
            >
                Retour
            </button>
            <button
                onClick={handleNextQuestion}
                className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
            >
                {currentQuestionIndex < PROFILE_TEST_QUESTIONS.length - 1 ? 'Suivant' : 'Voir le Résultat'}
            </button>
        </div>
      </div>
    );
  }

  if (currentView === 'result' && (calculatedProfile )) { // Must have a calculatedProfile to show results
    const finalProfileToDisplay = calculatedProfile; // This is always the most current result (new or retake)
    
    const [dominantColorStr, secondaryColorStr] = finalProfileToDisplay.split(' / ') as [ProfileColor, ProfileColor];
    const dominantSheet = PROFILE_SHEETS_DATA.find(s => s.profileColor === dominantColorStr);
    
    const currentProfileNameForDisplay = editingProfile ? editingProfile.name : (viewingProfileResult ? viewingProfileResult.name : "Nouveau Profil");

    return (
      <div className="p-4 md:p-6 bg-white shadow-xl rounded-lg max-w-2xl mx-auto">
        <div className="text-center mb-6">
            <UserCircleIcon className={`w-20 h-20 mx-auto mb-3 ${PROFILE_COLORS_TW[dominantColorStr].text}`} />
            <h2 className="text-3xl font-bold text-slate-800">Résultat du Test</h2>
            <p className="text-lg text-slate-600 mt-1">
                Pour : <span className="font-semibold">{currentProfileNameForDisplay}</span>
                {editingProfile && <span className="text-sm text-slate-500"> (résultat après modification/reprise du test)</span>}
            </p>
        </div>
        
        <div className="bg-gradient-to-br from-sky-500 to-sky-600 text-white p-6 rounded-lg shadow-lg text-center mb-6">
            <p className="text-xl mb-1">Votre profil est</p>
            <p className="text-4xl font-extrabold">{finalProfileToDisplay}</p>
        </div>

        {dominantSheet && (
          <div className="mb-6 p-4 border border-slate-200 rounded-lg bg-slate-50">
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Focus sur le profil dominant : {dominantSheet.title}</h3>
            <p className="text-sm text-slate-600 mb-2"><span className="font-medium">Mots-clés :</span> {dominantSheet.keywords.join(', ')}</p>
            <p className="text-sm text-slate-600 mb-2"><span className="font-medium">Forces typiques :</span> {dominantSheet.strengths.join(', ')}</p>
            <p className="text-sm text-slate-600"><span className="font-medium">Conseil :</span> {dominantSheet.tip}</p>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            onClick={() => { setCurrentView('list'); setViewingProfileResult(null); setEditingProfile(null); }}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors"
          >
            Retour à la liste
          </button>
          
          {/* Case 1: Just finished a NEW test (no editingProfile, no viewingProfileResult context for this save) */}
          {!editingProfile && !viewingProfileResult && (
            <button
                onClick={() => openSaveModal()} // `calculatedProfile` and `answers` are fresh
                className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
            >
                <SaveIcon className="w-5 h-5 mr-2" />
                Enregistrer ce profil
            </button>
          )}

          {/* Case 2: Just finished a RETAKE for an existing profile (`editingProfile` is set) */}
          {editingProfile && (
             <button
                onClick={() => openSaveModal(editingProfile)} // Pass editingProfile to signal update; `calculatedProfile` and `answers` are fresh
                className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
            >
                <SaveIcon className="w-5 h-5 mr-2" />
                Appliquer les modifications à "{editingProfile.name}"
            </button>
          )}
          
          {/* Case 3: VIEWING a saved profile's result, offer to retake it */}
          {viewingProfileResult && !editingProfile && ( // Only show if pure viewing, not after a retake
             <button
                onClick={() => {
                    // Prepare to retake the test for the profile being viewed
                    setEditingProfile(viewingProfileResult); // Set context that we are "editing" this profile via retake
                    setAnswers(viewingProfileResult.answers || new Array(PROFILE_TEST_QUESTIONS.length).fill(2));
                    setCurrentQuestionIndex(0);
                    setCalculatedProfile(null); // Clear old result, will be recalculated
                    // viewingProfileResult remains set to know original context if needed, but editingProfile takes precedence for save
                    setCurrentView('questionnaire');
                }}
                className="w-full sm:w-auto px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
            >
                Refaire le test pour "{viewingProfileResult.name}"
            </button>
          )}
        </div>
      </div>
    );
  }
  
  // Default: list view
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Test de Profil</h1>
        <button
          onClick={handleStartNewTest}
          className="flex items-center bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md hover:shadow-lg transition-all text-sm"
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Faire un nouveau test
        </button>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-slate-700 mb-4">Mes Tests Enregistrés</h2>
        {savedProfiles.length === 0 ? (
          <p className="text-slate-500 text-center py-8 bg-white rounded-lg shadow">Vous n'avez aucun test enregistré pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedProfiles.map(renderProfileCard)}
          </div>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); /* Don't clear editingProfile here, it might be needed if modal is reopened */ }} 
        title={editingProfile ? `Modifier Profil "${editingProfile.name}"` : "Enregistrer le Nouveau Profil"}
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            {editingProfile 
                ? `Vous allez mettre à jour le profil "${editingProfile.name}". Vous pouvez changer son nom ci-dessous.`
                : "Donnez un nom à ce nouveau profil pour le retrouver facilement."
            }
          </p>
          {calculatedProfile && <p className="font-semibold text-sky-700">Profil calculé/actuel : {calculatedProfile}</p>}
          <div>
            <label htmlFor="profileName" className="block text-sm font-medium text-slate-700 mb-1">
              Nom du profil
            </label>
            <input
              type="text"
              id="profileName"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              placeholder={editingProfile ? editingProfile.name : "Ex: Moi-même, Collègue Sarah, Client X"}
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
            <button
                type="button"
                onClick={() => { setIsModalOpen(false); /* setEditingProfile(null); Don't clear here */ }}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
                Annuler
            </button>
            <button
                type="button"
                onClick={handleSaveProfile}
                disabled={!profileName.trim() || (!calculatedProfile && !editingProfile) } // If editing, calculatedProfile might be from original if only name edit.
                                                                                        // If new or retake, calculatedProfile is essential.
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow disabled:opacity-50 transition-colors text-sm"
            >
                {editingProfile ? "Appliquer les modifications" : "Enregistrer"}
            </button>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileTestScreen;
