var HomePage = {

  smellValueSelected: false,
  smellValue: 0,
  smellDescriptionPlaceholder: "e.g. industrial, woodsmoke, rotten-eggs",
  smellFeelingsSymptomsPlaceholder: "e.g. headache, sore throat, eye irritation",
  additionalCommentsPlaceholder: "e.g. if you submit more than one report in the same day please let ACHD know",
  isLatLngDefined: false,
  location: {"lat": 0, "lng": 0},


  initialize: function () {
    console.log("HomePage.initialize");

    Location.hasLocation = false;
    HomePage.checkSubmitStatus();

    // first-time modal
    if (LocalStorage.get("firsttime_home")) {
      HomePage.showHomeModal();
      LocalStorage.set("firsttime_home",false);
    }

    // set placeholder text
    $("#textfield_smell_description").attr("placeholder",HomePage.smellValue == 1 ? "N/A" : HomePage.smellDescriptionPlaceholder);
    $("#textfield_feelings_symptoms").attr("placeholder",HomePage.smellValue == 1 ? "N/A" : HomePage.smellFeelingsSymptomsPlaceholder);
    $("#textfield_additional_comments").attr("placeholder",HomePage.additionalCommentsPlaceholder);

    // browser compatibility issues (Yay?)
    $("#home-panel").find(".ui-btn-active").removeClass("ui-btn-active");
  },


  onDeviceReady: function() {
    console.log("HomePage.onDeviceReady");

    // click listeners
    $("#button_submit_report").click(HomePage.onClickSubmit);
    $("#button_smell_location").click(HomePage.onClickLocation);
    $(".radio-smell").click(function() {HomePage.onClickSmell(this);});
    // focus (textbox) listeners
    $("#textfield_smell_description").focus(function(){HomePage.onFocusTextboxWithLabel( this, $("label[for="+this.id+"]")[0] )});
    $("#textfield_feelings_symptoms").focus(function(){HomePage.onFocusTextboxWithLabel( this, $("label[for="+this.id+"]")[0] )});
    $("#textfield_additional_comments").focus(function(){HomePage.onFocusTextboxWithLabel( this, $("label[for="+this.id+"]")[0] )});
  },


  // helper functions


  useLocation: function(location) {
    HomePage.isLatLngDefined = true;
    HomePage.location = location;
    // TODO geocoder?
    $("#button_smell_location").text(location["lat"]+", "+location["lng"]);
  },


  checkSubmitStatus: function() {
    var isDisabled = false;

    // conditions for disabling the submit button
    // if (!Location.hasLocation) isDisabled = true;
    if (!this.smellValueSelected) isDisabled = true;

    $("#button_submit_report").attr("disabled",isDisabled);
  },


  showHomeModal: function() {
    $("#modal-home-firsttime").popup();
    // delays opening to avoid issues with iOS < 9.3
    setTimeout(function() {
      $("#modal-home-firsttime").popup("open");
    }, 250);
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
    $("#textfield_smell_description").attr("placeholder",HomePage.smellDescriptionPlaceholder);
    $("#textfield_feelings_symptoms").attr("placeholder",HomePage.smellFeelingsSymptomsPlaceholder);
    $("#button_smell_location").text("Current Location (default)");
  },


  // callbacks


  onClickSubmit: function() {
    if (isConnected()) {
      var smell_value = HomePage.smellValue;
      var smell_description = $("#textfield_smell_description")[0].value;
      var feelings_symptoms = $("#textfield_feelings_symptoms")[0].value;
      var additional_comments = $("#textfield_additional_comments")[0].value;
      var submitACHD = Constants.SUBMIT_TO_ACHD;
      var email = LocalStorage.get("email");
      var name = LocalStorage.get("name");
      var phone_number = LocalStorage.get("phone");
      var address = LocalStorage.get("address");
      var userHash = LocalStorage.get("user_hash");

      // TODO make this more like a form submission in HTML? then you don't need to specify all of this
      var data = {
        "user_hash": userHash,
        "smell_value": smell_value,
        "smell_description": smell_description,
        "feelings_symptoms": feelings_symptoms,
        "additional_comments": additional_comments
      };

      if (submitACHD) {
        data["submit_achd_form"] = Boolean(submitACHD);
        if (email != "") data["email"] = email;
        if (name != "") data["name"] = name;
        if (phone_number != "") data["phone_number"] = phone_number;
        if (address != "") data["address"] = address;
      }

      if (HomePage.isLatLngDefined) {
        data["latitude"] = HomePage.location["lat"];
        data["longitude"] = HomePage.location["lng"];
        HomePage.submitAjaxWithData(data);
      } else {
        Location.requestLocation(function(latitude,longitude) {
          data["latitude"] = latitude;
          data["longitude"] = longitude;
          HomePage.submitAjaxWithData(data);
        });
      }
    } else {
      if (App.isDeviceReady) {
        alert("Connect to the internet before submitting a smell report.", null, "No Internet Connection", "Ok");
      }
    }
  },


  onClickLocation: function() {
    $.mobile.pageContainer.pagecontainer("change", "#locationselect", { changeHash: false, transition: "none" });
  },


  submitAjaxWithData: function(data) {
    showSpinner("Submitting Report...");
    $.ajax({
      type: "POST",
      dataType: "json",
      url: Constants.URL_SMELLPGH+"/api/v1/smell_reports",
      data: data,
      xhrFields: { withCredentials: false },

      success: function (data) {
        hideSpinner();
        HomePage.clearForm();
        $.mobile.pageContainer.pagecontainer("change", "#map", { changeHash: false, transition: "none" });
      },

      error: function (msg) {
        hideSpinner();
        alert("There was a problem submitting this report.");
      }
    });
  },


  onClickSmell: function(item) {
    HomePage.smellValueSelected = true;
    HomePage.smellValue = item.value;
    HomePage.checkSubmitStatus();
    HomePage.fieldsDisabled((HomePage.smellValue == 1));
  },


  // Opening keyboard should focus the label, closing the keyboard should blur the textbox
  onFocusTextboxWithLabel: function(element,label) {
    App.htmlElementToScrollAfterKeyboard = label;
    App.htmlElementToBlurAfterKeyboardCloses = element;
    label.scrollIntoView();
  }

}
