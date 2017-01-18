/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2014 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
jQuery.sap.require("sap.ui.core.delegate.ScrollEnablement");sap.ui.define(['jquery.sap.global'],function(q){"use strict";var K=function(o){this.init(o);};K.prototype.init=function(o){this.objectStream=o;this.keyCodes=q.sap.KeyCodes;this.jqElement=o.$();this.jqElement.on('keydown.keyboardNavigation',this.keydownHandler.bind(this));this.jqElement.on("focus.keyboardNavigation",".sapOvpObjectStreamItem",this.ObjectStreamFocusAccessabilityHandler.bind(this));};K.prototype.destroy=function(){if(this.jqElement){this.jqElement.off(".keyboardNavigation");}delete this.jqElement;delete this.objectStream;};K.prototype._swapItemsFocus=function(e,j,a){e.preventDefault();j.attr("tabindex","-1");a.attr("tabindex","0").focus();};K.prototype.ObjectStreamFocusAccessabilityHandler=function(){var f=document.activeElement;f=q(f);if(f){var l=f.find("[aria-label]");var i,s="";for(i=0;i<l.length;i++){if(l[i].getAttribute("role")=="heading"){s+=l[i].id+" ";}}if(s.length){f.attr("aria-labelledby",s);}}};K.prototype.tabButtonHandler=function(e){var j=q(document.activeElement);if(j.hasClass("sapOvpObjectStreamItem")){return;}if(j.hasClass("sapOvpObjectStreamClose")){e.preventDefault();this.jqElement.find(".sapOvpObjectStreamItem:sapTabbable").focus();return;}var a=j.closest(".sapOvpObjectStreamItem");if(!a.length){return;}var b=a.find(":sapTabbable");if(b.eq(b.length-1).is(j)){e.preventDefault();this.jqElement.find(".sapOvpObjectStreamClose").focus();}};K.prototype.shiftTabButtonHandler=function(e){var j=q(document.activeElement);if(j.hasClass("sapOvpObjectStreamItem")){e.preventDefault();this.jqElement.find(".sapOvpObjectStreamClose").focus();}if(j.hasClass("sapOvpObjectStreamClose")){e.preventDefault();this.jqElement.find(".sapOvpObjectStreamItem:sapTabbable *:sapTabbable").last().focus();return;}};K.prototype.enterHandler=function(e){var j=q(document.activeElement);if(j.hasClass("sapOvpObjectStreamClose")){e.preventDefault();this.objectStream.getParent().close();return;}if(j.hasClass("sapOvpObjectStreamItem")&&!j.next().length){j.children().click();return;}};K.prototype.f6Handler=function(e){var j=q(document.activeElement);if(j.hasClass("sapOvpObjectStreamClose")){this.jqElement.find('.sapOvpObjectStreamItem').attr("tabindex","-1").first().attr("tabindex","0").focus();}else{this.jqElement.find('.sapOvpObjectStreamClose').focus();}};K.prototype.f7Handler=function(e){var j=q(document.activeElement);if(j.hasClass("sapOvpObjectStreamItem")){j.find(':sapTabbable').first().focus();}else{j.closest('.sapOvpObjectStreamItem').focus();}e.preventDefault();};K.prototype.leftRightHandler=function(e,i){var n=i?"next":"prev";var j=q(document.activeElement);if(!j.hasClass("sapOvpObjectStreamItem")){return false;}var a=j[n]();if(!a.length){return;}this._swapItemsFocus(e,j,a);};K.prototype.homeEndHandler=function(e,i){var n=i?"first":"last";var j=q(document.activeElement);if(!j.hasClass("sapOvpObjectStreamItem")){return false;}e.preventDefault();var a=this.jqElement.find(".sapOvpObjectStreamItem")[n]();this._swapItemsFocus(e,j,a);};K.prototype.pageUpDownHandler=function(e,i){var n=i?"prev":"next";var j=q(document.activeElement);if(!j.hasClass("sapOvpObjectStreamItem")){return;}if(!j[n]().length){return;}var a=false;var c=j;var w=q(window).width();while(!a){var b=c[n]();if(!b.length){a=c;break;}if(!i&&b.offset().left>w){a=b;break;}if(i&&(b.offset().left+b.outerHeight())<=0){a=b;break;}c=b;}this._swapItemsFocus(e,j,a);};K.prototype.keydownHandler=function(e){switch(e.keyCode){case this.keyCodes.TAB:(e.shiftKey)?this.shiftTabButtonHandler(e):this.tabButtonHandler(e);break;case this.keyCodes.ENTER:case this.keyCodes.SPACE:this.enterHandler(e);break;case this.keyCodes.F6:this.f6Handler(e);break;case this.keyCodes.F7:this.f7Handler(e);break;case this.keyCodes.ARROW_UP:case this.keyCodes.ARROW_LEFT:this.leftRightHandler(e,false);break;case this.keyCodes.ARROW_DOWN:case this.keyCodes.ARROW_RIGHT:this.leftRightHandler(e,true);break;case this.keyCodes.HOME:this.homeEndHandler(e,true);break;case this.keyCodes.END:this.homeEndHandler(e,false);break;case this.keyCodes.PAGE_UP:this.pageUpDownHandler(e,true);break;case this.keyCodes.PAGE_DOWN:this.pageUpDownHandler(e,false);break;}};var O=sap.ui.core.Control.extend("sap.ovp.ui.ObjectStream",{metadata:{library:"sap.ovp",properties:{title:{type:"string",defaultValue:""}},aggregations:{content:{type:"sap.ui.core.Control",multiple:true},placeHolder:{type:"sap.ui.core.Control",multiple:false}}}});O.prototype.init=function(){var t=this;this._closeIcon=new sap.ui.core.Icon({src:"sap-icon://decline",tooltip:"close"});this._closeIcon.addEventDelegate({onclick:function(){t.getParent().close();}});};O.prototype._startScroll=function(d){this._direction=d;var s=this.wrapper.scrollWidth-this.wrapper.offsetWidth-Math.abs(this.wrapper.scrollLeft);var l;if(d=="left"){l=(this.rtl&&!this.scrollReverse)?s:this.wrapper.scrollLeft;if(l<=0){return;}this.jqRightEdge.css("opacity",1);}else{l=(this.rtl&&!this.scrollReverse)?Math.abs(this.wrapper.scrollLeft):s;if(l<=0){return;}this.jqLeftEdge.css("opacity",1);}var a=l*3;var t=(d=="left")?l:~l+1;q(this.container).one("transitionend",function(){this._mouseLeave({data:this});}.bind(this));this.container.style.transition='transform '+a+'ms linear';this.container.style.transform='translate('+t+'px, 0px) scale(1) translateZ(0px) ';};O.prototype._mouseLeave=function(e){var c=window.getComputedStyle(e.data.container).transform;e.data.container.style.transform=c;e.data.container.style.transition='';var t;var a=c.split(",");if(c.substr(0,8)=="matrix3d"){t=parseInt(a[12],10);}else if(c.substr(0,6)=="matrix"){t=parseInt(a[4],10);}if(isNaN(t)){return;}e.data.container.style.transform="none";e.data.wrapper.scrollLeft+=~t+(e.data._direction=="left"?-5:5);e.data._checkEdgesVisibility();};O.prototype._initScrollVariables=function(){var j=this.$();this.container=j.find(".sapOvpObjectStreamScroll").get(0);this.rtl=sap.ui.getCore().getConfiguration().getRTL();this.wrapper=j.find(".sapOvpObjectStreamCont").get(0);this.scrollReverse=this.scrollReverse||this.wrapper.scrollLeft>0;this.shouldShowScrollButton=(!sap.ui.Device.system.phone&&!sap.ui.Device.system.tablet)||sap.ui.Device.system.combi;this.jqRightEdge=j.find(".sapOvpOSEdgeRight");this.jqLeftEdge=j.find(".sapOvpOSEdgeLeft");if(this.shouldShowScrollButton){this.jqRightEdge.add(this.jqLeftEdge).on("mouseenter.objectStream",this,this._mouseEnter).on("mouseleave.objectStream",this,this._mouseLeave);}else{this.jqLeftEdge.css("display","none");this.jqRightEdge.css("display","none");}this._checkEdgesVisibility();};O.prototype._afterOpen=function(){if(sap.ui.Device.os.ios&&this.$().length){this.$().on("touchmove.scrollFix",function(e){e.stopPropagation();});}this.$().find('.sapOvpObjectStreamItem').first().focus();if(this.keyboardNavigation){this.keyboardNavigation.destroy();}this.keyboardNavigation=new K(this);this._initScrollVariables();this.jqBackground=q("<div id='objectStreamBackgroundId' class='objectStreamNoBackground'></div>");q.sap.byId("sap-ui-static").prepend(this.jqBackground);this.jqBackground.on('click.closePopup',function(){this._oPopup.close();}.bind(this));q(".sapUshellEasyScanLayout").addClass("bluredLayout");};O.prototype._beforeClose=function(){if(sap.ui.Device.os.ios&&this.$().length){this.$().off(".scrollFix");}this.keyboardNavigation.destroy();this.jqBackground.remove();this.jqLeftEdge.add(this.jqRightEdge).off(".objectStream");q(".sapUshellEasyScanLayout").removeClass("bluredLayout");};O.prototype._mouseEnter=function(e){var s='right';if((e.target==e.data.jqRightEdge.get(0))||(e.currentTarget==e.data.jqRightEdge.get(0))){s=sap.ui.getCore().getConfiguration().getRTL()?'left':'right';}if((e.target==e.data.jqLeftEdge.get(0))||(e.currentTarget==e.data.jqLeftEdge.get(0))){s=sap.ui.getCore().getConfiguration().getRTL()?'right':'left';}e.data._startScroll(s);};O.prototype._checkEdgesVisibility=function(){var s=this.wrapper.scrollLeft;var l=this.wrapper.scrollWidth-this.wrapper.offsetWidth-this.wrapper.scrollLeft;var a=(s==0)?0:1;var r=(l==0)?0:1;if(sap.ui.getCore().getConfiguration().getRTL()&&this.scrollReverse){this.jqLeftEdge.css("opacity",r);this.jqRightEdge.css("opacity",a);}else{this.jqLeftEdge.css("opacity",a);this.jqRightEdge.css("opacity",r);}};O.prototype._createPopup=function(){this._oPopup=new sap.m.Dialog({showHeader:false,afterOpen:this._afterOpen.bind(this),beforeClose:this._beforeClose.bind(this),content:[this],stretch:sap.ui.Device.system.phone}).removeStyleClass("sapUiPopupWithPadding").addStyleClass("sapOvpStackedCardPopup");this._oPopup.oPopup.setModal(false);};O.prototype.open=function(c){if(!this._oPopup){this._createPopup();}this._cardWidth=c;this.setCardsSize(this._cardWidth);this._oPopup.open();};O.prototype.onBeforeRendering=function(){};O.prototype.onAfterRendering=function(){if(!this._oPopup||!this._oPopup.isOpen()||!this.getContent().length){return;}this.setCardsSize(this._cardWidth);setTimeout(function(){this._initScrollVariables();}.bind(this));};O.prototype.exit=function(){if(this._oPopup){this._oPopup.destroy();}this._closeIcon.destroy();if(this._oScroller){this._oScroller.destroy();this._oScroller=null;}};O.prototype.setCardsSize=function(c){var r=parseInt(window.getComputedStyle(document.documentElement).fontSize,10);var a=sap.ui.Device.system.phone?document.body.clientHeight/r-4.5:28.75;var b=this.getContent();b.map(function(C){C.setWidth(c+"px");C.setHeight(a+"rem");});var p=this.getPlaceHolder();if(p){p.setWidth(c+"px");p.setHeight(a+"rem");}};O.prototype.updateContent=function(r){var b=this.mBindingInfos["content"],B=b.binding,a=B.getContexts(b.startIndex,b.length);if(r==="change"){var f=b.factory,i=0,I=this.getContent(),c=q.proxy(function(C){var s=this.getId()+"-"+q.sap.uid(),o=f(s,C);o.setBindingContext(C,b.model);this.addContent(o);},this);for(i=0;i<a.length;++i){if(i<I.length){I[i].setBindingContext(a[i],b.model);}else{c(a[i]);}}if(I.length>a.length){for(;i<I.length;++i){I[i].destroy();}I.length=a.length;}}};return O;},true);
