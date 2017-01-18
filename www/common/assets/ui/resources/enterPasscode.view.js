sap.ui.jsview("enterPasscode", {

    getControllerName: function() {
        return null;
    },

    /**
     * 
     * @param oController may be null
     * @returns {sap.ui.cre.Control}
     */
    createContent: function(oController) {
            if (!window.idIterator) {
                window.idIterator = 1;
            }
            var jsView = this;
            var data = window.iab.context;
            if (data.unlockPasscode == null) {
                data.unlockPasscode = "";
            }

  			//if multiUser is undefined, set it to false. Undefine set to element visible property will default to true.
			if (!data.multiUser){
				data.multiUser = false;
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

            var vbox = new sap.m.VBox('EnterPasscodeScreen');
            
            var appName = window.iab.context.appName;
            if (!appName){
                appName = window.iab.context._defaultAppName;
            }

            var showPasscodeFields = true;

            var userSelectBox;

            if (data.multiUser) {
                userSelectBox = new sap.m.Select('userSelectBox', {
                    width: "100%",
                    change: function(event) {
                        var key = event.getParameters().selectedItem.getKey();

                        if (data.multiUserInfo.userList) {
                            for (var i=0; i < data.multiUserInfo.userList.length; i++) {
                                if (data.multiUserInfo.userList[i].deviceUserId == key) {
                                    data.currentSelectedUser = data.multiUserInfo.userList[i];
                                    break;
                                }
                            }
                        }

                        // Hide/show field and button depending on if user has passcode set
                        if (data.currentSelectedUser.usingDefaultPasscode) {
                            inputPassword.setVisible(false);
                            buttonForgotPasscode.setVisible(false);
                        } else {
                            inputPassword.setVisible(true);
                            inputPassword.setValue('');
                            buttonForgotPasscode.setVisible(true);

                        }
                    }
                });

                if (data.multiUserInfo.userList) {
                    for (var i=0; i < data.multiUserInfo.userList.length; i++) {
                        //if the item matches the current user then setting it as currently
                        //selected user. Otherwise, check lastloginUser, lastloginUser is only
                        //used if currentlogonuser is null
                        if (data.multiUserInfo.userList[i].deviceUserId == data.multiUserInfo.currentUser) {
                            data.currentSelectedUser = data.multiUserInfo.userList[i];
                        }
                        else if ( (!data.currentSelectedUser) && data.multiUserInfo.userList[i].deviceUserId == data.multiUserInfo.lastLoginUser){
                            data.currentSelectedUser = data.multiUserInfo.userList[i];
                        }

                        userSelectBox.addItem(new sap.ui.core.Item(undefined, {
                            text: data.multiUserInfo.userList[i].displayName,
                            key: data.multiUserInfo.userList[i].deviceUserId,
                        }));
                    }
                }
              
                //the last login user should always be available. but if the user is deleted, then just select the first user in the list
                if (!data.currentSelectedUser && data.multiUserInfo.userList){
                	data.currentSelectedUser = data.multiUserInfo.userList[0];
                }
                    
                if (data.currentSelectedUser) {
                    userSelectBox.setSelectedKey(data.currentSelectedUser.deviceUserId);
                    if (data.currentSelectedUser.usingDefaultPasscode) {
                       showPasscodeFields = false;
                    }              
                }
            }

            var inputPassword = new sap.m.Input( 'Password_item', {
                type:sap.m.InputType.Password,
                value:"{/unlockPasscode}",
                placeholder:formatString(getLocalizedString("SCR_ENTER_PASSCODE_INSTRUCTIONS"),
                     appName),
                liveChange:function() {
                    inputPassword.setValueState(sap.ui.core.ValueState.None);
                },
                visible: showPasscodeFields
            });
            if (data.valueStateText != null) {
                inputPassword.setValueStateText(data.valueStateText);
                inputPassword.setValueState(sap.ui.core.ValueState.Error);
            }

            var buttonOKPress = function(){
                window.iab.busy.open();
                data.unlockPasscode = inputPassword.getValue();
                //in multiuser mode, the selected user may has passcode disabled, if so setting passcode to null in order
                //to unlock the data vault with default passcode
                if (data.currentSelectedUser && data.currentSelectedUser.usingDefaultPasscode) {
                    data.unlockPasscode = null;
                }
              
                window.iab.triggerEventForJsView("SUBMIT", data);
            }
            var buttonOK = new sap.m.Button( 'button_ok', {
                type:sap.m.ButtonType.Emphasized,
                text:getLocalizedString("BUTTON_OK"),
                width:"100%",
                press : buttonOKPress
            });

            var dialogConfirmForgotPasscode = new sap.m.Dialog('confirm_forgot_passcode' + idIterator++,{
                title:getLocalizedString("SCR_ENTER_PASSCODE_FORGOT_PASSCODE")
            });
            var lButton = new sap.m.Button('lButton' + idIterator++, {
                text:getLocalizedString("BUTTON_OK"),
                press:function(){
                    window.iab.busy.open();
                    console.log("Forgot passcode: " + JSON.stringify(data));
                    window.iab.triggerEventForJsView("FORGOT", data);}
            });
            var rButton = new sap.m.Button('rButton' + idIterator++, {
                text:getLocalizedString("BUTTON_CANCEL"),
                press:function(){dialogConfirmForgotPasscode.close();}
            });
            dialogConfirmForgotPasscode.addButton(lButton);
            dialogConfirmForgotPasscode.addButton(rButton);
            var confirmForgotPasscodeText = new sap.m.Text('confirm_forgot_passcode_text' + idIterator++,{
                text:formatString(getLocalizedString("SCR_ENTER_PASSCODE_FORGOT_PASSCODE_CONFIRM"), appName)
            });
            dialogConfirmForgotPasscode.addContent(confirmForgotPasscodeText);

            var buttonForgotPasscode = new sap.m.Button( 'button_forgotPasscode', {
                text:getLocalizedString("SCR_ENTER_PASSCODE_FORGOT_PASSCODE"),
                width:"100%",
                press : function(){
                    dialogConfirmForgotPasscode.open();
                },
                visible: showPasscodeFields
            });

            var buttonRegNewUser = new sap.m.Button( 'button_regNewUser' + idIterator++, {
                text: getLocalizedString("SCR_ENTER_PASSCODE_REG_NEW_USER"),
                width: "100%",
                press : function(){
                    window.iab.busy.open();
                    window.iab.triggerEventForJsView("NEWUSER", data);
                }
            });

            var vboxPlaceholder1 = new sap.m.HBox( 'vbox_placeholder1', {
                height: data.multiUser ? "30px" : "75px"
            });

            var vboxPlaceholder2 = new sap.m.HBox( 'vbox_placeholder2', {
                height: "25px"
            });

            vbox.addItem(vboxPlaceholder1);

            if (data.multiUser)
                vbox.addItem(userSelectBox);

            vbox.addItem(inputPassword);
            vbox.addItem(vboxPlaceholder2);
            vbox.addItem(buttonOK);

            vbox.addItem(buttonForgotPasscode);
            if (data.multiUser){
                //on windows new user can not register until the migration from single user mode does not happen; migration happens when user unlocks the datavault               
                if (!data.multiUserInfo.shouldMigrateToMultiUserMode) {
                    vbox.addItem(buttonRegNewUser);
                }
            }
            
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

            // If the screen width is available, pre-calculate how wide the vbox should be
            // so that the user can't see it draw as the wrong size then quickly redraw as
            // the correct size.
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
                if( newHeight && newHeight > domRef.offsetHeight) {
                    // The view is not taking up the whole screen height, force it.
                    this.setHeight(newHeight + "px");
                }
            }

            window.iab.setErrorText = function() {
                setTimeout(function(){
                    window.iab.busy.close();
                    inputPassword.setValueStateText(getLocalizedString("SCR_ENTER_PASSCODE_INCORRECT_PASSCODE"));
                    inputPassword.setValueState(sap.ui.core.ValueState.Error);
                    inputPassword.focus();
                },400);
            }
            
            window.onkeyup = function(e) {
                var key = e.keyCode ? e.keyCode : e.which;
                if (key == 13) {
                    // GO button pressed on Android keyboard
                    buttonOKPress();
                }
            }

            return vboxOuter;
    }
});
