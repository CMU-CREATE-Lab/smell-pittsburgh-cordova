var MapErrorPage = {

  text: null, //the text for the page's template


  loadTemplate: function() {
    this.text = App.text.maperror;
    var updatesTpl = Handlebars.compile($("#maperror-tpl").html());
    $('#maperror').html(updatesTpl(this.text));
    $('#maperror').trigger('create');
  },

  //Change the pages in this section to change the links for the footer
  setListeners: function() {
  },


  onCreate: function() {
    this.loadTemplate();
    this.setListeners();

  },


  initialize: function() {
    console.log("MapErrorPage.initialize (deprecated; start using onCreate instead)");
    MapErrorPage.onCreate();
  },

}
