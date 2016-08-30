var StartupPage = {


  initialize: function () {

  },


  onDeviceReady: function() {
    $("#startup-to-settings").click(function() {
      LocalStorage.set("firsttime_startup", false);
      App.initialize();
    });
  }

}
