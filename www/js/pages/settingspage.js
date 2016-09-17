var SettingsPage = {


  initialize: function () {
    this.refreshNotifications();
    this.populateFormSettings();
    this.expandTabs();
  },


  onDeviceReady: function() {
    console.log("SettingsPage.onDeviceReady");
    // avoid seeing the collapsed tabs on the first page transition
    this.expandTabs();
    
    // click listeners
    $("#checkbox_smell_notifications").click(SettingsPage.onToggleSmellNotifications);
    $("#checkbox_pghaqi_notifications").click(SettingsPage.onTogglePittsburghAqiNotifications);
    // change (text) listeners
    $("#textfield_email").change(SettingsPage.onEmailChange);
    $("#textfield_name").change(SettingsPage.onNameChange);
    $("#textfield_phone").change(SettingsPage.onPhoneChange);
    $("#textfield_address").change(SettingsPage.onAddressChange);
    // focus (textbox) listeners
    $("#textfield_email").focus(function(){SettingsPage.onFocusTextbox(this)});
    $("#textfield_name").focus(function(){SettingsPage.onFocusTextbox(this)});
    $("#textfield_phone").focus(function(){SettingsPage.onFocusTextbox(this)});
    $("#textfield_address").focus(function(){SettingsPage.onFocusTextbox(this)});
  },


  // helper functions


  refreshNotifications: function() {
    // enable smell notifications checkbox
    if (LocalStorage.get("receive_smell_notifications")) {
      $("#checkbox_smell_notifications").prop("checked", true).checkboxradio("refresh");
    } else {
      $("#checkbox_smell_notifications").prop("checked", false).checkboxradio("refresh");
    }

    // pittsburgh aqi notifications checkbox
    $("#checkbox_pghaqi_notifications").prop("checked", LocalStorage.get("receive_pghaqi_notifications")).checkboxradio("refresh");
  },


  populateFormSettings: function() {
    $("#textfield_email").prop("value", LocalStorage.get("email"));
    $("#textfield_name").prop("value", LocalStorage.get("name"));
    $("#textfield_phone").prop("value", LocalStorage.get("phone"));
    $("#textfield_address").prop("value", LocalStorage.get("address"));
  },


  expandTabs: function() {
    $("#notificationsCollapsible").collapsible({collapsed: false});
    $("#reportsCollapsible").collapsible({collapsed: false});
  },


  validateEmail: function(email) {
    // TODO double-check if this is a valid regex?
    var regexp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\ ".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regexp.test(email);
  }, 


  // callbacks


  onToggleSmellNotifications: function() {
    if (LocalStorage.get("receive_smell_notifications")) {
      LocalStorage.set("receive_smell_notifications",false);
      FCMPlugin.unsubscribeFromTopic(Constants.SMELL_REPORT_TOPIC);
      console.log("unsubscribed from "+Constants.SMELL_REPORT_TOPIC);
    } else {
      LocalStorage.set("receive_smell_notifications",true);
      FCMPlugin.subscribeToTopic(Constants.SMELL_REPORT_TOPIC);
      console.log("subscribed to "+Constants.SMELL_REPORT_TOPIC);
    }
  },


  onTogglePittsburghAqiNotifications: function() {
    if (LocalStorage.get("receive_pghaqi_notifications")) {
      LocalStorage.set("receive_pghaqi_notifications",false);
      FCMPlugin.unsubscribeFromTopic(Constants.PITTSBURGH_AQI_TOPIC);
      console.log("unsubscribed from "+Constants.PITTSBURGH_AQI_TOPIC);
    } else {
      LocalStorage.set("receive_pghaqi_notifications",true);
      FCMPlugin.subscribeToTopic(Constants.PITTSBURGH_AQI_TOPIC);
      console.log("subscribed to "+Constants.PITTSBURGH_AQI_TOPIC);
    }
  },


  onEmailChange: function (event) {
    if (SettingsPage.validateEmail(this.value) || this.value == "") {
      LocalStorage.set("email",this.value);
    } else {
      this.value = "";
      alert("Enter a valid email address.", null, "Invalid Email Entry", "Ok");
    }
  },


  onNameChange: function(event) {
    LocalStorage.set("name",this.value);
  },


  onPhoneChange: function (event) {
    LocalStorage.set("phone",this.value);
  },


  onAddressChange: function(event) {
    LocalStorage.set("address",this.value);
  },


  onFocusTextbox: function(element) {
    App.htmlElementToScrollAfterKeyboard = element;
    App.htmlElementToBlurAfterKeyboardCloses = element;
    element.scrollIntoView();
  }

}
