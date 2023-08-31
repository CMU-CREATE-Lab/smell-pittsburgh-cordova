var MapPage = {

  text: null, //the text for the page's template
  centerLocation: [],
  didInitialLoad: false,
  initialIFrameLoaded: false,
  timer: null,
  iFrameTimeoutInMs: 10000,



  mapCheck: function() {
    console.log("Checking if map loaded");
    MapPage.initialIFrameLoaded = true;
    var $iframe = $($("#iframe-map")[0].contentWindow.document.body.innerHTML);
    if ($iframe) {
      if ($iframe.find("#map-container").length == 0) {
        console.log("Map Error");
        App.navigateToPage(Constants.MAP_ERROR_PAGE);
      } else {
        console.log("Map Loaded");
      }
    }
  },


  loadTemplate: function() {
    this.text = App.text.map;
    var mapTpl = Handlebars.compile($("#map-tpl").html());
    $('#map').html(mapTpl(this.text));
    $('#map').trigger('create');
  },


  setListeners: function() {
    // (future listeners will go here)

    // If IFrame has loaded
    $('#iframe-map').load(function(e) {
      console.log("IFrame has loaded");
      clearTimeout(MapPage.timer);
      // Check if map page is not 404
      if (!MapPage.initialIFrameLoaded) {
        MapPage.mapCheck();
      }
    });
  },


  onCreate: function() {
    // IFrame Loading Check
    MapPage.initialIFrameLoaded = false;
    MapPage.timer = setTimeout(MapPage.mapCheck, MapPage.iFrameTimeoutInMs);

    if (!MapPage.didInitialLoad) {
      MapPage.didInitialLoad = true;
      this.loadTemplate();
      this.setListeners();
    }

    // first-time map modals
    if (LocalStorage.get("firsttime_map")) {
      MapPage.showMapModal();
      LocalStorage.set("firsttime_map",false);
    }

    var mapUrl = Constants.URL_MAP + "?user_hash=" + LocalStorage.get("user_hash") + "&client_token=" + Constants.CLIENT_ID;

    // browser compatibility issues (Yay?)
    $("#map .ui-panel-inner").find(".ui-btn-active").removeClass("ui-btn-active");

    if (MapPage.centerLocation.length != 2) {
      Location.requestLocation(function(latitude,longitude) {
        console.log("got latlong: "+latitude+","+longitude);
        mapUrl += "&latLng=" + latitude + "," + longitude;
        $('#iframe-map').attr('src', mapUrl);
      },function (error){
        console.log(error);
        // if unable to get location use this src to at least display something
        $('#iframe-map').attr('src', mapUrl);
      });
    } else {
      var latitude = MapPage.centerLocation[0], longitude = MapPage.centerLocation[1];
      console.log("got latlong (without requesting a second time): "+latitude+","+longitude);
      mapUrl += "&latLng=" + latitude + "," + longitude;
      $('#iframe-map').attr('src', mapUrl);
      MapPage.centerLocation = [];
    }

    // browser compatibility issues (Yay?)
    $("#map").resize();
  },


  initialize: function () {
    console.log("MapPage.initialize (deprecated; start using onCreate instead)");
    this.onCreate();
  },


  // helper functions


  showMapModal: function() {
    showModal("modal-map-firsttime");
  },

}
