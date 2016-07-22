
var isDeviceReady = false;

 var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    onDeviceReady: function() {
        console.log('Received Device Ready Event');
		isDeviceReady = true;
		document.addEventListener("resume", onResume, false);
		document.addEventListener("pause", onPause, false);
		initializeFCM();
		requestLocation();
		
		function onResume() {
			if (isSmellReportPage) {
				requestLocation();
			}
		}
		
		function onPause() {
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
