

var Location = {
	
	hasLocation: false,
	isRequestingLocation: false,
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
		Location.hasLocation = true;
		Location.stopRequestLocation();
		//document.getElementById("button_submit_report").disabled = false;
		HomePage.checkSubmitStatus();
	},
	
	// stop requesting the users location
	stopRequestLocation: function() {
		console.log("stopRequestLocation");
		this.isRequestingLocation = false;
		hideSpinner();
	}
	
	
}