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
