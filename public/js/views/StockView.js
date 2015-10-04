window.StockView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        
        $(this.el).html(this.template(this.model.toJSON()));
        var stockID = this.model.get("_id");

        var chartContext = this.$("#chart_div")[0];
        var chart = new TFChart(this.model.attributes['name'], this.model.attributes['data'], chartContext, true, $('#content').width(), 500);
        this.model.charts.push({'PricesAndEventsChart': chart});
        console.log("SHOWING CHART");

        if(window.currentUser && window.currentUser.stocksFollowing.indexOf(stockID) !== -1)
            utils.toggleFollowButton(this.$("#followUnfollowButton"), true);
        return this;
    },

    events: {
        "change"        : "change",
        "click .follow"   : "followStock",
        "click .unfollow" : "unfollowStock",
        "drop #picture" : "dropHandler"
    },

    followStock: function () {
        var self = this;
        console.log("REQUESTING: /stock/" + this.model.get("_id") + "/stockActions?action=follow");
        this.model.save(null, {
            url: "/stock/" + this.model.get("_id") + "/stockActions?action=follow",
            success: function (model, response) {
                window.currentUser = response;
                console.log('Followed Stock!' + response.stocksFollowing); 
                utils.showAlert('Success!', 'Stock saved successfully', 'alert-success');
                utils.toggleFollowButton(this.$("#followUnfollowButton"), true);
            },
            error: function (model, response) {
                utils.showAlert('ERROR', response.responseText, 'alert-error');
            }
        });
        return false;
    },
    

    unfollowStock: function () {
        var self = this;
        this.model.save(null, {
            url: "/stock/" + this.model.get("_id") + "/stockActions?action=unfollow",
            success: function (model, response) {
                window.currentUser = response; 
                console.log('Unfollowed Stock!' + response.stocksFollowing); 
                utils.showAlert('Success!', 'Stock unfollowed successfully', 'alert-success');
                utils.toggleFollowButton(this.$("#followUnfollowButton"), false);
            },
            error: function (model, response) {
                utils.showAlert('ERROR', response.responseText, 'alert-error');
            }
        });
        return false;
    },

    dropHandler: function (event) {
        event.stopPropagation();
        event.preventDefault();
        var e = event.originalEvent;
        e.dataTransfer.dropEffect = 'copy';
        this.pictureFile = e.dataTransfer.files[0];

        // Read the image file from the local file system and display it in the img tag
        var reader = new FileReader();
        reader.onloadend = function () {
            $('#picture').attr('src', reader.result);
        };
        reader.readAsDataURL(this.pictureFile);
    },

    change: function (event) {
        // Remove any existing alert message
        /*
        utils.hideAlert();

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
        }
        */
    }

});