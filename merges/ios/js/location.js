var Location = {

  hasLocation: false,
  isRequestingLocation: false,
  coords: {},


  requestLocationPermission: function() {
    console.log("requestLocationPermission");
    var onError = function(error) {
      var msg = "An error occurred: " + error;
      console.error(msg);
      alert(msg);
      checkState();
    }
    var handleSuccess = function(str) {
      console.log(str);
    }
    var statusAuthorized = function(status) {
      handleSuccess("Requested location authorization: authorization was " + status);
      checkState();
    }
    var checkAuthorized = function(authorized) {
      if (!authorized) {
        cordova.plugins.diagnostic.requestLocationAuthorization(statusAuthorized, onError, cordova.plugins.diagnostic.locationAuthorizationMode.WHEN_IN_USE);
      }
    }

    cordova.plugins.diagnostic.isLocationEnabled(
      function (enabled) {
        if (enabled) {
          cordova.plugins.diagnostic.isLocationAuthorized(checkAuthorized, onError);
        } else {
          onError("Cannot request location authorization while Location Services is OFF");
        }
      }, onError
    );
  },


  // request the users location
  requestLocation: function(afterSuccess) {
    console.log("requestLocation");
    if (isConnected()) {
      if (!Location.isRequestingLocation) {
        Location.isRequestingLocation = true;
        var onSuccess = function(position) {
          Location.coords = position.coords;
          Location.hasLocation = true;
          console.log("got coords: " + Location.coords.latitude + ", " + Location.coords.longitude);
          Location.stopRequestLocation();
          var latitude = (Location.coords != null) ? Location.coords.latitude : 0;
          var longitude = (Location.coords != null) ? Location.coords.longitude : 0;
          afterSuccess(latitude,longitude);
        };
        var onError = function (error) {
          console.log("error code: " + error.code);
          console.log("error message: " + error.message);
          Location.stopRequestLocation();
          navigator.notification.confirm("Would you like to retry?", onConfirm, "Failure Requesting Location", ["Retry", "Cancel"]);
          function onConfirm(index) {
            if (index == 1) {
              Location.requestLocation(afterSuccess);
            } else {
              // TODO @tasota callback
            }
          }
        };

        // change settings if we need to
        App.accuracyStatus = Constants.AccuracyEnum.DISABLED;
        showSpinner("Requesting Location\nPlease Wait...");
        Location.isRequestingLocation = true;
        navigator.geolocation.getCurrentPosition( onSuccess, onError, { maximumAge: 3000, timeout: 60000, enableHighAccuracy: true } );
      }
    } else {
      alert("Connect to the internet then click 'Retry' in order to request location.", alertDismissed, "No Internet Connection", "Retry");
      function alertDismissed() {
        //Location.requestLocation(afterSuccess);
      }
    }
  },


  // stop requesting the users location
  stopRequestLocation: function() {
    console.log("stopRequestLocation");
    Location.isRequestingLocation = false;
    hideSpinner();
  }

}
