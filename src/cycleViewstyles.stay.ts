/* @file Rotate ViewStyle
 * @arg 0 {string} - Specify the ID for thumbnail PPc
 */

import {circular, getStaymodeId} from '@ppmdev/modules/staymode.ts';

const EVENT_LABEL = 'cycleViewstyles';
const STAYMODE_ID = getStaymodeId(EVENT_LABEL) || 2;

type Cache = {dirtype: number; circular: ReturnType<typeof circular>};
const cache = {} as Cache;

const main = (): void => {
  PPx.WindowIDName = '1';
  const pictppc = PPx.Arguments.length > 0 ? `C${PPx.Arguments.Item(0)}` : '';
  const ppxid = PPx.WindowIDName;
  let dirtype = PPx.DirectoryType;

  if (ppxid === pictppc) {
    dirtype = -1;
  }

  if (dirtype >= 62) {
    PPx.Execute('*viewstyle directory');

    return;
  }

  PPx.StayMode = STAYMODE_ID;

  const styles = getStyles(dirtype);
  cache.dirtype = dirtype;
  cache.circular = circular(styles);
  cache.circular.discard({table: 'KC_main', label: EVENT_LABEL});
  ppx_resume();
};

const ppx_resume = (): void => {
  PPx.Execute(`*viewstyle -temp ${cache.circular.get()}`);
};

const getStyles = (list: number): string[] => {
  switch (list) {
    case -1:
      return ['画像大(&I)', '画像特(&I)', '画像小(&I)'];
    case 4:
      return ['一覧(c&Omment)'];
    case 21:
      return [];
    case 80:
      return [];
    default:
      return ['サムネ小(&J)', 'サムネ中(&J)', 'サムネ欄(&J)', `format "${PPx.Extract('%*viewstyle')}"`];
    // return styleSpec(list);
  }
};

main();
