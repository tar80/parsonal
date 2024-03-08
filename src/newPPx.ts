/* @file Call new PPx
 * @arg 0 {string} - Type of PPx. 'C' | 'V'
 */

import fso from '@ppmdev/modules/filesystem.ts';
import {isEmptyStr} from '@ppmdev/modules/guard.ts';

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

    return PPx.Execute(`*ppv -bootid:${id}${cursorEntry()}`);
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

const cursorEntry = (): string => {
  const text = PPx.Extract('%*selecttext()');
  const rgx = /^([^:,]*)[:,]?(\d+)?.*/;
  let [path, line] = text.replace(rgx, '$1,$2').split(',');
  path = PPx.Extract(`%*extract(C,"%%*name(DC,""${path}"")")`);
  line = isEmptyStr(line) ? '' : ` -k *jumpline L${line}`;

  if (fso.FileExists(path)) {
    return ` "${path}"${line}`;
  }

  return ' "%R"';
};

main();
