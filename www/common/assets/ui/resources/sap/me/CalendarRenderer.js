/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2016 SAP SE. All rights reserved
    
 */
sap.ui.define(['jquery.sap.global','./CalendarDate','sap/ui/core/LocaleData','sap/ui/core/format/DateFormat','sap/ui/core/date/UniversalDate'],function(q,C,L,D,U){"use strict";var a={};a.render=function(r,c){if(!c.getVisible()){return;}r.write("<div");r.writeControlData(c);r.addClass("sapMeCalendar");var s="sapMeCalendar"+c.getDesign();r.addClass(s);r.writeClasses();var w=c.getWidth();if(w!=undefined){r.addStyle("width",w);r.writeStyles();}r.write(">");r.renderControl(c._oPrevBtn);r.renderControl(c._oNextBtn);var S=c.getSingleRow();var m=S?1:c.getMonthsToDisplay();var n=new C();var N=n.toDateString();var i;if(m===1){this._renderMonth(r,c,c._oInternalDate.getDateObject(),N);}else{var b=c._oInternalDate.getCopyDateObject();var M=Math.floor(m/2);for(i=0;i<M;i++){b=C.getPreviousMonth(b);}for(i=0;i<m;i++){this._renderMonth(r,c,b,N);b=C.getNextMonth(b);}}r.write("</div>");};a._formatDate=function(d,p){var b=D.getDateTimeInstance({pattern:p});return b.format(d);};a._getDateIntervalText=function(d,o,c){var b,e;if(d.getTime()<=o.getTime()){b=new Date(d.getTime());e=new Date(o.getTime());}else{b=new Date(o.getTime());e=new Date(d.getTime());}var i=c._getIntervalPattern("yMMM-y");var I=this._getIntervalSeparator(i,c);var p=i.split(I);return this._formatDate(b,p[0])+I+this._formatDate(e,p[1]);};a._getMonthAndYear=function(d,c){var p=c._getIntervalPattern("yMMM-y");var i=this._getIntervalSeparator(p,c);var P=p.split(i);return this._formatDate(d,P[0]);};a._getIntervalSeparator=function(p,c){var f=c._getIntervalPattern("");var i=f.replace("{0}","").replace("{1}","").trim();if(c._checkLanguageRegion("zh","CN")){if(p.indexOf(i===-1)){i=c._getIntervalPattern("MMM-M").replace(/L/g,"").trim();}}return i;};a._getMonthTitle=function(c,o,i,s,t){var m=this._getMonthAndYear(c,o);if(s){var b=new U(c.getTime());b.setDate(b.getDate()+t-1);if(c.getFullYear()!==b.getFullYear()||c.getMonth()!==b.getMonth()){m=this._getDateIntervalText(c,b,o);}}return m;};a._renderMonth=function(r,c,m,d){var s=c.getSingleRow();var f=c.getFirstDayOffset();var w=c.getDays();var W=w.length;var b=c.getWeeksPerRow();var e=b*W;var g=(100/e);var h=c.getDayHeight();var M=(100/(s?1:c.getMonthsPerRow()));var t=new Date(m.getTime());var j=new C.createDate(t.getFullYear(),t.getMonth(),t.getDate());var k=j.getDate();var l=j.getDay();j.setDate(1);var n=j.getDay();if(n<f){n+=7;}var o=j.getMonth();var p=new U(j);p.setMonth(o+1,0);var u=p.getDate();var v=s?l+1-f:k+n-f;var x=Math.ceil((u+v-k)/7);var T=s?e:(x*7);var y=this._getMonthTitle(j,c,k,s,T);if(s){j=c._getCalendarFirstDate();}else{j.setDate(k-v+1);}r.write('<div');r.addClass("sapMeCalendarMonth");if(!s){r.addClass("sapMeCalendarMonthNotSingle");}r.writeClasses();r.addStyle("width",M+"%");r.writeStyles();r.write(">");r.write('<div');r.addClass("sapMeCalendarMonthName");r.writeClasses();if(c.getHideMonthTitles()){r.addStyle("visibility","hidden");r.writeStyles();}r.write(">");r.writeEscaped(y);r.write("</div>");r.write('<div');r.addClass("sapMeCalendarMonthDayNames");r.writeClasses();r.write(">");var i;for(i=0;i<e;i++){var z=w[(i+f)%W];this._renderDay(r,c,null,z,g);}r.write('</div>');r.write('<div');r.addClass("sapMeCalendarMonthDays");r.writeClasses();r.write(">");for(i=0;i<T;i++){var A=j.getMonth();var B=j.getDay();l=j.getDate();var N=A!==o;t=new Date(j.getTime());var I=t.toDateString();var E=I==d;this._renderDay(r,c,I,l+"",g,h,B,N,E);j.setDate(j.getDate()+1);}r.write('</div>');r.write('</div>');};a._renderDay=function(r,c,i,s,d,b,e,n,I){r.write("<div");r.addClass("sapMeCalendarMonthDay");if(I){r.addClass("sapMeCalendarDayNow");}if(n&&!c.getSingleRow()){r.addClass("sapMeCalendarDayNotInCurrentMonth");}if(typeof e=="number"){r.addClass("sapMeCalendarWeekDay"+e);}r.writeClasses();r.addStyle("width",d+"%");if(b){r.addStyle("height",b+"px");}r.writeStyles();if(i!=null){var f=i.replace(/\s/g,"-");r.writeAttribute('id',c.getId()+"-"+f);}r.write(">");r.write('<span>');r.writeEscaped(s);r.write("</span>");if(i!=null){r.write('<input type="hidden" value="'+i+'"></input>');}r.write("</div>");};return a;},true);
