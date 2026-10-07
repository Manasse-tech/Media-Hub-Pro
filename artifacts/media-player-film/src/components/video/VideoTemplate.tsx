// Video Template - Replace ReplitLoadingScene with your scenes

import {
  VideoCanvas,
  type VideoAspectRatio,
  useVideoPlayer,
} from '@/lib/video';
import { AnimatePresence } from 'framer-motion';

import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';

export const SCENE_DURATIONS = {
  opening: 4200,
  import: 4400,
  library: 4900,
  playback: 5700,
  privacy: 4800,
} as const;

const VIDEO_ASPECT_RATIO: VideoAspectRatio = '16:9';

const SCENES = [Scene1, Scene2, Scene3, Scene4, Scene5] as const;

export default function VideoTemplate() {
  const { currentScene } = useVideoPlayer({
    durations: SCENE_DURATIONS,
  });

  return (
    <VideoCanvas
      aspectRatio={VIDEO_ASPECT_RATIO}
      style={{ backgroundColor: 'var(--color-bg-dark)' }}
    >
      <AnimatePresence mode="sync" initial={false}>
        {SCENES.map((Scene, index) =>
          currentScene === index ? <Scene key={Object.keys(SCENE_DURATIONS)[index]} /> : null,
        )}
      </AnimatePresence>
    </VideoCanvas>
  );
}
