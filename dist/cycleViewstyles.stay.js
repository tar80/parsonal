﻿Array.prototype.indexOf||(Array.prototype.indexOf=function(e,t){var n;if(null==this)throw new Error('Array.indexOf: "this" is null or not defined');var r=Object(this),i=r.length>>>0;if(0===i)return-1;var a=null!=t?t:0;if(Math.abs(a)===Infinity&&(a=0),a>=i)return-1;for(n=Math.max(a>=0?a:i-Math.abs(a),0);n<i;){if(n in r&&r[n]===e)return n;n++}return-1});var ppx_Discard=function(e,t){var n;PPx.StayMode=0,t=null!=(n=t)?n:"","DEBUG"===e&&PPx.linemessage("[DEBUG] discard "+t)},e=["KC_main","KV_main","KV_img","KV_crt","KV_page","KB_edit","K_ppe","K_edit","K_lied"],_validTable=function(t){return~e.indexOf(t)?t:"KC_main"},_linecust=function(e,t,n){return"*linecust "+e+","+t+":"+n+","},_discard=function(e){return function(t){var n=t.table,r=t.label,i=t.mapkey,a=t.cond,c=void 0===a?"instantly":a,u=t.debug,l=void 0===u?"0":u,o=PPx.StayMode,s=PPx.Extract("%n"),x=PPx.Extract('%*name(C,"%FDV")'),P=_validTable(n),f=_linecust(""+r+s,P,e),d=_linecust(""+r+s,P,"CLOSEEVENT"),p={instantly:"",once:'*if("'+s+'"=="%n")%:',hold:'*if("'+s+'"=="%n")&&("'+x+'"!="%*name(C,"%FDV")")%:'},y=[f,d];i&&(PPx.Execute("*mapkey use,"+i),y.push("*mapkey delete,"+i)),y.push('*js ":'+o+',ppx_Discard",'+l+","+r),PPx.Execute(f+"%(*if %*stayinfo("+o+")%:"+p[c]+y.join("%:")+"%)"),PPx.Execute(d+"%("+p.once+d+"%:"+f+"%)"),PPx.Execute('*run -breakjob -nostartmsg -wait:no %0pptrayw.exe -c %%K"@LOADCUST"')}},getStaymodeId=function(e){e=~e.indexOf(".")?e.slice(0,e.indexOf(".")):e;var t=Number(PPx.Extract("%*getcust(S_ppm#staymode:"+e+")"));return!isNaN(t)&&t>1e4&&t},t=(_discard("ACTIVEEVENT"),_discard("LOADEVENT"),function(e){var t=0;return{get:function(){var n=e[t];return t=(t+1)%e.length,n},discard:_discard("LOADEVENT")}}),_setEvent=function(e,t,n,r,i){var a="*linecust "+n+","+_validTable(e),c=a+":"+t+",",u={instantly:"",once:'*if("%n"=="%%n")',hold:'*if("%n"=="%%n")&&("%FDV"=="%%FDV")'}[i];PPx.Execute(a+":"+t+","+u+"%%:"+c+"%%:"+r),PPx.Execute('%K"@LOADCUST"')},n="cycleViewstyles",r=getStaymodeId(n)||2,cache={},i={general:["サムネ小(&J)","サムネ中(&J)","サムネ欄(&J)",'format "'+PPx.Extract("%*viewstyle")+'"'],picture:["画像中(&I)","画像大(&I)","画像特(&I)"],listfile:["一覧(c&Omment)"],ftp:[],http:[]},main=function(){var e=PPx.Arguments.length>0?"C"+PPx.Arguments.Item(0):"",i=PPx.WindowIDName,a=PPx.DirectoryType;if(i===e&&(a=-1),a>=62)PPx.Execute("*viewstyle directory");else{PPx.StayMode=r;var c=getStyles(a);cache.dirtype=a,cache.circular=t(c),cache.circular.discard({table:"KC_main",label:n}),ppx_resume()}},ppx_resume=function(){PPx.Execute("*viewstyle -temp "+cache.circular.get())},getStyles=function(e){switch(e){case-1:return i.picture;case 4:return i.listfile;case 21:return i.ftp;case 80:return i.http;default:return i.general}};main();
