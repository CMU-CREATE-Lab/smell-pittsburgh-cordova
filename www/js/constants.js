/**
 * Namespace for all constants in the application.
 * @namespace Constants
 */
var Constants = {

  CLIENT_ID: "2839865f2eeba9e3b441f249b2c217a3",
  LOCATION_SERVICES: true,
  PLATFORM_CALLBACK_ONREADY: true,
  APP_VERSION: "2.2.5",
  URL_API: "https://api.smellpittsburgh.org",
  STAGING: "https://staging.api.smellpittsburgh.org",
  URL_MAP: "https://api.smellpittsburgh.org/visualization",
  
  // Page Ids
  UPDATES_PAGE: "updates",
  STARTUP_PAGE: "startup",
  HOME_PAGE: "home",
  MAP_PAGE: "map",
  SETTINGS_PAGE: "settings",
  ABOUT_PAGE: "about",
  LOCATION_SELECT_PAGE: "locationselect",
  HOW_IT_WORKS_PAGE: "howitworks",
  MAP_ERROR_PAGE: "maperror",
  
  // Local Storage keys
  USER_HASH_KEY: "user_hash",
  NOTIFICATION_ENABLED_KEY: "notification",
  SMELL_NOTIFICATION_ENABLED_KEY: "smell_notification",
  SMELLS_KEY: "smells",
  EMAIL_KEY: "email",
  STARTUP_KEY: "startup",
  NAME_KEY: "name",
  PHONE_KEY: "phone",

  // Topic strings
  GLOBAL_TOPIC: "GlobalTopic",
  PITTSBURGH_AQI_TOPIC: "pghaqi",
  SMELL_REPORT_TOPIC: "SmellReports",

  //Make associated topic on Firebase
  REMINDER_NOTIFICATION_TOPIC: "ReminderNotification",
  // Location services enums
  AuthorizationEnum: {
    NOT_REQUESTED: "not requested",
    GRANTED: "granted",
    DENIED: "denied",
    DENIED_ALWAYS: "denied always",
  },
  AccuracyEnum: {
    ENABLED: "enabled",
    DISABLED: "disabled",
  },

  //languages
  LANGUAGES: ["English","Español"],
  APP_TEXT: [],

  //string with the date for last version of the app that required showing the user the updated features message
  UPDATE_NEEDING_NOTIFICATION_DATE : "2020-01-28T00:00:00.000Z"

}
