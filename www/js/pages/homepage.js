


var HomePage = {

    smellValue: 1,

    initialize: function () {

    },

    onClickSubmit: function () {
        var coords = Location.coords;
        if (isConnected()) {
            // get input values
            var latitude = (coords != null) ? coords.latitude : 0;
            var longitude = (coords != null) ? coords.longitude : 0;
            var horizontalAccuracy = (coords != null) ? coords.accuracy : null;
            var altitudeAccuracy = (coords != null) ? coords.altitudeAccuracy : null;
            var smell_value = HomePage.smellValue;
            var smell_description = $("#textfield_smell_description")[0].value;
            var feelings_symptoms = $("#textfield_feelings_symptoms")[0].value;
            var submitACHD = true;
            var email = $("#textfield_email")[0].value;

            // userHash
            var userHash = LocalStorage.generateUserHash();

            var data = {
                "user_hash": userHash,
                "latitude": latitude,
                "longitude": longitude,
                "smell_value": smell_value,
                "smell_description": smell_description,
                "feelings_symptoms": feelings_symptoms
            };

            if (horizontalAccuracy != null) data["horizontal_accuracy"] = horizontalAccuracy;
            if (altitudeAccuracy != null) data["altitude_accuracy"] = altitudeAccuracy;
            if (submitACHD) {
                data["submit_achd_form"] = Boolean(submitACHD);
                if (email != "") data["email"] = email;
            }

            $.ajax({
                type: "POST",
                dataType: "json",
                url: "http://localhost/api/v1/smell_reports",
                data,
                xhrFields: { withCredentials: false },
                success: function (data) {
                    console.log("success!");
                    console.log(data);
                    $.mobile.changePage($("#map"), { changeHash: false, transition: "none" });
                    for (var key in data) {
                        if (data.hasOwnProperty(key)) {
                            console.log(key + "-> " + data[key]);
                        }
                    }
                },
                error: function (msg) {
                    alert(msg.message);
                }
            });
        } else {
            if (App.isDeviceReady) {
                navigator.notification.alert(
                    "Connect to the internet before submitting a smell report.",
                    null,
                    "No Internet Connection",
                    "Ok"
                );
            }
        }
    },

    onClickSmell: function (item) {
        $('.remove-active').removeClass('ui-btn-active');
        $("#smell_value_" + item.value).addClass('ui-btn-active');
        HomePage.smellValue = item.value;
    }

}