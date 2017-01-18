if (!window.sap) {
    window.sap = {};
}

if (!sap.logon) {
    sap.logon = {};
}

sap.logon.Notification = function (onActionCallback) {

    var show = function (notificationKey,notificationMessage,notificationTitle,extraInfo) {
        jQuery.sap.require("sap.m.Dialog");
        var message = null;
        var title = null;
        if (notificationKey){
           message = getLocalizedString(notificationKey + '_MSG');
           title = getLocalizedString(notificationKey + '_TITLE');
        }
        
        if( message == null || message.trim().length == 0 ) {
            message = notificationMessage != null ? notificationMessage : '';
        }
        
        if( title == null || title.trim().length == 0 ) {
            title = notificationTitle != null ? notificationTitle : '';
        }
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
        var width="90%";
        if ($(window).width()) {
            width=calculateDisplayWidth($(window).width()) + "px";
        }
        var dialog = new sap.m.Dialog({
            title: title,
            type: sap.m.DialogType.Message,
            contentWidth: width,
            content: new sap.ui.core.HTML({
                content: '<div>'+message+'</div>'
            }),
            endButton: new sap.m.Button({
                text: getLocalizedString("BUTTON_OK"),
                press: function () {
                    onActionCallback('ERRORACK', JSON.stringify({'key':notificationKey, 'extraInfo':extraInfo}));
                    setTimeout(function(){dialog.close();}, 150);
                }
            })
        });
        dialog.open();
    }    

    this.show = show;
}
