

var LocalStorage = {
	
	isZipcode: false,
	zipcode: null,
	
	initialize: function() {
		this.isZipcode = window.localStorage.getItem(Constants.ZIPCODE_ENABLED_KEY);
		this.zipcode = window.localStorage.getItem(Constants.ZIPCODE_KEY);
		
		if (this.isZipcode == null) {
			this.isZipcode = false;
			window.localStorage.setItem(Constants.ZIPCODE_ENABLED_KEY, this.isZipcode);
		}
	},
	
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
	},
	
	/* ZIPCODE STORAGE */	

	setIsZipcode: function(val) {
		this.isZipcode = val;
		window.localStorage.setItem(Constants.ZIPCODE_ENABLED_KEY, this.isZipcode);
	},
	
	
	setZipcode: function(zip) {
		this.zipcode = zip;
		window.localStorage.setItem(Constants.ZIPCODE_KEY, this.zipcode);
	}
	
}

LocalStorage.initialize();







