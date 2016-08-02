

var Constants = {
	
	// Local Storage keys
	USER_HASH_KEY: "user_hash",
	NOTIFICATION_ENABLED_KEY: "notification",
	SMELL_NOTIFICATION_ENABLED_KEY: "smell_notification",
	SMELL_MAX_KEY: "smell_max",
	SMELL_MIN_KEY: "smell_min",
	ACHD_ENABLED_KEY: "achd_enabled",
	EMAIL_KEY: "email",
	
	// Topic strings
	GLOBAL_TOPIC: "GlobalTopic",
	// must append the number for it to work
	// ex. SmellReport-5
	SMELL_REPORT_TOPIC: "SmellReport-",
	
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