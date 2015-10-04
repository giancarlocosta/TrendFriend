window.SearchView = Backbone.View.extend({

    initialize:function () {
        this.render();
    },

    render:function () {
        $(this.el).html(this.template());
        return this;
    },

    events: {
        "change"        : "change",
        "click #search"   : "search",
        "click #dashboard": "goToDashboard",
        "click #startDate": "showDatePicker"
    },

    search: function (event) {
        // Remove any existing alert message
        //utils.hideAlert();
        if(this.$("#companySymbolOrName").val().length == 0)
            utils.showNotification("ERROR", "Ticker Symbol required", 'alert-error');
        else
            app.navigate('stock/' + this.$("#companySymbolOrName").val() + "?startDate=" + self.$('#startDate').html(), true);
    },

    goToDashboard: function (event) {
        app.navigate('dashboard', true);
    },
    
    showDatePicker: function (event) {
        console.log("Clicked start date");
        var self = this;
        this.$('#datepicker').datepicker({
            dateFormat: "yy-mm-dd",
            maxDate: -1,
            onSelect: function(date, obj) {
                self.$('#startDate').html(date);
                self.$('#datepicker').hide();
            }
        });
        this.$('#datepicker').show();
    },

    change: function(event) {
        /*
        // Apply the change to the model
        var target = event.target;
        var change = {};
        change[target.name] = target.value;
        this.model.set(change);

        // Run validation rule (if any) on changed item
        var check = this.model.validateItem(target.id);
        if (check.isValid === false) {
            utils.addValidationError(target.id, check.message);
        } else {
            utils.removeValidationError(target.id);
        }*/
    }
    
});