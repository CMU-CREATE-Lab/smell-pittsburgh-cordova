var LocationSelectPage = {


  initialize: function () {
    console.log("LocationSelectPage.initialize");

    // create map
    LocationSelectPage.initMap();
  },


  onDeviceReady: function() {
    console.log("LocationSelectPage.onDeviceReady");
  },


  initMap: function() {
    var uluru = {"lat": 40.45, "lng": -79.93};
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

    map = new google.maps.Map(document.getElementById("map_locationselect"), {
      center: uluru,
      styles: styleArray,
      zoom: 11,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
  },

}
