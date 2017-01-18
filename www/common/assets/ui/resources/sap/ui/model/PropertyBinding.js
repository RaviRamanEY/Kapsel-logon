/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./Binding','./SimpleType','./DataState'],function(q,B,S,D){"use strict";var P=B.extend("sap.ui.model.PropertyBinding",{constructor:function(m,p,c,a){B.apply(this,arguments);this.vInvalidValue=null;},metadata:{"abstract":true,publicMethods:["getValue","setValue","setType","getType","setFormatter","getFormatter","getExternalValue","setExternalValue","getBindingMode"]}});P.prototype.getExternalValue=function(){return this._toExternalValue(this.getValue());};P.prototype._toExternalValue=function(v){if(this.oType){v=this.oType.formatValue(v,this.sInternalType);}if(this.fnFormatter){v=this.fnFormatter(v);}return v;};P.prototype.setExternalValue=function(v){if(this.fnFormatter){q.sap.log.warning("Tried to use twoway binding, but a formatter function is used");return;}try{if(this.oType){v=this.oType.parseValue(v,this.sInternalType);this.oType.validateValue(v);}}catch(e){this.vInvalidValue=v;this.checkDataState();throw e;}this.vInvalidValue=null;this.setValue(v);};P.prototype.setType=function(t,i){this.oType=t;this.sInternalType=i;};P.prototype.getType=function(){return this.oType;};P.prototype.setFormatter=function(f){this.fnFormatter=f;};P.prototype.getFormatter=function(){return this.fnFormatter;};P.prototype.getBindingMode=function(){return this.sMode;};P.prototype.setBindingMode=function(b){this.sMode=b;};P.prototype._updateDataState=function(){var d=B.prototype._updateDataState.call(this);if(this.oModel&&this.sPath){d.setInvalidValue(this.vInvalidValue);try{var o=this.oModel.getOriginalProperty(this.sPath,this.oContext);d.setOriginalValue(this._toExternalValue(o));d.setOriginalInternalValue(o);}catch(e){q.sap.log.debug("type validation of original model value failed");}try{d.setValue(this.getExternalValue());}catch(e){q.sap.log.debug("formatting of value failed");}}d.setInternalValue(this.getValue());return d;};return P;});