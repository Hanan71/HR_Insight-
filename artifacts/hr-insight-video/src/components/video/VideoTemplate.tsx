import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

import { useVideoPlayer } from '@/lib/video';

import {
  Scene1_Problem,
  Scene2_Solution,
  Scene3_Burnout,
  Scene4_Innovation,
  Scene5_AI,
  Scene6_Outro,
} from './video_scenes';

export const SCENE_DURATIONS: Record<string, number> = {
  problem:    6000,
  solution:   8000,
  burnout:   10000,
  innovation:  8000,
  ai:        10000,
  outro:      8000,
};

const SCENE_COMPONENTS: Record<string, React.ComponentType> = {
  problem:    Scene1_Problem,
  solution:   Scene2_Solution,
  burnout:    Scene3_Burnout,
  innovation: Scene4_Innovation,
  ai:         Scene5_AI,
  outro:      Scene6_Outro,
};

// Cumulative start offsets for audio sync
const SCENE_START_SEC: Record<string, number> = (() => {
  const out: Record<string, number> = {};
  let ms = 0;
  for (const [key, dur] of Object.entries(SCENE_DURATIONS)) {
    out[key] = ms / 1000;
    ms += dur;
  }
  return out;
})();

const AUDIO_SEEK_EPSILON = 0.18;

// Persistent midground orb positions per scene index
const orbPos = [
  { x: '45vw', y: '35vh', scale: 2.8, opacity: 0.12 },
  { x: '10vw', y: '20vh', scale: 1.4, opacity: 0.18 },
  { x: '70vw', y: '55vh', scale: 1.8, opacity: 0.22 },
  { x: '20vw', y: '65vh', scale: 1.2, opacity: 0.14 },
  { x: '60vw', y: '25vh', scale: 2.0, opacity: 0.16 },
  { x: '50vw', y: '45vh', scale: 2.4, opacity: 0.20 },
];

const orbColors = ['#6366f1', '#6366f1', '#f59e0b', '#10b981', '#6366f1', '#6366f1'];

export default function VideoTemplate({
  durations = SCENE_DURATIONS,
  loop = true,
  muted = false,
  onSceneChange,
}: {
  durations?: Record<string, number>;
  loop?: boolean;
  muted?: boolean;
  onSceneChange?: (sceneKey: string) => void;
} = {}) {
  const { currentScene, currentSceneKey } = useVideoPlayer({ durations, loop });

  useEffect(() => {
    onSceneChange?.(currentSceneKey);
  }, [currentSceneKey, onSceneChange]);

  const baseSceneKey = currentSceneKey.replace(/_r[12]$/, '');
  const sceneIndex = Object.keys(SCENE_DURATIONS).indexOf(baseSceneKey);
  const SceneComponent = SCENE_COMPONENTS[baseSceneKey];

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.45;
    const targetTime = SCENE_START_SEC[baseSceneKey] ?? 0;
    if (Math.abs(audio.currentTime - targetTime) > AUDIO_SEEK_EPSILON) {
      audio.currentTime = targetTime;
    }
    audio.play().catch(() => {});
  }, [currentSceneKey, baseSceneKey, muted]);

  const pos = orbPos[sceneIndex] ?? orbPos[0];
  const color = orbColors[sceneIndex] ?? '#6366f1';

  return (
    <div className="relative w-full h-screen overflow-hidden bg-zinc-950">

      {/* Persistent drifting background blobs — outside AnimatePresence */}
      <motion.div
        className="absolute w-[80vw] h-[80vw] rounded-full blur-3xl pointer-events-none"
        style={{ background: `radial-gradient(circle, ${color}22, transparent)` }}
        animate={{ x: pos.x, y: pos.y, scale: pos.scale, opacity: pos.opacity }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.div
        className="absolute w-[40vw] h-[40vw] rounded-full blur-3xl pointer-events-none right-0 bottom-0"
        style={{ background: 'radial-gradient(circle, #8b5cf622, transparent)' }}
        animate={{
          x: ['-5vw', '-15vw', '-5vw'],
          y: ['-5vh', '-20vh', '-5vh'],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Persistent accent line that travels across scenes */}
      <motion.div
        className="absolute h-px pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent, ${color}80, transparent)` }}
        animate={{
          left: ['0%', '10%', '0%', '5%', '15%', '0%'][sceneIndex],
          width: ['70%', '50%', '80%', '60%', '75%', '70%'][sceneIndex],
          top: ['30%', '80%', '20%', '70%', '40%', '50%'][sceneIndex],
          opacity: 0.6,
        }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Scene foreground — only scene-specific content mounts/unmounts here */}
      <AnimatePresence mode="popLayout">
        {SceneComponent && <SceneComponent key={currentSceneKey} />}
      </AnimatePresence>

      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}audio/bg_music.mp3`}
        preload="auto"
        autoPlay
        muted={muted}
      />
    </div>
  );
}
