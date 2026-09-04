import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene3_Burnout() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2500),
      setTimeout(() => setPhase(4), 3200),
      setTimeout(() => setPhase(5), 4000),
    ];
    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 w-full h-full flex flex-row items-center justify-center overflow-hidden bg-zinc-950"
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -80 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="absolute inset-0 z-0 opacity-40 mix-blend-screen"
        initial={{ scale: 1.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.5 }}
        transition={{ duration: 6, ease: 'easeOut' }}
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}bg-amber.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="z-10 flex flex-col md:flex-row w-full max-w-7xl px-12 gap-12 items-center">
        <div className="flex-1 flex flex-col items-start justify-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-amber-500/20 text-amber-500 font-semibold mb-6 border border-amber-500/30">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse mr-2" />
              Real-time Alert
            </div>
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              Burnout<br />Detection
            </h2>
            <p className="text-3xl font-arabic text-zinc-400">
              اكتشاف الإرهاق الوظيفي
            </p>
          </motion.div>
        </div>

        <div className="flex-1 w-full flex flex-col gap-6">
          <motion.div
            className="glass-card rounded-2xl p-6 border-l-4 border-l-amber-500 relative overflow-hidden"
            initial={{ opacity: 0, x: 100, rotateY: 20 }}
            animate={phase >= 2 ? { opacity: 1, x: 0, rotateY: 0 } : { opacity: 0, x: 100, rotateY: 20 }}
            transition={{ duration: 1.2, type: 'spring', bounce: 0.3 }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 blur-3xl rounded-full" />
            <div className="flex justify-between items-center mb-4 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-xl font-bold text-white">A</div>
                <div>
                  <h4 className="text-xl font-bold text-white">Ahmed</h4>
                  <p className="text-sm text-zinc-400">Engineering</p>
                </div>
              </div>
              <motion.div
                className="text-3xl font-bold text-amber-500 text-glow-amber"
                initial={{ scale: 0.5 }}
                animate={phase >= 3 ? { scale: 1 } : { scale: 0.5 }}
                transition={{ type: 'spring', bounce: 0.6 }}
              >
                82/100
              </motion.div>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2 mt-4 overflow-hidden relative z-10">
              <motion.div
                className="bg-amber-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={phase >= 3 ? { width: '82%' } : { width: 0 }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
              />
            </div>
          </motion.div>

          <motion.div
            className="glass-card rounded-2xl p-6 border-l-4 border-l-red-500 relative overflow-hidden"
            initial={{ opacity: 0, x: 100, rotateY: 20 }}
            animate={phase >= 4 ? { opacity: 1, x: 0, rotateY: 0 } : { opacity: 0, x: 100, rotateY: 20 }}
            transition={{ duration: 1.2, type: 'spring', bounce: 0.3 }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/20 blur-3xl rounded-full" />
            <div className="flex justify-between items-center mb-4 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-xl font-bold text-white">K</div>
                <div>
                  <h4 className="text-xl font-bold text-white">Khalid</h4>
                  <p className="text-sm text-zinc-400">HR &amp; Admin</p>
                </div>
              </div>
              <motion.div
                className="text-3xl font-bold text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                initial={{ scale: 0.5 }}
                animate={phase >= 5 ? { scale: 1 } : { scale: 0.5 }}
                transition={{ type: 'spring', bounce: 0.6 }}
              >
                88/100
              </motion.div>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2 mt-4 overflow-hidden relative z-10">
              <motion.div
                className="bg-red-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={phase >= 5 ? { width: '88%' } : { width: 0 }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
