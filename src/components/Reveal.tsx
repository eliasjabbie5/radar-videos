import React from 'react';
import {useCurrentFrame} from 'remotion';
import {prog} from '../lib/motion';

/** Fade + slow rise entrance. `at` is a frame in the parent scene's local time. */
export const Reveal: React.FC<{
  at: number;
  dur?: number;
  y?: number;
  style?: React.CSSProperties;
  className?: string;
  children: React.ReactNode;
}> = ({at, dur = 28, y = 22, style, className, children}) => {
  const frame = useCurrentFrame();
  const p = prog(frame, at, dur);
  return (
    <div
      className={className}
      style={{opacity: p, transform: `translateY(${(1 - p) * y}px)`, ...style}}
    >
      {children}
    </div>
  );
};
