
var coords;
var USER_HASH_KEY = "user_hash";


/* We may want to use a database because on iOS the local storage may be cleared
   if the device needs space. */
function generateUserHash() {
	var userHash;

    var storage = window.localStorage;
	userHash = storage.getItem(USER_HASH_KEY);
	if (userHash === null) {
		var random = Math.floor(Math.random()*9007199254740991);
		var date = new Date();
		var epoch = ((date.getTime()-date.getMilliseconds())/1000);
		var input = "" + random + " " + epoch;
		userHash = CryptoJS.MD5(input);
		storage.setItem(USER_HASH_KEY, userHash);
	}

    return userHash;
}


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
    // userHash
	var userHash = generateUserHash();

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
