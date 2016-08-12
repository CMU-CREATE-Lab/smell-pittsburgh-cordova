

var Constants = {

    // Page Ids
    HOME_PAGE: "home",
    MAP_PAGE: "map",
    SETTINGS_PAGE: "settings",
	
	// Local Storage keys
	USER_HASH_KEY: "user_hash",
	NOTIFICATION_ENABLED_KEY: "notification",
	SMELL_NOTIFICATION_ENABLED_KEY: "smell_notification",
	SMELL_MAX_KEY: "smell_max",
	SMELL_MIN_KEY: "smell_min",
	ACHD_ENABLED_KEY: "achd_enabled",
	EMAIL_KEY: "email",
    STARTUP_KEY: "startup",
	
	// Topic strings
	GLOBAL_TOPIC: "GlobalTopic",
	// must append the number for it to work
	// ex. SmellReport-5
	SMELL_REPORT_TOPIC: "SmellReport-",

    // Integer Constants
	MAX_SMELL_NOTIFICATION: 5,
    MIN_SMELL_NOTIFICATION: 1,
	
	AuthorizationEnum: {
		NOT_REQUESTED: "not requested",
		GRANTED: "granted",
		DENIED: "denied"
	},
	
	AccuracyEnum: {
		ENABLED: "enabled",
		DISABLED: "disabled"
	}
	
}