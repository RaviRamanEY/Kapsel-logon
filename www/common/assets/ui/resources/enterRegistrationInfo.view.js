sap.ui.jsview("enterRegistrationInfo", {

    getControllerName: function() {
        return null;
    },

    /**
     * 
     * @param oController may be null
     * @returns {sap.ui.cre.Control}
     */
    createContent: function(oController) {
            var jsView = this;
            data = window.iab.context;
            if (data.user == null) {
                data.user = "";
            }
            if (data.password == null) {
                data.password = "";
            }

            // create JSON model instance
            var oModel = new sap.ui.model.json.JSONModel();
            // set the data for the model
            oModel.setData(data);
            // set the model to the core
            sap.ui.getCore().setModel(oModel);

            // This function calculates how wide the vbox containing all the controls should be.
            var calculateDisplayWidth = function(totalWidth) {
                var displayWidth = 0;
                if (totalWidth <= 360) {
                    displayWidth = totalWidth*0.9;
                } else {
                    // On a wide screen, use a little more space
                    displayWidth = 324 + ((totalWidth - 360)*0.1);
                }
                return Math.round(displayWidth);
            }

            var hiddenFields = [];
            if (data.custom && data.custom.hiddenFields)
                hiddenFields = data.custom.hiddenFields;

            var vbox = new sap.m.VBox('enterRegistrationInfoScreen');

            var inputHost = new sap.m.Input( 'serverHost', {
                    value:"{/serverHost}",
                    placeholder:getLocalizedString("SCR_ENTER_REGISTRATION_INFO_HOST"),
                    visible: $.inArray("serverHost", hiddenFields) >= 0 ? false : true
            });

            var inputUsername = new sap.m.Input( 'user', {
                    value:"{/user}",
                    placeholder: getLocalizedString("SCR_ENTER_REGISTRATION_INFO_USERNAME"),
                    visible: $.inArray("user", hiddenFields) >= 0 ? false : true
            });

            var inputPassword = new sap.m.Input( 'password', {
                    type:sap.m.InputType.Password,
                    value:"{/password}",
                    placeholder: getLocalizedString("SCR_ENTER_REGISTRATION_INFO_PASSWORD"),
                    visible: $.inArray("password", hiddenFields) >= 0 ? false : true,
                    liveChange:function() {
                        inputPassword.setValueState(sap.ui.core.ValueState.None);
                    }
            });
            if (data.valueStateText != null) {
                inputPassword.setValueStateText(data.valueStateText);
                inputPassword.setValueState(sap.ui.core.ValueState.Error);
            }

            var inputUrlSuffix = new sap.m.Input( 'resourcePath', {
                    value:"{/resourcePath}",
                    placeholder:getLocalizedString("SCR_ENTER_REGISTRATION_INFO_URLSUFFIX"),
                    visible: $.inArray("resourcePath", hiddenFields) >= 0 ? false : true
            });


            var checkboxSecure = new sap.m.CheckBox( 'https', {
                    value:"{/https}",
                    text:getLocalizedString("SCR_ENTER_REGISTRATION_INFO_SECURE"),
                    selected: "https" in data && data.https.toString() == "true" ? true : false,
                    visible: $.inArray("https", hiddenFields) >= 0 ? false : true
            });
            checkboxSecure.addStyleClass("smp-logon-checkbox");

            var inputPort = new sap.m.Input( 'serverPort', {
                    value:"{/serverPort}",
                    placeholder:getLocalizedString("SCR_ENTER_REGISTRATION_INFO_PORT"),
                    visible: $.inArray("serverPort", hiddenFields) >= 0 ? false : true
            });

            var inputCompanyId = new sap.m.Input( 'farmId', {
                    value:"{/farmId}",
                    placeholder:getLocalizedString("SCR_ENTER_REGISTRATION_INFO_COMPANYID"),
                    visible: $.inArray("farmId", hiddenFields) >= 0 ? false : true
            });

            var inputSecurityConfiguration = new sap.m.Input( 'securityConfig', {
                    value:"{/securityConfig}",
                    placeholder:getLocalizedString("SCR_ENTER_REGISTRATION_INFO_SECURITYCONFIG"),
                    visible: $.inArray("securityConfig", hiddenFields) >= 0 ? false : true
            });

            var buttonOKPress = function() {
                window.iab.busy.open();
                
                data.user = inputUsername.getValue();
                data.password = inputPassword.getValue();
                data.serverHost = inputHost.getValue();
                data.serverPort = inputPort.getValue();
                data.https = checkboxSecure.getSelected() ? "true" : "false";
                data.resourcePath = inputUrlSuffix.getValue();

                var companyId = inputCompanyId.getValue();
                if (companyId == "")
                    data.farmId = null;
                else
                    data.farmId = companyId;

                data.securityConfig = inputSecurityConfiguration.getValue();

                delete data.custom;
                window.iab.triggerEventForJsView("SUBMIT", data);
            }

            var buttonOK = new sap.m.Button( 'button_ok', {
                type:sap.m.ButtonType.Emphasized,
                text:getLocalizedString("BUTTON_OK"),
                width:"100%",
                press : buttonOKPress
            });

            var cancelRegistration = new sap.m.Button( 'cancel_registration', {
                type:sap.m.ButtonType.Default,
                text:getLocalizedString("BUTTON_CANCEL"),
                width:"100%",
                press : function(){
                    window.iab.busy.open();
                    window.iab.triggerEventForJsView("CANCEL", data);
                }
            });

            if (!window.iab.busy){
                window.iab.busy = new sap.m.BusyDialog('busy_indicator', {});
            }

            var vboxPlaceholder1 = new sap.m.HBox( 'vbox_placeholder1', {
                height:"25px"
            });

            var vboxPlaceholder2 = new sap.m.HBox( 'vbox_placeholder2', {
                height:"10px"
            });

            var vboxPlaceholder3 = new sap.m.HBox( 'vbox_placeholder3', {
                height:"25px"
            });

            var vboxPlaceholder4 = new sap.m.HBox( 'vbox_placeholder4', {
                height:"25px"
            });

            var instructionText = new sap.m.Text('reg_instr_text', {
                text: getLocalizedString('SCR_ENTER_REGISTRATION_INFO_INSTRUCTIONS')
            });
            var instructionHBox = new sap.m.HBox( 'reg_instr_text_hbox', {
                items: [instructionText]
            });

            var headerItems = [instructionHBox];
            var panelVBox = new sap.m.VBox('panel_vbox', {
                items: headerItems
            });
            var panel = new sap.m.Panel( 'reg_instr_panel', {
                content: [panelVBox]
            });

            vbox.addItem(vboxPlaceholder1);
            vbox.addItem(panel);
            vbox.addItem(vboxPlaceholder2);
            vbox.addItem(inputHost);
            vbox.addItem(inputUsername);
            vbox.addItem(inputPassword);
            vbox.addItem(inputUrlSuffix);
            vbox.addItem(checkboxSecure);
            vbox.addItem(inputPort);
            vbox.addItem(inputCompanyId);
            vbox.addItem(inputSecurityConfiguration);
            vbox.addItem(vboxPlaceholder3);
            vbox.addItem(buttonOK);
            vbox.addItem(cancelRegistration);
            vbox.addItem(vboxPlaceholder4);

            vboxPageContent = new sap.m.VBox('vbox_content', {
                alignItems:sap.m.FlexAlignItems.Center,
                justifyContent:sap.m.FlexJustifyContent.Start,
                items:[vbox]
            });

            var logoPath;
            if (data.custom && data.custom.copyrightLogo) {
                logoPath = data.custom.copyrightLogo;
            } else {
                logoPath = "img/sapLogo.png";
            }
            var logo = new sap.m.Image( 'logo', {
                src: logoPath,
                height:"40px"
            });

            var cprMsg1, cprMsg2;
            if (data.custom && data.custom.copyrightMsg) {
                cprMsg1 = data.custom.copyrightMsg[0];
                cprMsg2 = data.custom.copyrightMsg[1];
            } else {
                cprMsg1 = getLocalizedString("COPYRIGHT_1");
                cprMsg2 = getLocalizedString("COPYRIGHT_2");
            }

            var copyright1 = new sap.m.Text( 'copyright1', {
                text: cprMsg1
            });

            var copyright2 = new sap.m.Text( 'copyright2', {
                text: cprMsg2
            });

            var copyright = new sap.m.VBox('copyright', {
                items: [copyright1, copyright2]
            });

            var footerHBox = new sap.m.HBox('panel_hbox', {
                justifyContent:sap.m.FlexJustifyContent.SpaceBetween,
                width: "90%",
                items: [logo, copyright],
                visible: !(data && data.custom && data.custom.hideLogoCopyright && data.custom.hideLogoCopyright.toString() == "true")
            });

            vboxOuter = new sap.m.FlexBox('vbox_outer', {
                direction:sap.m.FlexDirection.Column,
                justifyContent:sap.m.FlexJustifyContent.SpaceBetween,
                alignItems:sap.m.FlexAlignItems.Center,
                items:[vboxPageContent, footerHBox],
                fitContainer: true
            });

            if ($(window).width()) {
                vbox.setWidth(calculateDisplayWidth($(window).width()) + "px");
            } 

            sap.ui.core.ResizeHandler.register(vboxOuter, function(e){
                vbox.setWidth(calculateDisplayWidth(e.size.width) + "px");
                var domRef = jsView.getDomRef();
                if( $(window).height() && $(window).height() > domRef.offsetHeight) {
                    // The view is not taking up the whole screen height, force it.
                    jsView.setHeight($(window).height() + "px");
                }
            });
            
            vboxOuter.onAfterRendering = function() {
                var inputs = this.$().find(':input');
                inputs.attr('autocapitalize', 'off');
                inputs.attr('autocorrect', 'off');
                inputs.attr('autocomplete', 'off');
                setTimeout(function() {
                    buttonOK.focus();
                }, 300);
            }
            
            window.iab.page.setShowHeader(false);
            
            this.onAfterRendering = function() {
                var domRef = this.getDomRef();
                var newHeight = $(window).height();
                if (window.iab.heightWithoutKeyboard != null) {
                    // If we know the height of the screen without the keyboard, use that
                    // (since the keyboard will affect $(window).height()).
                    newHeight = window.iab.heightWithoutKeyboard;
                }
                if(newHeight && newHeight > domRef.offsetHeight) {
                    // The view is not taking up the whole screen height, force it.
                    this.setHeight(newHeight + "px");
                }
            }

            window.onkeyup = function (e) {
                var key = e.keyCode ? e.keyCode : e.which;

                if (key == 13) {
                    // GO button pressed on Android keyboard
                    buttonOKPress();
                }
            }

            return vboxOuter;
    }
});
