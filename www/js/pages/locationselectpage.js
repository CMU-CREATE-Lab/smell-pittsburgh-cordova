var LocationSelectPage = {

  map: null,


  initialize: function () {
    console.log("LocationSelectPage.initialize");

    // request location before initializing the map
    Location.requestLocation(function(lat,long) {
      // create map
      LocationSelectPage.initMap(lat,long);
    });
  },


  onDeviceReady: function() {
    console.log("LocationSelectPage.onDeviceReady");

    // click listener
    $("#middle-circle").click(LocationSelectPage.onClickMiddleCircle);
    $("#locationselect-button-gps").click(LocationSelectPage.onClickGps);
    $("#locationselect-button-done").click(LocationSelectPage.onClickDone);
  },


  initMap: function(lat,long) {
    //var uluru = {"lat": 40.45, "lng": -79.93};
    var uluru = {"lat": lat, "lng": long};
    var styleArray = [
      {
        featureType: "all",
        stylers: [
          {saturation: -80}
        ]
      }, {
        featureType: "road.arterial",
        elementType: "geometry",
        stylers: [
          {hue: "#00ffee"},
          {saturation: 50}
        ]
      }, {
        featureType: "poi.business",
        elementType: "labels",
        stylers: [
          {visibility: "off"}
        ]
      }
    ];

    LocationSelectPage.map = new google.maps.Map(document.getElementById("map_locationselect"), {
      center: uluru,
      styles: styleArray,
      // zoom: 11,
      zoom: 15,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
  },


  onClickMiddleCircle: function() {
    console.log("onClickMiddleCircle");
    // TODO confirm selected location?
  },


  onClickGps: function() {
    console.log("onClickGps");

    Location.requestLocation(function(lat,long) {
      LocationSelectPage.map.setCenter({"lat": lat, "lng": long});
      LocationSelectPage.map.setZoom(15);
    });
  },


  onClickDone: function() {
    console.log("onClickDone");

    // return to smell report, updating with new lat/long
    var center = LocationSelectPage.map.getCenter();
    var result = {"lat": center.lat(), "lng": center.lng()};
    console.log("onClickDone: found center " + JSON.stringify(result));

    HomePage.useLocation(result);
    $.mobile.pageContainer.pagecontainer("change", "#home", { changeHash: false, transition: "none" });
  },

}
