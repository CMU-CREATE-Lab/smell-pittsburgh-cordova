/**
 * Handles requests for current location and permissions. Each platform should create its own file in the merges directory.
 * @namespace Location
 */
var Location = {

  hasLocation: false,
  isRequestingLocation: false,
  coords: {},


  /**
   * Request permissions from the platform for accessing Location services.
   */
  requestLocationPermission: function() {
    console.log("requestLocationPermission");
  },


  /**
   * @callback requestLocationCallback
   * @param {number} latitude
   * @param {number} longitude
   */
  /**
   * Request the most recent device location.
   * @param {requestLocationCallback} afterSuccess - Callback when a location is received.
   * @param {requestLocationCallback} afterFailure - Callback when a location request fails (note: never happens in here, just documenting it).
   */
  requestLocation: function(afterSuccess, afterFailure) {
    console.log("requestLocation");
    var latitude = 0;
    var longitude = 0;
    afterSuccess(latitude,longitude);
  },


  /**
   * Stop requesting device locations.
   */
  stopRequestLocation: function() {
    console.log("stopRequestLocation");
  },

}
