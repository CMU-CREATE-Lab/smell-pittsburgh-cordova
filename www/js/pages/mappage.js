var MapPage = {

  centerLocation: [],
  openedPredictionNotification: false,


  initialize: function () {
    console.log("MapPage.initialize");

    // refresh iframe
    $('#iframe-map').attr('src', Constants.URL_SMELLPGH+"/visualization?user_hash="+LocalStorage.get("user_hash") );

    // first-time prediction modal
    if (MapPage.openedPredictionNotification) {
      if (LocalStorage.get("firsttime_prediction")) {
        MapPage.showModal("modal-predict-firsttime");
        LocalStorage.set("firsttime_prediction",false);
      }
      MapPage.openedPredictionNotification = false;
    }
    // first-time map modals
    if (LocalStorage.get("firsttime_map")) {
      MapPage.showModal("modal-map-firsttime");
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
    $("#modal-map-firsttime").popup();
    // delays opening to avoid issues with iOS < 9.3
    setTimeout(function() {
      $("#modal-map-firsttime").popup("open");
    }, 250);
  },


  showModal: function(modalId) {
    var modal = "#"+modalId
    $(modal).popup();
    // delays opening to avoid issues with iOS < 9.3
    setTimeout(function() {
      $(modal).popup("open");
    }, 250);
  },

}
