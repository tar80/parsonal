/* @file Launch Neovim, depending on the situation.
 * @arg {number} 0 - Process existence of the Neovim. 0:false | -1:true
 * @arg {number} 1 - Vimserver port number
 * @arg {string} 2 - Edit-order. edit | args | diff | command
 * @arg {string} 3 - Optional commandLine
 */

'use strict';

type Bool = '0' | '-1';
type ExOrder = 'edit' | 'args' | 'diff' | 'command';
type Nvim = {process: Bool; port: string; order: ExOrder; option: string | undefined};
type OkString = [boolean, string];

const main = (): void => {
  const nvim = adjustArgs();
  const [ok, data] = editCmd[nvim.order](nvim);

  if (!ok) {
    return PPx.linemessage(`!"${data}`);
  }

  const cmdline = exCmd(nvim.process, data);
  PPx.Execute(`%Obd nvim --server "\\\\.\\pipe\\nvim.${nvim.port}.0" ${cmdline}`);
};

const adjustArgs = (args = PPx.Arguments): Nvim => {
  const arr: [string, string, string, string | undefined] = ['0', '100', 'edit', undefined];
  const isBool = (v: string): v is Bool => /0|-1/.test(v);
  const isExOrder = (v: string): v is ExOrder => /^(edit|args|diff|command)$/.test(v);

  for (let i = 0, k = args.length; i < k; i++) {
    arr[i] = args.Item(i);
  }

  if (!isBool(arr[0])) {
    throw new Error(`Wrong value passed. arg0:${arr[0]}`);
  }

  if (!isExOrder(arr[2])) {
    throw new Error(`Wrong value passed. arg2:${arr[2]}`);
  }

  return {process: arr[0], port: arr[1], order: arr[2], option: arr[3]};
};

const extractPath = (option: string | undefined): [boolean, string | string[]] => {
  const pathString = option || PPx.Extract('%#;FDCN');
  const markCount = !option ? PPx.EntryMarkCount : 2;
  const splitter = ~pathString.indexOf(';') ? ';' : ' ';
  const paths = markCount < 2 ? [pathString] : pathString.split(splitter);
  const len = paths.length;
  const actualPath: string[] = [];

  const fso = PPx.CreateObject('Scripting.FileSystemObject');

  for (let i = 0, path; i < len; i++) {
    path = PPx.Extract(`%*linkedpath(${paths[i]})`) || paths[i];

    if (!fso.FileExists(path)) {
      for (i++; i < len; i++) {
        path = PPx.Extract(`%*linkedpath(${path} ${paths[i]})`) || `${path} ${paths[i]}`;

        if (fso.FileExists(path)) {
          break;
        }
      }

      return [false, `Failed to extract path`];
    }

    actualPath.push(path);
  }

  return [true, actualPath];
};

const isError = (ok: boolean, data: string | string[]): data is string => !ok;
const editCmd = {
  edit({option}: Nvim): OkString {
    const [ok, data] = extractPath(option);

    return isError(ok, data) ? [false, data] : [true, `edit ${data[0]}`];
  },
  args({option}: Nvim): OkString {
    const [ok, data] = extractPath(option);

    return isError(ok, data)
      ? [false, data]
      : [true, PPx.EntryMarkCount > 1 ? `args! ${data.join(' ')}` : `edit ${data[0]}`];
  },
  diff({option}: Nvim): OkString {
    const path =
      option ??
      (PPx.EntryMarkCount === 2 ? PPx.Extract('%#;FDCN') : `${PPx.Extract('%FDCN')};${PPx.Extract('%~FDCN')}`);
    const [ok, data] = extractPath(path);

    return isError(ok, data) ? [false, data] : [true, `silent! edit ${data[1]}|silent! vertical diffsplit ${data[0]}`];
  },
  command({option}: Nvim): OkString {
    return option == null ? [false, 'Empty command line'] : [true, option];
  }
};

const exCmd = (process: Bool, cmdline: string): string =>
  ({
    '0': `--remote-send "<Cmd>${cmdline}<CR>"`,
    '-1': `--remote-send "<Cmd>stopinsert|tabnew|${cmdline}<CR>"`
  })[process];

main();
