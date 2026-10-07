import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AudioLines, Film, Heart, Library } from 'lucide-react';
import { useSceneTimer } from '@/lib/video';
import { AccentRing, assetUrl, EASE_OUT, SceneGrain, SceneWord } from '../FilmElements';

const FILTERS = ['TOUT', 'MUSIQUE', 'VIDÉOS', 'FAVORIS'];

export function Scene3() {
  const [headline, setHeadline] = useState(0);
  const [filter, setFilter] = useState(0);
  const [handoff, setHandoff] = useState(false);

  useSceneTimer([
    { time: 930, callback: () => setHeadline(1) },
    { time: 1500, callback: () => setFilter(1) },
    { time: 2100, callback: () => setFilter(2) },
    { time: 2670, callback: () => setFilter(3) },
    { time: 3710, callback: () => setHandoff(true) },
  ]);

  return (
    <motion.section
      className="film-scene"
      initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)', rotateX: 5 }}
      animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)', rotateX: 0 }}
      exit={{ opacity: 0, scale: 1.07, rotateY: 8, clipPath: 'polygon(0 0, 48% 0, 48% 100%, 0 100%)' }}
      transition={{ duration: 0.44, ease: EASE_OUT }}
      style={{ background: '#0b0e1b', transformPerspective: 1200 }}
    >
      <SceneGrain />
      <div style={{ position: 'absolute', inset: '0 0 0 48%', background: 'linear-gradient(90deg, rgba(97,231,232,.035), rgba(20,23,43,.82))' }} />

      <motion.div
        aria-hidden="true"
        style={{ position: 'absolute', right: '21%', top: '47%', zIndex: 0 }}
        animate={handoff ? { scale: 3.1, rotate: 45, x: '-8vw', opacity: 0 } : { rotate: 0, scale: 1 }}
        transition={{ duration: handoff ? 0.8 : 0.6, ease: EASE_OUT }}
      >
        <AccentRing size="11vw" color="var(--color-secondary)" width="0.2vw" />
      </motion.div>

      <div style={{ position: 'absolute', left: '7.5%', top: '27%', width: '39%', zIndex: 3 }}>
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={headline}
            initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -18, filter: 'blur(5px)' }}
            transition={{ duration: 0.34, ease: EASE_OUT }}
          >
            <SceneWord size={headline === 0 ? '15vmin' : '11vmin'}>
              {headline === 0 ? 'TRIEZ.' : 'RETROUVEZ.'}
            </SceneWord>
          </motion.div>
        </AnimatePresence>
        <motion.div
          initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
          animate={{ opacity: 1, clipPath: 'inset(0 0 0 0)' }}
          transition={{ delay: 2.56, duration: 0.52, ease: EASE_OUT }}
          style={{ marginTop: '4.6vh', maxWidth: '28vw', color: 'var(--color-text-secondary)', fontSize: '3vmin', lineHeight: 1.25 }}
        >
          UNE BIBLIOTHÈQUE POUR VOS MÉDIAS
        </motion.div>
      </div>

      <motion.div
        style={{
          position: 'absolute',
          right: '7%',
          top: '17%',
          width: '47%',
          height: '68%',
          padding: '3.1vh 2.1vw',
          borderRadius: '2vw',
          background: 'rgba(14,17,33,.94)',
          border: '1px solid rgba(255,255,255,.09)',
          boxShadow: '0 3vw 8vw rgba(0,0,0,.32)',
          zIndex: 2,
          transformOrigin: '62% 52%',
        }}
        initial={{ opacity: 0, x: 36, rotateY: -10, scale: 0.92 }}
        animate={handoff ? { opacity: 0.25, x: '-10vw', scale: 2.9, rotateY: 13 } : { opacity: 1, x: 0, rotateY: 0, scale: 1 }}
        transition={{ duration: handoff ? 0.88 : 0.6, ease: EASE_OUT }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7vw', marginBottom: '2.2vh' }}>
          <Library size="2.1vmin" color="var(--color-primary)" strokeWidth={1.7} />
          <span className="film-mono" style={{ fontSize: '1.55vmin', color: 'var(--color-text-secondary)' }}>BIBLIOTHÈQUE</span>
          <span className="film-mono" style={{ marginLeft: 'auto', fontSize: '1.3vmin', color: 'var(--color-text-muted)' }}>01 / 04</span>
        </div>

        <div style={{ display: 'flex', gap: '0.55vw', marginBottom: '2.15vh' }}>
          {FILTERS.map((name, index) => (
            <motion.div
              key={name}
              animate={{
                opacity: index <= filter ? 1 : 0.52,
                scale: index === filter ? 1.04 : 1,
                backgroundColor: index === filter ? 'rgba(97,231,232,.17)' : 'rgba(255,255,255,.045)',
                borderColor: index === filter ? 'rgba(97,231,232,.58)' : 'rgba(255,255,255,.08)',
              }}
              transition={{ duration: 0.28, delay: index * 0.12, ease: EASE_OUT }}
              style={{
                padding: '0.75vh 0.85vw',
                borderRadius: '99px',
                border: '1px solid',
                color: index === filter ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                fontSize: '1.25vmin',
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                letterSpacing: '0.025em',
                whiteSpace: 'nowrap',
              }}
            >
              {name}
            </motion.div>
          ))}
        </div>

        <motion.div
          animate={handoff ? { scale: 0.22, x: '14vw', y: '-4vh', rotate: -4 } : { scale: 1, x: 0, y: 0, rotate: 0 }}
          transition={{ duration: handoff ? 0.84 : 0.45, ease: EASE_OUT }}
          style={{ display: 'grid', gap: '1vh', transformOrigin: '50% 50%' }}
        >
          <MediaRow image="images/album-neon.jpg" icon={<AudioLines size="2vmin" />} title="Piste audio" detail="Audio" tint="cyan" delay={0.32} />
          <MediaRow image="images/film-desert.jpg" icon={<Film size="2vmin" />} title="Fichier vidéo" detail="Vidéo" tint="orange" delay={0.52} />
          <MediaRow icon={<Heart size="2vmin" />} title="Vos favoris" detail="À retrouver" tint="cyan" delay={0.72} />
        </motion.div>

        <motion.div
          aria-hidden="true"
          style={{ position: 'absolute', right: '5%', bottom: '7%', width: '31%', height: 1, background: 'var(--color-primary)', transformOrigin: 'left' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 2.8, duration: 0.5, ease: EASE_OUT }}
        />
      </motion.div>
    </motion.section>
  );
}

function MediaRow({
  image,
  icon,
  title,
  detail,
  tint,
  delay,
}: {
  image?: string;
  icon: React.ReactNode;
  title: string;
  detail: string;
  tint: 'cyan' | 'orange';
  delay: number;
}) {
  const accent = tint === 'cyan' ? 'var(--color-primary)' : 'var(--color-secondary)';

  return (
    <motion.div
      initial={{ opacity: 0, x: 32, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ delay, duration: 0.42, ease: EASE_OUT }}
      style={{
        height: '11.3vh',
        display: 'flex',
        alignItems: 'center',
        gap: '1.05vw',
        padding: '0.8vh 0.85vw',
        borderRadius: '1.1vw',
        background: 'rgba(255,255,255,.045)',
        border: '1px solid rgba(255,255,255,.055)',
      }}
    >
      <div style={{ width: '8.7vh', height: '8.7vh', flex: '0 0 auto', overflow: 'hidden', borderRadius: '0.8vw', display: 'grid', placeItems: 'center', background: 'rgba(97,231,232,.1)', color: accent }}>
        {image ? <img className="film-image" src={assetUrl(image)} alt="" /> : icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ color: 'var(--color-text-primary)', fontSize: '2.2vmin', fontWeight: 600, lineHeight: 1.2 }}>{title}</div>
        <div className="film-mono" style={{ marginTop: '0.8vh', color: 'var(--color-text-muted)', fontSize: '1.25vmin' }}>{detail.toUpperCase()}</div>
      </div>
      <div style={{ marginLeft: 'auto', color: 'var(--color-text-muted)', fontSize: '2vmin', padding: '0 0.55vw' }}>···</div>
    </motion.div>
  );
}
