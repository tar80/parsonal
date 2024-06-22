/* @file Personal *selectppx
 * @arg 0 {string} - Specify option. Same as %*ppxlist option
 */

import '@ppmdev/polyfills/arrayIndexOf.ts';
import '@ppmdev/polyfills/objectKeys.ts';
import {info} from '@ppmdev/modules/data.ts';
import {isEmptyStr} from '@ppmdev/modules/guard.ts';
import {writeLines} from '@ppmdev/modules/io.ts';
import {pathSelf} from '@ppmdev/modules/path.ts';
import {windowID} from '@ppmdev/modules/util.ts';
import {tmp} from '@ppmdev/modules/data.ts';
import {safeArgs} from '@ppmdev/modules/argument.ts';

const NAME = {MENU: 'M_temp', PPE: 'PPe', PPE_CLASS: 'PPeditW', SEP: '-- ='};
const {uid} = windowID();

const main = (): void => {
  const hwndE = PPx.Extract(`%*findwindowclass(${NAME.PPE_CLASS})`);
  const sortedID = sortPPxID(hwndE);
  const {scriptName} = pathSelf();

  if (!sortedID) {
    PPx.Echo(`${scriptName}: 引数が不正`);
    PPx.Quit(-1);
  }

  ~sortedID.indexOf(uid) && sortedID.splice(sortedID.indexOf(uid), 1);
  const idCount = sortedID.length;

  if (idCount === 1) {
    PPx.Execute(`*selectppx ${sortedID[0]}`);
  } else if (idCount > 1) {
    const path = tmp().file;
    const [error, errorMsg] = writeLines({
      path,
      data: createMenu(idCount, sortedID, hwndE),
      enc: 'utf16le',
      linefeed: info.nlcode,
      overwrite: true
    });

    if (error) {
      PPx.Echo(`${scriptName}: ${errorMsg}`);
      PPx.Quit(-1);
    }

    PPx.Execute(`*setcust @${path}`);
    PPx.Execute(`%k"@down"%:*focus %${NAME.MENU}`);
    PPx.Execute(`*deletecust "${NAME.MENU}"`);
    PPx.Execute('%K"@LOADCUST"');
  }
};

const sortPPxID = (hwndE: string): string[] | void => {
  const [opt] = safeArgs('');
  const rgx = /^[BCV#]#?$/;

  if (!isEmptyStr(opt) && !rgx.test(opt)) {
    return;
  }

  const ids = PPx.Extract(`%*ppxlist(-${opt})`).slice(0, -1).split(',');
  ids.sort((a, b) => (a.toLowerCase() < b.toLowerCase() ? -1 : 1));
  hwndE !== '0' && ids.push(NAME.PPE);

  return ids;
};

const buildFileName = (id: string, macro: string): string =>
  PPx.Extract(`%*extract(${id},"${macro}")`).slice(-30).replace(/\\t/g, '\\\\t');
const addSeparator = (items: string[], need: boolean): boolean => {
  const len = items.length;

  if (need && len > 0) {
    items.splice(0, 0, NAME.SEP);
  }

  return need || len > 0;
};

type Commands = 'ppc' | 'ppv' | 'ppb' | 'ppcust' | 'ppe';
type Items = {[key in Commands]: string[]};
const createMenu = (count: number, ids: string[], hwndE: string): string[] => {
  const items: Items = {ppc: [], ppv: [], ppb: [], ppcust: [], ppe: []};
  let [id, key, target]: string[] = [];

  for (let i = 0; i < count; i++) {
    id = ids[i];
    target = id.substring(0, 2);
    key = id.slice(-1);

    if (target === 'C_') {
      items.ppc.push(`PPc:&${key} ${buildFileName(id, '%%FD')} = ${id}`);
    } else if (target === 'V_') {
      items.ppv.push(`PPv:&${key} ${buildFileName(id, '%%FC')} = ${id}`);
    } else if (target === 'B_') {
      items.ppb.push(`PPb:&${key} ${buildFileName(id, '%%FD')} = ${id}`);
    } else if (target === 'cs') {
      const hwndCS = PPx.Extract('%*findwindowtitle("PPx Customizer")');
      items.ppcust.push(`PPcust:&${key} = #${hwndCS}`);
    } else if (target === 'PP') {
      items.ppe.push(`PPe:&@ = #${hwndE}`);
    }
  }

  let hasSep = addSeparator(items.ppv, items.ppc.length !== 0);
  hasSep = addSeparator(items.ppb, hasSep);
  hasSep = addSeparator(items.ppcust, hasSep);
  hasSep = addSeparator(items.ppe, hasSep);

  return [`${NAME.MENU}	= {`, ...items.ppc, ...items.ppv, ...items.ppb, ...items.ppcust, ...items.ppe, '}'];
};

main();
