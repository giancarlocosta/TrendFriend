window.Stock = Backbone.Model.extend({

    urlRoot: "/stock",

    idAttribute: "_id",

    charts: [],

    initialize: function () {
        this.validators = {};
    },

    validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
    },

    // TODO: Implement Backbone's standard validate() method instead.
    validateAll: function () {

        var messages = {};

        for (var key in this.validators) {
            if(this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }

        return _.size(messages) > 0 ? {isValid: false, messages: messages} : {isValid: true};
    },

    defaults: {
        _id: null,
        name: "",
        tickerSymbol:"",
        charts: [],
        data: null,
        description: "This is the default description.",
        picture: null
    }
});

window.StockCollection = Backbone.Collection.extend({

    model: Stock,

    url: "/stocks"

});



/*=============================================================================
 *
 * MODEL TO REPRESENT USER
 *
 ============================================================================*/
window.User = Backbone.Model.extend({

    url: "/",

    initialize: function () {},

    defaults: {
        _id: null,
        username: "username",
        password: "password",
        stocksFollowing: []
    }
});