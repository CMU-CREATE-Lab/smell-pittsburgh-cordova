
var isDeviceReady = false;
var isDeniedAuthorization = true;

var App = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    bindEvents: function() {
        document.addEventListener("deviceready", this.onDeviceReady, false);
    },
    // deviceready Event Handler
    onDeviceReady: function() {
		// TODO - We may take away all of the request for locations except onDeviceReady and onResume events
		// TODO - A refresh location button??
        console.log('Received Device Ready Event');
		isDeviceReady = true;
		document.addEventListener("resume", onResume, false);
		document.addEventListener("pause", onPause, false);
		
		App.requestLocationPermission();
		
		function onResume() {
			if (isDeniedAuthorization) app.requestLocationPermission();
			if (!isDeniedAccuracy && !isDeniedAuthorization) {
				console.log("onResume");
				showSpinner();
				requestLocation();
			}
		}
		
		function onPause() {
			hideSpinner();
			isRequestingLocation = false;
			if (!isDeniedAuthorization) {
				console.log("watchId: " + watchId);
				navigator.geolocation.clearWatch(watchId);
			}
			$('#submitReport').attr('disabled', 'true');
		}
    },
	// Requests permission from the user if they are using android 6.0 or above
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
								isDeniedAuthorization = false;
								break;
							case cordova.plugins.diagnostic.permissionStatus.DENIED:
								console.log("Permission denied");
								isDeniedAuthorization = true;
								break;
						}
					},
					function() {
						console.log("error in requesting location authorization");
					});
					break;
				case cordova.plugins.diagnostic.permissionStatus.GRANTED:
					console.log("Permission granted");
					isDeniedAuthorization = false;
					showSpinner();
					requestLocation();
					break;
				case cordova.plugins.diagnostic.permissionStatus.DENIED:
					console.log("Permission denied");
					cordova.plugins.diagnostic.requestLocationAuthorization(function(status) {
						switch(status) {
							case cordova.plugins.diagnostic.permissionStatus.GRANTED:
								console.log("Permission granted");
								isDeniedAuthorization = false;
								break;
							case cordova.plugins.diagnostic.permissionStatus.DENIED:
								console.log("Permission denied");
								isDeniedAuthorization = true;
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
	}
};

App.initialize();