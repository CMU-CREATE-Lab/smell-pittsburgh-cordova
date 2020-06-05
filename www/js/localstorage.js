/**
 * A helper for manipulating and accessing window.localStorage.
 * @namespace Location
 */
var LocalStorage = {

  /**
   * The default key-value pairs; use a key-value pair when a key is not yet defined.
   */
  DEFAULT_SETTINGS: {
    // TODO display version number somewhere
    storage_app_version: "1.1.1",
    // boolean values
    receive_smell_notifications: true,
    receive_notifications: true,
    receive_pghaqi_notifications: true,
    firsttime_startup: true,
    new_user_update: true,
    firsttime_home: true,
    firsttime_map: true,
    firsttime_prediction: true,
    // JSON
    smell_notification_values: {"4": true, "5": true},
    current_city: {name: "", zip: "", state: "", streetName: "", lat: null, lng: null, lastUpdate: ""},
    // strings
    user_hash: "",
    email: "",
    name: "",
    phone: "",
    address: "",
    language: 0,
    //string containing date that the app last showed the user the updated features message
    last_update_notification: "1970-01-01T00:00:00.000Z",
  },


  /**
   * Called when script is first loaded into HTML.
   */
  initialize: function() {
    if (this.get("storage_app_version") == null) {
      this.clear();
    }
    for (key in this.DEFAULT_SETTINGS) {
      if (this.get(key) == null) this.set(key, this.DEFAULT_SETTINGS[key]);
    }
    if (this.get("user_hash") == null || this.get("user_hash") == "") {
      this.set("user_hash", this.generateUserHash());
    }
  },


  /**
   * Access a value from window.localStorage.
   * @param {string} key - The key that the value is associated with.
   * @returns {json} The value for the specified key.
   */
  get: function(key) {
    return JSON.parse(window.localStorage.getItem(key));
  },


  /**
   * Set a key-value pair for window.localStorage.
   * @param {string} key
   * @param {json} value
   */
  set: function(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
  },


  /**
   * Generate a random hash for the user.
   */
  generateUserHash: function() {
    var userHash;
    var random = Math.floor(Math.random()*9007199254740991);
    var date = new Date();
    var epoch = ((date.getTime() - date.getMilliseconds()) / 1000);
    var input = "" + random + " " + epoch;
    userHash = md5(input);

    return userHash;
  },


  /**
   * Clear all key-value pairs for window.localStorage.
   */
  clear: function() {
    window.localStorage.clear();
  },

}

LocalStorage.initialize();
