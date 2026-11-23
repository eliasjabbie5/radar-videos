import React from 'react';
import {AbsoluteFill, Html5Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BinaryOutro} from './components/scenes/BinaryOutro';
import {ColdOpenCounter} from './components/scenes/ColdOpenCounter';
import {DeadlockMatrix} from './components/scenes/DeadlockMatrix';
import {RiksdagDotGrid} from './components/scenes/RiksdagDotGrid';
import {VoteTrack} from './components/scenes/VoteTrack';
import {Captions} from './components/chrome/Captions';
import {Chrome} from './components/chrome/Chrome';
import {prog} from './lib/motion';
import {colors} from './lib/theme';
import {useEpisodeAssets} from './lib/useEpisodeAssets';
import {SFX_LIBRARY, SFX_MASTER} from './lib/sfx';
import type {Episode as EpisodeData, SceneTiming, SfxEvent} from './data/types';

/** Cross-fade + slow slide. Sequence is extended `t` frames so it overlaps the next scene. */
const SceneTransition: React.FC<{
  duration: number;
  t: number;
  fadeIn: boolean;
  fadeOut: boolean;
  children: React.ReactNode;
}> = ({duration, t, fadeIn, fadeOut, children}) => {
  const frame = useCurrentFrame();
  const inP = fadeIn ? prog(frame, 0, t) : 1;
  const outP = fadeOut ? prog(frame, duration, t) : 0;
  return (
    <AbsoluteFill
      style={{opacity: inP * (1 - outP), transform: `translateY(${(1 - inP) * 28 - outP * 18}px)`}}
    >
      {children}
    </AbsoluteFill>
  );
};

/** One sound effect, cut to length with a 5-frame fade-out so cuts never click. */
const Sfx: React.FC<{name: SfxEvent['name']; volume: number; frames: number}> = ({name, volume, frames}) => (
  <Html5Audio
    src={staticFile(`sfx/${name}.wav`)}
    volume={(f) => volume * Math.min(1, Math.max(0, (frames - f) / 5))}
  />
);

const renderScene = (scene: SceneTiming, episode: EpisodeData) => {
  const c = episode.content;
  switch (scene.key) {
    case 'coldOpen':
      return <ColdOpenCounter content={c.coldOpen} />;
    case 'voteTrack':
      return <VoteTrack content={c.voteTrack} />;
    case 'deadlock':
      return <DeadlockMatrix content={c.deadlock} />;
    case 'dotGrid':
      return <RiksdagDotGrid content={c.dotGrid} />;
    case 'outro':
      return <BinaryOutro content={c.outro} />;
  }
};

export const Episode: React.FC<{episode: EpisodeData}> = ({episode}) => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();
  const {audioSrc, captions} = useEpisodeAssets(episode);
  const t = episode.transitionFrames;
  const last = episode.scenes.length - 1;

  return (
    <AbsoluteFill style={{backgroundColor: colors.canvas}}>
      {audioSrc && <Html5Audio src={audioSrc} />}

      {/* sound effects */}
      {episode.sfx.map((e, i) => {
        const lib = SFX_LIBRARY[e.name];
        const frames = Math.max(2, Math.min(Math.ceil(lib.seconds * fps), e.duration ?? Infinity));
        return (
          <Sequence key={i} from={e.at} durationInFrames={frames} name={`sfx:${e.name}`}>
            <Sfx name={e.name} volume={SFX_MASTER * lib.gain * (e.volume ?? 1)} frames={frames} />
          </Sequence>
        );
      })}

      {episode.scenes.map((scene, i) => (
        <Sequence
          key={scene.key}
          name={scene.key}
          from={scene.from}
          durationInFrames={scene.duration + (i < last ? t : 0)}
        >
          <SceneTransition duration={scene.duration} t={t} fadeIn={i > 0} fadeOut={i < last}>
            {renderScene(scene, episode)}
          </SceneTransition>
        </Sequence>
      ))}

      <Chrome episode={episode} />
      <Captions captions={captions} />

      {/* clean fade to black on the final beat */}
      <AbsoluteFill
        style={{
          backgroundColor: colors.canvas,
          opacity: prog(frame, durationInFrames - 24, 24),
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
