/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./Action','sap/ui/qunit/QUnitUtils'],function($,A,U){"use strict";return A.extend("sap.ui.test.actions.EnterText",{metadata:{properties:{text:{type:"string"}},publicMethods:["executeOn"]},executeOn:function(c){var f=c.getFocusDomRef();if(!f){$.sap.log.error("Control "+c+" has no focusable dom representation",this._sLogPrefix);return;}var F=$(f);F.focus();if(!F.is(":focus")){$.sap.log.warning("Control "+c+" could not be focused - maybe you are debugging?",this._sLogPrefix);}this.getText().split("").forEach(function(C){U.triggerCharacterInput(f,C);U.triggerEvent("input",f);});U.triggerKeydown(f,"ENTER");U.triggerKeyup(f,"ENTER");U.triggerEvent("blur",f);}});},true);
