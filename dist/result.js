﻿var t={normal:0,readonly:1,hidden:2,system:4,volume:8,directory:16,archive:32,temporary:256,sparse:512,alias:1024,compressed:2048,offline:4096,noindex:8192},actualPaths=function(){for(var r,e=[],n=PPx.Entry.AllMark;!n.atEnd();n.moveNext())r=t.alias&PPx.Entry.Attributes?"%*linkedpath(%FDC)":"%FDC",e.push(PPx.Extract(r));return e},validArgs=function(){for(var t=[],r=PPx.Arguments;!r.atEnd();r.moveNext())t.push(r.value);return t},safeArgs=function(){for(var t=[],r=validArgs(),e=0,n=arguments.length;e<n;e++)t.push(_valueConverter(e<0||arguments.length<=e?undefined:arguments[e],r[e]));return t},_valueConverter=function(t,r){if(null==r||""===r)return null!=t?t:undefined;switch(typeof t){case"number":var e=Number(r);return isNaN(e)?t:e;case"boolean":return"false"!==r&&"0"!==r&&null!=r;default:return r}},r="---",main=function(){var t=safeArgs("",""),r=t[0],n=t[1],a="";try{a=e[r](n)}catch(o){var i=r.split("."),u=i.length,l=0;for(a=PPx;l<u;)a=u-1===l&&""!==n?a[i[l]](n):a[i[l]],l++}finally{return a}},e={exists:function(t){t=t||PPx.EntryName;var r=PPx.CreateObject("Scripting.FileSystemObject");return r.FileExists(t)||r.FolderExists(t)?"1":"0"},filetype:function(){return PPx.GetFileInformation(PPx.EntryName).slice(1)},LDC:function(){return actualPaths().join(" ")},lfitems:function(t){var r=t||"Name",e=[],n=PPx.Entry;n.FirstMark;do{e.push(n[r])}while(n.NextMark);return e.join(" ")},targetpath:function(){return PPx.Extract("%2")||PPx.Extract("%*getcust(S_ppm#user:work)")}},n=main();PPx.result=String(n)||r;
