
var smellValue = 1;

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


function onToggleNotifications() {
	if (LocalStorage.isNotification) {
		// make sure to update all of the local storage elements
		LocalStorage.setIsNotification(false);
		LocalStorage.setIsSmellNotification(false);
		$("#checkbox_smell_notifications").prop("checked", LocalStorage.isSmellNotification).checkboxradio("refresh");
		$("#checkbox_smell_notifications").checkboxradio("disable");
		$("#slider_smell_notification").slider("disable");
		
		// make sure to unsubscribe from all possible notifications
		clearSmellNotifications();
		FCMPlugin.unsubscribeFromTopic(Constants.GLOBAL_TOPIC);
		console.log("unsubcribed from: " + Constants.GLOBAL_TOPIC);
	} else {
		$("#checkbox_smell_notifications").checkboxradio("enable");
		LocalStorage.setIsNotification(true);
		FCMPlugin.subscribeToTopic(Constants.GLOBAL_TOPIC);
		console.log("subcribed to: " + Constants.GLOBAL_TOPIC);
		
	}
}


function onToggleSmellNotifications() {
	if (LocalStorage.isSmellNotification) {
		$("#slider_smell_notification").slider("disable");
		LocalStorage.setIsSmellNotification(false);
		LocalStorage.setSmellMax(null);
		LocalStorage.setSmellMin(null);
		clearSmellNotifications();
	} else {
		$("#slider_smell_notification").slider("enable");
		LocalStorage.setIsSmellNotification(true);
		var max = 5;
		var min = $("#slider_smell_notification")[0].value;
		LocalStorage.setSmellMax(max);
		LocalStorage.setSmellMin(min);
		
		for (var i = max; i >= min; i--) {
			FCMPlugin.subscribeToTopic(Constants.SMELL_REPORT_TOPIC + i);
			console.log("subscribed to: SmellReport-" + i);
		}
	}
}


function clearSmellNotifications() {
	for (var i = 1; i <= 5; i++) {
		FCMPlugin.unsubscribeFromTopic(Constants.SMELL_REPORT_TOPIC + i);
		console.log("unsubcribed from: SmellReport-" + i);
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
		var smell_value = smellValue;
		var smell_description = $("#textfield_smell_description")[0].value;
		var feelings_symptoms = $("#textfield_feelings_symptoms")[0].value;
		var submitACHD = true;
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


function onClickSmell(item) {
	$('.remove-active').removeClass('ui-btn-active');
	$("#smell_value_" + item.value).addClass('ui-btn-active');
	smellValue = item.value;
}


$(document).bind("pagecreate", function(event, ui) {
	
	// TODO - on change maybe?
	$("#slider_smell_notification").on("change", function(event) {
		this.value = 5-this.value+1;
		$("#p_slider_info").text("receive notifications of smell reports " + $("#slider_smell_notification").val() + " or higher");
	});
	
	$("#slider_smell_notification").on("slidestop", function(event) {
		var max = 5;
		var min = $("#slider_smell_notification")[0].value;
		LocalStorage.setSmellMax(max);
		LocalStorage.setSmellMin(min);
		
		clearSmellNotifications();
		for (var i = max; i >= min; i--) {
			FCMPlugin.subscribeToTopic(Constants.SMELL_REPORT_TOPIC + i);
			console.log("subscribed to: SmellReport-" + i);
		}
	});
	
	$("#textfield_email").bind("change", function(event, ui) {
		LocalStorage.setEmail(this.value);
	});
});


$(document).on("pagecontainershow", function(someEvent, ui){
	console.log("onPageContainerShow");
	var pageId = $.mobile.pageContainer.pagecontainer("getActivePage")[0].id;
	
	switch (pageId) {
		case "map":
			console.log("refreshing iframe");
			$('#iframe-map').attr('src', $('#iframe-map').attr('src'));
			break;
		case "settings":
		
			// global notification
			$("#checkbox_notifications").prop("checked", LocalStorage.isNotification).checkboxradio("refresh");
			if (LocalStorage.isNotification) $("#checkbox_smell_notifications").checkboxradio("enable");
			else $("#checkbox_smell_notifications").checkboxradio("disable");
			
			// smell notification
			$("#checkbox_smell_notifications").prop("checked", LocalStorage.isSmellNotification).checkboxradio("refresh");
			if (LocalStorage.smellMin != null){
				$("#slider_smell_notification").val(5-LocalStorage.smellMin+1).slider("refresh");
				$("#slider_smell_notification").val(LocalStorage.smellMin);
			}
			else{
				$("#slider_smell_notification").val(2).slider("refresh");
				$("#slider_smell_notification").val(4);
			}
			$("#p_slider_info").text("receive notifications of smell reports " + $("#slider_smell_notification").val() + " or higher");
			
			if (LocalStorage.isSmellNotification) $("#slider_smell_notification").slider("enable");
			else $("#slider_smell_notification").slider("disable");
			
			$("#textfield_email").prop("value", LocalStorage.email);

			$( "#notificationsCollapsible" ).collapsible({
			  collapsed: false
			});
			$( "#reportsCollapsible" ).collapsible({
			  collapsed: false
			});
			break;
	}
});


