import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene1_Problem() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 2500),
      setTimeout(() => setPhase(3), 4000),
    ];
    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 w-full h-full flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="absolute inset-0 z-0 opacity-20"
        initial={{ scale: 1.1, filter: 'blur(10px)' }}
        animate={{ scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 4, ease: 'easeOut' }}
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}bg-indigo.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="z-10 text-center flex flex-col items-center">
        <motion.h2
          className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-400 mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          Most HR teams are
        </motion.h2>

        <motion.h1
          className="text-7xl md:text-9xl font-bold tracking-tighter text-white text-glow"
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
          animate={phase >= 2 ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : { opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          Flying Blind
        </motion.h1>

        <motion.p
          className="text-3xl md:text-5xl font-arabic font-bold text-zinc-500 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          معظم فرق الموارد البشرية تعمل في الظلام
        </motion.p>
      </div>

      <motion.div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-zinc-950 to-transparent z-0" />
    </motion.div>
  );
}
