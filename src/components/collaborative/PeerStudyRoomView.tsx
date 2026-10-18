import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  StudyRoom,
  RoomParticipant,
  RoomMessage,
  WhiteboardStroke,
} from '../../types';
import { CollaborativeWhiteboard } from './CollaborativeWhiteboard';
import {
  Users,
  MessageSquare,
  Code2,
  Timer,
  Play,
  Pause,
  Plus,
  ArrowLeft,
  Flame,
  Sparkles,
  Send,
  Copy,
  Check,
  Share2,
  Lock,
  Unlock,
  Radio,
  Coffee,
  HelpCircle,
} from 'lucide-react';

export const PeerStudyRoomView: React.FC = () => {
  const { data } = useApp();

  // Default active rooms
  const initialRooms: StudyRoom[] = [
    {
      id: 'room-dsa-1',
      name: 'DSA Trees, Graphs & Dynamic Programming Sprint',
      track: 'Data Structures & Algorithms',
      topic: 'Binary Search Trees & Dijkstra Algorithm',
      hostName: 'Priya Sharma (Sem 4)',
      activeCount: 5,
      participants: [
        {
          id: 'p-1',
          name: 'Priya Sharma (Host)',
          avatarColor: '#c084fc',
          isHost: true,
          status: 'focusing',
          streak: 14,
        },
        {
          id: 'p-2',
          name: 'Aarav Patel',
          avatarColor: '#38bdf8',
          isHost: false,
          status: 'focusing',
          streak: 7,
        },
        {
          id: 'p-3',
          name: 'Meera Rao',
          avatarColor: '#34d399',
          isHost: false,
          status: 'discussing',
          streak: 21,
        },
        {
          id: 'p-4',
          name: 'Vikram Joshi',
          avatarColor: '#fbbf24',
          isHost: false,
          status: 'focusing',
          streak: 4,
        },
        {
          id: 'p-5',
          name: `${data.profile.name || 'You'}`,
          avatarColor: '#a855f7',
          isHost: false,
          status: 'focusing',
          streak: 8,
        },
      ],
      pomodoroSprint: {
        active: true,
        minutesRemaining: 19,
        totalMinutes: 25,
        isBreak: false,
      },
      isLocked: false,
      codePad: `// C++ Binary Tree In-Order Traversal (Interactive Shared Pad)
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

void inOrder(TreeNode* root) {
    if (!root) return;
    inOrder(root->left);
    cout << root->val << " ";
    inOrder(root->right);
}`,
      messages: [
        {
          id: 'm-1',
          senderName: 'Priya Sharma',
          senderColor: '#c084fc',
          text: 'Welcome team! Drawing the recursion call stack on the whiteboard right now.',
          timestamp: '14:20',
          reactions: [{ emoji: '🔥', count: 3 }],
        },
        {
          id: 'm-2',
          senderName: 'Meera Rao',
          senderColor: '#34d399',
          text: 'Check line 7 in the code pad — that handles null leaves cleanly.',
          timestamp: '14:22',
          reactions: [{ emoji: '💡', count: 2 }],
        },
      ],
      strokes: [
        {
          id: 's-1',
          tool: 'rect',
          color: '#38bdf8',
          width: 3,
          points: [
            { x: 180, y: 120 },
            { x: 340, y: 220 },
          ],
        },
        {
          id: 's-2',
          tool: 'text',
          color: '#c084fc',
          width: 3,
          points: [{ x: 210, y: 175 }],
          text: 'Root Node (val: 10)',
        },
        {
          id: 's-3',
          tool: 'arrow',
          color: '#34d399',
          width: 3,
          points: [
            { x: 210, y: 220 },
            { x: 140, y: 320 },
          ],
        },
      ],
    },
    {
      id: 'room-web-2',
      name: 'Full-Stack REST APIs & React 19 State Architecture',
      track: 'Web & Cloud Engineering',
      topic: 'JWT Authentication & Optimistic State',
      hostName: 'Rohan Verma (Sem 5)',
      activeCount: 3,
      participants: [
        {
          id: 'p-10',
          name: 'Rohan Verma (Host)',
          avatarColor: '#38bdf8',
          isHost: true,
          status: 'focusing',
          streak: 18,
        },
        {
          id: 'p-11',
          name: 'Kabir Das',
          avatarColor: '#f472b6',
          isHost: false,
          status: 'discussing',
          streak: 11,
        },
      ],
      pomodoroSprint: {
        active: true,
        minutesRemaining: 42,
        totalMinutes: 50,
        isBreak: false,
      },
      isLocked: false,
      codePad: `// Express Auth Middleware
export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  // Verify token logic here...
  next();
};`,
      messages: [
        {
          id: 'm-20',
          senderName: 'Rohan Verma',
          senderColor: '#38bdf8',
          text: 'Sprint 2 has started. Focus block is 50 minutes.',
          timestamp: '14:10',
        },
      ],
      strokes: [],
    },
    {
      id: 'room-dbms-3',
      name: 'BCA Semester Finals: DBMS Normalization (3NF & BCNF)',
      track: 'University Core Curriculum',
      topic: 'Functional Dependencies & Lossless Join Decomposition',
      hostName: 'Ananya Mukherjee (Sem 3)',
      activeCount: 4,
      participants: [
        {
          id: 'p-20',
          name: 'Ananya Mukherjee (Host)',
          avatarColor: '#fbbf24',
          isHost: true,
          status: 'taking_break',
          streak: 26,
        },
      ],
      pomodoroSprint: {
        active: false,
        minutesRemaining: 5,
        totalMinutes: 5,
        isBreak: true,
      },
      isLocked: false,
      codePad: `-- SQL Schema Normalization Example
CREATE TABLE StudentCourses (
    roll_number INT,
    course_code VARCHAR(10),
    instructor VARCHAR(50),
    PRIMARY KEY (roll_number, course_code)
);`,
      messages: [],
      strokes: [],
    },
  ];

  const [rooms, setRooms] = useState<StudyRoom[]>(initialRooms);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);

  // Active room side tab: 'chat' | 'code' | 'peers'
  const [activeSideTab, setActiveSideTab] = useState<'chat' | 'code' | 'peers'>('chat');
  const [newMessage, setNewMessage] = useState('');
  const [codeCopied, setCodeCopied] = useState(false);

  // Create Room Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomTrack, setNewRoomTrack] = useState('Data Structures & Algorithms');
  const [newRoomTopic, setNewRoomTopic] = useState('');
  const [newRoomSprint, setNewRoomSprint] = useState(25);

  const activeRoom = rooms.find((r) => r.id === activeRoomId);

  // Group Pomodoro Timer countdown simulation
  useEffect(() => {
    if (!activeRoom || !activeRoom.pomodoroSprint.active) return;

    const interval = setInterval(() => {
      setRooms((prev) =>
        prev.map((room) => {
          if (room.id !== activeRoom.id) return room;
          if (room.pomodoroSprint.minutesRemaining <= 1) {
            // Flip to break or restart
            const nextIsBreak = !room.pomodoroSprint.isBreak;
            return {
              ...room,
              pomodoroSprint: {
                active: true,
                isBreak: nextIsBreak,
                totalMinutes: nextIsBreak ? 5 : 25,
                minutesRemaining: nextIsBreak ? 5 : 25,
              },
            };
          }
          return {
            ...room,
            pomodoroSprint: {
              ...room.pomodoroSprint,
              minutesRemaining: room.pomodoroSprint.minutesRemaining - 1,
            },
          };
        })
      );
    }, 60000); // decrement each minute

    return () => clearInterval(interval);
  }, [activeRoom]);

  // Handle sending a chat message in active room
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeRoom) return;

    const msg: RoomMessage = {
      id: `msg-${Date.now()}`,
      senderName: data.profile.name || 'You',
      senderColor: '#c084fc',
      text: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setRooms((prev) =>
      prev.map((r) =>
        r.id === activeRoom.id ? { ...r, messages: [...r.messages, msg] } : r
      )
    );
    setNewMessage('');
  };

  // Handle updating whiteboard strokes
  const handleStrokesChange = (newStrokes: WhiteboardStroke[]) => {
    if (!activeRoom) return;
    setRooms((prev) =>
      prev.map((r) =>
        r.id === activeRoom.id ? { ...r, strokes: newStrokes } : r
      )
    );
  };

  // Handle creating a new study room
  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    const created: StudyRoom = {
      id: `room-${Date.now()}`,
      name: newRoomName.trim(),
      track: newRoomTrack,
      topic: newRoomTopic.trim() || 'Collaborative Study Session',
      hostName: `${data.profile.name || 'You'} (Host)`,
      activeCount: 1,
      participants: [
        {
          id: `p-${Date.now()}`,
          name: `${data.profile.name || 'You'} (Host)`,
          avatarColor: '#c084fc',
          isHost: true,
          status: 'focusing',
          streak: 8,
        },
      ],
      pomodoroSprint: {
        active: true,
        minutesRemaining: newRoomSprint,
        totalMinutes: newRoomSprint,
        isBreak: false,
      },
      isLocked: false,
      codePad: `// Collaborative Scratchpad for ${newRoomName}\n`,
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderName: 'System',
          senderColor: '#34d399',
          text: `Study Room initialized. Group Pomodoro set to ${newRoomSprint} minutes.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
      strokes: [],
    };

    setRooms([created, ...rooms]);
    setActiveRoomId(created.id);
    setIsCreateModalOpen(false);
    setNewRoomName('');
    setNewRoomTopic('');
  };

  // Copy code snippet helper
  const handleCopyCode = () => {
    if (!activeRoom) return;
    navigator.clipboard.writeText(activeRoom.codePad);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto animate-fadeIn">
      {/* If in Lobby (No active room selected) */}
      {!activeRoom ? (
        <>
          {/* Cyberpunk Header Hero */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1B1430] via-[#120E22] to-[#080611] border border-violet-500/30 p-6 sm:p-8 shadow-[0_12px_45px_rgba(0,0,0,0.65)]">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-violet-600/25 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-violet-600 to-cyan-600 text-[10px] font-extrabold tracking-wider text-white uppercase shadow-[0_0_15px_rgba(139,92,246,0.6)] mb-3">
                  <Radio size={13} className="animate-pulse text-cyan-200" />
                  <span>CYBER COLLABORATION HUB</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Peer Study Rooms &amp; Shared Whiteboard
                </h2>
                <p className="text-xs sm:text-sm text-[#AAA5B6] mt-2 max-w-xl leading-relaxed">
                  Join live, synchronized study rooms with BCA batchmates. Brainstorm algorithm proofs on the real-time canvas, synchronize group focus sprints, and crack complex problems together.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white text-xs font-bold shadow-[0_0_25px_rgba(139,92,246,0.5)] border border-violet-400/30 flex items-center gap-2 transition-all active:scale-95"
                >
                  <Plus size={16} />
                  <span>Create Study Room</span>
                </button>
              </div>
            </div>
          </div>

          {/* Active Rooms Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-violet-400" />
                <h3 className="text-base font-bold text-white tracking-tight">
                  Live Active Study Lounges
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-violet-500/20 border border-violet-500/30 text-[11px] font-mono text-violet-300">
                  {rooms.length} Rooms
                </span>
              </div>
              <div className="text-xs text-[#9E99AF] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Live Synchronized</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="group relative flex flex-col justify-between p-5 rounded-3xl bg-[#131021]/80 hover:bg-[#19142A]/90 border border-violet-500/20 hover:border-violet-500/40 transition-all shadow-lg hover:shadow-[0_8px_30px_rgba(139,92,246,0.2)] backdrop-blur-xl"
                >
                  <div>
                    {/* Top Tag & Active Peer Indicator */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-bold text-violet-300 uppercase px-2.5 py-0.5 rounded-full bg-violet-600/20 border border-violet-500/30">
                        {room.track}
                      </span>
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[11px] text-emerald-300 font-mono">
                        <Users size={12} />
                        <span>{room.activeCount} online</span>
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-white group-hover:text-violet-200 transition line-clamp-2">
                      {room.name}
                    </h4>

                    <p className="text-xs text-[#AAA5B6] mt-1.5 flex items-center gap-1">
                      <Sparkles size={12} className="text-cyan-400 shrink-0" />
                      <span className="truncate">{room.topic}</span>
                    </p>

                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-[#9E99AF]">
                      <span>Host: <strong className="text-white/90">{room.hostName}</strong></span>
                      <div className="flex items-center gap-1 text-amber-300 font-mono">
                        <Timer size={12} />
                        <span>
                          {room.pomodoroSprint.isBreak ? 'Break: ' : 'Sprint: '}
                          {room.pomodoroSprint.minutesRemaining}m
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Join Action */}
                  <button
                    onClick={() => setActiveRoomId(room.id)}
                    className="mt-5 w-full py-2.5 rounded-2xl bg-gradient-to-r from-violet-600/80 to-indigo-600/80 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold transition shadow-md shadow-violet-900/30 active:scale-95"
                  >
                    Join Study Lounge
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Inside Active Study Room Workspace */
        <div className="space-y-4">
          {/* Room Header Navigation & Synchronized Sprint HUD */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-3xl bg-[#130F22] border border-violet-500/25 shadow-xl">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveRoomId(null)}
                className="p-2 rounded-xl bg-[#090712] hover:bg-[#1E1933] border border-white/5 text-[#9E99AF] hover:text-white transition"
                title="Leave Room & Back to Lobby"
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-violet-300 px-2 py-0.5 rounded-full bg-violet-600/20 border border-violet-500/30">
                    {activeRoom.track}
                  </span>
                  <span className="text-xs text-[#AAA5B6]">· Topic: {activeRoom.topic}</span>
                </div>
                <h3 className="text-base font-bold text-white tracking-tight mt-0.5">
                  {activeRoom.name}
                </h3>
              </div>
            </div>

            {/* Synchronized Sprint HUD */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[#0A0713] border border-violet-500/30 shadow-inner">
                {activeRoom.pomodoroSprint.isBreak ? (
                  <Coffee size={15} className="text-amber-400 animate-bounce" />
                ) : (
                  <Timer size={15} className="text-violet-400" />
                )}
                <div className="text-xs">
                  <span className="text-[10px] text-[#9E99AF] uppercase block leading-none">
                    {activeRoom.pomodoroSprint.isBreak ? 'Team Break' : 'Focus Sprint'}
                  </span>
                  <span className="font-mono font-bold text-white text-sm">
                    {activeRoom.pomodoroSprint.minutesRemaining}m remaining
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveRoomId(null)}
                className="px-3.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-950/70 border border-rose-500/30 text-rose-300 text-xs font-semibold transition"
              >
                Leave Room
              </button>
            </div>
          </div>

          {/* Main Study Room Split Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-[580px]">
            {/* Left 2 Cols: Collaborative Whiteboard */}
            <div className="lg:col-span-2 h-[520px] lg:h-[620px]">
              <CollaborativeWhiteboard
                roomId={activeRoom.id}
                initialStrokes={activeRoom.strokes}
                onStrokesChange={handleStrokesChange}
              />
            </div>

            {/* Right 1 Col: Tabbed Suite (Chat / Code Pad / Connected Peers) */}
            <div className="flex flex-col h-[520px] lg:h-[620px] rounded-2xl bg-[#0F0C1B] border border-violet-500/20 overflow-hidden shadow-2xl">
              {/* Tab Selector */}
              <div className="flex items-center justify-between p-2 bg-[#140F24] border-b border-white/5">
                <button
                  onClick={() => setActiveSideTab('chat')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    activeSideTab === 'chat'
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'text-[#9E99AF] hover:text-white'
                  }`}
                >
                  <MessageSquare size={14} />
                  <span>Study Chat</span>
                </button>
                <button
                  onClick={() => setActiveSideTab('code')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    activeSideTab === 'code'
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'text-[#9E99AF] hover:text-white'
                  }`}
                >
                  <Code2 size={14} />
                  <span>Shared Code</span>
                </button>
                <button
                  onClick={() => setActiveSideTab('peers')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    activeSideTab === 'peers'
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'text-[#9E99AF] hover:text-white'
                  }`}
                >
                  <Users size={14} />
                  <span>Peers ({activeRoom.participants.length})</span>
                </button>
              </div>

              {/* Tab 1: Live Peer Study Chat */}
              {activeSideTab === 'chat' && (
                <div className="flex flex-col flex-1 p-3 overflow-hidden">
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                    {activeRoom.messages.length === 0 ? (
                      <div className="text-center text-[#9E99AF] py-12">
                        No messages yet. Say hi to start collaborating!
                      </div>
                    ) : (
                      activeRoom.messages.map((msg) => (
                        <div key={msg.id} className="p-2.5 rounded-xl bg-[#161226] border border-white/5">
                          <div className="flex items-center justify-between mb-1">
                            <span
                              className="font-bold text-[11px]"
                              style={{ color: msg.senderColor }}
                            >
                              {msg.senderName}
                            </span>
                            <span className="text-[10px] text-[#9E99AF] font-mono">
                              {msg.timestamp}
                            </span>
                          </div>
                          <p className="text-white/90 leading-relaxed">{msg.text}</p>
                          {msg.reactions && (
                            <div className="flex items-center gap-1 mt-1.5">
                              {msg.reactions.map((r, i) => (
                                <span
                                  key={i}
                                  className="px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px]"
                                >
                                  {r.emoji} {r.count}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Message Input Form */}
                  <form onSubmit={handleSendMessage} className="mt-2 flex items-center gap-1.5">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Discuss question, idea, or proof..."
                      className="flex-1 px-3 py-2 rounded-xl bg-[#090712] border border-violet-500/25 text-white text-xs focus:outline-none focus:border-violet-400"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="p-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-40 transition"
                    >
                      <Send size={15} />
                    </button>
                  </form>
                </div>
              )}

              {/* Tab 2: Shared Code Scratchpad */}
              {activeSideTab === 'code' && (
                <div className="flex flex-col flex-1 p-3 overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono text-[#9E99AF]">
                      Collaborative Scratchpad
                    </span>
                    <button
                      onClick={handleCopyCode}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 text-[11px] font-semibold border border-violet-500/30 transition"
                    >
                      {codeCopied ? <Check size={12} /> : <Copy size={12} />}
                      <span>{codeCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <textarea
                    value={activeRoom.codePad}
                    onChange={(e) => {
                      const updated = e.target.value;
                      setRooms((prev) =>
                        prev.map((r) =>
                          r.id === activeRoom.id ? { ...r, codePad: updated } : r
                        )
                      );
                    }}
                    placeholder="Type or paste shared code snippets here..."
                    className="flex-1 w-full p-3 rounded-xl bg-[#080612] border border-white/10 font-mono text-xs text-emerald-300 focus:outline-none focus:border-violet-400 resize-none leading-relaxed"
                  />
                </div>
              )}

              {/* Tab 3: Connected Peers Presence */}
              {activeSideTab === 'peers' && (
                <div className="flex flex-col flex-1 p-3 overflow-y-auto space-y-2">
                  <div className="text-[11px] text-[#9E99AF] mb-1">
                    Active Study Partners ({activeRoom.participants.length})
                  </div>
                  {activeRoom.participants.map((peer) => (
                    <div
                      key={peer.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-[#161226] border border-white/5"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm"
                          style={{ backgroundColor: peer.avatarColor }}
                        >
                          {peer.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1">
                            <span>{peer.name}</span>
                            {peer.isHost && (
                              <span className="text-[9px] text-amber-300 bg-amber-500/20 px-1 py-0.2 rounded font-mono">
                                HOST
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-[#9E99AF] flex items-center gap-1">
                            <Flame size={10} className="text-amber-400 fill-amber-400" />
                            <span>{peer.streak} Day Streak</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            peer.status === 'focusing'
                              ? 'bg-emerald-400 animate-pulse'
                              : peer.status === 'discussing'
                              ? 'bg-cyan-400'
                              : 'bg-amber-400'
                          }`}
                        />
                        <span className="text-[10px] font-mono text-[#AAA5B6] capitalize">
                          {peer.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Study Room */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-[#140F24] border border-violet-500/30 p-6 shadow-2xl relative text-white">
            <h3 className="text-lg font-bold text-white">Create Collaborative Study Room</h3>
            <p className="text-xs text-[#AAA5B6] mt-1">
              Set up a live study lounge with shared whiteboard and synchronized Pomodoro.
            </p>

            <form onSubmit={handleCreateRoom} className="mt-4 space-y-3.5">
              <div>
                <label className="text-xs text-[#AAA5B6] block mb-1">Room Name</label>
                <input
                  type="text"
                  required
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="e.g. Graph Algorithms & Shortest Path Grind"
                  className="w-full px-3 py-2 rounded-xl bg-[#090712] border border-violet-500/30 text-white text-xs focus:outline-none focus:border-violet-400"
                />
              </div>

              <div>
                <label className="text-xs text-[#AAA5B6] block mb-1">Study Track</label>
                <select
                  value={newRoomTrack}
                  onChange={(e) => setNewRoomTrack(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#090712] border border-violet-500/30 text-white text-xs focus:outline-none focus:border-violet-400"
                >
                  <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                  <option value="Web & Cloud Engineering">Web & Cloud Engineering</option>
                  <option value="AI & Machine Learning">AI & Machine Learning</option>
                  <option value="University Core Curriculum">University Core Curriculum</option>
                  <option value="Placement Aptitude & OA">Placement Aptitude & OA</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-[#AAA5B6] block mb-1">Specific Topic / Subgoal</label>
                <input
                  type="text"
                  value={newRoomTopic}
                  onChange={(e) => setNewRoomTopic(e.target.value)}
                  placeholder="e.g. Solve 5 Medium Graph Questions"
                  className="w-full px-3 py-2 rounded-xl bg-[#090712] border border-violet-500/30 text-white text-xs focus:outline-none focus:border-violet-400"
                />
              </div>

              <div>
                <label className="text-xs text-[#AAA5B6] block mb-1">Sprint Duration (Minutes)</label>
                <div className="grid grid-cols-3 gap-2">
                  {[25, 50, 90].map((dur) => (
                    <button
                      type="button"
                      key={dur}
                      onClick={() => setNewRoomSprint(dur)}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${
                        newRoomSprint === dur
                          ? 'bg-violet-600 border-violet-400 text-white'
                          : 'bg-[#090712] border-white/5 text-[#AAA5B6]'
                      }`}
                    >
                      {dur}m Sprint
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-xs font-bold shadow-lg shadow-violet-900/40 active:scale-95"
                >
                  Launch Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
