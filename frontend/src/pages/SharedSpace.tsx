import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Send, UserCircle, MessageSquare, Clock, Ghost } from 'lucide-react';

interface Message {
  username: string;
  content: string;
}

const SERVER_URL_DEV = 'http://127.0.0.1:8000/api';
const SERVER_URL_PROD = 'https://atsense.online/api';

export default function SharedSpace() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [username] = useState(`User_${Math.floor(Math.random() * 9000) + 1000}`);

  const fetchData = async () => {
    const isLocalDevelopment = import.meta.env.MODE === 'development';
    const serverUrl = isLocalDevelopment ? SERVER_URL_DEV : SERVER_URL_PROD;

    try {
      const response = await axios.get(`${serverUrl}/get-data?username=${username}`);
      if (response.status === 200) {
        setMessages(response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleMessageSent = () => {
    setMessage('');
    fetchData();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900 transition-colors duration-300">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 z-40 transition-all duration-300">
        <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <MessageSquare className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Community Hub
              </h1>
              <div className="flex items-center space-x-1.5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Live Activity</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold text-slate-900">{username}</span>
              <span className="text-[10px] text-slate-500 font-medium uppercase tracking-widest leading-none">Your Identity</span>
            </div>
            <div className="h-10 w-10 bg-slate-100 rounded-full border-2 border-white shadow-md flex items-center justify-center text-slate-600 overflow-hidden">
              <UserCircle className="w-full h-full p-1 opacity-80" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto relative pb-20">
        <div className="max-w-screen-md mx-auto px-4 py-8 space-y-8">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                <Ghost className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Quiet in here...</h3>
              <p className="text-slate-500 max-w-xs mx-auto text-sm">
                Start the conversation! Every thought shared here is available for anyone in the world to see and respond to.
              </p>
            </div>
          ) : (
            messages.map((item, index) => (
              <MessageItem key={index} item={item} currentUsername={username} />
            ))
          )}
        </div>
        <div className="sticky bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-100 to-transparent pointer-events-none" />
      </main>

      <div className="fixed bottom-4 left-0 right-0 z-50 px-4">
          <div className="max-w-screen-md mx-auto">
            <InputForm 
              username={username} 
              value={message} 
              onChange={setMessage} 
              onSent={handleMessageSent} 
            />
          </div>
      </div>
    </div>
  );
}

const MessageItem = ({ item, currentUsername }: { item: Message, currentUsername: string }) => {
  const isMe = item.username === currentUsername;
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`flex items-end space-x-3 w-full group ${isMe ? 'flex-row-reverse space-x-reverse' : ''}`}>
      <div className={`h-10 w-10 flex-shrink-0 rounded-xl flex items-center justify-center border-2 border-white shadow-sm ${isMe ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600'}`}>
        <UserCircle className="w-6 h-6" />
      </div>

      <div className={`flex flex-col max-w-[80%] ${isMe ? 'items-end' : 'items-start'}`}>
        {!isMe && (
          <span className="text-[11px] font-bold text-slate-500 mb-1 ml-1 uppercase tracking-wider">{item.username}</span>
        )}
        <div className={`px-5 py-3 shadow-md ${isMe ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm' : 'bg-white text-slate-800 rounded-2xl rounded-tl-sm border border-slate-100'}`}>
          <p className="text-sm sm:text-base leading-relaxed break-words font-medium">{item.content}</p>
        </div>
        <span className="text-[10px] text-slate-400 mt-1 font-semibold flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>{timestamp}</span>
        </span>
      </div>
    </div>
  );
};

const InputForm = ({ username, value, onChange, onSent }: { username: string, value: string, onChange: (val: string) => void, onSent: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!value.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const isLocalDevelopment = import.meta.env.MODE === 'development';
    const serverUrl = isLocalDevelopment ? SERVER_URL_DEV : SERVER_URL_PROD;

    try {
      await axios.post(`${serverUrl}/post-data`, { username, data: value });
      onSent();
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form 
      onSubmit={submit}
      className="bg-white p-2 rounded-3xl shadow-2xl border border-slate-200 flex items-center space-x-2 backdrop-blur-md"
    >
      <input
        placeholder="Share a tip, ask a question..."
        className="flex-1 border-none focus:outline-none bg-transparent py-4 px-6 text-base"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), submit())}
      />
      <button 
        type="submit" 
        disabled={isSubmitting || !value.trim()}
        className="h-12 w-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg active:scale-95 flex items-center justify-center transition-all"
      >
        <Send className={`w-6 h-6 ${isSubmitting ? 'animate-pulse' : ''}`} />
      </button>
    </form>
  );
}
