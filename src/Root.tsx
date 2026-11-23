import React from 'react';
import {Composition} from 'remotion';
import './lib/fonts';
import {Episode} from './Composition';
import {episode1, episodeDuration} from './data/episode1';
import type {Episode as EpisodeData} from './data/types';
import {EpisodeGeneric} from './v2/EpisodeGeneric';
import {palantir1, palantir1Duration} from './data/palantir1';
import {palantir2, palantir2Duration} from './data/palantir2';
import {usa1, usa1Duration} from './data/usa1';
import {usa2, usa2Duration} from './data/usa2';
import {usa3, usa3Duration} from './data/usa3';
import {val2, val2Duration} from './data/val2';
import {val3, val3Duration} from './data/val3';
import {val4, val4Duration} from './data/val4';
import {nv1, nv1Duration} from './data/nv1';
import {nv2, nv2Duration} from './data/nv2';
import {nv3, nv3Duration} from './data/nv3';
import {sv1, sv1Duration} from './data/sv1';
import {sv2, sv2Duration} from './data/sv2';
import {sv3, sv3Duration} from './data/sv3';
import {fs1, fs1Duration} from './data/fs1';
import {fs2, fs2Duration} from './data/fs2';
import {fs3, fs3Duration} from './data/fs3';
import {dy1, dy1Duration} from './data/dy1';
import {dy2, dy2Duration} from './data/dy2';
import {dy3, dy3Duration} from './data/dy3';
import {ec1, ec1Duration} from './data/ec1';
import {ec2, ec2Duration} from './data/ec2';
import {ec3, ec3Duration} from './data/ec3';
import {JobEpisode} from './jobs/JobEpisode';
import {jobDuration} from './jobs/compile';
import type {Job} from './jobs/types';
import sampleSpec from './jobs/sample/sample.spec.json';
import sampleTiming from './jobs/sample/sample.timing.json';
import {gt1, gt1Duration} from './data/gt1';
import {gt2, gt2Duration} from './data/gt2';
import {gt3, gt3Duration} from './data/gt3';
import {gt4, gt4Duration} from './data/gt4';
import type {Episode2} from './data/types2';

type Props = {episode: EpisodeData};

export const RemotionRoot: React.FC = () => (
  <>
  <Composition<any, Props>
    id="Episode1"
    component={Episode}
    defaultProps={{episode: episode1}}
    durationInFrames={episodeDuration(episode1)}
    fps={episode1.meta.fps}
    width={episode1.meta.width}
    height={episode1.meta.height}
    calculateMetadata={({props}) => ({
      durationInFrames: episodeDuration(props.episode),
      fps: props.episode.meta.fps,
      width: props.episode.meta.width,
      height: props.episode.meta.height,
    })}
  />
  <Composition<any, {episode: Episode2}>
    id="Palantir1"
    component={EpisodeGeneric}
    defaultProps={{episode: palantir1}}
    durationInFrames={palantir1Duration}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition<any, {episode: Episode2}>
    id="Palantir2"
    component={EpisodeGeneric}
    defaultProps={{episode: palantir2}}
    durationInFrames={palantir2Duration}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition<any, {episode: Episode2}>
    id="Usa1"
    component={EpisodeGeneric}
    defaultProps={{episode: usa1}}
    durationInFrames={usa1Duration}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition<any, {episode: Episode2}>
    id="Usa2"
    component={EpisodeGeneric}
    defaultProps={{episode: usa2}}
    durationInFrames={usa2Duration}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition<any, {episode: Episode2}>
    id="Usa3"
    component={EpisodeGeneric}
    defaultProps={{episode: usa3}}
    durationInFrames={usa3Duration}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition<any, {episode: Episode2}>
    id="Val2"
    component={EpisodeGeneric}
    defaultProps={{episode: val2}}
    durationInFrames={val2Duration}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition<any, {episode: Episode2}>
    id="Val3"
    component={EpisodeGeneric}
    defaultProps={{episode: val3}}
    durationInFrames={val3Duration}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition<any, {episode: Episode2}>
    id="Val4"
    component={EpisodeGeneric}
    defaultProps={{episode: val4}}
    durationInFrames={val4Duration}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition<any, {episode: Episode2}>
    id="Nv1"
    component={EpisodeGeneric}
    defaultProps={{episode: nv1}}
    durationInFrames={nv1Duration}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition<any, {episode: Episode2}>
    id="Nv2"
    component={EpisodeGeneric}
    defaultProps={{episode: nv2}}
    durationInFrames={nv2Duration}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition<any, {episode: Episode2}>
    id="Nv3"
    component={EpisodeGeneric}
    defaultProps={{episode: nv3}}
    durationInFrames={nv3Duration}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition<any, {episode: Episode2}>
    id="Bankid"
    component={EpisodeGeneric}
    defaultProps={{episode: sv1}}
    durationInFrames={sv1Duration}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition<any, {episode: Episode2}>
    id="Elpris"
    component={EpisodeGeneric}
    defaultProps={{episode: sv2}}
    durationInFrames={sv2Duration}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition<any, {episode: Episode2}>
    id="Kronan"
    component={EpisodeGeneric}
    defaultProps={{episode: sv3}}
    durationInFrames={sv3Duration}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition<any, {episode: Episode2}>
    id="Friskolor"
    component={EpisodeGeneric}
    defaultProps={{episode: fs1}}
    durationInFrames={fs1Duration}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition<any, {episode: Episode2}>
    id="Bostadsko"
    component={EpisodeGeneric}
    defaultProps={{episode: fs2}}
    durationInFrames={fs2Duration}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition<any, {episode: Episode2}>
    id="Snus"
    component={EpisodeGeneric}
    defaultProps={{episode: fs3}}
    durationInFrames={fs3Duration}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition<any, {episode: Episode2}>
    id="Matpriser"
    component={EpisodeGeneric}
    defaultProps={{episode: dy1}}
    durationInFrames={dy1Duration}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition<any, {episode: Episode2}>
    id="Personuppgifter"
    component={EpisodeGeneric}
    defaultProps={{episode: dy2}}
    durationInFrames={dy2Duration}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition<any, {episode: Episode2}>
    id="Ungdomsrabatt"
    component={EpisodeGeneric}
    defaultProps={{episode: dy3}}
    durationInFrames={dy3Duration}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition<any, {episode: Episode2}>
    id="Techland"
    component={EpisodeGeneric}
    defaultProps={{episode: ec1}}
    durationInFrames={ec1Duration}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition<any, {episode: Episode2}>
    id="Systembolaget"
    component={EpisodeGeneric}
    defaultProps={{episode: ec2}}
    durationInFrames={ec2Duration}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition<any, {episode: Episode2}>
    id="Kiruna"
    component={EpisodeGeneric}
    defaultProps={{episode: ec3}}
    durationInFrames={ec3Duration}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition<any, {episode: Episode2}>
    id="Gta1"
    component={EpisodeGeneric}
    defaultProps={{episode: gt1}}
    durationInFrames={gt1Duration}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition<any, {episode: Episode2}>
    id="Gta2"
    component={EpisodeGeneric}
    defaultProps={{episode: gt2}}
    durationInFrames={gt2Duration}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition<any, {episode: Episode2}>
    id="Gta3"
    component={EpisodeGeneric}
    defaultProps={{episode: gt3}}
    durationInFrames={gt3Duration}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition<any, {episode: Episode2}>
    id="Gta4"
    component={EpisodeGeneric}
    defaultProps={{episode: gt4}}
    durationInFrames={gt4Duration}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition<any, {job: Job}>
    id="Job"
    component={JobEpisode}
    defaultProps={{job: {spec: sampleSpec, timing: sampleTiming} as unknown as Job}}
    durationInFrames={900}
    calculateMetadata={({props}) => ({durationInFrames: jobDuration(props.job)})}
    fps={30}
    width={1080}
    height={1920}
  />
  </>
);
