import {useEffect, useState} from 'react';
import type {Caption} from '@remotion/captions';
import {continueRender, delayRender, staticFile} from 'remotion';
import type {Episode} from '../data/types';

const isCaptionArray = (v: unknown): v is Caption[] =>
  Array.isArray(v) &&
  v.length > 0 &&
  v.every((c) => typeof c?.text === 'string' && typeof c?.startMs === 'number');

/**
 * Resolves optional files from /public:
 *  - voiceover.mp3  → returned as `audioSrc` only if it exists
 *  - captions.json  → replaces the placeholder captions if valid
 * Missing files never break a render.
 */
export const useEpisodeAssets = (episode: Episode) => {
  const [handle] = useState(() => delayRender('Resolving optional assets'));
  const [state, setState] = useState<{audioSrc: string | null; captions: Caption[]}>({
    audioSrc: null,
    captions: episode.captions,
  });

  useEffect(() => {
    let alive = true;
    (async () => {
      let audioSrc: string | null = null;
      let captions = episode.captions;
      try {
        const url = staticFile(episode.audioFile);
        const res = await fetch(url, {method: 'HEAD'});
        const type = res.headers.get('content-type') ?? '';
        if (res.ok && !type.includes('text/html')) audioSrc = url;
      } catch {
        /* no audio — silent render */
      }
      try {
        const res = await fetch(staticFile(episode.captionsFile));
        if (res.ok) {
          const json: unknown = await res.json();
          if (isCaptionArray(json)) captions = json;
        }
      } catch {
        /* keep placeholder captions */
      }
      if (alive) setState({audioSrc, captions});
      continueRender(handle);
    })();
    return () => {
      alive = false;
    };
  }, [episode, handle]);

  return state;
};
