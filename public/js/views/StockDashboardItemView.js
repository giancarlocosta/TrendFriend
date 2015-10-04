window.StockDashboardItemView = Backbone.View.extend({

    tagName: "li",

    initialize: function () {
        //this.listenTo(this.model, "change", this.render);
        //this.listenTo(this.model, "destroy", this.close);
    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
        var stock = this.model;
        this.buildChart(stock);
        return this;  
    },
    
    events: {
        "click #itemLink"        : "clickLink"
    },

    buildChart: function(stock) {
        var context = this.$("#chart_div")[0];  
        console.log("Trying to set _id of stock to " + stock.toJSON()["tickerSymbol"] + ". The _id set is " + stock.get("_id"));
        var chart = new TFChart(stock.get("_id"), stock.attributes['data'], context, false, this.$(".thumbnail").width(), this.$(".thumbnail").height());
    },
    
    clickLink: function() {
        //app.navigate('stock/', true);
        //console.log("Clicked link");
    }
});