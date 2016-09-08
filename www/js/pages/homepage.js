var HomePage = {

  smellValueSelected: false,
  smellValue: 1,
  readyToSubmit: false, // when changed to true, we want to scroll to the submit button


  initialize: function () {
    Location.hasLocation = false;
    Location.requestLocation();
    HomePage.checkSubmitStatus();
  },


  onDeviceReady: function() {
    console.log("HomePage.onDeviceReady");
    $("#button_submit_report").click(HomePage.onClickSubmit);
    $(".radio-smell").click(function() {HomePage.onClickSmell(this);});
  },


  // helper functions


  checkSubmitStatus: function() {
    var isDisabled = false;
    if (!Location.hasLocation) isDisabled = true;
    if (!this.smellValueSelected) isDisabled = true;

    $("#button_submit_report").attr("disabled",isDisabled);
    if (!isDisabled && !this.readyToSubmit) {
      $("#button_submit_report")[0].scrollIntoView();
      this.readyToSubmit = true;
    }
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
      var userHash = LocalStorage.get("user_hash");

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
  }

}
