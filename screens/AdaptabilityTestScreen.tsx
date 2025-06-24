import React, { useState, useEffect, useContext } from 'react';
import { supabase } from '../services/supabaseClient';
import { AppContext } from '../contexts/AppContext';
import { AdaptabilityQuestion } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const AdaptabilityTestScreen = () => {
  const [questions, setQuestions] = useState<AdaptabilityQuestion[]>([]);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [view, setView] = useState<'questionnaire' | 'result' | 'loading' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  
  const { user, setAdaptabilityScore } = useContext(AppContext);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data, error } = await supabase
          .from('adaptability_questions')
          .select('id, text, order, correct_answer')
          .order('order', { ascending: true });

        if (error) throw error;
        
        setQuestions(data || []);
        setView('questionnaire');
      } catch (err: any) {
        setError(err.message);
        setView('error');
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswer = (answer: boolean) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit(newAnswers);
    }
  };

  const handleSubmit = async (finalAnswers: boolean[]) => {
    if (!user) {
      setError("Utilisateur non connecté.");
      setView('error');
      return;
    }
    
    setView('loading');

    let score = 0;
    questions.forEach((question, index) => {
      if (finalAnswers[index] === question.correct_answer) {
        score++;
      }
    });

    try {
      const { error: resultError } = await supabase
        .from('adaptability_results')
        .insert({ user_id: user.id, score: score, notes: notes });

      if (resultError) throw resultError;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ adaptability_score: score, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (profileError) throw profileError;
      
      setFinalScore(score);
      setAdaptabilityScore(score);
      setView('result');

    } catch (err: any) {
      setError(err.message);
      setView('error');
    }
  };
  
  const getResultNotes = (score: number) => {
    if (score >= 0 && score <= 4) return "Très faible capacité d'adaptation. Vous semblez très mal à l'aise face au changement et à l'imprévu.";
    if (score >= 5 && score <= 8) return "Faible capacité d'adaptation. Vous avez des difficultés à sortir de votre zone de confort.";
    if (score >= 9 && score <= 12) return "Capacité d'adaptation moyenne. Vous savez vous adapter mais le changement demande un effort.";
    if (score >= 13 && score <= 16) return "Bonne capacité d'adaptation. Vous êtes à l'aise face à la nouveauté et à l'imprévu.";
    if (score >= 17 && score <= 20) return "Très bonne capacité d'adaptation. Le changement est pour vous une source de stimulation.";
    return "";
  };
  
  if (view === 'loading') {
    return <LoadingSpinner />;
  }

  if (view === 'error') {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }
  
  const question = questions[currentQuestionIndex];

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {view === 'questionnaire' && question && (
        <div className="bg-white p-8 rounded-lg shadow-lg animate-fade-in">
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Test d'Adaptabilité</h2>
          <p className="text-slate-600 mb-4 text-center">Question {currentQuestionIndex + 1} sur {questions.length}</p>
          <div className="bg-slate-50 p-6 rounded-lg min-h-[120px] flex items-center justify-center mb-6">
            <p className="text-lg font-medium text-slate-700 text-center">{question.text}</p>
          </div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => handleAnswer(true)}
              className="w-32 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              OUI
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className="w-32 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              NON
            </button>
          </div>
        </div>
      )}

      {view === 'result' && finalScore !== null && (
        <div className="bg-white p-8 rounded-lg shadow-lg animate-fade-in">
          <h2 className="text-2xl font-bold text-center text-slate-800">Résultat du Test d'Adaptabilité</h2>
          <div className="text-center my-6">
            <p className="text-lg text-slate-600">Votre score :</p>
            <p className="text-6xl font-bold text-sky-600">{finalScore}</p>
          </div>
          <div className="bg-sky-50 p-4 rounded-lg">
            <p className="font-semibold text-sky-800">Analyse :</p>
            <p className="text-sky-700">{getResultNotes(finalScore)}</p>
          </div>
           <div className="mt-4">
            <label htmlFor="notes" className="block text-sm font-medium text-slate-700">
              Notes personnelles (optionnel) :
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
              placeholder="Vos réflexions sur le test..."
            />
          </div>
          <div className="mt-6 flex justify-end space-x-3">
               <button onClick={() => window.location.reload()} className="px-4 py-2 bg-slate-200 rounded-lg">Terminer</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdaptabilityTestScreen;
