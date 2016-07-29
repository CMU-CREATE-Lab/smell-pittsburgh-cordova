

var LocalStorage = {
	
	/* USERHASH STORAGE */

	// generate a hash for the user
	generateUserHash: function() {
		
		var userHash;
		var storage = window.localStorage;
		
		userHash = storage.getItem(Constants.USER_HASH_KEY);
		if (userHash === null) {
			var random = Math.floor(Math.random()*9007199254740991);
			var date = new Date();
			var epoch = ((date.getTime()-date.getMilliseconds())/1000);
			var input = "" + random + " " + epoch;
			userHash = md5(input);
			storage.setItem(Constants.USER_HASH_KEY, userHash);
		}

		return userHash;
	}
	
}
