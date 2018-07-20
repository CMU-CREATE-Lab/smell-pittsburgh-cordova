//The object keys are the names of the html element they correspond to. This is just to help show how  they line up. 
//Changing these will not change the element but it will break things
//!ENGLISH!~~~~~
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
			h1:"Submitting Smell Reports",
			li1:"Rate the odor on a scale of 1-5",
			li2:"Describe the smell, source of odor and any symptoms (recommended",
			li3:"Write a personal note to the health department (optional)",
			li4:"Endorse your reports - see Settings (recommended)",
			a:"OK",
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
			label:"Any symptoms linked to the odor?",
			placeholder:"e.g. industrial, woodsmoke, rotten-eggs"
		},
		symptoms:{
			lable:"Any symptoms linked to the odor?",
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
		
	}
}
//~~~~