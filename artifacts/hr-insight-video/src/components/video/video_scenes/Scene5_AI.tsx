import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene5_AI() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2500),
      setTimeout(() => setPhase(4), 3500),
      setTimeout(() => setPhase(5), 4500),
    ];
    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden bg-zinc-950"
      initial={{ opacity: 0, rotateY: -15, transformPerspective: 1200 }}
      animate={{ opacity: 1, rotateY: 0, transformPerspective: 1200 }}
      exit={{ opacity: 0, rotateY: 15 }}
      transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
    >
      <motion.div
        className="absolute inset-0 z-0 opacity-40 mix-blend-screen"
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.5 }}
        transition={{ duration: 6, ease: 'easeOut' }}
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}bg-ai.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="absolute bottom-0 left-0 right-0 h-64 flex items-end justify-center gap-2 opacity-30 z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="w-4 bg-indigo-500 rounded-t-full"
            style={{ height: '10%' }}
            animate={{ height: ['10%', `${(((i * 37) % 80) + 20)}%`, '10%'] }}
            transition={{
              duration: 1 + (i % 3) * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: (i % 5) * 0.2,
            }}
          />
        ))}
      </div>

      <div className="z-10 w-full max-w-6xl px-12 flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
              Role-Aware<br />Conversational AI
            </h2>
            <p className="text-3xl font-arabic text-indigo-400 text-glow-indigo mb-8">
              المساعد الذكي للموظفين والإدارة
            </p>
          </motion.div>

          <div className="flex flex-col gap-4">
            {['Context Injection', 'Leave Balances', 'Task Tracking'].map((feature, idx) => (
              <motion.div
                key={feature}
                className="flex items-center gap-4 text-xl text-zinc-300 font-medium"
                initial={{ opacity: 0, x: -20 }}
                animate={phase >= 2 + idx ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
              >
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500 flex items-center justify-center text-indigo-400 text-sm">
                  ✓
                </div>
                {feature}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex-1 w-full flex justify-center">
          <motion.div
            className="glass-card rounded-3xl p-8 w-full max-w-md border border-indigo-500/30"
            initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
            animate={phase >= 2 ? { opacity: 1, scale: 1, rotateY: 0 } : { opacity: 0, scale: 0.8, rotateY: -30 }}
            transition={{ duration: 1.2, type: 'spring', bounce: 0.4 }}
          >
            <div className="flex flex-col gap-6">
              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-zinc-800 text-white p-4 rounded-2xl rounded-tl-sm max-w-[85%] text-lg">
                  How many leave days do I have left?
                </div>
              </motion.div>

              <motion.div
                className="flex justify-end"
                initial={{ opacity: 0, y: 20 }}
                animate={phase >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-indigo-600 text-white p-4 rounded-2xl rounded-tr-sm max-w-[85%] text-lg shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                  You have 21 days of annual leave remaining. You&apos;ve been working hard—consider taking a break!
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
