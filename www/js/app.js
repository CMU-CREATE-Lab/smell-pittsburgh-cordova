


var App = {

    isDeviceReady: false,
    authorizationStatus: Constants.AuthorizationEnum.NOT_REQUESTED,
    accuracyStatus: Constants.AccuracyEnum.DISABLED,

    initialize: function () {
        console.log("onInitialize");
        this.bindEvents();
    },

    bindEvents: function () {
        console.log("onBindEvents");
        document.addEventListener("deviceready", this.onDeviceReady, false);
    },

    onDeviceReady: function () {
        console.log("onDeviceReady");
        $(document).on("resume", App.onResume);
        $(document).on("pause", App.onPause);
        $(document).on("pagecontainershow", App.onPageContainerShow);

        // Static Input Bindings
        $(document).on("pagecreate", App.onPageCreate);
        $("#checkbox_notifications").click(SettingsPage.onToggleNotifications);
        $("#checkbox_smell_notifications").click(SettingsPage.onToggleSmellNotifications);
        $("#button_submit_report").click(HomePage.onClickSubmit);

        App.isDeviceReady = true;
        App.initializeFCM();
        Location.requestLocationPermission();
    },

    onResume: function() {
        console.log("onResume");
        if (App.isDeviceReady && Location.isAccuracyPrompt && App.accuracyStatus === Constants.AccuracyEnum.ENABLED) {
            Location.requestLocation();
        } else if (App.isDeviceReady && App.authorizationStatus === Constants.AuthorizationEnum.GRANTED && !Location.isAccuracyPrompt) {
            Location.requestLocation();
        }
    },

    onPause: function() {
        console.log("onPause");
        if (App.isDeviceReady && App.authorizationStatus === Constants.AuthorizationEnum.GRANTED) {
            Location.stopRequestLocation();
        } else if (App.isDeviceReady) {
            hideSpinner();
        }
    },

    // TODO - learn more about this kind of event and why I need these bindings in here
    onPageCreate: function (event, ui) {
        console.log("onPageCreate");
        // Bindings that must be within page create
        $("#slider_smell_notification").on("change", SettingsPage.onSmellSliderChange);
        $("#slider_smell_notification").on("slidestop", SettingsPage.onSmellSliderStop);
        $("#textfield_email").on("change", SettingsPage.onEmailChange);
    },

    onPageContainerShow: function (event, ui) {
        var pageId = $.mobile.pageContainer.pagecontainer("getActivePage")[0].id;
        console.log("onPageContainerShow: " + pageId);

        // Use this if the page needs initialized everytime the page is viewed
        switch (pageId) {
            case Constants.HOME_PAGE:
                break;
            case Constants.MAP_PAGE:
                console.log("refreshing iframe");
                $('#iframe-map').attr('src', $('#iframe-map').attr('src'));
                break;
            case Constants.SETTINGS_PAGE:
                // TODO - I may only need to call this once in a pagecreate method
                SettingsPage.initialize();
                break;
        }
    },

    initializeFCM: function () {
        FCMPlugin.getToken(
			// success
			function (token) {
			    // empty for now
			},
			// error
			function (error) {
			    // empty for now
			}
		);

        FCMPlugin.onNotification(
			// callback
			function (data) {
			    if (data.wasTapped) {
			        //Notification was received on device tray and tapped by the user. 
			    } else {
			        //Notification was received in foreground. Maybe the user needs to be notified.
			    }
			},
			// success
			function (message) {
			    // empty for now
			},
			// error
			function (error) {
			    // empty for now
			}
		);
    }

}

function onLoad() {
    App.initialize();
}