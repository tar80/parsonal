/* @file Cycle positions for PPc
 * @arg {} -
 * @return -
 */

import {circular, getStaymodeId} from '@ppmdev/modules/staymode.ts';

const DISP_WIDTH = 1920;
const DISP_HEIGHT = 1080;
const TASKBAR_MARGIN = 50;
const EVENT_LABEL = 'cyclePositions';
const STAYMODE_ID = getStaymodeId(EVENT_LABEL) || 2;

type Position = [number, number];
type Cache = {ppcid: string; circular: ReturnType<typeof circular<Position>>};
const cache = {} as Cache;

const main = (): void => {
  cache.ppcid = getPPcId();
  const dispWidth = Number(PPx.Extract('%*getcust(S_ppm#global:disp_width)')) || DISP_WIDTH;
  const dispHeight = Number(PPx.Extract('%*getcust(S_ppm#global:disp_height)')) || DISP_HEIGHT;
  const ppcHalfWidth = Math.floor(Number(PPx.Extract(`%*windowrect(%N${cache.ppcid},w)`)) / 2);
  const ppcHeight = Math.floor((dispHeight - Number(PPx.Extract(`%*windowrect(%N${cache.ppcid},h)`)) - TASKBAR_MARGIN) / 2);
  const pos: Position[] = [
    [dispWidth - ppcHalfWidth, ppcHeight],
    [0 - ppcHalfWidth, ppcHeight],
    [dispWidth / 2 - ppcHalfWidth, ppcHeight]
  ];

  PPx.StayMode = STAYMODE_ID;

  cache.circular = circular(pos);
  cache.circular.discard({table: 'KC_main', label: EVENT_LABEL, cond: 'once'});
  ppx_resume();
};

const ppx_resume = (): void => {
  const [width, height] = cache.circular.get();
  PPx.Execute(`*windowposition %N${cache.ppcid},${width},${height}`);
};

const getPPcId = (): string => {
  const id = PPx.Extract('%n#');

  return id ? `${id}#` : PPx.Extract('%n');
};

main();
