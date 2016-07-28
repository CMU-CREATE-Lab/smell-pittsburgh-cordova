PinDialog
=========

PhoneGap numeric text/password dialog plugin for Android and iOS. Forked from https://github.com/apache/cordova-plugin-dialogs.git

Fork of https://github.com/Paldom/PinDialog with text/password option

Installation:

```cordova plugin add https://github.com/Paldom/PinDialog.git```
or
```phonegap local plugin add https://github.com/Paldom/PinDialog.git```

Usage:

    // Show pin dialog with password field
    window.plugins.numberDialog.prompt("message", callback, "title", ["OK","Cancel"]);

    // Show pin dialog with text field
    window.plugins.numberDialog.promptClear("message", callback, "title", ["OK","Cancel"]);


Callback:

    function callback(results)
    {
        if(results.buttonIndex == 1)
        {
            // OK clicked, show input value
            alert(results.input1);
        }
        if(results.buttonIndex == 2)
        {
            // Cancel clicked
            alert("Cancel");
        }
    };
