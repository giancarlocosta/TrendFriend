window.HeaderView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        $(this.el).html(this.template());
        if(window.currentUser)
            this.$("#loginLogout").html("Logout");
        else
            this.$("#loginLogout").html("Login");
        return this;
    },

    events: {
        "click #loginLogout"   : "loginLogout",
        "click .brand" : "goHome"
    },

    loginLogout: function() {
        var self = this;
        if(window.currentUser) {
            $.get( "/logout", function( data ) {  
                window.currentUser = null;
                self.$("#loginLogout").html("Login");
                app.navigate('', true);
            });
        }
        else {
            app.navigate('', true);
            //this.$("#loginLogout").html("Logout");
        }   
    },
    goHome: function() {
        if(window.currentUser)
            app.navigate('home', true);
        else
            app.navigate('', true);

    },

    selectMenuItem: function (menuItem) {
        $('.nav li').removeClass('active');
        if (menuItem) {
            $('.' + menuItem).addClass('active');
        }
    }
});
