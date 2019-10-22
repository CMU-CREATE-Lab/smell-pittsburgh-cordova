var UpdatesPage = {

  text: null, //the text for the page's template


  loadTemplate: function() {
    this.text = App.text.updates;
    var updatesTpl = Handlebars.compile($("#updates-tpl").html());
    $('#updates').html(updatesTpl(this.text));
    $('#updates').trigger('create');
  },

  //Change the pages in this section to change the links for the footer
  setListeners: function() {
    $("#see-new-updates").click(function() {
      App.navigateToPage(Constants.SETTINGS_PAGE);
    });
    $("#take-me-back").click(function() {
      App.navigateToPage(App.pastPage);
    });
  },


  onCreate: function() {
    this.loadTemplate();
    this.setListeners();

  },


  initialize: function() {
    console.log("UpdatesPage.initialize (deprecated; start using onCreate instead)");
    UpdatesPage.onCreate();
  },

}
