import React from 'react';
import {Composition} from 'remotion';
import {ConceptA} from './ConceptA';
import {ConceptB} from './ConceptB';
import {ConceptC} from './ConceptC';
import {CONCEPT_FRAMES} from './kit';

const common = {durationInFrames: CONCEPT_FRAMES, fps: 30, width: 1080, height: 1920} as const;
export const ConceptsRoot: React.FC = () => (
  <>
    <Composition id="ConceptA" component={ConceptA} {...common} />
    <Composition id="ConceptB" component={ConceptB} {...common} />
    <Composition id="ConceptC" component={ConceptC} {...common} />
  </>
);
