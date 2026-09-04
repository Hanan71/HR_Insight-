import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene2_Solution() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2800),
      setTimeout(() => setPhase(4), 3800),
    ];
    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0, clipPath: 'circle(0% at 50% 50%)' }}
      animate={{ opacity: 1, clipPath: 'circle(100% at 50% 50%)' }}
      exit={{ opacity: 0, scale: 1.08 }}
      transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
    >
      <motion.div
        className="absolute inset-0 z-0 opacity-40"
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.4 }}
        transition={{ duration: 5, ease: 'easeOut' }}
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}bg-indigo.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="absolute inset-0 z-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4vw_4vw]" />

      <div className="z-10 flex flex-col items-center justify-center w-full max-w-6xl px-12">
        <motion.div
          className="glass-card rounded-3xl p-12 w-full max-w-4xl text-center border-t border-indigo-500/30 shadow-[0_0_80px_-15px_rgba(99,102,241,0.3)] relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.8, rotateX: 45 }}
          animate={phase >= 1 ? { opacity: 1, scale: 1, rotateX: 0 } : { opacity: 0, scale: 0.8, rotateX: 45 }}
          transition={{ duration: 1.5, type: 'spring', bounce: 0.4 }}
        >
          <motion.div
            className="absolute inset-0 bg-indigo-500/10"
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.h3
            className="text-indigo-400 font-semibold tracking-[0.2em] uppercase text-xl mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8 }}
          >
            Introducing
          </motion.h3>

          <motion.div
            className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12"
            initial={{ opacity: 0, y: 30 }}
            animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tight text-glow-indigo">
              HR Insight
            </h1>
            <div className="h-16 w-px bg-zinc-700 hidden md:block" />
            <h1 className="text-6xl md:text-8xl font-bold text-white font-arabic text-glow-indigo">
              بصيرة
            </h1>
          </motion.div>

          <motion.p
            className="text-2xl text-zinc-300 mt-8 font-light"
            initial={{ opacity: 0 }}
            animate={phase >= 4 ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1 }}
          >
            AI-Powered HR Analytics &amp; Context
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
}
