import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene6_Outro() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2800),
    ];
    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 w-full h-full flex flex-col items-center justify-center overflow-hidden bg-zinc-950"
      initial={{ opacity: 0, scale: 1.08 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, filter: 'blur(20px)', scale: 0.92 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="absolute inset-0 z-0 opacity-20"
        animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.05, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}bg-indigo.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Persistent glow orbs */}
      <motion.div
        className="absolute w-[60vw] h-[60vw] rounded-full blur-3xl opacity-10"
        style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="z-10 text-center flex flex-col items-center">
        <motion.h1
          className="text-6xl md:text-8xl font-bold tracking-tighter text-white mb-6 text-glow"
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
          animate={phase >= 1 ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : { opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          Know Your Team<br />Before You Ask
        </motion.h1>

        <motion.p
          className="text-4xl md:text-6xl font-arabic font-bold text-zinc-400 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          اعرف فريقك قبل أن تسأل
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="glass-card px-8 py-4 rounded-full border border-indigo-500/30 flex items-center gap-4 shadow-[0_0_30px_-5px_rgba(99,102,241,0.4)]">
            <motion.div
              className="w-8 h-8 rounded-full bg-indigo-500"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <span className="text-2xl font-bold text-white tracking-widest">HR INSIGHT</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
