var MapPage = {

  centerLocation: [],


  initialize: function () {
    console.log("MapPage.initialize");

    // refresh iframe
    $('#iframe-map').attr('src', Constants.URL_SMELLPGH+"/visualization?user_hash="+LocalStorage.get("user_hash") );

    // first-time map modals
    if (LocalStorage.get("firsttime_map")) {
      MapPage.showMapModal();
      LocalStorage.set("firsttime_map",false);
    }

    // don't perform this when you redirect from submitting a smell report
    if (MapPage.centerLocation.length != 2) {
      Location.requestLocation(function(latitude,longitude) {
        // TODO actions on success
        console.log("got latlong: "+latitude+","+longitude);
        $('#iframe-map').attr('src', Constants.URL_SMELLPGH+"/visualization?user_hash="+LocalStorage.get("user_hash")+"#latLng="+latitude+","+longitude);
      });
    } else {
      var latitude = MapPage.centerLocation[0], longitude = MapPage.centerLocation[1];
      console.log("got latlong (without requesting a second time): "+latitude+","+longitude);
      $('#iframe-map').attr('src', Constants.URL_SMELLPGH+"/visualization?user_hash="+LocalStorage.get("user_hash")+"#latLng="+latitude+","+longitude);
    }

    // browser compatibility issues (Yay?)
    $("#map-panel").find(".ui-btn-active").removeClass("ui-btn-active");
  },


  onDeviceReady: function() {
    console.log("Mappage.onDeviceReady");
  },


  // helper functions


  showMapModal: function() {
    showModal("modal-map-firsttime");
  },

}
