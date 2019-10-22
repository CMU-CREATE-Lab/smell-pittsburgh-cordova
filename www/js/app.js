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
      // case Constants.OVERVIEW_PAGE:
      //   OverviewPage.initialize();
      //   break;
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


  // reverseGeocode: function(lat, lng, callback) {
  //   console.log("reverse geocode");
  //   nativegeocoder.reverseGeocode(success, failure, lat, lng, { useLocale: true, maxResults: 1 });

  //   function success(result) {
  //     console.log("SUCCESS REVERSE");
  //     callback(result[0]);
  //   }

  //   function failure(err) {
  //     console.log("REVERSE_GEOCODE_FAILED");
  //   }
  // },


  // /**
  //   * gets the city the user is in
  //   * city will be auto loaded into the template text
  //  */
  // refreshCity: function(forceRefresh, refreshCityCallback) {
  //   console.log("requestLocation refreshCity");
  //   var currentCity = LocalStorage.get("current_city");
  //   // Cache for 10 minutes
  //   // TODO: Would be nice to actually determine that the device moved some distance
  //   // before attempting to request location again. Instead we set an arbitrary cache time.
  //   if (forceRefresh || (!currentCity || !currentCity.name || new Date().getTime() > currentCity.lastUpdate + App.cityNameCacheBustTime)) {
  //     Location.requestLocation(function(latitude, longitude) {
  //       App.getCityFromLocation(latitude, longitude, function(currentCity) {
  //         // Set current city to latest pull
  //         if (currentCity) {
  //           LocalStorage.set("current_city", currentCity);
  //         }
  //         App.getCityTemplateData(currentCity, function(status) {
  //           if (status == "success") {
  //             App.setCityTemplateBasedOnCurrentCity();
  //           } else {
  //             App.setGenericCityTemplate();
  //           }
  //           if (typeof(refreshCityCallback) === "function") {
  //             refreshCityCallback({status: "success"});
  //           }
  //         });
  //       });
  //     }, function(error) {
  //       console.log(error);
  //       Location.stopRequestLocation();
  //       App.resetCityTemplate();
  //       if (typeof(refreshCityCallback) === "function") {
  //         refreshCityCallback({status: "failure"});
  //       }
  //     });
  //   } else {
  //     console.log("Location was pulled less than 10 minutes ago; used cached version.");
  //     App.setCityTemplateBasedOnCurrentCity(currentCity);
  //     if (typeof(refreshCityCallback) === "function") {
  //       refreshCityCallback({status: "success"});
  //     }
  //   }
  // },


  // getCityTemplateData: function(city, callback) {
  //   App.request = $.ajax({
  //     type: "GET",
  //     dataType: "json",
  //     url: Constants.URL_API + "/api/v2/get_location_info_by_zip" + "?zipCode=" + city.zip,
  //     timeout: App.ajaxTimeout,

  //     success: function(data) {
  //       city.metaData = data['city']['app_metadata'];
  //       LocalStorage.set("current_city", city);
  //       LocalStorage.set("current_region", data['region']);
  //       LocalStorage.set("participating_agency", data['agency']);
  //       callback("success");
  //     },

  //     // Called if sever error or if no participating city was found
  //     error: function(msg) {
  //       city.metaData = null;
  //       LocalStorage.set("current_city", city);
  //       LocalStorage.set("current_region", null);
  //       LocalStorage.set("participating_agency", null);
  //       callback("failure");
  //     },
  //   });

  // },


  // setCityName: function(cityName) {
  //   $(".your-city").text(cityName);
  // },


  // setGenericCityTemplate: function() {
  //   $('div[data-role="panel"]').css({
  //     "background-image": "",
  //     "background-color": ""
  //   });
  //   $("#button_submit_report").css("background-color", "");
  //   $("#textfield_smell_description").attr("placeholder", "e.g. " + App.text.home.describe.placeholder);
  //   $("#textfield_additional_comments").parent().hide();
  //   $(".regulatory-agency-note").hide();
  // },


  // resetCityTemplate: function() {
  //   App.setCityName(App.text.defaultCityName);
  //   App.setGenericCityTemplate();
  // },


  // setCityTemplateBasedOnCurrentCity: function(city) {
  //   city = city ? city : LocalStorage.get("current_city");
  //   region = LocalStorage.get("current_region");
  //   agency = LocalStorage.get("participating_agency");
  //   if (city.name) {
  //     App.setCityName(city.name);
  //   }
  //   if (city.metaData) {
  //     $('div[data-role="panel"]').css({
  //       "background-image": "url('" + Constants.URL_API + city.metaData["side_menu_background_url"] + "')",
  //       "background-color": city.metaData["side_menu_background_color"]
  //     });
  //     $("#button_submit_report").css("background-color", city.metaData["side_menu_background_color"]);
  //     $("#textfield_smell_description").attr("placeholder", "e.g. " + city.metaData["smell_description_placeholder_text"]);
  //     if (city.metaData["additional_notes_placeholder_text"]) {
  //       $("#textfield_additional_comments").attr("placeholder", "e.g. " + city.metaData["additional_notes_placeholder_text"]);
  //     }
  //     $("#textfield_additional_comments").parent().show();
  //   }
  //   if (agency && region) {
  //     $(".regulatory-agency-note").show();
  //     $(".regulatory-region-name").text(region.name);
  //     $(".regulatory-agency-website").text(agency.full_name).prop("href", agency.website);
  //     $(".regulatory-agency-name").text(agency.full_name);
  //   }
  // },


  // /**
  //  * gets city based on user location
  //  * @param {float} lat - latitude as float
  //  * @param {float} lng - longitude as float
  //  * @param {function} callback - city object
  // */
  // getCityFromLocation: function(lat, lng, callback) {
  //   App.reverseGeocode(lat, lng, function(geocode) {
  //     var streetName = geocode.thoroughfare ? geocode.thoroughfare : "";
  //     var cityObj = {
  //       name: geocode.locality,
  //       zip: geocode.postalCode,
  //       state: geocode.administrativeArea,
  //       streetName: streetName,
  //       lat: lat,
  //       lng: lng,
  //       lastUpdate: (new Date()).getTime()
  //     };
  //     callback(cityObj);
  //   }, function(error) {
  //     callback(null);
  //   });

   /*var geocoder = new google.maps.Geocoder;
   var latlng = {lat:lat, lng:lng};//reformat params into google style LatLng object
   var city2;// the 2 at the end of the variable name, dont worry about it

   // TODO We need to have a fall back if this does not return properly (without a callback the home page never loads)
   // city2 = "pittsburgh";
   // callback(city2)

   geocoder.geocode({'location': latlng}, function(results, status) {
     console.log("geocoder.geocode response");
     //find city name
     for (var i=0; i<results.length; i++) {
       //google geocoding returns a object where cities are objets with type locality
       if (results[i].types[0] === "locality") {
         city2 = results[i].address_components[0].long_name;
       }
     }
     //find zipcode
     //zip code only exists inside lower levels of the return object unlike city
     //want to use address_components of first part of the object so it must exist
     if (results.length>0) {
       //results[0] usually has the fullest address of a place and therefore has the zip code
       for (var j=0; j<results[0].address_components.length; j++) {
         //in the returned object zipc codes are objects with type of postal_code
         if (results[0].address_components[j].types[0] === "postal_code") {
           //stored in MapPage as it is only use there. Used to get aqi
            MapPage.zipcode = results[0].address_components[j].long_name;
         }
       }
     }
     callback(city2)
   });*/
  // },

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
