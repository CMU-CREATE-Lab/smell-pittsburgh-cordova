
/* USERHASH STORAGE */

var USER_HASH_KEY = "user_hash";

// I use a function here because we want the user hash to be generated
// on a smell report submission, not on startup of the app.
function generateUserHash() {
	
	var userHash;
    var storage = window.localStorage;
	
	userHash = storage.getItem(USER_HASH_KEY);
	if (userHash === null) {
		var random = Math.floor(Math.random()*9007199254740991);
		var date = new Date();
		var epoch = ((date.getTime()-date.getMilliseconds())/1000);
		var input = "" + random + " " + epoch;
		userHash = md5(input);
		storage.setItem(USER_HASH_KEY, userHash);
	}

    return userHash;
}