﻿Array.prototype.indexOf||(Array.prototype.indexOf=function(t,n){var e;if(null==this)throw new Error('Array.indexOf: "this" is null or not defined');var r=Object(this),i=r.length>>>0;if(0===i)return-1;var a=null!=n?n:0;if(Math.abs(a)===Infinity&&(a=0),a>=i)return-1;for(e=Math.max(a>=0?a:i-Math.abs(a),0);e<i;){if(e in r&&r[e]===t)return e;e++}return-1});var t=["KC_main","KV_main","KV_img","KV_crt","KV_page","KB_edit","K_ppe","K_edit"],_validTable=function(n){return~t.indexOf(n)?n:"KC_main"},_discard=function(t){return function(n){var e=n.table,r=n.label,i=n.mapkey,a=n.cond,c=void 0===a?"instantly":a,o=n.debug,u=void 0===o?"0":o,x=PPx.StayMode,P=PPx.Extract("%n"),d=PPx.Extract("%FDV"),l="*linecust "+r+P+","+_validTable(e)+":"+t+",",p={instantly:"",once:'*if("'+P+'"=="%n")%:',hold:'*if("'+P+'"=="%n")&&("'+d+'"!="%FDV")%:'}[c],f=[l];i&&(PPx.Execute("*mapkey use,"+i),f.push("*mapkey delete,"+i)),f.push('*js ":'+x+',ppx_Discard",'+u+","+r),PPx.Execute(l+"%(*if %*stayinfo("+x+")%:"+p+f.join("%:")+"%)"),PPx.Execute('*run -nostartmsg %0pptrayw.exe -c %%K"@LOADCUST"')}},ppx_Discard=function(t,n){var e;PPx.StayMode=0,n=null!=(e=n)?e:"","DEBUG"===t&&PPx.linemessage("[DEBUG] discard "+n)},n=(_discard("ACTIVEEVENT"),_discard("LOADEVENT"),function(t){var n=0;return{get:function(){var e=t[n];return n=(n+1)%t.length,e},discard:_discard("LOADEVENT")}}),_setEvent=function(t,n,e,r,i){var a="*linecust "+e+","+_validTable(t),c=a+":"+n+",",o={instantly:"",once:'*if("%n"=="%%n")',hold:'*if("%n"=="%%n")&&("%FDV"=="%%FDV")'}[i];PPx.Execute(a+":"+n+","+o+"%%:"+c+"%%:"+r),PPx.Execute('%K"@LOADCUST"')},e=1920,r=1080,i=50,a="cyclePosition",c={},main=function(){c.ppcid=getPPcId();var t=Number(PPx.Extract("%*getcust(S_ppm#global:disp_width)"))||e,o=Number(PPx.Extract("%*getcust(S_ppm#global:disp_height)"))||r,u=Math.floor(Number(PPx.Extract("%*windowrect(%N"+c.ppcid+",w)"))/2),x=Math.floor((o-Number(PPx.Extract("%*windowrect(%N"+c.ppcid+",h)"))-i)/2),P=[[t-u,x],[0-u,x],[t/2-u,x]];PPx.StayMode=2,c.circular=n(P),c.circular.discard({table:"KC_main",label:a,cond:"once"}),ppx_resume()},ppx_resume=function(){var t=c.circular.get(),n=t[0],e=t[1];PPx.Execute("*windowposition %N"+c.ppcid+","+n+","+e)},getPPcId=function(){var t=PPx.Extract("%n#");return t?t+"#":PPx.Extract("%n")};main();
