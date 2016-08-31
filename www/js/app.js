var App = {

  isDeviceReady: false,
  authorizationStatus: Constants.AuthorizationEnum.NOT_REQUESTED,
  accuracyStatus: Constants.AccuracyEnum.DISABLED,


  initialize: function () {
    console.log("onInitialize");
    if (LocalStorage.get("firsttime_startup")) {
      $.mobile.pageContainer.pagecontainer("change", "#startup", { changeHash: true, transition: "none" });
      StartupPage.onDeviceReady();
    } else {
      document.addEventListener("deviceready", this.onDeviceReady, false);
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
  },


  // callbacks


  onDeviceReady: function () {
    console.log("onDeviceReady");

    // bind App events
    $(document).on("resume", App.onResume);
    $(document).on("pause", App.onPause);
    $(document).on("pagecontainershow", App.onPageContainerShow);

    // remove FastClick glitch from checkboxradio widgets
    disableUnwantedFastClickElements();

    SettingsPage.onDeviceReady();
    HomePage.onDeviceReady();
    App.isDeviceReady = true;

    App.initializeFCM();

    Location.requestLocationPermission();

    // listen for keyboard events
    window.addEventListener("native.keyboardshow", onKeyboardShowInHomePage);

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

    // remove listener for keyboard events
    window.removeEventListener("native.keyboardshow", onKeyboardShowInHomePage);

    // Use this if the page needs initialized everytime the page is viewed
    switch (pageId) {
    case Constants.STARTUP_PAGE:
      StartupPage.initialize();
      break;
    case Constants.HOME_PAGE:
      HomePage.initialize();
      // listen for keyboard events
      window.addEventListener("native.keyboardshow", onKeyboardShowInHomePage);
      break;
    case Constants.MAP_PAGE:
      console.log("refreshing iframe");
      $('#iframe-map').attr('src', $('#iframe-map').attr('src'));
      break;
    case Constants.SETTINGS_PAGE:
      SettingsPage.initialize();
      break;
    }
  }

}


$(function() {
  console.log("onLoad");
  // avoid click delay on ios
  FastClick.attach(document.body);
  App.initialize();
});
