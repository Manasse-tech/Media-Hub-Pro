import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { useSceneTimer } from '@/lib/video';
import { AccentRing, EASE_OUT, SceneGrain, SceneWord } from '../FilmElements';

export function Scene5() {
  const [showDetail, setShowDetail] = useState(false);
  const [showBrand, setShowBrand] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const [handoff, setHandoff] = useState(false);

  useSceneTimer([
    { time: 1980, callback: () => setShowDetail(true) },
    { time: 2720, callback: () => setShowBrand(true) },
    { time: 3080, callback: () => setShowCategory(true) },
    { time: 4000, callback: () => setHandoff(true) },
  ]);

  return (
    <motion.section
      className="film-scene"
      initial={{ opacity: 1, backgroundColor: '#090b18', clipPath: 'inset(0)' }}
      animate={{ opacity: 1, backgroundColor: '#090b18', clipPath: 'inset(0)' }}
      exit={{ opacity: 0, scale: 1.04, clipPath: 'circle(0% at 50% 50%)' }}
      transition={{ duration: 0.52, ease: EASE_OUT }}
    >
      <SceneGrain />
      <motion.div
        aria-hidden="true"
        style={{ position: 'absolute', left: '-13%', top: '-18%', width: '49vw', height: '136vh', background: 'var(--color-primary)', transform: 'skewX(-13deg)', opacity: 0.95 }}
        initial={{ x: '-20vw', opacity: 0 }}
        animate={handoff ? { x: '5vw', scale: 0.1, opacity: 0 } : { x: 0, opacity: 0.95 }}
        transition={{ duration: handoff ? 0.76 : 0.62, ease: EASE_OUT }}
      />
      <motion.div
        aria-hidden="true"
        style={{ position: 'absolute', right: '-16%', top: '-17%', width: '45vw', height: '134vh', background: 'var(--color-secondary)', transform: 'skewX(-13deg)', opacity: 0.88 }}
        initial={{ x: '21vw', opacity: 0 }}
        animate={handoff ? { x: '-5vw', scale: 0.1, opacity: 0 } : { x: 0, opacity: 0.88 }}
        transition={{ duration: handoff ? 0.76 : 0.62, ease: EASE_OUT }}
      />

      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '58%',
          top: '50%',
          translate: '-50% -50%',
          zIndex: 1,
        }}
        initial={{ scale: 1.65, opacity: 0 }}
        animate={handoff
          ? { scale: 0.6875, rotate: 0, opacity: 1, x: 0, y: 0 }
          : { scale: 1, rotate: -9, opacity: 0.27, x: 0, y: 0 }}
        transition={{ duration: handoff ? 0.78 : 0.6, ease: EASE_OUT }}
      >
        <AccentRing size="32vw" color="var(--color-primary)" width="0.15vw" animated={false} />
      </motion.div>

      <motion.div
        style={{ position: 'absolute', left: '18%', top: '22%', width: '64%', zIndex: 2, textAlign: 'center' }}
        animate={handoff ? { y: -22, opacity: 0, filter: 'blur(5px)' } : { y: 0, opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: handoff ? 0.5 : 0.4, ease: EASE_OUT }}
      >
        <motion.div
          initial={{ opacity: 0, clipPath: 'inset(0 0 0 100%)' }}
          animate={{ opacity: 1, clipPath: 'inset(0 0 0 0)' }}
          transition={{ duration: 0.48, ease: EASE_OUT }}
        >
          <SceneWord size="7.2vmin" align="center">VOS IMPORTS RESTENT</SceneWord>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.43, duration: 0.55, ease: EASE_OUT }}
          style={{ marginTop: '1.3vh' }}
        >
          <SceneWord size="10.5vmin" align="center">SUR CET APPAREIL.</SceneWord>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12, clipPath: 'inset(100% 0 0 0)' }}
          animate={showDetail ? { opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)' } : {}}
          transition={{ duration: 0.4, ease: EASE_OUT }}
          style={{ marginTop: '2.5vh', color: 'rgba(247,248,255,.73)', fontSize: '3vmin' }}
        >
          Aucun envoi automatique dans le cloud.
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.78, rotateX: -45 }}
          animate={showBrand ? { opacity: 1, scale: 1, rotateX: 0 } : {}}
          transition={{ duration: 0.45, ease: EASE_OUT }}
          style={{ marginTop: '4.1vh', color: 'var(--color-primary)', fontFamily: 'var(--font-display)', fontSize: '4.1vmin', fontWeight: 700, letterSpacing: '-0.035em' }}
        >
          MEDIA PLAYER
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={showCategory ? { opacity: 0.74, y: 0 } : {}}
          transition={{ duration: 0.35, ease: EASE_OUT }}
          className="film-mono"
          style={{ marginTop: '1.2vh', color: '#f7f8ff', fontSize: '1.7vmin' }}
        >
          LECTEUR AUDIO &amp; VIDÉO
        </motion.div>
      </motion.div>

      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.7, rotate: -24 }}
        animate={{ opacity: showDetail ? 0.9 : 0, scale: handoff ? 0 : 1, rotate: handoff ? 32 : 0 }}
        transition={{ duration: handoff ? 0.48 : 0.45, ease: EASE_OUT }}
        style={{ position: 'absolute', right: '16%', bottom: '19%', color: 'var(--color-primary)', zIndex: 3 }}
      >
        <ShieldCheck size="4.4vmin" strokeWidth={1.35} />
      </motion.div>
    </motion.section>
  );
}
