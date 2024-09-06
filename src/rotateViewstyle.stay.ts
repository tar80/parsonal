/* @file Rotate ViewStyle
 * @arg 0 {string} - Specify the ID for thumbnail PPc
 */

import {circular} from '@ppmdev/modules/staymode.ts';

const UNIQ_ID = 'rotateViewstyle';

type Cache = {dirtype: number; circular: ReturnType<typeof circular>};
const cache = {} as Cache;

const STYLE = {
  general: ['サムネ小(&J)', 'サムネ中(&J)', 'サムネ欄(&J)', `format "${PPx.Extract('%*viewstyle')}"`],
  picture: ['画像中(&I)', '画像大(&I)', '画像特(&I)'],
  listfile: ['一覧(c&Omment)'],
  ftp: [],
  http: []
};

const main = (): void => {
  const pictppc = PPx.Arguments.length > 0 ? `C_${PPx.Arguments.Item(0)}` : '';
  const ppxid = PPx.WindowIDName;
  let dirtype = PPx.DirectoryType;

  if (ppxid === pictppc) {
    dirtype = -1;
  }

  if (dirtype >= 62) {
    PPx.Execute('*viewstyle directory');

    return;
  }

  PPx.StayMode = 2;
  const styles = getStyles(dirtype);
  cache.dirtype = dirtype;
  cache.circular = circular(styles);
  cache.circular.discard({table: 'KC_main', label: UNIQ_ID, cond: 'once'});
  ppx_resume();
};

const ppx_resume = (): void => {
  PPx.Execute(`*viewstyle -temp ${cache.circular.get()}`);
};

const getStyles = (list: number): string[] => {
  switch (list) {
    case -1:
      return STYLE['picture'];
    case 4:
      return STYLE['listfile'];
    case 21:
      return STYLE['ftp'];
    case 80:
      return STYLE['http'];
    default:
      return STYLE['general'];
    // return styleSpec(list);
  }
};

main();
