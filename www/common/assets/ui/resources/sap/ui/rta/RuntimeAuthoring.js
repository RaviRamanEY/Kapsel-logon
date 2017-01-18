/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */
sap.ui.define(['sap/ui/base/ManagedObject','sap/ui/rta/ui/ToolsMenu','sap/ui/comp/smartform/flexibility/FormP13nHandler','sap/ui/dt/Preloader','sap/ui/dt/ElementUtil','sap/ui/dt/DesignTime','sap/ui/dt/OverlayRegistry','sap/ui/rta/command/Stack','sap/ui/rta/command/CommandFactory','sap/ui/rta/plugin/Rename','sap/ui/rta/plugin/DragDrop','sap/ui/rta/plugin/RTAElementMover','sap/ui/dt/plugin/CutPaste','sap/ui/rta/plugin/Hide','sap/ui/rta/plugin/Selection','sap/ui/rta/plugin/MultiSelection','sap/ui/dt/plugin/ContextMenu','sap/ui/rta/controlAnalyzer/ControlAnalyzerFactory','sap/ui/fl/FlexControllerFactory','sap/ui/rta/ui/SettingsDialog','sap/ui/rta/ui/AddElementsDialog','./Utils','./ModelConverter','sap/ui/fl/Transports','sap/ui/fl/Utils','sap/m/MessageBox','sap/ui/comp/smartform/GroupElement','sap/ui/comp/smartform/Group','sap/ui/comp/smartform/SmartForm','sap/ui/comp/smarttable/SmartTable','sap/uxap/ObjectPageLayout','sap/uxap/ObjectPageSection'],function(M,T,F,D,E,a,O,C,b,R,c,d,e,H,S,f,g,h,l,m,A,U,n,o,p,q,G,r,s,t,u,v){"use strict";var w=M.extend("sap.ui.rta.RuntimeAuthoring",{metadata:{library:"sap.ui.rta",associations:{"rootControl":{type:"sap.ui.core.Control"}},properties:{"customFieldUrl":"string","showCreateCustomField":"boolean","showToolbars":{type:"boolean",defaultValue:true}},events:{"start":{},"stop":{},"undoRedoStackModified":{}}},_sAppTitle:null});w.prototype.start=function(){var i=["sap.ui.comp.smartform.Group","sap.ui.comp.smartform.GroupElement","sap.ui.table.Column","sap.uxap.ObjectPageSection"];var j=this;this._aPopups=[];this._oTextResources=sap.ui.getCore().getLibraryResourceBundle("sap.ui.rta");this._aSupportedControls=["sap.ui.comp.smartform.Group","sap.uxap.ObjectPageSection","sap.uxap.ObjectPageLayout"];if(!this._oDesignTime){this._rootControl=sap.ui.getCore().byId(this.getRootControl());this._oCommandStack=new C();this._oCommandStack.attachModified(function(){j.fireUndoRedoStackModified();});var k=sap.ui.dt.ElementUtil.findAllPublicElements(this._rootControl);this._oRTADragDropPlugin=new c({draggableTypes:i});this._oRTADragDropPlugin.attachElementMoved(this._handleMoveElement,this);this._oRTADragDropPlugin.attachDragStarted(this._handleStopCutPaste,this);this._oCutPastePlugin=new e({movableTypes:i,elementMover:new d({movableTypes:i})});this._oCutPastePlugin.attachElementMoved(this._handleMoveElement,this);this._oHidePlugin=new H();this._oHidePlugin.attachHideElement(this._handleHideElement,this);this._oRenamePlugin=new R({commandStack:this._oCommandStack});this._oRenamePlugin.attachEditable(this._handleStopCutPaste,this);this._oSelectionPlugin=new S();this._oMultiSelectionPlugin=new f({multiSelectionTypes:["sap.ui.comp.smartform.GroupElement"]});this._oContextMenuPlugin=new g();this._buildContextMenu();sap.ui.dt.Preloader.load(k).then(function(){j._oDesignTime=new a({rootElements:[j._rootControl],plugins:[j._oRTADragDropPlugin,j._oCutPastePlugin,j._oHidePlugin,j._oRenamePlugin,j._oSelectionPlugin,j._oMultiSelectionPlugin,j._oContextMenuPlugin]});j.fireStart();});}this._fnOnKeyDown=this._onKeyDown.bind(this);jQuery(document).keydown(this._fnOnKeyDown);this._openPopup=sap.ui.core.Popup.prototype.open;sap.ui.core.Popup.prototype.open=function(){if(j._aPopups.indexOf(this)===-1){j._aPopups.push(this);}jQuery(document).unbind("keydown",j._fnOnKeyDown);var W=Array.prototype.slice.call(arguments);j._openPopup.apply(this,W);};this._closePopup=sap.ui.core.Popup.prototype.close;sap.ui.core.Popup.prototype.close=function(){var W=j._aPopups.indexOf(this);if(W!==-1){j._aPopups.splice(W,1);if(j._aPopups.length===0){jQuery(document).keydown(j._fnOnKeyDown);}}var X=Array.prototype.slice.call(arguments);j._closePopup.apply(this,X);};if(this.getShowToolbars()){this._createToolsMenu();var V={"onAfterRendering":function(){this._oToolsMenu._oToolBarTop.focus();this._oToolsMenu._oToolBarTop.removeEventDelegate(V,this);}};this._oToolsMenu._oToolBarTop.addEventDelegate(V,this);this._oToolsMenu.show();}this._oldUnloadHandler=window.onbeforeunload;window.onbeforeunload=this._onUnload.bind(this);};w.prototype.stop=function(){var i=this;return this._serializeToLrep().then(function(){i.exit();i.fireStop();});};w.prototype.undo=function(){this._onUndo();};w.prototype.redo=function(){this._onRedo();};w.prototype.restore=function(){this._onRestore();};w.prototype.transport=function(){this._onTransport();};w.prototype.canUndo=function(){return this._oCommandStack.canUndo();};w.prototype.canRedo=function(){return this._oCommandStack.canRedo();};w.prototype._onUnload=function(){var i=this._oCommandStack.canUndo()||this._oCommandStack.canRedo();if(i){var j=this._oTextResources.getText("MSG_UNSAVED_CHANGES");return j;}else{window.onbeforeunload=this._oldUnloadHandler;}};w.prototype._serializeToLrep=function(){var j=l.createForControl(this._rootControl);var k=this._oCommandStack.serialize();var V=this._oCommandStack.getSerializableCommands();k.forEach(function(X,i){var Y=V[i].getElement();j.addChange(X,Y);});var W=this;return j.saveAll().then(function(){jQuery.sap.log.info("Runtime adaptation successfully transfered changes to layered repository");W._oCommandStack.removeAllCommands();},function(i){var X=i.message||i.status||i;jQuery.sap.log.error("Failed to transfer runtime adaptation changes to layered repository",X);jQuery.sap.require("sap.m.MessageBox");var Y=W._oTextResources.getText("MSG_LREP_TRANSFER_ERROR")+"\n"+W._oTextResources.getText("MSG_ERROR_REASON",X);sap.m.MessageBox.error(Y);});};w.prototype._onUndo=function(){this._handleStopCutPaste();this._oCommandStack.undo();};w.prototype._onRedo=function(){this._handleStopCutPaste();this._oCommandStack.redo();};w.prototype._createToolsMenu=function(){if(!this._oToolsMenu){this._sAppTitle=this._getApplicationTitle();this._oToolsMenu=new T();this._oToolsMenu.setTitle(this._sAppTitle);this._oToolsMenu.setRootControl(this._rootControl);this._oToolsMenu.adaptButtonsVisibility();this._oToolsMenu.attachUndo(this._onUndo,this);this._oToolsMenu.attachRedo(this._onRedo,this);this._oToolsMenu.attachClose(this.stop,this);this._oToolsMenu.attachTransport(this._onTransport,this);this._oToolsMenu.attachRestore(this._onRestore,this);var i=this;this._oCommandStack.attachModified(function(){i._oToolsMenu.adaptUndoRedoEnablement(i._oCommandStack.canUndo(),i._oCommandStack.canRedo());});}};w.prototype.exit=function(){if(this._oToolsMenu){this._oToolsMenu.destroy();this._oToolsMenu=null;}if(this._oDesignTime){this._oDesignTime.destroy();this._oDesignTime=null;}if(this._fnOnKeyDown){jQuery(document).unbind("keydown",this._fnOnKeyDown);this._fnOnKeyDown=null;}sap.ui.core.Popup.prototype.open=this._openPopup;sap.ui.core.Popup.prototype.close=this._closePopup;if(this._handler){if(this._handler._oDialog){this._handler._oDialog.destroy();}this._handler=null;}window.onbeforeunload=this._oldUnloadHandler;};w.prototype._onKeyDown=function(i){if((i.keyCode===jQuery.sap.KeyCodes.TAB)&&(i.shiftKey===false)&&(i.altKey===false)&&(i.ctrlKey===false)){i.preventDefault();this._focusNextElement();}else if((i.keyCode===jQuery.sap.KeyCodes.TAB)&&(i.shiftKey===true)&&(i.altKey===false)&&(i.ctrlKey===false)){i.preventDefault();this._focusPrevElement();}};w.prototype._focusNextElement=function(){var i=this._checkCurrentFocusedElement();if(i==="NOT RTA"){this._oToolsMenu._oToolBarTop.focus();}else if(i==="OVERLAY"){this._handleNextOverlay();}else if(i.indexOf("TB")!==-1){this._handleNextTbElement();}};w.prototype._focusPrevElement=function(){var i=this._checkCurrentFocusedElement();if(i==="NOT RTA"){this._oToolsMenu._oToolBarTop.focus();}else if(i==="OVERLAY"){this._handlePrevOverlay();}else if(i==="TOP TB"){this._handlePrevTbElement();}else if(i==="BOTTOM TB"){this._handlePrevOverlay();}else if(i==="TOP TB ELEMENT"){this._handlePrevTbElement();}else if(i==="BOTTOM TB ELEMENT"){this._handlePrevTbElement();}};w.prototype._checkCurrentFocusedElement=function(){var j;var k=document.activeElement;var i;this._aTbTopElements=this._oToolsMenu._oToolBarTop.getContent();var V=[];for(i=this._aTbTopElements.length-1;i>=0;i--){if(this._aTbTopElements[i].getId().indexOf("spacer")>-1){this._aTbTopElements.splice(i,1);}}var W=this._aTbTopElements.length;for(i=0;i<W;i++){V[i]=this._aTbTopElements[i].getId();}this._aTbBottomElements=this._oToolsMenu._oToolBarBottom.getContent();var X=[];for(i=this._aTbBottomElements.length-1;i>=0;i--){if(this._aTbBottomElements[i].getId().indexOf("spacer")>-1){this._aTbBottomElements.splice(i,1);}}var Y=this._aTbBottomElements.length;for(i=0;i<Y;i++){X[i]=this._aTbBottomElements[i].getId();}var Z=V.indexOf(k.id);var $=X.indexOf(k.id);if((k.getAttribute("class"))&&(k.getAttribute("class").search("sapUiDtOverlay")>-1)){this._sArea="OVERLAY";j="OVERLAY";return j;}else if((k.getAttribute("class"))&&(k.getAttribute("class").search("sapUiRTAToolBarTop")>-1)){this._sArea="TOP";this._iActive=-1;this._aElements=this._aTbTopElements;j="TOP TB";return j;}else if((k.getAttribute("class"))&&(k.getAttribute("class").search("sapUiRTAToolBarBottom")>-1)){this._sArea="BOTTOM";this._iActive=-1;this._aElements=this._aTbBottomElements;j="BOTTOM TB";return j;}else if(Z>-1){this._sArea="TOP";this._iActive=Z;this._aElements=this._aTbTopElements;j="TOP TB ELEMENT";return j;}else if($>-1){this._sArea="BOTTOM";this._iActive=$;this._aElements=this._aTbBottomElements;j="BOTTOM TB ELEMENT";return j;}else{j="NOT RTA";return j;}};w.prototype._loopOverTbElements=function(i,j){for(var k=j,V=(i)?-1:this._aElements.length,W=(i)?-1:1;k!=V;k+=W){this._aElements[k].focus();if(this._aElements[k].getId()===document.activeElement.id){break;}if(k===V-W){if(!i){(this._sArea==="TOP")?this._handleNextOverlay():this._oToolsMenu._oToolBarTop.focus();}else{if(((this._sArea==="TOP")&&(this._iActive===-1))||(this._sArea==="OVERLAY")){this._oToolsMenu._oToolBarBottom.focus();}else if(((this._sArea==="TOP")&&(this._iActive>0))||(this._sArea==="BOTTOM")){this._oToolsMenu._oToolBarTop.focus();}}}}};w.prototype._handleNextTbElement=function(){if(this._iActive===this._aElements.length-1){(this._sArea==="TOP")?this._handleNextOverlay():this._oToolsMenu._oToolBarTop.focus();}else{this._loopOverTbElements(false,this._iActive+1);}};w.prototype._handlePrevTbElement=function(){if(this._sArea==="TOP"){switch(this._iActive){case-1:this._aElements=this._aTbBottomElements;if(this._aElements.length===0){this._oToolsMenu._oToolBarBottom.focus();}else{this._loopOverTbElements(true,this._aElements.length-1);}break;case 0:this._oToolsMenu._oToolBarTop.focus();break;default:this._loopOverTbElements(true,this._iActive-1);}}else if(this._sArea==="OVERLAY"){this._aElements=this._aTbTopElements;if(this._aElements.length===0){this._oToolsMenu._oToolBarTop.focus();}else{this._loopOverTbElements(true,this._aElements.length-1);}}else if(this._sArea==="BOTTOM"){switch(this._iActive){case 0:this._oToolsMenu._oToolBarBottom.focus();break;default:this._loopOverTbElements(true,this._iActive-1);}}};w.prototype._handleNextOverlay=function(){var i;if(this._sArea==="TOP"){i=U.getFirstFocusableOverlay();(i)?i.focus():this._oToolsMenu._oToolBarBottom.focus();}else if(this._sArea==="OVERLAY"){i=U.getNextFocusableOverlay();(i)?i.focus():this._oToolsMenu._oToolBarBottom.focus();}};w.prototype._handlePrevOverlay=function(){var i;if(this._sArea==="BOTTOM"){i=U.getLastFocusableOverlay();if(i){i.focus();}else{this._sArea="OVERLAY";this._handlePrevTbElement();}}else if(this._sArea==="OVERLAY"){i=U.getPreviousFocusableOverlay();(i)?i.focus():this._handlePrevTbElement();}};w.prototype._onTransport=function(){var i=this;var j=l.createForControl(this._rootControl);this._handleStopCutPaste();this._ensureFormP13Handler();this._serializeToLrep();function k(W){p.log.error("Changes could not be applied or saved: "+W);return i._handler._showApplySaveChangesErrorMessage(W).then(function(){throw new Error('createAndApply failed');});}function V(W){if(W.message==='createAndApply failed'){return;}p.log.error("transport error"+W);return i._handler._showTransportErrorMessage(W);}return j.getComponentChanges().then(function(W){return i._handler._convertToChangeArray(W);}).then(function(W){if(W.length>0){return i._createAndApplyChanges(W,j);}})['catch'](k).then(function(){return j.getComponentChanges();}).then(function(W){return!!W.length;}).then(function(W){if(W){return i._handler._openTransportSelection(null,true);}else{return i._handler._showTransportInapplicableMessage();}}).then(function(W){if(W&&W.transport&&W.packageName!=="$TMP"){return i._transportAllLocalChanges(W,j);}})['catch'](V);};w.prototype._createAndApplyChanges=function(i,j){var k=this;return Promise.resolve().then(function(){function V(W){return W&&W.selector&&W.selector.id;}i.filter(V).forEach(function(W){var X=k._handler._getControlById(W.selector.id);j.createAndApplyChange(W,X);});})['catch'](function(V){p.log.error("Create and apply error: "+V);return V;}).then(function(V){return j.saveAll().then(function(){if(V){throw V;}});})['catch'](function(V){p.log.error("Create and apply and/or save error: "+V);return k._handler._showApplySaveChangesErrorMessage(V);});};w.prototype._deleteChanges=function(i,j){var k=this;var V=i.length-1;return this._handler._setTransports(i,V).then(function(){return j.discardChanges(i);}).then(function(){k._handler._showDiscardSuccessMessage();return window.location.reload();})["catch"](function(W){return k._handler._showDiscardErrorMessage(W);});};w.prototype._ensureFormP13Handler=function(){if(!this._handler){this._handler=new F();this._handler._textResources=sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp");}};w.prototype._onRestore=function(){var i=this;var j=this._oTextResources.getText("FORM_PERS_RESET_MESSAGE");var k=this._oTextResources.getText("FORM_PERS_RESET_TITLE");this._handleStopCutPaste();this._ensureFormP13Handler();this._serializeToLrep();function V(W){if(W==="OK"){var X=l.createForControl(i._rootControl);X.getComponentChanges().then(function(Y){var Z=i._handler._convertToChangeArray(Y);return i._deleteChanges(Z,X);})["catch"](function(Y){return i._handler._showDiscardErrorMessage();});}}q.confirm(j,{title:k,onClose:V});};w.prototype._transportAllLocalChanges=function(i,j){var k=this;return j.getComponentChanges().then(function(V){var W=k._handler._convertToChangeTransportData(V);var X=new o();var Y={};Y.transportId=i.transport;Y.changeIds=W;return X.makeChangesTransportable(Y).then(function(){V.forEach(function(Z){if(Z.getPackage()==='$TMP'){var $=Z.getDefinition();$.packageName='';Z.setResponse($);}});}).then(function(){return k._handler._showTransportSuccessMessage();});});};w.prototype._isEqualParentInfo=function(i,j){var k=!!i&&!!j;if(k&&(i.parent&&j.parent)){k=i.parent.getId()===j.parent.getId();}if(k&&(i.index||j.index)){k=i.index===j.index;}if(k&&(i.aggregation||j.aggregation)){k=i.aggregation===j.aggregation;}return k;};w.prototype._handleMoveElement=function(i){var j=i.getParameter("data");if(j&&!this._isEqualParentInfo(j.source,j.target)){var k=b.getCommandFor(j.source.parent,"Move");k.setMovedElements([{element:j.element,sourceIndex:j.source.index,targetIndex:j.target.index}]);k.setSource(j.source);k.setTarget(j.target);this._oCommandStack.pushAndExecute(k);}};w.prototype._handleHideElement=function(i){var j=(i.mParameters)?i.getParameter("element"):i;if(I(j)&&U.hasGroupElementUnBoundFields(j)){return;}if(x(j)&&U.hasGroupUnBoundFields(j)){return;}this._handleStopCutPaste();var k=this;var j=(i.mParameters)?i.getParameter("element"):i;if(U.isElementHideable(j)){var V=b.getCommandFor(j,"Hide");this._oCommandStack.pushAndExecute(V);}else{U.openHideElementConfirmationDialog(j).then(function(W){if(W){var V=b.getCommandFor(j,"Hide");k._oCommandStack.pushAndExecute(V);}});}};w.prototype._openSettingsDialog=function(i){var j=(i.mParameters)?i.getParameter("element"):i;this._handleStopCutPaste();if(!this._oSettingsDialog){this._oSettingsDialog=new m({commandStack:this._oCommandStack});}this._oSettingsDialog.open(j);};w.prototype._openHideElementDialog=function(i){var j=this;var k;var V;return new Promise(function(W,X){var Y=function(Z){if(Z==="OK"){W(true);}else{W(false);}};if(i instanceof r){k=j._oTextResources.getText("CTX_HIDE_GROUP_MESSAGE");V=j._oTextResources.getText("CTX_HIDE_GROUP_TITLE");}else{k=j._oTextResources.getText("CTX_HIDE_FIELD_MESSAGE");V=j._oTextResources.getText("CTX_HIDE_FIELD_TITLE");}q.confirm(k,{title:V,icon:"WARNING",onClose:Y});});};var I=function(i){return i instanceof G;};var x=function(i){return i instanceof r;};var y=function(i){return I(i)||x(i);};var z=function(i){return i instanceof s;};var B=function(i){if(p.isVendorLayer()){var j=["sap.ui.comp.smartfilterbar.SmartFilterBar","sap.ui.comp.smarttable.SmartTable","sap.ui.comp.smartform.SmartForm","sap.uxap.ObjectPageLayout","sap.uxap.ObjectPageHeaderActionButton","sap.uxap.ObjectPageHeader","sap.ui.table.Column"];return j.some(function(k){return E.isInstanceOf(i,k);});}};var J=function(i){return i instanceof v;};var K=function(i){return i instanceof u;};var L=function(i){return x(i)||z(i);};var N=function(i){return y(i)||z(i);};var P=function(i){return J(i)||K(i);};var Q=function(i){return function(j){return!i(j);};};w.prototype._buildContextMenu=function(){var i=this;this._oContextMenuPlugin.addMenuItem({id:"CTX_RENAME_LABEL",text:i._oTextResources.getText("CTX_RENAME_LABEL"),handler:this._handleRenameLabel.bind(this),available:I});this._oContextMenuPlugin.addMenuItem({id:"CTX_RENAME_GROUP",text:i._oTextResources.getText("CTX_RENAME_GROUP"),handler:this._handleRenameLabel.bind(this),available:x});this._oContextMenuPlugin.addMenuItem({id:"CTX_ADD_FIELD",text:i._oTextResources.getText("CTX_ADD_FIELD"),handler:this._handleAddElement.bind(this),available:y});this._oContextMenuPlugin.addMenuItem({id:"CTX_ADD_GROUP",text:i._oTextResources.getText("CTX_ADD_GROUP"),handler:this._handleAddGroup.bind(this),available:L});this._oContextMenuPlugin.addMenuItem({id:"CTX_ADD_SECTION",text:i._oTextResources.getText("CTX_ADD_SECTION"),handler:this._handleAddElement.bind(this),available:P,enabled:U.hasObjectPageLayoutInvisibleSections.bind(U)});this._oContextMenuPlugin.addMenuItem({id:"CTX_HIDE_FIELD",text:i._oTextResources.getText("CTX_HIDE_FIELD"),handler:this._handleHideElement.bind(this),available:I,enabled:Q(U.hasGroupElementUnBoundFields.bind(U))});this._oContextMenuPlugin.addMenuItem({id:"CTX_HIDE_GROUP",text:i._oTextResources.getText("CTX_HIDE_GROUP"),handler:this._handleHideElement.bind(this),available:x,enabled:Q(U.hasGroupUnBoundFields.bind(U))});this._oContextMenuPlugin.addMenuItem({id:"CTX_HIDE_SECTION",text:i._oTextResources.getText("CTX_HIDE_SECTION"),handler:this._handleHideElement.bind(this),available:J});this._oContextMenuPlugin.addMenuItem({id:"CTX_CUT",text:i._oTextResources.getText("CTX_CUT"),handler:this._handleCutElement.bind(this),available:y});this._oContextMenuPlugin.addMenuItem({id:"CTX_PASTE",text:i._oTextResources.getText("CTX_PASTE"),handler:this._handlePasteElement.bind(this),available:y,enabled:function(j){var k=O.getOverlay(j.getId());return i._oCutPastePlugin.isElementPasteable(k);}});this._oContextMenuPlugin.addMenuItem({id:"CTX_GROUP_FIELDS",text:i._oTextResources.getText("CTX_GROUP_FIELDS"),handler:this._handleGroupElements.bind(this),available:function(j){var k=i._oDesignTime.getSelection();return(k&&k.length>1);},enabled:function(j){var k=false;var V=i._oDesignTime.getSelection();V.some(function(W){var j=W.getElementInstance();if(U.hasGroupElementUnBoundFields(j)){k=true;return true;}});return!k;}});this._oContextMenuPlugin.addMenuItem({id:"CTX_UNGROUP_FIELDS",text:i._oTextResources.getText("CTX_UNGROUP_FIELDS"),handler:this._handleUngroupElements.bind(this),available:function(j){return I(j)&&j.getFields().length>1;},enabled:Q(U.hasGroupElementUnBoundFields.bind(U))});this._oContextMenuPlugin.addMenuItem({id:"CTX_SETTINGS",text:"Settings",handler:this._openSettingsDialog.bind(this),available:B});this._oContextMenuPlugin.addMenuItem({id:"CTX_ADAPT",text:i._oTextResources.getText("CTX_ADAPT"),startSection:Q(z),handler:this._handleAdaptElement.bind(this),available:N});};w.prototype._handleRenameLabel=function(i){var j=O.getOverlay(i.getId());this._oRenamePlugin.startEdit(j);};w.prototype._handleAddElement=function(i){this._handleStopCutPaste();if(!this._oAddElementsDialog){this._oAddElementsDialog=new A({rootControl:this._rootControl,commandStack:this._oCommandStack});}this._oAddElementsDialog.open(i);};w.prototype._handleCutElement=function(i){var j=O.getOverlay(i.getId());this._oCutPastePlugin.cut(j);};w.prototype._handlePasteElement=function(i){var j=O.getOverlay(i.getId());this._oCutPastePlugin.paste(j);};w.prototype._handleStopCutPaste=function(){this._oCutPastePlugin.stopCutAndPaste();};w.prototype._handleGroupElements=function(V){this._handleStopCutPaste();var W=this;var X=this._oDesignTime.getSelection();var Y=X.slice(0);var Z=Y[0].getElementInstance();var $=U.findSupportedBlock(Z,this._aSupportedControls);var _=U.getClosestTypeForControl(Z,"sap.ui.comp.smartform.SmartForm");var a1=_.getEntityType();if(a1){a1=a1.replace(/\s+/g,'').match(/([^,]+)/g);}var b1=U.getClosestViewFor(_);var c1=b.getCommandFor($,"Composite");var d1=b.getCommandFor($,"Add");c1.addCommand(d1);var e1;$.getGroupElements().some(function(i,j,k){if(i.getId()===Z.getId()){e1=j;return true;}});d1.setIndex(e1?e1:$.getGroupElements().length+1);d1.setNewControlId(b1.createId(jQuery.sap.uid()));var f1=[];var g1=[];var h1=[];var i1=[];return this._getFieldModel(_,a1).then(function(j1){for(var i=0;i<Y.length;i++){var k1=Y[i].getElementInstance();var l1=b.getCommandFor(k1,"Hide");c1.addCommand(l1);for(var j=0;j<k1.getFields().length;j++){var m1=k1.getFields()[j];var n1=W._getControlBindingInfo(m1);for(var k=0;k<j1.length;k++){if(j1[k]["name"]===n1.bindingPath){f1.push(m1.getMetadata().getName());g1.push(j1[k]["sap:label"]?j1[k]["sap:label"]:" ");h1.push(m1.getBindingPath(j1[k]["boundProperty"]));i1.push(j1[k]["boundProperty"]);}}}Y[i].setSelected(false);}d1.setJsTypes(f1);d1.setLabels(g1);d1.setFieldValues(h1);d1.setValuePropertys(i1);W._oCommandStack.pushAndExecute(c1);});};w.prototype._handleUngroupElements=function(j){this._handleStopCutPaste();var V=this._oDesignTime.getSelection();var W=V[0].getElementInstance();var X=this;var Y=U.findSupportedBlock(W,this._aSupportedControls);var Z=U.getClosestTypeForControl(W,"sap.ui.comp.smartform.SmartForm");var $=Z.getEntityType();if($){$=$.replace(/\s+/g,'').match(/([^,]+)/g);}var _=b.getCommandFor(Y,"Composite");var a1=W.getFields();var b1;var X=this;return this._getFieldModel(Z,$).then(function(c1){var d1=Y.getGroupElements().length;for(var i=0;i<a1.length;i++){var e1=a1[i];var f1=X._getControlBindingInfo(e1);b1=X._getFieldId(Z,f1.bindingPath);var g1=sap.ui.getCore().byId(b1);if(g1&&g1.getFields().length<2){var h1=b.getCommandFor(g1,"Unhide");_.addCommand(h1);}else{b1=U.createFieldLabelId(Y,$,f1.bindingPath);g1=sap.ui.getCore().byId(b1);if(g1){var h1=b.getCommandFor(g1,"Unhide");_.addCommand(h1);}else{for(var k=0;k<c1.length;k++){if(c1[k]["name"]===f1.bindingPath){var i1=b.getCommandFor(Y,"Add");d1++;i1.setNewControlId(b1);i1.setIndex(d1);i1.setJsTypes([e1.getMetadata().getName()]);i1.setLabels([c1[k]["sap:label"]?c1[k]["sap:label"]:" "]);i1.setFieldValues([e1.getBindingPath(c1[k]["boundProperty"])]);i1.setValuePropertys([f1.valueProperty]);_.addCommand(i1);}}}}}var j1=b.getCommandFor(W,"Hide");_.addCommand(j1);X._oCommandStack.pushAndExecute(_);});};w.prototype._getFieldId=function(j,k){var V=E.findAllPublicElements(j);var i=0;for(i=0;i<V.length;i++){var W=V[i];if(W.mBindingInfos){for(var X in W.mBindingInfos){var Y=W.mBindingInfos[X].parts[0].path?W.mBindingInfos[X].parts[0].path:"";Y=Y.split("/")[Y.split("/").length-1];var Z=W.getParent();if(Z&&k===Y){if(Y&&!W.getDomRef()){return Z.getId();}}}}}};w.prototype._getControlBindingInfo=function(j){var k=E.findAllPublicElements(j);var i=0;for(i=0;i<k.length;i++){var V=k[i];if(V.mBindingInfos){for(var W in V.mBindingInfos){var X=V.mBindingInfos[W].parts[0].path?V.mBindingInfos[W].parts[0].path:"";X=X.split("/")[X.split("/").length-1];var Y=V.getParent();if(Y){if(X&&V.getDomRef()){return{valueProperty:W,bindingPath:X};}}}}}};w.prototype._getFieldModel=function(i,j){var k=h.getControlAnalyzerFor(i);return n.getConvertedModelWithBoundAndRenamedLabels(i,j,k);};w.prototype._handleAddGroup=function(j){this._handleStopCutPaste();var k=this;var V=U.getClosestViewFor(j);var W=U.getClosestTypeForControl(j,"sap.ui.comp.smartform.SmartForm");var X=b.getCommandFor(W,"Add");X.setNewControlId(V.createId(jQuery.sap.uid()));X.setLabels(["New Group"]);var Y=0;if(j.getMetadata().getName()==="sap.ui.comp.smartform.Group"){var Z=j.getParent().getAggregation("formContainers");for(var i=0;i<Z.length;i++){if(Z[i].getId()===j.getId()){Y=i+1;break;}}}X.setIndex(Y);this._oCommandStack.pushAndExecute(X);var $=O.getOverlay(X.getNewControlId());$.setSelected(true);var _={"onAfterRendering":function(){setTimeout(function(){k._oRenamePlugin.startEdit($);},0);$.removeEventDelegate(_);}};$.addEventDelegate(_);};w.prototype._getSmartFormForElement=function(i){while(i&&!E.isInstanceOf(i,"sap.ui.comp.smartform.SmartForm")){i=i.getParent();}return i;};w.prototype._handleAdaptElement=function(i,j){this._handleStopCutPaste();var k=this;return this._serializeToLrep().then(function(){k._ensureFormP13Handler();var V=k._getSmartFormForElement(i);k._handler.init(V);if(j){j(k._handler);}k._handler.show();});};w.prototype._getApplicationTitle=function(){var i="";var j=sap.ui.core.Component.getOwnerComponentFor(this._rootControl);if(j){i=j.getMetadata().getManifestEntry("sap.app").title;}return i;};return w;},true);
