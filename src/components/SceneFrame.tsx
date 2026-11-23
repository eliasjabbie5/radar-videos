import React from 'react';
import {AbsoluteFill} from 'remotion';
import {CONTENT, SAFE} from '../lib/theme';

/** Centers scene content inside the safe area (clear of chrome, captions, TikTok UI). */
export const SceneFrame: React.FC<{children: React.ReactNode; align?: 'center' | 'start'}> = ({
  children,
  align = 'center',
}) => (
  <AbsoluteFill
    style={{
      paddingLeft: SAFE.left,
      paddingRight: SAFE.right,
      paddingTop: CONTENT.top,
      paddingBottom: CONTENT.bottom,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: align === 'center' ? 'center' : 'flex-start',
    }}
  >
    {children}
  </AbsoluteFill>
);
