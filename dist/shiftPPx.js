﻿Array.prototype.indexOf||(Array.prototype.indexOf=function(r,t){var n;if(null==this)throw new TypeError('Array.indexOf: "this" is null or not defined');var e=Object(this),i=e.length>>>0;if(0===i)return-1;var u=null!=t?t:0;if(Math.abs(u)===Infinity&&(u=0),u>=i)return-1;for(n=Math.max(u>=0?u:i-Math.abs(u),0);n<i;){if(n in e&&e[n]===r)return n;n++}return-1});var r=function(){for(var r=[],n=function(){var r,t=[];r=PPx.Arguments.length;for(var n=0;n<r;n++)t.push(PPx.Argument(n));return t}(),e=0,i=arguments.length;e<i;e++)r.push(t(e<0||arguments.length<=e?undefined:arguments[e],n[e]));return r},t=function(r,t){if(null==t||""===t)return null!=r?r:undefined;switch(typeof r){case"number":return Number(t)||r;case"boolean":return"false"!==t&&"0"!==t&&null!=t;default:return t}},n=function(){PPx.windowIDName="1";var r=function(){var r=PPx.Extract("%n"),t=r.replace(/^(C)([^_]+)$/,"$1_$2");return{id:r,uid:t}}(),t=r.id,n=r.uid.split("_");return{id:t,pairid:0===n[0].indexOf("C")?"V":"C",subid:n[1]}},e=function(r,t,n,e){var i=(""+(t?"":PPx.Extract("%*ppxlist(-C)"))+(n?"":PPx.Extract("%*ppxlist(-V)"))+(e?"":PPx.Extract("%*ppxlist(-B)"))).slice(0,-1).replace(/_/g,"").split(","),u=r?[1,-1]:[-1,1];return i.sort((function(r,t){return r<t?u[0]:u[1]})),i},i=function(r){for(var t,n=[],e=PPx.Pane.item(r).Tab,i=e(-1).IDName,u=0,a=e.length;u<a;u++)(t=e(u).IDName)!==i&&n.push(t);return n},u=function(r,t,n){var e,u=i(-2);if(PPx.Pane.Count>0&&~u.indexOf(n))return PPx.Extract("%~n");u=i(-3);for(var a=r.indexOf(t)+1,x=r.length;a<x;a++)if(e=r[a],!~u.findIndex((function(r){return r===e})))return e;return n};!function(){var t=r(!1,!1,!1,!1,!1,!1,!1),i=t[0],a=t[1],x=t[2],f=t[3],P=t[4],c=t[5],o=t[6],l=n();if(x&&!c&&"0"!==PPx.Extract('%*extract(C,"%%*js(""PPx.result=PPx.SyncView;"")")'))return void PPx.Execute("*selectppx "+l.pairid);var s=e(i,P,c,o),d=s[s.indexOf(l.id)+1]||s[0];if(1!==PPx.Pane.Count||P||!a||l.id!==d){if(!P&&f)"1"===PPx.Extract("%*getcust(X_combos)").slice(18,19)&&(d=u(s,l.id,d));PPx.Execute("*selectppx "+d)}else PPx.Execute('%K"@TAB"')}();
