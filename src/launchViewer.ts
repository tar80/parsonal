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
  const onImgSpec: boolean = PPx.WindowIDName === `C_${imgspec}`;

  if (PPx.DirectoryType >= 63) {
    if (reftype === 'MOVIE' || !!PPx.Execute(`%"${USER_ID}"%Q"書庫内ファイルを開きます"`)) {
      return;
    }
  }

  if (!reftype) {
    PPx.Execute(`%K"@^i"%:*wait 0,1%:*focus %G"TEIF|"%:%k"^q v"`);

    return;
  }

  const filename = PPx.Extract('%*name(CN,"%FCN")');
  const path = `${getParent()}\\${filename}`;

  if (reftype === 'MOVIE') {
    PPx.Execute(
      `%Obd *ppb -c mpv.exe "${path}"` +
        ' --framedrop=vo --geometry=%*windowrect(%N.,w)x%*windowrect(%N.,h)+%*windowrect(%N.,l)+%*windowrect(%N.,t)' +
        ` --loop=no "${path}"`
    );
  } else {
    const ppmviewDir = expandSource('ppm-view')?.path;

    if (!ppmviewDir) {
      PPx.linemessage('[ERROR] ppm-viewのパスを取得できませんでした');
    }

    let mask: string;

    if (onImgSpec) {
      mask = 'a:d-';
      PPx.Execute(`*launch -max -nostartmsg -wait:idle %0ppvw.exe -bootid:${PPV_ID} ${ppvCmdline(path)}`);
    } else {
      mask = `path:,${EXT[reftype as ExtTypes]}`;
      const winpos = PPx.Extract(`%*getcust(_WinPos:V${PPV_ID})`);
      const savepos = PPx.Extract('%*getcust(X_vpos)');
      const launchOpts = '-nostartmsg -noppb -hide -wait:idle';
      const postCmdline = [`*script ${ppmviewDir}\\dist\\${WORKER_PPV},0,,,"${winpos}",${DEBUG_MODE}`, `*setcust X_vpos=${savepos}`];
      PPx.Execute(`*setcust X_vpos=${PPV_POS}`);
      PPx.Execute(`*launch ${launchOpts} %0ppvw.exe -bootid:${PPV_ID} -k %(${postCmdline.join('%:')}%)%%:%%v"${path}"`);
    }

    const linecust = `*linecust ${USER_ID},KV_main:CLOSEEVENT`;
    PPx.Execute(`${linecust},${linecust},%%:%(*execute C,*maskentry%%:*jumppath -update -entry:%%R%)`);
    PPx.Execute(`*maskentry -temp ${mask}`);
    PPx.Execute(`*jumppath -update -entry:${filename}`);
  }
};

const getExtentions = (ext: string): string | undefined => {
  for (const id of Object.keys(EXT)) {
    if (~EXT[id as ExtTypes].indexOf(ext)) {
      return id;
    }
  }

  return;
};

const getParent = (): string => (entryAttribute.alias & PPx.Entry.Attributes ? '%*linkedpath(%FD)' : '%FD');

main();
