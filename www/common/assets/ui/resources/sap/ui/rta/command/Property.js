/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */
sap.ui.define(['sap/ui/rta/command/FlexCommand',"sap/ui/fl/changeHandler/PropertyChange"],function(F,P){"use strict";var a=F.extend("sap.ui.rta.command.Property",{metadata:{library:"sap.ui.rta",properties:{propertyName:{type:"string"},newValue:{type:"any"},oldValue:{type:"any"},semanticMeaning:{type:"string"},changeType:{type:"string",defaultValue:"propertyChange"}},associations:{},events:{}}});a.prototype.init=function(){this.setChangeHandler(new P());};a.FORWARD=true;a.BACKWARD=false;a.prototype._getSpecificChangeInfo=function(f){var e=this._getElement();return{changeType:this.getChangeType(),selector:{id:e.getId(),type:e.getMetadata().getName()},content:{property:this.getPropertyName(),oldValue:f?this.getOldValue():this.getNewValue(),newValue:f?this.getNewValue():this.getOldValue(),semantic:this.getSemanticMeaning()}};};a.prototype._getFlexChange=function(f){var s=this._getSpecificChangeInfo(f);var c=this._completeChangeContent(s);return{change:c,selectorElement:this._getElement()};};a.prototype._getForwardFlexChange=function(e){return this._getFlexChange(a.FORWARD);};a.prototype._getBackwardFlexChange=function(e){return this._getFlexChange(a.BACKWARD);};a.prototype.serialize=function(){return this._getSpecificChangeInfo(a.FORWARD);};return a;},true);
