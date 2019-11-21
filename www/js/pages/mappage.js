var MapPage = {

  text: null, //the text for the page's template
  centerLocation: [],
  didInitialLoad: false,


  loadTemplate: function() {
    this.text = App.text.map;
    var mapTpl = Handlebars.compile($("#map-tpl").html());
    $('#map').html(mapTpl(this.text));
    $('#map').trigger('create');
  },


  setListeners: function() {
    // (future listeners will go here)
  },


  onCreate: function() {
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

    // var mapUrl = Constants.URL_MAP + "?user_hash=" + LocalStorage.get("user_hash") + "&client_token=" + Constants.CLIENT_ID;
    
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
    // // Update current city name and corresponding info
    // App.refreshCity(null, function() {
    //   var currentCity = LocalStorage.get("current_city");
    //   if (currentCity && currentCity.name) {
    //     mapUrl += "&cityName=" + currentCity.name + "&zipCode=" + currentCity.zip;
    //   }
    //   $('#iframe-map').attr('src', mapUrl + "&latLng=" + currentCity.lat + "," + currentCity.lng);

    //   // browser compatibility issues (Yay?)
    // });
  },


  initialize: function () {
    console.log("MapPage.initialize (deprecated; start using onCreate instead)");
    this.onCreate();
  },


  // helper functions


  showMapModal: function() {
    showModal("modal-map-firsttime");
  },


  // /**
  //  * returns if the new city is the same as the old one
  //  * @param {string} newCity -name of city as string
  //  */
  // cityEquality: function(newCity) {
  //   var oldCity = LocalStorage.get("current_city");
  //   return oldCity === newCity;
  // },
  //
  //
  // // Creates and animates new city pop up
  // makePopup: function(){
  //   // gets aqi
  //   MapPage.getAQI(MapPage.zipcode, function(aqi) {
  //     // update aqi text
  //     $(".aqi").text(aqi);
  //     // show popup
  //     $("#new-city-popup")[0].setAttribute("style", "position:absolute;top:0px");
  //     // animate it
  //     $("#new-city-popup").animate({top: "-110px"}, 1250);
  //     // 10 sec close timer
  //     $("#close-popup").click(MapPage.closePopup);
  //     MapPage.popupTimer = setTimeout(MapPage.closePopup, 1000*10);
  //   });
  // },
  //
  //
  // /**
  //  * changes all class your-city to the string passed in
  //  * @param {string} city -nmae of city as string
  //  */
  // refreshCityName: function(city) {
  //   $(".your-city").text(city);
  // },
  //
  //
  // // hides the new city popup
  // closePopup: function() {
  //   clearTimeout(MapPage.popupTimer);
  //   $("#new-city-popup")[0].setAttribute("style", "display:none");
  // },
  //
  //
  // /**
  //  * returns the aqi for a zip code
  //  * @param {string} zip -zipcode as string
  //  * @param {function} callback -takes aqi as string
  //  */
  // getAQI: function(zip, callback) {
  //   // TODO when the zipcode aqi goes live change this from staging to actual api
  //   var url = Constants.STAGING + "/api/v2/get_aqi?zipcode=" + zip;
  //   $.getJSON(url, function(data) {
  //     callback(data);
  //   });
  // },

}
