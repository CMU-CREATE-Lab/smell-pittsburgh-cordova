var StartupPage = {


  initialize: function () {

  },


  onDeviceReady: function() {
    console.log("StartupPage.onDeviceReady");
    $("#startup-to-settings").click(function() {
      LocalStorage.set("firsttime_startup", false);
      App.initialize();
    });
  }

}
