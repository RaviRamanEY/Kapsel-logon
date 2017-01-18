(function () {
	"use strict";
	/*global sap, jQuery */

	sap.ui.controller("sap.ovp.cards.charts.bubble.BubbleChart", {
		onInit: function () {
			sap.ovp.cards.charts.Utils.formatChartYaxis();
		},
		onBeforeRendering : function() {
			sap.ovp.cards.charts.Utils.validateCardConfiguration(this);
			var vizFrame = this.getView().byId("bubbleChartCard");
			if (!vizFrame) {
				jQuery.sap.log.error(sap.ovp.cards.charts.Utils.constants.ERROR_NO_CHART +
						": (" + this.getView().getId() + ")");
			} else {
				var binding = vizFrame.getDataset().getBinding("data");
				binding.attachDataReceived(function(){sap.ovp.cards.charts.Utils.hideDateTimeAxis(vizFrame, "valueAxis");});
				sap.ovp.cards.charts.Utils.validateMeasuresDimensions(vizFrame, "Bubble");
			}
		}
	});
})();
