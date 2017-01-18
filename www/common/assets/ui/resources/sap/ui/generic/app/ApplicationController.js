/*
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2016 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","./transaction/BaseController","./transaction/TransactionController"],function(q,B,T){"use strict";var A=B.extend("sap.ui.generic.app.ApplicationController",{constructor:function(m,v){B.apply(this,[m]);this._oGroupChanges={};this.sName="sap.ui.generic.app.ApplicationController";this._initModel(m);this.registerView(v);}});A.prototype.propertyChanged=function(e,p,b,c){var t=this,f,P={batchGroupId:"Changes",changeSetId:"Changes",binding:b,onlyIfPending:true,noShowResponse:true,noBlockUI:true};f=c.getInnerControls()[0].getFieldGroupIds();if(f){f.forEach(function(i){t.registerGroupChange(i);});}return new Promise(function(r,a){setTimeout(function(){t.triggerSubmitChanges(P).then(function(R){r(R);},function(E){a(E);});});});};A.prototype.registerGroupChange=function(g){this._oGroupChanges[g]=true;};A.prototype.registerView=function(v){var t=this;if(v){this._oView=v;v.attachValidateFieldGroup(function(e){var I,o,l,i,a=[];if(e.mParameters.fieldGroupIds){l=e.mParameters.fieldGroupIds.length;}for(i=0;i<l;i++){I=e.mParameters.fieldGroupIds[i];o=t._oView.data(I);if(o){a.push({uuid:I,objid:o});}}t._onValidateFieldGroup(a);});}};A.prototype._initModel=function(m){m.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);m.setRefreshAfterChange(false);m.setDeferredBatchGroups(["Changes"]);m.setChangeBatchGroups({"*":{batchGroupId:"Changes",changeSetId:"Changes",single:false}});};A.prototype._onValidateFieldGroup=function(g){var i,l=g.length,r,R={bGlobal:false,aRequests:[]};for(i=0;i<l;i++){this._executeFieldGroup(g[i],R);}l=R.aRequests.length;for(i=0;i<l;i++){r=R.aRequests[i];r(R.bGlobal);}if(R.bGlobal){this._oModel.refresh(true,false,"Changes");}return this.triggerSubmitChanges({batchGroupId:"Changes",changeSetId:"Changes",noShowSuccessToast:true,forceSubmit:true,noBlockUI:true,urlParameters:{}});};A.prototype._executeFieldGroup=function(g,r){var c,s,p={batchGroupId:"Changes",changeSetId:"Changes",noShowSuccessToast:true,forceSubmit:true,noBlockUI:true,urlParameters:{}};p.urlParameters.SideEffectsQualifier=g.objid.name.replace("com.sap.vocabularies.Common.v1.SideEffects","");if(p.urlParameters.SideEffectsQualifier.indexOf("#")===0){p.urlParameters.SideEffectsQualifier=p.urlParameters.SideEffectsQualifier.replace("#","");}c=this._oModel.getContext(g.objid.context);s=this._getSideEffect(g.objid);if(this._hasClientErrors(g.uuid)){return false;}if(!this._oGroupChanges[g.uuid]&&!this._oModel.hasPendingChanges()){return false;}this._oGroupChanges[g.uuid]=false;this._executeSideEffects(s,c,p,r);return true;};A.prototype._executeSideEffects=function(s,c,p,r){var t=this,f,m,M={"ValidationMessage":"validateDraft","ValueChange":"prepareDraft"};m=M[s.EffectTypes.EnumMember];this._setSelect(s,p,r);f=function(g){if(m){t.getTransactionController().getDraftController()[m](c,p);}if(!g){t._read(c.getPath(),p);}};r.aRequests.push(f);};A.prototype._hasClientErrors=function(g){var i,l,c,C;C=this._oView.getControlsByFieldGroupId(g);if(C){l=C.length;for(i=0;i<l;i++){c=C[i];if(c&&c.getParent){c=c.getParent();if(c&&c.checkClientError&&c.checkClientError()){return true;}}}}return false;};A.prototype._setSelect=function(s,p,r){var i,l=0,t,S="$select=";if(!r.bGlobal){if(s.TargetProperties){l=s.TargetProperties.length;}if(l>0){for(i=0;i<l;i++){if(i>0){S=S+",";}t=s.TargetProperties[i];S=S+t.PropertyPath;}}else{r.bGlobal=true;}}if(l>0){p.urlParameters=[S];}};A.prototype._getSideEffect=function(i){var m,r,M,f;m=this._oModel.getMetaModel();M="getOData"+i.originType.substring(0,1).toUpperCase()+i.originType.substring(1);if(i.originNamespace){f=i.originNamespace+"."+i.originName;}else{f=i.originName;}if(m[M]){r=m[M](f);if(r){return r[i.name];}}throw"Unknown SideEffect originType: "+i.originType;};A.prototype.getTransactionController=function(){if(!this._oTransaction){this._oTransaction=new T(this._oModel,this._oQueue,{noBatchGroups:true});}return this._oTransaction;};A.prototype.invokeActions=function(f,c,p){var C,i,l,a,P=[];l=c.length;a=this._getChangeSetFunc(f,c);for(i=0;i<l;i++){P.push(this._invokeAction(f,c[i],a(i)));}this._oModel.refresh(true,false,"Changes");p={batchGroupId:"Changes",changeSetId:"Changes"+a(i+1),successMsg:"Call of action succeeded",failedMsg:"Call of action failed",forceSubmit:true,context:C};P.push(this.triggerSubmitChanges(p));return this._newPromiseAll(P).then(function(r){if(r&&r.length>c.length){r.pop();}var i,b=false;if(c.length===r.length){var i;for(i=0;i<c.length;i++){r[i].actionContext=c[i];if(!r[i].error){b=true;}}}if(b){return r;}else{return Promise.reject(r);}});};A.prototype._newPromiseAll=function(p){var r=[];var R=Promise.resolve(null);p.forEach(function(P){R=R.then(function(){return P;}).then(function(o){r.push({response:o});},function(e){r.push({error:e});});});return R.then(function(){return Promise.resolve(r);});};A.prototype._getChangeSetFunc=function(f,c){var I,l=c.length,s=function(){return"Changes";};if(l===1){return s;}I=this._oMeta.getODataFunctionImport(f.split("/")[1]);if(I.allOrNothing){return s;}return function(i){return"Changes"+i;};};A.prototype._invokeAction=function(f,c,C){var t=this,p={batchGroupId:"Changes",changeSetId:C,successMsg:"Call of action succeeded",failedMsg:"Call of action failed",forceSubmit:true,context:c};return this._callAction(f,c,p).then(function(r){return t._normalizeResponse(r,true);},function(r){var o=t._normalizeError(r);throw o;});};A.prototype.destroy=function(){B.prototype.destroy.apply(this,[]);if(this._oTransaction){this._oTransaction.destroy();}this._oView=null;this._oModel=null;this._oTransaction=null;this._oGroupChanges=null;};return A;},true);