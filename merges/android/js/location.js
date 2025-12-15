var Location = {

  hasLocation: false,
  isRequestingLocation: false,
  coords: {},
  afterSuccessCallbackQueue: [],
  afterFailureCallbackQueue: [],


  // Request location permission
  requestLocationPermission: function() {
    console.log("requestLocationPermission");

    function onError (error){
      console.error("The following error occurred when requesting location authorization: " + error);
    }

    if (App.isFinalPermissionPopupActive) return;

    cordova.plugins.diagnostic.getLocationAuthorizationStatus(function(status){
      // HACK...
      // The backstory to DENIED_ALWAYS vs NOT_REQUESTED on Android is an "interesting" one and the diagnostic plugin claims to handle
      // this, but that does not seem to be the case. So we must use various flags to know when DENIED_ALWAYS was actually selected.
      // https://github.com/dpa99c/cordova-diagnostic-plugin/issues/52#issuecomment-209273236
      if (status == cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED && App.didFirstTimeLocationCheck) {
        status = cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS;
      }
      App.didFirstTimeLocationCheck = true;

      console.log("Current location auth status: " + status);
      // Check the Location permission status
      switch(status){
        case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
          console.log("Location permission not requested");
          App.authorizationStatus = Constants.AuthorizationEnum.NOT_REQUESTED;
          cordova.plugins.diagnostic.requestLocationAuthorization(Location.requestLocationPermission, onError);
          break;
        case cordova.plugins.diagnostic.permissionStatus.DENIED:
          console.log("Location permission denied");
          App.authorizationStatus = Constants.AuthorizationEnum.DENIED;
          cordova.plugins.diagnostic.requestLocationAuthorization(Location.requestLocationPermission, onError);
          break;
        case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
          console.log("Location permission denied always");
          App.authorizationStatus = Constants.AuthorizationEnum.DENIED_ALWAYS;
          App.isFinalPermissionPopupActive = true;
          navigator.notification.confirm("Would you like to go to the system settings to manually allow location permissions for this app?", onConfirm, "Location permission is required", ["Yes", "No"]);
          function onConfirm(index) {
            if (index === 1) {
              navigator.notification.alert(
                "After you enable Location permissions, relaunch the app.",
                cordova.plugins.diagnostic.switchToSettings,
                ""
              );
            }
            Location.stopRequestLocation();
            App.isFinalPermissionPopupActive = false;
          }
          break;
        case cordova.plugins.diagnostic.permissionStatus.GRANTED:
          console.log("Location permission granted");
          App.authorizationStatus = Constants.AuthorizationEnum.GRANTED;
          break;
        case cordova.plugins.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE:
          console.log("Location permission granted when in use");
          App.authorizationStatus = Constants.AuthorizationEnum.GRANTED_WHEN_IN_USE;
          break;
      }
    }, onError);
  },


  handleOnSuccessCallbacks: function(position) {
    for (var i = 0; i < Location.afterSuccessCallbackQueue.length; i++) {
      if (typeof(Location.afterSuccessCallbackQueue[i]) === "function") {
        Location.afterSuccessCallbackQueue[i](position);
      }
    }
    Location.afterSuccessCallbackQueue = [];
    Location.afterFailureCallbackQueue = [];
    Location.hasLocation = true;
    Location.stopRequestLocation();
  },


  handleOnFailureCallbacks: function(position) {
    for (var i = 0; i < Location.afterFailureCallbackQueue.length; i++) {
      if (typeof(Location.afterFailureCallbackQueue[i]) === "function") {
        Location.afterFailureCallbackQueue[i](position);
      }
    }
    Location.afterFailureCallbackQueue = [];
    Location.stopRequestLocation();
  },


  // Request the user's location
  requestLocation: function(afterSuccess, afterFailure) {
    console.log("requestLocation");
    if (isConnected()) {
      var onSuccess = function(position) {
        Location.coords = position.coords;
        console.log("requestLocation got coords: " + Location.coords.latitude + ", " + Location.coords.longitude);
        var latitude = (Location.coords != null) ? Location.coords.latitude : 0;
        var longitude = (Location.coords != null) ? Location.coords.longitude : 0;
        afterSuccess(latitude,longitude);
      };
      Location.afterSuccessCallbackQueue.push(onSuccess);

      var onError = function (error) {
        console.log("requestLocation error code: " + error.code);
        console.log("requestLocation error message: " + error.message);
        afterFailure(error);
      };
      Location.afterFailureCallbackQueue.push(onError);

      var getLocation = function() {
        console.log('requestLocation getLocation');
        if (!HomePage.submittingReport) {
          showSpinner("Requesting Location\nPlease Wait...");
        }
        navigator.geolocation.getCurrentPosition( Location.handleOnSuccessCallbacks, Location.handleOnFailureCallbacks, { maximumAge: 3000, timeout: 60000, enableHighAccuracy: true } );
      }

      // Request change settings if we need to
      if (!Location.isRequestingLocation) {
        Location.isRequestingLocation = true;
        cordova.plugins.locationAccuracy.request(
          function(success) {
            App.accuracyStatus = Constants.AccuracyEnum.ENABLED;
            console.log("requestLocation accuracy success");
            if (App.authorizationStatus == Constants.AuthorizationEnum.DENIED_ALWAYS) {
              Location.requestLocationPermission();
            } else {
              getLocation();
            }
          }, function(error) {
            console.log("error code: " + error.code + "\nerror message: " + error.message);
            if (error.message == "A request is already in progress") return;
            App.accuracyStatus = Constants.AccuracyEnum.DISABLED;
            navigator.notification.confirm("The app may not function as expected without the appropriate location settings enabled.", getLocation, "Failure Changing Location Settings", ["Ok"]);
          }, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
      } else {
        console.log('Already requesting location. Added callback to queue.');
      }
    } else {
      navigator.notification.confirm("Enable wifi or data then click 'Retry' in order to request location.", alertDismissed, "No Internet Connection", ["Retry"]);
      function alertDismissed() {
        Location.requestLocation(afterSuccess);
      }
    }
  },


  // Stop requesting the user's location
  stopRequestLocation: function() {
    console.log("stopRequestLocation");
    Location.isRequestingLocation = false;
    if (!HomePage.submittingReport) {
      hideSpinner();
    }
  }

}
