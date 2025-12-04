/* @file Launch a viewer considering file extension
 * @arg 0 {string} - Specify filetype. "doc" | "image" | "movie"
 * @arg 1 {string} - Specify Image-specific PPcID
 */

import '@ppmdev/polyfills/arrayIndexOf.ts';
import '@ppmdev/polyfills/objectKeys.ts';
import {safeArgs} from '@ppmdev/modules/argument.ts';
import {entryAttribute} from '@ppmdev/modules/meta.ts';
import {expandSource} from '@ppmdev/modules/source.ts';
import {ppvCmdline} from './mod/core.ts';

const DEBUG_MODE = '';

type ExtTypes = keyof typeof EXT;
const EXT = {
  doc: ['.txt', '.ini', 'log', '.cfg', '.html', '.md', '.json', '.yml', '.yaml', '.toml', '.js', '.ts', '.vbs', '.vim', '.lua'],
  image: ['.jpg', '.jpeg', '.bmp', '.png', '.gif', '.vch', '.edg', '.webp', '.tif', '.tiff'],
  movie: ['.3gp', '.avi', '.mp4', '.mpg', '.qt', '.ebml', '.webm']
};
const USER_ID = 'launchViewer';
const PPV_ID = 'Z';
const PPV_POS = '3';
const WORKER_PPV = 'workerPPv.stay.js';

const main = (): void => {
  const fileext = PPx.Extract('.%t').toLowerCase();
  const [reftype, imgspec] = safeArgs(getExtentions(fileext), '');

  if (PPx.DirectoryType >= 63) {
    if (reftype === 'movie' || !!PPx.Execute(`%"${USER_ID}"%Q"書庫内ファイルを開きます"`)) {
      return;
    }
  }

  if (!reftype) {
    PPx.Execute(`%K"@^i"%:*wait 0,1%:*focus %G"TEIF|"%:%k"^q v"`);

    return;
  }

  const filename = PPx.Extract('%*name(CN,"%FCN")');
  const filepath = `${getParent()}\\${filename}`;

  reftype === 'movie' ? startMpv(filepath) : startPPv(reftype, imgspec, filepath, filename);
};

const getExtentions = (ext: string): string | undefined => {
  for (const id of Object.keys(EXT)) {
    if (~EXT[id as ExtTypes].indexOf(ext)) {
      return id;
    }
  }

  return;
};

const getParent = (): string => (entryAttribute.alias & PPx.Entry.Attributes ? '%*name(D,"%*linkedpath(%FNDC)")' : '%FND');

const startMpv = (filepath: string): void => {
  PPx.Execute(
    `%Obd *ppb -c mpv.exe "${filepath}"` +
      ' --framedrop=vo --geometry=%*windowrect(%N.,w)x%*windowrect(%N.,h)+%*windowrect(%N.,l)+%*windowrect(%N.,t)' +
      ` --loop=no "${filepath}"`
  );
};

const startPPv = (reftype: string, imgspec: string, filepath: string, filename: string): void => {
  const ppmviewDir = expandSource('ppm-view')?.path;

  if (!ppmviewDir) {
    PPx.linemessage('[ERROR] ppm-viewのパスを取得できませんでした');
  }

  const onImgSpec: boolean = PPx.Extract('%n') === `C${imgspec}`;
  let mask: string;

  if (onImgSpec) {
    mask = 'a:d-';
    const launchOpts = '-nostartmsg -wait:idle -max';
    PPx.Execute(`*launch ${launchOpts} %0ppvw.exe -bootid:${PPV_ID} ${ppvCmdline(filepath)}`);
  } else {
    mask = `path:,${EXT[reftype as ExtTypes]}`;
    const winpos = PPx.Extract(`%*getcust(_WinPos:V${PPV_ID})`);
    const savepos = PPx.Extract('%*getcust(X_vpos)');
    const launchOpts = '-nostartmsg -wait:idle -noppb -hide';
    const postCmdline = [`*script ${ppmviewDir}\\dist\\${WORKER_PPV},0,,,"${winpos}",${DEBUG_MODE}`, `*setcust X_vpos=${savepos}`];
    PPx.Execute(`*setcust X_vpos=${PPV_POS}`);
    PPx.Execute(`*launch ${launchOpts} %0ppvw.exe -bootid:${PPV_ID} -k %(${postCmdline.join('%:')}%)%%:%%v"${filepath}"`);
  }

  const linecust = `*linecust ${USER_ID},KV_main:CLOSEEVENT`;
  PPx.Execute(`${linecust},${linecust},%%:%(*execute C,*maskentry%%:*jumppath -update -entry:%%R%)`);
  PPx.Execute(`*maskentry -temp ${mask}`);
  PPx.Execute(`*jumppath -update -entry:${filename}`);
};

main();
