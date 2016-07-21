
var coords;
var isRequestingLocation = false;
var isSmellReportPage = false;


function requestLocation() {
	if (isDeviceReady && isConnected()) {
		if (!isRequestingLocation) {
			isRequestingLocation = true;
			showSpinner();
			
			var onSuccess = function(position) {
				isRequestingLocation = false;
				coords = position.coords;
				console.log("got coords: " + coords);
				document.getElementById("submitReport").disabled = false;
				hideSpinner();
			};
			var onError = function (error) {
				isRequestingLocation = false;
				console.log("error code: " + error.code);
				console.log("error message: " + error.message);
				hideSpinner();
				navigator.notification.confirm(
					"Would you like to retry?",
					onConfirm,
					"Failure Requesting Location",
					["Retry", "Cancel"]
				);
				
				function onConfirm(index) {
					if (index == 1) {
						requestLocation();
					}
				}
			};

			console.log("requesting location");
			navigator.geolocation.getCurrentPosition(onSuccess, onError, { timeout: 8000 });
		}
		
	} else {
		if (isDeviceReady) {
			navigator.notification.alert(
				"Connect to the internet then click 'Retry' in order to request location.",
				alertDismissed,
				"No Internet Connection",
				"Retry"
			);
			
			function alertDismissed() {
				requestLocation();
			}
		}
	}
}


function onClickSubmit() {
	if (isConnected()) {
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
				"user_hash" : userHash,
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
	} else {
		if (isDeviceReady) {
			navigator.notification.alert(
				"Connect to the internet before submitting a smell report.",
				null,
				"No Internet Connection",
				"Ok"
			);
		}
	}
}


$(document).on("pageshow", "#home", function(){
	requestLocation();
	isSmellReportPage = true;
});
$(document).on("pageshow", "#map", function(){
    console.log("refreshing iframe");
    $('#iframe-map').attr('src', $('#iframe-map').attr('src'));
	$('#submitReport').attr('disabled', 'true');
	isSmellReportPage = false;
});
