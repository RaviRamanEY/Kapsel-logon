/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */
sap.ui.define(['sap/ui/base/ManagedObject'],function(M){"use strict";var B=M.extend("sap.ui.rta.command.BaseCommand",{metadata:{library:"sap.ui.rta",properties:{element:{type:"sap.ui.core.Element"},elementId:{type:"string"},name:{type:"string"}},associations:{},events:{}}});B.ERROR_UNKNOWN_ID="no element for id: ";B.prototype._executeWithElement=function(e){};B.prototype.execute=function(){this._withElement(this._executeWithElement.bind(this));};B.prototype._undoWithElement=function(e){};B.prototype.undo=function(){this._withElement(this._undoWithElement.bind(this));};B.prototype._withElement=function(f){var e=this._getElement();if(e){f(e);}else{jQuery.sap.log.error(this.getMetadata().getName(),B.ERROR_UNKNOWN_ID+this.getElementId());}};B.prototype.serialize=function(){};B.prototype.isEnabled=function(){return true;};B.deserialize=function(c){};B.prototype._getElement=function(){var e=this.getElement();if(!e){e=sap.ui.getCore().byId(this.getElementId());this.setElement(e);}return e;};return B;},true);
