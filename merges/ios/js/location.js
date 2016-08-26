

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
	    	Location.requestLocation();
	    }

        cordova.plugins.diagnostic.isLocationEnabled(function (enabled) {
            if(enabled){
                cordova.plugins.diagnostic.isLocationAuthorized(function (authorized) {
                    if(!authorized){
                        cordova.plugins.diagnostic.requestLocationAuthorization(function (status) {
                            handleSuccess("Requested location authorization: authorization was " + status);
                            checkState();
                        }, onError, cordova.plugins.diagnostic.locationAuthorizationMode.ALWAYS);
                    }else{
                        //onError("App is already authorized to use location");
                        Location.requestLocation();
                    }
                }, onError);
            }else{
                onError("Cannot request location authorization while Location Services is OFF");
            }
        }, onError);
    },
    
    // request the users location
    requestLocation: function() {
        console.log("requestLocation");

        if (isConnected()) {
            if (!this.isRequestingLocation) {
                console.log("in requestLocation");
                this.isRequestingLocation = true;
                showSpinner();
                
                var onSuccess = function(position) {
                    Location.coords = position.coords;
                    Location.hasLocation = true;
                    console.log("got coords: " + Location.coords.latitude + ", " + Location.coords.longitude);
                    Location.stopRequestLocation();
                    HomePage.checkSubmitStatus();
                };
                var onError = function (error) {
                    console.log("error code: " + error.code);
                    console.log("error message: " + error.message);
                    Location.stopRequestLocation();
                    navigator.notification.confirm(
                        "Would you like to retry?",
                        onConfirm,
                        "Failure Requesting Location",
                        ["Retry", "Cancel"]
                    );
                    function onConfirm(index) {
                        if (index == 1) {
                            Location.requestLocation();
                        }
                    }
                };
                
                console.log("Platform: " + platform);
                // change settings if we need to
                this.isAccuracyPrompt = true;
                App.accuracyStatus = Constants.AccuracyEnum.DISABLED;
                showSpinner();
                Location.isRequestingLocation = true;
                navigator.geolocation.getCurrentPosition( onSuccess, onError, { maximumAge: 3000, timeout: 60000, enableHighAccuracy: true } );
            }
        } else {
            navigator.notification.alert(
                "Connect to the internet then click 'Retry' in order to request location.",
                alertDismissed,
                "No Internet Connection",
                "Retry"
            );
            function alertDismissed() {
                Location.requestLocation();
            }
        }
    },
    
    // stop requesting the users location
    stopRequestLocation: function() {
        console.log("stopRequestLocation");
    }
    
}
