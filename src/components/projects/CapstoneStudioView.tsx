import React, { useState } from 'react';
import {
  Layers,
  Code2,
  Database,
  Server,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  Cpu,
  FileCode,
} from 'lucide-react';

interface CapstoneBlueprint {
  id: string;
  title: string;
  track: 'Full-Stack' | 'AI / ML' | 'Cybersecurity';
  semester: 'Sem 5 Minor' | 'Sem 6 Major';
  description: string;
  architectureDiagram: string[];
  techStack: { frontend: string; backend: string; database: string; devops: string };
  schemaTables: string[];
  vivaQuestions: { q: string; a: string }[];
}

const BLUEPRINTS: CapstoneBlueprint[] = [
  {
    id: 'bp-1',
    title: 'Enterprise Microservices E-Commerce with Distributed Inventory',
    track: 'Full-Stack',
    semester: 'Sem 6 Major',
    description:
      'High-throughput web platform handling product catalogs, JWT multi-tenant authentication, Stripe webhook transactions, and Redis cache invalidation.',
    architectureDiagram: [
      'Client (React/Next.js) -> API Gateway (Express / Rate Limiter)',
      'Gateway -> Auth Service (JWT + Refresh Tokens)',
      'Gateway -> Catalog Service (PostgreSQL + Redis Cache Layer)',
      'Gateway -> Order Service (RabbitMQ Async Worker + Stripe Webhook)',
      'Monitoring: Docker Compose + Prometheus Metrics',
    ],
    techStack: {
      frontend: 'React, TypeScript, Tailwind CSS, TanStack Query',
      backend: 'Node.js, Express, TypeScript, RabbitMQ',
      database: 'PostgreSQL (Prisma ORM), Redis (Cache)',
      devops: 'Docker, GitHub Actions, Cloud Run',
    },
    schemaTables: [
      'users (id, email, password_hash, role, created_at)',
      'products (id, sku, name, description, price, stock_quantity)',
      'orders (id, user_id, total_amount, payment_status, created_at)',
      'order_items (id, order_id, product_id, quantity, unit_price)',
    ],
    vivaQuestions: [
      {
        q: 'Why did you use Redis caching alongside PostgreSQL?',
        a: 'Product catalog reads outnumber writes 100:1. Caching top category queries in Redis reduces database load by 85% and drops response latency from 65ms to 4ms.',
      },
      {
        q: 'How do you prevent double-spending or race conditions in checkout?',
        a: 'We use database row-level locking (`SELECT ... FOR UPDATE`) inside an ACID transaction to decrement inventory atomically.',
      },
    ],
  },
  {
    id: 'bp-2',
    title: 'AI Pneumonia & Diabetic Retinopathy Diagnostic Vision Suite',
    track: 'AI / ML',
    semester: 'Sem 6 Major',
    description:
      'Deep learning convolutional neural network (CNN) pipeline fine-tuned on NIH chest X-ray datasets with Grad-CAM heatmap explainability.',
    architectureDiagram: [
      'Client Web UI -> Upload Medical DICOM / PNG Radiograph',
      'FastAPI Server -> Preprocessing (CLAHE Contrast + Resize 224x224)',
      'PyTorch Engine -> DenseNet-121 / ResNet-50 Feature Extractor',
      'Inference Layer -> Probability Score + Grad-CAM Heatmap Overlay',
      'Report Generation -> PDF Diagnostic Summary via ReportLab',
    ],
    techStack: {
      frontend: 'React, Vite, Lucide Icons, Canvas API',
      backend: 'Python 3.11, FastAPI, PyTorch, Torchvision',
      database: 'MongoDB (Metadata) + AWS S3 / Cloud Storage (DICOM Images)',
      devops: 'Docker, ONNX Runtime for CPU quantization',
    },
    schemaTables: [
      'patients (patient_id, name, age, gender, medical_record_num)',
      'scans (scan_id, patient_id, s3_url, scan_type, uploaded_at)',
      'predictions (id, scan_id, model_version, confidence_score, gradcam_url)',
    ],
    vivaQuestions: [
      {
        q: 'Why did you evaluate the model with ROC-AUC rather than raw Accuracy?',
        a: 'Medical datasets are heavily class-imbalanced (e.g., 95% healthy, 5% diseased). A naive model predicting all-healthy achieves 95% accuracy while failing all patients. ROC-AUC and F1-score evaluate true positive rates across thresholds.',
      },
      {
        q: 'What is Grad-CAM and why is it needed for medical AI?',
        a: 'Gradient-weighted Class Activation Mapping computes gradients of the target class score with respect to the final convolutional layer, producing a visual visual heatmap showing which lung regions triggered the diagnosis.',
      },
    ],
  },
  {
    id: 'bp-3',
    title: 'Network Packet Sniffer & Defensive Intrusion Detection Engine',
    track: 'Cybersecurity',
    semester: 'Sem 5 Minor',
    description:
      'Real-time packet inspection daemon flagging SYN flood denial-of-service, ARP cache poisoning, and unencrypted cleartext credential leakage.',
    architectureDiagram: [
      'Raw Socket Listener (Scapy / AF_PACKET) -> Packet Parser',
      'Header Analyzer -> IP / TCP / UDP / DNS / HTTP Dissector',
      'Detection Engine -> Signature Matcher (Snort Rules) + Anomaly Heuristics',
      'Alert Pipeline -> WebSockets -> Live Admin Threat Telemetry Dashboard',
    ],
    techStack: {
      frontend: 'React, Tailwind CSS, Recharts for Live Bandwidth',
      backend: 'Python, Scapy, FastAPI WebSocket Server',
      database: 'SQLite / DuckDB for high-speed time-series logs',
      devops: 'Linux systemd daemon, iptables firewall hook',
    },
    schemaTables: [
      'packets (id, timestamp, src_ip, dst_ip, protocol, packet_length)',
      'security_alerts (id, alert_type, severity, src_ip, payload_snippet)',
      'blocked_ips (ip_address, reason, blocked_until, auto_banned)',
    ],
    vivaQuestions: [
      {
        q: 'How does your system detect a TCP SYN flood attack?',
        a: 'It tracks half-open TCP connections in a sliding 10-second window. If SYN packets from an IP exceed the threshold without completing the final ACK handshake, it alerts and temporarily throttles that source IP.',
      },
    ],
  },
];

export const CapstoneStudioView: React.FC = () => {
  const [selectedBlueprintId, setSelectedBlueprintId] = useState<string>('bp-1');
  const activeBlueprint = BLUEPRINTS.find((b) => b.id === selectedBlueprintId) || BLUEPRINTS[0];

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-400">
              <Layers className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              BCA Capstone Architecture Studio
            </h1>
          </div>
          <p className="text-sm text-[#9F9AB0] mt-1">
            Complete production-grade graduation project blueprints for BCA Semesters 5 and 6 with viva voce defense guides.
          </p>
        </div>
      </div>

      {/* Blueprint Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {BLUEPRINTS.map((bp) => {
          const active = bp.id === selectedBlueprintId;
          return (
            <button
              key={bp.id}
              onClick={() => setSelectedBlueprintId(bp.id)}
              className={`p-4 rounded-3xl border transition-all text-left ${
                active
                  ? 'bg-gradient-to-b from-[#201C33] to-[#151322] border-violet-500/50 shadow-[0_0_20px_rgba(169,112,255,0.3)]'
                  : 'bg-[#13111C]/80 border-white/5 hover:border-white/15'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300">
                  {bp.track}
                </span>
                <span className="text-[11px] text-[#8E8A9E]">{bp.semester}</span>
              </div>
              <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug">{bp.title}</h3>
            </button>
          );
        })}
      </div>

      {/* Blueprint Detail Card */}
      <div className="rounded-3xl bg-[#13111C]/85 border border-purple-500/25 backdrop-blur-xl p-6 sm:p-8 shadow-xl space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-violet-300 uppercase tracking-wider">
              {activeBlueprint.semester} Project Blueprint
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
            {activeBlueprint.title}
          </h2>
          <p className="text-xs sm:text-sm text-[#9E98AD] mt-2 leading-relaxed">
            {activeBlueprint.description}
          </p>
        </div>

        {/* System Architecture Flow Diagram */}
        <div className="p-5 rounded-2xl bg-[#0B0A12] border border-violet-500/20">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
            <Server className="w-4 h-4 text-violet-400" />
            <span>Production System Architecture Flow:</span>
          </h4>
          <div className="space-y-2 font-mono text-xs text-purple-200/90">
            {activeBlueprint.architectureDiagram.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-2 rounded-xl bg-white/[0.02]">
                <span className="px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 font-bold shrink-0">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack Matrix */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>Recommended Technology Stack:</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#161424] border border-white/5">
              <span className="text-[11px] text-[#8E8A9E] block mb-1">Frontend Layer</span>
              <span className="text-xs font-semibold text-white">{activeBlueprint.techStack.frontend}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#161424] border border-white/5">
              <span className="text-[11px] text-[#8E8A9E] block mb-1">Backend Core</span>
              <span className="text-xs font-semibold text-white">{activeBlueprint.techStack.backend}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#161424] border border-white/5">
              <span className="text-[11px] text-[#8E8A9E] block mb-1">Database & Cache</span>
              <span className="text-xs font-semibold text-white">{activeBlueprint.techStack.database}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#161424] border border-white/5">
              <span className="text-[11px] text-[#8E8A9E] block mb-1">DevOps & Cloud</span>
              <span className="text-xs font-semibold text-white">{activeBlueprint.techStack.devops}</span>
            </div>
          </div>
        </div>

        {/* Relational Database Tables */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-400" />
            <span>Relational Schema Specifications:</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-[#C4BED4]">
            {activeBlueprint.schemaTables.map((tbl, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-[#141220] border border-white/5">
                {tbl}
              </div>
            ))}
          </div>
        </div>

        {/* University Examiner Viva Voce Defense Prep */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#161428] to-[#121A2A] border border-indigo-500/30 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <h4 className="text-xs font-bold text-indigo-200 uppercase tracking-wider">
              University Viva Voce Examiner Questions & Model Defense:
            </h4>
          </div>

          <div className="space-y-3">
            {activeBlueprint.vivaQuestions.map((v, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-black/30 border border-white/5 space-y-1.5">
                <div className="text-xs font-bold text-white flex items-start gap-2">
                  <span className="text-indigo-400">Q{i + 1}:</span>
                  <span>{v.q}</span>
                </div>
                <div className="text-xs text-[#CBC6DC] pl-5 leading-relaxed">
                  <strong className="text-emerald-400">Defense: </strong>
                  {v.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
