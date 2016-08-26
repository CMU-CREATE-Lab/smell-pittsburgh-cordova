


var App = {

    isDeviceReady: false,
    authorizationStatus: Constants.AuthorizationEnum.NOT_REQUESTED,
    accuracyStatus: Constants.AccuracyEnum.DISABLED,

    initialize: function () {
        console.log("onInitialize");
        localStorage.clear();
        if (!LocalStorage.isStartupDone) {
            $.mobile.pageContainer.pagecontainer("change", "#startup", { changeHash: true, transition: "none" });
            // $.mobile.changePage($("#startup"), { changeHash: true, transition: "none" });
        } else {
            App.bindEvents();
        }
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
        //$(document).on("pagecreate", App.onPageCreate);
        $("#flip_notification").change(SettingsPage.onToggleNotifications);
        $("#checkbox_smell_notifications").click(SettingsPage.onToggleSmellNotifications);
        $("#textfield_email").change(SettingsPage.onEmailChange);
        $("#textfield_name").change(SettingsPage.onNameChange);
        $("#textfield_phone").change(SettingsPage.onPhoneChange);
        $("#button_submit_report").click(HomePage.onClickSubmit);

        App.isDeviceReady = true;
        App.initializeFCM();
        Location.requestLocationPermission();
        
        // TODO browser doesn't use onResume
        if (!Constants.PLATFORM_CALLBACK_ONREADY) {
            Location.requestLocation();
        }
    },

    onResume: function() {
        console.log("onResume");
        if (App.isDeviceReady && Location.isRequestingLocation && App.accuracyStatus === Constants.AccuracyEnum.ENABLED) {
            Location.requestLocation();
        } else if (App.isDeviceReady && App.authorizationStatus === Constants.AuthorizationEnum.GRANTED && !Location.isRequestingLocation) {
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

    onPageContainerShow: function (event, ui) {
        var pageId = $.mobile.pageContainer.pagecontainer("getActivePage")[0].id;
        console.log("onPageContainerShow: " + pageId);

        // Use this if the page needs initialized everytime the page is viewed
        switch (pageId) {
            case Constants.STARTUP_PAGE:
                break;
            case Constants.HOME_PAGE:
                break;
            case Constants.MAP_PAGE:
                console.log("refreshing iframe");
                $('#iframe-map').attr('src', $('#iframe-map').attr('src'));
                break;
            case Constants.SETTINGS_PAGE:
                SettingsPage.initialize();
                break;
        }
    },

    initializeFCM: function () {
        console.log("onInitializeFCM");
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
    console.log("onLoad");
    // avoid click delay on ios
    FastClick.attach(document.body);
    App.initialize();
}