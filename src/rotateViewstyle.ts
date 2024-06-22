/* @file Rotate ViewStyle
 * @arg 0 {string} - Specify the ID for thumbnail PPc
 */

import {isEmptyStr} from '@ppmdev/modules/guard.ts';

const UNIQ_ID = 'rotateViewstyle';
const ORIGIN_STYLE = 'originViewstyle';

type StyleName = keyof typeof STYLE;
const STYLE = {
  general: ['サムネ小(&J)', 'サムネ中(&J)', 'サムネ欄(&J)'],
  picture: ['画像中(&I)', '画像大(&I)', '画像特(&I)'],
  listfile: ['一覧(c&Omment)'],
  ftp: [],
  http: []
};

const ppxid = PPx.windowIDName;
const main = (): void => {
  const pictppc = PPx.Arguments.length > 0 ? `C_${PPx.Argument(0)}` : '';
  const dirType = Number(PPx.DirectoryType);
  const listType = ppxid === pictppc ? -1 : dirType;

  if (listType >= 62) {
    PPx.Execute('*viewstyle directory');

    return;
  }

  const styleData = PPx.Extract(`%sgu"${ORIGIN_STYLE}${ppxid}"`);
  const orgStyle = styleData.slice(2);
  const noData = isEmptyStr(styleData);
  let nextNumber = noData ? 0 : Number(styleData.slice(0, 1));

  const styles = getStyles(listType);
  let viewstyle = `"${styles?.[nextNumber]}"`;

  if (viewstyle === '"undefined"') {
    nextNumber = 0;
    viewstyle = orgStyle;
  } else {
    nextNumber = nextNumber + 1;
  }

  if (noData) {
    PPx.Execute(`*string u,${ORIGIN_STYLE}${ppxid}=${nextNumber}|format "%*viewstyle()"`);
    deleteEvent('LOADEVENT');
    deleteEvent('CLOSEEVENT');
  } else {
    PPx.Execute(`*string u,${ORIGIN_STYLE}${ppxid}=${nextNumber}|${orgStyle}`);
  }

  PPx.Execute(`*viewstyle -temp ${viewstyle}`);
};

const deleteEvent = (event: 'LOADEVENT' | 'CLOSEEVENT'): void => {
  PPx.Execute(
    `*linecust ${UNIQ_ID}${ppxid},KC_main:${event},` +
      `*if ("%%n"=="%n")%%:*deletecust _User:${ORIGIN_STYLE}${ppxid}` +
      `%%:*linecust ${UNIQ_ID}${ppxid},KC_main:LOADEVENT,` +
      `%%:*linecust ${UNIQ_ID}${ppxid},KC_main:CLOSEEVENT,`
  );
};

// const styleSpec = (name: StyleName | number) => {
//   if (typeof name === 'number') {
//     name = (name >= 62 ? 'archive' : 'general') as StyleName;
//   }

//   return STYLE[name];
// };

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
