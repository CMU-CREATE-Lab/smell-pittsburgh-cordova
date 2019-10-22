var AboutPage = {

  text: null, //the text for the page's template
  didInitialLoad: false,


  loadTemplate: function() {
    this.text = App.text.about;
    var aboutTpl = Handlebars.compile($("#about-tpl").html());
    $('#about').html(aboutTpl(this.text));
    $('#about').trigger('create');
  },


  setListeners: function() {
    // add back (x) button functionality
    $(".back-x").click(function() {App.navigateToPastPage()});
  },


  onCreate: function() {
    var that = this;
    AboutPage.displayVersionNumber();
    if (!AboutPage.didInitialLoad) {
      AboutPage.didInitialLoad = true;
      this.loadTemplate();
      this.setListeners();
    }

    // // Update current city name and corresponding info
    // App.refreshCity(null, function(response) {
    //   // Update local partner content based on location
    //   that.setLocalPartnerContent();
    // });
  },


  initialize: function () {
    console.log("AboutPage.initialize (deprecated; start using onCreate instead)");
    AboutPage.onCreate();
  },

  // setLocalPartnerContent: function() {
  //   var currentCity = LocalStorage.get("current_city");
  //   var currentCityMetaData = currentCity.metaData;
  //   if (currentCityMetaData && currentCityMetaData["local_partners_content"]) {
  //     $(".local-partners-heading, .local-partners-content").show();
  //     // While content is not from user input, so it's already safe, use parseHTML to strip out any script tags.
  //     $(".local-partners-content").html($.parseHTML(currentCityMetaData["local_partners_content"]));
  //   } else {
  //     $(".local-partners-heading, .local-partners-content").hide();
  //   }
  // },


  // helper functions
  displayVersionNumber: function() {
    $("#about-version-number").text("version: "+Constants.APP_VERSION);
  },
}
