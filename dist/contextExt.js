﻿function t(){return t=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)({}).hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},t.apply(null,arguments)}var e,r,n,o;!function(){if("object"!=typeof JSON){JSON={};var t,e,r,n,o=/^[\],:{}\s]*$/,u=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,f=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,i=/(?:^|:|,)(?:\s*\[)+/g,c=/[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,a=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+s(this.getUTCMonth()+1)+"-"+s(this.getUTCDate())+"T"+s(this.getUTCHours())+":"+s(this.getUTCMinutes())+":"+s(this.getUTCSeconds())+"Z":"Invalid Date"}),"function"!=typeof JSON.stringify&&(r={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},JSON.stringify=function(r,o,u){var f;if(t="",e="","number"==typeof u)for(f=0;f<u;f+=1)e+=" ";else"string"==typeof u&&(e=u);if(n=o,o&&"function"!=typeof o&&("object"!=typeof o||"number"!=typeof o.length))throw new Error("JSON.stringify");return p("",{"":r})}),"function"!=typeof JSON.parse&&(JSON.parse=function(t,e){var r;if(t=String(t),a.lastIndex=0,a.test(t)&&(t=t.replace(a,(function(t){return"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)}))),o.test(t.replace(u,"@").replace(f,"]").replace(i,"")))return r=Function("return ("+t+")")(),"function"==typeof e?function n(t,r){var o,u,f=t[r];if(f&&"object"==typeof f)for(o in f)Object.prototype.hasOwnProperty.call(f,o)&&((u=n(f,o))!==undefined?f[o]=u:delete f[o]);return e.call(t,r,f)}({"":r},""):r;throw new Error("JSON.parse")})}function s(t){return t<10?"0"+t:t}function l(t){return c.lastIndex=0,c.test(t)?'"'+t.replace(c,(function(t){var e=r[t];return"string"==typeof e?e:"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)}))+'"':'"'+t+'"'}function p(r,o){var u,f,i,c,a,s=t,y=o[r];switch(y&&"object"==typeof y&&"function"==typeof y.toJSON&&(y=y.toJSON(r)),"function"==typeof n&&(y=n.call(o,r,y)),typeof y){case"string":return l(y);case"number":return isFinite(y)?String(y):"null";case"boolean":return String(y);case"object":if(!y)return"null";if(t+=e,a=[],"[object Array]"===Object.prototype.toString.apply(y)){for(c=y.length,u=0;u<c;u+=1)a[u]=p(String(u),y)||"null";return i=0===a.length?"[]":t?"[\n"+t+a.join(",\n"+t)+"\n"+s+"]":"["+a.join(",")+"]",t=s,i}if(n&&"object"==typeof n)for(c=n.length,u=0;u<c;u+=1)"string"==typeof n[u]&&(i=p(f=String(n[u]),y))&&a.push(l(f)+(t?": ":":")+i);else for(f in y)Object.prototype.hasOwnProperty.call(y,f)&&(i=p(f,y))&&a.push(l(f)+(t?": ":":")+i);return i=0===a.length?"{}":t?"{\n"+t+a.join(",\n"+t)+"\n"+s+"}":"{"+a.join(",")+"}",t=s,i}return"null"}}(),Object.keys||(Object.keys=(e=Object.prototype.hasOwnProperty,r=!{toString:null}.propertyIsEnumerable("toString"),o=(n=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"]).length,function(t){if("function"!=typeof t&&("object"!=typeof t||null==t))throw new TypeError("Object.keys: called on non-object");var u,f,i=[];for(u in t)e.call(t,u)&&i.push(u);if(r)for(f=0;f<o;f++)e.call(t,n[f])&&i.push(n[f]);return i}));var u={dir:["DIR"],arc:["7Z","CAB","LZH","MSI","RAR","ZIP"],img:["BMP","EDG","GIF","JPEG","JPG","PNG","VCH"],doc:["AHK","INI","CFG","JS","JSON","LOG","LUA","MD","TOML","TXT","TS","VIM","YAML","YML"]},f=function(){var e={dir:"W",arc:"W",img:"L",doc:"R",list:"J",arch:"O",aux:"C",none:"R"};return PPx.Arguments.length>0&&(e=t({},e,JSON.parse(PPx.Argument(0)))),e},i=function(){var t=PPx.DirectoryType;return 4===t&&""!==PPx.Extract('%si"RootPath"')&&(t="AUX"),t};!function(){var t=f(),e=function(t){for(var e=":DIR"===PPx.GetFileInformation(PPx.Entry.Name)?"DIR":PPx.Extract("%t").toUpperCase(),r=0,n=Object.keys(u);r<n.length;r++){var o=n[r];if(~u[o].indexOf(e))return{type:o,letter:t[o]}}return{type:"none",letter:t.none}};switch(i()){case"AUX":PPx.Execute("%M_Caux,"+t.aux);break;case 4:var r=e(t);PPx.Execute("*setcust M_Clist:Ext=??M_U"+r.type+"%:%M_Clist,"+t.list);break;case 62:case 63:case 64:case 96:PPx.Execute("%M_Carc,"+t.arch);break;case 80:PPx.Execute("%M_Chttp");break;default:var n=e(t);PPx.Execute("*setcust M_Ccr:Ext=??M_U"+n.type+"%:%M_Ccr,"+n.letter)}}();
