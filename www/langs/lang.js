//handles language selection and hold language text
/*currently always returns english
 * in the future the parameter will determin the language returned
 */
function getText(language){
	return english;
}


//The object keys are the names of the html element they correspond to. This is just to help show how  they line up. 
//Changing these will not change the element but it will break things
var constants={
	defaultPanel:{
		li1:"Settings",
		li2:"About",
		li3:"How It Works",
		a:"Close"
	},
	defaultHeader:{
		h1:"Smell PGH",
		a:"Settings"
	},
	defaultFooter:{
		li1:"Smell Report",
		li2:"Map",
	}
}
var english={
	home:{
		firstModal:{
			a1:"Close",
			h1:"Submitting Smell Reports",
			li1:"Rate the odor on a scale of 1-5",
			li2:"Describe the smell, source of odor and any symptoms (recommended",
			li3:"Write a personal note to the health department (optional)",
			li4:"Endorse your reports - see Settings (recommended)",
			a2:"OK",
		},
		perditionModal:{
			a1:"Close",
			h1:"Smell Event Predictions",
			p:"We are currently testing a smell prediction model that can alert Pittsburgh residents about a potential smell event in the area. The predictions' accuracy should improve as we receive more smell reports to verify our algorithm. We hope these notifications are useful to you!",
			a2:"OK",
		},
		panel:constants.defaultPanel,
		header:constants.defaultHeader,
		rating:{
			h3:"How does your air smell right now?",
			input1:" 1 Just fine!",
			input2:" 2 Barely noticeable",
			input3:" 3 Definitely noticeable",
			input4:" 4 It's getting pretty bad",
			input5:" 5 About as bad as it gets!"
		},
		describe:{
			label:"Describe the smell or source of odor",
			placeholder:"e.g. industrial, woodsmoke, rotten-eggs"
		},
		symptoms:{
			label:"Any symptoms linked to the odor?",
			placeholder:"e.g. headache, sore throat, eye irritation",
		},
		note:{
			lable:"Add a personal note to the health department",
			placeholder:"e.g. if you submit more than one report in the same day",
		},
		custom:{
			label1:"Report Current Time/Location",
			label2:"Uncheck this box to manually select a time and location for the smell report.",
			label3:"Report Location",
			button:"Current Location (default)",
			label4:"Report Time",
			option:"Now"
		},
		disclaimer:"NOTE: Please only enter information that you are comfortable with sharing anonymously on the public Smell PGH map.",
		button:"Send Smell Report",
		footer:constants.defaultFooter
	},
	map:{
		modal:{
			a1:"Close",
			h1:"Using The Map",
			li1:"This map shows smell reports from all across Pittsburgh",
			li2:"We offset smell report locations to protect your privacy",
			li3:"Scroll through the timeline to view reports from any day",
			li4:"Dates highlighted with a darker color indicate avg. rating of smell reports",
			li5:"Click on a smell report or monitoring station to view more details",
			a2:"OK"
		},
		panel:constants.defaultPanel,
		header:constants.defaultHeader,
		p_iframe:"Your browser does not support iframes.",
		footer:constants.defaultFooter
	},
	settings:{
		panel:constants.defaultPanel,
		header:{
			h1:"Settings",
			a:constants.defaultHeader.a
		},
		contact:{
			h3:"Contact Information",
			label:"While these fields are optional, signing your name in reports to the health department can improve authenticity and effectiveness.",
			placeholder1:"name (recommended)",
			placeholder2:"email (recommended)",
			placeholder3:"mailing address",
			placeholder4:"phone number"
		},
		notification:{
			h3:"Notifications",
			label1:"Activate smell and air quality notifications that are important to you",
			label2:"Smell Event Alerts",
			label3:"(notifications about a potential smell event in the next 4-8 hours)",
			label4:"Air Quality Index Changes",
			label5:"(notifications about pgh air quality conditions)"
		},
		footer:constants.defaultFooter
	},
	startup:{
		header:constants.defaultHeader,
		h3:"Welcome to Smell PGH!",
		p1:"Thank you for installing the Smell PGH App!",
		p2:"This app is created by the CMU CREATE Lab and is designed to track pollution odors across the Pittsburgh region. If you detect a foul odor while you're outside, please report it through this app.",
		p3:"All Smell PGH reports from Pittsburgh are made available to the local health department.",
		footer:"Done"
	},
	about:{
		panel:constants.defaultPanel,
		header:{
			h1:"About",
			a:constants.defaultHeader.a
		},
		h3:"About Smell PGH",
		link:{
			p:"Official Website",
			url_notDisplayed:"http://smellpgh.org/"
		},
		p1:"Pittsburgh was named one of the top 15 most livable cities in the US, but our air quality is often worse than other cities on that list. Foul odors outside are typically symptoms of a serious pollution problem in our region. We, our children, our friends and families all breathe in this air. If our air smells toxic, then we are likely inhaling toxins.",
		p2:"Smell PGH was designed to crowdsource smell reports so we can track how pollutants travel through our air across Pittsburgh. All odor complaints submitted through the app are publicly available through our website, and made available to the local health department so it can better monitor and act on these complaints.",
		center:"-- Smell -- Submit -- Share --",
		p3:"Smell PGH was developed by the CMU CREATE Lab with support from the Heinz Endowments, and in collaboration with:",
		li1:"ACCAN",
		li2:"PennEnvironment",
		li3:"GASP",
		li4:"Sierra Club",
		li5:"ROCIS",
		li6:"Blue Lens, LLC",
		li7:"PennFuture",
		li8:"Clean Water Action",
		li9:"Clean Air Council",
		version:"version: ###",
		footer:constants.defaultFooter
	},
	howitworks:{
		panel:constants.defaultPanel,
		header:{
			h1:"How It Works",
			a:constants.defaultHeader.a
		},
		h3:"How It Works",
		p1:"We take every precaution to protect any personally identifiable data. All information shown on the public map visualization for Smell PGH is anonymous and location data is skewed to protect your privacy. Personal contact information you enter in the settings tab is only made available to the local health department. Our backend database only contains anonymous User ID's created by your app service (Apple or Google Play).",
		p2:"The basic function of the Smell PGH app is as follows:",
		li1:"When you experience a pollution odor outdoors, you launch the app and pick a rating for the smell you experience (from 1 through 5)",
		li2:"Adding a description of the smell (e.g. \"Industrial\", \"Woodsmoke\", etc.) is highly encouraged, since this can help the county isolate the source",
		li3:"You also have the option to (but are not required to):",
		li4:"List any symptoms attributable to the experience",
		li5:"Send a personal note/question to the local health department",
		li6:"NOTE: Please only enter information that you are comfortable with sharing anonymously on the public Smell PGH map",
		li7:"Once you hit 'Submit', the information you report is pulled together in an email format that includes:",
		li8:"The location of the smell (based on the GPS location of your phone)",
		li9:"Date and Time of smell",
		li10:"Rating and description (if provided) of smell",
		li11:"Any personal notes and/or questions (if provided)",
		li12:"This information is then made available to the local health department",
		li13:"At the same time your smell report is added to the public Smell PGH map",
		li14:"A triangle icon that's the color of your smell rating represents your report",
		li15:"Your location is obscured on the map by slightly shifting the coordinates to protect your privacy",
		li16:"Tapping your smell report icon will show the details of your report, including the: date, time, rating, description (if provided) and symptoms (if provided)",
		li17:"NO personally identifiable information is shown on the map",
		footer:constants.defaultFooter
	}
}
//~~~~