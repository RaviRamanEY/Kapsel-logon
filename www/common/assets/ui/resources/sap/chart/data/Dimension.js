/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/core/Element","sap/chart/utils/ChartUtils"],function(E,C){"use strict";var _={category:true,category2:true,series:true};var D=E.extend("sap.chart.data.Dimension",{metadata:{library:"sap.chart",properties:{name:{type:"string"},label:{type:"string"},textFormatter:{type:"function"},textProperty:{type:"string"},displayText:{type:"boolean",defaultValue:true},role:{type:"string",defaultValue:"category"}}}});D.prototype.setLabel=C.makeNotifyParentProperty("label");D.prototype.setTextFormatter=C.makeNotifyParentProperty("textFormatter");D.prototype.setTextProperty=C.makeNotifyParentProperty("textProperty");D.prototype.setDisplayText=C.makeNotifyParentProperty("displayText");var r=C.makeNotifyParentProperty("role");D.prototype.setRole=function(v,s){if(!_[v]){jQuery.error("Invalide Dimension role: "+v);}return r.apply(this,arguments);};return D;});
