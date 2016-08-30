var LocalStorage = {

  DEFAULT_SETTINGS: {
    user_hash: "",
    receive_notifications: "true",
    receive_smell_notifications: "true",
    smell_notification_values: {"4": true, "5": true},
    //smells: [],
    email: "",
    firsttime_startup: "true",
    name: "",
    phone: "",
  },


  initialize: function() {
    for (key in this.DEFAULT_SETTINGS) {
      if (this.get(key) == null) this.set(key, this.DEFAULT_SETTINGS[key]);
    }
    if (this.DEFAULT_SETTINGS["user_hash"] == null || this.DEFAULT_SETTINGS["user_hash"] == "") {
      this.set("user_hash", this.generateUserHash());
    }
  },


  get: function(key) {
    var value = window.localStorage.getItem(key);
    if (value == null)
      return null;
    if (["receive_notifications","receive_smell_notifications","firsttime_startup"].indexOf(key) > -1)
      return (value == "true");
    if (["smell_notification_values"].indexOf(key) > -1)
      return JSON.parse(value);
    return value;
  },


  set: function(key, value) {
    if (["smell_notification_values"].indexOf(key) > -1) {
      window.localStorage.setItem(key, JSON.stringify(value));
    } else {
      window.localStorage.setItem(key, value);
    }
  },


  // generate a hash for the user
  generateUserHash: function() {
    var userHash;

    var random = Math.floor(Math.random()*9007199254740991);
    var date = new Date();
    var epoch = ((date.getTime()-date.getMilliseconds())/1000);
    var input = "" + random + " " + epoch;
    userHash = md5(input);

    return userHash;
  },

}

LocalStorage.initialize();
