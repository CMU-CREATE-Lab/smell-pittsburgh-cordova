var MapPage = {

  centerLocation: [],
  maxTimeForPlaces:24*60*60,


  initialize: function () {
    var mapTpl=Handlebars.compile($("#map-tpl").html());
    $('#map').html(mapTpl(english.map));
    $('#map').trigger('create');
    console.log("MapPage.initialize");

    // first-time map modals
    if (LocalStorage.get("firsttime_map")) {
      MapPage.showMapModal();
      LocalStorage.set("firsttime_map",false);
    }

    // don't perform this when you redirect from submitting a smell report
    if (MapPage.centerLocation.length != 2) {
      Location.requestLocation(function(latitude,longitude) {
        console.log("got latlong: "+latitude+","+longitude);
        $('#iframe-map').attr('src', Constants.URL_SMELLPGH+"/visualization?user_hash="+LocalStorage.get("user_hash")+"&latLng="+latitude+","+longitude);
      },function (error){
        console.log(error);
        //if unable to get location use this src to at display something
         $('#iframe-map').attr('src', Constants.URL_SMELLPGH+"/visualization?user_hash="+LocalStorage.get("user_hash") );
      });
    } else {
      var latitude = MapPage.centerLocation[0], longitude = MapPage.centerLocation[1];
      console.log("got latlong (without requesting a second time): "+latitude+","+longitude);
      $('#iframe-map').attr('src', Constants.URL_SMELLPGH+"/visualization?user_hash="+LocalStorage.get("user_hash")+"&latLng="+latitude+","+longitude);
      MapPage.centerLocation = [];
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
  //doesnt work just an idea
/*
  getCurrentCity:function(lat,lng,callback){
    let city="";
    if(city!=localStorage.get("current_city")){
      localStorage.set("current_city",city);
    }
    callback(city);
  },

  checkPlaceList:function(city,time){
    let  placesObj=localStorage.get("recent_places");
    var time=placesObj.time;
    var places=placesObj.places;
    for(var i=0;i<places.length;i++){
      if(city===places[i]){
        return;
      }
    }
    //current city
    welsomeMessage(city)
    placesObj={
      time:time,
      places:places
    };
    localStorage.set("recent_places",placesObj)
    App.setPlace(city);
  }*/

}
