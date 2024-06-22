/* @file Launch a viewer considering file extension
 * @arg? 0 {string} - Specify filetype. "doc" | "image" | "movie"
 */

import '@ppmdev/polyfills/arrayIndexOf.ts';
import '@ppmdev/polyfills/objectKeys.ts';
import {actualParentDirectory} from '@ppmdev/modules/util.ts';

type ExtTypes = keyof typeof EXT;
const EXT = {
  doc: [ '.txt', '.ini', 'log', '.cfg', '.html', '.md', '.json', '.yml', '.yaml', '.toml', '.js', '.ts', '.vbs', '.vim', '.lua' ],
  image: ['.jpg', '.jpeg', '.bmp', '.png', '.gif', '.vch', '.edg', '.webp', '.tif', '.tiff'],
  movie: ['.3gp', '.avi', '.mp4', '.mpg', '.qt', '.ebml', '.webm']
};
const USER_ID = 'launchppv';
const PPV_ID = 'Z';
const PPV_POS = '3';

const main = (): void => {
  const fileext = PPx.Extract('.%t').toLowerCase();
  const reftype: string | void =
    PPx.Arguments.length > 0 ? PPx.Argument(0).toUpperCase() : getExtentions(fileext);
  const onThumb: boolean = PPx.windowIDName === `C_${PPx.Extract('%*getcust(S_ppm#user:thumbppc)')}`;

  if (PPx.DirectoryType >= 63) {
    if (reftype === 'MOVIE' || !!PPx.Execute('%"launchPPv.ts"%Q"書庫内ファイルを開きます"')) {
      return;
    }
  }

  if (!reftype) {
    PPx.Execute(`%K"@^i"%:*wait 0,1%:*focus %G"TEIF|"%:%k"^q v"`);

    return;
  }

  const filename = PPx.Extract('%*name(C,"%FC")');
  const path = `${actualParentDirectory()}\\${filename}`;

  if (reftype === 'MOVIE') {
    PPx.Execute(
      `%Obd *ppb -c mpv.exe "${path}"` +
        ' --framedrop=vo --geometry=%*windowrect(%N.,w)x%*windowrect(%N.,h)+%*windowrect(%N.,l)+%*windowrect(%N.,t)' +
        ` --loop=no "${path}"`
    );
  } else {
    setupPPv(onThumb, USER_ID);
    PPx.Execute(`*setcust X_vpos=${PPV_POS}`);
    PPx.Execute(`%Oi *ppv -bootid:${PPV_ID} ${path}`);

    const mask = onThumb ? 'a:d-' : `path:,${EXT[reftype as ExtTypes]}`;
    PPx.Execute(`*maskentry -temp ${mask}`);
    PPx.Execute(`*jumppath -update -entry:${filename}`);
  }
};

const getExtentions = (ext: string): string | void => {
  for (const id of Object.keys(EXT)) {
    if (~EXT[id as ExtTypes].indexOf(ext)) {
      return id;
    }
  }
};

const setupPPv = (onThumb: boolean, label: string): void => {
  const xwin = onThumb ? 'B100000000' : 'B000000000';
  const labelID = `${label},KV_main:CLOSEEVENT`;

  PPx.Execute(`*setcust X_win:V=${xwin}`);
  PPx.Execute(
    `*linecust ${labelID},*setcust X_vpos=%*getcust(X_vpos)%%:*linecust ${labelID},%%:` +
      `*execute C,%(*maskentry%%:*jumppath -update -entry:%%R%)`
  );
};

main();
