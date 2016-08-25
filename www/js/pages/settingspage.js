


var SettingsPage = {

    flipswitchReady: false,
    activeSmells: new Array(),

    validateEmail: function(email) { 
        var regexp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\ ".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regexp.test(email);
     }, 

    initialize: function () {
        // global notification
        console.log(LocalStorage.isNotification);
        if (LocalStorage.isNotification) {
            $("#flip_notification").val("on");
            $("#flip_notification").flipswitch("refresh");
            $("#checkbox_smell_notifications").checkboxradio("enable");
        }
        else {
            $("#flip_notification").val("off");
            $("#flip_notification").flipswitch("refresh");
            $("#checkbox_smell_notifications").checkboxradio("disable");
        }
        SettingsPage.flipswitchReady = true;

        // smell notification
        $("#checkbox_smell_notifications").prop("checked", LocalStorage.isSmellNotification).checkboxradio("refresh");
        if (LocalStorage.isSmellNotification) $("#checkboxes input[type='checkbox']").checkboxradio('enable');
        else $("#checkboxes input[type='checkbox']").checkboxradio('disable');

        for (var i = 1; i < LocalStorage.smells.length; i++) {
            if (LocalStorage.smells[i]) $("#checkbox-choice-" + i).prop("checked", true).checkboxradio("refresh");
            else $("#checkbox-choice-" + i).prop("checked", false).checkboxradio("refresh");
        }

        $("#textfield_email").prop("value", LocalStorage.email);
        $("#textfield_name").prop("value", LocalStorage.name);
        $("#textfield_phone").prop("value", LocalStorage.phone);

        $("#notificationsCollapsible").collapsible({
            collapsed: false
        });
        $("#reportsCollapsible").collapsible({
            collapsed: false
        });

        this.activeSmells = LocalStorage.smells;
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
        if (!SettingsPage.flipswitchReady)
            return;
        if (LocalStorage.isNotification) {
            // make sure to update all of the local storage elements
            LocalStorage.setIsNotification(false);
            LocalStorage.setIsSmellNotification(false);
            $("#checkbox_smell_notifications").prop("checked", LocalStorage.isSmellNotification).checkboxradio("refresh");
            $("#checkbox_smell_notifications").checkboxradio("disable");
            $("#checkboxes input[type='checkbox']").checkboxradio('disable');

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
            LocalStorage.setIsSmellNotification(false);
            $("#checkboxes input[type='checkbox']").checkboxradio('disable');
            SettingsPage.clearSmellNotifications();
        } else {
            LocalStorage.setIsSmellNotification(true);
            $("#checkboxes input[type='checkbox']").checkboxradio('enable');

            for (var i = 1; i < SettingsPage.activeSmells.length; i++) {
                if (SettingsPage.activeSmells[i]) SettingsPage.subscribeToSmell(i);
            }
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
    },

    onNameChange: function(event) {
        LocalStorage.setName(this.value);
    },

    onPhoneChange: function (event) {
        LocalStorage.setPhone(this.value);
    },

    onCheckboxClick: function (item) {
        // some smell value 1-5 (string)
        var smellValue = item.value;

        if (item.checked) {
            SettingsPage.subscribeToSmell(smellValue);
            SettingsPage.activeSmells[smellValue] = true;
            LocalStorage.setSmells(SettingsPage.activeSmells);
        } else {
            SettingsPage.unsubscribeToSmell(smellValue);
            SettingsPage.activeSmells[smellValue] = false;
            LocalStorage.setSmells(SettingsPage.activeSmells);
        }
    }
}