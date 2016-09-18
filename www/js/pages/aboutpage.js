var AboutPage = {


  initialize: function () {
    console.log("AboutPage.initialize");
  },


  onDeviceReady: function() {
    console.log("AboutPage.onDeviceReady");
    AboutPage.displayVersionNumber();
  },


  // helper functions


  displayVersionNumber: function() {
    $("#about-version-number").text("version: "+Constants.APP_VERSION);
  },

}
