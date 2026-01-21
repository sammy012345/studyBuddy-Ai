import React from 'react';
import { Calculator, FlaskConical, Code2, TrendingUp, Atom, UploadCloud } from 'lucide-react';

interface EmptyStateProps {
  onSuggestionClick: (text: string) => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onSuggestionClick }) => {
  const subjects = [
    { 
      id: 'maths',
      name: 'Maths', 
      desc: 'Algebra, Calculus, Geometry',
      icon: <Calculator className="w-6 h-6 text-blue-500" />, 
      prompt: "Help me solve this Maths problem step-by-step:" 
    },
    { 
      id: 'physics',
      name: 'Physics', 
      desc: 'Numericals, Laws, Motion',
      icon: <Atom className="w-6 h-6 text-purple-500" />, 
      prompt: "Explain this Physics numerical and the concepts behind it:" 
    },
    { 
      id: 'chemistry',
      name: 'Chemistry', 
      desc: 'Reactions, Formulas',
      icon: <FlaskConical className="w-6 h-6 text-teal-500" />, 
      prompt: "Explain this Chemical reaction/formula in detail:" 
    },
    { 
      id: 'commerce',
      name: 'Accounts / Econ', 
      desc: 'Journal entries, Concepts',
      icon: <TrendingUp className="w-6 h-6 text-green-500" />, 
      prompt: "Explain this Accounts/Economics concept with examples:" 
    },
    { 
      id: 'coding',
      name: 'Coding', 
      desc: 'Logic, Debugging, Syntax',
      icon: <Code2 className="w-6 h-6 text-orange-500" />, 
      prompt: "Explain the logic of this code and fix any errors:" 
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8 animate-in fade-in duration-500 overflow-y-auto">
      <div className="bg-indigo-50 p-4 rounded-full mb-4 text-indigo-600">
        <UploadCloud className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">
        Namaste! What are we studying today?
      </h2>
      <p className="text-slate-500 max-w-md mb-8 text-sm md:text-base">
        Select a subject below to start, or upload your homework directly.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
        {subjects.map((sub) => (
          <button
            key={sub.id}
            onClick={() => onSuggestionClick(sub.prompt)}
            className="flex items-center gap-4 p-4 text-left bg-white border border-slate-200 rounded-xl hover:border-indigo-400 hover:shadow-md hover:bg-slate-50 transition-all group"
          >
            <div className="bg-slate-50 p-3 rounded-lg group-hover:bg-white transition-colors border border-slate-100">
              {sub.icon}
            </div>
            <div>
              <h3 className="font-bold text-slate-800">{sub.name}</h3>
              <p className="text-xs text-slate-500">{sub.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmptyState;