var App = {

  isDeviceReady: false,
  authorizationStatus: Constants.AuthorizationEnum.NOT_REQUESTED,
  accuracyStatus: Constants.AccuracyEnum.DISABLED,
  htmlElementToScrollAfterKeyboard: null, // this is the HTML element you want to scroll to after the keyboard has been opened
  htmlElementToBlurAfterKeyboardCloses: null, // this is the HTML element you need to blur after the keyboard has been closed to avoid weird glitches on using checkboxradio widgets


  initialize: function () {
    console.log("onInitialize");
    if (LocalStorage.get("firsttime_startup")) {
      $.mobile.pageContainer.pagecontainer("change", "#startup", { changeHash: true, transition: "none" });
      StartupPage.onDeviceReady();
    } else {
      document.addEventListener("deviceready", this.onDeviceReady, false);
    }
  },


  // helper functions


  initializePage: function(pageId) {
    // remove listener for keyboard events
    window.removeEventListener("native.keyboardshow", onKeyboardShowInHomePage);
    window.removeEventListener('native.keyboardhide', onKeyboardHide);

    // Use this if the page needs initialized everytime the page is viewed
    switch (pageId) {
    case Constants.STARTUP_PAGE:
      StartupPage.initialize();
      break;
    case Constants.HOME_PAGE:
      HomePage.initialize();
      // listen for keyboard events
      window.addEventListener("native.keyboardshow", onKeyboardShowInHomePage);
      window.addEventListener('native.keyboardhide', onKeyboardHide);
      break;
    case Constants.MAP_PAGE:
      MapPage.initialize();
      break;
    case Constants.SETTINGS_PAGE:
      SettingsPage.initialize();
      // listen for keyboard events
      window.addEventListener("native.keyboardshow", onKeyboardShowInHomePage);
      window.addEventListener('native.keyboardhide', onKeyboardHide);
      break;
    case Constants.ABOUT_PAGE:
      AboutPage.initialize();
      break;
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
    MapPage.onDeviceReady();
    AboutPage.onDeviceReady();
    App.isDeviceReady = true;

    initializeFCM();
    // subscribe to topics
    FCMPlugin.subscribeToTopic(Constants.GLOBAL_TOPIC);
    console.log("subcribed to: " + Constants.GLOBAL_TOPIC);
    if (LocalStorage.get("receive_pghaqi_notifications")) {
      FCMPlugin.subscribeToTopic(Constants.PITTSBURGH_AQI_TOPIC);
      console.log("subcribed to: " + Constants.PITTSBURGH_AQI_TOPIC);
    }
    if (LocalStorage.get("receive_smell_notifications")) {
      FCMPlugin.subscribeToTopic(Constants.SMELL_REPORT_TOPIC);
      console.log("subcribed to: " + Constants.SMELL_REPORT_TOPIC);
    }

    Location.requestLocationPermission();

    // listen for keyboard events
    window.addEventListener("native.keyboardshow", onKeyboardShowInHomePage);
    window.addEventListener('native.keyboardhide', onKeyboardHide);

    if ($.mobile.pageContainer.pagecontainer("getActivePage")[0].id == Constants.HOME_PAGE) HomePage.initialize();
  },


  onResume: function() {
    console.log("onResume");

    var pageId = $.mobile.pageContainer.pagecontainer("getActivePage")[0].id;
    App.initializePage(pageId);
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
    App.initializePage(pageId);
  }

}


// HTML body onLoad
$(function() {
  console.log("onLoad");
  // avoid click delay on ios
  FastClick.attach(document.body);
  App.initialize();
});
