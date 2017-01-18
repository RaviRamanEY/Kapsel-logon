/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./Action','sap/ui/qunit/QUnitUtils'],function($,A,Q){"use strict";return A.extend("sap.ui.test.actions.Press",{metadata:{publicMethods:["executeOn"]},executeOn:function(c){var f=c.getFocusDomRef(),F=$(f);if(F.length){F.focus();$.sap.log.debug("Pressed the control "+c,this._sLogPrefix);var x=F.offset().x,y=F.offset().y;var m={identifier:1,pageX:x,pageY:y,clientX:x,clientY:y,screenX:x,screenY:y,target:f,radiusX:1,radiusY:1,rotationAngle:0};Q.triggerEvent("mousedown",f,m);Q.triggerEvent("selectstart",f);Q.triggerEvent("mouseup",f,m);Q.triggerEvent("click",f,m);}else{$.sap.log.error("Control "+c+" has no dom representation",this._sLogPrefix);}}});},true);
