/**
 * High-level implementation for Firebase Analytics
 * @namespace Analytics
 */

var Analytics = {


  /**
   * Called when file is loaded.
   */
  initialize: function () {
    console.log("Analytics.initialize");
    Analytics.initializeUserProperties(LocalStorage.get("user_hash"));
  },


  // helper functions


  initializeUserProperties: function(userHash) {
    window.FirebasePlugin.setUserProperty("user_hash", userHash);
  },


  setScreenName: function(name) {
    window.FirebasePlugin.setScreenName(name);
  },


  // helper functions: LogEvent


  logOnPauseEvent: function() {
    var eventName = "on_pause";
    var params = {};
    window.FirebasePlugin.logEvent(eventName, params);
  },


  logOnResumeEvent: function() {
    var eventName = "on_resume";
    var params = {};
    window.FirebasePlugin.logEvent(eventName, params);
  },


  logOnClickNotificationEvent: function(notificationName) {
    var eventName = "on_click_notification";
    var params = {name: notificationName};
    window.FirebasePlugin.logEvent(eventName, params);
  },


  logOnUnsubscribeEvent: function(topicName) {
    var eventName = "on_unsubscribe";
    var params = {name: topicName};
    window.FirebasePlugin.logEvent(eventName, params);
  },


  logOnSubscribeEvent: function(topicName) {
    var eventName = "on_subscribe";
    var params = {name: topicName};
    window.FirebasePlugin.logEvent(eventName, params);
  },


  logEvent: function(eventName, params) {
    window.FirebasePlugin.logEvent(eventName, params);
  },

}


Analytics.initialize();
