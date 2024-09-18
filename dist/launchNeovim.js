﻿var validArgs=function(){for(var t=[],e=PPx.Arguments;!e.atEnd();e.moveNext())t.push(e.value);return t},safeArgs=function(){for(var t=[],e=validArgs(),n=0,r=arguments.length;n<r;n++)t.push(_valueConverter(n<0||arguments.length<=n?undefined:arguments[n],e[n]));return t},_valueConverter=function(t,e){if(null==e||""===e)return null!=t?t:undefined;switch(typeof t){case"number":var n=Number(e);return isNaN(n)?t:n;case"boolean":return null!=e&&"false"!==e&&"0"!==e;default:return e}},isBottom=function(t){return null==t},t=1024,e=PPx.CreateObject("Scripting.FileSystemObject"),main=function(){var t=safeArgs(!1,"100","edit",undefined),e=t[0],r=t[1],i=t[2],u=t[3];if(!function(t){return/^(edit|args|diff|command)$/.test(t)}(i))return PPx.Echo("Invalid argument2:"+i),"-1";var a=n[i](u),f=a[0],l=a[1];if(!f)return PPx.linemessage('!"'+l),"-1";var c=e.toString(),o=exCmd(c,l);return PPx.Execute('*launch -noppb -hide nvim --server "\\\\.\\pipe\\nvim.'+r+'.0" '+o),"0"},getActualPath=function(e){return(e=PPx.Entry.Attributes&t?PPx.Extract("%*linkedpath("+e+")"):e).replace(/([^\\])\s/g,"$1\\ ")},extractPath=function(t){for(var n,r=t?t.replace(/\\\s/g," "):PPx.Extract("%#;FDCN"),i=t?2:PPx.EntryMarkCount,u=~r.indexOf(";")?";":" ",a=i<2?[r]:r.split(u),f=a.length,l=[],c=0;c<f;c++)if(n=a[c].replace(/"/g,""),e.FileExists(n))l.push(getActualPath(n));else{var o=!1;for(c++;c<f;c++)if(n=n+" "+a[c].replace(/"/g,""),e.FileExists(n)){l.push(getActualPath(n)),o=!0;break}if(!o)return[!1,"Failed to extract path"]}return[!0,l]},isError=function(t,e){return!t},n={edit:function(t){var e=extractPath(t),n=e[0],r=e[1];return isError(n)?[!1,r]:[!0,"edit "+r[0]]},args:function(t){var e=extractPath(t),n=e[0],r=e[1];return isError(n)?[!1,r]:[!0,PPx.EntryMarkCount>1?"args! "+r.join(" "):"edit "+r[0]]},diff:function(t){var e=null!=t?t:2===PPx.EntryMarkCount?PPx.Extract("%#;FDCN"):PPx.Extract("%FDCN")+";"+PPx.Extract("%~FDCN"),n=extractPath(e),r=n[0],i=n[1];return isError(r)?[!1,i]:[!0,"silent! edit "+i[1]+"|silent! vertical diffsplit "+i[0]]},command:function(t){return isBottom(t)?[!1,"Empty command line"]:[!0,t]}},exCmd=function(t,e){return{"false":'--remote-send "<Cmd>'+e+'<CR>"',"true":'--remote-send "<Cmd>stopinsert|tabnew|'+e+'<CR>"'}[t]};PPx.result=main();
