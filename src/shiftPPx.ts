/* @file Select on next PPx
 * @arg 0 {number} - If non-zero, reverse order
 * @arg 1 {number} - If non-zero, activate the opposite window when a single pane
 * @arg 2 {number} - If non-zero, toggle focus between PPc and synced PPv
 * @arg 3 {number} - If non-zero, ignore tabs. valid only if each pane is an independent tab
 * @arg 4 {number} - If non-zero, ignore PPc
 * @arg 5 {number} - If non-zero, ignore PPv
 * @arg 6 {number} - If non-zero, ignore PPb
 */

import '@ppmdev/polyfills/arrayIndexOf.ts';
import {windowID} from '@ppmdev/modules/util.ts';

const main = (): void => {
  const args = adjustArgs();
  const win = getIDs();

  //syncview
  if (args.syncview !== '0' && args.ignoreppv === '0') {
    const isSync = PPx.Extract(`%*extract(C,"%%*js(""PPx.result=PPx.SyncView;"")")`);

    if (isSync !== '0') {
      PPx.Execute(`*selectppx ${win.pairid}`);

      return;
    }
  }

  const idlist = getList(args);
  let nextID = idlist[idlist.indexOf(win.id) + 1] || idlist[0];

  //opposite window
  if (PPx.Pane.Count === 1 && args.ignoreppc === '0' && args.opwin !== '0' && win.id === nextID) {
    PPx.Execute('%K"@TAB"');

    return;
  }

  //tabs
  if (args.ignoreppc === '0' && args.ignoretab !== '0') {
    const hasSeparate = PPx.Extract('%*getcust(X_combos)').slice(18, 19);

    if (hasSeparate === '1') {
      nextID = tabID(idlist, win.id, nextID);
    }
  }

  PPx.Execute(`*selectppx ${nextID}`);
};

type ArgsKeys = 'order' | 'opwin' | 'syncview' | 'ignoretab' | 'ignoreppc' | 'ignoreppv' | 'ignoreppb';
type Args = {[key in ArgsKeys]: string};
const adjustArgs = (args = PPx.Arguments): Args => {
  const arr: string[] = ['0', '0', '0', '0', '0', '0'];

  for (let i = 0, k = args.length; i < k; i++) {
    arr[i] = args.Item(i);
  }

  return {
    order: arr[0],
    opwin: arr[1],
    syncview: arr[2],
    ignoretab: arr[3],
    ignoreppc: arr[4],
    ignoreppv: arr[5],
    ignoreppb: arr[6]
  };
};

const getIDs = () => {
  PPx.windowIDName = '1';
  const {id, uid} = windowID();
  const xid = uid.split('_');
  const pairid = xid[0].indexOf('C') === 0 ? 'V' : 'C';

  return {id, pairid, subid: xid[1]};
};

const getList = (args: Args): string[] => {
  const c = args.ignoreppc === '0' ? PPx.Extract('%*ppxlist(-C)') : '';
  const v = args.ignoreppv === '0' ? PPx.Extract('%*ppxlist(-V)') : '';
  const b = args.ignoreppb === '0' ? PPx.Extract('%*ppxlist(-B)') : '';
  const list = `${c}${v}${b}`.slice(0, -1).replace(/_/g, '').split(',');
  // const sorter = args.order === '0' ? [-1, 1] : [1, -1];
  // list.sort((a, b) => (a < b ? sorter[0] : sorter[1]));

  return list;
};

const tabExtract = (target: number): string[] => {
  const skipTabs: string[] = [];
  // @ts-ignore
  const tabs = PPx.Pane.item(target).Tab;
  const currentIdname = tabs(-1).IDName;
  let idname: string;

  for (let i = 0, k = tabs.length; i < k; i++) {
    idname = tabs(i).IDName;
    idname !== currentIdname && skipTabs.push(idname);
  }

  return skipTabs;
};

const tabID = (list: string[], currentid: string, nextid: string): string => {
  let skipID = tabExtract(-2);

  if (PPx.Pane.Count > 0 && ~skipID.indexOf(nextid)) {
    return PPx.Extract('%~n');
  }

  skipID = tabExtract(-3);

  let id: string;

  for (let i = list.indexOf(currentid) + 1, k = list.length; i < k; i++) {
    id = list[i];

    if (!~skipID.findIndex((v) => v === id)) {
      return id;
    }
  }

  return nextid;
};

main();
