


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

        $("#slider_smell_notification").addClass("ui-disabled");
    },

    clearSmellNotifications: function () {
        for (var i = 1; i <= 5; i++) {
            FCMPlugin.unsubscribeFromTopic(Constants.SMELL_REPORT_TOPIC + i);
            console.log("unsubcribed from: SmellReport-" + i);
        }
    },

    subscribeToSmell: function(value) {
        FCMPlugin.subscribeToTopic(Constants.SMELL_REPORT_TOPIC + value);
        console.log("subcribed to: " + Constants.SMELL_REPORT_TOPIC + value);
    },

    unsubscribeToSmell: function(value) {
        FCMPlugin.unsubscribeFromTopic(Constants.SMELL_REPORT_TOPIC + value);
        console.log("unsubcribed from: SmellReport-" + value);
    },

    updateSmellInfo: function () {
        var textInfo = "";
        for (var i = 0; i < LocalStorage.smellNotifications.length; i++) {
            if (LocalStorage.smellNotifications[i]) {
                textInfo += "" + i + ", ";
            }
        }
        if (textInfo != "") {
            textInfo = textInfo.substr(0, textInfo.length - 2);
            $("#p_notification_info").text("Receive notifications of smell reports " + textInfo + ".");
        } else {
            $("#p_notification_info").text("Reveiving no notifications of smell reports.");
        }
        
    },

    onToggleNotifications: function() {
        if (LocalStorage.isNotification) {
            // make sure to update all of the local storage elements
            LocalStorage.setIsNotification(false);
            LocalStorage.setIsSmellNotification(false);
            $("#checkbox_smell_notifications").prop("checked", LocalStorage.isSmellNotification).checkboxradio("refresh");
            $("#checkbox_smell_notifications").checkboxradio("disable");
            $(".disable").button("disable");

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

    previousValue: 0,
    isSliderStarted: false,
    onSmellSliderStart: function(event) {
        console.log("onSmellSliderStart");
        SettingsPage.isSliderStarted = true;
        SettingsPage.previousValue = this.value;
        this.value = null;
    },
   
    onSmellSliderChange: function () {
        if (SettingsPage.isSliderStarted) {
            console.log("onSliderChange");
            if (this.value != null) {
                SettingsPage.previousValue = this.value;
            }
            this.value = NaN;
            $("#p_slider_info").text("Receive notifications of smell reports " + (5 - SettingsPage.previousValue + 1) + " or higher.");
        }
    },

    onSmellSliderStop: function (event) {
        console.log("onSliderStop");
        this.value = SettingsPage.previousValue;
        $("#slider_smell_notification").slider("refresh");
        this.value = 5 - this.value + 1;
        SettingsPage.isSliderStarted = false;
        $("#p_slider_info").text("Receive notifications of smell reports " + this.value + " or higher.");
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