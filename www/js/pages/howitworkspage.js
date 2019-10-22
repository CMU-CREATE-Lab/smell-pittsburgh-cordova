var HowItWorksPage = {

  text: null, //the text for the page's template
  didInitialLoad: false,


  loadTemplate: function() {
    this.text = App.text.howitworks;
    var howitworksTpl = Handlebars.compile($("#howitworks-tpl").html());
    $('#howitworks').html(howitworksTpl(this.text));
    $('#howitworks').trigger('create');
  },


  setListeners: function() {
    // add back (x) button functionality
    $(".back-x").click(function() {App.navigateToPastPage()});
  },


  onCreate: function() {
    if (!HowItWorksPage.didInitialLoad) {
      HowItWorksPage.didInitialLoad = true;
      this.loadTemplate();
      this.setListeners();
    }

    // Update current city name and corresponding info
    // App.refreshCity();
  },


  initialize: function () {
    console.log("HowItWorksPage.initialize (deprecated; start using onCreate instead)");
    HowItWorksPage.onCreate();
  },


  // helper functions

}
