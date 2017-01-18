/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */
sap.ui.define(['sap/ui/rta/command/FlexCommand',"sap/ui/fl/changeHandler/UnhideControl"],function(F,U){"use strict";var a=F.extend("sap.ui.rta.command.Unhide",{metadata:{library:"sap.ui.rta",properties:{changeType:{type:"string",defaultValue:"unhideControl"}},associations:{},events:{}}});a.prototype.init=function(){this.setChangeHandler(new U());};a.prototype._undoWithElement=function(e){e.setVisible(false);};a.prototype.serialize=function(){return{changeType:this.getChangeType(),selector:{id:this._getElement().getId()}};};return a;},true);
