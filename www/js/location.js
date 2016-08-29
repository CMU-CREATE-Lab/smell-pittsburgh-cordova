

var Location = {
	
	hasLocation: true,
	isRequestingLocation: false,
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