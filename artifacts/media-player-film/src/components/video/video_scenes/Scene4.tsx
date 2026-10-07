import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AudioLines, Pause, Play, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { useSceneTimer } from '@/lib/video';
import { AccentRing, assetUrl, EASE_OUT, SceneGrain, SceneWord } from '../FilmElements';

export function Scene4() {
  const [headline, setHeadline] = useState(0);
  const [videoMode, setVideoMode] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [showRate, setShowRate] = useState(false);
  const [handoff, setHandoff] = useState(false);

  useSceneTimer([
    { time: 780, callback: () => { setHeadline(1); setVideoMode(true); } },
    { time: 1400, callback: () => setHeadline(2) },
    { time: 2550, callback: () => setShowControls(true) },
    { time: 4270, callback: () => setShowRate(true) },
    { time: 4650, callback: () => setHandoff(true) },
  ]);

  const words = ['AUDIO.', 'VIDÉO.', 'LECTURE.'];

  return (
    <motion.section
      className="film-scene"
      initial={{ opacity: 0, scale: 1.12, clipPath: 'circle(0% at 43% 47%)' }}
      animate={{ opacity: 1, scale: 1, clipPath: 'circle(130% at 43% 47%)' }}
      exit={{ opacity: 0, scale: 1.04, rotateY: -8, clipPath: 'inset(0 50% 0 50%)' }}
      transition={{ duration: 0.54, ease: EASE_OUT }}
      style={{ background: '#080a16', transformPerspective: 1300 }}
    >
      <SceneGrain />
      <motion.div
        aria-hidden="true"
        style={{ position: 'absolute', right: '-7%', top: '22%', zIndex: 0 }}
        animate={handoff ? { x: '19vw', rotateY: 70, opacity: 0 } : { x: 0, rotateY: 0, opacity: 1 }}
        transition={{ duration: handoff ? 0.7 : 0.55, ease: EASE_OUT }}
      >
        <AccentRing size="26vw" color="var(--color-secondary)" width="0.2vw" />
      </motion.div>

      <motion.div
        style={{
          position: 'absolute',
          left: '8%',
          top: '16%',
          width: '54%',
          height: '68%',
          zIndex: 2,
          overflow: 'hidden',
          borderRadius: '2.15vw',
          background: '#14172b',
          border: '1px solid rgba(255,255,255,.13)',
          boxShadow: '0 3.4vw 8vw rgba(0,0,0,.46)',
          transformOrigin: '50% 52%',
          transformStyle: 'preserve-3d',
        }}
        initial={{ opacity: 0, scale: 0.87, rotateY: -16, rotateX: 4 }}
        animate={handoff
          ? { opacity: 0.22, scale: 1.58, rotateY: 19, rotateX: -5, x: '-3vw', y: '5vh' }
          : { opacity: 1, scale: 1, rotateY: 0, rotateX: 0 }}
        transition={{ duration: handoff ? 0.78 : 0.66, ease: EASE_OUT }}
      >
        <AnimatePresence mode="sync" initial={false}>
          {videoMode ? (
            <motion.div
              key="video"
              initial={{ opacity: 0, scale: 1.1, clipPath: 'inset(50% 0 50% 0)' }}
              animate={{ opacity: 1, scale: 1, clipPath: 'inset(0% 0 0% 0)' }}
              exit={{ opacity: 0, scale: 1.05, clipPath: 'inset(0 50% 0 50%)' }}
              transition={{ duration: 0.56, ease: EASE_OUT }}
              style={{ position: 'absolute', inset: 0 }}
            >
              <img className="film-image" src={assetUrl('images/film-desert.jpg')} alt="" />
              <div style={{ position: 'absolute', inset: '45% 0 0', background: 'linear-gradient(transparent, rgba(7,9,18,.88))' }} />
              <div className="film-mono" style={{ position: 'absolute', left: '4%', top: '7%', color: 'rgba(255,255,255,.86)', fontSize: '1.35vmin' }}>MEDIA / VIDEO</div>
            </motion.div>
          ) : (
            <motion.div
              key="audio"
              initial={{ opacity: 0, scale: 0.84, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 1.16, rotate: 6 }}
              transition={{ duration: 0.46, ease: EASE_OUT }}
              style={{ position: 'absolute', inset: 0 }}
            >
              <img className="film-image" src={assetUrl('images/album-neon.jpg')} alt="" />
              <div style={{ position: 'absolute', inset: '45% 0 0', background: 'linear-gradient(transparent, rgba(7,9,18,.88))' }} />
              <div className="film-mono" style={{ position: 'absolute', left: '4%', top: '7%', color: 'rgba(255,255,255,.88)', fontSize: '1.35vmin' }}>MEDIA / AUDIO</div>
              <motion.div style={{ position: 'absolute', left: '7%', right: '7%', bottom: '16%' }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.4 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '4.1vmin', fontWeight: 700, letterSpacing: '-0.04em' }}>VOTRE PISTE</div>
                <div style={{ marginTop: '0.6vh', color: 'rgba(255,255,255,.68)', fontSize: '2vmin' }}>Bibliothèque audio</div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: '5%',
            top: '5%',
            width: '4.4vw',
            height: '4.4vw',
            display: 'grid',
            placeItems: 'center',
            borderRadius: '50%',
            background: 'rgba(9,11,24,.73)',
            color: 'var(--color-primary)',
            zIndex: 2,
          }}
          animate={{ scale: videoMode ? [1, 1.08, 1] : 1 }}
          transition={{ duration: 0.5 }}
        >
          <AudioLines size="2.3vmin" />
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: showControls ? 1 : 0 }}
          transition={{ duration: 0.75, ease: EASE_OUT }}
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '7%',
            width: '86%',
            height: '0.48vh',
            borderRadius: 99,
            background: 'linear-gradient(90deg, var(--color-primary) 0 61%, rgba(255,255,255,.24) 61%)',
            transformOrigin: 'left',
            zIndex: 3,
          }}
        />
      </motion.div>

      <div style={{ position: 'absolute', left: '67%', top: '25%', width: '28%', zIndex: 3 }}>
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={headline}
            initial={{ opacity: 0, y: 20, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 1.04 }}
            transition={{ duration: 0.34, ease: EASE_OUT }}
          >
            <SceneWord size={headline === 2 ? '10vmin' : '12vmin'}>
              {words[headline]}
            </SceneWord>
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 15 }}
          transition={{ duration: 0.42, ease: EASE_OUT }}
          style={{ marginTop: '3.6vh', display: 'flex', alignItems: 'center', gap: '1.1vw', color: 'var(--color-text-secondary)' }}
        >
          {[<SkipBack key="back" size="2.3vmin" />, <Play key="play" size="2.5vmin" fill="currentColor" />, <SkipForward key="forward" size="2.3vmin" />].map((icon, index) => (
            <motion.span
              key={index}
              aria-hidden="true"
              animate={{ scale: showControls ? [0.7, 1.08, 1] : 0.7, color: index === 1 ? 'var(--color-primary)' : 'var(--color-text-secondary)' }}
              transition={{ delay: index * 0.12, duration: 0.35, ease: EASE_OUT }}
              style={{
                width: index === 1 ? '4vw' : '2.8vw',
                height: index === 1 ? '4vw' : '2.8vw',
                display: 'grid',
                placeItems: 'center',
                borderRadius: '50%',
                background: index === 1 ? 'rgba(97,231,232,.13)' : 'rgba(255,255,255,.035)',
              }}
            >
              {icon}
            </motion.span>
          ))}
          <motion.span
            aria-hidden="true"
            animate={{ opacity: showControls ? 1 : 0 }}
            transition={{ delay: 0.45, duration: 0.3 }}
            style={{ display: 'grid', placeItems: 'center', marginLeft: '1vw' }}
          >
            <Volume2 size="2.1vmin" />
          </motion.span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, clipPath: 'inset(0 0 0 100%)' }}
          animate={{ opacity: 1, clipPath: 'inset(0 0 0 0)' }}
          transition={{ delay: 3.7, duration: 0.4, ease: EASE_OUT }}
          style={{ marginTop: '3.4vh', color: 'var(--color-text-secondary)', fontSize: '2.8vmin', lineHeight: 1.18 }}
        >
          AVANCEZ À VOTRE RYTHME
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.65, rotateX: -45 }}
          animate={{ opacity: showRate ? 1 : 0, scale: showRate ? 1 : 0.65, rotateX: showRate ? 0 : -45 }}
          transition={{ duration: 0.36, ease: EASE_OUT }}
          className="film-mono"
          style={{ marginTop: '2vh', display: 'inline-block', padding: '0.65vh 1vw', border: '1px solid rgba(97,231,232,.46)', borderRadius: '999px', color: 'var(--color-primary)', fontSize: '1.8vmin' }}
        >
          1×
        </motion.div>
      </div>
    </motion.section>
  );
}
