

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
		console.log("isDeviceReady: " + App.isDeviceReady);
		console.log("isAccuracyPrompt: " + Location.isAccuracyPrompt);
		console.log("accuracyStatus: " + App.accuracyStatus);
		
		if (App.isDeviceReady&& Location.isAccuracyPrompt && App.accuracyStatus === Constants.AccuracyEnum.ENABLED) {
			Location.requestLocation();
		} else if (App.isDeviceReady && App.authorizationStatus === Constants.AuthorizationEnum.GRANTED && !Location.isAccuracyPrompt) {
			Location.requestLocation();
		}
	},
	// onPause
	onPause: function() {
		console.log("onPause");
		console.log("isDeviceReady: " + App.isDeviceReady);
		console.log("authorizationStatus: " + App.authorizationStatus);
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
		App.initializeFCM();
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
	},
	// initialize firebase cloud messaging
	initializeFCM: function() {
		FCMPlugin.getToken(
			// success
			function(token) {
				//alert(token);
			},
			// error
			function(error) {
				console.log("error retrieving token: " + error);
			}
		);
		
		FCMPlugin.onNotification(
			// callback
			function(data) {
				if (data.wasTapped) {
					//Notification was received on device tray and tapped by the user. 
					alert(JSON.stringify(data));
				} else {
					//Notification was received in foreground. Maybe the user needs to be notified.
					alert(JSON.stringify(data));
				}
			},
			// success
			function(message) {
				console.log("callback successfully registers: " + message);
			},
			// error
			function(error) {
				console.log("error registering callback: " + error);
			}
		);
		
		FCMPlugin.subscribeToTopic('topicExample');
	}
};

App.initialize();






