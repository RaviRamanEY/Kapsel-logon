sap.ui.jsview("showRegistrationInfo", {

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

            var vbox = new sap.m.VBox('showRegistrationInfoScreen');

            var labelHost = new sap.m.Label( 'hostLabel', {
                    text:getLocalizedString("FLD_HOST_LABEL")
            });
            var showHost = new sap.m.Input( 'serverHost', {
                    value:"{/serverHost}",
                    editable:false,
                    enabled:false
            });

            var labelUsername = new sap.m.Label( 'usernameLabel', {
                    text:getLocalizedString("FLD_USER_LABEL")
            });
            var showUsername = new sap.m.Input( 'user', {
                    value:"{/user}",
                    editable:false,
                    enabled:false
            });


            var showCheckboxSecure = new sap.m.CheckBox( 'https', {
                    value:"{/https}",
                    text:getLocalizedString("SCR_ENTER_REGISTRATION_INFO_SECURE"),
                    selected: "https" in data && data.https.toString() == "true" ? true : false,
                    enabled:false
            });
            showCheckboxSecure.addStyleClass("smp-logon-checkbox");

            var labelPort = new sap.m.Label( 'portLabel', {
                    text:getLocalizedString("FLD_PORT_LABEL")
            });
            var showPort = new sap.m.Input( 'serverPort', {
                    value:"{/serverPort}",
                    editable:false,
                    enabled:false
            });
            
            var labelCommunicatorId = new sap.m.Label( 'communicatorIdLabel', {
                    text:getLocalizedString("FLD_COMMUNICATORID_LABEL")
            });
            var showCommunicatorId = new sap.m.Input( 'communicatorId', {
                    value:"{/communicatorId}",
                    editable:false,
                    enabled:false
            });

            var cancelRegistration = new sap.m.Button( 'cancel_registration', {
                type:sap.m.ButtonType.Default,
                text:getLocalizedString("BUTTON_CANCEL"),
                width:"100%",
                press : function(){
                    window.iab.triggerEventForJsView("CANCEL", data);
                }
            });

            if (!window.iab.busy){
                window.iab.busy = new sap.m.BusyDialog('busy_indicator', {});
            }

            var vboxPlaceholder1 = new sap.m.HBox( 'vbox_placeholder1', {
                height:"25px"
            });

            var vboxPlaceholder2a = new sap.m.HBox( 'vbox_placeholder2a', {
                height:"15px"
            });
            var vboxPlaceholder2b = new sap.m.HBox( 'vbox_placeholder2b', {
                height:"15px"
            });
            var vboxPlaceholder2c = new sap.m.HBox( 'vbox_placeholder2c', {
                height:"15px"
            });
            var vboxPlaceholder2d = new sap.m.HBox( 'vbox_placeholder2d', {
                height:"15px"
            });

            var vboxPlaceholder3 = new sap.m.HBox( 'vbox_placeholder3', {
                height:"25px"
            });

            var vboxPlaceholder4 = new sap.m.HBox( 'vbox_placeholder4', {
                height:"25px"
            });

            vbox.addItem(vboxPlaceholder1);
            vbox.addItem(labelUsername);
            vbox.addItem(showUsername);
            vbox.addItem(vboxPlaceholder2a);
            vbox.addItem(labelHost);
            vbox.addItem(showHost);
            vbox.addItem(vboxPlaceholder2b);
            vbox.addItem(labelPort);
            vbox.addItem(showPort);
            vbox.addItem(vboxPlaceholder2c);
            vbox.addItem(labelCommunicatorId);
            vbox.addItem(showCommunicatorId);
            vbox.addItem(vboxPlaceholder2d);
            vbox.addItem(showCheckboxSecure);
            vbox.addItem(vboxPlaceholder3);
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

            return vboxOuter;
    }
});
