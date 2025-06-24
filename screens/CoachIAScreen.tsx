
import React, { useState, useEffect, useContext, useRef } from 'react';
import { AppContext } from '../contexts/AppContext';
import { getGeminiChatResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { DEFAULT_AI_WELCOME_MESSAGE, DEFAULT_AI_TIP_PREFIX, DEFAULT_AI_TIPS, PROFILE_SHEETS_DATA } from '../constants';
import { PaperAirplaneIcon, UserIcon, ChatBubbleLeftEllipsisIcon as AiIcon } from '../components/icons';

const CoachIAScreen: React.FC = () => {
  const { userProfile, adaptabilityScore, savedProfiles } = useContext(AppContext);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dailyTip, setDailyTip] = useState('');

  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Set initial welcome message from AI
    setMessages([{ id: Date.now().toString(), sender: 'ai', text: DEFAULT_AI_WELCOME_MESSAGE, timestamp: new Date() }]);
    
    // Set daily tip
    let tip = DEFAULT_AI_TIPS[Math.floor(Math.random() * DEFAULT_AI_TIPS.length)];
    if (userProfile) {
      tip = `${DEFAULT_AI_TIP_PREFIX}En tant que profil ${userProfile.profileResult}, ${tip.toLowerCase()}`;
    } else {
       tip = `${DEFAULT_AI_TIP_PREFIX}${tip}`;
    }
    setDailyTip(tip);
  }, [userProfile]);


  const constructSystemInstruction = (): string => {
    let instruction = "Vous êtes un coach comportemental expert. Votre objectif est d'aider l'utilisateur à comprendre les profils comportementaux (Rouge, Jaune, Vert, Bleu), à améliorer son adaptabilité et à mieux interagir avec les autres. ";
    instruction += "Voici les descriptions des profils : \n";
    PROFILE_SHEETS_DATA.forEach(sheet => {
        instruction += `Profil ${sheet.profileColor}: ${sheet.keywords.join(', ')}. Forces: ${sheet.strengths.join(', ')}. Faiblesses: ${sheet.weaknesses.join(', ')}.\n`;
    });
    return instruction;
  };
  
  const constructPromptForGemini = (query: string): string => {
    let fullPrompt = `Contexte de l'utilisateur:\n`;
    if (userProfile) {
      fullPrompt += `- Mon profil principal est : ${userProfile.profileResult}.\n`;
    } else {
      fullPrompt += "- Mon profil principal n'est pas encore défini.\n";
    }
    if (adaptabilityScore !== null) {
      fullPrompt += `- Mon score d'adaptabilité est : ${adaptabilityScore}/20.\n`;
    }
    if (savedProfiles.length > 0) {
      fullPrompt += "- Profils que j'ai sauvegardés :\n";
      savedProfiles.forEach(p => {
        fullPrompt += `  - ${p.name} : ${p.profileResult}\n`;
      });
    }
    fullPrompt += `\nMa question : ${query}\n\nRépondez de manière concise et utile en tant que coach.`;
    return fullPrompt;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userInput,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setUserInput('');
    setIsLoading(true);

    const systemInstruction = constructSystemInstruction();
    const fullPrompt = constructPromptForGemini(userInput);
    
    // For generateContent, history is part of the prompt construction or system message.
    // Here, `fullPrompt` contains current context. `systemInstruction` sets persona.
    const aiResponseText = await getGeminiChatResponse([], fullPrompt, systemInstruction); // History passed as empty because prompt has context.

    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(), // ensure unique id
      sender: 'ai',
      text: aiResponseText,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, aiMessage]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white shadow-xl rounded-lg overflow-hidden">
      {/* Header */}
      <header className="bg-sky-600 text-white p-4">
        <h1 className="text-xl font-semibold">Coach IA</h1>
        {dailyTip && <p className="text-sm opacity-90 mt-1">{dailyTip}</p>}
      </header>
      
      {/* Chat Messages */}
      <div className="flex-grow p-4 space-y-4 overflow-y-auto bg-slate-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-end max-w-xs md:max-w-md lg:max-w-lg ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              {msg.sender === 'ai' && <AiIcon className="w-8 h-8 rounded-full bg-sky-500 text-white p-1.5 mr-2 flex-shrink-0" />}
              {msg.sender === 'user' && <UserIcon className="w-8 h-8 rounded-full bg-slate-500 text-white p-1.5 ml-2 flex-shrink-0" />}
              <div
                className={`px-4 py-2.5 rounded-2xl shadow ${
                  msg.sender === 'user'
                    ? 'bg-sky-500 text-white rounded-br-none'
                    : 'bg-white text-slate-700 rounded-bl-none border border-slate-200'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-sky-200 text-right' : 'text-slate-400 text-left'}`}>
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

      {/* Input Form */}
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
            className="bg-sky-600 hover:bg-sky-700 text-white p-3 rounded-lg disabled:opacity-50 transition-colors flex items-center justify-center w-12 h-12" // Fixed size for button
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
