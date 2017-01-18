/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */
sap.ui.define(['sap/ui/base/ManagedObject'],function(M){"use strict";var B=M.extend("sap.ui.rta.controlAnalyzer.Base",{metadata:{library:"sap.ui.rta",properties:{}}});B.prototype.init=function(){};B.prototype.getFlexChangeType=function(t,e){if(t==="Move"){return"moveElements";}};B.prototype.mapSpecificChangeData=function(t,s){return s;};B.prototype.getControlsFieldCollection=function(c){};B.prototype.createChangeData=function(c,C,h){return null;};B.prototype.findVisibleAndBoundFieldsAndLabelNames=function(c){};B.prototype.isCustomFieldAvailable=function(c){return Promise.resolve().then(function(){return false;});};B.prototype.checkTargetZone=function(p,a,m){return true;};return B;},true);
