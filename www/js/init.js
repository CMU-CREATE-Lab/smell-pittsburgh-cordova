
var isDeviceReady = false;

 var app = {
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
		initializeFCM();
		showSpinner();
		requestLocation();
		
		function onResume() {
			console.log(isDeniedAccuracy);
			if (!isDeniedAccuracy) {
				showSpinner();
				requestLocation();
			}
		}
		
		function onPause() {
			hideSpinner();
			isRequestingLocation = false;
			$('#submitReport').attr('disabled', 'true');
		}
    }
};
app.initialize();


 function initializeFCM() {
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
