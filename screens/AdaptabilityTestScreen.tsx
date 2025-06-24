
import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../contexts/AppContext';
import { ADAPTABILITY_QUESTIONS, MOCK_USER_ID } from '../constants';
import { CheckCircleIcon, XCircleIcon, PencilSquareIcon } from '../components/icons';

type AdaptabilityView = 'main' | 'questionnaire' | 'result';

const AdaptabilityTestScreen: React.FC = () => {
  const { adaptabilityScore, setAdaptabilityScore, adaptabilityNotes, setAdaptabilityNotes } = useContext(AppContext);
  const [currentView, setCurrentView] = useState<AdaptabilityView>('main');
  const [answers, setAnswers] = useState<boolean[]>(new Array(ADAPTABILITY_QUESTIONS.length).fill(false));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [localNotes, setLocalNotes] = useState(adaptabilityNotes);

  useEffect(() => {
    setLocalNotes(adaptabilityNotes); // Sync local notes if global notes change
  }, [adaptabilityNotes]);

  const handleStartTest = () => {
    setAnswers(new Array(ADAPTABILITY_QUESTIONS.length).fill(false));
    setCurrentQuestionIndex(0);
    setCurrentView('questionnaire');
  };

  const handleAnswer = (answer: boolean) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;
    setAnswers(newAnswers);

    if (currentQuestionIndex < ADAPTABILITY_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate score (simple sum of 'Oui' answers for this mock)
      const score = newAnswers.filter(a => a === true).length;
      setAdaptabilityScore(score);
      setCurrentView('result');
    }
  };

  const getScoreInterpretation = (score: number | null): string => {
    if (score === null) return "Aucun test effectué.";
    if (score >= 15) return "Vous êtes très adaptable !";
    if (score >= 10) return "Vous êtes plutôt adaptable.";
    if (score >= 5) return "Votre adaptabilité peut être améliorée.";
    return "Vous avez des opportunités significatives pour développer votre adaptabilité.";
  };
  
  const handleSaveNotes = () => {
    setAdaptabilityNotes(localNotes);
    alert("Notes enregistrées !"); // Or a more subtle notification
  };

  if (currentView === 'questionnaire') {
    const question = ADAPTABILITY_QUESTIONS[currentQuestionIndex];
    return (
      <div className="p-4 md:p-6 bg-white shadow-xl rounded-lg max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-semibold text-slate-800 mb-2">Test d'Adaptabilité</h2>
        <p className="text-slate-600 mb-6">Question {currentQuestionIndex + 1} sur {ADAPTABILITY_QUESTIONS.length}</p>
        
        <div className="bg-slate-50 p-6 rounded-lg mb-8 min-h-[100px] flex items-center justify-center">
          <p className="text-xl font-medium text-slate-700">{question.text}</p>
        </div>

        <div className="flex justify-center space-x-6">
          <button
            onClick={() => handleAnswer(true)}
            className="flex items-center justify-center w-32 h-16 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all text-xl"
          >
            <CheckCircleIcon className="w-7 h-7 mr-2" /> Oui
          </button>
          <button
            onClick={() => handleAnswer(false)}
            className="flex items-center justify-center w-32 h-16 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all text-xl"
          >
             <XCircleIcon className="w-7 h-7 mr-2" /> Non
          </button>
        </div>
         <button
            onClick={() => setCurrentView('main')}
            className="mt-10 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors"
        >
            Retour
        </button>
      </div>
    );
  }

  if (currentView === 'result') {
    return (
      <div className="p-4 md:p-6 bg-white shadow-xl rounded-lg max-w-2xl mx-auto">
        <div className="text-center mb-6">
            <CheckCircleIcon className="w-20 h-20 mx-auto mb-3 text-green-500" />
            <h2 className="text-3xl font-bold text-slate-800">Résultat du Test d'Adaptabilité</h2>
        </div>
        
        <div className="bg-gradient-to-br from-sky-500 to-sky-600 text-white p-6 rounded-lg shadow-lg text-center mb-6">
            <p className="text-xl mb-1">Votre score final est</p>
            <p className="text-5xl font-extrabold">{adaptabilityScore ?? 0}<span className="text-3xl"> / {ADAPTABILITY_QUESTIONS.length}</span></p>
            <p className="text-lg mt-2">{getScoreInterpretation(adaptabilityScore)}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-slate-700 mb-2">Réflexion personnelle</h3>
          <p className="text-slate-600 mb-3">Ce que je peux faire de mieux pour m'adapter :</p>
          <textarea
            value={localNotes}
            onChange={(e) => setLocalNotes(e.target.value)}
            rows={4}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            placeholder="Prenez des notes ici..."
          />
           <button
            onClick={handleSaveNotes}
            className="mt-3 flex items-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition-colors text-sm"
          >
            <PencilSquareIcon className="w-4 h-4 mr-2" /> Enregistrer mes notes
          </button>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
          <button
            onClick={() => setCurrentView('main')}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors"
          >
            Terminé
          </button>
          <button
            onClick={handleStartTest}
            className="w-full sm:w-auto px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            Refaire le test
          </button>
        </div>
      </div>
    );
  }

  // Default: main view
  return (
    <div className="p-4 md:p-6 bg-white shadow-xl rounded-lg max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800 mb-6 text-center">Mon Adaptabilité</h1>
      
      {adaptabilityScore !== null && (
        <div className="bg-slate-100 p-6 rounded-lg mb-8 text-center border border-slate-200">
          <h2 className="text-xl font-semibold text-sky-700 mb-2">Votre dernier résultat :</h2>
          <p className="text-4xl font-bold text-slate-800 mb-1">{adaptabilityScore} / {ADAPTABILITY_QUESTIONS.length}</p>
          <p className="text-md text-slate-600">{getScoreInterpretation(adaptabilityScore)}</p>
          {adaptabilityNotes && (
             <div className="mt-4 text-left p-3 bg-white rounded border border-slate-200">
                <p className="text-sm font-medium text-slate-700">Vos notes de réflexion :</p>
                <p className="text-sm text-slate-600 whitespace-pre-wrap">{adaptabilityNotes}</p>
             </div>
          )}
        </div>
      )}

      <button
        onClick={handleStartTest}
        className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all text-lg"
      >
        {adaptabilityScore !== null ? "Refaire le test d'adaptabilité" : "Évaluer mon adaptabilité"}
      </button>
    </div>
  );
};

export default AdaptabilityTestScreen;
