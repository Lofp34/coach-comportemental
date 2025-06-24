import React, { useState, useEffect, useContext, useRef } from 'react';
import { AppContext } from '../contexts/AppContext';
import { getGeminiChatResponseStream } from '../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';
import { PaperAirplaneIcon, UserIcon, ChatBubbleLeftEllipsisIcon as AiIcon } from '../components/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
  timestamp: Date;
}

const CoachIAScreen: React.FC = () => {
  const { userProfile, adaptabilityScore } = useContext(AppContext);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history.length]);

  useEffect(() => {
    // We don't send an initial message anymore, the user starts the conversation.
    // The context will be part of the first message's history.
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    setError(null);
    const userMessage: ChatMessage = {
      role: 'user',
      parts: [{ text: userInput }],
      timestamp: new Date(),
    };
    
    const updatedUiHistory = [...history, userMessage];
    setHistory(updatedUiHistory);
    setUserInput('');
    setIsLoading(true);

    // Add a placeholder for the AI's response
    const aiMessagePlaceholder: ChatMessage = {
      role: 'model',
      parts: [{ text: '' }],
      timestamp: new Date(),
    };
    setHistory(prev => [...prev, aiMessagePlaceholder]);

    // History for the API call should not contain the user's latest message yet,
    // as it will be the one kicking off the stream.
    const apiHistory = updatedUiHistory.map(msg => ({ role: msg.role, parts: msg.parts }));

    let systemInstruction;
    // The context is now a dedicated system instruction.
    if (apiHistory.length === 1) {
      let context = `Vous êtes un coach comportemental expert. Votre objectif est d'aider l'utilisateur à comprendre les profils comportementaux (Rouge, Jaune, Vert, Bleu) et à s'améliorer. Voici le contexte de l'utilisateur actuel:\n`;
      if (userProfile && userProfile.profileResult) {
        context += `- Son profil principal est : ${userProfile.profileResult.join(' / ')}.\n`;
      } else {
        context += `- Son profil principal n'est pas encore défini.\n`;
      }
      if (adaptabilityScore) {
        context += `- Son score d'adaptabilité est de ${adaptabilityScore} sur 20.\n`;
      }
      
      systemInstruction = {
        parts: [{ text: context }]
      };
    }

    await getGeminiChatResponseStream(
      apiHistory,
      systemInstruction,
      undefined, // No specific generation config for now
      (chunk) => {
        setHistory(prevHistory => {
          // Correct, immutable way to update the last message in the history array
          return prevHistory.map((msg, index) => {
            if (index === prevHistory.length - 1 && msg.role === 'model') {
              // Return a new message object with the updated text
              return {
                ...msg,
                parts: [{ text: msg.parts[0].text + chunk }],
              };
            }
            return msg;
          });
        });
      },
      (err) => {
        setError(err);
        // Remove placeholder if there was an error
        setHistory(prev => prev.slice(0, -1));
      },
      () => {
        setIsLoading(false);
      }
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white shadow-xl rounded-lg overflow-hidden">
      <header className="bg-sky-600 text-white p-4">
        <h1 className="text-xl font-semibold">Coach IA</h1>
      </header>
      
      <div className="flex-grow p-4 space-y-4 overflow-y-auto bg-slate-50">
        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Erreur: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        )}
        {history.length === 0 && !isLoading && (
            <div className="text-center text-gray-500 pt-16">
                <p>Posez votre première question au Coach IA pour commencer.</p>
            </div>
        )}
        {history.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-end max-w-xs md:max-w-md lg:max-w-lg ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              {msg.role === 'model' && <AiIcon className="w-8 h-8 rounded-full bg-sky-500 text-white p-1.5 mr-2 flex-shrink-0" />}
              {msg.role === 'user' && <UserIcon className="w-8 h-8 rounded-full bg-slate-500 text-white p-1.5 ml-2 flex-shrink-0" />}
              <div
                className={`px-4 py-2.5 rounded-2xl shadow ${
                  msg.role === 'user'
                    ? 'bg-sky-500 text-white rounded-br-none'
                    : 'bg-white text-slate-700 rounded-bl-none border border-slate-200'
                }`}
              >
                {msg.role === 'model' ? (
                  <div className="prose prose-sm max-w-none text-slate-700">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc list-inside" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal list-inside" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-bold text-slate-700" {...props} />,
                        a: ({node, ...props}) => <a className="text-sky-600 hover:text-sky-700" {...props} />,
                      }}
                    >
                      {msg.parts[0].text}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{msg.parts[0].text}</p>
                )}
                <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-sky-200 text-right' : 'text-slate-400 text-left'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="flex items-end">
                <AiIcon className="w-8 h-8 rounded-full bg-sky-500 text-white p-1.5 mr-2 flex-shrink-0" />
                <div className="px-4 py-3 rounded-2xl shadow bg-white text-slate-700 rounded-bl-none border border-slate-200">
                    <LoadingSpinner size="sm" text="L'IA réfléchit..." />
                </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200 bg-white">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Posez votre question au coach..."
            className="flex-grow p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-sky-600 hover:bg-sky-700 text-white p-3 rounded-lg disabled:opacity-50 transition-colors flex items-center justify-center w-12 h-12"
            disabled={isLoading || !userInput.trim()}
          >
            {isLoading ? <LoadingSpinner size="sm" color="text-white"/> : <PaperAirplaneIcon className="w-5 h-5" />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CoachIAScreen;
