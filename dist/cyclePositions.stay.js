﻿Array.prototype.indexOf||(Array.prototype.indexOf=function(t,n){var e;if(null==this)throw new Error('Array.indexOf: "this" is null or not defined');var r=Object(this),i=r.length>>>0;if(0===i)return-1;var a=null!=n?n:0;if(Math.abs(a)===Infinity&&(a=0),a>=i)return-1;for(e=Math.max(a>=0?a:i-Math.abs(a),0);e<i;){if(e in r&&r[e]===t)return e;e++}return-1});var ppx_Discard=function(t,n){var e;PPx.StayMode=0,n=null!=(e=n)?e:"","DEBUG"===t&&PPx.linemessage("[DEBUG] discard "+n)},t=["KC_main","KV_main","KV_img","KV_crt","KV_page","KB_edit","K_ppe","K_edit","K_lied"],_validTable=function(n){return~t.indexOf(n)?n:"KC_main"},_linecust=function(t,n,e){return"*linecust "+t+","+n+":"+e+","},_discard=function(t){return function(n){var e=n.table,r=n.label,i=n.mapkey,a=n.cond,c=void 0===a?"instantly":a,o=n.debug,u=void 0===o?"0":o,x=PPx.StayMode,P=PPx.Extract("%n"),d=PPx.Extract('%*name(C,"%FDV")'),l=_validTable(e),s=_linecust(""+r+P,l,t),f=_linecust(""+r+P,l,"CLOSEEVENT"),p={instantly:"",once:'*if("'+P+'"=="%n")%:',hold:'*if("'+P+'"=="%n")&&("'+d+'"!="%*name(C,"%FDV")")%:'},E=[s,f];i&&(PPx.Execute("*mapkey use,"+i),E.push("*mapkey delete,"+i)),E.push('*js ":'+x+',ppx_Discard",'+u+","+r),PPx.Execute(s+"%(*if %*stayinfo("+x+")%:"+p[c]+E.join("%:")+"%)"),PPx.Execute(f+"%("+p.once+f+"%:"+s+"%)"),PPx.Execute('*run -breakjob -nostartmsg -wait:no %0pptrayw.exe -c %%K"@LOADCUST"')}},getStaymodeId=function(t){t=~t.indexOf(".")?t.slice(0,t.indexOf(".")):t;var n=Number(PPx.Extract("%*getcust(S_ppm#staymode:"+t+")"));return!isNaN(n)&&n>1e4&&n},n=(_discard("ACTIVEEVENT"),_discard("LOADEVENT"),function(t){var n=0;return{get:function(){var e=t[n];return n=(n+1)%t.length,e},discard:_discard("LOADEVENT")}}),_setEvent=function(t,n,e,r,i){var a="*linecust "+e+","+_validTable(t),c=a+":"+n+",",o={instantly:"",once:'*if("%n"=="%%n")',hold:'*if("%n"=="%%n")&&("%FDV"=="%%FDV")'}[i];PPx.Execute(a+":"+n+","+o+"%%:"+c+"%%:"+r),PPx.Execute('%K"@LOADCUST"')},e=1920,r=1080,i=50,a="cyclePositions",c=getStaymodeId(a)||2,cache={},main=function(){cache.ppcid=getPPcId();var t=Number(PPx.Extract("%*getcust(S_ppm#global:disp_width)"))||e,o=Number(PPx.Extract("%*getcust(S_ppm#global:disp_height)"))||r,u=Math.floor(Number(PPx.Extract("%*windowrect(%N"+cache.ppcid+",w)"))/2),x=Math.floor((o-Number(PPx.Extract("%*windowrect(%N"+cache.ppcid+",h)"))-i)/2),P=[[t-u,x],[0-u,x],[t/2-u,x]];PPx.StayMode=c,cache.circular=n(P),cache.circular.discard({table:"KC_main",label:a,cond:"once"}),ppx_resume()},ppx_resume=function(){var t=cache.circular.get(),n=t[0],e=t[1];PPx.Execute("*windowposition %N"+cache.ppcid+","+n+","+e)},getPPcId=function(){var t=PPx.Extract("%n#");return t?t+"#":PPx.Extract("%n")};main();
