

var LocalStorage = {
	
	isZipcode: false,
	zipcode: null,
	isACHD: false,
	email: null,
	
	initialize: function() {
		var temp = window.localStorage.getItem(Constants.ZIPCODE_ENABLED_KEY);
		this.zipcode = window.localStorage.getItem(Constants.ZIPCODE_KEY);
		if (temp == null) {
			temp = false;
			window.localStorage.setItem(Constants.ZIPCODE_ENABLED_KEY, false);
		}
		if (temp == "false") temp = false;
		if (temp == "true") temp = true;
		this.isZipcode = Boolean(temp);
		
		temp = window.localStorage.getItem(Constants.ACHD_ENABLED_KEY);
		this.email = window.localStorage.getItem(Constants.EMAIL_KEY);
		if (temp == null) {
			temp = false;
			window.localStorage.setItem(Constants.ACHD_ENABLED_KEY, false);
		}
		if (temp == "false") temp = false;
		if (temp == "true") temp = true;
		this.isACHD = Boolean(temp);
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
		window.localStorage.setItem(Constants.ZIPCODE_ENABLED_KEY, val);
	},
	
	
	setZipcode: function(zip) {
		this.zipcode = zip;
		window.localStorage.setItem(Constants.ZIPCODE_KEY, zip);
	},
	
	/* ACHD STORAGE */
	
	setIsACHD: function(val) {
		this.isACHD = val;
		window.localStorage.setItem(Constants.ACHD_ENABLED_KEY, val);
	},
	
	setEmail: function(string) {
		this.email = string;
		window.localStorage.setItem(Constants.EMAIL_KEY, string);
	}
	
}

LocalStorage.initialize();







