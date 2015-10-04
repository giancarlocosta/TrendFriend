var AppRouter = Backbone.Router.extend({

    routes: {
        ""                      : "login",
        "search"                : "search",
        "dashboard"             : "list",
        "stocks/page/:page"	    : "list",
        "stock/:id?*querystring": "stockDetails",
        "stock/:id"             : "stockDetails",
        "about"                 : "about"
    },

    initialize: function () {
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.el);
    },
    
    login: function (id) {
        $.get( "/logout", function( data ) {  
            window.currentUser = null;
            var user = new User();
            var loginView = new LoginView({model: user});
            $('#content').html(loginView.el);
            loginView.delegateEvents();
        });    
    },

    search: function (id) {
        var searchView = new SearchView();
        $('#content').html(searchView.el);
        this.headerView.selectMenuItem('home-menu');
        searchView.delegateEvents();
    },

    stockDetails: function (id, querystring) {
        var startDate = "";
        if(typeof querystring == "undefined")
            startDate = "2015-01-01";
        else {
            console.log('ID: ' + id + ' . Querystring: ' + querystring);
            var params = parseQueryString(querystring);
            if(params.startDate)
                startDate = params.startDate;
        }
        
        var stock = new Stock({_id: id});
        stock.fetch({
            url: "/stock/"+id+"?startDate="+startDate,
            success: function(model, response, options){
                var newStock = new Stock({_id: id});
                newStock.set("data", response);
                newStock.set("name", response['name']);
                $("#content").html(new StockView({model: newStock}).el);
            }, 
            error: function(model, response, options) {
                console.log(response.responseText);
                utils.showNotification("ERROR", response.responseText, 'alert-error');
                return window.history.back();
            }
        });
        this.headerView.selectMenuItem();      
    },

	list: function(page) {
        var p = page ? parseInt(page, 10) : 1;
        var stockList = new StockCollection();
        stockList.fetch({
            success: function(model, response, options){
                console.log("SHOWING CASHBOARD");
                var dashboardView = new StockDashboardView({model: stockList, page: p});
                $("#content").html(dashboardView.el);
                dashboardView.delegateEvents();
            },
            error: function(model, response, options) {
                console.log(response.responseText);
                utils.showNotification("ERROR", response.responseText, 'alert-error');
                return app.navigate('', true);
            }
        });
        this.headerView.selectMenuItem('home-menu');
    },

    about: function () {
        if (!this.aboutView) {
            this.aboutView = new AboutView();
        }
        $('#content').html(this.aboutView.el);
        this.headerView.selectMenuItem('about-menu');
    }

});

window.currentUser = null;
utils.loadTemplate(['SearchView','HeaderView', 'StockView', 'StockDashboardView', 'StockDashboardItemView', 'AboutView', 'LoginView'], function() {
    app = new AppRouter();
    Backbone.history.start();
});

// and the function that parses the query string can be something like : 
function parseQueryString(queryString){
    var params = {};
    if(queryString){
        _.each(
            _.map(decodeURI(queryString).split(/&/g),function(el,i){
                var aux = el.split('='), o = {};
                if(aux.length >= 1){
                    var val = undefined;
                    if(aux.length == 2)
                        val = aux[1];
                    o[aux[0]] = val;
                }
                return o;
            }),
            function(o){
                _.extend(params,o);
            }
        );
    }
    return params;
}