

var LocalStorage = {

    isStartupDone: false,
	
	isNotification: true,
	
	isSmellNotification: false,
	smells: new Array(),
	
	isACHD: true,
	email: null,
	name: null,
    phone: null,
	
	initialize: function () {
	    var temp = window.localStorage.getItem(Constants.STARTUP_KEY);
	    if (temp == null) {
	        temp = false;
	        window.localStorage.setItem(Constants.STARTUP_KEY, false);
	    }
	    if (temp == "false") temp = false;
	    if (temp == "true") temp = true;
	    this.isStartupDone = Boolean(temp);

		temp = window.localStorage.getItem(Constants.NOTIFICATION_ENABLED_KEY);
		if (temp == null) {
			temp = true;
			window.localStorage.setItem(Constants.NOTIFICATION_ENABLED_KEY, true);
		}
		if (temp == "false") temp = false;
		if (temp == "true") temp = true;
		this.isNotification = Boolean(temp);
		
		temp = window.localStorage.getItem(Constants.SMELL_NOTIFICATION_ENABLED_KEY);
		if (temp == null) {
			temp = true;
			window.localStorage.setItem(Constants.SMELL_NOTIFICATION_ENABLED_KEY, true);
		}
		if (temp == "false") temp = false;
		if (temp == "true") temp = true;
		this.isSmellNotification = Boolean(temp);

		temp = JSON.parse(window.localStorage.getItem(Constants.SMELLS_KEY));
		if (temp == null) {
		    temp = new Array();
		    for (var i = 1; i < 4; i++) {
		        temp[i] = false;
		    }
		    temp[4] = true;
		    temp[5] = true;
		}
		this.smells = temp;
		
		temp = window.localStorage.getItem(Constants.ACHD_ENABLED_KEY);
		this.email = window.localStorage.getItem(Constants.EMAIL_KEY);
		this.name = window.localStorage.getItem(Constants.NAME_KEY);
		this.phone = window.localStorage.getItem(Constants.PHONE_KEY);
		if (temp == null) {
			temp = true;
			window.localStorage.setItem(Constants.ACHD_ENABLED_KEY, true);
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
	
    /* NOTIFICATION STORAGE */

	setIsStartUpDone: function(val) {
	    this.isStartupDone = val;
	    window.localStorage.setItem(Constants.STARTUP_KEY, val);
	},
	
	setIsNotification: function(val) {
		this.isNotification = val;
		window.localStorage.setItem(Constants.NOTIFICATION_ENABLED_KEY, val);
	},

	setIsSmellNotification: function(val) {
		this.isSmellNotification = val;
		window.localStorage.setItem(Constants.SMELL_NOTIFICATION_ENABLED_KEY, val);
	},

	setSmells: function(val) {
	    this.smells = val;
	    window.localStorage.setItem(Constants.SMELLS_KEY, JSON.stringify(val));
	},
	
	/* ACHD STORAGE */
	
	setIsACHD: function(val) {
		this.isACHD = val;
		window.localStorage.setItem(Constants.ACHD_ENABLED_KEY, val);
	},
	
	setEmail: function(string) {
		this.email = string;
		window.localStorage.setItem(Constants.EMAIL_KEY, string);
	},

	setName: function (string) {
	    this.name = string;
	    window.localStorage.setItem(Constants.NAME_KEY, string);
	},

	setPhone: function (string) {
	    this.phone = string;
	    window.localStorage.setItem(Constants.PHONE_KEY, string);
	}
	
}

LocalStorage.initialize();