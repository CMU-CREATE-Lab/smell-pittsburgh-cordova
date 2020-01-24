/**
 * Namespace for all app-related calls.
 * @namespace App
 */
var App = {

  isDeviceReady: false,
  authorizationStatus: Constants.AuthorizationEnum.NOT_REQUESTED,
  accuracyStatus: Constants.AccuracyEnum.DISABLED,
  htmlElementToScrollAfterKeyboard: null, // this is the HTML element you want to scroll to after the keyboard has been opened
  //htmlElementToBlurAfterKeyboardCloses: null, // this is the HTML element you need to blur after the keyboard has been closed to avoid weird glitches on using checkboxradio widgets
  pastPage: Constants.HOME_PAGE,//The page one was on before switching used for x button
  text: getText(LocalStorage.get("language")),//parameter doesnt matter until more languages and method of selecting and getting them is decided
  didFirstTimeLocationCheck: false,
  isFinalPermissionPopupActive: false,
  cityNameCacheBustTime: 600000, // the number of milliseconds to store a city name until it is deemed stale (10 min)
  request: null,
  ajaxTimeout: 3000, // the number of milliseconds to wait for the ajax request to timeout

  /**
   * The type of callback that is being handled for calls to {@link initializePage}.
   * @enum {number}
   */
  CallbackType: {
    CREATE: 0,
    RESUME: 1,
    PAUSE: 2,
  },


  /**
   * Called after the HTML body loads.
   */
  initialize: function() {
      // console.log(Constants);
    console.log("onInitialize");
    document.addEventListener("deviceready", this.onDeviceReady, false);
  },


  // helper functions


  /**
   * Perform necessary initialization after page loads.
   * @param {string} pageId - HTML id for the jquerymobile page.
   * @param {callbackType} callbackType
   */
  initializePage: function(pageId, callbackType) {
    console.log("initializePage");
    // remove listener for keyboard events
    window.removeEventListener("keyboardDidShow", onKeyboardShowInHomePage);
    window.removeEventListener('keyboardDidHide', onKeyboardHide);

    // set Screen name for Firebase Analytics (NOTE: pageId might be nonsense)
    Analytics.setScreenName(pageId);
    // Use this if the page needs initialized everytime the page is viewed
    switch (pageId) {
      case Constants.UPDATES_PAGE:
        UpdatesPage.initialize();
        break;
      case Constants.STARTUP_PAGE:
        StartupPage.initialize();
        break;
      case Constants.HOME_PAGE:
        HomePage.initialize();
        // change pastPage so the x sends the user here
        App.pastPage=Constants.HOME_PAGE;
        // listen for keyboard events
        window.addEventListener("keyboardDidShow", onKeyboardShowInHomePage);
        window.addEventListener('keyboardDidHide', onKeyboardHide);
        break;
      case Constants.MAP_PAGE:
        if (callbackType == App.CallbackType.CREATE) {
          MapPage.initialize();
        }
        // change pastPage so the x sends the user here
        App.pastPage = Constants.MAP_PAGE;
        break;
      case Constants.SETTINGS_PAGE:
        SettingsPage.initialize();
        // listen for keyboard events
        window.addEventListener("keyboardDidShow", onKeyboardShowInHomePage);
        window.addEventListener('keyboardDidHide', onKeyboardHide);
        break;
      case Constants.ABOUT_PAGE:
        AboutPage.initialize();
        break;
      case Constants.HOW_IT_WORKS_PAGE:
        HowItWorksPage.initialize();
        break;
      case Constants.LOCATION_SELECT_PAGE:
        if (callbackType == App.CallbackType.CREATE) {
          LocationSelectPage.initialize();
        }
        break;
      default:
        // TODO some default page?
        break;
    }

  },


  // callbacks


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

    App.isDeviceReady = true;

    Firebase.initialize();
    Location.requestLocationPermission();

    // start Analytics
    Analytics.initialize();

    // listen for keyboard events
    window.addEventListener("keyboardDidShow", onKeyboardShowInHomePage);
    window.addEventListener('keyboardDidHide', onKeyboardHide);

    //Logic for deciding when to display the new update features page
    if(new Date(LocalStorage.get("last_update_notification")) < (new Date(Constants.UPDATE_NEEDING_NOTIFICATION_DATE))){
      LocalStorage.set("last_update_notification", Constants.UPDATE_NEEDING_NOTIFICATION_DATE);
      LocalStorage.set("new_user_update",true);
    }
    if (LocalStorage.get("firsttime_startup")) {
      App.navigateToPage(Constants.STARTUP_PAGE);
      //No update news for new users
      LocalStorage.set("new_user_update",false);
    } else {
      //Redicrect current users to the update news
      if(LocalStorage.get("new_user_update")){
          App.navigateToPage(Constants.UPDATES_PAGE);
          LocalStorage.set("new_user_update",false);
      }
      if ($.mobile.pageContainer.pagecontainer("getActivePage")[0].id == Constants.HOME_PAGE) {
        HomePage.initialize();
      }

    }


  },


  /**
   * Binded "resume" event for document.
   */
  onResume: function() {
    console.log("onResume");
    // Workaround for Android 7+ issue with Cordova
    // See CB-14132: https://issues.apache.org/jira/browse/CB-14132
    navigator.connection.getInfo(function(type){
      navigator.connection.type = type;
      Location.requestLocationPermission();
    });
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


  /**
   * changes current page through the jquery mobile framework.
   * @param {string} pageId -id of the page to go to
   */
  navigateToPage: function(pageId) {
    $.mobile.pageContainer.pagecontainer("change", "#" + pageId, { changeHash: true, transition: "none" });
  },

  /**
   * changes html and css for popup div, making it temporarily visible before transitioning to invisible again.
   * using visibility:hidden rather than display:none, as display:none messes with transition
   */
  showPopup: function(divId, time){
    $('#'+divId).css("transition-duration", (time/1000) + "s");
    $("#"+divId).one("click", function(){$("#"+divId).one("click", function(){ $("#"+divId).removeClass("popup-fadeout"); $(this).css("visibility","hidden")}); $(this).css("visibility","hidden")});
    $("#"+divId).addClass("popup-fadeout");
    popUpTimer = setTimeout(function(){
      $("#"+divId).removeClass("popup-fadeout");
    },time);
  },
  /**
   * goes back to the previous page, most likely called when back/X button is clicked.
   */
  navigateToPastPage: function() {
    App.navigateToPage(App.pastPage);
  },

}


// HTML body onLoad
$(function() {
  console.log("onLoad");
  // Avoid click delay on ios
  FastClick.attach(document.body);
  // Prevent long press from adding active button css
  $("body").on("taphold", "a.ui-btn", function(e){
    if ($(this).hasClass("ui-btn-active")) return;
    $(this).one("touchend", function(e){
      e.preventDefault();
      $(this).removeClass("ui-btn-down-a ui-btn-active");
      return false;
    });
  });
  // Allow for tapping outside the panel to close it on ios
  $(window).on('click', function(e) {
    var $target = $(e.target);
    var $closestDivToTarget = $target.closest("div");
    if ($target.closest(".ui-panel").length == 0) {
      var $openPanel = $(".ui-panel-open");
      if ($openPanel.length && !$closestDivToTarget.hasClass("ui-header")) {
        $openPanel.panel("close");
      }
    }
  });
  App.initialize();
});
