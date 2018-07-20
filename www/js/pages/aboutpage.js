var AboutPage = {
  text:null, //the text for the page's template


  initialize: function () {
    console.log("AboutPage.initialize");
    //load template
    this.text=App.text.about;
    var aboutTpl=Handlebars.compile($("#about-tpl").html());
    $('#about').html(aboutTpl(this.text));
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
