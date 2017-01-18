/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./BindingMode','./ChangeReason','./PropertyBinding','./CompositeType','./CompositeDataState'],function(q,B,C,P,a,b){"use strict";var c=P.extend("sap.ui.model.CompositeBinding",{constructor:function(e,r){P.apply(this,[null,""]);this.aBindings=e;this.aValues=null;this.bRawValues=r;this.bPreventUpdate=false;},metadata:{publicMethods:["getBindings","attachChange","detachChange"]}});c.prototype.getPath=function(){return null;};c.prototype.getModel=function(){return null;};c.prototype.getContext=function(){return null;};c.prototype.isResolved=function(){var r=false;q.each(this.aBindings,function(i,o){r=o.isResolved();if(!r){return false;}});return r;};c.prototype.setType=function(t,i){if(t&&!(t instanceof a)){throw new Error("Only CompositeType can be used as type for composite bindings!");}P.prototype.setType.apply(this,arguments);if(this.oType){this.bRawValues=this.oType.getUseRawValues();}};c.prototype.setContext=function(o){q.each(this.aBindings,function(i,e){if(!o||e.updateRequired(o.getModel())){e.setContext(o);}});};c.prototype.setValue=function(v){var V;q.each(this.aBindings,function(i,o){V=v[i];if(V!==undefined){o.setValue(V);}});};c.prototype.getValue=function(){var v=[],V;q.each(this.aBindings,function(i,o){V=o.getValue();v.push(V);});return v;};c.prototype.setExternalValue=function(v){var V,e;if(this.fnFormatter){q.sap.log.warning("Tried to use twoway binding, but a formatter function is used");return;}if(this.oType){try{if(this.oType.getParseWithValues()){e=[];if(this.bRawValues){e=this.getValue();}else{q.each(this.aBindings,function(i,o){e.push(o.getExternalValue());});}}V=this.oType.parseValue(v,this.sInternalType,e);this.oType.validateValue(V);}catch(E){this.vInvalidValue=v;this.checkDataState();throw E;}}else{if(typeof v=="string"){V=v.split(" ");}else{V=[v];}}if(this.bRawValues){this.setValue(V);}else{q.each(this.aBindings,function(i,o){v=V[i];if(v!==undefined){o.setExternalValue(v);}});}this.vInvalidValue=null;};c.prototype.getExternalValue=function(){var v=[];if(this.bRawValues){v=this.getValue();}else{q.each(this.aBindings,function(i,o){v.push(o.getExternalValue());});}return this._toExternalValue(v);};c.prototype._toExternalValue=function(v){var V;if(this.fnFormatter){V=this.fnFormatter.apply(this,v);}else if(this.oType){V=this.oType.formatValue(v,this.sInternalType);}else if(v.length>1){V=v.join(" ");}else{V=v[0];}return V;};c.prototype.getBindings=function(){return this.aBindings;};c.prototype.hasValidation=function(){if(this.getType()){return true;}var e=this.getBindings();for(var i=0;i<e.length;++i){if(e[i].hasValidation()){return true;}}return false;};c.prototype.attachChange=function(f,l){var t=this;this.fChangeHandler=function(e){var o=e.getSource();if(o.getBindingMode()==B.OneTime){o.detachChange(t.fChangeHandler);}t.checkUpdate(true);};this.attachEvent("change",f,l);if(this.aBindings){q.each(this.aBindings,function(i,o){o.attachChange(t.fChangeHandler);});}};c.prototype.detachChange=function(f,l){var t=this;this.detachEvent("change",f,l);if(this.aBindings){q.each(this.aBindings,function(i,o){o.detachChange(t.fChangeHandler);});}};c.prototype.attachDataStateChange=function(f,l){var t=this;this.fDataStateChangeHandler=function(e){var o=e.getSource();if(o.getBindingMode()==B.OneTime){o.detachDataStateChange(t.fChangeHandler);}t.checkDataState();};this.attachEvent("DataStateChange",f,l);if(this.aBindings){q.each(this.aBindings,function(i,o){o.attachEvent("DataStateChange",t.fDataStateChangeHandler);});}};c.prototype.detachDataStateChange=function(f,l){var t=this;this.detachEvent("DataStateChange",f,l);if(this.aBindings){q.each(this.aBindings,function(i,o){o.detachEvent("DataStateChange",t.fDataStateChangeHandler);});}};c.prototype.attachAggregatedDataStateChange=function(f,l){var t=this;if(!this.fDataStateChangeHandler){this.fDataStateChangeHandler=function(e){var o=e.getSource();if(o.getBindingMode()==B.OneTime){o.detachDataStateChange(t.fChangeHandler);}t.checkDataState();};}this.attachEvent("AggregatedDataStateChange",f,l);if(this.aBindings){q.each(this.aBindings,function(i,o){o.attachEvent("DataStateChange",t.fDataStateChangeHandler);});}};c.prototype.detachAggregatedDataStateChange=function(f,l){var t=this;this.detachEvent("AggregatedDataStateChange",f,l);if(this.aBindings){q.each(this.aBindings,function(i,o){o.detachEvent("DataStateChange",t.fDataStateChangeHandler);});}};c.prototype.updateRequired=function(m){var u=false;q.each(this.aBindings,function(i,o){u=u||o.updateRequired(m);});return u;};c.prototype.initialize=function(){this.bPreventUpdate=true;if(this.aBindings){q.each(this.aBindings,function(i,o){o.initialize();});}this.bPreventUpdate=false;this.checkUpdate(true);return this;};c.prototype.getDataState=function(){if(!this.oDataState){this.oDataState=new b(this.aBindings.map(function(o){return o.getDataState();}));}return this.oDataState;};c.prototype.checkUpdate=function(f){if(this.bPreventUpdate){return;}var v=this.getValue();if(!q.sap.equal(v,this.aValues)||f){this.aValues=v;this._fireChange({reason:C.Change});}};c.prototype._updateDataState=function(){var D=P.prototype._updateDataState.apply(this,arguments);var m=D.getChanges();for(var k in m){switch(k){case"value":D.setValue(this._toExternalValue(m[k]));break;case"originalValue":D.setOriginalValue(this._toExternalValue(m[k]));break;case"invalidValue":case"controlMessages":case"modelMessages":case"messages":case"dirty":break;default:D.setProperty(k,m[k]);break;}}if(this.vInvalidValue){D.setInvalidValue(this.vInvalidValue);}else{var i=D.getInternalProperty("invalidValue");if(i&&d(i)){D.setInvalidValue(this._toExternalValue(i));}else{D.setInvalidValue(null);}}return D;};function d(v){if(Array.isArray(v)){for(var i=0;i<v.length;i++){if(v[i]!==null&&v[i]!==undefined){return true;}}return false;}else{return!!v;}}return c;});