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


function subscribeToSmell(value) {
  FCMPlugin.subscribeToTopic(Constants.SMELL_REPORT_TOPIC + value);
  console.log("subcribed to: " + Constants.SMELL_REPORT_TOPIC + value);
}


function unsubscribeToSmell(value) {
  FCMPlugin.unsubscribeFromTopic(Constants.SMELL_REPORT_TOPIC + value);
  console.log("unsubcribed from: SmellReport-" + value);
}


// when keyboard appears, we want to scroll all text fields into view
function onKeyboardShowInHomePage(keyboardHeight) {
  console.log("native.keyboardshow");
  $("#textfield_feelings_symptoms")[0].scrollIntoView();
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
