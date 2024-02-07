/* @file Popup context menu by extension
 * @arg 0 {object} - Shortcut key at cursor position
 * JSON style argument format
 * "{dir:'D',arc:'A',img:'I',doc:'D',list:'L',arch:'A',aux:'A',none:'N'}"
 */

import '@ppmdev/polyfills/stringTrim.ts';
import '@ppmdev/polyfills/stringPrecedes.ts';
import '@ppmdev/polyfills/arrayIndexOf.ts';
import '@ppmdev/polyfills/arrayIncludes.ts';
import '@ppmdev/polyfills/arrayIsArray.ts';
import '@ppmdev/polyfills/arrayRemoveEmpty.ts';
import '@ppmdev/polyfills/objectKeys.ts';
import '@ppmdev/polyfills/objectIsEmpty.ts';
import '@ppmdev/polyfills/json.ts';
import type {} from '@ppmdev/modules/types.ts';
import {} from '@ppmdev/parsers/table.ts';
import {} from '@ppmdev/modules/ansi.ts';
import {} from '@ppmdev/modules/data.ts';
import {} from '@ppmdev/modules/filesystem.ts';
import {} from '@ppmdev/modules/git.ts';
import {isEmptyStr} from '@ppmdev/modules/guard.ts';
import {} from '@ppmdev/modules/io.ts';
import {} from '@ppmdev/modules/meta.ts';
import {} from '@ppmdev/modules/path.ts';
import {} from '@ppmdev/modules/ppm.ts';
import {} from '@ppmdev/modules/run.ts';
import {} from '@ppmdev/modules/source.ts';
import {} from '@ppmdev/modules/window.ts';
import {} from '@ppmdev/modules/util.ts';
import debug from '@ppmdev/modules/debug.ts';

const main = (): void => {
  type HotKey = Readonly<typeof hotKey>;
  const hotKey = adjustArgs();
  const getContext = (keys: HotKey): {type: string; letter: string} => {
    const filetype = PPx.GetFileInformation(PPx.Entry.Name) === ':DIR' ? 'DIR' : PPx.Extract('%t').toUpperCase();

    for (const item of Object.keys(items)) {
      if (~items[item as Item].indexOf(filetype as never)) {
        return {type: item, letter: keys[item as Item]};
      }
    }

    return {type: 'none', letter: keys['none']};
  };

  switch (dirType()) {
    case 'AUX':
      PPx.Execute(`%M_Caux,${hotKey.aux}`);
      break;

    case 4:
      {
        const context = getContext(hotKey);
        PPx.Execute(`*setcust M_Clist:Ext=??M_U${context.type}%:%M_Clist,${hotKey.list}`);
      }
      break;

    case 62:
    case 63:
    case 64:
      PPx.Execute(`%M_Carc,${hotKey.arch}`);
      break;

    case 80:
      PPx.Execute('%M_Chttp');
      break;

    case 96:
      PPx.Execute(`%M_Carc,${hotKey.arch}`);
      break;

    default:
      {
        const context = getContext(hotKey);
        PPx.Execute(`*setcust M_Ccr:Ext=??M_U${context.type}%:%M_Ccr,${context.letter}`);
      }
      break;
  }
};

type Item = keyof typeof items;
const items = {
  dir: ['DIR'],
  arc: ['7Z', 'CAB', 'LZH', 'MSI', 'RAR', 'ZIP'],
  img: ['BMP', 'EDG', 'GIF', 'JPEG', 'JPG', 'PNG', 'VCH'],
  doc: ['AHK', 'INI', 'CFG', 'JS', 'JSON', 'LOG', 'LUA', 'MD', 'TOML', 'TXT', 'TS', 'VIM', 'YAML', 'YML']
} as const;

const adjustArgs = (args = PPx.Arguments) => {
  let obj = {dir: 'W', arc: 'W', img: 'L', doc: 'R', list: 'J', arch: 'O', aux: 'C', none: 'R'};

  if (args.length > 0) {
    obj = {...obj, ...JSON.parse(args.Item(0))};
  }

  return obj;
};

const dirType = () => {
  let type: string | number = PPx.DirectoryType;

  if (type === 4 && !isEmptyStr(PPx.Extract('%si"RootPath"'))) {
    type = 'AUX';
  }

  return type;
};

main();
