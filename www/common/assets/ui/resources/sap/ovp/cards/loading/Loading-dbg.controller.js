(function () {
    "use strict";
    /*global sap, jQuery */

    sap.ui.controller("sap.ovp.cards.loading.Loading", {

        onInit: function () {
        },

        onAfterRendering: function(){
            var oView = this.getView();
            oView.addStyleClass("sapOvpLoadingCard");
            var loadingFooter = oView.byId("ovpLoadingFooter");

            var sState = this.getCardPropertiesModel().getProperty("/state");

            if (sState === sap.ovp.cards.loading.State.ERROR){
                loadingFooter.setText(sap.ui.getCore().getLibraryResourceBundle("sap.ovp").getText("cannotLoadCard"));
            } else {
                //sState === sap.ovp.cards.loading.State.LOADING
                setTimeout(function () {
                    loadingFooter.setBusy(true);
                }, 6000);

                setTimeout(function(){
                    loadingFooter.setBusy(false);
                    loadingFooter.setText(sap.ui.getCore().getLibraryResourceBundle("sap.ovp").getText("cannotLoadCard"));
                }, 9000);
            }
        }
    });
})();
