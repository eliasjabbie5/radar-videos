import React from 'react';
import {EpisodeGeneric} from '../v2/EpisodeGeneric';
import {compileJob} from './compile';
import type {Job} from './types';

/** Renders a data-driven episode: `job` = {spec, timing} (see src/jobs/types.ts). */
export const JobEpisode: React.FC<{job: Job}> = ({job}) => <EpisodeGeneric episode={compileJob(job)} />;
