var MapPage = {

  text: null, //the text for the page's template
  centerLocation: [],
  didInitialLoad: false,

  initialIFrameLoaded: false,
  timer: null,

  mapCheck: function() {
      console.log("Checking if map loaded");
      initialIFrameLoaded = true;
      var $iframe = $($("#iframe-map")[0].contentWindow.document.body.innerHTML);
      if($iframe){
        if($iframe.find("#map-container").length == 0){
          console.log("Map Error")
          App.navigateToPage(Constants.MAP_ERROR_PAGE);
        }else{
          console.log("Map Loaded")
        }
      }
      console.log("IFrame not found")

  },

  loadTemplate: function() {
    this.text = App.text.map;
    var mapTpl = Handlebars.compile($("#map-tpl").html());
    $('#map').html(mapTpl(this.text));
    $('#map').trigger('create');
  },


  setListeners: function() {
    // (future listeners will go here)

    //If IFrame has loaded
    $('#iframe-map').load(function (e) {
      console.log("IFrame has loaded");
      clearTimeout(timer);
      //Check if map page is not 404
      if(!initialIFrameLoaded){
        MapPage.mapCheck();
      }

    });
  },


  onCreate: function() {

    //IFrame Loading Check
    initialIFrameLoaded = false;
    timer = setTimeout(MapPage.mapCheck,10000);

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
    
    // browser compatibility issues (Yay?)
    $("#map .ui-panel-inner").find(".ui-btn-active").removeClass("ui-btn-active");

    if (MapPage.centerLocation.length != 2) {
      Location.requestLocation(function(latitude,longitude) {
        console.log("got latlong: "+latitude+","+longitude);
        $('#iframe-map').attr('src', Constants.URL_MAP+"?user_hash="+LocalStorage.get("user_hash")+"&latLng="+latitude+","+longitude);
      },function (error){
        console.log(error);
        //if unable to get location use this src to at display something
         $('#iframe-map').attr('src', Constants.URL_MAP+"?user_hash="+LocalStorage.get("user_hash") );
      });
    } else {
      var latitude = MapPage.centerLocation[0], longitude = MapPage.centerLocation[1];
      console.log("got latlong (without requesting a second time): "+latitude+","+longitude);
      $('#iframe-map').attr('src', Constants.URL_MAP+"?user_hash="+LocalStorage.get("user_hash")+"&latLng="+latitude+","+longitude);
      MapPage.centerLocation = [];
    }
    $("#map-panel").find(".ui-btn-active").removeClass("ui-btn-active");
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
