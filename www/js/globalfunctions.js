

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
      App.navigateToPage(Constants.HOME_PAGE);
      break;
    case "map":
      pageId = Constants.MAP_PAGE;
      App.navigateToPage(Constants.MAP_PAGE);
      break;
    default:
      pageId = Constants.HOME_PAGE;
  }

  App.initializePage(pageId, App.CallbackType.RESUME);
}


// App-wide Callbacks


// when keyboard appears, we want to scroll the focused textfield into view
function onKeyboardShowInHomePage(keyboardHeight) {
  console.log("keyboard OPEN");
  $(".ui-page, body").addClass("overlay-enabled");
  App.htmlElementToScrollAfterKeyboard.scrollIntoView();
}


function onKeyboardHide(e) {
  console.log("keyboard CLOSE");
  $(".ui-page, body").removeClass("overlay-enabled");
  //$(App.htmlElementToBlurAfterKeyboardCloses).blur();
}


function showModal(modalId) {
  var modal = "#"+modalId;
  console.log("showModal "+modal);
  $(modal).popup({
    afteropen: function() {
      $(".ui-page, body").addClass("overlay-enabled no-scroll");
    },
    afterclose: function() {
      $(".ui-page, body").removeClass("overlay-enabled no-scroll");
    }
  });
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


// text handling


/**Parse int from param and returns the template text object
 * for that language
 * @param {language} int -the index of the language object in Constants.APP_TEXT
 */
function getText(language) {
  if (Constants.APP_TEXT.length > 0) {
    return Constants.APP_TEXT[language];
  } else {
    populateLangs();
    return getText(language);
  }
}


// populates Constants.APP_TEXT
function populateLangs() {
  Constants.APP_TEXT = [];
  Constants.APP_TEXT.push(english);
  //Constants.APP_TEXT.push(espanol);
}
