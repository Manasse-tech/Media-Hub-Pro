import { useState } from 'react';
import { FileAudio2, FileVideo2, FolderOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSceneTimer } from '@/lib/video';
import { AccentRing, EASE_OUT, SceneGrain, SceneWord } from '../FilmElements';

export function Scene2() {
  const [audioReady, setAudioReady] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [handoff, setHandoff] = useState(false);

  useSceneTimer([
    { time: 1180, callback: () => setAudioReady(true) },
    { time: 1990, callback: () => setVideoReady(true) },
    { time: 3440, callback: () => setHandoff(true) },
  ]);

  return (
    <motion.section
      className="film-scene"
      initial={{ opacity: 0, clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)' }}
      animate={{ opacity: 1, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
      exit={{ opacity: 0, rotateX: 9, scale: 0.96, clipPath: 'inset(0 0 0 100%)' }}
      transition={{ duration: 0.48, ease: EASE_OUT }}
      style={{ background: '#0b0e1b', transformPerspective: 1200 }}
    >
      <SceneGrain />
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '0 0 0 47%',
          background: 'linear-gradient(132deg, rgba(255,128,102,.13), rgba(255,128,102,.025) 62%, transparent)',
          clipPath: 'polygon(24% 0, 100% 0, 100% 100%, 0 100%)',
        }}
        initial={{ x: '18vw', opacity: 0 }}
        animate={{ x: handoff ? '28vw' : 0, opacity: handoff ? 0.25 : 1 }}
        transition={{ duration: handoff ? 0.64 : 0.66, ease: EASE_OUT }}
      />

      <div style={{ position: 'absolute', left: '8%', top: '30%', width: '40%', zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
        >
          <SceneWord size="12vmin">IMPORTER.</SceneWord>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.4, ease: EASE_OUT }}
          style={{ margin: '2.1vh 0 0', color: 'var(--color-text-secondary)', fontSize: '3.25vmin' }}
        >
          Depuis votre appareil.
        </motion.p>
        <motion.div
          aria-hidden="true"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.76, duration: 0.62, ease: EASE_OUT }}
          style={{
            marginTop: '2.8vh',
            width: '15vw',
            height: '0.45vh',
            transformOrigin: 'left',
            background: 'var(--color-secondary)',
          }}
        />
      </div>

      <motion.div
        style={{
          position: 'absolute',
          right: '14%',
          top: '21%',
          width: '33vw',
          height: '58vh',
          borderRadius: '2.4vw',
          background: 'rgba(20,23,43,.88)',
          border: '1px solid rgba(255,255,255,.1)',
          boxShadow: '0 4vw 9vw rgba(0,0,0,.4)',
          padding: '3.1vh 2.7vw',
          zIndex: 1,
          transformOrigin: 'center',
        }}
        initial={{ opacity: 0, scale: 0.82, rotateY: 16, y: 24 }}
        animate={handoff
          ? { opacity: 0.2, scale: 2.9, rotateY: -14, x: '-4vw', y: 0 }
          : { opacity: 1, scale: 1, rotateY: 0, y: 0 }}
        transition={{ duration: handoff ? 0.78 : 0.7, ease: EASE_OUT }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.15vw', color: 'var(--color-text-primary)' }}>
          <FolderOpen size="2.8vmin" strokeWidth={1.6} color="var(--color-primary)" />
          <span className="film-mono" style={{ fontSize: '1.75vmin', color: 'var(--color-text-secondary)' }}>FICHIERS</span>
          <span style={{ marginLeft: 'auto', fontSize: '1.55vmin', color: 'var(--color-text-muted)' }}>01—02</span>
        </div>

        <motion.div
          style={{
            position: 'absolute',
            top: '23%',
            left: '34%',
            display: 'grid',
            placeItems: 'center',
            zIndex: 3,
          }}
          animate={handoff ? { scale: 3.25, rotate: 92, x: '7vw', y: '17vh', opacity: 0 } : { scale: 1, rotate: 0 }}
          transition={{ duration: 0.76, ease: EASE_OUT }}
        >
          <AccentRing size="12vw" color="var(--color-primary)" width="0.27vw" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 32, rotateX: -12 }}
          animate={audioReady ? { opacity: 1, x: 0, rotateX: 0 } : {}}
          transition={{ duration: 0.45, ease: EASE_OUT }}
          style={{
            position: 'absolute',
            left: '8%',
            right: '8%',
            top: '44%',
            height: '17%',
            display: 'flex',
            alignItems: 'center',
            gap: '1vw',
            padding: '0 1.35vw',
            borderRadius: '1.3vw',
            background: 'rgba(97,231,232,.08)',
            border: '1px solid rgba(97,231,232,.18)',
            transformPerspective: 900,
          }}
        >
          <FileAudio2 size="2.4vmin" color="var(--color-primary)" strokeWidth={1.5} />
          <span style={{ fontSize: '2.2vmin', fontWeight: 600 }}>AUDIO</span>
          <span className="film-mono" style={{ marginLeft: 'auto', fontSize: '1.2vmin', color: 'var(--color-text-muted)' }}>MP3</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -28, rotateX: 12 }}
          animate={videoReady ? { opacity: 1, x: 0, rotateX: 0 } : {}}
          transition={{ duration: 0.45, ease: EASE_OUT }}
          style={{
            position: 'absolute',
            left: '8%',
            right: '8%',
            top: '65%',
            height: '17%',
            display: 'flex',
            alignItems: 'center',
            gap: '1vw',
            padding: '0 1.35vw',
            borderRadius: '1.3vw',
            background: 'rgba(255,128,102,.08)',
            border: '1px solid rgba(255,128,102,.19)',
            transformPerspective: 900,
          }}
        >
          <FileVideo2 size="2.4vmin" color="var(--color-secondary)" strokeWidth={1.5} />
          <span style={{ fontSize: '2.2vmin', fontWeight: 600 }}>VIDÉO</span>
          <span className="film-mono" style={{ marginLeft: 'auto', fontSize: '1.2vmin', color: 'var(--color-text-muted)' }}>MP4</span>
        </motion.div>
      </motion.div>

      <div className="film-mono" style={{ position: 'absolute', left: '8%', bottom: '10%', color: 'var(--color-text-muted)', fontSize: '1.75vmin' }}>
        AUDIO&nbsp;&nbsp; / &nbsp;&nbsp;VIDÉO
      </div>
    </motion.section>
  );
}
