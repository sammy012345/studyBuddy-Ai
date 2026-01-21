import React, { useEffect, useState } from 'react';
import { X, LogOut, History, User, ChevronRight, GraduationCap } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';
import { UserProfile, HistoryItem } from '../types';

interface ProfileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onLoadHistory: (item: HistoryItem) => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ isOpen, onClose, user, onLoadHistory }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      fetchHistory();
    }
  }, [isOpen, user]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'history'),
        where('userId', '==', user.uid),
        orderBy('timestamp', 'desc'),
        limit(20)
      );
      
      const querySnapshot = await getDocs(q);
      const items: HistoryItem[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as HistoryItem);
      });
      setHistory(items);
    } catch (error) {
      console.error("Error loading history", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    signOut(auth);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[70] transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 right-0 h-full w-[300px] bg-white shadow-2xl z-[80] transform transition-transform duration-300 ease-in-out border-l border-slate-100 flex flex-col
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        
        {/* Header */}
        <div className="p-6 bg-indigo-600 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col items-center mt-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold mb-3 border-2 border-white/30 backdrop-blur-sm">
              {user.displayName ? user.displayName[0].toUpperCase() : <User />}
            </div>
            <h3 className="font-bold text-lg">{user.displayName || 'Student'}</h3>
            <p className="text-indigo-200 text-xs">{user.email}</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-4 flex items-center gap-2 text-indigo-900 font-bold px-2">
            <History className="w-4 h-4" />
            <h3>Your Study History</h3>
          </div>

          {loading ? (
            <div className="text-center py-10 text-slate-400 text-sm">Loading history...</div>
          ) : history.length === 0 ? (
            <div className="text-center py-10 px-4 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
              <GraduationCap className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="text-slate-500 text-sm">No history yet.</p>
              <p className="text-xs text-slate-400">Start asking questions to build your library!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onLoadHistory(item);
                    onClose();
                  }}
                  className="w-full text-left p-3 rounded-xl hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all group"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-indigo-600 uppercase bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                      {item.subject}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {item.timestamp?.toDate().toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-sm text-slate-800 font-medium line-clamp-1 group-hover:text-indigo-700">
                    {item.query}
                  </h4>
                  <div className="flex items-center text-xs text-slate-500 mt-1">
                    <span className="truncate flex-1">{item.summary}</span>
                    <ChevronRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-3 text-red-600 hover:bg-red-50 hover:border-red-100 border border-transparent rounded-xl transition-all font-medium text-sm"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

      </div>
    </>
  );
};

export default ProfileSidebar;