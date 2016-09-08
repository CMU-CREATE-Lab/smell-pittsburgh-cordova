var App = {

  isDeviceReady: false,
  authorizationStatus: Constants.AuthorizationEnum.NOT_REQUESTED,
  accuracyStatus: Constants.AccuracyEnum.DISABLED,
  textfieldToScrollAfterKeyboard: null, // this is the textfield you want to scroll to after the keyboard has been opened


  initialize: function () {
    console.log("onInitialize");
    if (LocalStorage.get("firsttime_startup")) {
      $.mobile.pageContainer.pagecontainer("change", "#startup", { changeHash: true, transition: "none" });
      StartupPage.onDeviceReady();
    } else {
      document.addEventListener("deviceready", this.onDeviceReady, false);
    }
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

    initializeFCM();
    // subscribe to topics
    FCMPlugin.subscribeToTopic(Constants.GLOBAL_TOPIC);
    console.log("subcribed to: " + Constants.GLOBAL_TOPIC);
    var activeSmells = LocalStorage.get("smell_notification_values");
    Object.keys(activeSmells).forEach(function(key) {
      if (activeSmells[key]) subscribeToSmell(key);
    });

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
    // request location again if app is closed and reopened to HomePage
    // if ($.mobile.pageContainer.pagecontainer("getActivePage")[0].id == Constants.HOME_PAGE) Location.requestLocation();
    if ($.mobile.pageContainer.pagecontainer("getActivePage")[0].id == Constants.HOME_PAGE) HomePage.initialize();
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
      // listen for keyboard events
      window.addEventListener("native.keyboardshow", onKeyboardShowInHomePage);
      break;
    }
  }

}


// HTML body onLoad
$(function() {
  console.log("onLoad");
  // avoid click delay on ios
  FastClick.attach(document.body);
  App.initialize();
});
