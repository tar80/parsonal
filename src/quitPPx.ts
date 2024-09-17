/* @file Closed considering ID */

import {windowID} from '@ppmdev/modules/util.ts';

const ppxID = (() => {
  let {uid} = windowID();
  const ignoreID = uid.replace(/^C.+[Aa]$/, 'ignore');

  if (ignoreID === 'ignore') {
    const idlist = PPx.Extract('%*ppxlist(-)').slice(0, -1).split(',');
    // idList.sort((a, b) => (a < b ? 1 : -1));
    uid = idlist[idlist.indexOf(uid) + 1] || idlist[0];
  }

  return uid;
})();

PPx.Execute(`*closeppx ${ppxID}`);
