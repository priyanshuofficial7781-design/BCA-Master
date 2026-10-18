import React, { useRef, useState, useEffect, useCallback } from 'react';
import { WhiteboardStroke } from '../../types';
import {
  Pen,
  Highlighter,
  Eraser,
  Square,
  ArrowUpRight,
  Type,
  RotateCcw,
  RotateCw,
  Trash2,
  Download,
  Maximize2,
  Sparkles,
} from 'lucide-react';

interface CollaborativeWhiteboardProps {
  roomId: string;
  initialStrokes?: WhiteboardStroke[];
  onStrokesChange?: (strokes: WhiteboardStroke[]) => void;
}

export const CollaborativeWhiteboard: React.FC<CollaborativeWhiteboardProps> = ({
  roomId,
  initialStrokes = [],
  onStrokesChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [strokes, setStrokes] = useState<WhiteboardStroke[]>(initialStrokes);
  const [redoStack, setRedoStack] = useState<WhiteboardStroke[]>([]);

  // Active Tool state
  const [tool, setTool] = useState<WhiteboardStroke['tool']>('pen');
  const [color, setColor] = useState<string>('#c084fc');
  const [width, setWidth] = useState<number>(4);
  const [textInput, setTextInput] = useState<string>('');

  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<WhiteboardStroke | null>(null);

  // Cyberpunk Color Palette
  const cyberColors = [
    { label: 'Neon Violet', hex: '#c084fc' },
    { label: 'Cyan Laser', hex: '#38bdf8' },
    { label: 'Cyber Emerald', hex: '#34d399' },
    { label: 'Solar Amber', hex: '#fbbf24' },
    { label: 'Electric Pink', hex: '#f472b6' },
    { label: 'Pure White', hex: '#ffffff' },
  ];

  // Redraw entire canvas
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear background with dark obsidian tone
    ctx.fillStyle = '#0a0812';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle grid pattern for precision engineering feel
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
    ctx.lineWidth = 1;
    const gridSize = 24;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Render strokes
    strokes.forEach((stroke) => {
      drawStroke(ctx, stroke);
    });

    // Render active stroke currently being drawn
    if (currentStroke) {
      drawStroke(ctx, currentStroke);
    }
  }, [strokes, currentStroke]);

  // Render a single stroke
  const drawStroke = (ctx: CanvasRenderingContext2D, stroke: WhiteboardStroke) => {
    ctx.save();
    ctx.strokeStyle = stroke.color;
    ctx.fillStyle = stroke.color;
    ctx.lineWidth = stroke.width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (stroke.tool === 'highlighter') {
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = stroke.width * 2.5;
    } else if (stroke.tool === 'eraser') {
      ctx.strokeStyle = '#0a0812';
      ctx.lineWidth = stroke.width * 3;
    } else {
      ctx.globalAlpha = 1.0;
    }

    if (stroke.tool === 'rect') {
      if (stroke.points.length >= 2) {
        const start = stroke.points[0];
        const end = stroke.points[stroke.points.length - 1];
        ctx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
      }
    } else if (stroke.tool === 'arrow') {
      if (stroke.points.length >= 2) {
        const start = stroke.points[0];
        const end = stroke.points[stroke.points.length - 1];
        // Line
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        // Arrow head
        const angle = Math.atan2(end.y - start.y, end.x - start.x);
        const headLen = 14;
        ctx.beginPath();
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(
          end.x - headLen * Math.cos(angle - Math.PI / 6),
          end.y - headLen * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          end.x - headLen * Math.cos(angle + Math.PI / 6),
          end.y - headLen * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();
      }
    } else if (stroke.tool === 'text') {
      if (stroke.points.length > 0 && stroke.text) {
        const pt = stroke.points[0];
        ctx.font = 'bold 15px monospace';
        // Background tag for readability
        ctx.fillStyle = 'rgba(24, 19, 41, 0.85)';
        const textWidth = ctx.measureText(stroke.text).width;
        ctx.fillRect(pt.x - 4, pt.y - 18, textWidth + 8, 24);
        ctx.strokeStyle = stroke.color;
        ctx.strokeRect(pt.x - 4, pt.y - 18, textWidth + 8, 24);
        // Text
        ctx.fillStyle = stroke.color;
        ctx.fillText(stroke.text, pt.x, pt.y);
      }
    } else {
      // Pen, Highlighter, Eraser path
      if (stroke.points.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        const xc = (stroke.points[i - 1].x + stroke.points[i].x) / 2;
        const yc = (stroke.points[i - 1].y + stroke.points[i].y) / 2;
        ctx.quadraticCurveTo(stroke.points[i - 1].x, stroke.points[i - 1].y, xc, yc);
      }
      const last = stroke.points[stroke.points.length - 1];
      ctx.lineTo(last.x, last.y);
      ctx.stroke();
    }

    ctx.restore();
  };

  useEffect(() => {
    redraw();
  }, [redraw]);

  // Pointer position helper
  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  // Drawing event handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const coords = getCanvasCoords(e);
    setIsDrawing(true);

    const newStroke: WhiteboardStroke = {
      id: `stroke-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      tool,
      color,
      width,
      points: [coords],
      text: tool === 'text' ? textInput || 'Algorithmic Node' : undefined,
    };

    setCurrentStroke(newStroke);
    setRedoStack([]);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentStroke) return;
    const coords = getCanvasCoords(e);

    if (tool === 'rect' || tool === 'arrow') {
      setCurrentStroke((prev) =>
        prev ? { ...prev, points: [prev.points[0], coords] } : null
      );
    } else {
      setCurrentStroke((prev) =>
        prev ? { ...prev, points: [...prev.points, coords] } : null
      );
    }
  };

  const handlePointerUp = () => {
    if (!isDrawing || !currentStroke) return;
    setIsDrawing(false);

    const updatedStrokes = [...strokes, currentStroke];
    setStrokes(updatedStrokes);
    setCurrentStroke(null);
    onStrokesChange?.(updatedStrokes);
  };

  // Undo / Redo
  const handleUndo = () => {
    if (strokes.length === 0) return;
    const last = strokes[strokes.length - 1];
    const remaining = strokes.slice(0, -1);
    setStrokes(remaining);
    setRedoStack((prev) => [...prev, last]);
    onStrokesChange?.(remaining);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const item = redoStack[redoStack.length - 1];
    const newRedo = redoStack.slice(0, -1);
    const updated = [...strokes, item];
    setRedoStack(newRedo);
    setStrokes(updated);
    onStrokesChange?.(updated);
  };

  const handleClear = () => {
    if (strokes.length === 0) return;
    if (confirm('Clear the collaborative whiteboard?')) {
      setStrokes([]);
      setRedoStack([]);
      onStrokesChange?.([]);
    }
  };

  // Export board as PNG
  const handleExportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `whiteboard-${roomId}-${Date.now()}.png`;
    a.click();
  };

  return (
    <div className="flex flex-col h-full rounded-2xl bg-[#0D0A17] border border-violet-500/20 overflow-hidden shadow-2xl">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 bg-[#130F22]/90 border-b border-violet-500/15 backdrop-blur-md">
        {/* Tool Selector */}
        <div className="flex items-center gap-1 bg-[#090710] p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setTool('pen')}
            title="Pen"
            className={`p-2 rounded-lg transition-all ${
              tool === 'pen'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-[#9E99AF] hover:text-white'
            }`}
          >
            <Pen size={15} />
          </button>
          <button
            onClick={() => setTool('highlighter')}
            title="Highlighter"
            className={`p-2 rounded-lg transition-all ${
              tool === 'highlighter'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-[#9E99AF] hover:text-white'
            }`}
          >
            <Highlighter size={15} />
          </button>
          <button
            onClick={() => setTool('rect')}
            title="Bounding Box"
            className={`p-2 rounded-lg transition-all ${
              tool === 'rect'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-[#9E99AF] hover:text-white'
            }`}
          >
            <Square size={15} />
          </button>
          <button
            onClick={() => setTool('arrow')}
            title="Pointer Arrow"
            className={`p-2 rounded-lg transition-all ${
              tool === 'arrow'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-[#9E99AF] hover:text-white'
            }`}
          >
            <ArrowUpRight size={15} />
          </button>
          <button
            onClick={() => setTool('text')}
            title="Code / Text Stamp"
            className={`p-2 rounded-lg transition-all ${
              tool === 'text'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-[#9E99AF] hover:text-white'
            }`}
          >
            <Type size={15} />
          </button>
          <button
            onClick={() => setTool('eraser')}
            title="Eraser"
            className={`p-2 rounded-lg transition-all ${
              tool === 'eraser'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-[#9E99AF] hover:text-white'
            }`}
          >
            <Eraser size={15} />
          </button>
        </div>

        {/* Color Palette */}
        <div className="flex items-center gap-1.5 bg-[#090710] px-2 py-1 rounded-xl border border-white/5">
          {cyberColors.map((c) => (
            <button
              key={c.hex}
              onClick={() => setColor(c.hex)}
              title={c.label}
              className={`w-6 h-6 rounded-full transition-transform ${
                color === c.hex ? 'scale-125 ring-2 ring-white/80' : 'hover:scale-110 opacity-80'
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>

        {/* Stroke Width Slider */}
        <div className="flex items-center gap-2 bg-[#090710] px-3 py-1.5 rounded-xl border border-white/5 text-xs text-[#9E99AF]">
          <span>Size</span>
          <input
            type="range"
            min={2}
            max={16}
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="w-16 accent-violet-500 cursor-pointer"
          />
          <span className="font-mono text-white text-[11px] w-4">{width}</span>
        </div>

        {/* Undo, Redo, Clear, Export Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleUndo}
            disabled={strokes.length === 0}
            title="Undo"
            className="p-2 rounded-xl bg-[#161226] hover:bg-[#1E1933] border border-white/5 text-[#9E99AF] hover:text-white disabled:opacity-40 transition"
          >
            <RotateCcw size={14} />
          </button>
          <button
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            title="Redo"
            className="p-2 rounded-xl bg-[#161226] hover:bg-[#1E1933] border border-white/5 text-[#9E99AF] hover:text-white disabled:opacity-40 transition"
          >
            <RotateCw size={14} />
          </button>
          <button
            onClick={handleClear}
            disabled={strokes.length === 0}
            title="Clear Board"
            className="p-2 rounded-xl bg-rose-950/30 hover:bg-rose-950/50 border border-rose-500/20 text-rose-300 disabled:opacity-40 transition"
          >
            <Trash2 size={14} />
          </button>
          <button
            onClick={handleExportPNG}
            title="Export Board as PNG"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-violet-900/30 transition active:scale-95"
          >
            <Download size={13} />
            <span className="hidden sm:inline">Export PNG</span>
          </button>
        </div>
      </div>

      {/* Text Stamp Prompt Input when 'text' tool is active */}
      {tool === 'text' && (
        <div className="flex items-center gap-2 p-2 bg-[#1A142E] border-b border-violet-500/20 text-xs animate-fadeIn">
          <Type size={14} className="text-violet-300 ml-1" />
          <span className="text-[#AAA5B6]">Stamp text:</span>
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="e.g. Node A -> Node B (O(1))"
            className="flex-1 px-2.5 py-1 rounded-lg bg-[#0E0C17] border border-violet-500/30 text-white text-xs focus:outline-none focus:border-violet-400"
          />
          <span className="text-[10px] text-violet-300">Click on canvas to place</span>
        </div>
      )}

      {/* Interactive HTML5 Canvas */}
      <div className="relative flex-1 w-full min-h-[380px] bg-[#0A0812] cursor-crosshair overflow-hidden">
        <canvas
          ref={canvasRef}
          width={1200}
          height={800}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="w-full h-full touch-none"
        />

        {/* Ambient Room Watermark */}
        <div className="absolute bottom-3 right-4 pointer-events-none flex items-center gap-1.5 text-[10px] text-white/30 uppercase tracking-widest font-mono">
          <Sparkles size={11} className="text-violet-400" />
          <span>BCA CYBER COLLAB WHITEBOARD · {strokes.length} STROKES</span>
        </div>
      </div>
    </div>
  );
};
