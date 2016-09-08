

// Internet


function isConnected() {
  var result = false;

  if (navigator.connection.type != Connection.NONE) {
    result = true;
  }

  return result;
}


// Spinner


function showSpinner() {
  SpinnerPlugin.activityStart("Requesting Location\nPlease Wait...", {dimBackground: true});
}


function hideSpinner() {
  SpinnerPlugin.activityStop(null, null);
}


// Firebase helpers


function subscribeToSmell(value) {
  FCMPlugin.subscribeToTopic(Constants.SMELL_REPORT_TOPIC + value);
  console.log("subcribed to: " + Constants.SMELL_REPORT_TOPIC + value);
}


function unsubscribeToSmell(value) {
  FCMPlugin.unsubscribeFromTopic(Constants.SMELL_REPORT_TOPIC + value);
  console.log("unsubcribed from: SmellReport-" + value);
}


function clearSmellNotifications() {
  for (var i = 1; i <= 5; i++) {
    FCMPlugin.unsubscribeFromTopic(Constants.SMELL_REPORT_TOPIC + i);
    console.log("unsubcribed from: SmellReport-" + i);
  }
}


function initializeFCM() {
  console.log("onInitializeFCM");
  FCMPlugin.getToken(
    // success
    function (token) {
      // empty for now
    },
    // error
    function (error) {
      // empty for now
    }
  );
  FCMPlugin.onNotification(
    // callback
    function (data) {
      if (data.wasTapped) {
        //Notification was received on device tray and tapped by the user. 
      } else {
        //Notification was received in foreground. Maybe the user needs to be notified.
      }
    },
    // success
    function (message) {
    // empty for now
    },
    // error
    function (error) {
    // empty for now
    }
  );
}


// App-wide Callbacks


// when keyboard appears, we want to scroll the focused textfield into view
function onKeyboardShowInHomePage(keyboardHeight) {
  App.textfieldToScrollAfterKeyboard.scrollIntoView();
}


/*
 * Okay, rant time.
 * Due to delay issues with handling clicks in iOS, the FastClick library was
 * included in the project and attached to HTML onLoad. However, this inotrudced
 * a new problem within iOS: clicks on checkboxradio widgets would first have to
 * focus the widget, then the desired click action would fire after a second
 * click. Luckily, FastClick implements the "needsclick" class, which tells
 * FastClick to revert to the default clicking action.
 *
 * Sigh... thanks for listening.
 */
function disableUnwantedFastClickElements() {
  // Home
  $(".radio-smell").addClass("needsclick");
  // Settings
  $("#checkbox_smell_notifications").addClass("needsclick");
  $(".checkbox-smell-subscribe").addClass("needsclick");
}
