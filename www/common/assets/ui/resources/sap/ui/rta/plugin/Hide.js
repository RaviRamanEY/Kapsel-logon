/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */
sap.ui.define(['sap/ui/dt/Plugin'],function(P){"use strict";var H=P.extend("sap.ui.rta.plugin.Hide",{metadata:{library:"sap.ui.rta",properties:{},associations:{},events:{hideElement:{}}}});H.prototype.registerElementOverlay=function(o){o.attachBrowserEvent("keydown",this._onKeyDown,this);};H.prototype.deregisterElementOverlay=function(o){o.detachBrowserEvent("keydown",this._onKeyDown,this);};H.prototype._onKeyDown=function(e){if(e.keyCode===jQuery.sap.KeyCodes.DELETE){e.stopPropagation();this.hideElement();}};H.prototype.hideElement=function(){var d=this.getDesignTime();var s=d.getSelection();var S=s[0];if(S){var e=S.getElementInstance();this.fireHideElement({element:e});}};return H;},true);
