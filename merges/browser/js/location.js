

var Location = {
	
	isAccuracyPrompt: false,
	isRequestingLocation: false,
	watchIds: [],
	coords: {},

	requestLocationPermission: function() {
		console.log("requestLocationPermission");
		// TODO browser request location
	},
	
	// request the users location
	requestLocation: function() {
		console.log("requestLocation");

		// TODO browser location services
		Location.coords = {
			latitude: 0.0,
			longitude: 0.0
		};
		Location.stopRequestLocation();
		Location.isAccuracyPrompt = false;
		document.getElementById("button_submit_report").disabled = false;
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