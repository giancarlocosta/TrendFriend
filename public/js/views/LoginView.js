/*=============================================================================
 *
 * LOGIN & SIGNIN VIEW
 *
 ============================================================================*/
window.LoginView = Backbone.View.extend({

    initialize:function () {
        this.render();
    },

    render:function () {
        $(this.el).html(this.template());
        return this;
    },

    events: {
        "click #signInOption"        : "showSignInForm",
        "click #signUpOption"        : "showSignUpForm",
        "click #signInButton"        : "submitSignInForm",
        "click #signUpButton"        : "submitSignUpForm" 
    },

    showSignInForm: function (event) {
        console.log("Clicked sign in.");
        this.$('#signInForm').show();
        this.$('#signUpForm').hide();
        this.$('#credentialValidator').hide();
        this.$('#signInOption').addClass("selected");
        this.$('#signUpOption').removeClass("selected");
    },

    showSignUpForm: function (event) {
        console.log("Clicked sign up.");
        this.$('#signInForm').hide();
        this.$('#signUpForm').show();
        this.$('#credentialValidator').hide();
        this.$('#signUpOption').addClass("selected");
        this.$('#signInOption').removeClass("selected");
    },

    submitSignInForm: function (event) {
        var self = this;
        var username = this.$('#signInUsername').val();
        var password = this.$('#signInPassword').val();
        this.model.save({username: username, password: password}, {
            url: "/login",
            success: function(model, response){
                window.currentUser = response;
                $("#loginLogout").html("Logout");         
                self.goToDashboard();
            },
            error: function(model, response){
                console.log(response.responseText);
                this.$('#alertText').html(response.responseText);
                this.$('#credentialValidator').show();
            }
        });
    },

    submitSignUpForm: function (event) {
        console.log(this.$('#signUpPassword').val());
        console.log(this.$('#signUpRetypepassword').val());
        if( this.$('#signUpPassword').val() !== this.$('#signUpRetypepassword').val()) {
            this.$('#alertText').html("Passwords do not match. Check your spelling!");
            this.$('#credentialValidator').show();
            return;  
        }
        var self = this;
        var username = this.$('#signUpUsername').val();
        var password = this.$('#signUpPassword').val();
        this.model.save({username: username, password: password}, {
            url: "/signUp",
            success: function(model, response){
                window.currentUser = response;
                console.log('Signed up successfully');
                $("#loginLogout").html("Logout");  
                self.goToDashboard();
            },
            error: function(model, response){
                console.log('Sign Up Error: response.responseText');
                this.$('#alertText').html(response.responseText);
                this.$('#credentialValidator').show();
            }
        });
    },

    goToDashboard: function (event) {
        app.navigate('dashboard', true);
    }
});