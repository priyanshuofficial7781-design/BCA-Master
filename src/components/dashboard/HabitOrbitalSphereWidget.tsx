import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Flame,
  Target,
  Maximize2,
  RotateCcw,
  BookOpen,
  Timer,
  ChevronRight,
} from 'lucide-react';

interface HabitOrbitalSphereWidgetProps {
  onOpenQuestionBank?: () => void;
  onOpenPomodoro?: () => void;
}

export const HabitOrbitalSphereWidget: React.FC<HabitOrbitalSphereWidgetProps> = ({
  onOpenQuestionBank,
  onOpenPomodoro,
}) => {
  const { data, todayPomodoroMinutes, setActiveTab } = useApp();
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeNodeInfo, setActiveNodeInfo] = useState<string | null>(null);
  const [isRotatingManually, setIsRotatingManually] = useState(false);

  // Compute habit metrics
  const streakDays = Math.max(1, data.studyLogs.length > 0 ? data.studyLogs.length : 3);
  const masteredCount = data.questionBankProgress?.masteredIds.length || 0;
  const completedTasksCount = data.tasks.filter(t => t.status === 'completed').length;
  const isPulsing = todayPomodoroMinutes > 0;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 400;
    let height = container.clientHeight || 280;

    // 1. Scene, Camera, Renderer Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07070b, 0.035);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 2. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0x2d1f4d, 1.2);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0x8b5cf6, 0x07070b, 1.0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xa970ff, 2.5);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x657bff, 2.0);
    rimLight.position.set(-6, -3, -4);
    scene.add(rimLight);

    const corePointLight = new THREE.PointLight(0xa970ff, 3.0, 15);
    scene.add(corePointLight);

    // 3. Composite 3D Habit Orbital Hierarchy (THREE.Group)
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // Part A: Core Glowing Nucleus Sphere (Represents central discipline / streak)
    const coreGeometry = new THREE.SphereGeometry(1.2, 32, 32);
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x9333ea,
      emissive: 0x7c3aed,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.1,
      transmission: 0.6,
      ior: 1.4,
      transparent: true,
      opacity: 0.9,
    });
    const coreSphere = new THREE.Mesh(coreGeometry, coreMaterial);
    masterGroup.add(coreSphere);

    // Part B: Inner Wireframe Energy Shield
    const wireGeo = new THREE.IcosahedronGeometry(1.4, 2);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xc084fc,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const wireSphere = new THREE.Mesh(wireGeo, wireMat);
    masterGroup.add(wireSphere);

    // Part C: Concentric Orbital Rings (Toruses) for BCA Disciplines
    interface OrbitConfig {
      radius: number;
      tube: number;
      color: number;
      rotationX: number;
      rotationY: number;
      speed: number;
      name: string;
      value: string;
    }

    const orbitConfigs: OrbitConfig[] = [
      {
        radius: 2.3,
        tube: 0.02,
        color: 0xa855f7, // DSA Ring (Violet)
        rotationX: 1.1,
        rotationY: 0.3,
        speed: 0.6,
        name: 'DSA Mastery Orbit',
        value: `${masteredCount} Solved`,
      },
      {
        radius: 3.1,
        tube: 0.02,
        color: 0x3b82f6, // Core CS Ring (Blue)
        rotationX: 0.6,
        rotationY: -0.8,
        speed: -0.4,
        name: 'Core CS Systems',
        value: 'OS · DBMS · Networks',
      },
      {
        radius: 3.9,
        tube: 0.02,
        color: 0x10b981, // Streak & Daily Progress (Emerald)
        rotationX: -0.9,
        rotationY: 0.5,
        speed: 0.5,
        name: 'Daily Streak Ring',
        value: `${streakDays} Days Consistent`,
      },
      {
        radius: 4.7,
        tube: 0.02,
        color: 0xec4899, // Focus & Pomodoro Ring (Pink)
        rotationX: 0.2,
        rotationY: 1.2,
        speed: -0.3,
        name: 'Deep Work Orbit',
        value: `${todayPomodoroMinutes}m Today`,
      },
    ];

    const rings: THREE.Mesh[] = [];
    const satellites: { mesh: THREE.Mesh; config: OrbitConfig; angle: number }[] = [];

    orbitConfigs.forEach((cfg) => {
      // Ring
      const ringGeo = new THREE.TorusGeometry(cfg.radius, cfg.tube, 16, 100);
      const ringMat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        emissive: cfg.color,
        emissiveIntensity: 0.5,
        roughness: 0.3,
        metalness: 0.8,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = cfg.rotationX;
      ring.rotation.y = cfg.rotationY;
      masterGroup.add(ring);
      rings.push(ring);

      // Orbiting Satellite Node
      const satGeo = new THREE.SphereGeometry(0.18, 16, 16);
      const satMat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        emissive: cfg.color,
        emissiveIntensity: 0.9,
        roughness: 0.1,
        metalness: 0.9,
      });
      const satMesh = new THREE.Mesh(satGeo, satMat);
      masterGroup.add(satMesh);

      satellites.push({
        mesh: satMesh,
        config: cfg,
        angle: Math.random() * Math.PI * 2,
      });
    });

    // Part D: Ambient Stellar Particle Dust Field
    const particleCount = 200;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.0 + Math.random() * 6.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const color = new THREE.Color(
        i % 2 === 0 ? 0xa855f7 : i % 3 === 0 ? 0x60a5fa : 0xec4899
      );
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
    });
    const particlePoints = new THREE.Points(particleGeometry, particleMaterial);
    masterGroup.add(particlePoints);

    // 4. Smooth Pointer Drag Interaction
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationX = 0.2;
    let targetRotationY = 0;

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      setIsRotatingManually(true);
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      targetRotationY += deltaX * 0.008;
      targetRotationX += deltaY * 0.008;
    };

    const handlePointerUp = () => {
      isDragging = false;
      setTimeout(() => setIsRotatingManually(false), 2000);
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // 5. Render Loop with Harmonic Focus Pulse
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Idle auto-rotation when not manually dragging
      if (!isDragging) {
        targetRotationY += delta * 0.15;
      }

      // Smooth exponential damping on rotation
      masterGroup.rotation.y = THREE.MathUtils.damp(
        masterGroup.rotation.y,
        targetRotationY,
        4,
        delta
      );
      masterGroup.rotation.x = THREE.MathUtils.damp(
        masterGroup.rotation.x,
        targetRotationX,
        4,
        delta
      );

      // Core sphere and wireframe harmonic rotation
      coreSphere.rotation.y += delta * 0.3;
      wireSphere.rotation.y -= delta * 0.2;
      wireSphere.rotation.z += delta * 0.1;
      particlePoints.rotation.y += delta * 0.04;

      // Focus Pulse: Rhythmic respiration cycle
      // If user is in Pomodoro mode, pulse expands more dynamically
      const pulseSpeed = isPulsing ? 3.5 : 1.8;
      const pulseAmplitude = isPulsing ? 0.18 : 0.07;
      const pulseScale = 1.0 + Math.sin(time * pulseSpeed) * pulseAmplitude;

      coreSphere.scale.set(pulseScale, pulseScale, pulseScale);
      wireSphere.scale.set(pulseScale * 1.05, pulseScale * 1.05, pulseScale * 1.05);

      corePointLight.intensity = 2.5 + Math.sin(time * pulseSpeed) * (isPulsing ? 2.0 : 0.8);

      // Position satellites along their orbital inclined paths
      satellites.forEach(({ mesh, config, angle }) => {
        const currentAngle = angle + time * config.speed;
        const x = Math.cos(currentAngle) * config.radius;
        const z = Math.sin(currentAngle) * config.radius;

        // Apply orbit inclination
        const vec = new THREE.Vector3(x, 0, z);
        vec.applyAxisAngle(new THREE.Vector3(1, 0, 0), config.rotationX);
        vec.applyAxisAngle(new THREE.Vector3(0, 1, 0), config.rotationY);

        mesh.position.copy(vec);
      });

      renderer.render(scene, camera);
    };

    animate();

    // 6. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        if (newWidth > 0 && newHeight > 0) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      domElement.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);

      coreGeometry.dispose();
      coreMaterial.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();

      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
    };
  }, [streakDays, masteredCount, todayPomodoroMinutes, isPulsing]);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#181335] via-[#100E22] to-[#080614] border border-[#B46CFF]/35 p-5 sm:p-6 shadow-[0_16px_50px_rgba(0,0,0,0.8),0_0_25px_rgba(139,61,255,0.22)] backdrop-blur-2xl">
      {/* Specular Ambient Glow & Neon Top Rail */}
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00F0FF]/60 via-[#B46CFF]/80 to-transparent pointer-events-none" />
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#8B3DFF]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-[#00F0FF]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Title and Mode Status */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(169,112,255,0.4)]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Habit Orbital Sphere</span>
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                Interactive 3D
              </span>
            </h3>
            <p className="text-[11px] text-[#A6A0B8]">
              Harmonic celestial tracker for daily discipline & problem consistency
            </p>
          </div>
        </div>

        {/* Pulse Indicator */}
        <div className="flex items-center gap-2 bg-[#1A162B] px-3 py-1.5 rounded-xl border border-violet-500/20 text-xs">
          <div
            className={`w-2 h-2 rounded-full ${
              isPulsing
                ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                : 'bg-violet-400 shadow-[0_0_8px_#a855f7]'
            }`}
          />
          <span className="text-white font-medium text-[11px]">
            {isPulsing ? 'Active Focus Pulse' : 'Steady Orbit Mode'}
          </span>
        </div>
      </div>

      {/* 3D WebGL Canvas Viewport */}
      <div className="relative w-full h-[240px] sm:h-[270px] cursor-grab active:cursor-grabbing select-none">
        <div ref={mountRef} className="w-full h-full" />

        {/* Floating Quick Stats Overlays */}
        <div className="absolute top-2 left-2 pointer-events-none bg-[#0e0c18]/80 backdrop-blur-md px-3 py-2 rounded-2xl border border-violet-500/20 text-xs shadow-lg space-y-1">
          <div className="flex items-center gap-1.5 text-amber-300 font-semibold text-[11px]">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>{streakDays} Day Habit Streak</span>
          </div>
          <div className="text-[10px] text-[#9A94AD] font-mono">
            {todayPomodoroMinutes > 0 ? `${todayPomodoroMinutes}m Focus Today` : 'Ready for Study'}
          </div>
        </div>

        <div className="absolute top-2 right-2 pointer-events-none bg-[#0e0c18]/80 backdrop-blur-md px-3 py-2 rounded-2xl border border-violet-500/20 text-xs shadow-lg space-y-1 text-right">
          <div className="flex items-center justify-end gap-1.5 text-violet-300 font-semibold text-[11px]">
            <Target className="w-3.5 h-3.5 text-violet-400" />
            <span>{masteredCount} Mastered Qs</span>
          </div>
          <div className="text-[10px] text-[#9A94AD] font-mono">
            {completedTasksCount} Tasks Finished
          </div>
        </div>

        {/* Orbit Drag Hint */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none text-[10px] text-[#868099] flex items-center gap-1 bg-[#090810]/70 px-2.5 py-1 rounded-full border border-white/5">
          <RotateCcw className="w-3 h-3 text-violet-400" />
          <span>Click & drag to rotate orbital rings</span>
        </div>
      </div>

      {/* Bottom Action Strip: Direct Access to 10k Question Bank & Focus Timer */}
      <div className="mt-3 pt-3 border-t border-violet-500/15 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-[#AAA4BE]">
          Orbiting Rings: <strong className="text-white font-medium">DSA</strong> ·{' '}
          <strong className="text-white font-medium">Core CS</strong> ·{' '}
          <strong className="text-white font-medium">Streak</strong> ·{' '}
          <strong className="text-white font-medium">Pomodoro</strong>
        </div>

        <div className="flex items-center gap-2">
          {/* Launch Question Bank Button */}
          <button
            type="button"
            onClick={() => {
              if (onOpenQuestionBank) onOpenQuestionBank();
              else setActiveTab('practice-bank');
            }}
            className="px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(139,92,246,0.4)] flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Practice 10k+ Qs</span>
            <ChevronRight className="w-3 h-3" />
          </button>

          {/* Start Focus Timer */}
          <button
            type="button"
            onClick={() => {
              if (onOpenPomodoro) onOpenPomodoro();
              else setActiveTab('pomodoro');
            }}
            className="px-3 py-2 rounded-xl bg-[#1C182E] hover:bg-[#25203D] text-violet-300 hover:text-white text-xs font-medium border border-violet-500/25 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Timer className="w-3.5 h-3.5 text-violet-400" />
            <span>Focus Mode</span>
          </button>
        </div>
      </div>
    </div>
  );
};
