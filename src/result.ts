/* @file Returns the specified value
 * @arg 0 {string} - Specify field name. exists, filetype, ldc, lfitems, targetname
 * @arg 0 {string} - Optional
 * @return - Specified value or CASE_EMPTY
 */

import {actualPaths} from '@ppmdev/modules/path.ts';

const CASE_EMPTY = '---';

const main = (): string => {
  const args = adjustArgs();
  let rep = '';

  try {
    rep = cmd[args.spec](args.option);
  } catch (err) {
    rep = PPx[args.spec as never];
  } finally {
    return rep;
  }
};

const adjustArgs = (args = PPx.Arguments): {spec: string; option: string} => {
  const arr: string[] = ['', ''];

  for (let i = 0, k = args.length; i < k; i++) {
    arr[i] = args.Item(i);
  }

  return {spec: arr[0], option: arr[1]};
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

cmd['targetpath'] = () => PPx.Extract(PPx.Pane.Count === 2 ? '%2' : 'S_ppm#user:work');

const value = main();
PPx.result = String(value) || CASE_EMPTY;
