/* @file Launch Neovim, depending on the situation.
 * @arg {number} 0 - Process existence of the Neovim. 0:false | -1:true
 * @arg {number} 1 - Vimserver port number
 * @arg {string} 2 - Edit-order. edit | args | diff | command
 * @arg {string} 3 - Optional commandLine
 * @return - Has Error. "-1"(true) | "0"(false)
 */

'use strict';

type Bool = '0' | '-1';
type ExOrder = 'edit' | 'args' | 'diff' | 'command';
type Nvim = {process: Bool; port: string; order: ExOrder; option: string | undefined};
type Ok_String = [boolean, string];

const ATT_ALIAS = 1024;
const fso = PPx.CreateObject('Scripting.FileSystemObject');

const main = (): Bool => {
  const nvim = adjustArgs();

  if (!nvim) {
    return '-1';
  }

  const [ok, data] = editCmd[nvim.order](nvim);

  if (!ok) {
    PPx.linemessage(`!"${data}`);
    return '-1';
  }

  const cmdline = exCmd(nvim.process, data);
  PPx.Execute(`*launch -noppb -hide nvim --server "\\\\.\\pipe\\nvim.${nvim.port}.0" ${cmdline}`);

  return '0';
};

const adjustArgs = (args = PPx.Arguments): Nvim | void => {
  const arr: [string, string, string, string | undefined] = ['0', '100', 'edit', undefined];
  const isBool = (v: string): v is Bool => /0|-1/.test(v);
  const isExOrder = (v: string): v is ExOrder => /^(edit|args|diff|command)$/.test(v);

  for (let i = 0, k = args.length; i < k; i++) {
    arr[i] = args.Item(i);
  }

  if (!isBool(arr[0])) {
    PPx.Echo(`Wrong value passed. arg0:${arr[0]}`);
    return;
  }

  if (!isExOrder(arr[2])) {
    arr[2] !== '' && PPx.Echo(`Wrong value passed. arg2:${arr[2]}`);
    return;
  }

  return {process: arr[0], port: arr[1], order: arr[2], option: arr[3]};
};

const getActualPath = (path: string): string => {
  const file = fso.GetFile(path);
  const isAlias = file.Attributes & ATT_ALIAS;
  path = isAlias ? PPx.Extract(`%*linkedpath(${path})`) : path;

  return path.replace(/([^\\])\s/g, '$1\\ ');
};

const extractPath = (option: string | undefined): [boolean, string | string[]] => {
  const pathString = option ? option.replace(/\\\s/g, ' ') : PPx.Extract('%#;FDCN');
  const markCount = !option ? PPx.EntryMarkCount : 2;
  const splitter = ~pathString.indexOf(';') ? ';' : ' ';
  const paths = markCount < 2 ? [pathString] : pathString.split(splitter);
  const len = paths.length;
  const actualPath: string[] = [];

  for (let i = 0, path; i < len; i++) {
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
        return [false, `Failed to extract path`];
      }
    }
  }

  return [true, actualPath];
};

const isError = (ok: boolean, data: string | string[]): data is string => !ok;
const editCmd = {
  edit({option}: Nvim): Ok_String {
    const [ok, data] = extractPath(option);

    return isError(ok, data) ? [false, data] : [true, `edit ${data[0]}`];
  },
  args({option}: Nvim): Ok_String {
    const [ok, data] = extractPath(option);

    return isError(ok, data)
      ? [false, data]
      : [true, PPx.EntryMarkCount > 1 ? `args! ${data.join(' ')}` : `edit ${data[0]}`];
  },
  diff({option}: Nvim): Ok_String {
    const path =
      option ??
      (PPx.EntryMarkCount === 2 ? PPx.Extract('%#;FDCN') : `${PPx.Extract('%FDCN')};${PPx.Extract('%~FDCN')}`);
    const [ok, data] = extractPath(path);

    return isError(ok, data) ? [false, data] : [true, `silent! edit ${data[1]}|silent! vertical diffsplit ${data[0]}`];
  },
  command({option}: Nvim): Ok_String {
    return option == null ? [false, 'Empty command line'] : [true, option];
  }
};

const exCmd = (process: Bool, cmdline: string): string =>
  ({
    '0': `--remote-send "<Cmd>${cmdline}<CR>"`,
    '-1': `--remote-send "<Cmd>stopinsert|tabnew|${cmdline}<CR>"`
  })[process];

PPx.result = main();
