/* @file Register the shell command path as an environment variable
 * @arg 0+ {string} - Specify a shell command
 * @return - A path of the shell command
 */

import {validArgs} from '@ppmdev/modules/argument.ts';
import {registPath} from './mod/core.ts';

const main = (): string => {
  const args = validArgs();
  const success: string[] = [];

  for (let i = 0, k = args.length; i < k; i++) {
    const [errorlevel, path] = registPath(true, args[i]);

    if (errorlevel === 0) {
      success.push(`${args[i]}=${path}`);
    }
  }

  return success.join(',');
};

PPx.result = main();
