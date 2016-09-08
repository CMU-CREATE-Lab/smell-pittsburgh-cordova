﻿var SettingsPage = {

  flipswitchReady: false,
  activeSmells: {},


  initialize: function () {
    this.activeSmells = LocalStorage.get("smell_notification_values");
    this.flipswitchReady = false;

    this.refreshNotifications();
    this.populateFormSettings();
    this.expandTabs();

    this.flipswitchReady = true;
  },


  onDeviceReady: function() {
    $("#checkbox_smell_notifications").click(SettingsPage.onToggleSmellNotifications);
    $("#textfield_email").change(SettingsPage.onEmailChange);
    $("#textfield_name").change(SettingsPage.onNameChange);
    $("#textfield_phone").change(SettingsPage.onPhoneChange);
    $("#textfield_address").change(SettingsPage.onAddressChange);
    $(".checkbox-smell-subscribe").click(function() {SettingsPage.onCheckboxClick(this)});
  },


  // helper functions


  refreshNotifications: function() {
    // enable notifications switch
    if (LocalStorage.get("receive_notifications")) {
      $("#checkbox_smell_notifications").checkboxradio("enable");
    } else {
      $("#checkbox_smell_notifications").checkboxradio("disable");
    }

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


  clearSmellNotifications: function () {
    for (var i = 1; i <= 5; i++) {
      FCMPlugin.unsubscribeFromTopic(Constants.SMELL_REPORT_TOPIC + i);
      console.log("unsubcribed from: SmellReport-" + i);
    }
  },


  // callbacks


  onToggleSmellNotifications: function() {
    if (LocalStorage.get("receive_smell_notifications")) {
      LocalStorage.set("receive_smell_notifications",false);
      $(".checkbox-smell-subscribe").checkboxradio('disable');
      SettingsPage.clearSmellNotifications();
    } else {
      LocalStorage.set("receive_smell_notifications",true);
      $(".checkbox-smell-subscribe").checkboxradio('enable');
      Object.keys(SettingsPage.activeSmells).forEach(function(key) {
        if (SettingsPage.activeSmells[key]) SettingsPage.subscribeToSmell(key);
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
      SettingsPage.subscribeToSmell(smellValue);
      SettingsPage.activeSmells[smellValue] = true;
      LocalStorage.set("smell_notification_values",SettingsPage.activeSmells);
    } else {
      SettingsPage.unsubscribeToSmell(smellValue);
      SettingsPage.activeSmells[smellValue] = false;
      LocalStorage.set("smell_notification_values",SettingsPage.activeSmells);
    }
  }

}
