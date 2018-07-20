var AboutPage = {


  initialize: function () {
    console.log("AboutPage.initialize");
    var aboutTpl=Handlebars.compile($("#about-tpl").html());
    $('#about').html(aboutTpl(english.about));
    $('#about').trigger('create');
    $(".back-x").click(function(){App.navToPageID(App.pastPage)});
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
