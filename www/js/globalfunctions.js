

// Internet


function isConnected() {
  var result = false;

  if (navigator.connection.type != Connection.NONE) {
    result = true;
  }

  return result;
}


// Spinner


function showSpinner(text) {
  SpinnerPlugin.activityStart(text, {dimBackground: true});
}


function hideSpinner() {
  SpinnerPlugin.activityStop(null, null);
}


// Firebase helpers


function openWithPage(pageName, notificationType) {
  console.log("openWithPage");
  var pageId;
  switch (pageName) {
    case "home":
      pageId = Constants.HOME_PAGE;
      if (notificationType == "prediction") {
        HomePage.openedPredictionNotification = true;
      }
      $.mobile.pageContainer.pagecontainer("change", "#home", { changeHash: false, transition: "none" });
      break;
    case "map":
      pageId = Constants.MAP_PAGE;
      $.mobile.pageContainer.pagecontainer("change", "#map", { changeHash: false, transition: "none" });
      break;
    default:
      pageId = Constants.HOME_PAGE;
  }

  App.initializePage(pageId, App.CallbackType.RESUME);
}


function initializeFCM() {
  console.log("onInitializeFCM");
  window.FirebasePlugin.getToken(function(token) {
      console.log("Your firebaseInstanceID is "+token);
    }, function(error) {
      console.error(error);
  });
  window.FirebasePlugin.onNotificationOpen(function(notification) {
      console.log(JSON.stringify(notification));
      if (notification["open_with_page"]) {
        openWithPage(notification["open_with_page"], notification["notification_type"]);
      }
    }, function(error) {
      console.error(error);
  });
}


// App-wide Callbacks


// when keyboard appears, we want to scroll the focused textfield into view
function onKeyboardShowInHomePage(keyboardHeight) {
  App.htmlElementToScrollAfterKeyboard.scrollIntoView();
}


function onKeyboardHide(e) {
  console.log("keyboard CLOSE");
  $(App.htmlElementToBlurAfterKeyboardCloses).blur();
}


function showModal(modalId) {
  var modal = "#"+modalId;
  console.log("showModal "+modal);
  $(modal).popup();
  // delays opening to avoid issues with iOS < 9.3
  setTimeout(function() {
    $(modal).popup("open");
  }, 250);
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
