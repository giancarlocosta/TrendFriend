window.StockDashboardView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        var self = this;
        $(this.el).html(this.template());
        console.log("Rendering Dashboard");

        for(var i=0; i<self.model.models.length; i++) {
            var stock = new Stock({_id: self.model.models[i].get("_id"), tickerSymbol: self.model.models[i].get("tickerSymbol")});
            this.addStockToThumbnails(stock);
        }

        return this;
    },

    addStockToThumbnails: function(stock) {
        stock.fetch({
            url:"/stock/"+stock.get("_id")+"?startDate=2015-06-01",
            success: function(model, response, options){
                stock.set("data", response);
                this.$('.thumbnails').append(new StockDashboardItemView({model: stock}).render().el);
            }
        });
    }
});