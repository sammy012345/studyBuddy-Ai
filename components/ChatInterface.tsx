import React, { useRef, useEffect } from 'react';
import { Message } from '../types';
import SolutionCard from './SolutionCard';
import { Bot, User, FileText, Image as ImageIcon } from 'lucide-react';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, isLoading }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-32">
      {messages.map((msg) => (
        <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          
          {/* AI Avatar */}
          {msg.role === 'ai' && (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
              <Bot className="w-6 h-6 text-white" />
            </div>
          )}

          <div className={`max-w-[90%] md:max-w-[80%] ${msg.role === 'user' ? 'items-end flex flex-col' : 'w-full'}`}>
            
            {/* Message Bubble */}
            <div className={`
                relative p-4 rounded-2xl shadow-sm text-sm md:text-base
                ${msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-white border border-slate-100 rounded-tl-none w-full'
                }
            `}>
              
              {/* Attachment Preview (User side) */}
              {msg.attachment && (
                <div className="mb-3 p-2 bg-black/10 rounded-lg max-w-[200px] overflow-hidden">
                    {msg.attachment.mimeType.startsWith('image/') ? (
                        <img src={`data:${msg.attachment.mimeType};base64,${msg.attachment.data}`} alt="Upload" className="w-full h-auto rounded-md" />
                    ) : (
                        <div className="flex items-center gap-2 text-xs font-mono p-2">
                             <FileText className="w-4 h-4" />
                             <span className="truncate">{msg.attachment.name}</span>
                        </div>
                    )}
                </div>
              )}

              {/* Text Content */}
              {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}
              
              {/* Structured AI Response */}
              {msg.structuredResponse && <SolutionCard data={msg.structuredResponse} />}
              
              {/* Error Message */}
              {msg.isError && (
                 <div className="text-red-500 bg-red-50 p-3 rounded-lg border border-red-100 mt-2">
                    Oops! Something went wrong trying to solve that. Please try again with a clearer image or text.
                 </div>
              )}
            </div>
            
            <span className="text-xs text-slate-400 mt-1 px-1">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {/* User Avatar */}
          {msg.role === 'user' && (
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
              <User className="w-6 h-6 text-slate-500" />
            </div>
          )}
        </div>
      ))}

      {isLoading && (
        <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md animate-pulse">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-2">
                <span className="flex gap-1">
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200"></span>
                </span>
                <span className="text-sm text-slate-500 font-medium">Solving...</span>
            </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatInterface;