var HomePage = {

  smellValueSelected: false,
  smellValue: 1,


  initialize: function () {
    console.log("HomePage.initialize");

    Location.hasLocation = false;
    HomePage.checkSubmitStatus();

    // first-time modal
    if (LocalStorage.get("firsttime_home")) {
      HomePage.showHomeModal();
      LocalStorage.set("firsttime_home",false);
    }

    // browser compatibility issues (Yay?)
    $("#home-panel").find(".ui-btn-active").removeClass("ui-btn-active");
  },


  onDeviceReady: function() {
    console.log("HomePage.onDeviceReady");

    // click listeners
    $("#button_submit_report").click(HomePage.onClickSubmit);
    $(".radio-smell").click(function() {HomePage.onClickSmell(this);});
    // focus (textbox) listeners
    $("#textfield_smell_description").focus(function(){HomePage.onFocusTextboxWithLabel( this, $("label[for="+this.id+"]")[0] )});
    $("#textfield_feelings_symptoms").focus(function(){HomePage.onFocusTextboxWithLabel( this, $("label[for="+this.id+"]")[0] )});
    $("#textfield_additional_comments").focus(function(){HomePage.onFocusTextboxWithLabel( this, $("label[for="+this.id+"]")[0] )});
  },


  // helper functions


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


  // callbacks


  onClickSubmit: function () {
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

      Location.requestLocation(function(latitude,longitude) {
        data["latitude"] = latitude;
        data["longitude"] = longitude;
        showSpinner("Submitting Report...");

        $.ajax({
          type: "POST",
          dataType: "json",
          url: Constants.URL_SMELLPGH+"/api/v1/smell_reports",
          data: data,
          xhrFields: { withCredentials: false },

          success: function (data) {
            hideSpinner();
            $.mobile.pageContainer.pagecontainer("change", "#map", { changeHash: false, transition: "none" });
          },

          error: function (msg) {
            hideSpinner();
            alert("There was a problem submitting this report.");
          }
        });
      });
    } else {
      if (App.isDeviceReady) {
        alert("Connect to the internet before submitting a smell report.", null, "No Internet Connection", "Ok");
      }
    }
  },


  onClickSmell: function (item) {
    HomePage.smellValueSelected = true;
    HomePage.smellValue = item.value;
    HomePage.checkSubmitStatus();
  },


  // Opening keyboard should focus the label, closing the keyboard should blur the textbox
  onFocusTextboxWithLabel: function(element,label) {
    App.htmlElementToScrollAfterKeyboard = label;
    App.htmlElementToBlurAfterKeyboardCloses = element;
    label.scrollIntoView();
  }

}
