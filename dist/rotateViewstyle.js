﻿var isEmptyStr=function(e){return""===e},e="rotateViewstyle",t="originViewstyle",i={general:["サムネ小(&J)","サムネ中(&J)","サムネ欄(&J)"],picture:["画像中(&I)","画像大(&I)","画像特(&I)"],listfile:["一覧(c&Omment)"],ftp:[],http:[]},n=PPx.windowIDName,main=function(){var e=PPx.Arguments.length>0?"C_"+PPx.Argument(0):"",i=Number(PPx.DirectoryType),r=n===e?-1:i;if(r>=62)PPx.Execute("*viewstyle directory");else{var u=PPx.Extract('%sgu"'+t+n+'"'),c=u.slice(2),s=isEmptyStr(u),l=s?0:Number(u.slice(0,1)),P=getStyles(r),a='"'+(null==P?void 0:P[l])+'"';'"undefined"'===a?(l=0,a=c):l+=1,s?(PPx.Execute("*string u,"+t+n+"="+l+'|format "%*viewstyle()"'),deleteEvent("LOADEVENT"),deleteEvent("CLOSEEVENT")):PPx.Execute("*string u,"+t+n+"="+l+"|"+c),PPx.Execute("*viewstyle -temp "+a)}},deleteEvent=function(i){PPx.Execute("*linecust "+e+n+",KC_main:"+i+',*if ("%%n"=="%n")%%:*deletecust _User:'+t+n+"%%:*linecust "+e+n+",KC_main:LOADEVENT,%%:*linecust "+e+n+",KC_main:CLOSEEVENT,")},getStyles=function(e){switch(e){case-1:return i.picture;case 4:return i.listfile;case 21:return i.ftp;case 80:return i.http;default:return i.general}};main();
