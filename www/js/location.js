

var Location = {
	
	isAccuracyPrompt: false,
	isRequestingLocation: false,
	watchIds: [],
	coords: {},

	requestLocationPermission: function() {
	    // Android>=6.0
	    cordova.plugins.diagnostic.getLocationAuthorizationStatus(function(status){
	        switch(status){
	            case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
	                console.log("Permission not requested");
	                cordova.plugins.diagnostic.requestLocationAuthorization(function(status) {
	                    switch(status) {
	                        case cordova.plugins.diagnostic.permissionStatus.GRANTED:
	                            console.log("Permission granted");
	                            App.authorizationStatus = Constants.AuthorizationEnum.GRANTED;
	                            break;
	                        case cordova.plugins.diagnostic.permissionStatus.DENIED:
	                            console.log("Permission denied");
	                            App.authorizationStatus = Constants.AuthorizationEnum.DENIED;
	                            break;
	                    }
	                },
					function() {
					    console.log("error in requesting location authorization");
					});
	                break;
	            case cordova.plugins.diagnostic.permissionStatus.GRANTED:
	                console.log("Permission granted");
	                App.authorizationStatus = Constants.AuthorizationEnum.GRANTED;
	                Location.requestLocation();
	                break;
	            case cordova.plugins.diagnostic.permissionStatus.DENIED:
	                console.log("Permission denied");
	                cordova.plugins.diagnostic.requestLocationAuthorization(function(status) {
	                    switch(status) {
	                        case cordova.plugins.diagnostic.permissionStatus.GRANTED:
	                            console.log("Permission granted");
	                            App.authorizationStatus = Constants.AuthorizationEnum.GRANTED;
	                            break;
	                        case cordova.plugins.diagnostic.permissionStatus.DENIED:
	                            console.log("Permission denied");
	                            App.authorizationStatus = Constants.AuthorizationEnum.DENIED;
	                            break;
	                    }
	                },
					function() {
					    console.log("error in requesting location authorization");
					});
	                break;
	        }
	    }, function(error){
	        console.error(error);
	    });
	},
	
	// request the users location
	requestLocation: function() {
		console.log("requestLocation");
		console.log("isRequestingLocation: " + this.isRequestingLocation);
		if (isConnected()) {
			if (!this.isRequestingLocation) {
				console.log("in requestLocation");
				this.isRequestingLocation = true;
				document.getElementById("button_submit_report").disabled = true;
				showSpinner();
				
				var onSuccess = function(position) {
					Location.coords = position.coords;
					console.log("got coords: " + Location.coords.latitude + ", " + Location.coords.longitude);
					document.getElementById("button_submit_report").disabled = false;
					Location.stopRequestLocation();
					Location.isAccuracyPrompt = false;
				};
				var onError = function (error) {
					console.log("error code: " + error.code);
					console.log("error message: " + error.message);
					Location.stopRequestLocation();
					Location.isAccuracyPrompt = false;
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
				
				var platform = device.platform;
				if (platform === "Android") {
					console.log("Platform: " + platform);
					// change settings if we need to
					this.isAccuracyPrompt = true;
					cordova.plugins.locationAccuracy.request(function(success) {
						App.accuracyStatus = Constants.AccuracyEnum.ENABLED;
						showSpinner();
						Location.isRequestingLocation = true;
						Location.watchIds.push(navigator.geolocation.watchPosition(onSuccess, onError, { maximumAge: 3000, timeout: 60000, enableHighAccuracy: true }));
					}, function(error) {
						console.log("error code: " + error.code + "\nerror message: " + error.message);
						App.accuracyStatus = Constants.AccuracyEnum.DISABLED;
						navigator.notification.confirm(
							"The app may not function as expected without the appropiate location settings enabled.",
							function() {
								showSpinner();
								Location.isRequestingLocation = true;
								Location.watchIds.push(navigator.geolocation.watchPosition(onSuccess, onError, { maximumAge: 3000, timeout: 60000, enableHighAccuracy: true }));
							},
							"Failure Changing Location Settings",
							["Ok"]
						);
					}, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
				} else {
					console.log("Platform: " + platform);
					// change settings if we need to
					this.isAccuracyPrompt = true;
					cordova.plugins.locationAccuracy.request(function(success) {
						App.accuracyStatus = Constants.AccuracyEnum.ENABLED;
						showSpinner();
						Location.isRequestingLocation = true;
						Location.watchIds.push(navigator.geolocation.watchPosition(onSuccess, onError, { maximumAge: 3000, timeout: 60000, enableHighAccuracy: true }));
					}, function(error) {
						console.log("error code: " + error.code + "\nerror message: " + error.message);
						App.accuracyStatus = Constants.AccuracyEnum.DISABLED;
						navigator.notification.confirm(
							"The app may not function as expected without the appropiate location settings enabled.",
							function() {
								showSpinner();
								Location.isRequestingLocation = true;
								Location.watchIds.push(navigator.geolocation.watchPosition(onSuccess, onError, { maximumAge: 3000, timeout: 60000, enableHighAccuracy: true }));
							},
							"Failure Changing Location Settings",
							["Ok"]
						);
					});
				}
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
		this.isRequestingLocation = false;
		hideSpinner();
		var l = this.watchIds.length;
		for (var i = l-1; i >= 0; i--) {
			navigator.geolocation.clearWatch(this.watchIds[i]);
			this.watchIds.pop();
		}
		
	}
	
	
}