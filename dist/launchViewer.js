﻿var t,e,r,n;Array.prototype.indexOf||(Array.prototype.indexOf=function(t,e){var r;if(null==this)throw new TypeError('Array.indexOf: "this" is null or not defined');var n=Object(this),o=n.length>>>0;if(0===o)return-1;var a=null!=e?e:0;if(Math.abs(a)===Infinity&&(a=0),a>=o)return-1;for(r=Math.max(a>=0?a:o-Math.abs(a),0);r<o;){if(r in n&&n[r]===t)return r;r++}return-1}),Object.keys||(Object.keys=(t=Object.prototype.hasOwnProperty,e=!{toString:null}.propertyIsEnumerable("toString"),n=(r=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"]).length,function(o){if("function"!=typeof o&&("object"!=typeof o||null==o))throw new TypeError("Object.keys: called on non-object");var a,i,p=[];for(a in o)t.call(o,a)&&p.push(a);if(e)for(i=0;i<n;i++)t.call(o,r[i])&&p.push(r[i]);return p}));var o={DOC:[".txt",".ini","log",".cfg",".html",".md",".json",".yml",".yaml",".toml",".js",".ts",".vbs",".vim",".lua"],IMAGE:[".jpg",".jpeg",".bmp",".png",".gif",".vch",".edg",".webp",".tif",".tiff"],MOVIE:[".3gp",".avi",".mp4",".mpg",".qt",".ebml",".webm"]},a=function(t){for(var e=0,r=Object.keys(o);e<r.length;e++){var n=r[e];if(~o[n].indexOf(t))return n}},i=function(t,e){var r=t?"B100000000":"B000000000",n=e+",KV_main:CLOSEEVENT";PPx.Execute("*setcust X_win:V="+r),PPx.Execute("*linecust "+n+",*setcust X_vpos=%*getcust(X_vpos)%%:*linecust "+n+",%%:*execute C,%(*maskentry%%:*jumppath -update -entry:%%R%)")};!function(){var t=PPx.Extract(".%t").toLowerCase(),e=PPx.Arguments.length>0?PPx.Arguments.Item(0).toUpperCase():a(t),r=PPx.windowIDName==="C_"+PPx.Extract("%*getcust(S_ppm#user:thumbppc)");if(!(PPx.DirectoryType>=63)||"MOVIE"!==e&&!PPx.Execute('%"launchPPv.ts"%Q"書庫内ファイルを開きます"'))if(e){var n,p=PPx.Extract('%*name(C,"%FC")'),c=(n=4===PPx.DirectoryType?"%FDVN":"%FDN",PPx.Extract(n).replace(/^aux:(\/\/)?[MS]_[^/\\]+[/\\]/,"")+"\\"+p);if("MOVIE"===e)PPx.Execute("%Obd *ppb -c mpv.exe "+c+" --framedrop=vo --geometry=%*windowrect(%N.,w)x%*windowrect(%N.,h)+%*windowrect(%N.,l)+%*windowrect(%N.,t) --loop=no "+c);else{i(r,"launchppv"),PPx.Execute("*setcust X_vpos=3"),PPx.Execute("%Oi *ppv -bootid:Z "+c);var u=r?"a:d-":"path:,"+o[e];PPx.Execute("*maskentry -temp "+u),PPx.Execute("*jumppath -update -entry:"+p)}}else PPx.Execute('%K"@^i"%:*wait 0,1%:*focus %G"TEIF|"%:%k"^q v"')}();