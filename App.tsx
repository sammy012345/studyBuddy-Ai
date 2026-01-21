import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import ChatInterface from './components/ChatInterface';
import InputArea from './components/InputArea';
import EmptyState from './components/EmptyState';
import AuthModal from './components/AuthModal';
import ProfileSidebar from './components/ProfileSidebar';
import { Message, Attachment, AppState, StudyMode, UserProfile, HistoryItem } from './types';
import { generateId } from './utils/helpers';
import { analyzeProblem } from './services/geminiService';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [language, setLanguage] = useState<string>('Hinglish');
  const [studyMode, setStudyMode] = useState<StudyMode>(StudyMode.SOLVE);
  
  // Auth State
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Monitor Auth Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL
        });
      } else {
        setUser(null);
        setMessages([]); // Clear chat on logout? Optional.
      }
    });
    return () => unsubscribe();
  }, []);

  const saveToHistory = async (queryText: string, aiResponse: any) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'history'), {
        userId: user.uid,
        query: queryText,
        subject: aiResponse.subject,
        summary: aiResponse.summary,
        data: aiResponse,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error("Failed to save history", error);
    }
  };

  const handleSend = useCallback(async (text: string, attachment?: Attachment) => {
    // 1. Create User Message
    const userMsg: Message = {
      id: generateId(),
      role: 'user',
      text,
      attachment,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setAppState(AppState.LOADING);

    try {
      // 2. Call API with selected language & mode
      const aiData = await analyzeProblem(text, attachment?.data, attachment?.mimeType, language, studyMode);

      // 3. Create AI Message
      const aiMsg: Message = {
        id: generateId(),
        role: 'ai',
        structuredResponse: aiData,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, aiMsg]);
      setAppState(AppState.SUCCESS);

      // 4. Save to History (if logged in)
      saveToHistory(text, aiData);

    } catch (error) {
      console.error("Error fetching AI response", error);
      const errorMsg: Message = {
        id: generateId(),
        role: 'ai',
        text: "Sorry, I encountered an error. Please try again.",
        isError: true,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
      setAppState(AppState.ERROR);
    }
  }, [language, studyMode, user]);

  const handleSuggestionClick = (text: string) => {
    handleSend(text);
  };

  const loadHistoryItem = (item: HistoryItem) => {
    // Load a specific history item into the chat view
    const userMsg: Message = {
      id: generateId(),
      role: 'user',
      text: item.query,
      timestamp: Date.now() // or item.timestamp
    };
    const aiMsg: Message = {
      id: generateId(),
      role: 'ai',
      structuredResponse: item.data,
      timestamp: Date.now()
    };
    setMessages([userMsg, aiMsg]);
    setAppState(AppState.SUCCESS);
  };

  const handleReset = () => {
    setMessages([]);
    setAppState(AppState.IDLE);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 font-sans">
      <Header 
        language={language} 
        setLanguage={setLanguage} 
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onReset={handleReset}
      />
      
      <main className="flex-1 flex flex-col relative max-w-4xl mx-auto w-full bg-white shadow-xl sm:my-4 sm:rounded-2xl sm:overflow-hidden border-x border-slate-100">
        
        {messages.length === 0 ? (
          <EmptyState onSuggestionClick={handleSuggestionClick} />
        ) : (
          <ChatInterface messages={messages} isLoading={appState === AppState.LOADING} />
        )}

      </main>
      
      {/* Spacer for sticky input */}
      <div className="h-[130px] sm:h-[100px] bg-transparent"></div>
      
      <InputArea 
        onSend={handleSend} 
        isLoading={appState === AppState.LOADING} 
        studyMode={studyMode}
        setStudyMode={setStudyMode}
      />

      {/* Modals */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
      
      {user && (
        <ProfileSidebar 
          isOpen={isProfileOpen} 
          onClose={() => setIsProfileOpen(false)} 
          user={user}
          onLoadHistory={loadHistoryItem}
        />
      )}
    </div>
  );
};

export default App;