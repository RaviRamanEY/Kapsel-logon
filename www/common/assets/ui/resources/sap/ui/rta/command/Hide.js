/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */
sap.ui.define(['sap/ui/rta/command/FlexCommand',"sap/ui/fl/changeHandler/HideControl"],function(F,H){"use strict";var a=F.extend("sap.ui.rta.command.Hide",{metadata:{library:"sap.ui.rta",properties:{changeType:{type:"string",defaultValue:"hideControl"}},associations:{},events:{}}});a.prototype.init=function(){this.setChangeHandler(new H());};a.prototype._undoWithElement=function(e){e.setVisible(true);};a.prototype.serialize=function(){return{changeType:this.getChangeType(),selector:{id:this._getElement().getId()}};};return a;},true);
