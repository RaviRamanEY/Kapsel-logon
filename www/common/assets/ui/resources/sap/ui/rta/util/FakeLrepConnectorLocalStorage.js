/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/rta/util/FakeLrepLocalStorage"],function(F){"use strict";var a={};a.create=function(c){if(Array.isArray(c)){c.forEach(function(e){F.saveChange(e.fileName,e);});}else{F.saveChange(c.fileName,c);}return Promise.resolve();};a.deleteChange=function(c){F.deleteChange(c.sChangeName);return Promise.resolve({response:undefined,status:"nocontent"});};a.deleteChanges=function(){F.deleteChanges();return Promise.resolve({response:undefined,status:"nocontent"});};a.loadChanges=function(c){var C=F.getChanges(),i=this.sInitialComponentJsonPath;return new Promise(function(r,b){jQuery.getJSON(i).done(function(R){R.changes=C;var d={changes:R,componentClassName:c};r(d);}).fail(function(e){b(e);});});};return a;},true);
