import debug from '@ppmdev/modules/debug.ts';
import fso from '@ppmdev/modules/filesystem.ts';
import {isEmptyStr} from '@ppmdev/modules/guard.ts';
import {runStdout} from '@ppmdev/modules/run.ts';
import type {Level_String} from '@ppmdev/modules/types.ts';

const _rgx1 = /^(.+)\..+$/;
const _rgx2 = /^path\s=\s"?([^"]+)"?$/;
const shimToPath = (name: string): Level_String => {
  let [errorlevel, path] = runStdout({cmdline: `where.exe ${name} 2>nul`, startmsg: false, hide: true, trim: true, utf8: false});

  if (errorlevel === 0 && !isEmptyStr(path)) {
    if (path.indexOf('\\shims\\')) {
      const path3 = path.replace(_rgx1, '$1.shim');

      if (fso.FileExists(path3)) {
        const data = PPx.Extract(`%*insertValue(${path3})`);

        if (!isEmptyStr(data)) {
          path = data.replace(_rgx2, '$1');
        }
      }
    }

    return [0, path];
  }

  return [-1, name];
};

/** Extract the actual command path from the application compatibility (shim) */
export const registPath = (isAlias: boolean, name: string): Level_String => {
  {
    const path = PPx.Extract(`%g'${name}'`);

    if (!isEmptyStr(path)) {
      return [-1, path];
    }
  }

  const [errorlevel, path] = shimToPath(name);

  if (isAlias) {
    errorlevel === 0 && PPx.Execute(`*alias ${name}=${path}`);
  } else {
    PPx.Execute(`*set ${name.toUpperCase()}=${path}`);
  }

  return [errorlevel, path];
};

export const ppvCmdline = (path: string): string => {
  if (/^.+\.txt$/.test(path)) {
    const [errorlevel, filetype] = runStdout({cmdline: `"${registPath(false, 'nkf')}" -g "${path}"`, hide: true, trim: true, utf8: false});

    if (errorlevel === 0) {
      switch (filetype) {
        case 'UTF-8':
          return `-utf8 "${path}"`;
        case 'UTF-16':
          return `-utf16 "${path}"`;
      }
    }
  }

  return `"${path}"`;
};
