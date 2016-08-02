
function isConnected() {
	var result = false;
	
	if (navigator.connection.type != Connection.NONE) {
		result = true;
	}
	
	return result;
}

function showSpinner() {
	SpinnerPlugin.activityStart("Requesting Location\nPlease Wait...", {dimBackground: true});
}

function hideSpinner() {
	SpinnerPlugin.activityStop(null, null);
}


function onToggleZipcode() {
	if (LocalStorage.isZipcode) {
		FCMPlugin.unsubscribeFromTopic(LocalStorage.zipcode);
		LocalStorage.setIsZipcode(false);
		LocalStorage.setZipcode(null);
	} else {
		window.plugins.numberDialog.promptClear("Enter a zipcode", function(result) {
			if (result.buttonIndex == 1 && result.input1 != "") {
				LocalStorage.setIsZipcode(true);
				LocalStorage.setZipcode(result.input1);
				FCMPlugin.subscribeToTopic(LocalStorage.zipcode);
			} else {
				LocalStorage.setIsZipcode(false);
				LocalStorage.setZipcode(null);
				$('#zipcodeCheckbox').prop('checked', LocalStorage.isZipcode).checkboxradio('refresh');
			}
		},
		"Notifications", ["Ok", "Cancel"]);
	}
}


function onToggleACHD() {
	if (LocalStorage.isACHD) {
		LocalStorage.setIsACHD(false);
		$("#textfield_email").textinput("disable");
		LocalStorage.setEmail(null);
	} else {
		var email = "";
		LocalStorage.setIsACHD(true);
		$("#textfield_email").textinput("enable");
		LocalStorage.setEmail(email);
	}
}


function onClickSubmit() {
	var coords = Location.coords;
	if (isConnected()) {
		// get input values
		var latitude = (coords != null) ? coords.latitude : 0;
		var longitude = (coords != null) ? coords.longitude : 0;
		var horizontalAccuracy = (coords != null) ? coords.accuracy : null;
		var altitudeAccuracy = (coords != null) ? coords.altitudeAccuracy : null;
		var smell_value = $("#slider_smell_value")[0].value;
		var smell_description = $("#textfield_smell_description")[0].value;
		var feelings_symptoms = $("#textfield_feelings_symptoms")[0].value;
		var submitACHD = $("#achdCheckbox").prop("checked");
		var email = $("#textfield_email")[0].value;
		// userHash
		var userHash = LocalStorage.generateUserHash();
		
		var data = {
			"user_hash" : userHash,
			"latitude" : latitude,
			"longitude" : longitude,
			"smell_value" : smell_value,
			"smell_description" : smell_description,
			"feelings_symptoms" : feelings_symptoms
		};
		
		if (horizontalAccuracy != null) data["horizontal_accuracy"] =  horizontalAccuracy;
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
			success: function(data) {
				console.log("success!");
				console.log(data);
				$.mobile.changePage($("#map"), {changeHash:false, transition: "none"});
				for (var key in data) {
					if (data.hasOwnProperty(key)) {
						console.log(key + "-> " + data[key]);
					}
				}
			},
			error: function(msg) {
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
}


$(document).on("pagecontainershow", function(someEvent, ui){
	console.log("onPageContainerShow");
	var pageId = $.mobile.pageContainer.pagecontainer("getActivePage")[0].id;
	
	switch (pageId) {
		case "map":
			console.log("refreshing iframe");
			$('#iframe-map').attr('src', $('#iframe-map').attr('src'));
			break;
		case "settings":
			$("#zipcodeCheckbox").prop("checked", LocalStorage.isZipcode).checkboxradio("refresh");
			$("#achdCheckbox").prop("checked", LocalStorage.isACHD).checkboxradio("refresh");
			if (LocalStorage.isACHD) $("#textfield_email").textinput("enable");
			else $("#textfield_email").textinput("disable");
			
			$( "#notificationsCollapsible" ).collapsible({
			  collapsed: false
			});
			$( "#reportsCollapsible" ).collapsible({
			  collapsed: false
			});
			break;
	}
});


