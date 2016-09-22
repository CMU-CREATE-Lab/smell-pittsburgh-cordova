var Location = {

  hasLocation: false,
  isRequestingLocation: false,
  coords: {},


  requestLocationPermission: function() {
    console.log("requestLocationPermission");
    // TODO browser request location
  },


  // request the users location
  requestLocation: function(afterSuccess) {
    console.log("requestLocation");

    // TODO browser location services
    Location.coords = {
    latitude: 0.0,
    longitude: 0.0
    };
    Location.hasLocation = true;
    Location.stopRequestLocation();

    afterSuccess(Location.coords.latitude,Location.coords.longitude);
  },


  // stop requesting the users location
  stopRequestLocation: function() {
    console.log("stopRequestLocation");
    this.isRequestingLocation = false;
    hideSpinner();
  }

}
