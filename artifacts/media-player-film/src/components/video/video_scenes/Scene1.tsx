import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSceneTimer } from '@/lib/video';
import { AccentRing, EASE_OUT, FineGrid, SceneGrain, SceneWord, SoundWave } from '../FilmElements';

export function Scene1() {
  const [headline, setHeadline] = useState(0);
  const [showLabel, setShowLabel] = useState(false);
  const [handoff, setHandoff] = useState(false);

  useSceneTimer([
    { time: 1480, callback: () => setHeadline(1) },
    { time: 2250, callback: () => setShowLabel(true) },
    { time: 3480, callback: () => setHandoff(true) },
  ]);

  return (
    <motion.section
      className="film-scene"
      initial={{ opacity: 0, clipPath: 'inset(0 0 0 100%)' }}
      animate={{ opacity: 1, clipPath: 'inset(0 0 0 0%)' }}
      exit={{ opacity: 0, scale: 1.06, rotateY: -8, clipPath: 'inset(0 0 0 100%)' }}
      transition={{ duration: 0.42, ease: EASE_OUT }}
      style={{ perspective: 1200, background: '#090b18' }}
    >
      <FineGrid />
      <SceneGrain />
      <motion.div
        style={{
          position: 'absolute',
          left: '58%',
          top: '50%',
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={handoff ? { scale: 3.35, x: '16vw', opacity: 0 } : { scale: 1, rotate: [0, -3, 0] }}
        transition={handoff ? { duration: 0.72, ease: EASE_OUT } : { duration: 4.2, ease: 'easeInOut' }}
      >
        <AccentRing size="22vw" />
      </motion.div>

      <motion.div
        aria-hidden="true"
        style={{ position: 'absolute', width: '35vw', right: '-8%', top: '28%' }}
        animate={{ x: ['-4vw', '1vw', '-4vw'], opacity: [0.18, 0.38, 0.18] }}
        transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }}
      >
        <SoundWave />
      </motion.div>

      <div style={{ position: 'absolute', left: '8%', top: '29%', width: '66%', zIndex: 2 }}>
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={headline}
            initial={{ opacity: 0, y: 26, scale: 0.86, filter: 'blur(7px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -22, scale: 1.06, filter: 'blur(4px)' }}
            transition={{ duration: 0.36, ease: EASE_OUT }}
            style={{ transformOrigin: 'left center' }}
          >
            <SceneWord size={headline === 0 ? '10vmin' : '18vmin'}>
              {headline === 0 ? 'VOS MÉDIAS.' : 'À VOUS.'}
            </SceneWord>
          </motion.div>
        </AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 12, clipPath: 'inset(100% 0 0 0)' }}
          animate={showLabel ? { opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)' } : {}}
          transition={{ duration: 0.44, ease: EASE_OUT }}
          className="film-mono"
          style={{
            marginTop: '2.25vh',
            color: 'var(--color-text-secondary)',
            fontSize: '2.15vmin',
          }}
        >
          LECTEUR AUDIO &amp; VIDÉO
        </motion.div>
      </div>

      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '7.9%',
          bottom: '15.5%',
          width: '34vw',
          height: 1,
          transformOrigin: 'left',
          background: 'linear-gradient(90deg, var(--color-secondary), transparent)',
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: showLabel ? 1 : 0 }}
        transition={{ duration: 0.55, ease: EASE_OUT }}
      />
    </motion.section>
  );
}
