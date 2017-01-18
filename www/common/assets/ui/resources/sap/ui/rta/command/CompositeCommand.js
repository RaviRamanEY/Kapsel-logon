/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */
sap.ui.define(['sap/ui/rta/command/BaseCommand'],function(B){"use strict";var C=B.extend("sap.ui.rta.command.CompositeCommand",{metadata:{library:"sap.ui.rta",properties:{},aggregations:{commands:{type:"sap.ui.rta.command.BaseCommand",multiple:true}},events:{}}});C.prototype.execute=function(){this._forEachCommand(function(c){c.execute();});};C.prototype.undo=function(){this._forEachCommandInReverseOrder(function(c){c.undo();});};C.prototype._forEachCommand=function(d){var c=this.getCommands();c.forEach(d,this);};C.prototype._forEachCommandInReverseOrder=function(d){var c=this.getCommands();for(var i=c.length-1;i>=0;i--){d.call(this,c[i]);}};return C;},true);
