import React from 'react';
import { BookOpen, Languages, User as UserIcon } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  language: string;
  setLanguage: (lang: string) => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onReset: () => void;
}

const Header: React.FC<HeaderProps> = ({ language, setLanguage, user, onOpenAuth, onOpenProfile, onReset }) => {
  const languages = [
    "Hinglish",
    "English",
    "Hindi",
    "Bengali",
    "Marathi",
    "Telugu",
    "Tamil",
    "Gujarati",
    "Kannada",
    "Malayalam",
    "Punjabi"
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-sm">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        
        {/* Brand - Clickable to Reset/Home */}
        <button 
          onClick={onReset}
          className="flex items-center gap-2 text-indigo-600 hover:opacity-80 transition-opacity focus:outline-none"
          title="Go to Home"
        >
          <BookOpen className="w-8 h-8" />
          <div className="hidden sm:block text-left">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">StudyBuddy AI</h1>
            <p className="text-xs text-slate-500 font-medium">Your Personal Tutor</p>
          </div>
        </button>
        
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Language Selector */}
          <div className="relative flex items-center">
            <Languages className="w-4 h-4 absolute left-3 text-slate-500" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-sm border border-slate-200 rounded-full bg-white text-slate-700 hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer appearance-none max-w-[110px] sm:max-w-none"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          {/* User Profile / Login */}
          {user ? (
            <button 
              onClick={onOpenProfile}
              className="flex items-center gap-2 pl-1 pr-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors border border-slate-200"
            >
              <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {user.displayName ? user.displayName[0].toUpperCase() : <UserIcon className="w-4 h-4" />}
              </div>
              <span className="text-sm font-medium text-slate-700 max-w-[80px] truncate hidden sm:block">
                {user.displayName?.split(' ')[0]}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-full shadow-md transition-all flex items-center gap-1"
            >
              <UserIcon className="w-4 h-4" />
              Login
            </button>
          )}

        </div>
      </div>
    </header>
  );
};

export default Header;