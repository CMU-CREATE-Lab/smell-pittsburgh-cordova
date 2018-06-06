Smell Pittsburgh Cordova App
============================

A client to interface with the [Smell Pittsburgh](https://github.com/CMU-CREATE-Lab/smell-pittsburgh-rails) project (Ruby on Rails) through HTTP requests, and displays the site's smell map visualization using an iframe.

This application was designed using [Cordova](https://cordova.apache.org/). It uses the [jQuery Mobile](https://jquerymobile.com/) Framework for UI elements and browser events.

Keep in mind 'cordova-plugin-request-location-accuracy' and 'cordova-plugin-fcm' do not play nice. I had to change 'cordova-plugin-request-location-accuracy' plugin.xml.
	This line:
		framework src="com.google.android.gms:play-services-location:+"
	to
		framework src="com.google.android.gms:play-services-location:9.2.0"

Currently used library versions (as of app version 2.1.0):
- cordova: `8.0.0`
- cordova platform android: `6.3.0`
- cordova platform ios: `4.5.4`
