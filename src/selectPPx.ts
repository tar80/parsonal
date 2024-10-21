/* @file Personal *selectppx
 * @arg 0 {string} - Specify option. Same as %*ppxlist option
 * @arg 1 {string} - Specify the ID of PPb built into the terminal emulator
 * @arg 2 {string} - Speify terminal emulator name. "wt" | "wezterm"
 */

import '@ppmdev/polyfills/arrayIndexOf.ts';
import '@ppmdev/polyfills/objectKeys.ts';
import {validArgs} from '@ppmdev/modules/argument.ts';
import {info} from '@ppmdev/modules/data.ts';
import {tmp} from '@ppmdev/modules/data.ts';
import {isEmptyStr} from '@ppmdev/modules/guard.ts';
import {writeLines} from '@ppmdev/modules/io.ts';
import {pathSelf} from '@ppmdev/modules/path.ts';
import {windowID} from '@ppmdev/modules/util.ts';

const NAME = {MENU: 'M_temp', PPE: 'PPe', PPE_CLASS: 'PPeditW', SEP: '-- ='};
const {uid} = windowID();

const main = (): void => {
  const [opt, ppbid, emulator] = validArgs();
  const hwndE = PPx.Extract(`%*findwindowclass(${NAME.PPE_CLASS})`);
  const sortedID = sortPPxID(hwndE, opt);
  const {scriptName} = pathSelf();

  if (!sortedID) {
    PPx.Echo(`${scriptName}: ${PPx.Extract('%*errormsg(10022)')}`);
    PPx.Quit(-1);
  }

  ~sortedID.indexOf(uid) && sortedID.splice(sortedID.indexOf(uid), 1);
  const idCount = sortedID.length;

  if (idCount === 1) {
    const [_name, cmdline] = focusPPb(sortedID[0], ppbid, emulator);
    PPx.Execute(cmdline);
  } else if (idCount > 1) {
    const path = tmp().file;
    const [error, errorMsg] = writeLines({
      path,
      data: createMenu(idCount, sortedID, hwndE, ppbid, emulator),
      enc: 'utf16le',
      linefeed: info.nlcode,
      overwrite: true
    });

    if (error) {
      PPx.Echo(`${scriptName}: ${errorMsg}`);
      PPx.Quit(-1);
    }

    PPx.Execute(`*setcust @${path}`);
    PPx.Execute(`%k"@down"%:*execute ,%${NAME.MENU}`);
    PPx.Execute(`*deletecust "${NAME.MENU}"`);
    PPx.Execute('%K"@LOADCUST"');
  }
};

const sortPPxID = (hwndE: string, opt = ''): string[] | void => {
  const rgx = /^[BCV#]#?$/;

  if (!isEmptyStr(opt) && !rgx.test(opt)) {
    return;
  }

  const ids = PPx.Extract(`%*ppxlist(-${opt})`).slice(0, -1).split(',');
  ids.sort((a, b) => (a.toLowerCase() < b.toLowerCase() ? -1 : 1));
  hwndE !== '0' && ids.push(NAME.PPE);

  return ids;
};

const buildFileName = (id: string, macro: string): string => PPx.Extract(`%*extract(${id},"${macro}")`).slice(-30);
const addSeparator = (items: string[], need: boolean): boolean => {
  const len = items.length;

  if (need && len > 0) {
    items.splice(0, 0, NAME.SEP);
  }

  return need || len > 0;
};

const focusPPb = (sortID: string, ppbid: string, emulator: string): string[] => {
  if (ppbid && emulator && sortID === `B_${ppbid}`) {
    if (emulator === 'wt') {
      return [emulator, '*focus #%*findwindowclass(cascadia_hosting_window_class)'];
    } else if (emulator === 'wezterm') {
      return [
        emulator,
        `*execute B${ppbid},printf "\\033]1337;SetUserVar=focus=UFBC\\007"`
      ];
    }
  }

  return ['console', `*focus ${sortID}`];
};

type Commands = 'ppc' | 'ppv' | 'ppb' | 'ppcust' | 'ppe';
type Items = {[key in Commands]: string[]};
const createMenu = (count: number, ids: string[], hwndE: string, ppbid: string, emulator: string): string[] => {
  const items: Items = {ppc: [], ppv: [], ppb: [], ppcust: [], ppe: []};
  let [id, key, target]: string[] = [];

  for (let i = 0; i < count; i++) {
    id = ids[i];
    target = id.substring(0, 2);
    key = id.slice(-1);

    if (target === 'C_') {
      items.ppc.push(`PPc:&${key}\\t${buildFileName(id, '%%FD')} = *focus ${id}`);
    } else if (target === 'V_') {
      items.ppv.push(`PPv:&${key}\\t${buildFileName(id, '%%FC')} = *focus ${id}`);
    } else if (target === 'B_') {
      const [name, cmdline] = focusPPb(id, ppbid, emulator);
      items.ppb.push(`PPb:&${key}\\t<${name}> = ${cmdline}`);
    } else if (target === 'cs') {
      const hwndCS = PPx.Extract('%*findwindowtitle("PPx Customizer")');
      items.ppcust.push(`PPcust:&${key}\\t<customizer> = *focus #${hwndCS}`);
    } else if (target === 'PP') {
      items.ppe.push(`PPe:&@\\t<editor>= *focus #${hwndE}`);
    }
  }

  let hasSep = addSeparator(items.ppv, items.ppc.length !== 0);
  hasSep = addSeparator(items.ppb, hasSep);
  hasSep = addSeparator(items.ppcust, hasSep);
  hasSep = addSeparator(items.ppe, hasSep);

  return [`${NAME.MENU}	= {`, ...items.ppc, ...items.ppv, ...items.ppb, ...items.ppcust, ...items.ppe, '}'];
};

main();
