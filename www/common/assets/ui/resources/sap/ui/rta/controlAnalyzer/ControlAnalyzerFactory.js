/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */
sap.ui.define(['sap/ui/rta/controlAnalyzer/SmartForm','sap/ui/rta/controlAnalyzer/ObjectPage'],function(){"use strict";var C={};var _={'sap.ui.comp.smartform':{'ctor':sap.ui.rta.controlAnalyzer.SmartForm,'instance':null},'sap.uxap':{'ctor':sap.ui.rta.controlAnalyzer.ObjectPage,'instance':null},'sap':{'ctor':sap.ui.rta.controlAnalyzer.Base,'instance':null},'findControlAnalyzerByName':function(c,n){var r=c._mapOfControllers[n];if(!r){var i=n.lastIndexOf('.');if(i>0){r=c._mapOfControllers.findControlAnalyzerByName(c,n.substr(0,i));}}return r;}};C._mapOfControllers=_;C.getControlAnalyzerFor=function(c){var r=null;if(c){var t=c.getMetadata().getName();var d=this._mapOfControllers.findControlAnalyzerByName(this,t);if(d){r=d.instance;if(!r){d.instance=new d.ctor();r=d.instance;}}}return r;};return C;},true);
