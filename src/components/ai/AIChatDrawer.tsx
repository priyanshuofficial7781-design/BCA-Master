import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  X,
  RotateCcw,
  Copy,
  Check,
  Code2,
  Terminal,
  Zap,
  HelpCircle,
  Brain,
  MessageSquare,
  Maximize2,
  Minimize2,
  ArrowRight,
  Database,
  Layers,
  Bug,
  BookOpen,
} from 'lucide-react';
import { geminiService, ChatMessage } from '../../services/geminiService';
import { soundEffects } from '../../services/soundEffects';

interface AIChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  onRunInCodeSandbox?: (code: string, language?: string) => void;
}

type ChatMode = 'general' | 'debug' | 'big-o' | 'viva' | 'sql';

const MODE_PRESETS: Array<{
  id: ChatMode;
  label: string;
  icon: React.ReactNode;
  hint: string;
}> = [
  { id: 'general', label: 'All Topics', icon: <Sparkles size={12} />, hint: 'General BCA CS, algorithms & concepts' },
  { id: 'debug', label: 'Code Debugger', icon: <Bug size={12} />, hint: 'Paste buggy code to find errors & fixes' },
  { id: 'big-o', label: 'Big-O Complexity', icon: <Zap size={12} />, hint: 'Time & space complexity breakdowns' },
  { id: 'viva', label: 'Viva & Exams', icon: <Brain size={12} />, hint: 'Oral exam questions & model answers' },
  { id: 'sql', label: 'SQL & Database', icon: <Database size={12} />, hint: 'Queries, schema design & normalization' },
];

const QUICK_PROMPTS_BY_MODE: Record<ChatMode, string[]> = {
  general: [
    'Explain Dynamic Programming memoization vs tabulation',
    'How to solve Two Sum with O(n) hash map in C++ and Python?',
    'What is the difference between TCP and UDP in Computer Networks?',
    'Explain Process vs Thread and context switching in OS',
  ],
  debug: [
    'Debug a C++ pointer segmentation fault with code example',
    'Why does my Java ArrayList throw ConcurrentModificationException?',
    'Fix Python recursion depth exceeded error in factorial',
    'Find memory leaks in C with malloc without free',
  ],
  'big-o': [
    'Explain Big-O of Merge Sort vs Quick Sort vs TimSort',
    'Why is binary search O(log n) time complexity?',
    'Compare Hash Table vs Binary Search Tree time and space complexity',
    'How does Space Complexity recursion stack work?',
  ],
  viva: [
    'What are the 4 ACID properties in DBMS with real examples?',
    'Explain Virtual Functions and runtime polymorphism in C++',
    'What is Deadlock and the 4 necessary Coffman conditions?',
    'Differentiate between Preemptive and Non-Preemptive CPU scheduling',
  ],
  sql: [
    'Write an SQL query to find the 2nd highest salary in an Employee table',
    'Explain INNER JOIN vs LEFT JOIN vs FULL OUTER JOIN with syntax',
    'What is 3NF vs BCNF normalization with functional dependencies?',
    'Write a GROUP BY query with HAVING clause to count course enrollments',
  ],
};

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({
  isOpen,
  onClose,
  initialQuery,
  onRunInCodeSandbox,
}) => {
  const [activeModel, setActiveModel] = useState<'gemini' | 'chatgpt'>('gemini');
  const [activeMode, setActiveMode] = useState<ChatMode>('general');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-1',
      role: 'assistant',
      model: 'gemini',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: `👋 **Welcome to your BCA AI Study Assistant & Coding Coach!**

You can switch anytime between:
- ✨ **Google Gemini 3.8 Flash**: Specialized university CS mentor for C++, C, Python, Java, Data Structures, OS, DBMS & Viva theory.
- 🤖 **ChatGPT-4o Coach**: Senior coding engineer for hands-on bug hunting, clean code architecture, and placement interview practice.

Try clicking a quick prompt above, switch modes, or paste any code for instant analysis!`,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (initialQuery && isOpen) {
      handleSend(initialQuery);
    }
  }, [initialQuery, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    soundEffects.playClick();
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      model: activeModel,
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      const replyText = await geminiService.chatWithAI({
        messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        persona: activeModel,
      });

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        model: activeModel,
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      soundEffects.playLevelUp();
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        model: activeModel,
        content: '⚠️ I encountered an error processing your query. Please try again or click one of the quick prompts above.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = (codeText: string, id: string) => {
    navigator.clipboard.writeText(codeText);
    soundEffects.playClick();
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    soundEffects.playClick();
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        model: activeModel,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: `🔄 **Chat session reset.** Ready to assist you with **${
          activeModel === 'gemini' ? 'Google Gemini 3.8 Flash' : 'ChatGPT-4o Coach'
        }** in ${MODE_PRESETS.find((m) => m.id === activeMode)?.label}!`,
      },
    ]);
  };

  if (!isOpen) return null;

  const currentPrompts = QUICK_PROMPTS_BY_MODE[activeMode] || QUICK_PROMPTS_BY_MODE.general;

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex flex-col rounded-3xl bg-[#0C0A1A]/95 border border-[#B46CFF]/35 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(139,61,255,0.25)] backdrop-blur-2xl overflow-hidden transition-all duration-300 animate-slideUp select-none ${
        isExpanded
          ? 'w-[calc(100vw-32px)] sm:w-[680px] h-[85vh] max-h-[850px]'
          : 'w-[calc(100vw-32px)] sm:w-[480px] h-[600px] max-h-[88vh]'
      }`}
      role="dialog"
      aria-label="AI Study Assistant"
    >
      {/* Header with Dual Model Switcher */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#17122E] via-[#100E26] to-[#0A0818] border-b border-purple-500/20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#8B3DFF] via-[#B46CFF] to-[#00F0FF] flex items-center justify-center text-white shadow-[0_0_15px_rgba(139,61,255,0.4)]">
            <Sparkles size={16} />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5 leading-none">
              <span>BCA AI Tutor & Coding Coach</span>
            </h3>
            <div className="flex items-center gap-1.5 mt-1 text-[10px] text-[#00FF9D] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9D] animate-pulse" />
              <span>{activeModel === 'gemini' ? 'Google Gemini 3.8 Flash' : 'ChatGPT-4o Coding Coach'}</span>
            </div>
          </div>
        </div>

        {/* Model Switcher Tabs & Window Controls */}
        <div className="flex items-center gap-1.5">
          {/* Persona Switcher Pill */}
          <div className="flex items-center p-0.5 rounded-xl bg-[#141029] border border-white/10">
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setActiveModel('gemini');
              }}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeModel === 'gemini'
                  ? 'bg-gradient-to-r from-[#8B3DFF] to-[#00F0FF] text-white shadow-sm'
                  : 'text-[#AAA9C6] hover:text-white'
              }`}
              title="Google Gemini 3.8 Flash (DeepMind Computer Science Mentor)"
            >
              <Sparkles size={10} />
              <span>Gemini</span>
            </button>
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setActiveModel('chatgpt');
              }}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeModel === 'chatgpt'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-sm'
                  : 'text-[#AAA9C6] hover:text-white'
              }`}
              title="ChatGPT-4o Style Senior Coding Coach"
            >
              <Bot size={10} />
              <span>ChatGPT</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleResetChat}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Clear Chat History"
          >
            <RotateCcw size={13} />
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="hidden sm:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            title="Close Assistant"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="px-3 py-1.5 bg-[#0e0b1f] border-b border-purple-500/15 flex items-center gap-1 overflow-x-auto scrollbar-none">
        {MODE_PRESETS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => {
              soundEffects.playClick();
              setActiveMode(m.id);
            }}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
              activeMode === m.id
                ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
            title={m.hint}
          >
            {m.icon}
            <span>{m.label}</span>
          </button>
        ))}
      </div>

      {/* Quick Prompts Carousel Bar */}
      <div className="px-3 py-2 bg-[#090714] border-b border-white/5 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <span className="text-[10px] text-purple-300 font-bold uppercase tracking-wider shrink-0 pl-1">
          Quick:
        </span>
        {currentPrompts.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(prompt)}
            className="px-2.5 py-1 rounded-full bg-[#18142F] hover:bg-[#252048] border border-purple-500/25 text-[#AAA9C6] hover:text-white text-[11px] whitespace-nowrap transition-colors shrink-0 cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin select-text">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
            >
              <div className="flex items-center gap-1.5 text-[10px] text-[#AAA9C6] px-1 font-mono">
                <span>{isUser ? 'You' : msg.model === 'gemini' ? 'Google Gemini 3.8' : 'ChatGPT-4o Coach'}</span>
                <span>·</span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={`max-w-[92%] rounded-2xl p-3 sm:p-3.5 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-r from-purple-600 to-[#8B3DFF] text-white shadow-md rounded-tr-sm'
                    : 'bg-[#151228] border border-purple-500/25 text-[#F0EDFF] shadow-lg rounded-tl-sm'
                }`}
              >
                {/* Render Markdown-like content */}
                <div className="space-y-2 whitespace-pre-wrap">
                  {msg.content.split('```').map((part, i) => {
                    if (i % 2 === 1) {
                      // Code block
                      const lines = part.split('\n');
                      const lang = lines[0]?.trim() || 'code';
                      const codeContent = lines.slice(1).join('\n').trim();
                      const codeId = `${msg.id}-${i}`;

                      return (
                        <div
                          key={i}
                          className="my-2 rounded-xl bg-[#090714] border border-purple-500/30 overflow-hidden font-mono text-[11px]"
                        >
                          <div className="flex items-center justify-between px-3 py-1.5 bg-[#120F24] border-b border-white/5 text-[10px] text-[#AAA9C6]">
                            <span className="text-[#00F0FF] uppercase font-bold">{lang}</span>
                            <div className="flex items-center gap-2">
                              {onRunInCodeSandbox && codeContent.length > 10 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    soundEffects.playClick();
                                    onRunInCodeSandbox(codeContent, lang);
                                    onClose();
                                  }}
                                  className="flex items-center gap-1 text-purple-300 hover:text-white transition-colors cursor-pointer bg-purple-500/20 px-2 py-0.5 rounded-md border border-purple-500/30"
                                  title="Load and run in the Dedicated Coding Place"
                                >
                                  <Terminal size={11} />
                                  <span>Run in Code Arena</span>
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleCopyCode(codeContent, codeId)}
                                className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                              >
                                {copiedId === codeId ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                                <span>{copiedId === codeId ? 'Copied' : 'Copy'}</span>
                              </button>
                            </div>
                          </div>
                          <pre className="p-3 overflow-x-auto text-emerald-300">
                            <code>{codeContent}</code>
                          </pre>
                        </div>
                      );
                    }

                    // Standard text with formatting
                    return (
                      <div key={i} className="space-y-1">
                        {part.split('\n\n').map((para, pIdx) => (
                          <p key={pIdx} className="leading-relaxed">
                            {para}
                          </p>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#151228] border border-purple-500/25 max-w-[220px] text-xs text-purple-300">
            <Sparkles size={14} className="animate-spin text-[#00F0FF]" />
            <span className="font-mono">{activeModel === 'gemini' ? 'Gemini 3.8 thinking...' : 'ChatGPT typing...'}</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-[#100D22] border-t border-purple-500/25 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={`Ask ${activeModel === 'gemini' ? 'Gemini 3.8' : 'ChatGPT'} for code, viva tips, or bug fixes...`}
          className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#17142E] border border-purple-500/30 text-white text-xs placeholder:text-[#AAA9C6]/60 focus:outline-none focus:border-[#00F0FF] transition-all"
        />

        <button
          type="submit"
          disabled={!inputMessage.trim() || isLoading}
          className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-[#00F0FF] disabled:opacity-40 text-white flex items-center justify-center shadow-[0_0_15px_rgba(139,61,255,0.4)] transition-all active:scale-95 cursor-pointer shrink-0"
          title="Send Question (Enter)"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
};
