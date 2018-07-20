var StartupPage = {
  text:null, //the text for the page's template

  initialize: function () {
    //load template
    this.text=App.text.startup;
    var startupTpl=Handlebars.compile($("#startup-tpl").html());
    $('#startup').html(startupTpl(this.text));
    $('#startup').trigger('create');
    console.log("StartupPage.initialize");
  },


  onDeviceReady: function() {
    console.log("StartupPage.onDeviceReady");
    $("#startup-to-settings").click(function() {
      LocalStorage.set("firsttime_startup", false);
      App.initialize();
    });
  }

}
