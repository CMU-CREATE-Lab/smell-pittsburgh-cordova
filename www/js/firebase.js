/**
 * Helper for all calls to Firebase; makes it easier to remove/add package
 * @namespace Firebase
 */
var Firebase = {

  isEnabled: true,
  verboseLogging: true,


  /**
   * Should be called from app.js on device ready.
   */
  initialize: function () {
    console.log("Firebase.initialize");
    Firebase.isEnabled = (device.platform != "browser")
    if (!Firebase.isEnabled) {
      if (Firebase.verboseLogging) console.log("NOTE: !Firebase.isEnabled");
      return;
    }

    window.FirebasePlugin.getToken(function(token) {
        console.log("Your firebaseInstanceID is " + token);
      }, function(error) {
        console.error(error);
    });

    window.FirebasePlugin.onMessageReceived(function(message) {
      try {
        console.log("FirebasePlugin.onMessageReceived");
        if (message.messageType === "notification"){
          Firebase.handleNotificationMessage(message);
        } else {
          Firebase.handleDataMessage(message);
        }
      } catch(e){
        console.error("Exception in FirebasePlugin.onMessageReceived callback: " + e.message);
      }
    }, function(error) {
        console.error("Failed receiving FirebasePlugin message: " + error);
    });

    // subscribe to topics
    window.FirebasePlugin.subscribe(Constants.GLOBAL_TOPIC);
    if (Firebase.verboseLogging) console.log("FirebasePlugin subcribed to: " + Constants.GLOBAL_TOPIC);
    if (LocalStorage.get("receive_pghaqi_notifications")) {
     window.FirebasePlugin.subscribe(Constants.PITTSBURGH_AQI_TOPIC);
     if (Firebase.verboseLogging) console.log("subcribed to: " + Constants.PITTSBURGH_AQI_TOPIC);
    }
    if (LocalStorage.get("receive_smell_notifications")) {
     window.FirebasePlugin.subscribe(Constants.SMELL_REPORT_TOPIC);
     if (Firebase.verboseLogging) console.log("subcribed to: " + Constants.SMELL_REPORT_TOPIC);
    }

    window.FirebasePlugin.grantPermission();
  },


  // helper functions

  handleNotificationMessage: function(message){
    if (!Firebase.isEnabled) return;
    console.log("Firebase.handleNotificationMessage: " + JSON.stringify(message));
    if (message.tap){
      console.log("Firebase.handleNotificationMessage tapped");
      Analytics.logOnClickNotificationEvent(message["notification_type"]);
      if (message["open_with_page"]) {
        openWithPage(message["open_with_page"], message["notification_type"]);
      }
    }
  },


  handleDataMessage: function(message){
    if (!Firebase.isEnabled) return;
    console.log("Firebase.handleDataMessage Data message received: " + JSON.stringify(message));
  },


  setUserId: function(userHash) {
    if (Firebase.isEnabled) {
      window.FirebasePlugin.setUserId(userHash);
    }
    if (Firebase.verboseLogging) {
      console.log("Firebase.setUserId: "+userHash);
    }
  },


  setUserProperty: function(key, value) {
    if (Firebase.isEnabled) {
      window.FirebasePlugin.setUserProperty(key,value);
    }
    if (Firebase.verboseLogging) {
      console.log("Firebase.setUserProperty: "+key+","+value);
    }
  },


  setScreenName: function(name) {
    if (Firebase.isEnabled) {
      window.FirebasePlugin.setScreenName(name);
    }
    if (Firebase.verboseLogging) {
      console.log("Firebase.setScreenName: "+name);
    }
  },


  subscribe: function(topicName) {
    if (Firebase.isEnabled) {
      window.FirebasePlugin.subscribe(topicName);
    }
    if (Firebase.verboseLogging) {
      console.log("subscribed to "+topicName);
    }
  },


  unsubscribe: function(topicName) {
    if (Firebase.isEnabled) {
      window.FirebasePlugin.unsubscribe(topicName);
    }
    if (Firebase.verboseLogging) {
      console.log("unsubscribed from "+topicName);
    }
  },


  logEvent: function(eventName, params) {
    if (Firebase.isEnabled) {
      window.FirebasePlugin.logEvent(eventName, params);
    }
    if (Firebase.verboseLogging) {
      console.log("Firebase.logEvent: " + eventName + "," + params);
    }
  },

}
