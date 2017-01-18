/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */
sap.ui.define(['sap/ui/rta/command/BaseCommand',"sap/ui/fl/FlexControllerFactory"],function(B,F){"use strict";var a=B.extend("sap.ui.rta.command.FlexCommand",{metadata:{library:"sap.ui.rta",properties:{changeHandler:{type:"sap.ui.fl.changeHandler.Base"},changeType:{type:"string"}},associations:{},events:{}}});a.prototype._executeWithElement=function(e){var c=this._getForwardFlexChange(e);this.getChangeHandler().applyChange(c.change,c.selectorElement);};a.prototype._getForwardFlexChange=function(e){return{change:{},selectorElement:e};};a.prototype._undoWithElement=function(e){var c=this._getBackwardFlexChange(e);this.getChangeHandler().applyChange(c.change,c.selectorElement);};a.prototype._getBackwardFlexChange=function(e){};a.prototype._completeChangeContent=function(s){var f=F.createForControl(this.getElement());return f.createChange(s,this.getElement());};return a;},true);
