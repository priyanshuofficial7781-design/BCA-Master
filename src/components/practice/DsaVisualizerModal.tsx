import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Code,
  Binary,
  Layers,
  Sparkles,
  CheckCircle2,
  Sliders,
  ChevronRight,
  Terminal,
} from 'lucide-react';
import { soundEffects } from '../../services/soundEffects';

interface DsaVisualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface StepState {
  array: number[];
  pointers: { label: string; index: number; color: string }[];
  highlightIndices: number[];
  log: string;
}

export const DsaVisualizerModal: React.FC<DsaVisualizerModalProps> = ({ isOpen, onClose }) => {
  const [selectedAlgo, setSelectedAlgo] = useState<'binarySearch' | 'bubbleSort' | 'stack' | 'twoPointers'>('binarySearch');
  const [selectedLang, setSelectedLang] = useState<'cpp' | 'python' | 'java'>('cpp');
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(700);

  // Algorithm pre-computed execution traces
  const algorithms = {
    binarySearch: {
      name: 'Binary Search (O(log n))',
      category: 'Searching',
      target: 24,
      initialArray: [2, 5, 8, 12, 16, 23, 24, 38, 56, 72, 91],
      code: {
        cpp: `int binarySearch(vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
        python: `def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
        java: `public int binarySearch(int[] arr, int target) {
    int low = 0, high = arr.length - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
      },
      steps: [
        {
          array: [2, 5, 8, 12, 16, 23, 24, 38, 56, 72, 91],
          pointers: [
            { label: 'Low', index: 0, color: '#00F0FF' },
            { label: 'High', index: 10, color: '#FF2E93' },
          ],
          highlightIndices: [],
          log: 'Initialize search space: Low = 0 (val: 2), High = 10 (val: 91). Target = 24.',
        },
        {
          array: [2, 5, 8, 12, 16, 23, 24, 38, 56, 72, 91],
          pointers: [
            { label: 'Low', index: 0, color: '#00F0FF' },
            { label: 'Mid', index: 5, color: '#B46CFF' },
            { label: 'High', index: 10, color: '#FF2E93' },
          ],
          highlightIndices: [5],
          log: 'Calculate Mid = (0 + 10) / 2 = 5. arr[5] = 23. Check: 23 == 24 (False). 23 < 24 -> Search Right.',
        },
        {
          array: [2, 5, 8, 12, 16, 23, 24, 38, 56, 72, 91],
          pointers: [
            { label: 'Low', index: 6, color: '#00F0FF' },
            { label: 'High', index: 10, color: '#FF2E93' },
          ],
          highlightIndices: [6],
          log: 'Update Low = Mid + 1 = 6 (val: 24). Space narrowed to indices [6..10].',
        },
        {
          array: [2, 5, 8, 12, 16, 23, 24, 38, 56, 72, 91],
          pointers: [
            { label: 'Low', index: 6, color: '#00F0FF' },
            { label: 'Mid', index: 8, color: '#B46CFF' },
            { label: 'High', index: 10, color: '#FF2E93' },
          ],
          highlightIndices: [8],
          log: 'Calculate Mid = (6 + 10) / 2 = 8. arr[8] = 56. Check: 56 == 24 (False). 56 > 24 -> Search Left.',
        },
        {
          array: [2, 5, 8, 12, 16, 23, 24, 38, 56, 72, 91],
          pointers: [
            { label: 'Low', index: 6, color: '#00F0FF' },
            { label: 'High', index: 7, color: '#FF2E93' },
          ],
          highlightIndices: [6, 7],
          log: 'Update High = Mid - 1 = 7 (val: 38). Space narrowed to indices [6..7].',
        },
        {
          array: [2, 5, 8, 12, 16, 23, 24, 38, 56, 72, 91],
          pointers: [
            { label: 'Low', index: 6, color: '#00F0FF' },
            { label: 'Mid', index: 6, color: '#00FF9D' },
            { label: 'High', index: 7, color: '#FF2E93' },
          ],
          highlightIndices: [6],
          log: 'TARGET FOUND! Mid = (6 + 7) / 2 = 6. arr[6] == 24. Return index 6 in O(log n) time.',
        },
      ],
    },
    bubbleSort: {
      name: 'Bubble Sort Tracing',
      category: 'Sorting',
      target: 0,
      initialArray: [45, 12, 89, 34, 22, 60],
      code: {
        cpp: `void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1])
                swap(arr[j], arr[j + 1]);
        }
    }
}`,
        python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]`,
        java: `public void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`,
      },
      steps: [
        {
          array: [45, 12, 89, 34, 22, 60],
          pointers: [
            { label: 'j', index: 0, color: '#00F0FF' },
            { label: 'j+1', index: 1, color: '#B46CFF' },
          ],
          highlightIndices: [0, 1],
          log: 'Compare arr[0] (45) > arr[1] (12). 45 > 12 -> Swap needed.',
        },
        {
          array: [12, 45, 89, 34, 22, 60],
          pointers: [
            { label: 'j', index: 1, color: '#00F0FF' },
            { label: 'j+1', index: 2, color: '#B46CFF' },
          ],
          highlightIndices: [1, 2],
          log: 'Swapped! Now compare arr[1] (45) and arr[2] (89). 45 < 89 -> Order is correct.',
        },
        {
          array: [12, 45, 89, 34, 22, 60],
          pointers: [
            { label: 'j', index: 2, color: '#00F0FF' },
            { label: 'j+1', index: 3, color: '#B46CFF' },
          ],
          highlightIndices: [2, 3],
          log: 'Compare arr[2] (89) > arr[3] (34). 89 > 34 -> Swap needed.',
        },
        {
          array: [12, 45, 34, 89, 22, 60],
          pointers: [
            { label: 'j', index: 3, color: '#00F0FF' },
            { label: 'j+1', index: 4, color: '#B46CFF' },
          ],
          highlightIndices: [3, 4],
          log: 'Swapped! Compare arr[3] (89) > arr[4] (22). 89 > 22 -> Swap needed.',
        },
        {
          array: [12, 45, 34, 22, 89, 60],
          pointers: [
            { label: 'j', index: 4, color: '#00F0FF' },
            { label: 'j+1', index: 5, color: '#B46CFF' },
          ],
          highlightIndices: [4, 5],
          log: 'Swapped! Compare arr[4] (89) > arr[5] (60). 89 > 60 -> Swap needed.',
        },
        {
          array: [12, 45, 34, 22, 60, 89],
          pointers: [{ label: 'Sorted', index: 5, color: '#00FF9D' }],
          highlightIndices: [5],
          log: 'Pass 1 complete: Element 89 has bubbled up to its final sorted position at index 5.',
        },
      ],
    },
    stack: {
      name: 'Stack LIFO Execution',
      category: 'Data Structures',
      target: 0,
      initialArray: [10, 20, 30],
      code: {
        cpp: `stack<int> s;
s.push(10);
s.push(20);
s.push(30);
s.push(40); // Top = 40
s.pop();    // Removes 40
s.push(50); // Top = 50`,
        python: `stack = []
stack.append(10)
stack.append(20)
stack.append(30)
stack.append(40)  # Top = 40
stack.pop()       # Removes 40
stack.append(50)  # Top = 50`,
        java: `Stack<Integer> stack = new Stack<>();
stack.push(10);
stack.push(20);
stack.push(30);
stack.push(40);
stack.pop();
stack.push(50);`,
      },
      steps: [
        {
          array: [10, 20, 30],
          pointers: [{ label: 'Top', index: 2, color: '#B46CFF' }],
          highlightIndices: [2],
          log: 'Stack initialized with 3 elements. Top = index 2 (value: 30).',
        },
        {
          array: [10, 20, 30, 40],
          pointers: [{ label: 'Top', index: 3, color: '#00F0FF' }],
          highlightIndices: [3],
          log: 'push(40): Pushed 40 onto stack. Top increments to index 3.',
        },
        {
          array: [10, 20, 30],
          pointers: [{ label: 'Top', index: 2, color: '#FF2E93' }],
          highlightIndices: [2],
          log: 'pop(): Removed top element 40. Top decrements to index 2 (value: 30).',
        },
        {
          array: [10, 20, 30, 50],
          pointers: [{ label: 'Top', index: 3, color: '#00FF9D' }],
          highlightIndices: [3],
          log: 'push(50): Pushed 50 onto stack. Top is now index 3 (value: 50). LIFO order verified.',
        },
      ],
    },
    twoPointers: {
      name: 'Two Pointers (Target Sum = 14)',
      category: 'Array Pointers',
      target: 14,
      initialArray: [1, 3, 5, 7, 9, 11, 13],
      code: {
        cpp: `bool twoSumSorted(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left < right) {
        int sum = arr[left] + arr[right];
        if (sum == target) return true;
        if (sum < target) left++;
        else right--;
    }
    return false;
}`,
        python: `def two_sum_sorted(arr, target):
    left, right = 0, len(arr) - 1
    while left < right:
        cur_sum = arr[left] + arr[right]
        if cur_sum == target:
            return True
        elif cur_sum < target:
            left += 1
        else:
            right -= 1
    return False`,
        java: `public boolean twoSum(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left < right) {
        int sum = arr[left] + arr[right];
        if (sum == target) return true;
        if (sum < target) left++;
        else right--;
    }
    return false;
}`,
      },
      steps: [
        {
          array: [1, 3, 5, 7, 9, 11, 13],
          pointers: [
            { label: 'Left', index: 0, color: '#00F0FF' },
            { label: 'Right', index: 6, color: '#FF2E93' },
          ],
          highlightIndices: [0, 6],
          log: 'Sum = arr[0] (1) + arr[6] (13) = 14. 14 == Target (14). Pair found immediately at (0, 6)!',
        },
      ],
    },
  };

  const currentConfig = algorithms[selectedAlgo];
  const maxSteps = currentConfig.steps.length;
  const activeStep = currentConfig.steps[currentStepIdx] || currentConfig.steps[0];

  // Auto-play timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= maxSteps - 1) {
            setIsPlaying(false);
            soundEffects.playLevelUp();
            return prev;
          }
          soundEffects.playClick();
          return prev + 1;
        });
      }, speedMs);
    }
    return () => clearInterval(timer);
  }, [isPlaying, maxSteps, speedMs]);

  const handleNextStep = () => {
    if (currentStepIdx < maxSteps - 1) {
      soundEffects.playClick();
      setCurrentStepIdx((prev) => prev + 1);
    } else {
      soundEffects.playSuccess();
    }
  };

  const handlePrevStep = () => {
    if (currentStepIdx > 0) {
      soundEffects.playClick();
      setCurrentStepIdx((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    soundEffects.playClick();
    setIsPlaying(false);
    setCurrentStepIdx(0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-[#0C0A18] border border-[#B46CFF]/35 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(139,61,255,0.25)] overflow-hidden">
        {/* Top Specular Neon Rail */}
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00F0FF]/60 via-[#B46CFF]/80 to-transparent pointer-events-none" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#B46CFF]/20 flex items-center justify-between gap-3 bg-[#100E24]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#8B3DFF] to-[#00FF9D] flex items-center justify-center text-white shadow-[0_0_15px_rgba(139,61,255,0.4)]">
              <Binary size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
                <span>Interactive DSA Code Runner & Visualizer</span>
                <span className="px-2 py-0.5 rounded-full bg-[#00FF9D]/20 border border-[#00FF9D]/35 text-[10px] font-mono text-[#00FF9D]">
                  MEMORY TRACE
                </span>
              </h2>
              <p className="text-xs text-[#AAA9C6]">
                Step-by-step algorithm memory state, pointer visualizer & executable code
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            className="w-9 h-9 rounded-xl bg-[#181530] hover:bg-[#252048] border border-white/10 flex items-center justify-center text-[#AAA9C6] hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Algorithm Picker Strip */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5 bg-[#090714] overflow-x-auto">
          {Object.entries(algorithms).map(([key, algo]) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setSelectedAlgo(key as any);
                setCurrentStepIdx(0);
                setIsPlaying(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedAlgo === key
                  ? 'bg-[#8B3DFF]/30 text-white border border-[#B46CFF]/45 shadow-[0_0_12px_rgba(180,108,255,0.3)]'
                  : 'text-[#AAA9C6] hover:text-white bg-[#141126]/60'
              }`}
            >
              {algo.name}
            </button>
          ))}
        </div>

        {/* Visualizer Canvas & Code Split View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* 1. Visual Memory Array & Pointers */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-[#16132D] via-[#100E22] to-[#0A0816] border border-[#B46CFF]/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between text-xs text-[#AAA9C6]">
              <span className="font-bold text-white uppercase tracking-wider">
                Memory Array Buffer (Indices & Values)
              </span>
              <span className="font-mono text-[#00F0FF]">
                Step {currentStepIdx + 1} of {maxSteps}
              </span>
            </div>

            {/* Elements Blocks */}
            <div className="flex items-end justify-center gap-2 sm:gap-3 py-4 overflow-x-auto min-h-[130px]">
              {activeStep.array.map((val, idx) => {
                const isHighlighted = activeStep.highlightIndices.includes(idx);
                const matchingPointers = activeStep.pointers.filter((p) => p.index === idx);

                return (
                  <div key={idx} className="flex flex-col items-center gap-1.5 shrink-0">
                    {/* Pointer tags floating above */}
                    <div className="h-6 flex items-center justify-center gap-1">
                      {matchingPointers.map((p, pIdx) => (
                        <span
                          key={pIdx}
                          className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider shadow-sm"
                          style={{
                            backgroundColor: `${p.color}33`,
                            color: p.color,
                            border: `1px solid ${p.color}88`,
                          }}
                        >
                          {p.label}
                        </span>
                      ))}
                    </div>

                    {/* Array Cell */}
                    <div
                      className={`w-11 h-12 sm:w-14 sm:h-14 rounded-2xl flex flex-col items-center justify-center font-mono font-bold text-sm sm:text-base transition-all duration-300 shadow-md ${
                        isHighlighted
                          ? 'bg-gradient-to-t from-[#8B3DFF] to-[#00F0FF] text-white scale-110 shadow-[0_0_20px_rgba(0,240,255,0.5)] border-2 border-white'
                          : 'bg-[#181530] text-[#F7F5FF] border border-[#B46CFF]/20'
                      }`}
                    >
                      <span>{val}</span>
                    </div>

                    {/* Index Label */}
                    <span className="text-[10px] text-[#AAA9C6] font-mono">[{idx}]</span>
                  </div>
                );
              })}
            </div>

            {/* Step Trace Log Box */}
            <div className="p-3.5 rounded-2xl bg-[#090714] border border-[#B46CFF]/20 flex items-start gap-2.5">
              <Terminal size={16} className="text-[#00FF9D] shrink-0 mt-0.5" />
              <div className="flex-1 font-mono text-xs text-white leading-relaxed">
                {activeStep.log}
              </div>
            </div>

            {/* Stepping Playback Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#8B3DFF] to-[#4D79FF] hover:opacity-90 text-white text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(139,61,255,0.4)] cursor-pointer"
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                  <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={currentStepIdx >= maxSteps - 1}
                  className="px-3.5 py-2 rounded-xl bg-[#1C1835] hover:bg-[#28224D] disabled:opacity-40 border border-white/10 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                >
                  <span>Step</span>
                  <SkipForward size={13} />
                </button>

                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={currentStepIdx === 0}
                  className="px-3 py-2 rounded-xl bg-[#1C1835] hover:bg-[#28224D] disabled:opacity-40 border border-white/10 text-white text-xs font-medium cursor-pointer"
                >
                  Prev
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="p-2 rounded-xl bg-[#1C1835] hover:bg-[#28224D] border border-white/10 text-[#AAA9C6] hover:text-white cursor-pointer"
                  title="Reset to Step 1"
                >
                  <RotateCcw size={14} />
                </button>
              </div>

              {/* Speed Controller */}
              <div className="flex items-center gap-2 text-xs text-[#AAA9C6]">
                <Sliders size={13} />
                <span>Speed:</span>
                <button
                  type="button"
                  onClick={() => setSpeedMs(1100)}
                  className={`px-2 py-0.5 rounded ${speedMs === 1100 ? 'bg-purple-600 text-white font-bold' : 'hover:text-white'}`}
                >
                  0.5x
                </button>
                <button
                  type="button"
                  onClick={() => setSpeedMs(700)}
                  className={`px-2 py-0.5 rounded ${speedMs === 700 ? 'bg-purple-600 text-white font-bold' : 'hover:text-white'}`}
                >
                  1x
                </button>
                <button
                  type="button"
                  onClick={() => setSpeedMs(350)}
                  className={`px-2 py-0.5 rounded ${speedMs === 350 ? 'bg-purple-600 text-white font-bold' : 'hover:text-white'}`}
                >
                  2x
                </button>
              </div>
            </div>
          </div>

          {/* 2. Code Editor Preview with Language Switcher */}
          <div className="p-5 rounded-3xl bg-[#090714] border border-[#B46CFF]/25 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code size={15} className="text-[#00F0FF]" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Algorithm Implementation
                </span>
              </div>

              <div className="flex items-center gap-1 p-1 rounded-xl bg-[#141126] border border-white/10">
                {(['cpp', 'python', 'java'] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => {
                      soundEffects.playClick();
                      setSelectedLang(lang);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono transition-all uppercase cursor-pointer ${
                      selectedLang === lang
                        ? 'bg-[#8B3DFF] text-white shadow-sm'
                        : 'text-[#AAA9C6] hover:text-white'
                    }`}
                  >
                    {lang === 'cpp' ? 'C++' : lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Snippet Box */}
            <div className="relative rounded-2xl bg-[#06040F] border border-white/5 p-4 font-mono text-xs text-[#E2E8F0] overflow-x-auto leading-relaxed">
              <pre>{currentConfig.code[selectedLang]}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
