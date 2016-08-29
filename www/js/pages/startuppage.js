var StartupPage = {


  initialize: function () {

  },


  onDeviceReady: function() {
    $("#startup-to-settings").click(function() {
      LocalStorage.setIsStartUpDone(true);
      App.initialize();
    });
  }

}
