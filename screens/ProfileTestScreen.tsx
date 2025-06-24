import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { AppContext } from '../contexts/AppContext';
import { TestResult, TestQuestion } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { PencilIcon, TrashIcon, ArrowRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { PROFILE_COLORS, PROFILE_GRID, getAssertivenessCategory, getExpressivenessCategory, PROFILES_DATA } from '../constants';
import { UserCircleIcon } from '@heroicons/react/24/solid';

const ProfileColorDisplay = ({ finalProfile }: { finalProfile: string[] }) => {
  if (!finalProfile || finalProfile.length === 0) {
    return <div className="w-12 h-12 rounded-full bg-gray-300 mr-4 flex-shrink-0"></div>;
  }

  const mainProfile = finalProfile[0];
  const secondProfile = finalProfile.length > 1 ? finalProfile[1] : null;

  const color1 = PROFILE_COLORS[mainProfile]?.bg || 'bg-gray-300';
  
  if (secondProfile) {
    const color2 = PROFILE_COLORS[secondProfile]?.bg || 'bg-gray-400';
    // Remove 'bg-' prefix for gradient
    const fromColor = color1.replace('bg-', 'from-');
    const toColor = color2.replace('bg-', 'to-');
    return (
      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${fromColor} ${toColor} mr-4 flex-shrink-0`}></div>
    );
  }

  return (
    <div className={`w-12 h-12 rounded-lg ${color1} mr-4 flex-shrink-0`}></div>
  );
};

const Modal = ({ isOpen, onClose, children }: { isOpen: boolean, onClose: () => void, children: React.ReactNode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        {children}
      </div>
    </div>
  );
};

const Questionnaire: React.FC<{ profileName: string; onTestComplete: (result: TestResult) => void, onBack: () => void }> = ({ profileName, onTestComplete, onBack }) => {
  const { user } = useContext(AppContext);
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [answers, setAnswers] = useState<Map<number, number>>(new Map());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('test_questions')
          .select('*')
          .order('order', { ascending: true });
        
        if (error) throw error;
        const fetchedQuestions = data || [];
        setQuestions(fetchedQuestions);
        const initialAnswers = new Map<number, number>();
        fetchedQuestions.forEach(q => initialAnswers.set(q.id, 2));
        setAnswers(initialAnswers);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleAnswerChange = (questionId: number, value: number) => {
    setAnswers(new Map(answers.set(questionId, value)));
  };

  const handleSubmit = async () => {
    if (!user) {
      setError("Vous devez être connecté pour soumettre un test.");
      return;
    }

    setLoading(true);
    let scoreAssertiveness = 0;
    let scoreExpressiveness = 0;
    questions.forEach(q => {
      const answerValue = answers.get(q.id) || 0;
      if (q.dimension === 'affirmation') {
        scoreAssertiveness += answerValue;
      } else { // 'expressivite'
        scoreExpressiveness += answerValue;
      }
    });

    const catAssertiveness = getAssertivenessCategory(scoreAssertiveness);
    const catExpressiveness = getExpressivenessCategory(scoreExpressiveness);
    const finalProfile = PROFILE_GRID[catExpressiveness][catAssertiveness];
    
    try {
      const { data: resultData, error: resultError } = await supabase
        .from('test_results')
        .insert({
          user_id: user.id,
          profile_name: profileName,
          assertiveness_score: scoreAssertiveness,
          expressiveness_score: scoreExpressiveness,
          assertiveness_category: catAssertiveness,
          expressiveness_category: catExpressiveness,
          final_profile: finalProfile,
        })
        .select()
        .single();
      
      if (resultError) throw resultError;
      
      const answersToInsert = Array.from(answers.entries()).map(([question_id, answer_value]) => ({
        result_id: resultData.id,
        question_id,
        answer_value,
      }));
      await supabase.from('test_answers').insert(answersToInsert);

      onTestComplete(resultData);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Chargement des questions..."/>;
  if (error) return <div className="p-4 text-red-500">Erreur: {error}</div>;
  if (questions.length === 0) return <div>Aucune question trouvée. <button onClick={onBack}>Retour</button></div>;

  const question = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
        <button onClick={onBack} className="text-sm text-gray-600 hover:text-gray-900 mb-4">&lt; Retour à la liste</button>
        <h2 className="text-2xl font-bold text-center mb-2">Test de Profil pour {profileName}</h2>
        <p className="text-slate-600 mb-6 text-center">Question {currentQuestionIndex + 1} sur {questions.length}</p>
        
        <div className="bg-slate-50 p-6 rounded-lg mb-4">
            <p className="text-lg font-medium text-center text-slate-700">{question.text_left} <span className="text-slate-400 mx-2">vs</span> {question.text_right}</p>
            <input
                type="range" min="1" max="4" step="1"
                value={answers.get(question.id) || 2}
                onChange={(e) => handleAnswerChange(question.id, parseInt(e.target.value))}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-500 mt-4"
            />
            <div className="flex justify-between text-xs text-slate-600 mt-1">
                <span>Plutôt à gauche</span><span></span><span>Plutôt à droite</span>
            </div>
        </div>

        <div className="flex justify-end">
            <button 
                onClick={isLastQuestion ? handleSubmit : () => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors"
                disabled={loading}
            >
                {loading ? 'Sauvegarde...' : (isLastQuestion ? 'Voir mon profil' : 'Suivant')}
            </button>
        </div>
    </div>
  );
};

const ResultScreen: React.FC<{ result: TestResult; onBackToList: () => void; onRetake: () => void }> = ({ result, onBackToList, onRetake }) => {
  if (!result) {
    return (
      <div className="p-4 text-center">
        <p>Aucun résultat à afficher.</p>
        <button onClick={onBackToList} className="mt-4 px-4 py-2 bg-gray-300 rounded">Retour à la liste</button>
      </div>
    );
  }

  const [dominantProfile, secondaryProfile] = result.final_profile;
  const dominantProfileData = Object.values(PROFILES_DATA).find(p => p.name.includes(dominantProfile));

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto bg-gray-50 pb-24">
      <div className="text-center mb-8">
        <UserCircleIcon className="w-20 h-20 text-gray-400 mx-auto" />
        <h1 className="text-3xl font-bold mt-2">Résultat du Test</h1>
        <p className="text-lg text-gray-600">Pour : {result.profile_name}</p>
      </div>

      <div className="bg-blue-500 text-white text-center p-6 rounded-lg shadow-lg mb-8">
        <p className="text-lg">Votre profil est</p>
        <h2 className="text-4xl font-extrabold">{dominantProfile}{secondaryProfile ? ` / ${secondaryProfile}` : ''}</h2>
      </div>

      {dominantProfileData && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-bold mb-4">Focus sur le profil dominant : {dominantProfileData.name}</h3>
          <div className="space-y-3 text-gray-700">
            <p><span className="font-semibold">Mots-clés :</span> {dominantProfileData.fullKeywords}</p>
            <p><span className="font-semibold">Forces typiques :</span> {(dominantProfileData.sections['Forces'] as string[]).join(', ')}</p>
            <p><span className="font-semibold">Conseil :</span> {dominantProfileData.sections['Conseil clé'] as string}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        <button onClick={onBackToList} className="w-full px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors">
          Retour à la liste
        </button>
        <button onClick={onRetake} className="w-full px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">
          Refaire le test pour "{result.profile_name}"
        </button>
      </div>
    </div>
  );
};

const ProfileTestScreen = () => {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();
  const [tests, setTests] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<TestResult | null>(null);
  const [newProfileName, setNewProfileName] = useState('');

  const [view, setView] = useState<'list' | 'questionnaire' | 'result'>('list');
  const [isNewTestModalOpen, setNewTestModalOpen] = useState(false);
  const [testTakerName, setTestTakerName] = useState('');
  const [latestResult, setLatestResult] = useState<TestResult | null>(null);
  
  const fetchTestResults = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('test_results')
        .select(`*`)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTests(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (view === 'list') {
      fetchTestResults();
    }
  }, [view, fetchTestResults]);

  const handleNewTestClick = () => {
    setTestTakerName('');
    setNewTestModalOpen(true);
  };

  const handleStartTest = () => {
    if (!testTakerName.trim()) {
      alert('Veuillez entrer un nom pour le profil.');
      return;
    }
    setNewTestModalOpen(false);
    setView('questionnaire');
  };

  const handleOpenEditModal = (test: TestResult) => {
    setEditingTest(test);
    setNewProfileName(test.profile_name);
    setEditModalOpen(true);
  };
  
  const handleUpdateProfileName = async () => {
    if (!editingTest || !newProfileName.trim()) return;

    try {
      const { data, error } = await supabase
        .from('test_results')
        .update({ profile_name: newProfileName.trim() })
        .eq('id', editingTest.id)
        .select()
      
      if (error) throw error;

      if (data && data.length > 0) {
        const updatedTest = data[0] as TestResult;
        setTests(tests.map(t => t.id === updatedTest.id ? updatedTest : t));
      }
      
      handleCloseEditModal();

    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setEditingTest(null);
    setNewProfileName('');
  };

  const handleDelete = async (testId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce profil ?')) {
      try {
        const { error } = await supabase
          .from('test_results')
          .delete()
          .eq('id', testId);
        
        if (error) throw error;
        setTests(tests.filter(t => t.id !== testId));
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const handleViewResult = (testId: string) => {
    const resultToShow = tests.find(t => t.id === testId);
    if (resultToShow) {
      setLatestResult(resultToShow);
      setView('result');
    } else {
      setError("Impossible de trouver les détails de ce test.");
    }
  };

  if (view === 'questionnaire') {
    return <Questionnaire 
      profileName={testTakerName} 
      onTestComplete={(result) => {
        setLatestResult(result);
        setView('result');
      }}
      onBack={() => setView('list')}
    />;
  }

  if (view === 'result') {
    return <ResultScreen 
      result={latestResult!} 
      onBackToList={() => setView('list')}
      onRetake={() => setView('questionnaire')}
    />;
  }

  // From here, it's the list view (default)
  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-500">Erreur: {error}</div>;

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Test de Profil</h1>
        <button
          onClick={handleNewTestClick}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
        >
          + Faire un nouveau test
        </button>
      </div>

      <h2 className="text-xl font-semibold text-gray-700 mb-4">Mes Tests Enregistrés</h2>
      
      {tests.length > 0 ? (
        <div className="space-y-4">
          {tests.map(test => (
            <div key={test.id} className="bg-white p-5 rounded-lg shadow-md flex items-center justify-between">
              <div className="flex items-center">
                <ProfileColorDisplay finalProfile={test.final_profile} />
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{test.profile_name}</h3>
                  <p className="text-gray-600">Profil: {test.final_profile ? test.final_profile.join(' / ') : 'N/A'}</p>
                  {test.is_primary && (
                    <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Profil principal
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button onClick={() => handleOpenEditModal(test)} className="p-2 text-gray-500 hover:text-blue-600">
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button onClick={() => handleViewResult(test.id)} className="p-2 text-gray-500 hover:text-green-600">
                  <ArrowRightIcon className="w-5 h-5" />
                </button>
                <button onClick={() => handleDelete(test.id)} className="p-2 text-gray-500 hover:text-red-600">
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-6 bg-white rounded-lg shadow">
          <p className="text-gray-600">Vous n'avez pas encore de test enregistré.</p>
          <p className="text-gray-500 text-sm mt-2">Cliquez sur "Faire un nouveau test" pour commencer.</p>
        </div>
      )}

      {/* Edit Modal is here */}
      <Modal isOpen={isEditModalOpen} onClose={handleCloseEditModal}>
        {editingTest && (
           <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Modifier Profil "{editingTest.profile_name}"</h2>
              <button onClick={handleCloseEditModal} className="p-1">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <p className="mb-4 text-gray-600">Vous allez mettre à jour le profil "{editingTest.profile_name}". Vous pouvez changer son nom ci-dessous.</p>
            <p className="mb-4">
              <span className="font-semibold">Profil calculé/actuel :</span> {editingTest.final_profile ? editingTest.final_profile.join(' / ') : 'Non disponible'}
            </p>
            <div className="mb-6">
              <label htmlFor="profileName" className="block text-sm font-medium text-gray-700 mb-1">Nom du profil</label>
              <input
                type="text"
                id="profileName"
                value={newProfileName || ''}
                onChange={(e) => setNewProfileName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button onClick={handleCloseEditModal} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                Annuler
              </button>
              <button onClick={handleUpdateProfileName} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Appliquer les modifications
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* New Test Modal */}
      <Modal isOpen={isNewTestModalOpen} onClose={() => setNewTestModalOpen(false)}>
        <div>
          <h2 className="text-xl font-bold mb-4">Nouveau Test de Profil</h2>
          <p className="mb-4 text-gray-600">Pour qui faites-vous ce test ?</p>
          <div className="mb-6">
            <label htmlFor="testTakerName" className="block text-sm font-medium text-gray-700 mb-1">Nom du profil</label>
            <input
              type="text"
              id="testTakerName"
              value={testTakerName}
              onChange={(e) => setTestTakerName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: Moi-même, Jean Dupont..."
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button onClick={() => setNewTestModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
              Annuler
            </button>
            <button onClick={handleStartTest} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Commencer le test
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileTestScreen;
