﻿var e,t,r,n;Array.prototype.indexOf||(Array.prototype.indexOf=function(e,t){var r;if(null==this)throw new TypeError('Array.indexOf: "this" is null or not defined');var n=Object(this),i=n.length>>>0;if(0===i)return-1;var p=null!=t?t:0;if(Math.abs(p)===Infinity&&(p=0),p>=i)return-1;for(r=Math.max(p>=0?p:i-Math.abs(p),0);r<i;){if(r in n&&n[r]===e)return r;r++}return-1}),Object.keys||(Object.keys=(e=Object.prototype.hasOwnProperty,t=!{toString:null}.propertyIsEnumerable("toString"),n=(r=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"]).length,function(i){if("function"!=typeof i&&("object"!=typeof i||null==i))throw new TypeError("Object.keys: called on non-object");var p,c,a=[];for(p in i)e.call(i,p)&&a.push(p);if(t)for(c=0;c<n;c++)e.call(i,r[c])&&a.push(r[c]);return a}));var i=PPx.CreateObject("Scripting.FileSystemObject"),p="\r\n",c={TypeToCode:{crlf:"\r\n",cr:"\r",lf:"\n"},CodeToType:{"\r\n":"crlf","\r":"cr","\n":"lf"},Ppx:{lf:"%%bl",cr:"%%br",crlf:"%%bn",unix:"%%bl",mac:"%%br",dos:"%%bn","\n":"%%bl","\r":"%%br","\r\n":"%%bn"},Ascii:{lf:"10",cr:"13",crlf:"-1",unix:"10",mac:"13",dos:"-1","\n":"10","\r":"13","\r\n":"-1"}},a=function(e,t){try{var r;return[!1,null!=(r=t())?r:""]}catch(n){return[!0,""]}finally{e.Close()}},o=function(e){var t=e.path,r=e.data,n=e.enc,o=void 0===n?"utf8":n,l=e.append,u=void 0!==l&&l,s=e.overwrite,P=void 0!==s&&s,f=e.linefeed,x=void 0===f?p:f;if(!P&&!u&&i.FileExists(t))return[!0,t+" already exists"];var d,v=i.GetParentFolderName(t);if(i.FolderExists(v)||PPx.Execute("*makedir "+v),"utf8"===o){if("ClearScriptV8"===PPx.ScriptEngineName){var m=r.join(x),b=u?"AppendAllText":"WriteAllText";return[!1,NETAPI.System.IO.File[b](t,m)]}var h=P||u?2:1,E=PPx.CreateObject("ADODB.Stream");d=a(E,(function(){E.Open(),E.Charset="UTF-8",E.LineSeparator=Number(c.Ascii[x]),u?(E.LoadFromFile(t),E.Position=E.Size,E.SetEOS):E.Position=0,E.WriteText(r.join(x),1),E.SaveToFile(t,h)}))[0]}else{var y=u?8:P?2:1;i.FileExists(t)||PPx.Execute("%Osq *makefile "+t);var O="utf16le"===o?-1:0,S=i.GetFile(t).OpenAsTextStream(y,O);d=a(S,(function(){S.Write(r.join(x)+x)}))[0]}return d?[!0,"Could not write to "+t]:[!1,""]},l="M_temp",u="PPe",s="PPeditW",P="-- =",f=function(){var e=PPx.Extract("%n"),t=e.replace(/^(C)([^_]+)$/,"$1_$2");return{id:e,uid:t}}(),x=f.uid,d=function(e){var t=PPx.Arguments.length>0?PPx.Arguments.Item(0):"";if(""===t||/^[BCV#]#?$/.test(t)){var r=PPx.Extract("%*ppxlist(-"+t+")").slice(0,-1).split(",");return r.sort((function(e,t){return e.toLowerCase()<t.toLowerCase()?-1:1})),"0"!==e&&r.push(u),r}},v=function(e,t){return PPx.Extract("%*extract("+e+',"'+t+'")').slice(-30).replace(/\\t/g,"\\\\t")},m=function(e,t){var r=e.length;return t&&r>0&&e.splice(0,0,P),t||r>0},b=function(e,t,r){for(var n={ppc:[],ppv:[],ppb:[],ppcust:[],ppe:[]},i=[],p=i[0],c=i[1],a=i[2],o=0;o<e;o++)if(a=(p=t[o]).substring(0,2),c=p.slice(-1),"C_"===a)n.ppc.push("PPc:&"+c+" "+v(p,"%%FD")+" = "+p);else if("V_"===a)n.ppv.push("PPv:&"+c+" "+v(p,"%%FC")+" = "+p);else if("B_"===a)n.ppb.push("PPb:&"+c+" "+v(p,"%%FD")+" = "+p);else if("cs"===a){var u=PPx.Extract('%*findwindowtitle("PPx Customizer")');n.ppcust.push("PPcust:&"+c+" = #"+u)}else"PP"===a&&n.ppe.push("PPe:&@ = #"+r);var s=m(n.ppv,0!==n.ppc.length);return s=m(n.ppb,s),s=m(n.ppcust,s),s=m(n.ppe,s),[l+"\t= {"].concat(n.ppc,n.ppv,n.ppb,n.ppcust,n.ppe,["}"])};!function(){var e=PPx.Extract("%*findwindowclass("+s+")"),t=d(e),r=function(){var e,t,r=PPx.ScriptName;return~r.indexOf("\\")?(e=r.replace(/^.*\\/,""),t=PPx.Extract("%*name(DKN,"+r+")")):(e=r,t=PPx.Extract("%FDN")),{scriptName:e,parentDir:t.replace(/\\$/,"")}}(),n=r.scriptName;t||(PPx.Echo(n+": 引数が不正"),PPx.Quit(-1)),~t.indexOf(x)&&t.splice(t.indexOf(x),1);var i,p=t.length;if(1===p)PPx.Execute("*selectppx "+t[0]);else if(p>1){var c=(i=PPx.Extract('%*extract(C,"%%*temp()")'),{dir:i,file:i+"_ppmtemp",lf:i+"_temp.xlf",stdout:i+"_stdout",stderr:i+"_stderr",ppmDir:function(){var e=PPx.Extract("%'temp'%\\ppm");return PPx.Execute("*makedir "+e),e}}).file,a=o({path:c,data:b(p,t,e),enc:"utf16le",linefeed:"\r\n",overwrite:!0}),u=a[0],P=a[1];u&&(PPx.Echo(n+": "+P),PPx.Quit(-1)),PPx.Execute("*setcust @"+c),PPx.Execute('%k"@down"%:*focus %'+l),PPx.Execute('*deletecust "'+l+'"'),PPx.Execute('%K"@LOADCUST"')}}();