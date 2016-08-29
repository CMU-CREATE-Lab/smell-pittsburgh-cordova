


var StartupPage = {

  initialize: function () {

  },

  onDeviceReady: function() {
    // TODO things
    $("#startup-to-settings").click(function() {
      LocalStorage.setIsStartUpDone(true);
      App.initialize();
    });
  }
  
}