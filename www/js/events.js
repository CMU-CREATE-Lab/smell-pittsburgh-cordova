
var coords;


function requestLocation() {
    var onSuccess = function(position) {
        coords = position.coords;
        console.log("got coords="+coords);
    };

    navigator.geolocation.getCurrentPosition(onSuccess);
}


function onClickSubmit() {
    // get input values
    var latitude = (coords != null) ? coords.latitude : 0;
    var longitude = (coords != null) ? coords.longitude : 0;
    var smell_value = $("#slider_smell_value")[0].value;
    var smell_description = $("#textfield_smell_description")[0].value;
    var feelings_symptoms = $("#textfield_feelings_symptoms")[0].value;
    // TODO generate this
    var userhash = "someuniquehash";

    $.ajax({
        type: "POST",
        dataType: "json",
        url: "http://localhost/api/v1/smell_reports",
        data: {
            "user_hash" : userhash,
            "latitude" : latitude,
            "longitude" : longitude,
            "smell_value" : smell_value,
            "smell_description" : smell_description,
            "feelings_symptoms" : feelings_symptoms,
        },
        xhrFields: { withCredentials: false },
        success: function(data) {
            console.log("success!");
            console.log(data);
            $.mobile.changePage($("#map"), {changeHash:false, transition: "none"});
        },
        error: function(msg) {
            alert(msg.message);
        }
    });
}


$(document).on("pageshow", "#home", function(){
    requestLocation();
});
$(document).on("pageshow", "#map", function(){
    console.log("refreshing iframe");
    $('#iframe-map').attr('src', $('#iframe-map').attr('src'));
});
