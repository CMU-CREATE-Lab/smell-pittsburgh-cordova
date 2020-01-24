var StartupPage = {

  text: null, //the text for the page's template


  loadTemplate: function() {
    this.text = App.text.startup;
    var startupTpl = Handlebars.compile($("#startup-tpl").html());
    $('#startup').html(startupTpl(this.text));
    $('#startup').trigger('create');
  },


  setListeners: function() {
    //$(".langSelect").change(SettingsPage.langSelect);
    $("#startup-to-settings").click(function() {
      LocalStorage.set("firsttime_startup", false);
    });
  },


  onCreate: function() {
    this.loadTemplate();
    this.setListeners();
  },


  initialize: function() {
    console.log("StartupPage.initialize (deprecated; start using onCreate instead)");
    StartupPage.onCreate();
  },

}
