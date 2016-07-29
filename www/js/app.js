

var App = {
	
	isDeviceReady: false,
	authorizationStatus: Constants.AuthorizationEnum.NOT_REQUESTED,
	accuracyStatus: Constants.AccuracyEnum.DISABLED,
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    bindEvents: function() {
        document.addEventListener("deviceready", this.onDeviceReady, false);
    },
	// onResume
	onResume: function() {
		console.log('onResume');
		console.log(Location.isAccuracyPrompt);
		if (Location.isAccuracyPrompt && App.accuracyStatus === Constants.AccuracyEnum.ENABLED) {
			Location.requestLocation();
		} else if (App.isDeviceReady && App.authorizationStatus === Constants.AuthorizationEnum.GRANTED && !Location.isAccuracyPrompt) {
			Location.requestLocation();
		}
	},
	// onPause
	onPause: function() {
		console.log("onPause");
		if (App.isDeviceReady && App.authorizationStatus === Constants.AuthorizationEnum.GRANTED) {
			Location.stopRequestLocation();
		} else if (App.isDeviceReady) {
			hideSpinner();
		}
	},
    // deviceready Event Handler
    onDeviceReady: function() {
        console.log('Received Device Ready Event');
		document.addEventListener('resume', App.onResume, false);
		document.addEventListener('pause', App.onPause, false);
		
		App.isDeviceReady = true;
		App.isConnected = isConnected();
		App.requestLocationPermission();
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
	}
};

App.initialize();