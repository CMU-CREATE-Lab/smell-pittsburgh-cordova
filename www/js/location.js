

var Location = {
	
	isAccuracyPrompt: false,
	isRequestingLocation: false,
	watchIds: [],
	coords: {},

	requestLocationPermission: function() {
		console.log("requestLocationPermission");
	},
	
	// request the users location
	requestLocation: function() {
		console.log("requestLocation");
	},
	
	// stop requesting the users location
	stopRequestLocation: function() {
		console.log("stopRequestLocation");
	}
	
	
}