import React from 'react';
import {AbsoluteFill, Html5Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Captions} from '../components/chrome/Captions';
import {prog} from '../lib/motion';
import {colors} from '../lib/theme';
import {SFX_LIBRARY, SFX_MASTER} from '../lib/sfx';
import type {SfxEvent} from '../data/types';
import type {Episode2} from '../data/types2';
import {ChainChrome} from './ChainChrome';
import {renderScene2} from './scenes2';

const SceneTransition: React.FC<{duration: number; t: number; fadeIn: boolean; fadeOut: boolean; children: React.ReactNode}> = ({duration, t, fadeIn, fadeOut, children}) => {
  const frame = useCurrentFrame();
  const inP = fadeIn ? prog(frame, 0, t) : 1;
  const outP = fadeOut ? prog(frame, duration, t) : 0;
  return (
    <AbsoluteFill style={{opacity: inP * (1 - outP), transform: `translateY(${(1 - inP) * 28 - outP * 18}px)`}}>{children}</AbsoluteFill>
  );
};

const Sfx: React.FC<{name: SfxEvent['name']; volume: number; frames: number}> = ({name, volume, frames}) => (
  <Html5Audio src={staticFile(`sfx/${name}.wav`)} volume={(f) => volume * Math.min(1, Math.max(0, (frames - f) / 5))} />
);

export const EpisodeGeneric: React.FC<{episode: Episode2}> = ({episode}) => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();
  const t = episode.transitionFrames;
  const last = episode.scenes.length - 1;
  return (
    <AbsoluteFill style={{backgroundColor: colors.canvas}}>
      <Html5Audio src={staticFile(episode.audioFile)} />

      {episode.sfx.map((e, i) => {
        const lib = SFX_LIBRARY[e.name];
        const frames = Math.max(2, Math.min(Math.ceil(lib.seconds * fps), e.duration ?? Infinity));
        return (
          <Sequence key={i} from={e.at} durationInFrames={frames} name={`sfx:${e.name}`}>
            <Sfx name={e.name} volume={SFX_MASTER * lib.gain * (e.volume ?? 1)} frames={frames} />
          </Sequence>
        );
      })}

      {episode.scenes.map((s, i) => (
        <Sequence key={s.key} name={s.key} from={s.from} durationInFrames={s.duration + (i < last ? t : 0)}>
          <SceneTransition duration={s.duration} t={t} fadeIn={i > 0} fadeOut={i < last}>
            {renderScene2(s.body, episode, s.from, s.chrome)}
          </SceneTransition>
        </Sequence>
      ))}

      <ChainChrome episode={episode} />
      <Captions captions={episode.captions} />

      <AbsoluteFill style={{backgroundColor: colors.canvas, opacity: prog(frame, durationInFrames - 24, 24), pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};
