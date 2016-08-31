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


// when keyboard appears, we want to scroll all text fields into view
function onKeyboardShowInHomePage(keyboardHeight) {
  console.log("native.keyboardshow");
  $("#textfield_feelings_symptoms")[0].scrollIntoView();
}
