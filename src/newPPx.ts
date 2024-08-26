/* @file Call new PPx
 * @arg 0 {string} - Type of PPx. 'C' | 'V'
 */

import {safeArgs} from '@ppmdev/modules/argument.ts';
import {isEmptyStr} from '@ppmdev/modules/guard.ts';
import {ppvCmdline} from './mod/core.ts';

type xUi = 'C' | 'V';

const main = (): void => {
  const [ui] = safeArgs(PPx.WindowIDName.substring(0, 1));
  jump[ui as xUi]();
};

const jump = {
  C() {
    const id = nextId('C', 'ABCDEFGHIJKLMNOPQRSTUVWYZ');

    return PPx.Execute(`*ppc -single -mps -bootid:${id} %FD -k %%J"%R"`);
  },
  V() {
    const id = nextId('V', 'DEFGHIJKLMNOPQRSTUVW');
    const path = PPx.Extract('%FDCN');

    return PPx.Execute(`*ppv -bootid:${id} ${ppvCmdline(path)}`);
  }
} as const;

const nextId = (id: xUi, letters: string): string => {
  for (let i = 0, k = letters.length; i < k; i++) {
    if (isEmptyStr(PPx.Extract(`%N${id}${letters[i]}`))) {
      return letters[i];
    }
  }

  return 'Z';
};

main();
