var SettingsPage = {

  activeSmells: {},


  initialize: function () {
    this.activeSmells = LocalStorage.get("smell_notification_values");

    this.refreshNotifications();
    this.populateFormSettings();
    this.expandTabs();
  },


  onDeviceReady: function() {
    console.log("SettingsPage.onDeviceReady");
    
    // click listeners
    $("#checkbox_smell_notifications").click(SettingsPage.onToggleSmellNotifications);
    $(".checkbox-smell-subscribe").click(function() {SettingsPage.onCheckboxClick(this)});
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
      $(".checkbox-smell-subscribe").checkboxradio('enable');
    } else {
      $("#checkbox_smell_notifications").prop("checked", false).checkboxradio("refresh");
      $(".checkbox-smell-subscribe").checkboxradio('disable');
    }

    // smell values checkboxes
    Object.keys(SettingsPage.activeSmells).forEach(function(key) {
      if (SettingsPage.activeSmells[key]) {
        $("#checkbox-choice-" + key).prop("checked", true).checkboxradio("refresh");
      } else {
        $("#checkbox-choice-" + key).prop("checked", false).checkboxradio("refresh");
      }
    });
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
      $(".checkbox-smell-subscribe").checkboxradio('disable');
      clearSmellNotifications();
    } else {
      LocalStorage.set("receive_smell_notifications",true);
      $(".checkbox-smell-subscribe").checkboxradio('enable');
      Object.keys(SettingsPage.activeSmells).forEach(function(key) {
        if (SettingsPage.activeSmells[key]) subscribeToSmell(key);
      });
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


  onCheckboxClick: function (item) {
    // some smell value 1-5 (string)
    var smellValue = item.value;

    if (item.checked) {
      subscribeToSmell(smellValue);
      SettingsPage.activeSmells[smellValue] = true;
      LocalStorage.set("smell_notification_values",SettingsPage.activeSmells);
    } else {
      unsubscribeToSmell(smellValue);
      SettingsPage.activeSmells[smellValue] = false;
      LocalStorage.set("smell_notification_values",SettingsPage.activeSmells);
    }
  },


  onFocusTextbox: function(element) {
    App.textfieldToScrollAfterKeyboard = element;
    element.scrollIntoView();
  }

}
