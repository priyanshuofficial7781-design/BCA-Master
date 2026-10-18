import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { useApp } from '../../context/AppContext';
import {
  Flame,
  Calendar,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  ChevronRight,
  RotateCcw,
  Layers,
  Zap,
} from 'lucide-react';

interface DayActivityData {
  dateStr: string;
  formattedDate: string;
  dayOfWeek: string;
  dayOfMonth: number;
  minutes: number;
  taskCount: number;
  subjects: string[];
  level: 0 | 1 | 2 | 3 | 4;
  isToday: boolean;
}

interface DailyHabitTrackerProps {
  onOpenAddTask?: () => void;
  onOpenPomodoro?: () => void;
  onOpenAnalytics?: () => void;
}

export const DailyHabitTracker: React.FC<DailyHabitTrackerProps> = ({
  onOpenAddTask,
  onOpenPomodoro,
  onOpenAnalytics,
}) => {
  const { data, streakDays, todayPomodoroMinutes, setActiveTab } = useApp();
  const mountRef = useRef<HTMLDivElement>(null);

  const [hoveredDay, setHoveredDay] = useState<DayActivityData | null>(null);
  const [selectedDay, setSelectedDay] = useState<DayActivityData | null>(null);
  const [viewMode, setViewMode] = useState<'3d' | 'flat'>('3d');

  // Compute 30 days of activity leading up to today
  const last30Days: DayActivityData[] = useMemo(() => {
    const days: DayActivityData[] = [];
    const today = new Date();

    // Map subject IDs to subject names for quick lookup
    const subjectMap = new Map<string, string>();
    data.subjects.forEach((s) => subjectMap.set(s.id, s.name));

    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      // Aggregate studyLogs
      const logs = data.studyLogs.filter((l) => l.date === dateStr);
      let minutes = logs.reduce((acc, l) => acc + (l.durationMinutes || 0), 0);

      // Also aggregate completed tasks on that date
      const completedTasks = data.tasks.filter(
        (t) => t.date === dateStr && t.status === 'completed'
      );
      // If today, also incorporate today's pomodoro minutes if not already in logs
      if (i === 0 && todayPomodoroMinutes > 0) {
        minutes = Math.max(minutes, todayPomodoroMinutes);
      }

      const subjects = Array.from(
        new Set(
          logs
            .map((l) => subjectMap.get(l.subjectId) || l.subjectId)
            .concat(
              completedTasks.map(
                (t) => subjectMap.get(t.subjectId) || t.subjectId
              )
            )
            .filter(Boolean)
        )
      ) as string[];

      // Determine level: 0 (0m), 1 (1-30m), 2 (31-60m), 3 (61-120m), 4 (>120m)
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (minutes > 120) level = 4;
      else if (minutes > 60) level = 3;
      else if (minutes > 30) level = 2;
      else if (minutes > 0 || completedTasks.length > 0) level = 1;

      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
      ];

      days.push({
        dateStr,
        formattedDate: `${monthNames[d.getMonth()]} ${d.getDate()}`,
        dayOfWeek: dayNames[d.getDay()],
        dayOfMonth: d.getDate(),
        minutes,
        taskCount: completedTasks.length,
        subjects,
        level,
        isToday: i === 0,
      });
    }

    return days;
  }, [data.studyLogs, data.tasks, data.subjects, todayPomodoroMinutes]);

  // Aggregate stats
  const totalMinutes30D = useMemo(
    () => last30Days.reduce((acc, d) => acc + d.minutes, 0),
    [last30Days]
  );
  const activeDays30D = useMemo(
    () => last30Days.filter((d) => d.level > 0).length,
    [last30Days]
  );
  const consistencyPercent = Math.round((activeDays30D / 30) * 100);
  const totalHours30D = (totalMinutes30D / 60).toFixed(1);

  // 3D Three.js Isometric Heatmap setup
  useEffect(() => {
    if (viewMode !== '3d') return;
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 600;
    let height = container.clientHeight || 200;

    // Scene
    const scene = new THREE.Scene();

    // Isometric Orthographic or gentle Perspective camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 14, 18);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xc4b5fd, 2.2);
    dirLight.position.set(10, 20, 10);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const purplePoint = new THREE.PointLight(0xa855f7, 3.5, 30);
    purplePoint.position.set(-6, 8, 4);
    scene.add(purplePoint);

    const bluePoint = new THREE.PointLight(0x6366f1, 2.5, 30);
    bluePoint.position.set(6, 6, -4);
    scene.add(bluePoint);

    // Group for the 3D grid
    const gridGroup = new THREE.Group();
    // Tilt to isometric view: rotate around X and Y
    gridGroup.rotation.x = 0.25;
    gridGroup.rotation.y = -0.15;
    scene.add(gridGroup);

    // Grid Dimensions: 6 columns × 5 rows = 30 days
    const cols = 6;
    const rows = 5;
    const spacingX = 2.4;
    const spacingZ = 2.2;
    const offsetX = ((cols - 1) * spacingX) / 2;
    const offsetZ = ((rows - 1) * spacingZ) / 2;

    const blockMeshes: { mesh: THREE.Mesh; dayData: DayActivityData }[] = [];

    // Level color palettes
    const levelColors = [
      { base: 0x181528, emissive: 0x100e1c, height: 0.35, roughness: 0.8 }, // Level 0: Rest day
      { base: 0x4f46e5, emissive: 0x312e81, height: 0.75, roughness: 0.4 }, // Level 1: Light (1-30m)
      { base: 0x7c3aed, emissive: 0x581c87, height: 1.25, roughness: 0.3 }, // Level 2: Medium (31-60m)
      { base: 0x9333ea, emissive: 0x7e22ce, height: 1.85, roughness: 0.25 }, // Level 3: High (61-120m)
      { base: 0xa855f7, emissive: 0xc084fc, height: 2.55, roughness: 0.15 }, // Level 4: Epic (>120m)
    ];

    last30Days.forEach((day, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);

      const cfg = levelColors[day.level];
      const boxGeo = new THREE.BoxGeometry(1.7, cfg.height, 1.7);
      
      const boxMat = new THREE.MeshStandardMaterial({
        color: cfg.base,
        emissive: cfg.emissive,
        emissiveIntensity: day.level > 0 ? 0.65 : 0.15,
        roughness: cfg.roughness,
        metalness: 0.4,
      });

      const mesh = new THREE.Mesh(boxGeo, boxMat);
      mesh.position.set(
        col * spacingX - offsetX,
        cfg.height / 2,
        row * spacingZ - offsetZ
      );
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      // Add a subtle golden/neon border or indicator for today's block
      if (day.isToday) {
        const edgeGeo = new THREE.EdgesGeometry(boxGeo);
        const edgeMat = new THREE.LineBasicMaterial({
          color: 0xfbbf24,
          linewidth: 2,
        });
        const wireframe = new THREE.LineSegments(edgeGeo, edgeMat);
        mesh.add(wireframe);
      }

      gridGroup.add(mesh);
      blockMeshes.push({ mesh, dayData: day });
    });

    // Floor platform under the matrix with obsidian frosted glass look
    const floorGeo = new THREE.PlaneGeometry(
      cols * spacingX + 2,
      rows * spacingZ + 2
    );
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0c0a14,
      roughness: 0.9,
      metalness: 0.1,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -0.05;
    floorMesh.receiveShadow = true;
    gridGroup.add(floorMesh);

    // Interactive pointer raycasting
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);
    let isDragging = false;
    let prevMouseX = 0;
    let targetRotY = -0.15;
    let targetRotX = 0.25;

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        targetRotY += deltaX * 0.005;
        prevMouseX = e.clientX;
      } else {
        // Subtle parallax
        targetRotY = -0.15 + mouse.x * 0.12;
        targetRotX = 0.25 - mouse.y * 0.08;
      }

      // Check hover
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        blockMeshes.map((b) => b.mesh)
      );

      if (intersects.length > 0) {
        const hit = blockMeshes.find((b) => b.mesh === intersects[0].object);
        if (hit) {
          setHoveredDay(hit.dayData);
          container.style.cursor = 'pointer';
          return;
        }
      }
      setHoveredDay(null);
      container.style.cursor = 'grab';
    };

    const onPointerDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      container.style.cursor = 'grabbing';
    };

    const onPointerUp = () => {
      isDragging = false;
      container.style.cursor = 'grab';
    };

    const onClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        blockMeshes.map((b) => b.mesh)
      );
      if (intersects.length > 0) {
        const hit = blockMeshes.find((b) => b.mesh === intersects[0].object);
        if (hit) {
          setSelectedDay(hit.dayData);
        }
      }
    };

    const onPointerLeave = () => {
      setHoveredDay(null);
      isDragging = false;
      targetRotY = -0.15;
      targetRotX = 0.25;
    };

    container.addEventListener('mousemove', onPointerMove);
    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mouseup', onPointerUp);
    container.addEventListener('click', onClick);
    container.addEventListener('mouseleave', onPointerLeave);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Smooth camera/grid rotation interpolation
      gridGroup.rotation.y += (targetRotY - gridGroup.rotation.y) * 0.06;
      gridGroup.rotation.x += (targetRotX - gridGroup.rotation.x) * 0.06;

      // Gentle floating pulse for active blocks
      const elapsedTime = clock.getElapsedTime();
      blockMeshes.forEach((item, idx) => {
        if (item.dayData.level > 0) {
          const cfg = levelColors[item.dayData.level];
          const hoverBoost = hoveredDay?.dateStr === item.dayData.dateStr ? 0.35 : 0;
          const targetY = cfg.height / 2 + Math.sin(elapsedTime * 2 + idx * 0.2) * 0.04 + hoverBoost;
          item.mesh.position.y += (targetY - item.mesh.position.y) * 0.15;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight || 200;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousemove', onPointerMove);
      container.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mouseup', onPointerUp);
      container.removeEventListener('click', onClick);
      container.removeEventListener('mouseleave', onPointerLeave);
      window.removeEventListener('resize', handleResize);

      // Clean up geometries and materials
      blockMeshes.forEach(({ mesh }) => {
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else {
          mesh.material.dispose();
        }
      });
      floorGeo.dispose();
      floorMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [viewMode, last30Days]);

  const activeInspectedDay = hoveredDay || selectedDay;

  return (
    <section aria-label="Daily Habit Tracker" className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#181335] via-[#100E22] to-[#080614] border border-[#B46CFF]/35 p-5 sm:p-6 shadow-[0_16px_50px_rgba(0,0,0,0.8),0_0_25px_rgba(139,61,255,0.22)] backdrop-blur-2xl">
      {/* Specular Ambient Glow & Neon Top Rail */}
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00F0FF]/60 via-[#B46CFF]/80 to-transparent pointer-events-none" />
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#8B3DFF]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[#00F0FF]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Row: Streak + 30D Consistency + Controls */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-[10px] font-extrabold tracking-wider text-white uppercase shadow-[0_0_12px_rgba(139,92,246,0.5)]">
              <Sparkles size={11} /> DAILY HABIT TRACKER
            </span>
            <span className="text-[11px] text-[#9E99AF] font-medium">
              30-Day Activity Heatmap
            </span>
          </div>

          <div className="flex items-baseline gap-3 mt-2">
            <div className="flex items-center gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-1">
                <Flame size={24} className="text-amber-400 fill-amber-400 animate-pulse" />
                {streakDays}
              </span>
              <span className="text-xs text-[#AAA5B6] font-medium">Day Streak</span>
            </div>

            <div className="h-4 w-[1px] bg-white/10" />

            <div className="text-xs text-[#AAA5B6]">
              <strong className="text-violet-300 font-bold">{consistencyPercent}%</strong> Consistency
            </div>

            <div className="h-4 w-[1px] bg-white/10" />

            <div className="text-xs text-[#AAA5B6]">
              <strong className="text-white font-bold">{totalHours30D}h</strong> Logged
            </div>
          </div>
        </div>

        {/* View Mode Toggle & Quick Actions */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="flex items-center bg-[#0F0C1B] rounded-xl p-1 border border-white/5 text-xs">
            <button
              onClick={() => setViewMode('3d')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                viewMode === '3d'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-[#9E99AF] hover:text-white'
              }`}
            >
              3D Spatial
            </button>
            <button
              onClick={() => setViewMode('flat')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                viewMode === 'flat'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-[#9E99AF] hover:text-white'
              }`}
            >
              Grid Strip
            </button>
          </div>

          {onOpenPomodoro && (
            <button
              onClick={onOpenPomodoro}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-violet-900/30 transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Zap size={13} />
              <span>Study Now</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Heatmap Visual Area */}
      <div className="relative z-10">
        {viewMode === '3d' ? (
          <div className="relative w-full h-56 sm:h-64 rounded-2xl bg-[#0B0914]/80 border border-violet-500/15 overflow-hidden flex flex-col justify-between">
            {/* 3D Canvas Mount */}
            <div ref={mountRef} className="w-full h-full" />

            {/* Canvas Overlay Instructions & Axis Labels */}
            <div className="absolute top-3 left-3 pointer-events-none flex items-center gap-2 text-[10px] text-white/50 bg-[#0E0B19]/80 px-2.5 py-1 rounded-lg border border-white/5">
              <span>Interactive 3D isometric view · Drag to rotate perspective</span>
            </div>

            {/* Hover Tooltip / Inspector overlay inside canvas */}
            {activeInspectedDay && (
              <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-xs p-3 rounded-xl bg-[#181329]/95 border border-violet-500/40 backdrop-blur-md shadow-xl text-white text-xs pointer-events-none animate-fadeIn">
                <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1.5 mb-1.5">
                  <div className="font-bold flex items-center gap-1.5 text-violet-200">
                    <Calendar size={13} className="text-violet-400" />
                    <span>{activeInspectedDay.formattedDate} ({activeInspectedDay.dayOfWeek})</span>
                  </div>
                  {activeInspectedDay.isToday && (
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[9px] uppercase">
                      Today
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-[#AAA5B6]">
                  <div>
                    Focus Time:{' '}
                    <strong className="text-white">
                      {activeInspectedDay.minutes > 0
                        ? `${activeInspectedDay.minutes}m`
                        : 'No logs'}
                    </strong>
                  </div>
                  <div>
                    Tasks Done:{' '}
                    <strong className="text-white">
                      {activeInspectedDay.taskCount}
                    </strong>
                  </div>
                </div>

                {activeInspectedDay.subjects.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {activeInspectedDay.subjects.map((sub, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-200 text-[10px]"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Responsive 2D / Grid Strip fallback mode */
          <div className="p-4 rounded-2xl bg-[#0B0914]/80 border border-violet-500/15">
            <div className="text-xs text-[#9E99AF] mb-3 flex items-center justify-between">
              <span>Past 30 Days Activity Log</span>
              <span>Today: {last30Days[last30Days.length - 1]?.formattedDate}</span>
            </div>

            {/* 30-Day Grid */}
            <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
              {last30Days.map((day, idx) => {
                const levelBg =
                  day.level === 4
                    ? 'bg-purple-500 border-purple-400 shadow-[0_0_8px_#c084fc]'
                    : day.level === 3
                    ? 'bg-purple-600 border-purple-500'
                    : day.level === 2
                    ? 'bg-indigo-600 border-indigo-500'
                    : day.level === 1
                    ? 'bg-indigo-800/80 border-indigo-700/60'
                    : 'bg-[#151224] border-white/5';

                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    onClick={() => setSelectedDay(day)}
                    className={`cursor-pointer group relative flex flex-col items-center justify-center p-2 rounded-xl border transition-all hover:scale-105 ${levelBg} ${
                      day.isToday ? 'ring-2 ring-amber-400' : ''
                    }`}
                  >
                    <span className="text-[10px] font-bold text-white/90">
                      {day.dayOfMonth}
                    </span>
                    <span className="text-[9px] text-white/60">
                      {day.dayOfWeek[0]}
                    </span>
                    {day.minutes > 0 && (
                      <span className="text-[8px] text-violet-200 font-mono mt-0.5">
                        {day.minutes}m
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Heatmap Legend */}
        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#9E99AF]">
          <div className="flex items-center gap-1.5">
            <span>Intensity:</span>
            <span className="text-[10px]">Rest</span>
            <div className="w-3 h-3 rounded bg-[#181528] border border-white/5" />
            <div className="w-3 h-3 rounded bg-[#4f46e5]" />
            <div className="w-3 h-3 rounded bg-[#7c3aed]" />
            <div className="w-3 h-3 rounded bg-[#9333ea]" />
            <div className="w-3 h-3 rounded bg-[#c084fc] shadow-[0_0_6px_#c084fc]" />
            <span className="text-[10px]">2h+ Focus</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full border border-amber-400 inline-block" />
              <span>Today</span>
            </span>

            {onOpenAddTask && (
              <button
                onClick={onOpenAddTask}
                className="text-violet-400 hover:text-violet-300 font-medium inline-flex items-center gap-1 transition"
              >
                <span>+ Log Today's Study</span>
                <ChevronRight size={12} />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
