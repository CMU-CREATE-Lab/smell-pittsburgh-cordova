
var isDeviceReady = false;

 var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener("deviceready", this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        console.log("Received Device Ready Event");
		isDeviceReady = true;
		document.addEventListener("resume", onResume, false);
		document.addEventListener("pause", onPause, false);
		showSpinner();
		requestLocation();
		
		function onResume() {
			showSpinner();
			requestLocation();
		}
		
		function onPause() {
			hideSpinner();
			if (isDeniedAccuracy) {
				isRequestingLocation = false;
			}
			$('#submitReport').attr('disabled', 'true');
		}
    }
};

app.initialize();
 
 
 