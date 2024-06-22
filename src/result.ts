/* @file Returns the specified value
 * @arg 0 {string} - Specify field name. exists | filetype | ldc | lfitems | targetname
 * @arg 1 {string} - Optional
 * @return - Specified value or CASE_EMPTY
 */

import {actualPaths} from '@ppmdev/modules/path.ts';
import {safeArgs} from '@ppmdev/modules/argument.ts';
import debug from '@ppmdev/modules/debug.ts';

const CASE_EMPTY = '---';

const main = (): string => {
  const [spec, opt] = safeArgs('', '');
  let rep: string | PPx = '';

  try {
    rep = cmd[spec](opt);
  } catch (err) {
    const ele = spec.split('.');
    const len = ele.length;
    let i = 0;
    rep = PPx;
    while (i < len) {
      if (len - 1 === i && opt !== '') {
        // @ts-ignore
        rep = rep[ele[i]](opt);
      } else {
        rep = rep[ele[i] as never];
      }
      i++;
    }
  } finally {
    debug.log(rep);

    return rep as string;
  }
};

const cmd: Record<string, Function> = {};

// %FDCなど複数回パスを送りたいときは引数で指定する
cmd['exists'] = (path: string) => {
  path = path || PPx.EntryName;
  const fso = PPx.CreateObject('Scripting.FileSystemObject');

  return fso.FileExists(path) || fso.FolderExists(path) ? '1' : '0';
};

cmd['filetype'] = () => PPx.GetFileInformation(PPx.EntryName).slice(1);

cmd['LDC'] = () => actualPaths().join(' ');

type id = keyof typeof entry;

// listfileのエントリ情報を返す
// 第2引数指定可 (指定なし=Name)
// ※返すパスはスペース区切りの複数のパス
cmd['lfitems'] = (prop?: id) => {
  const prop_ = prop || 'Name';

  let items = [];
  const item = PPx.Entry;
  item.FirstMark;

  do {
    items.push(item[prop_]);
  } while (item.NextMark);

  return items.join(' ');
};

cmd['targetpath'] = () => PPx.Extract('%2') || PPx.Extract('%*getcust(S_ppm#user:work)');

const value = main();
PPx.result = String(value) || CASE_EMPTY;
