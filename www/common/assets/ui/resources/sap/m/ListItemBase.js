/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Control','sap/ui/core/IconPool','sap/ui/core/Icon'],function(q,l,C,I,a){"use strict";var L=C.extend("sap.m.ListItemBase",{metadata:{library:"sap.m",properties:{type:{type:"sap.m.ListType",group:"Misc",defaultValue:sap.m.ListType.Inactive},visible:{type:"boolean",group:"Appearance",defaultValue:true},unread:{type:"boolean",group:"Misc",defaultValue:false},selected:{type:"boolean",defaultValue:false},counter:{type:"int",group:"Misc",defaultValue:null}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{tap:{deprecated:true},detailTap:{deprecated:true},press:{},detailPress:{}}}});L.prototype.DetailIconURI=I.getIconURI("edit");L.prototype.DeleteIconURI=I.getIconURI("sys-cancel");L.prototype.NavigationIconURI=I.getIconURI("slim-arrow-right");L.prototype.init=function(){this._active=false;};L.prototype.onAfterRendering=function(){this.informList("DOMUpdate",true);};L.prototype.getBindingContextPath=function(m){var o=this.getList();if(o&&!m){m=(o.getBindingInfo("items")||{}).model;}var c=this.getBindingContext(m);if(c){return c.getPath();}};L.prototype.isSelectedBoundTwoWay=function(){var b=this.getBinding("selected");if(b&&b.getBindingMode()==sap.ui.model.BindingMode.TwoWay){return true;}};L.prototype.getList=function(){var p=this.getParent();if(p instanceof sap.m.ListBase){return p;}};L.prototype.getListProperty=function(p,f){var o=this.getList();if(o){p=q.sap.charToUpperCase(p);return o["get"+p]();}return f;};L.prototype.informList=function(e,p,P){var o=this.getList();if(o){var m="onItem"+e;if(o[m]){o[m](this,p,P);}}};L.prototype.informSelectedChange=function(s){var o=this.getList();if(o){o.onItemSelectedChange(this,s);this.bSelectedDelayed=undefined;}else{this.bSelectedDelayed=s;}};L.prototype.getMode=function(){return this.getListProperty("mode","");};L.prototype.updateAccessibilityState=function(A){var t=this.$();if(!t.length){return;}var i=t.parent().find(".sapMLIB");t.attr(q.extend({"aria-setsize":i.length,"aria-posinset":i.index(t)+1},A));};L.prototype.getDeleteControl=function(){if(this._oDeleteControl){return this._oDeleteControl;}this._oDeleteControl=new a({id:this.getId()+"-imgDel",src:this.DeleteIconURI,useIconTooltip:false,noTabStop:true}).setParent(this,null,true).addStyleClass("sapMLIBIconDel").attachPress(function(e){this.informList("Delete");},this);return this._oDeleteControl;};L.prototype.getDetailControl=function(){if(this._oDetailControl){return this._oDetailControl;}this._oDetailControl=new a({id:this.getId()+"-imgDet",src:this.DetailIconURI,useIconTooltip:false,noTabStop:true}).setParent(this,null,true).attachPress(function(){this.fireDetailTap();this.fireDetailPress();},this).addStyleClass("sapMLIBType sapMLIBIconDet");return this._oDetailControl;};L.prototype.getNavigationControl=function(){if(this._oNavigationControl){return this._oNavigationControl;}this._oNavigationControl=new a({id:this.getId()+"-imgNav",src:this.NavigationIconURI,useIconTooltip:false,noTabStop:true}).setParent(this,null,true).addStyleClass("sapMLIBType sapMLIBImgNav");return this._oNavigationControl;};L.prototype.getSingleSelectControl=function(){if(this._oSingleSelectControl){return this._oSingleSelectControl;}this._oSingleSelectControl=new sap.m.RadioButton({id:this.getId()+"-selectSingle",groupName:this.getListProperty("id")+"_selectGroup",activeHandling:false,selected:this.getSelected()}).setParent(this,null,true).setTabIndex(-1).attachSelect(function(e){var s=e.getParameter("selected");this.setSelected(s);this.informList("Select",s);},this);return this._oSingleSelectControl;};L.prototype.getMultiSelectControl=function(){if(this._oMultiSelectControl){return this._oMultiSelectControl;}this._oMultiSelectControl=new sap.m.CheckBox({id:this.getId()+"-selectMulti",activeHandling:false,selected:this.getSelected()}).setParent(this,null,true).setTabIndex(-1).attachSelect(function(e){var s=e.getParameter("selected");this.setSelected(s);this.informList("Select",s);},this);return this._oMultiSelectControl;};L.prototype.getModeControl=function(u){var m=this.getMode(),b=sap.m.ListMode;if(!m||m==b.None){return;}if(m==b.Delete){return this.getDeleteControl();}var s=null;if(m==b.MultiSelect){s=this.getMultiSelectControl();}else{s=this.getSingleSelectControl();}if(s&&u){s.setSelected(this.getSelected());}return s;};L.prototype.getTypeControl=function(){var t=this.getType(),T=sap.m.ListType;if(t==T.Detail||t==T.DetailAndActive){return this.getDetailControl();}if(t==T.Navigation){return this.getNavigationControl();}};L.prototype.destroyControls=function(c){c.forEach(function(s){s="_o"+s+"Control";if(this[s]){this[s].destroy("KeepDom");this[s]=null;}},this);};L.prototype.isActionable=function(){return this.getListProperty("includeItemInSelection")||this.getMode()==sap.m.ListMode.SingleSelectMaster||(this.getType()!=sap.m.ListType.Inactive&&this.getType()!=sap.m.ListType.Detail);};L.prototype.exit=function(){this._oLastFocused=null;this.destroyControls(["Delete","SingleSelect","MultiSelect","Detail","Navigation"]);};L.prototype.isSelectable=function(){var m=this.getMode();return!(m==sap.m.ListMode.None||m==sap.m.ListMode.Delete);};L.prototype.getSelected=function(){if(this.isSelectable()){return this.getProperty("selected");}return false;};L.prototype.isSelected=L.prototype.getSelected;L.prototype.setSelected=function(s,d){s=this.validateProperty("selected",s);if(!this.isSelectable()||s==this.getSelected()){return this;}if(!d){this.informSelectedChange(s);}var S=this.getModeControl();if(S){S.setSelected(s);}this.updateSelectedDOM(s,this.$());this.setProperty("selected",s,true);return this;};L.prototype.updateSelectedDOM=function(s,t){t.toggleClass("sapMLIBSelected",s);t.attr("aria-selected",s);};L.prototype.setParent=function(p){C.prototype.setParent.apply(this,arguments);if(!p){return;}this.informList("Inserted",this.bSelectedDelayed);return this;};L.prototype.setBindingContext=function(){C.prototype.setBindingContext.apply(this,arguments);this.informList("BindingContextSet");return this;};L.prototype.isIncludedIntoSelection=function(){var m=this.getMode(),M=sap.m.ListMode;return(m==M.SingleSelectMaster||(this.getListProperty("includeItemInSelection")&&(m==M.SingleSelectLeft||m==M.SingleSelect||m==M.MultiSelect)));};L.prototype.hasActiveType=function(){var t=sap.m.ListType,T=this.getType();return(T==t.Active||T==t.Navigation||T==t.DetailAndActive);};L.prototype.setActive=function(A){if(A!=this._active){var t=this.$();this._active=A;this._activeHandling(t);if(this.getType()==sap.m.ListType.Navigation){this._activeHandlingNav(t);}if(A){this._activeHandlingInheritor(t);}else{this._inactiveHandlingInheritor(t);}}return this;};L.prototype.ontap=function(e){if(this._eventHandledByControl){return;}if(this.isIncludedIntoSelection()){if(this.getMode()==sap.m.ListMode.MultiSelect){this.setSelected(!this.getSelected());this.informList("Select",this.getSelected());}else if(!this.getSelected()){this.setSelected(true);this.informList("Select",true);}}else if(this.hasActiveType()){window.clearTimeout(this._timeoutIdStart);window.clearTimeout(this._timeoutIdEnd);this.setActive(true);q.sap.delayedCall(180,this,function(){this.setActive(false);});q.sap.delayedCall(0,this,function(){this.fireTap();this.firePress();});}this.informList("Press",e.srcControl);};L.prototype.ontouchstart=function(e){this._eventHandledByControl=e.isMarked();var t=e.targetTouches[0];this._touchedY=t.clientY;this._touchedX=t.clientX;if(this._eventHandledByControl||e.touches.length!=1||!this.hasActiveType()){return;}this._timeoutIdStart=q.sap.delayedCall(100,this,function(){this.setActive(true);e.setMarked();});};L.prototype.ontouchmove=function(e){if((this._active||this._timeoutIdStart)&&(Math.abs(this._touchedY-e.targetTouches[0].clientY)>10||Math.abs(this._touchedX-e.targetTouches[0].clientX)>10)){clearTimeout(this._timeoutIdStart);this._timeoutIdStart=null;this._timeoutIdEnd=null;this.setActive(false);}};L.prototype.ontouchend=function(e){if(e.targetTouches.length==0&&this.hasActiveType()){this._timeoutIdEnd=q.sap.delayedCall(100,this,function(){this.setActive(false);});}};L.prototype.ontouchcancel=L.prototype.ontouchend;L.prototype._activeHandlingNav=function(){};L.prototype._activeHandlingInheritor=function(){};L.prototype._inactiveHandlingInheritor=function(){};L.prototype._activeHandling=function(t){t.toggleClass("sapMLIBActive",this._active);if(this.isActionable()){t.toggleClass("sapMLIBHoverable",!this._active);}};L.prototype.onsapspace=function(e){if(e.srcControl!==this){return;}e.preventDefault();if(e.isMarked()||!this.isSelectable()){return;}if(this.getMode()==sap.m.ListMode.MultiSelect){this.setSelected(!this.getSelected());this.informList("Select",this.getSelected());}else if(!this.getSelected()){this.setSelected(true);this.informList("Select",true);}e.setMarked();};L.prototype.onsapenter=function(e){if(e.isMarked()||e.srcControl!==this){return;}if(this.isIncludedIntoSelection()){this.onsapspace(e);}else if(this.hasActiveType()){e.setMarked();this.setActive(true);q.sap.delayedCall(180,this,function(){this.setActive(false);});q.sap.delayedCall(0,this,function(){this.fireTap();this.firePress();});}this.informList("Press",this);};L.prototype.onsapdelete=function(e){if(e.isMarked()||e.srcControl!==this||this.getMode()!=sap.m.ListMode.Delete){return;}this.informList("Delete");e.preventDefault();e.setMarked();};L.prototype._switchFocus=function(e){var p=this.getParent();var t=this.getTabbables();if(e.srcControl!==this){p._iLastFocusPosOfItem=t.index(e.target);this.focus();}else if(t.length){var f=p._iLastFocusPosOfItem||0;f=t[f]?f:-1;t.eq(f).focus();}};L.prototype.onkeydown=function(e){var k=q.sap.KeyCodes;if(e.isMarked()){return;}if(e.which==k.F7){this._switchFocus(e);e.preventDefault();e.setMarked();return;}if(e.srcControl!==this){return;}if(e.which==k.F2&&this.getType().indexOf("Detail")==0){this.fireDetailTap();this.fireDetailPress();e.preventDefault();e.setMarked();}};L.prototype.getTabbables=function(){return this.$().find(":sapTabbable");};L.prototype.onsaptabnext=function(e){var o=this.getList();if(!o||e.isMarked()){return;}var b=this.getTabbables().get(-1)||this.getDomRef();if(e.target===b){o.forwardTab(true);e.setMarked();}};L.prototype.onsaptabprevious=function(e){var o=this.getList();if(!o||e.isMarked()){return;}if(e.target===this.getDomRef()){o.forwardTab(false);e.setMarked();}};L.prototype.onfocusin=function(e){var o=this.getList();if(!o||e.isMarked()||e.srcControl===this||!q(e.target).is(":sapFocusable")){return;}q.sap.delayedCall(0,o,"setItemFocusable",[this]);e.setMarked();};return L;},true);
