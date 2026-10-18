import { GoogleGenAI } from '@google/genai';

// Retrieve API key safely from Vite client environment
const getApiKey = (): string | undefined => {
  return (
    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) ||
    (typeof process !== 'undefined' && process.env && process.env.GEMINI_API_KEY) ||
    undefined
  );
};

export interface VivaEvaluationResult {
  score: number; // 0-10
  verdict: 'Excellent' | 'Good' | 'Needs Improvement' | 'Unsatisfactory';
  strengths: string[];
  missingConcepts: string[];
  examinerFeedback: string;
  idealAnswer: string;
}

export interface CodeAnalysisResult {
  timeComplexity: string;
  spaceComplexity: string;
  explanation: string;
  optimizationTips: string[];
  potentialBugs: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  model: 'gemini' | 'chatgpt';
}

export const geminiService = {
  isConfigured(): boolean {
    return Boolean(getApiKey());
  },

  async chatWithAI(params: {
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
    persona: 'gemini' | 'chatgpt';
  }): Promise<string> {
    const apiKey = getApiKey();
    const lastUserMsg = [...params.messages].reverse().find((m) => m.role === 'user')?.content || '';

    if (!apiKey) {
      return this.fallbackChatResponse(lastUserMsg, params.persona);
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = params.persona === 'gemini'
        ? `You are Google Gemini 3.8 Flash, an elite AI Computer Science Professor and BCA Mentor. You specialize in C++, C, Python, Java, Data Structures & Algorithms, OS, DBMS, Web, and Technical Viva preparation. Provide succinct, accurate, university-grade markdown explanations with syntax-highlighted code snippets and Big-O complexity.`
        : `You are ChatGPT-4o Senior Coding Coach, an expert full-stack engineer and interview coach. Help the student write production-grade code in any language, troubleshoot bugs, provide algorithmic breakdowns, and prepare for technical placement drives. Provide practical, high-yield answers with markdown code blocks.`;

      // Build conversation context
      const formattedHistory = params.messages
        .slice(-6)
        .map((m) => `${m.role === 'user' ? 'Student' : 'Assistant'}: ${m.content}`)
        .join('\n\n');

      const prompt = `${systemInstruction}\n\nConversation Context:\n${formattedHistory}\n\nAssistant Response:`;

      const res = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          temperature: 0.3,
        },
      });

      return res.text?.trim() || this.fallbackChatResponse(lastUserMsg, params.persona);
    } catch (err) {
      console.warn('Gemini Chat API call failed, using built-in CS knowledge base', err);
      return this.fallbackChatResponse(lastUserMsg, params.persona);
    }
  },

  fallbackChatResponse(query: string, persona: 'gemini' | 'chatgpt'): string {
    const q = query.toLowerCase();
    const prefix = persona === 'gemini' ? '✨ **[Gemini 3.8 Flash - CS Mentor]**\n\n' : '🤖 **[ChatGPT-4o - Coding Coach]**\n\n';

    if (q.includes('dynamic programming') || q.includes('dp') || q.includes('memoization')) {
      return `${prefix}### Dynamic Programming: Memoization vs Tabulation

Dynamic Programming is an algorithmic paradigm that solves subproblems once and stores their solutions to avoid redundant computations.

#### 1. Top-Down (Memoization)
- **Concept:** Recursive approach with a cache (lookup table).
- **Time Complexity:** $O(N)$
- **Space Complexity:** $O(N)$ for recursion call stack + hash map/array.
\`\`\`cpp
// Fibonacci with Memoization (C++)
int memo[1000] = {0};
int fibMemo(int n) {
    if (n <= 1) return n;
    if (memo[n] != 0) return memo[n];
    return memo[n] = fibMemo(n - 1) + fibMemo(n - 2);
}
\`\`\`

#### 2. Bottom-Up (Tabulation)
- **Concept:** Iterative table-filling starting from base cases without call-stack overhead.
- **Space Optimization:** Can often be reduced to $O(1)$ space using two variables.
\`\`\`python
# Fibonacci with Tabulation (Python)
def fib_tab(n: int) -> int:
    if n <= 1:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]
\`\`\`

💡 **University Viva Tip:** Always mention overlapping subproblems and optimal substructure as the two necessary conditions for DP!`;
    }

    if (q.includes('two sum') || q.includes('hash map') || q.includes('array')) {
      return `${prefix}### Two Sum Optimal Solution ($O(N)$ Time, $O(N)$ Space)

The brute-force two-pointer approach takes $O(N^2)$. We can optimize it to linear time using a Hash Map to look up complements in $O(1)$ average time.

\`\`\`python
def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {} # value -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []
\`\`\`

\`\`\`cpp
// C++ STL Implementation
#include <vector>
#include <unordered_map>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> mp;
    for (int i = 0; i < nums.size(); ++i) {
        int diff = target - nums[i];
        if (mp.count(diff)) {
            return {mp[diff], i};
        }
        mp[nums[i]] = i;
    }
    return {};
}
\`\`\`

⚡ **Complexity:**
- **Time Complexity:** $O(N)$ single pass through the array.
- **Space Complexity:** $O(N)$ for the hash map storing at most $N$ elements.`;
    }

    if (q.includes('pointer') || q.includes('segmentation fault') || q.includes('segfault')) {
      return `${prefix}### Resolving C/C++ Pointer Segmentation Faults

A **Segmentation Fault** occurs when a program attempts to access a memory location it does not own or which has not been mapped.

#### Common Causes & Fixes:
1. **Dereferencing a NULL or Wild Pointer:**
\`\`\`cpp
// Bug:
int *ptr = nullptr;
*ptr = 10; // 💥 Segfault!

// Fix: Always check before dereference
if (ptr != nullptr) {
    *ptr = 10;
}
\`\`\`

2. **Accessing Array Out of Bounds:**
\`\`\`cpp
int arr[5] = {1, 2, 3, 4, 5};
cout << arr[10]; // Undefined behavior / segfault
\`\`\`

3. **Dangling Pointer after \`free\` or \`delete\`:**
\`\`\`cpp
int *p = new int(42);
delete p;
p = nullptr; // Reset to nullptr to prevent use-after-free
\`\`\`

🛠️ **Debugging Tip:** Compile with \`-g -fsanitize=address\` to get exact line numbers and stack traces for memory bugs!`;
    }

    if (q.includes('dbms') || q.includes('normal') || q.includes('3nf') || q.includes('bcnf')) {
      return `${prefix}### Database Normalization: 3NF vs BCNF Explained

| Criteria | 3rd Normal Form (3NF) | Boyce-Codd Normal Form (BCNF) |
|---|---|---|
| **Condition** | For $X \\rightarrow Y$, either $X$ is a superkey OR $Y$ is a prime attribute | For $X \\rightarrow Y$, $X$ MUST strictly be a superkey |
| **Strictness** | Relaxed | Stricter version of 3NF |
| **Lossless Join** | Guaranteed | Guaranteed |
| **Dependency Preservation** | Always preserved | May sometimes not be preserved |

#### Example:
If a relation has overlapping candidate keys, a dependency $X \\rightarrow Y$ where $Y$ is prime satisfies **3NF**, but violates **BCNF** if $X$ is not a superkey.`;
    }

    return `${prefix}### Computer Science & Placement Advice

I am ready to help you with:
1. **Live Code Debugging**: Paste code in C, C++, Python, Java, JS/TS, SQL, or Go to detect bugs and Big-O bottlenecks.
2. **Technical Viva Preparation**: Mock oral questions for BCA Semester 1–6 subjects (Data Structures, OS, DBMS, Networks, Web Tech).
3. **Campus Placement Guidance**: Algorithmic problem-solving patterns (Two Pointers, Sliding Window, DFS/BFS, Backtracking, DP).
4. **Capstones & Projects**: Architecture decisions, REST APIs, and database schemas.

How can I help you tackle your next coding problem or subject module?`;
  },

  async evaluateVivaAnswer(params: {
    track: string;
    question: string;
    studentAnswer: string;
    expectedKeyPoints: string[];
    idealAnswer: string;
  }): Promise<VivaEvaluationResult> {
    const apiKey = getApiKey();

    if (!apiKey) {
      // Offline / Fallback Evaluation based on key point semantic density
      return this.fallbackEvaluateViva(params);
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are a strict, fair University Computer Science Professor and Campus Technical Examiner for BCA undergraduate students.
Track: ${params.track}
Question: "${params.question}"
Expected Key Academic Concepts:
${params.expectedKeyPoints.map((pt) => `- ${pt}`).join('\n')}
Standard Model Answer:
"${params.idealAnswer}"

Student's Spoken/Written Answer:
"${params.studentAnswer}"

Evaluate this answer and respond ONLY in valid JSON matching this exact structure:
{
  "score": <number from 0 to 10, e.g. 8.5>,
  "verdict": "<"Excellent" | "Good" | "Needs Improvement" | "Unsatisfactory">",
  "strengths": ["<strength 1>", "<strength 2>"],
  "missingConcepts": ["<critical concept missing or unclear, if any>"],
  "examinerFeedback": "<2-3 sentence verbal debrief in professor persona directly addressing the student>",
  "idealAnswer": "<succinct 2-3 sentence university standard model answer>"
}`;

      const res = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const text = res.text?.trim() || '';
      const parsed = JSON.parse(text) as VivaEvaluationResult;
      return {
        score: Math.min(10, Math.max(0, Number(parsed.score) || 7)),
        verdict: parsed.verdict || 'Good',
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ['Good conceptual clarity'],
        missingConcepts: Array.isArray(parsed.missingConcepts) ? parsed.missingConcepts : [],
        examinerFeedback: parsed.examinerFeedback || 'Well structured response with good technical terminology.',
        idealAnswer: parsed.idealAnswer || params.idealAnswer,
      };
    } catch (err) {
      console.warn('Gemini API call failed, falling back to built-in semantic evaluator', err);
      return this.fallbackEvaluateViva(params);
    }
  },

  fallbackEvaluateViva(params: {
    question: string;
    studentAnswer: string;
    expectedKeyPoints: string[];
    idealAnswer: string;
  }): VivaEvaluationResult {
    const ans = params.studentAnswer.toLowerCase();
    const wordCount = ans.trim().split(/\s+/).length;

    let matchedPoints: string[] = [];
    let missingPoints: string[] = [];

    params.expectedKeyPoints.forEach((point) => {
      const keywords = point.toLowerCase().split(/\s+/).filter((w) => w.length > 4);
      const isMatched = keywords.some((kw) => ans.includes(kw));
      if (isMatched) {
        matchedPoints.push(point);
      } else {
        missingPoints.push(point);
      }
    });

    let score = 5;
    if (wordCount > 15) score += 1;
    if (wordCount > 35) score += 1;
    if (matchedPoints.length > 0) {
      score += Math.round((matchedPoints.length / params.expectedKeyPoints.length) * 3);
    }
    score = Math.min(10, Math.max(3, score));

    let verdict: VivaEvaluationResult['verdict'] = 'Good';
    if (score >= 9) verdict = 'Excellent';
    else if (score >= 7) verdict = 'Good';
    else if (score >= 5) verdict = 'Needs Improvement';
    else verdict = 'Unsatisfactory';

    return {
      score,
      verdict,
      strengths: matchedPoints.length > 0 ? matchedPoints : ['Good attempt at articulating core concepts under timed viva conditions.'],
      missingConcepts: missingPoints.length > 0 ? missingPoints.slice(0, 2) : ['Deepen explanation of underlying time/space trade-offs.'],
      examinerFeedback: `You demonstrated a grasp of ${matchedPoints.length > 0 ? 'the core definitions' : 'the fundamentals'}. In university viva and technical rounds, emphasize exact time complexity and architectural trade-offs to score top marks.`,
      idealAnswer: params.idealAnswer,
    };
  },

  async analyzeCode(params: {
    language: string;
    code: string;
    problemTitle?: string;
  }): Promise<CodeAnalysisResult> {
    const apiKey = getApiKey();

    if (!apiKey) {
      return this.fallbackAnalyzeCode(params);
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Analyze this ${params.language} code for the Computer Science problem: "${params.problemTitle || 'General Algorithm'}"
Code:
\`\`\`${params.language}
${params.code}
\`\`\`

Provide analysis in strictly valid JSON:
{
  "timeComplexity": "O(...)",
  "spaceComplexity": "O(...)",
  "explanation": "Brief 2-3 sentence overview of the algorithmic strategy",
  "optimizationTips": ["Tip 1", "Tip 2"],
  "potentialBugs": ["Edge case or potential bug if any, or none"]
}`;

      const res = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      });

      const text = res.text?.trim() || '';
      return JSON.parse(text) as CodeAnalysisResult;
    } catch (err) {
      console.warn('Gemini code analysis fallback', err);
      return this.fallbackAnalyzeCode(params);
    }
  },

  fallbackAnalyzeCode(params: { language: string; code: string }): CodeAnalysisResult {
    const code = params.code;
    let time = 'O(N)';
    let space = 'O(1)';

    const loops = (code.match(/for\s*\(|while\s*\(|for\s+\w+\s+in/g) || []).length;
    if (loops >= 2) time = 'O(N²)';
    else if (loops === 1) time = 'O(N)';
    else if (code.includes('binary') || code.includes('left < right') || code.includes('mid')) time = 'O(log N)';

    if (code.includes('vector') || code.includes('new ') || code.includes('[]') || code.includes('malloc') || code.includes('map<')) {
      space = 'O(N)';
    }

    return {
      timeComplexity: time,
      spaceComplexity: space,
      explanation: `Iterative algorithmic implementation in ${params.language} with standard control flows and variable state tracking.`,
      optimizationTips: [
        'Consider edge cases where input is empty or contains single elements.',
        'Ensure boundaries are strictly checked to prevent buffer overflows or index out of bound errors.',
      ],
      potentialBugs: ['Ensure zero division or empty collection access is guarded.'],
    };
  },
};
