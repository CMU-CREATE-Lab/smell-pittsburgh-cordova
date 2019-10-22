/**
 * High-level implementation for Firebase Analytics
 * @namespace Analytics
 */

var Analytics = {


  /**
   * Should be called from app.js on device ready (and after Firebase.initialize).
   */
  initialize: function () {
    console.log("Analytics.initialize");
    Analytics.initializeUserProperties(LocalStorage.get("user_hash"));
  },


  // helper functions


  initializeUserProperties: function(userHash) {
    Firebase.setUserId(userHash);
    Firebase.setUserProperty("user_hash", userHash);
  },


  setScreenName: function(name) {
    Firebase.setScreenName(name);
  },


  // helper functions: LogEvent


  logOnPauseEvent: function() {
    var eventName = "on_pause";
    var params = {};
    Firebase.logEvent(eventName, params);
  },


  logOnResumeEvent: function() {
    var eventName = "on_resume";
    var params = {};
    Firebase.logEvent(eventName, params);
  },


  logOnClickNotificationEvent: function(notificationName) {
    var eventName = "on_click_notification";
    var params = {name: notificationName};
    Firebase.logEvent(eventName, params);
  },


  logOnUnsubscribeEvent: function(topicName) {
    var eventName = "on_unsubscribe";
    var params = {name: topicName};
    Firebase.logEvent(eventName, params);
  },


  logOnSubscribeEvent: function(topicName) {
    var eventName = "on_subscribe";
    var params = {name: topicName};
    Firebase.logEvent(eventName, params);
  },


  logEvent: function(eventName, params) {
    Firebase.logEvent(eventName, params);
  },

}
