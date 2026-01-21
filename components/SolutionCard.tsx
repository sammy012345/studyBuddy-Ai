import React, { useState } from 'react';
import { AIResponseSchema } from '../types';
import { CheckCircle2, AlertTriangle, Lightbulb, ChevronDown, ChevronUp, BrainCircuit, GraduationCap } from 'lucide-react';

interface SolutionCardProps {
  data: AIResponseSchema;
}

const SolutionCard: React.FC<SolutionCardProps> = ({ data }) => {
  const [showMistakes, setShowMistakes] = useState(true);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-4">
      {/* Header Info */}
      <div className="bg-indigo-50 p-4 border-b border-indigo-100 flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2">
            <span className="px-3 py-1 bg-white text-indigo-700 text-xs font-bold rounded-full border border-indigo-200 shadow-sm uppercase tracking-wide">
            {data.subject}
            </span>
            <span className="px-3 py-1 bg-white text-slate-600 text-xs font-semibold rounded-full border border-slate-200">
            {data.topic}
            </span>
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
            data.difficulty === 'Easy' ? 'text-green-600 bg-green-100' :
            data.difficulty === 'Medium' ? 'text-yellow-600 bg-yellow-100' :
            'text-red-600 bg-red-100'
        }`}>
            {data.difficulty}
        </span>
      </div>

      <div className="p-5 space-y-6">
        
        {/* Simple Explanation */}
        <section>
          <div className="flex items-center gap-2 mb-2 text-indigo-900 font-semibold">
            <BrainCircuit className="w-5 h-5 text-indigo-600" />
            <h3>Simple Explanation</h3>
          </div>
          <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm md:text-base">
            {data.simpleExplanation}
          </p>
        </section>

        {/* Steps */}
        <section>
          <div className="flex items-center gap-2 mb-3 text-indigo-900 font-semibold">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <h3>Step-by-Step Solution</h3>
          </div>
          <div className="space-y-3">
            {data.solutionSteps.map((step, idx) => (
              <div key={idx} className="flex gap-3 relative">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm z-10">
                  {step.stepNumber}
                </div>
                {idx !== data.solutionSteps.length - 1 && (
                    <div className="absolute top-8 left-4 w-0.5 h-full bg-indigo-50 -z-0"></div>
                )}
                <div className="pb-4">
                  <h4 className="text-sm font-bold text-slate-800">{step.title}</h4>
                  <p className="text-slate-600 text-sm mt-1">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Important Formulas */}
        {data.importantFormulas && data.importantFormulas.length > 0 && (
          <section className="bg-amber-50 rounded-xl p-4 border border-amber-100">
             <div className="flex items-center gap-2 mb-2 text-amber-900 font-semibold">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <h3>Formulas & Key Points</h3>
              </div>
              <ul className="list-disc list-inside space-y-1">
                {data.importantFormulas.map((formula, i) => (
                    <li key={i} className="text-amber-800 text-sm font-medium font-mono">
                        {formula}
                    </li>
                ))}
              </ul>
          </section>
        )}

        {/* Common Mistakes */}
        {data.commonMistakes && data.commonMistakes.length > 0 && (
          <section className="border border-red-100 rounded-xl overflow-hidden">
            <button 
                onClick={() => setShowMistakes(!showMistakes)}
                className="w-full flex items-center justify-between p-3 bg-red-50 text-red-800 font-semibold text-sm hover:bg-red-100 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span>Common Mistakes to Avoid</span>
                </div>
                {showMistakes ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {showMistakes && (
                <div className="p-3 bg-white">
                    <ul className="space-y-2">
                        {data.commonMistakes.map((mistake, i) => (
                            <li key={i} className="text-slate-600 text-sm flex gap-2">
                                <span className="text-red-500 font-bold">×</span> {mistake}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
          </section>
        )}

        {/* Summary */}
        <div className="pt-4 border-t border-slate-100">
             <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-wider font-bold mb-1">
                <GraduationCap className="w-4 h-4" />
                Revision Summary
             </div>
             <p className="text-slate-800 italic font-medium">"{data.summary}"</p>
        </div>

      </div>
    </div>
  );
};

export default SolutionCard;