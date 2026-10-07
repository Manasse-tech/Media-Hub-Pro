import { motion } from 'framer-motion';

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export function FineGrid({ opacity = 0.14 }: { opacity?: number }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: '-20%',
        opacity,
        backgroundImage:
          'linear-gradient(rgba(97,231,232,.22) 1px, transparent 1px), linear-gradient(90deg, rgba(97,231,232,.22) 1px, transparent 1px)',
        backgroundSize: '7.2vw 7.2vw',
        transform: 'perspective(950px) rotateX(58deg) scale(1.45) translateY(23%)',
        transformOrigin: 'center bottom',
        maskImage: 'linear-gradient(to top, black, transparent 88%)',
        pointerEvents: 'none',
      }}
    />
  );
}

export function AccentRing({
  size = '22vw',
  color = 'var(--color-primary)',
  width = '0.22vw',
}: {
  size?: string;
  color?: string;
  width?: string;
}) {
  return (
    <motion.div
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        border: `${width} solid ${color}`,
        borderRadius: '50%',
        position: 'relative',
        flex: '0 0 auto',
        boxShadow: `inset 0 0 0 1px rgba(255,255,255,.035), 0 0 3vw color-mix(in srgb, ${color} 16%, transparent)`,
      }}
      animate={{ rotate: [0, 9, 0], scale: [1, 1.035, 1] }}
      transition={{ duration: 3.4, ease: 'easeInOut', repeat: Infinity }}
    >
      <span
        style={{
          position: 'absolute',
          width: '15%',
          aspectRatio: '1',
          right: '4%',
          top: '15%',
          borderRadius: '50%',
          background: 'var(--color-secondary)',
          boxShadow: '0 0 1.8vw rgba(255,128,102,.45)',
        }}
      />
    </motion.div>
  );
}

export function SoundWave({ color = 'var(--color-primary)' }: { color?: string }) {
  const levels = [16, 29, 44, 24, 61, 37, 78, 50, 32, 70, 43, 82, 51, 33, 65, 40, 76, 24, 57, 35, 66];
  return (
    <div
      aria-hidden="true"
      style={{
        height: '7.6vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.28vw',
        overflow: 'hidden',
      }}
    >
      {levels.map((height, index) => (
        <motion.span
          key={`${height}-${index}`}
          style={{
            display: 'block',
            width: '0.25vw',
            minWidth: 2,
            height: `${height}%`,
            borderRadius: '99px',
            background: color,
            opacity: 0.42 + (height / 100) * 0.58,
            transformOrigin: 'center',
          }}
          animate={{ scaleY: [0.64, 1, 0.76] }}
          transition={{
            duration: 1.2 + (index % 5) * 0.14,
            delay: (index % 7) * 0.07,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  );
}

export function SceneWord({
  children,
  size = '10vmin',
  color = 'var(--color-text-primary)',
  align = 'left',
}: {
  children: string;
  size?: string;
  color?: string;
  align?: 'left' | 'center' | 'right';
}) {
  return (
    <span
      style={{
        display: 'block',
        color,
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: size,
        lineHeight: 0.92,
        letterSpacing: '-0.065em',
        textAlign: align,
      }}
    >
      {children}
    </span>
  );
}

export function assetUrl(path: string) {
  return `${import.meta.env.BASE_URL}${path}`;
}

export function SceneGrain() {
  return <div className="film-grain" aria-hidden="true" />;
}
