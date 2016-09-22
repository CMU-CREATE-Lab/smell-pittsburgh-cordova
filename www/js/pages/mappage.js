var MapPage = {


  initialize: function () {
    console.log("MapPage.initialize");

    // refresh iframe
    $('#iframe-map').attr('src', Constants.URL_SMELLPGH+"/visualization?user_hash="+LocalStorage.get("user_hash") );

    // first-time modal
    if (LocalStorage.get("firsttime_map")) {
      MapPage.showMapModal();
      LocalStorage.set("firsttime_map",false);
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

}
