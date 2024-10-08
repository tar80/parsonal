/* @file Waits until WezTerm is started
 * @arg 0 {string} - Specify the process name
 * @arg 1 {number} - Specify the waiting time (default: 6000)
 * @arg 2 {number} - Specify PPb id
 * @return - "-1"(true) if the process has been started when the script is executed
 *
 * NOTE: Check for process startup approximately every 500 milliseconds.
 *  If you set the wait time to 0, the process will be checked only once and then terminated.
 */

import {safeArgs} from '@ppmdev/modules/argument.ts';
import debug from '@ppmdev/modules/debug.ts';
import {isEmptyStr} from '@ppmdev/modules/guard.ts';
import {pathSelf} from '@ppmdev/modules/path.ts';

const WAIT_MSEC = 6000;
const LOOP_MSEC = 500;

const main = (): void => {
  const [proc, limit, ppbid] = safeArgs(undefined, WAIT_MSEC, 'W');

  if (proc == null) {
    const {scriptName, parentDir} = pathSelf();
    PPx.Execute(`*script ${parentDir}\\errors.js",arg,${scriptName}`);
    PPx.Quit(-1);
  }

  const weztermCmd = isEmptyStr(PPx.Extract(`%NB${ppbid}`))
    ? '*launch -noppb -hide -nostartmsg wezterm start'
    : `*execute B${ppbid},wezterm cli spawn`;
  const processName = /^.+\.exe$/i.test(proc) ? proc : PPx.Extract(proc);

  if (!~processName.indexOf(':')) {
    PPx.Echo('[ERROR] Process name must be a full-path or alias');
    PPx.Quit(-1);
  }

  let hasProcess = processRunning(processName);
  PPx.result = hasProcess;

  if (limit > 0 && !hasProcess) {
    PPx.Execute(`${weztermCmd} ${processName}`);

    let [i, s, e, w] = [0, 0, 0, LOOP_MSEC];

    do {
      i = i + LOOP_MSEC;
      PPx.Execute(`*wait ${w - Math.floor(w / 10)},2`);

      if (i >= limit) {
        PPx.linemessage('!"Abort. Waiting time exceeded');
        break;
      }

      s = new Date().getTime();
      hasProcess = processRunning(processName);
      e = new Date().getTime();

      if (hasProcess) {
        break;
      }

      w = LOOP_MSEC - (e - s);
    } while (true);
  }
};

const processRunning = (procName: string): boolean => {
  const process = PPx.Extract(`%*useapps(${procName})`);

  return !isEmptyStr(process);
};

main();
