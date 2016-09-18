var HomePage = {

  smellValueSelected: false,
  smellValue: 1,


  initialize: function () {
    console.log("HomePage.initialize");

    Location.hasLocation = false;
    Location.requestLocation();
    HomePage.checkSubmitStatus();

    // first-time modal
    if (LocalStorage.get("firsttime_home")) {
      HomePage.showHomeModal();
      LocalStorage.set("firsttime_home",false);
    }
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
    if (!Location.hasLocation) isDisabled = true;
    if (!this.smellValueSelected) isDisabled = true;

    $("#button_submit_report").attr("disabled",isDisabled);
  },


  showHomeModal: function() {
    $("#modal-home-firsttime").popup();
    $("#modal-home-firsttime").popup("open");
  },


  // callbacks


  onClickSubmit: function () {
    var coords = Location.coords;

    if (isConnected()) {
      var latitude = (coords != null) ? coords.latitude : 0;
      var longitude = (coords != null) ? coords.longitude : 0;
      var horizontalAccuracy = (coords != null) ? coords.accuracy : null;
      var altitudeAccuracy = (coords != null) ? coords.altitudeAccuracy : null;
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
        "latitude": latitude,
        "longitude": longitude,
        "smell_value": smell_value,
        "smell_description": smell_description,
        "feelings_symptoms": feelings_symptoms,
        "additional_comments": additional_comments
      };

      if (horizontalAccuracy != null) data["horizontal_accuracy"] = horizontalAccuracy;
      if (altitudeAccuracy != null) data["altitude_accuracy"] = altitudeAccuracy;
      
      if (submitACHD) {
        data["submit_achd_form"] = Boolean(submitACHD);
        if (email != "") data["email"] = email;
        if (name != "") data["name"] = name;
        if (phone_number != "") data["phone_number"] = phone_number;
        if (address != "") data["address"] = address;
      }

      $.ajax({
        type: "POST",
        dataType: "json",
        url: "http://localhost/api/v1/smell_reports",
        data: data,
        xhrFields: { withCredentials: false },

        success: function (data) {
          $.mobile.pageContainer.pagecontainer("change", "#map", { changeHash: false, transition: "none" });
        },

        error: function (msg) {
          alert("There was a problem submitting this report.");
        }
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
