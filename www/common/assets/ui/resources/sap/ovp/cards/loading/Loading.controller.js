(function(){"use strict";sap.ui.controller("sap.ovp.cards.loading.Loading",{onInit:function(){},onAfterRendering:function(){var v=this.getView();v.addStyleClass("sapOvpLoadingCard");var l=v.byId("ovpLoadingFooter");var s=this.getCardPropertiesModel().getProperty("/state");if(s===sap.ovp.cards.loading.State.ERROR){l.setText(sap.ui.getCore().getLibraryResourceBundle("sap.ovp").getText("cannotLoadCard"));}else{setTimeout(function(){l.setBusy(true);},6000);setTimeout(function(){l.setBusy(false);l.setText(sap.ui.getCore().getLibraryResourceBundle("sap.ovp").getText("cannotLoadCard"));},9000);}}});})();