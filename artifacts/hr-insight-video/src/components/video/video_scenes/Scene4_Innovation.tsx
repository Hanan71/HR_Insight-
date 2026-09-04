import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene4_Innovation() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2000),
      setTimeout(() => setPhase(4), 2800),
      setTimeout(() => setPhase(5), 3600),
    ];
    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 w-full h-full flex flex-col items-center justify-center overflow-hidden bg-zinc-950"
      initial={{ opacity: 0, clipPath: 'inset(0 50% 0 50%)' }}
      animate={{ opacity: 1, clipPath: 'inset(0 0% 0 0%)' }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
    >
      <motion.div
        className="absolute inset-0 z-0 opacity-30"
        initial={{ scale: 1.1, rotate: -5 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 6, ease: 'easeOut' }}
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}bg-emerald.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="z-10 flex flex-col items-center w-full max-w-7xl px-12">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -40 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: -40 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            Innovation Tracking
          </h2>
          <p className="text-3xl font-arabic text-emerald-400 text-glow-emerald">
            تتبع الابتكار والمشاريع
          </p>
        </motion.div>

        <div className="flex flex-row justify-center items-center gap-8 w-full">
          <motion.div
            className="glass-card rounded-3xl p-8 flex-1 text-center border-t-2 border-t-emerald-500/50 relative overflow-hidden"
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={phase >= 2 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 60, scale: 0.9 }}
            transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/20 blur-3xl rounded-full" />
            <motion.div
              className="text-7xl font-bold text-white mb-2"
              initial={{ scale: 0 }}
              animate={phase >= 3 ? { scale: 1 } : { scale: 0 }}
              transition={{ type: 'spring', bounce: 0.6 }}
            >
              4
            </motion.div>
            <div className="text-xl text-zinc-400 font-medium tracking-wide">ACTIVE PROJECTS</div>
          </motion.div>

          <motion.div
            className="glass-card rounded-3xl p-8 flex-1 text-center border-t-2 border-t-violet-500/50 relative overflow-hidden"
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={phase >= 3 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 60, scale: 0.9 }}
            transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-violet-500/20 blur-3xl rounded-full" />
            <motion.div
              className="text-7xl font-bold text-white mb-2 flex items-center justify-center gap-2"
              initial={{ scale: 0 }}
              animate={phase >= 4 ? { scale: 1 } : { scale: 0 }}
              transition={{ type: 'spring', bounce: 0.6 }}
            >
              3 <span className="text-5xl">🔥</span>
            </motion.div>
            <div className="text-xl text-zinc-400 font-medium tracking-wide">TOP INNOVATORS</div>
          </motion.div>

          <motion.div
            className="glass-card rounded-3xl p-8 flex-1 text-center border-t-2 border-t-indigo-500/50 relative overflow-hidden"
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={phase >= 4 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 60, scale: 0.9 }}
            transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full" />
            <motion.div
              className="text-7xl font-bold text-white mb-2"
              initial={{ scale: 0 }}
              animate={phase >= 5 ? { scale: 1 } : { scale: 0 }}
              transition={{ type: 'spring', bounce: 0.6 }}
            >
              6
            </motion.div>
            <div className="text-xl text-zinc-400 font-medium tracking-wide">EMPLOYEES</div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
