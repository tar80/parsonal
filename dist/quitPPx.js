﻿var windowID=function(){var r=PPx.Extract("%n"),e=r.replace(/^([CVB])([^_]+)$/,"$1_$2");return{id:r,uid:e}},r=function(){var r=windowID().uid;if("ignore"===r.replace(/^C.+[Aa]$/,"ignore")){var e=PPx.Extract("%*ppxlist(-)").slice(0,-1).split(",");r=e[e.indexOf(r)+1]||e[0]}return r}();PPx.Execute("*closeppx "+r);
