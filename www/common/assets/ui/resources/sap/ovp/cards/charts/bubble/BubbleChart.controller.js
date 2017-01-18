(function(){"use strict";sap.ui.controller("sap.ovp.cards.charts.bubble.BubbleChart",{onInit:function(){sap.ovp.cards.charts.Utils.formatChartYaxis();},onBeforeRendering:function(){sap.ovp.cards.charts.Utils.validateCardConfiguration(this);var v=this.getView().byId("bubbleChartCard");if(!v){jQuery.sap.log.error(sap.ovp.cards.charts.Utils.constants.ERROR_NO_CHART+": ("+this.getView().getId()+")");}else{var b=v.getDataset().getBinding("data");b.attachDataReceived(function(){sap.ovp.cards.charts.Utils.hideDateTimeAxis(v,"valueAxis");});sap.ovp.cards.charts.Utils.validateMeasuresDimensions(v,"Bubble");}}});})();
