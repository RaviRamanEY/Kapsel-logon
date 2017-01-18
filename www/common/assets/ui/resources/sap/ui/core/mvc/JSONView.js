/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/base/ManagedObject','sap/ui/core/library','./View'],function(q,M,l,V){"use strict";var J=V.extend("sap.ui.core.mvc.JSONView",{metadata:{library:"sap.ui.core"}});(function(){sap.ui.jsonview=function(i,v){return sap.ui.view(i,v,sap.ui.core.mvc.ViewType.JSON);};J._sType=sap.ui.core.mvc.ViewType.JSON;J.asyncSupport=true;J.prototype.initViewSettings=function(s){if(!s){throw new Error("mSettings must be given");}if(s.viewName&&s.viewContent){throw new Error("View name and view content are given. There is no point in doing this, so please decide.");}else if(!s.viewName&&!s.viewContent){throw new Error("Neither view name nor view content is given. One of them is required.");}var t=this;var i=function(){if((t._oJSONView.resourceBundleName||t._oJSONView.resourceBundleUrl)&&(!s.models||!s.models[t._oJSONView.resourceBundleAlias])){var m=new sap.ui.model.resource.ResourceModel({bundleName:t._oJSONView.resourceBundleName,bundleUrl:t._oJSONView.resourceBundleUrl});t.setModel(m,t._oJSONView.resourceBundleAlias);}};if(s.viewName){if(s.async){return this._loadTemplate(s.viewName,{async:true}).then(i);}else{this._loadTemplate(s.viewName);i();}}else if(s.viewContent){this.mProperties["viewContent"]=s.viewContent;if(typeof s.viewContent==="string"){this._oJSONView=q.parseJSON(s.viewContent);if(!this._oJSONView){throw new Error("error when parsing viewContent: "+s.viewContent);}}else if(typeof s.viewContent==="object"){this._oJSONView=s.viewContent;}else{throw new Error("viewContent must be a JSON string or object, but is a "+(typeof s.viewContent));}if(s.async){return Promise.resolve().then(i);}else{i();}}};J.prototype.onControllerConnected=function(c){var t=this;M.runWithPreprocessors(function(){t.applySettings({content:t._oJSONView.content},c);},{id:function(i){return t.createId(i);},settings:function(s){var m=this.getMetadata(),v=m.getJSONKeys(),k,o,K;for(k in s){if((K=v[k])!==undefined){o=s[k];switch(K._iKind){case 3:if(typeof o==="string"){s[k]=t.createId(o);}break;case 5:if(typeof o==="string"){s[k]=V._resolveEventHandler(o,c);}break;}}}}});};J.prototype._loadTemplate=function(t,o){var r=q.sap.getResourceName(t,".view.json");if(!o||!o.async){this._oJSONView=q.sap.loadResource(r);}else{var a=this;return q.sap.loadResource(r,o).then(function(j){a._oJSONView=j;});}};J.prototype.getControllerName=function(){return this._oJSONView.controllerName;};}());return J;});
