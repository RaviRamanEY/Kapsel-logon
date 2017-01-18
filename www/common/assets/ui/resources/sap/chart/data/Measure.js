/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/core/Element","sap/chart/utils/ChartUtils"],function(E,C){"use strict";var _={axis1:true,axis2:true,axis3:true,axis4:true};var M=E.extend("sap.chart.data.Measure",{metadata:{library:"sap.chart",properties:{name:{type:"string"},label:{type:"string"},unitBinding:{type:"string"},valueFormat:{type:"string",defaultValue:"StandardFloat"},role:{type:"string",defaultValue:"axis1"}}}});M.prototype.setLabel=C.makeNotifyParentProperty("label");var r=C.makeNotifyParentProperty("role");M.prototype.setRole=function(v,s){if(!_[v]){jQuery.error("Invalide Measure role: "+v);}return r.apply(this,arguments);};M.prototype.setUnitBinding=C.makeNotifyParentProperty("unitBinding");M.prototype.setValueFormat=C.makeNotifyParentProperty("valueFormat");return M;});
