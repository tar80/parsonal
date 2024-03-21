/* @file Call new PPx
 * @arg 0 {string} - Type of PPx. 'C' | 'V'
 */

import {isEmptyStr} from '@ppmdev/modules/guard.ts';
import {tmp} from '@ppmdev/modules/data.ts';

type PPxType = 'C' | 'V';

const main = (): void => {
  const id = PPx.Arguments.length ? PPx.Arguments.Item(0) : PPx.windowIDName.substring(0, 1);
  jump[id as PPxType]();
};

const jump = {
  C() {
    const id = nextId('C', 'ABCDEFGHIJKLMNOPQRSTUVWYZ');

    return PPx.Execute(`*ppc -single -mps -bootid:${id} %FD -k %%J"%R"`);
  },
  V() {
    const id = nextId('V', 'DEFGHIJKLMNOPQRSTUVW');
    const path = PPx.Extract('%FDC');

    return PPx.Execute(`*ppv -bootid:${id} ${ftoption(path)} ${path}`);
  }
} as const;

const nextId = (id: PPxType, letters: string): string => {
  for (let i = 0, k = letters.length; i < k; i++) {
    if (isEmptyStr(PPx.Extract(`%N${id}${letters[i]}`))) {
      return letters[i];
    }
  }

  return 'Z';
};

const ftoption = (path: string) => {
  const stdout = tmp().stdout;
  PPx.Execute(`%Obds nkf -g ${path}>${stdout}`);
  const filetype = PPx.Extract(`%*insertValue(${stdout})`);

  switch (filetype) {
    case 'UTF-8':
      return '-utf8';
    case 'UTF-16':
      return '-utf16';
    default:
      return '';
  }
};

main();
