
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
		navigator.splashscreen.hide();
		deviceready = true;
		initializeFCM();
		requestLocation();
		var count = 0;
		document.addEventListener('online', function() {
			// why is this event firing twice?
			console.log("in here");
			requestLocation();
		}, false);
    }
};

app.initialize();
