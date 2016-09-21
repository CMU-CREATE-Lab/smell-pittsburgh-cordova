var Location = {

  hasLocation: true,
  isRequestingLocation: false,
  coords: {},


  requestLocationPermission: function() {
    console.log("requestLocationPermission");
  },


  // request the users location
  requestLocation: function(afterSuccess) {
    console.log("requestLocation");
    var latitude = 0;
    var longitude = 0;
    afterSuccess(latitude,longitude);
  },


  // stop requesting the users location
  stopRequestLocation: function() {
    console.log("stopRequestLocation");
  }

}
