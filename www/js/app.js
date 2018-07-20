/**
 * Namespace for all app-related calls.
 * @namespace App
 */
var hi="hello";
var z={ll:"frog","1":{t:"5"},"2":{t:"3"}};
var oddArr=[{title:"hello"},{title:"cat"}];
var App = {

  isDeviceReady: false,
  authorizationStatus: Constants.AuthorizationEnum.NOT_REQUESTED,
  accuracyStatus: Constants.AccuracyEnum.DISABLED,
  htmlElementToScrollAfterKeyboard: null, // this is the HTML element you want to scroll to after the keyboard has been opened
  htmlElementToBlurAfterKeyboardCloses: null, // this is the HTML element you need to blur after the keyboard has been closed to avoid weird glitches on using checkboxradio widgets
  pastPage:"home",

  /**
   * The type of callback that is being handled for calls to {@link initializePage}.
   * @enum {number}
   */
  CallbackType: {
    CREATE: 0,
    RESUME: 1,
    PAUSE: 2
  },


  /**
   * Called after the HTML body loads.
   */
  initialize: function () {
    var a="cat";
    console.log("onInitialize");
      console.log(english.home.panel)


    if (LocalStorage.get("firsttime_startup")) {
      $.mobile.pageContainer.pagecontainer("change", "#startup", { changeHash: true, transition: "none" });
      StartupPage.onDeviceReady();
    } else {
      document.addEventListener("deviceready", this.onDeviceReady, false);
    }
    $(".back-x").click(function(){App.navToPageID(App.pastPage)});
  },


  // helper functions


  /**
   * Perform necessary initialization after page loads.
   * @param {string} pageId - HTML id for the jquerymobile page.
   * @param {callbackType} callbackType
   */
  initializePage: function(pageId, callbackType) {
    // remove listener for keyboard events
    window.removeEventListener("native.keyboardshow", onKeyboardShowInHomePage);
    window.removeEventListener('native.keyboardhide', onKeyboardHide);

    // set Screen name for Firebase Analytics (NOTE: pageId might be nonsense)
    Analytics.setScreenName(pageId);

    // Use this if the page needs initialized everytime the page is viewed
    console.log("switching")
    switch (pageId) {
    case Constants.STARTUP_PAGE:
      StartupPage.initialize();
      break;
    case Constants.HOME_PAGE:
      HomePage.initialize();
      App.pastPage=Constants.HOME_PAGE;
      // listen for keyboard events
      window.addEventListener("native.keyboardshow", onKeyboardShowInHomePage);
      window.addEventListener('native.keyboardhide', onKeyboardHide);
      break;
    case Constants.MAP_PAGE:
      if (callbackType == App.CallbackType.CREATE) {
        MapPage.initialize();
      }
      App.pastPage=Constants.MAP_PAGE;
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
    case Constants.LOCATION_SELECT_PAGE:
      if (callbackType == App.CallbackType.CREATE) {
        LocationSelectPage.initialize();
      }
      break;
    }
  },


  // callbacks

do:function(){
    //$('#home').popup()
    //$('#home').page('refresh')
},
  /**
   * Listener for ondeviceready on document.
   */
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
    LocationSelectPage.onDeviceReady();
    App.isDeviceReady = true;

    initializeFCM();
    // subscribe to topics
    window.FirebasePlugin.subscribe(Constants.GLOBAL_TOPIC);
    console.log("subcribed to: " + Constants.GLOBAL_TOPIC);
    if (LocalStorage.get("receive_pghaqi_notifications")) {
      window.FirebasePlugin.subscribe(Constants.PITTSBURGH_AQI_TOPIC);
      console.log("subcribed to: " + Constants.PITTSBURGH_AQI_TOPIC);
    }
    if (LocalStorage.get("receive_smell_notifications")) {
      window.FirebasePlugin.subscribe(Constants.SMELL_REPORT_TOPIC);
      console.log("subcribed to: " + Constants.SMELL_REPORT_TOPIC);
    }

    window.FirebasePlugin.grantPermission();
    Location.requestLocationPermission();

    // start Analytics
    Analytics.initialize();

    // listen for keyboard events
    window.addEventListener("native.keyboardshow", onKeyboardShowInHomePage);
    window.addEventListener('native.keyboardhide', onKeyboardHide);

    if ($.mobile.pageContainer.pagecontainer("getActivePage")[0].id == Constants.HOME_PAGE) HomePage.initialize();
  },


  /**
   * Binded "resume" event for document.
   */
  onResume: function() {
    console.log("onResume");
    Analytics.logOnResumeEvent();

    var pageId = $.mobile.pageContainer.pagecontainer("getActivePage")[0].id;
    App.initializePage(pageId, App.CallbackType.RESUME);
  },


  /**
   * Binded "pause" event for document.
   */
  onPause: function() {
    console.log("onPause");
    Analytics.logOnPauseEvent();

    if (App.isDeviceReady && App.authorizationStatus === Constants.AuthorizationEnum.GRANTED) {
      Location.stopRequestLocation();
    } else if (App.isDeviceReady) {
      hideSpinner();
    }
  },


  /**
   * Binded "pagecontainershow" event for document. switch
   */
  onPageContainerShow: function (event, ui) {
    var pageId = $.mobile.pageContainer.pagecontainer("getActivePage")[0].id;
    console.log("onPageContainerShow: " + pageId);
    App.initializePage(pageId, App.CallbackType.CREATE);
  },
  navToPageID: function(pageId){
    window.location="#"+pageId;
  }

}


// HTML body onLoad
$(function() {
  console.log("onLoad");
  // avoid click delay on ios
  FastClick.attach(document.body);
    App.do()
  App.initialize();
});
