
var coords;
var isRequestingLocation = false;
var isDeniedAccuracy = false;
var isZipcode;
var zipcode;


function onToggleZipcode() {
	if (isZipcode) {
		FCMPlugin.unsubscribeFromTopic(zipcode);
		setIsZipcode(false);
		setZipcode(null);
		console.log("zipcode enabled: " + isZipcode);
		console.log("zipcode: " + zipcode);
	} else {
		isZipcode = true;
		window.localStorage.setItem(ZIPCODE_ENABLED_KEY, isZipcode);
		window.plugins.numberDialog.promptClear("Enter a zipcode", function(result) {
			if (result.buttonIndex == 1 && result.input1 != "") {
				setZipcode(result.input1);
				FCMPlugin.subscribeToTopic(zipcode);
			} else {
				setIsZipcode(false);
				setZipcode(null);
				$('#zipcodeInput').prop('checked', isZipcode).checkboxradio('refresh');
			}
		},
		"Notifications", ["Ok", "Cancel"]);
		console.log("zipcode enabled: " + isZipcode);
		console.log("zipcode: " + zipcode);
	}


function onToggleACHD() {
	
}


function requestLocation() {
	if (isDeviceReady && isConnected()) {
		console.log("trying to request location");
		if (!isRequestingLocation) {
			console.log("requesting location");
			isRequestingLocation = true;
			showSpinner();
			
			// This block of code uses html5 location services
			// which makes this compatible with pretty much everthing.
			// Plugin: cordova-plugin-geolocation
			var onSuccess = function(position) {
				isRequestingLocation = false;
				coords = position.coords;
				console.log("got coords: " + coords.latitude + ", " + coords.longitude);
				document.getElementById("submitReport").disabled = false;
				hideSpinner();
				navigator.geolocation.clearWatch(watchId);

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
			
			var platform = device.platform;
			var watchId;
			if (platform === "Android") {
				console.log("Platform: " + platform);
				// change settings if we need to
				cordova.plugins.locationAccuracy.request(function(success) {
					isDeniedAccuracy = false;
					showSpinner();
					watchId = navigator.geolocation.watchPosition(onSuccess, onError, { maximumAge: 3000, timeout: 60000 });
				}, function(error) {
					isDeniedAccuracy = true;
					console.log("error code: " + error.code + "\nerror message: " + error.message);
					navigator.notification.confirm(
						"The app may not function as expected without the appropiate location settings enabled.",
						function() {
							showSpinner();
							watchId = navigator.geolocation.watchPosition(onSuccess, onError, { maximumAge: 3000, timeout: 60000 });
						},
						"Failure Changing Location Settings",
						["Ok"]
					);
				}, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
			} else {
				console.log("Platform: " + platform);
				// change settings if we need to
				cordova.plugins.locationAccuracy.request(function(success) {
					isDeniedAccuracy = false;
					showSpinner();
					navigator.geolocation.getCurrentPosition(onSuccess, onError, { maximumAge: 3000, timeout: 60000 });
				}, function(error) {
					isDeniedAccuracy = true;
					navigator.notification.confirm(
						"The app may not function as expected without the appropiate location settings enabled.",
						function() {
							showSpinner();
							watchId = navigator.geolocation.watchPosition(onSuccess, onError, { maximumAge: 3000, timeout: 60000 });
						},
						"Failure Changing Location Settings",
						["Ok"]
					);
				});
			}
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

$(document).on("pagecontainershow", function(someEvent, ui) {
	var pageId = $.mobile.pageContainer.pagecontainer("getActivePage")[0].id;
	
	switch (pageId) {
		case "map":
			console.log("refreshing iframe");
			$('#iframe-map').attr('src', $('#iframe-map').attr('src'));
			break;
		case "settings":
			$('#zipcodeInput').prop('checked', isZipcode).checkboxradio('refresh');
			break;
	}
});








