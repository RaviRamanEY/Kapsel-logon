(function () {
    "use strict";
    /*global sap, jQuery */
    jQuery.sap.require("sap.ovp.cards.ActionUtils");
    jQuery.sap.require("sap.ui.generic.app.navigation.service.NavigationHandler");
    var ActionUtils = sap.ovp.cards.ActionUtils;

    sap.ui.controller("sap.ovp.cards.generic.Card", {

        onInit: function () {
            var oHeader = this.getView().byId("ovpCardHeader");
            oHeader.attachBrowserEvent("click", this.onHeaderClick.bind(this));
            oHeader.addEventDelegate({
                onkeydown: function (oEvent) {
                    if (!oEvent.shiftKey && (oEvent.keyCode == 13 || oEvent.keyCode == 32)) {
                        oEvent.preventDefault();
                        this.onHeaderClick();
                    }
                }.bind(this)
            });

            var oNumericControl = this.getView().byId("kpiNumberValue");
            if (oNumericControl) {
                oNumericControl.addEventDelegate({
                    onAfterRendering: function() {
                        var $numericControl = oNumericControl.$();
                        var $number = $numericControl.find(".sapMNCValueScr");
                        var $scale =  $numericControl.find(".sapMNCScale");
                        $number.attr("aria-label", $number.text());
                        $scale.attr("aria-label", $scale.text());
                    }
                });
            }
        },

        onAfterRendering: function(){
            var footer = this.getCardPropertiesModel().getProperty("/footerFragment");
            if (footer){
                this._handleActionFooter();
                this._handleCountFooter();
            }
        },

        onHeaderClick: function(){
            //call the navigation with the binded context to support single object cards such as quickview card
            this.doNavigation(this.getView().getBindingContext());
        },

        _handleActionFooter: function(footer){
            var actionFooter = this.getView().byId("ovpActionFooter");
            if (actionFooter) {
                var aActions = actionFooter.getContent();
                //remove the 'ToolbarSpacer'
                aActions = aActions.splice(1, aActions.length);
                var oLayoutData = aActions[0].getLayoutData();
                oLayoutData.setMoveToOverflow(false);
                oLayoutData.setStayInOverflow(false);
                if (aActions.length === 2) {
                    oLayoutData = aActions[1].getLayoutData();
                    oLayoutData.setMoveToOverflow(false);
                    oLayoutData.setStayInOverflow(false);
                }
            }
        },
        _handleCountFooter: function(){
            var countFooter = this.getView().byId("ovpCountFooter");
            if (countFooter) {
                //Gets the card items binding object
                var oItemsBinding = this.getCardItemsBinding();
                if (oItemsBinding) {
                    oItemsBinding.attachDataReceived(function () {
                        var iTotal = oItemsBinding.getLength();
                        var iCurrent = oItemsBinding.getCurrentContexts().length;
                        var countFooterText = sap.ui.getCore().getLibraryResourceBundle("sap.ovp").getText("Count_Footer", [iCurrent, iTotal]);
                        countFooter.setText(countFooterText);
                    });
                }
            }
        },

        /**
         * default empty implementation for the count footer
         */
        getCardItemsBinding: function(){
        },

        onActionPress: function(oEvent) {
            var sourceObject = oEvent.getSource(),
                oCustomData = this._getActionObject(sourceObject),
                context = sourceObject.getBindingContext();
            if (oCustomData.type.indexOf("DataFieldForAction") !== -1) {
                this.doAction(context, oCustomData);
            } else {
                this.doNavigation(context, oCustomData);
            }
        },
        _getActionObject: function(sourceObject) {
            var aCustomData = sourceObject.getCustomData();
            var oCustomData = {};
            for (var i = 0; i < aCustomData.length; i++) {
                oCustomData[aCustomData[i].getKey()] = aCustomData[i].getValue();
            }
            return oCustomData;
        },

        doNavigation: function (oContext, oNavigationField) {

            if (!oNavigationField) {
                oNavigationField = this.getEntityNavigationEntries(oContext)[0];
            }

            if ( oNavigationField ){
                switch ( oNavigationField.type ){
                    case "com.sap.vocabularies.UI.v1.DataFieldWithUrl":
                        window.open(oNavigationField.url);
                        break;
                    case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
                        this.doIntentBasedNavigation(oContext, oNavigationField);
                        break;
                }
            }
        },

        doIntentBasedNavigation: function (oContext, oIntent) {
            var oParametersPromise,
                oNavArguments,
                oCompactUrlPromise,
                oSupportedPromise,
                oCrossAppNavService = sap.ushell.Container.getService("CrossApplicationNavigation"),
                oEntity = oContext ? oContext.getObject() : null;

            if (oCrossAppNavService && oIntent) {
                oParametersPromise = this._getEntityNavigationParameters(oEntity);
                oParametersPromise.done(function(oParameters) {
                    oNavArguments = {
                        target: {
                            semanticObject: oIntent.semanticObject,
                            action: oIntent.action
                        },
                        params: oParameters
                    };

                    oCompactUrlPromise = oCrossAppNavService.hrefForExternal(oNavArguments, this.getOwnerComponent(), true);
                    oCompactUrlPromise.done(function (sIntent) {
                        oSupportedPromise = oCrossAppNavService.isIntentSupported([sIntent]);
                        oSupportedPromise.done(function (oTargets) {
                            //We are checking that the supported flag is not false, in case it undefined
                            //its means that this API was not implemented and we want to try to navigate
                            if (oTargets[sIntent].supported !== false) {
                                oCrossAppNavService.toExternal(oNavArguments, this.getOwnerComponent());
                            }
                        }.bind(this));
                    }.bind(this));
                }.bind(this));
            }
        },

        doAction: function (oContext, action) {
            this.actionData = ActionUtils.getActionInfo(oContext, action, this.getEntityType());
            if (this.actionData.allParameters.length > 0) {
                this._loadParametersForm();
            } else {
                this._callFunction();
            }
        },

        getEntityNavigationEntries: function (oContext, sAnnotationPath) {
            var aNavigationFields = [];
            var oEntityType = this.getEntityType();

            if (!sAnnotationPath){
                var oCardPropsModel = this.getCardPropertiesModel();
                var sIdentificationAnnotationPath = oCardPropsModel.getProperty("/identificationAnnotationPath");
                sAnnotationPath = sIdentificationAnnotationPath;
            }
            var aRecords = oEntityType[sAnnotationPath];

            for (var i = 0; Array.isArray(aRecords) && i < aRecords.length; i++) {
                if (aRecords[i].RecordType === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation") {
                    aNavigationFields.push({
                        type: aRecords[i].RecordType,
                        semanticObject: aRecords[i].SemanticObject.String,
                        action: aRecords[i].Action.String,
                        label: aRecords[i].Label.String
                    });
                }
                if (aRecords[i].RecordType === "com.sap.vocabularies.UI.v1.DataFieldWithUrl") {

                    var oModel = this.getView().getModel();
                    var oMetaData = oModel.oMetaModel;
                    var oEntityBindingContext = oMetaData.createBindingContext(oEntityType.$path);
                    var rawMMValue =  aRecords[i].Url.UrlRef ? aRecords[i].Url.UrlRef : aRecords[i].Url;
                    var sBindingString = sap.ui.model.odata.AnnotationHelper.format(oEntityBindingContext, rawMMValue);
                    var oCustomData = new sap.ui.core.CustomData({key: "url", value: sBindingString});
                    oCustomData.setModel(oModel);
                    oCustomData.setBindingContext(oContext);
                    var oUrl = oCustomData.getValue();

                    aNavigationFields.push({
                        type: aRecords[i].RecordType,
                        url: oUrl,
                        value: aRecords[i].Value.String,
                        label: aRecords[i].Label.String
                    });
                }
            }
            return aNavigationFields;
        },

        getModel: function () {
            return this.getView().getModel();
        },

        getMetaModel: function () {
            return this.getModel().getMetaModel();
        },

        getCardPropertiesModel: function () {
            return this.getView().getModel("ovpCardProperties");
        },

        getEntitySet: function () {
            if (!this.entitySet) {
                var sEntitySet = this.getCardPropertiesModel().getProperty("/entitySet");
                this.entitySet = this.getMetaModel().getODataEntitySet(sEntitySet);
            }

            return this.entitySet;
        },

        getEntityType: function () {
            if (!this.entityType) {
                this.entityType = this.getMetaModel().getODataEntityType(this.getEntitySet().entityType);
            }

            return this.entityType;
        },

        _saveAppState : function(sFilterDataSuiteFormat) {
            var oDeferred = jQuery.Deferred();
            var oAppState = sap.ushell.Container.getService("CrossApplicationNavigation").createEmptyAppState(this.getOwnerComponent());
            var sAppStateKey = oAppState.getKey();
            var oAppDataForSave = {
                selectionVariant: sFilterDataSuiteFormat
            };
            oAppState.setData(oAppDataForSave);
            var oSavePromise = oAppState.save();

            oSavePromise.done(function () {
                oDeferred.resolve(sAppStateKey);
            });

            return oDeferred.promise();
        },

        /**
         * Retrieve entity parameters (if exists) and add xAppState from oComponentData.appStateKeyFunc function (if exists)
         * @param oEntity
         * @returns {*}
         * @private
         */
        _getEntityNavigationParameters: function (oEntity) {
            var oDeferred = jQuery.Deferred();
            var oUrlParameters = {};
            var oEntityType;
            var oComponentData = this.getOwnerComponent().getComponentData();
            var oGlobalFilter = oComponentData ? oComponentData.globalFilter : undefined;
            var oSaveAppStatePromise;
            var oCardFilters = sap.ovp.cards.AnnotationHelper.getCardFilters(this.getCardPropertiesModel());
            var oSelectionVariant;

            // Build result object of card parameters
            if (oEntity) {
                oEntityType = this.getEntityType();
                var key;
                for (var i = 0; oEntityType.property && i < oEntityType.property.length; i++) {
                    key = oEntityType.property[i].name;
                    if (oEntity.hasOwnProperty(key)) {
                        if (typeof oEntity[key] === "string") {
                            oUrlParameters[key] = oEntity[key];
                        } else if (window.Array.isArray(oEntity[key]) && oEntity[key].length === 1) {
                            oUrlParameters[key] = oEntity[key][0];
                        }
                    }
                }
            }

            //Build selection variant object from global filter, card filter and card parameters
            oSelectionVariant = this._buildSelectionVariant(oGlobalFilter, oCardFilters, oUrlParameters);

            //Get all filters with EQ option and add it to parameters result
            // in order for it will to be shown on the URL
            var aSelectOptionsNames = oSelectionVariant.getSelectOptionsPropertyNames();
            for (var i = 0; i < aSelectOptionsNames.length; i++) {
                var sSelectOptions = aSelectOptionsNames[i];
                var oValue = oSelectionVariant.getSelectOption(sSelectOptions);
                if ((oValue)[0] && (oValue)[0].Option === "EQ"){
                    var value = (oValue)[0].Low;
                    if (value) {
                        oUrlParameters[sSelectOptions] = value;
                    }
                }
            }

            //Save parameters and filters on app-state in case selection variant not empty
            if (!oSelectionVariant.isEmpty()) {
                oSaveAppStatePromise = this._saveAppState(oSelectionVariant.toJSONString());
                oSaveAppStatePromise.done(function(sAppStateKey) {
                    oUrlParameters["sap-xapp-state"] = sAppStateKey;
                    oDeferred.resolve(oUrlParameters);
                });
                oSaveAppStatePromise.fail(function () {
                    jQuery.sap.log.error("appStateKey is not saved for OVP Application");
                    oDeferred.resolve(oUrlParameters);
                });
            } else {
                oDeferred.resolve(oUrlParameters);
            }

            return oDeferred.promise();
        },

        _buildSelectionVariant: function(oGlobalFilter, oCardFilters, oUrlParameters) {
            var sGlobalFilter = oGlobalFilter ? oGlobalFilter.getFilterDataAsString() : "{}";
            var oSelectionVariant = new sap.ui.generic.app.navigation.service.SelectionVariant(sGlobalFilter);

            // Add card filters to selection variant
            for (var i = 0; i < oCardFilters.length; i++) {
                var entry = oCardFilters[i];
                //value1 might be typeof number, hence we check not typeof undefined
                if (entry.path && entry.operator && typeof entry.value1 !==  "undefined") {
                    //value2 is optional, hence we check it separately
                    var sValue2 = (typeof entry.value2 ===  "number") ? entry.value2.toString() : undefined;
                    oSelectionVariant.addSelectOption(entry.path, "I", entry.operator, entry.value1.toString(), sValue2);
                }
            }

            // Add card parameters to selection variant
            // in case key exist from filters do not add it!
            if (oUrlParameters) {
                var value;
                for (var key in oUrlParameters) {
                    value = oUrlParameters[key];
                    //Check that current parameter is not already exist on filters
                    if (!oSelectionVariant.getSelectOption(key)) {
                        oSelectionVariant.addParameter(key, value);
                    }
                }
            }

            return oSelectionVariant;
        },

        _loadParametersForm: function() {
            var oParameterModel = new sap.ui.model.json.JSONModel();
            oParameterModel.setData(this.actionData.parameterData);
            var that = this;

            // first create dialog
            var oParameterDialog = new sap.m.Dialog('ovpCardActionDialog', {
                title: this.actionData.sFunctionLabel,
                afterClose: function() {
                    oParameterDialog.destroy();
                }
            }).addStyleClass("sapUiNoContentPadding");

            // action button (e.g. BeginButton)
            var actionButton = new sap.m.Button({
                text: this.actionData.sFunctionLabel,
                press: function(oEvent) {
                    var mParameters = ActionUtils.getParameters(oEvent.getSource().getModel(), that.actionData.oFunctionImport);
                    oParameterDialog.close();
                    that._callFunction(mParameters);
                }
            });

            // cancel button (e.g. EndButton)
            var cancelButton = new sap.m.Button({
                text: "Cancel",
                press: function() {
                    oParameterDialog.close();
                }
            });
            // assign the buttons to the dialog
            oParameterDialog.setBeginButton(actionButton);
            oParameterDialog.setEndButton(cancelButton);

            // preparing a callback function which will be invoked on the Form's Fields-change
            var onFieldChangeCB = function(oEvent) {
                var missingMandatory = ActionUtils.mandatoryParamsMissing(oEvent.getSource().getModel(),that.actionData.oFunctionImport);
                actionButton.setEnabled(!missingMandatory);
            };

            // get the form assign it the Dialog and open it
            var oForm = ActionUtils.buildParametersForm(this.actionData,onFieldChangeCB);

            oParameterDialog.addContent(oForm);
            oParameterDialog.setModel(oParameterModel);
            oParameterDialog.open();
        },

        _callFunction: function(mUrlParameters) {
            var mParameters = {
                batchGroupId: "Changes",
                changeSetId: "Changes",
                urlParameters: mUrlParameters,
                forceSubmit: true,
                context: this.actionData.oContext,
                functionImport: this.actionData.oFunctionImport
            };
            var that = this;
            var oPromise = new Promise(function(resolve, reject) {
                var model = that.actionData.oContext.getModel();
                var sFunctionImport;
                sFunctionImport = "/" + mParameters.functionImport.name;
                model.callFunction(sFunctionImport, {
                    method: mParameters.functionImport.httpMethod,
                    urlParameters: mParameters.urlParameters,
                    batchGroupId: mParameters.batchGroupId,
                    changeSetId: mParameters.changeSetId,
                    headers: mParameters.headers,
                    success: function(oData, oResponse) {
                        resolve(oResponse);
                    },
                    error : function(oResponse) {
                        reject(oResponse);
                    }
                });
            });
            //Todo: call translation on message toast
            oPromise.then(function(oResponse) {
                return sap.m.MessageToast.show(sap.ui.getCore().getLibraryResourceBundle("sap.ovp").getText("Toast_Action_Success"), { duration: 1000});
            }, function(oError) {
                return sap.m.MessageToast.show(sap.ui.getCore().getLibraryResourceBundle("sap.ovp").getText("Toast_Action_Error"), { duration: 1000});
            });
        },

        /**
         * In case of error card implementation can call this method to display
         * card error state.
         * Current instance of the card will be destroied and instead loading card
         * will be presenetd with the 'Cannot load card' meassage
         */
        setErrorState: function(){
            //get the current card component
            var oCurrentCard = this.getOwnerComponent();
            //get the component container
            var oComponentContainer = oCurrentCard.oContainer;
            //prepare card configuration, i.e. category, title, description and entitySet
            //which are required for the loading card. in addition set the card state to error
            //so no loading indicator will be presented
            var oCardPropertiesModel = this.getCardPropertiesModel();
            var oComponentConfig = {
                name: "sap.ovp.cards.loading",
                componentData: {
                    model: this.getView().getModel(),
                    settings: {
                        category: oCardPropertiesModel.getProperty("/category"),
                        title: oCardPropertiesModel.getProperty("/title"),
                        description: oCardPropertiesModel.getProperty("/description"),
                        entitySet: oCardPropertiesModel.getProperty("/entitySet"),
                        state: sap.ovp.cards.loading.State.ERROR
                    }
                }
            };
            //create the loading card
            var oLoadingCard = sap.ui.component(oComponentConfig);
            //set the loading card in the container
            oComponentContainer.setComponent(oLoadingCard);
            //destroy the current card
            setTimeout(function(){
                oCurrentCard.destroy();
            }, 0);
        }


    });
})();