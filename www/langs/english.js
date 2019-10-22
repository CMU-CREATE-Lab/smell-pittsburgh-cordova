// English text
// The object keys are the names of the html element they correspond to. This is just to help show how  they line up.
// Changing these will not change the element but it will break things
var constants = {
  defaultPanel: {
    li1: "Overview",
    li2: "How It Works",
    li3: "Settings",
    li4: "About Us",
    a: "Close",
  },
  defaultHeader: {
    h1: "Smell PGH",
    a: "More",
  },
  defaultFooter: {
    li1: "Report",
    li2: "Map",
  }
}

var english = {
  defaultCityName: "your city",
  home: {
    firstModal: {
      a1: "Close",
      h1: "To Submit a Smell Report",
      li1: "Rate the odor on a scale of 1-5",
      li2: "Describe the smell or source of odor (recommended)",
      li3: "List any symptoms associated with the odor (optional)",
      li4: "Add any notes relevant to your report (optional)",
      li5: "Hit 'Submit Smell Report'",
      li6: "To endorse your report see Settings (recommended)",
      a2: "OK",
    },
    predictionModal: {
      a1: "Close",
      h1: "Smell Event Predictions",
      p: "We are currently testing a smell prediction model that can alert Pittsburgh residents about a potential smell event in the area. The predictions' accuracy should improve as we receive more smell reports to verify our algorithm. We hope these notifications are useful to you!",
      a2: "OK",
    },
    panel: constants.defaultPanel,
    header: constants.defaultHeader,
    rating: {
      h3: "How does your air smell right now?",
      input1: " 1 Just fine!",
      input2: " 2 Barely noticeable",
      input3: " 3 Definitely noticeable",
      input4: " 4 It's getting pretty bad",
      input5: " 5 About as bad as it gets!",
    },
    describe: {
      label: "Describe the smell: ",
      span: "(recommended)",
      placeholder: "e.g. industrial, woodsmoke, rotten-eggs",
    },
    symptoms: {
      label: "List symptoms linked to odor: ",
      span: "(optional)",
      placeholder: "e.g. headache, sore throat, eye irritation",
    },
    note: {
      label: "Additional notes or comments: ",
      span: "(optional)",
      placeholder: "e.g. if you submit more than one report in the same day",
    },
    custom: {
      label1: "Report Current Time/Location",
      label2: "Uncheck this box to manually select a time and location for the smell report.",
      label3: "Report Location",
      button: "Current Location (default)",
      label4: "Report Time",
      option: "Now",
    },
    disclaimer: "NOTE: Please only enter information that you are comfortable with sharing anonymously on the public Smell MyCity map.",
    regulatoryAgencyNote: "All smell reports within <span class='regulatory-region-name'></span> will be forwarded to the <span class='regulatory-agency-name'></span>. If you'd like to receive correspondence from them, enter your contact info in the settings tab.",
    button: "Submit Smell Report",
    footer: constants.defaultFooter
  },
  map: {
    modal: {
      a1: "Close",
      h1: "Using The Map",
      li1: "This map shows smell reports from all across Pittsburgh",
      li2: "Tap on a smell report (triangle) or monitoring station (circle) to view more details",
      li3: "We offset smell report locations to protect your privacy",
      li4: "Scroll through the timeline at the bottom to view reports from any day",
      li5: "Darker shades indicate a higher volume of pollution odor reports",
      a2: "OK",
    },
    newCity: {
      h3: "Welcome to <span class='your-city'>your city</span>",
      p: "current AQI is: <span class='aqi'>unknown</span>",
    },
    panel: constants.defaultPanel,
    header: constants.defaultHeader,
    iframeWarning: "Your device does not support iframes.",
    footer: constants.defaultFooter,
  },
  settings: {
    panel: constants.defaultPanel,
    header: {
      h1: "Settings",
      a: constants.defaultHeader.a,
    },
    contact: {
      h3: "Contact Information",
      label: "While these fields are optional, signing your name in reports to the health department can improve authenticity and effectiveness.",
      regulatoryAgencyNote: "All smell reports within Allegheny Country will be forwarded to the <a href='https://www.alleghenycounty.us/Health-Department/Contact.aspx' target='_blank' class='regulatory-agency-website'>Allegheny County Health Department</a>.",
      placeholder1: "name (recommended)",
      placeholder2: "email (recommended)",
      placeholder3: "mailing address (optional)",
      placeholder4: "phone number (optional)",
    },
    notification: {
      h3: "Notifications",
      label1: "Activate smell and air quality notifications that are important to you",
      label2: "Smell Event Alerts",
      label3: "(notifications about a potential smell event in the next 4-8 hours)",
      label4: "Air Quality Index Changes",
      label5: "(notifications about pgh air quality conditions)", //???
    },
    lang: {
      h3: "Language",
      label: "Select your prefered language",
      l0: Constants.LANGUAGES[0],
      l1: Constants.LANGUAGES[1],
    },
    footer: constants.defaultFooter,
  },
  startup: {
    header: constants.defaultHeader,
    h3: "Welcome to Smell PGH!",
    p1: "Thank you for installing the Smell PGH App!",
    p2: "This app is designed to track pollution odors across the Pittsburgh region. If you detect a foul odor while you're outside, please report it through this app.",
    p3: "Smell PGH will automatically submit these reports to the Allegheny County Health Department (ACHD) so they can take action.",
    footer: "Continue",
    lang: {
      h3: "Language",
      label: "Select your prefered language",
      l0: Constants.LANGUAGES[0],
      l1: Constants.LANGUAGES[1],
    },
  },
  //Contains only text for HTML objects, use updates.js to change footer link locaitons
  updates: {
    header: constants.defaultHeader,
    h3: "New Update For Smell My City!",
    p1: "We’ve added notifications to this app! See Settings for more details.",
    footer: {
              li1: "See new features",
              li2: "Ok",}
  },
  overview: {
    panel: constants.defaultPanel,
    header: {
      h1: "App Overview",
      a: constants.defaultHeader.a,
    },
    h2_1: "What is Smell MyCity?",
    p1: "Smell MyCity is a smartphone app designed to crowdsource reports of pollution odors travelling through our cities. All smell reports submitted through the app are visible on our map, and this information is publicly available through our website (smellmycity.org). Local residents, organizations and regulators can use smell report data to help track down potential sources of pollution in their neighborhood.",
    h2_2: "Why Focus on Smells?",
    p2: "Air quality is usually invisible to us; however, air pollution can have very real, long term impacts on our health and quality of life. Foul odors outside are typically symptoms of a serious pollution problem in our region. We, our children, our friends and families all breathe in this air. If our air smells toxic, then we are likely inhaling toxins.",
    h2_3: "Who Can Use Smell MyCity?",
    p3: "Anyone in the U.S. can submit a smell report through Smell MyCity! This app was designed for a national audience. Any community can use the Smell MyCity app to collectively document pollution odors in their neighborhood, and use that data to advocate for better air quality. We have worked closely with community partners in a few cities to connect smell report data from those locations to relevant local regulatory agencies. If you are interested in partnering with us to connect your community's data to local regulators, please contact us at: info@smellmycity.org",
    h2_4: "Where Was Smell MyCity Developed?",
    p4: "Smell MyCity was developed by the <a href='https://cmucreatelab.org' target='_blank'>CMU CREATE Lab</a>, as an extension of their Smell Pittsburgh (<a href='https://smellpgh.org' target='_blank'>Smell PGH</a>) app, which was deployed in 2016. Smell PGH has activated local residents, and provided the local health department with a higher resolution of pollution data to help track down potential sources. Given the successful implementation of this smell reporting app in Pittsburgh, the CREATE Lab developed the Smell MyCity app to bring this technology to residents across the U.S. Smell MyCity will be first piloted in Louisville, KY and Portland, OR, in collaboration with local advocacy and community groups.",
    p5: "Smell MyCity was developed with support from <a href='http://www.heinz.org/' target='_blank'>The Heinz Endowments</a>, which works toward building a Pittsburgh region that thrives as a whole and just community. The launch of Smell MyCity into cities across the U.S. is powered by <a href='https://www.seventhgeneration.com/insideSVG/mission' target='_blank'>Seventh Generation</a>, which is committed to <a href='https://www.seventhgeneration.com/action/climate-justice-equity' target='_blank'>Climate Justice & Equity</a> for the next seven generations and beyond. Thanks to these contributions, the Smell MyCity app will be made available to residents across the country, so that we all have an opportunity to join a larger, nationwide community of citizens actively documenting the human impacts of air pollution.",
    h2_5: "Smell MyCity Data",
    p6: "Anyone can access Smell MyCity data from our website: <a href='https://smellmycity.org' target='_blank'>smellmycity.org</a>.",
    p7: "We take every precaution to protect any personally identifiable data. All information shown on the public map visualization for Smell MyCity is anonymized and location data is skewed to protect your privacy. Personal contact information you enter in the settings tab is only made available to the relevant local regulatory agency. Our backend database only contains anonymous User ID's created by your app service (Apple or Google Play).",
    version: "version: ###",
    footer: constants.defaultFooter,
  },
  about: {
    panel: constants.defaultPanel,
    header: {
      h1: "About Us",
      a: constants.defaultHeader.a,
    },
    h2_1: "About Smell PGH",
    p1: '<a href="http://smellpgh.org/" target="_blank">Official Website</a>',
    p2: "Pittsburgh was named one of the top 15 most livable cities in the US, but our air quality is often worse than other cities on that list. Foul odors outside are typically symptoms of a serious pollution problem in our region. We, our children, our friends and families all breathe in this air. If our air smells toxic, then we are likely inhaling toxins.",
    p3: "Smell PGH was designed to crowdsource smell reports so we can track how pollutants travel through our air across Pittsburgh. All odor complaints submitted through the app go directly to the health department (ACHD) so they can better monitor and act on these complaints.",
    center: "-- Smell -- Submit -- Share --",
    p4: "Smell PGH was developed by the CMU CREATE Lab with support from the Heinz Endowments, and in collaboration with:",
    li1: "ACCAN",
    li2: "PennEnvironment",
    li3: "GASP",
    li4: "Sierra Club",
    li5: "ROCIS",
    li6: "Blue Lens, LLC",
    li7: "PennFuture",
    li8: "Clean Water Action",
    li9: "Clean Air Council",
    version: "version: ###",
    footer: constants.defaultFooter,
  },
  howitworks: {
    panel: constants.defaultPanel,
    header: {
      h1: "How It Works",
      a: constants.defaultHeader.a,
    },
    h3: "How It Works",
    p2: "We take every precaution to protect any personally identifiable data. All information shown on the public map visualization for Smell PGH is anonymous and location data is skewed to protect your privacy. Personal contact information you enter in the settings tab, is only shared with ACHD and not stored in our database. Our backend database only contains anonymous User ID’s created by your app service (Apple or Google Play).",
    p1: "The basic function of the Smell PGH app is as follows:",
    li1: "When you experience a pollution odor outdoors, you launch the app and pick a rating for the smell you experience (from 1 through 5)",
    li2: 'Adding a description of the smell (e.g. "Industrial", "Woodsmoke", etc.) is highly encouraged, since this can help the county isolate the source',
    li3: "You also have the option to (but are not required to):",
    li4: "List any symptoms attributable to the experience",
    li5: "Send a personal note/question to ACHD",
    li6: "NOTE: Please only enter information that you are comfortable with sharing anonymously on the public Smell PGH map",
    li7: "Once you hit 'Submit', the information you report is pulled together in an email format that includes:",
    li8: "The location of the smell (based on the GPS location of your phone)",
    li9: "Date and Time of smell",
    li10: "Rating and description (if provided) of smell",
    li11: "Any personal notes and/or questions to ACHD (if provided)",
    li12: "This information is then made available to ACHD",
    li13: "At the same time your smell report is added to the public Smell PGH map",
    li14: "A triangle icon that's the color of your smell rating represents your report",
    li15: "Your location is obscured on the map by slightly shifting the coordinates to protect your privacy",
    li16: "Tapping your smell report icon will show the details of your report, including the: date, time, rating, description (if provided) and symptoms (if provided)",
    li17: "NO personally identifiable information is shown on the map",
    footer: constants.defaultFooter,
  }
}
