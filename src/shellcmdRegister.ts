/* @file Register the shell command path as an environment variable
 * @arg 0 {string} - Specify a shell command
 * @return - A path of the shell command
 */

import {validArgs} from '@ppmdev/modules/argument.ts';
import {registPath} from './mod/core.ts';

const main = (): string => {
  const [name] = validArgs();

  if (!name) {
    PPx.report('[WARN] shellcmdRegister.js: argument is not specified');
    PPx.Quit(-1);
  }

  return registPath(false, name)[1];
};

PPx.result = main();
