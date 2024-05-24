/* @file Extract the PDF file as a virtual directory
 * @arg 0 {string} - Specify the PDF file path
 * @arg 1 {number} - Specify the maximum number of pages
 */

import fso from '@ppmdev/modules/filesystem.ts';
import {read, writeLines} from '@ppmdev/modules/io.ts';

const GS = 'gswin64c.exe';
const CMD = `-dSAFER -dBATCH -dNOPAUSE -sDEVICE=png16m -r400 -dTextAlphaBits=4 -dDownScaleFactor=2`;
const UPPER_LIMIT = 99;

const main = (): void => {
  const args = adjustArgs();
  const cwd = PPx.Extract('%FD');
  const path = args.path || PPx.Extract('%FDC');
  const last = args.last || UPPER_LIMIT;
  const tempDir = getDirPath(path);

  if (PPx.GetFileInformation(path) !== ':PDF') {
    PPx.linemessage('Not a PDF file');
    return;
  }

  let [error, data] = read({path});

  if (error) {
    PPx.linemessage('Could not read file');
    return;
  }

  const pages = pageNumber(data, last);

  if (pages === 0) {
    PPx.linemessage('Could not get page number');
    return;
  }

  const filenames = getFilenames(pages);
  const list = [';ListFile', `;Base=${tempDir}`, cwd, ...filenames];
  const lfPath = `${tempDir}\\page`;

  if (!fso.FileExists(lfPath)) {
    [error, data] = writeLines({path: lfPath, data: list});

    if (error) {
      PPx.linemessage('Failed to write ListFile');
      return;
    }

    PPx.Execute(
      `%On *cd ${tempDir}%:*ppb -c %(${GS} ${CMD} -dFirstPage=1 -dLastPage=${pages} -sOutputFile="%%03d" "${path}"%)`
    );
  }

  PPx.Execute(`*jumppath ${lfPath}`);
};

const adjustArgs = (args = PPx.Arguments): {path?: string; last?: number} => {
  const arr: [string?, number?] = [];

  for (let i = 0, k = args.length; i < k; i++) {
    arr[i] = args.Item(i);
  }

  return {path: arr[0], last: arr[1]};
};

const getDirPath = (path: string): string => {
  const pwd = PPx.Extract('%*temp()');
  const name = PPx.Extract(`%*name(X,"${path}")`);

  return `${pwd}${name}`;
};

const pageNumber = (data: string, last: number | undefined): number => {
  const rgx = /Type\s*\/Page[^s]/g;
  const matches = data.match(rgx);
  if (!matches) {
    return 0;
  }

  const count = matches.length;

  return last ? Math.min(last, count) : count;
};

const getFilenames = (count: number): typeof arr => {
  const arr: string[] = [];

  for (let i = 0; i < count; i++) {
    arr.push(`00${i + 1}`.slice(-3));
  }

  return arr;
};

main();
