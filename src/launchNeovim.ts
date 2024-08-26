/* @file Launch Neovim, depending on the situation.
 * @arg {number} 0 - Process existence of the Neovim. 0:false | -1:true
 * @arg {number} 1 - Vimserver port number
 * @arg {string} 2 - Edit-order. edit | args | diff | command
 * @arg {string} 3 - Optional commandLine
 * @return - Has Error. "-1"(true) | "0"(false)
 */

import {safeArgs} from '@ppmdev/modules/argument.ts';
import {isBottom} from '@ppmdev/modules/guard.ts';

type Bool = 'true' | 'false';
type ExOrder = 'edit' | 'args' | 'diff' | 'command';
type NvimOption = string | undefined;
type Ok_String = [boolean, string];

const ATT_ALIAS = 1024;
const fso = PPx.CreateObject('Scripting.FileSystemObject');

const main = (): '0' | '-1' => {
  const [proc, port, order, opt] = safeArgs(false, '100', 'edit', undefined);
  const isExOrder = (v: string): v is ExOrder => /^(edit|args|diff|command)$/.test(v);

  if (!isExOrder(order)) {
    PPx.Echo(`Invalid argument2:${order}`);

    return '-1';
  }

  const [ok, data] = editCmd[order](opt);

  if (!ok) {
    PPx.linemessage(`!"${data}`);
    return '-1';
  }

  const hasProc = proc.toString() as Bool;
  const cmdline = exCmd(hasProc, data);
  PPx.Execute(`*launch -noppb -hide nvim --server "\\\\.\\pipe\\nvim.${port}.0" ${cmdline}`);

  return '0';
};

const getActualPath = (path: string): string => {
  const isAlias = PPx.Entry.Attributes & ATT_ALIAS;
  path = isAlias ? PPx.Extract(`%*linkedpath(${path})`) : path;

  return path.replace(/([^\\])\s/g, '$1\\ ');
};

const extractPath = (option: NvimOption): [boolean, string | string[]] => {
  const pathString = option ? option.replace(/\\\s/g, ' ') : PPx.Extract('%#;FDCN');
  const markCount = !option ? PPx.EntryMarkCount : 2;
  const splitter = ~pathString.indexOf(';') ? ';' : ' ';
  const paths = markCount < 2 ? [pathString] : pathString.split(splitter);
  const len = paths.length;
  const actualPath: string[] = [];

  for (let i = 0, path: string; i < len; i++) {
    path = paths[i].replace(/"/g, '');

    if (fso.FileExists(path)) {
      actualPath.push(getActualPath(path));
    } else {
      let isExist = false;

      for (i++; i < len; i++) {
        path = `${path} ${paths[i].replace(/"/g, '')}`;

        if (fso.FileExists(path)) {
          actualPath.push(getActualPath(path));
          isExist = true;

          break;
        }
      }

      if (!isExist) {
        return [false, 'Failed to extract path'];
      }
    }
  }

  return [true, actualPath];
};

const isError = (ok: boolean, data: string | string[]): data is string => !ok;
const editCmd = {
  edit(option: NvimOption): Ok_String {
    const [ok, data] = extractPath(option);

    return isError(ok, data) ? [false, data] : [true, `edit ${data[0]}`];
  },
  args(option: NvimOption): Ok_String {
    const [ok, data] = extractPath(option);

    return isError(ok, data) ? [false, data] : [true, PPx.EntryMarkCount > 1 ? `args! ${data.join(' ')}` : `edit ${data[0]}`];
  },
  diff(option: NvimOption): Ok_String {
    const path = option ?? (PPx.EntryMarkCount === 2 ? PPx.Extract('%#;FDCN') : `${PPx.Extract('%FDCN')};${PPx.Extract('%~FDCN')}`);
    const [ok, data] = extractPath(path);

    return isError(ok, data) ? [false, data] : [true, `silent! edit ${data[1]}|silent! vertical diffsplit ${data[0]}`];
  },
  command(option: NvimOption): Ok_String {
    return isBottom(option) ? [false, 'Empty command line'] : [true, option];
  }
};

const exCmd = (hasProc: Bool, cmdline: string): string =>
  ({
    false: `--remote-send "<Cmd>${cmdline}<CR>"`,
    true: `--remote-send "<Cmd>stopinsert|tabnew|${cmdline}<CR>"`
  })[hasProc];

PPx.result = main();
