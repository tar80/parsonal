/* @file Closed considering ID */

const ppxID = (() => {
  let id = PPx.windowIDName;

  if (id === 'C_A') {
    const idList = PPx.Extract('%*ppxlist(-)').split(',');
    idList.sort((a, b) => (a < b ? 1 : -1));
    id = idList[0];
  }

  return id;
})();
const syncviewHwnd = Number(PPx.Extract('%*extract(C,"%%*js(PPx.result=PPx.SyncView;)")'));

if (syncviewHwnd !== 0) {
  PPx.Execute('*execute C,*ppvoption sync off');
  PPx.Quit(1);
}

// ppxID === 'C_X' && PPx.Execute('*customize XC_celD=%su"c_celD"');
PPx.Execute(`*closeppx ${ppxID}`);
