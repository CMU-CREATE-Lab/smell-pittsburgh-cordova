var HomePage = {

  smellValueSelected: false,
  smellValue: 0,
  smellDescriptionPlaceholder: null,
  smellFeelingsSymptomsPlaceholder: null,
  additionalCommentsPlaceholder: null,
  isLatLngDefined: false,
  returningFromLocationSelectPage: false,
  request: null,
  location: {"lat": 0, "lng": 0},
  openedPredictionNotification: false,
  text: null, //the text for the page's template
  ajaxTimeout: 3000, // the number of milliseconds to wait for the ajax request to timeout (for submitting smell reports)
  didInitialLoad: false,
  submittingReport: false,


  loadTemplate: function() {
    this.text = App.text.home;
    // placeholder set up
    HomePage.smellDescriptionPlaceholder = this.text.describe.placeholder;
    HomePage.smellFeelingsSymptomsPlaceholder = this.text.symptoms.placeholder;
    HomePage.additionalCommentsPlaceholder = this.text.note.placeholder;
    var homeTpl = Handlebars.compile($("#home-tpl").html());
    $('#home').html(homeTpl(this.text));
    $('#home').trigger('create');
  },


  setListeners: function() {
    // click listeners
    $("#button_submit_report").click(HomePage.onClickSubmit);
    $("#button_smell_location").click(HomePage.onClickLocation);
    $(".radio-smell").click(function() {HomePage.onClickSmell(this);});
    $("#checkbox_current_time_location").click(HomePage.onClickCurrentTimeLocation);
    // focus (textbox) listeners
    $("#textfield_smell_description").focus(function(){HomePage.onFocusTextboxWithLabel(this, $("label[for="+this.id+"]")[0] )});
    $("#textfield_feelings_symptoms").focus(function(){HomePage.onFocusTextboxWithLabel(this, $("label[for="+this.id+"]")[0] )});
    $("#textfield_additional_comments").focus(function(){HomePage.onFocusTextboxWithLabel(this, $("label[for="+this.id+"]")[0] )});
    $("#select-report-time").change(HomePage.onChangeReportTime);
  },


  onCreate: function() {
    console.log("HomePage.onCreate");
    if (!HomePage.didInitialLoad) {
      HomePage.didInitialLoad = true;
      this.loadTemplate();
      this.setListeners();
    }

    if (HomePage.returningFromLocationSelectPage) {
      console.log("HomePage.initialize: returningFromLocationSelectPage");
      HomePage.returningFromLocationSelectPage = false;
      return;
    }

    if (HomePage.request != null) {
      HomePage.request.abort();
      HomePage.request = null;
    }
    HomePage.checkSubmitStatus();

    // TODO hide location/time select for now; remove later
    $("#current_time_location").hide();

    // first-time predict modal
    if (HomePage.openedPredictionNotification) {
      if (LocalStorage.get("firsttime_prediction")) {
        HomePage.showPredictModal();
        LocalStorage.set("firsttime_prediction", false);
      }
      HomePage.openedPredictionNotification = false;
    }
    // first-time modal
    if (LocalStorage.get("firsttime_home")) {
      HomePage.showHomeModal();
      LocalStorage.set("firsttime_home", false);
    }

    // set placeholder text
    $("#textfield_smell_description").attr("placeholder", HomePage.smellValue == 1 ? "N/A" : HomePage.smellDescriptionPlaceholder);
    $("#textfield_feelings_symptoms").attr("placeholder", HomePage.smellValue == 1 ? "N/A" : HomePage.smellFeelingsSymptomsPlaceholder);
    $("#textfield_additional_comments").attr("placeholder", HomePage.additionalCommentsPlaceholder);

    $("#checkbox_current_time_location").prop("checked", true);
    $("#checkbox_current_time_location").checkboxradio("refresh", true);
    // hide/show time/location options
    HomePage.onClickCurrentTimeLocation();
    // generate options for custom time
    HomePage.populateOptionsForSelectReportTime();

    // browser compatibility issues (Yay?)
    $("#home").resize();

    // Update current city name and coressponding info
    // App.refreshCity();
  },


  // NOTE: this displays some what inconsistent behavior as the home page seems to be initialized 90% of the time the user loads it but not 100%
  initialize: function () {
    console.log("HomePage.initialize (deprecated; start using onCreate instead)");
    HomePage.onCreate();
  },


  onDeviceReady: function() {
    console.log("HomePage.onDeviceReady");
    // click listeners
    $("#button_submit_report").click(HomePage.onClickSubmit);
    $("#button_smell_location").click(HomePage.onClickLocation);
    $(".radio-smell").click(function() {HomePage.onClickSmell(this);});
    $("#checkbox_current_time_location").click(HomePage.onClickCurrentTimeLocation);
    // focus (textbox) listeners
    $("#textfield_smell_description").focus(function(){HomePage.onFocusTextboxWithLabel(this, $("label[for="+this.id+"]")[0] )});
    $("#textfield_feelings_symptoms").focus(function(){HomePage.onFocusTextboxWithLabel(this, $("label[for="+this.id+"]")[0] )});
    $("#textfield_additional_comments").focus(function(){HomePage.onFocusTextboxWithLabel(this, $("label[for="+this.id+"]")[0] )});
    $("#select-report-time").change(HomePage.onChangeReportTime);
  },


  // helper functions


  populateOptionsForSelectReportTime: function() {
    $("#select-report-time").empty();
    var values = HomePage.generatePastTimes();

    // empty value
    $("#select-report-time").append("<option value=''></option>");
    // current time
    $("#select-report-time").append("<option value='0'>Now</option>");
    values.forEach(function(time) {
      var value = time;
      var hour = new Date(time).getHours();
      var meridiem = (hour >= 12) ? "PM" : "AM";
      if (hour == 0) {
        hour = 12;
      } else if (hour > 12) {
        hour = hour % 12;
      }
      var text = hour + ":00 " + meridiem;
      // TODO check for character escapes
      var str = "<option value='" + value + "'>" + text + "</option>";
      $("#select-report-time").append(str);
    });

    // select empty by default
    $("#select-report-time").val("");
    // refresh widget
    $("#select-report-time").selectmenu("refresh", true);
  },


  generatePastTimes: function() {
    var result = [];
    var currentTime = new Date();
    currentTime.setMilliseconds(0);
    currentTime.setSeconds(0);
    currentTime.setMinutes(0);

    for (i=0; i<=currentTime.getHours(); i++) {
      var d = new Date(currentTime);
      d.setHours(i);
      result.push(d.toISOString().split(".")[0]+"+00:00");
    }

    // return times from newest to oldest
    return result.reverse();
  },


  useLocation: function(location) {
    HomePage.isLatLngDefined = true;
    HomePage.location = location;
    // TODO geocoder?
    $("#button_smell_location").text(location["lat"] + ", " + location["lng"]);
    HomePage.returningFromLocationSelectPage = true;
  },


  checkSubmitStatus: function() {
    console.log("checkSubmitStatus()");
    var isDisabled = false;

    // conditions for disabling the submit button
    // if (!Location.hasLocation) isDisabled = true;
    if (!this.smellValueSelected) isDisabled = true;
    // if you haven't selected time when using custom time/location
    if (!$("#checkbox_current_time_location").prop("checked") && $("#select-report-time").val() == "" ) isDisabled = true;

    $("#button_submit_report").attr("disabled",isDisabled);
  },


  fieldsDisabled: function(smellsJustFine) {
    // if it smells "just fine!" then don't include smell descriptors and symptoms
    $("#textfield_smell_description,#textfield_feelings_symptoms").attr("disabled",smellsJustFine);
    $("#textfield_smell_description,#textfield_feelings_symptoms").textinput({clearBtn:!smellsJustFine});
    $("#textfield_smell_description").attr("placeholder", smellsJustFine ? "N/A" : HomePage.smellDescriptionPlaceholder);
    $("#textfield_feelings_symptoms").attr("placeholder", smellsJustFine ? "N/A" : HomePage.smellFeelingsSymptomsPlaceholder);
    if (smellsJustFine) {
      $("#textfield_smell_description")[0].value = "";
      $("#textfield_feelings_symptoms")[0].value = "";
      $("#textfield_smell_description,#textfield_feelings_symptoms").parent().addClass("textfield-disabled");
    } else {
      $("#textfield_smell_description,#textfield_feelings_symptoms").parent().removeClass("textfield-disabled");
    }
  },


  clearForm: function() {
    // reset class variables
    HomePage.smellValue = 0;
    HomePage.smellValueSelected = false;
    // clear text fields
    $("#textfield_smell_description")[0].value = "";
    $("#textfield_feelings_symptoms")[0].value = "";
    $("#textfield_additional_comments")[0].value = "";
    // make sure fields aren't disabled
    HomePage.fieldsDisabled(false);
    // reset radio buttons
    $(".radio-smell").prop("checked",false);
    $(".radio-smell").checkboxradio("refresh");
    // reset location
    HomePage.isLatLngDefined = false;
    HomePage.location = {"lat": 0, "lng": 0};
    // set placeholder text
    $("#textfield_smell_description").attr("placeholder", HomePage.smellDescriptionPlaceholder);
    $("#textfield_feelings_symptoms").attr("placeholder", HomePage.smellFeelingsSymptomsPlaceholder);
    $("#button_smell_location").text("Current Location (default)");
    // reset custom time/location
    $("#checkbox_current_time_location").prop("checked",true).checkboxradio("refresh");
    $("#display_for_custom_time_location").hide();
    $("#select-report-time").val("");
    $("#select-report-time").selectmenu("refresh", true);
  },


  showPredictModal: function() {
    showModal("modal-predict-firsttime");
  },


  showHomeModal: function() {
    showModal("modal-home-firsttime");
  },


  // callbacks


  onClickSubmit: function() {
    if (isConnected()) {
      showSpinner("Submitting Report...");
      HomePage.submittingReport = true;
      var smell_value = HomePage.smellValue;
      var smell_description = $("#textfield_smell_description")[0].value;
      var feelings_symptoms = $("#textfield_feelings_symptoms")[0].value;
      var additional_comments = $("#textfield_additional_comments")[0].value;
      var email = LocalStorage.get("email");
      var name = LocalStorage.get("name");
      var phone_number = LocalStorage.get("phone");
      var address = LocalStorage.get("address");
      var userHash = LocalStorage.get("user_hash");

      var data = {
        "user_hash": userHash,
        "smell_value": smell_value,
        "smell_description": smell_description,
        "feelings_symptoms": feelings_symptoms,
        "additional_comments": additional_comments
      };

     if (email != "") data["email"] = email;
     if (name != "") data["name"] = name;
     if (phone_number != "") data["phone_number"] = phone_number;
     if (address != "") data["address"] = address;

      // set custom location flag, custom time flag
      var usesCustomTime = !$("#checkbox_current_time_location").prop("checked") && $("#select-report-time").val() != "0";
      var usesCustomLocation = !$("#checkbox_current_time_location").prop("checked") && HomePage.isLatLngDefined;
      data["custom_time"] = usesCustomTime ? "true" : "false";
      data["custom_location"] = usesCustomLocation ? "true" : "false";

      // determine if using custom time
      var time = usesCustomTime ? $("#select-report-time").val() : (new Date()).toISOString(); //parseInt((new Date).getTime());
      data["observed_at"] = time;
      data["custom_time"] = usesCustomTime;

      // determine if using custom location (and send data)
      if (usesCustomLocation) {
        data["latitude"] = HomePage.location["lat"];
        data["longitude"] = HomePage.location["lng"];
        HomePage.submitAjaxWithData(data);
      } else {
        Location.requestLocation(function(latitude,longitude) {
          data["latitude"] = latitude;
          data["longitude"] = longitude;
          HomePage.submitAjaxWithData(data);
        });
        // navigator.globalization.getDatePattern(function(dateInfo) {
          // Force city refresh when submitting a report
          // App.refreshCity(true, function(response) {
          //   if (response.status == "failure") {
          //     alert("There was a problem submitting this report. Error code: S1");
          //     return;
          //   }
          //   var currentCity = LocalStorage.get("current_city");
          //   data["latitude"] = currentCity.lat;
          //   data["longitude"] = currentCity.lng;
          //   // Note: If streetName ends up being empty, we will do a reverse geo lookup on the server,
          //   // which seems to always return a street no matter the lat/lng.
          //   data["street_name"] = currentCity.streetName;
          //   data["zip"] = currentCity.zip;
          //   data["state"] = currentCity.state;
          //   data["timezone"] = dateInfo.iana_timezone;
          //   HomePage.submitAjaxWithData(data);
          // });
        // });
      }
    } else {
      if (App.isDeviceReady) {
        alert("Connect to the internet before submitting a smell report.", null, "No Internet Connection", "Ok");
      }
    }
  },


  onClickLocation: function() {
    App.navigateToPage(Constants.LOCATION_SELECT_PAGE);
  },


  onClickCurrentTimeLocation: function() {
    if ($("#checkbox_current_time_location").prop("checked")) {
      $("#display_for_custom_time_location").hide();
    } else {
      $("#display_for_custom_time_location").show();
    }
    // determine if submit should be enabled
    HomePage.checkSubmitStatus();
  },


  onChangeReportTime: function() {
    console.log("onChangeReportTime()");
    // determine if submit should be enabled
    HomePage.checkSubmitStatus();
  },


  submitAjaxWithData: function(data) {
    var userAgent = (typeof navigator != "undefined" && navigator.userAgent != undefined ) ? navigator.userAgent : "undefined";
    data["debug_info"] = {
      "app_version": Constants.APP_VERSION,
      "navigator.userAgent": userAgent,
    };
    data["client_token"] = Constants.CLIENT_ID;
    var url = Constants.URL_API + "/api/v2/smell_reports";
    HomePage.submitAjaxToUrlWithData(url, data);
  },


  submitAjaxWithDataToV1Api: function(data) {
    var url = Constants.URL_API + "/api/v1/smell_reports";
    HomePage.submitAjaxToUrlWithData(url, data);
  },


  submitAjaxToUrlWithData: function(url, data) {
    if (HomePage.request != null) {
      console.log("WARNING: refusing to send with non-null request.");
      return;
    }
    
    HomePage.request = $.ajax({
      type: "POST",
      dataType: "json",
      url: url,
      data: data,
      timeout: HomePage.ajaxTimeout,
      xhrFields: { withCredentials: false },

      success: function(data) {
        hideSpinner();
        HomePage.clearForm();
        HomePage.request = null;
        HomePage.submittingReport = false;
        MapPage.centerLocation = [ data["latitude"], data["longitude"] ];
        App.navigateToPage(Constants.MAP_PAGE);
        //Popup notifying user of successful submission
        App.showPopup("success-popup",5000);
      },

      error: function(msg) {
        // TODO in the future we should run the statusText / error code through to Analytics
        hideSpinner();
        HomePage.request = null;
        HomePage.submittingReport = false;
        switch(msg.statusText) {
          case "Internal Server Error":
            alert("Smell report received but may not have been saved. Please check the map.");
            MapPage.centerLocation = [ data["latitude"], data["longitude"] ];
            App.navigateToPage(Constants.MAP_PAGE);
            break;
          case "timeout":
            alert("Request timed out. Please try again.");
            break;
          default:
            alert("There was a problem submitting this report. Error code: S2");
            break;
        }
      },
    });
  },


  onClickSmell: function(item) {
    console.log("onClickSmell");
    HomePage.smellValueSelected = true;
    HomePage.smellValue = item.value;
    HomePage.fieldsDisabled((HomePage.smellValue == 1));
    HomePage.checkSubmitStatus();
  },


  // Opening keyboard should focus the label, closing the keyboard should blur the textbox
  onFocusTextboxWithLabel: function(element, label) {
    App.htmlElementToScrollAfterKeyboard = label;
    //App.htmlElementToBlurAfterKeyboardCloses = element;
    label.scrollIntoView();
  },

}
