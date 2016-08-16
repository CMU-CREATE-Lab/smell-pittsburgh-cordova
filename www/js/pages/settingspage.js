


var SettingsPage = {

    validateEmail: function(email) { 
        var regexp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\ ".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regexp.test(email);
     }, 

    initialize: function () {
        // global notification
        $("#checkbox_notifications").prop("checked", LocalStorage.isNotification).checkboxradio("refresh");
        if (LocalStorage.isNotification) $("#checkbox_smell_notifications").checkboxradio("enable");
        else $("#checkbox_smell_notifications").checkboxradio("disable");

        // smell notification
        $("#checkbox_smell_notifications").prop("checked", LocalStorage.isSmellNotification).checkboxradio("refresh");
        if (LocalStorage.smellMin != null) {
            console.log(LocalStorage.SmellMin);
            $("#slider_smell_notification").val(5 - LocalStorage.smellMin + 1).slider("refresh");
            $("#slider_smell_notification").val(LocalStorage.smellMin);
        }
        else {
            $("#slider_smell_notification").val(2).slider("refresh");
            $("#slider_smell_notification").val(4);
        }
        SettingsPage.previousValue = $("#slider_smell_notification").val();
        $("#p_slider_info").text("Receive notifications of smell reports " + $("#slider_smell_notification").val() + " or higher.");

        if (LocalStorage.isSmellNotification) $("#slider_smell_notification").slider("enable");
        else $("#slider_smell_notification").slider("disable");

        $("#textfield_email").prop("value", LocalStorage.email);

        $("#notificationsCollapsible").collapsible({
            collapsed: false
        });
        $("#reportsCollapsible").collapsible({
            collapsed: false
        });

        // disable text input on slider
        $("#slider_smell_notification").addClass('ui-disabled');
    },

    clearSmellNotifications: function () {
        for (var i = 1; i <= 5; i++) {
            FCMPlugin.unsubscribeFromTopic(Constants.SMELL_REPORT_TOPIC + i);
            console.log("unsubcribed from: SmellReport-" + i);
        }
    },

    onToggleNotifications: function() {
        if (LocalStorage.isNotification) {
            // make sure to update all of the local storage elements
            LocalStorage.setIsNotification(false);
            LocalStorage.setIsSmellNotification(false);
            $("#checkbox_smell_notifications").prop("checked", LocalStorage.isSmellNotification).checkboxradio("refresh");
            $("#checkbox_smell_notifications").checkboxradio("disable");
            $("#slider_smell_notification").slider("disable");

            // make sure to unsubscribe from all possible notifications
            SettingsPage.clearSmellNotifications();
            FCMPlugin.unsubscribeFromTopic(Constants.GLOBAL_TOPIC);
            console.log("unsubcribed from: " + Constants.GLOBAL_TOPIC);
        } else {
            $("#checkbox_smell_notifications").checkboxradio("enable");
            LocalStorage.setIsNotification(true);
            FCMPlugin.subscribeToTopic(Constants.GLOBAL_TOPIC);
            console.log("subcribed to: " + Constants.GLOBAL_TOPIC);

        }
    },

    onToggleSmellNotifications: function() {
        if (LocalStorage.isSmellNotification) {
            $("#slider_smell_notification").slider("disable");
            LocalStorage.setIsSmellNotification(false);
            LocalStorage.setSmellMax(Constants.MAX_SMELL_NOTIFICATION);
            LocalStorage.setSmellMin($("#slider_smell_notification")[0].value);
            SettingsPage.clearSmellNotifications();
        } else {
            $("#slider_smell_notification").slider("enable");
            LocalStorage.setIsSmellNotification(true);
            var max = 5;
            var min = $("#slider_smell_notification")[0].value;
            LocalStorage.setSmellMax(max);
            LocalStorage.setSmellMin(min);

            for (var i = max; i >= min; i--) {
                FCMPlugin.subscribeToTopic(Constants.SMELL_REPORT_TOPIC + i);
                console.log("subscribed to: SmellReport-" + i);
            }
        }
    },

   
    onSmellSliderChange: function (event) {
        console.log("onSliderChange");
        this.value = 5 - this.value + 1;
        $("#p_slider_info").text("Receive notifications of smell reports " + this.value + " or higher.");
    },

    previousValue: 0,
    onSmellSliderStop: function (event) {
        console.log("onSliderStop");
        // A little hack so that the value changes if the user clicks on a position in the slider instead of actually sliding it.
        if ($("#slider_smell_notification")[0].value == SettingsPage.previousValue) {
            
            var value = SettingsPage.previousValue;
            console.log(value);
            switch (value) {
                case "5":
                    this.value = 1;
                    break;
                case "4":
                    this.value = 2;
                    break;
                case "2":
                    this.value = 4;
                    break;
                case "1":
                    this.value = 5;
                    break;
            }
        }
        $("#p_slider_info").text("Receive notifications of smell reports " + this.value + " or higher.");
        SettingsPage.previousValue = this.value;

        var max = Constants.MAX_SMELL_NOTIFICATION;
        var min = $("#slider_smell_notification")[0].value;
        LocalStorage.setSmellMax(max);
        LocalStorage.setSmellMin(min);

        SettingsPage.clearSmellNotifications();
        for (var i = max; i >= min; i--) {
            FCMPlugin.subscribeToTopic(Constants.SMELL_REPORT_TOPIC + i);
            console.log("subscribed to: SmellReport-" + i);
        }
    },

    onEmailChange: function (event) {
        if (SettingsPage.validateEmail(this.value) || this.value == "") {
            LocalStorage.setEmail(this.value);
        } else {
            this.value = "";
            navigator.notification.alert(
                "Enter a valid email address.",
                null,
                "Invalid Email Entry",
                "Ok"
            );
        }
    }

}