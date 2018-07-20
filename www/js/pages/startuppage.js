var StartupPage = {


  initialize: function () {
    var startupTpl=Handlebars.compile($("#startup-tpl").html());
    $('#startup').html(startupTpl(english.startup));
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
