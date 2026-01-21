import React, { useState, useRef } from 'react';
import { SendHorizontal, Paperclip, X, Image as ImageIcon, Mic } from 'lucide-react';
import { fileToBase64 } from '../utils/helpers';
import { Attachment, StudyMode } from '../types';

interface InputAreaProps {
  onSend: (text: string, attachment?: Attachment) => void;
  isLoading: boolean;
  studyMode: StudyMode;
  setStudyMode: (mode: StudyMode) => void;
}

const InputArea: React.FC<InputAreaProps> = ({ onSend, isLoading, studyMode, setStudyMode }) => {
  const [text, setText] = useState('');
  const [attachment, setAttachment] = useState<Attachment | undefined>(undefined);
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const base64 = await fileToBase64(file);
        setAttachment({
          name: file.name,
          mimeType: file.type,
          data: base64
        });
      } catch (error) {
        console.error("File processing error", error);
        alert("Failed to process file");
      }
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN'; // Optimized for Indian context
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setText(prev => {
        const trimmedPrev = prev.trim();
        return trimmedPrev ? `${trimmedPrev} ${transcript}` : transcript;
      });
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleSend = () => {
    if ((!text.trim() && !attachment) || isLoading) return;
    onSend(text, attachment);
    setText('');
    setAttachment(undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 pb-6 sm:pb-4 z-50">
      <div className="max-w-4xl mx-auto space-y-3">
        
        {/* Mode Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {Object.values(StudyMode).map((mode) => (
            <button
              key={mode}
              onClick={() => setStudyMode(mode)}
              className={`px-3 py-1 text-xs font-medium rounded-full border whitespace-nowrap transition-colors flex-shrink-0 ${
                studyMode === mode
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
              }`}
            >
              {mode === StudyMode.ELI5 ? 'Explain Like I\'m 5' : 
               mode === StudyMode.SOLVE ? 'Step-by-Step' :
               mode === StudyMode.MCQ ? 'MCQ Helper' :
               mode.charAt(0) + mode.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Attachment Preview */}
        {attachment && (
            <div className="flex items-center gap-3 bg-indigo-50 p-2 rounded-lg w-fit border border-indigo-100 animate-in slide-in-from-bottom-2">
                <div className="w-10 h-10 bg-white rounded border border-indigo-200 flex items-center justify-center overflow-hidden">
                    {attachment.mimeType.startsWith('image/') ? (
                         <img src={`data:${attachment.mimeType};base64,${attachment.data}`} className="w-full h-full object-cover" />
                    ) : (
                        <Paperclip className="w-5 h-5 text-indigo-500" />
                    )}
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-semibold text-indigo-900 truncate max-w-[150px]">{attachment.name}</span>
                    <span className="text-[10px] text-indigo-600 uppercase">{attachment.mimeType.split('/')[1]}</span>
                </div>
                <button 
                    onClick={() => {
                        setAttachment(undefined);
                        if(fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="p-1 hover:bg-red-100 rounded-full text-slate-500 hover:text-red-500 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        )}

        <div className="relative flex items-end gap-2 bg-slate-50 border border-slate-300 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all shadow-sm">
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*,application/pdf"
          />
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
            title="Upload Image or PDF"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <button
            onClick={toggleListening}
            className={`p-3 rounded-xl transition-all ${
              isListening 
                ? 'text-red-500 bg-red-50 animate-pulse ring-1 ring-red-200' 
                : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'
            }`}
            title="Voice Input"
          >
            <Mic className="w-5 h-5" />
          </button>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? "Listening..." : "Type your question or upload a photo..."}
            className="w-full bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[44px] py-3 text-slate-800 placeholder-slate-400"
            rows={1}
            style={{ minHeight: '44px' }}
          />

          <button
            onClick={handleSend}
            disabled={(!text.trim() && !attachment) || isLoading}
            className={`p-3 rounded-xl flex items-center justify-center transition-all ${
                (!text.trim() && !attachment) || isLoading 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
            }`}
          >
            <SendHorizontal className="w-5 h-5" />
          </button>
        </div>
        <div className="text-center">
             <p className="text-[10px] text-slate-400">AI can make mistakes. Check important info.</p>
        </div>
      </div>
    </div>
  );
};

export default InputArea;