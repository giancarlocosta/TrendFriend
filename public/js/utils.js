window.utils = {

    // Asynchronously load templates located in separate .html files
    loadTemplate: function(views, callback) {
        var deferreds = [];
        $.each(views, function(index, view) {
            if (window[view]) {
                deferreds.push($.get('Templates/' + view + '.html', function(data) {
                    window[view].prototype.template = _.template(data);
                }));
            } else {
                alert(view + " not found");
            }
        });

        $.when.apply(null, deferreds).done(callback);
    },

    displayValidationErrors: function (messages) {
        for (var key in messages) {
            if (messages.hasOwnProperty(key)) {
                this.addValidationError(key, messages[key]);
            }
        }
        this.showAlert('Warning!', 'Fix validation errors and try again', 'alert-warning');
    },

    addValidationError: function (field, message) {
        var controlGroup = $('#' + field).parent().parent();
        controlGroup.addClass('error');
        $('.help-inline', controlGroup).html(message);
    },

    removeValidationError: function (field) {
        var controlGroup = $('#' + field).parent().parent();
        controlGroup.removeClass('error');
        $('.help-inline', controlGroup).html('');
    },

    showAlert: function(title, text, klass) {
        $('.alert').removeClass("alert-error alert-warning alert-success alert-info");
        $('.alert').addClass(klass);
        $('.alert').html('<strong>' + title + '</strong> ' + text);
        $('.alert').show();
    },

    hideAlert: function() {
        $('.alert').hide();
    },

    showNotification: function(title, text, klass) {
        $('#notification').removeClass("alert-error alert-warning alert-success alert-info");
        $('#notification').addClass(klass);
        $('#notification').html('<strong>' + title + '</strong> ' + text);
        $('#notification').show();
        setTimeout(function(){ $('#notification').hide(); }, 5000);
    },

    hideNotification: function() {
        $('.notification').hide();
    },

    showChart: function() {
        $('#myChart').show();
    },

    hideChart: function() {
        $('#myChart').hide();
    },

    toggleFollowButton: function(selector, isFollowing) {
        if(isFollowing) {
            selector.css( "background-color", "green");
            selector.html( "Following");
            selector.removeClass("follow");
            selector.addClass("unfollow");
        }
        else {
            selector.css( "background-color", "white");
            selector.html( "Follow");
            selector.removeClass("unfollow");
            selector.addClass("follow");
        }
    },

    getCurrentDate: function() {
        var d = new Date();
        var year = d.getFullYear();;
        var month = d.getMonth() < 10 ? ("0" + d.getMonth()) : d.getMonth();
        var day = d.getDate() < 10 ? ("0" + (d.getDate() - 1)) : (d.getDate() - 1);
        return year + "-" + month + "-" + day;
    }


};