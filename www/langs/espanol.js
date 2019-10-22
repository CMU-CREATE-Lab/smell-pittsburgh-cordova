// Spanish text
/*NOTE: translation not complete about page and howitworks not translated as
they are likely to change*/
/*NOTE: translation is not perfect the text reads literally correctly however
sentance structure and idioms may not be correct*/
var constants = {
  defaultPanel: {
    li1: "Configuración",
    li2: "Sobre",
    li3: "Cómo Funciona",
    a: "Cierre",
  },
  defaultHeader: {
    h1: "Smell MyCity",
    a: "Configuración",
  },
  defaultFooter: {
    li1: "Smell Report",
    li2: "Mapa",
  }
}

var espanol = {
  defaultCityName: "tu ciudad",
  home: {
    firstModal: {
      a1: "Cierre",
      h1: "Entregando Smell Reports",
      li1: "Califique el olor en una escala de 1-5",
      li2: "Describa el olor, la fuente de olor y cualquier síntoma (recomendado)",
      li3: "Escriba una nota personal al Departamento de salud (opcional)",
      li4: "Endosar sus reportes - vea Configuraciónes (recomendado)",
      a2: "OK",
    },
    perditionModal: { //??
      a1: "Cierre",
      h1: "Predicciones de eventos de olor",
      p: "Actualmente estamos probando un modelo de predicción de olores que puede alertar a los residentes de Pittsburgh sobre un posible evento de olor en el área. La precisión de las predicciones debe mejorar a medida que recibamos más informes de olores para verificar nuestro algoritmo. ¡ Esperamos que estas notificaciones sean útiles para usted!",
      a2: "OK",
    },
    panel: constants.defaultPanel,
    header: constants.defaultHeader,
    rating: {
      h3: "Cómo huele el aire ahora mismo en <span class='your-city'>su ciudad</span>?",
      input1: " 1 ¡Muy Bien!",
      input2: " 2 Apenas perceptible",
      input3: " 3 Definitivamente notable",
      input4: " 4 Se está poniendo muy mal",
      input5: " 5 ¡Tan malo como se pone!",
    },
    describe: {
      label: "Describa el olor, la fuente de olor y cualquier síntoma",
      placeholder: "Por ejemplo industrial, humo de madera, rotten-eggs",
    },
    symptoms: {
      label: "¿Algún síntoma relacionado con el olor?",
      placeholder: "Por ejemplo el dolor de cabeza, el dolor de garganta, irritación ocular",
    },
    note: {
      label: "Agregar una nota personal al Departamento de salud",
      placeholder: "Por ejemplo Si envía más de un informe en el mismo día",
    },
    custom: {
      label1: "Report Current Time/Location",
      label2: "Uncheck this box to manually select a time and location for the smell report.",
      label3: "Report Location",
      button: "Current Location (default)",
      label4: "Report Time",
      option: "Now",
    },
    disclaimer: "Nota: por favor, sólo ingrese la información que usted se siente cómodo compartiendo anónimamente en el público Smell MyCity mapa.",
    button: "Mandar Smell Report",
    footer: constants.defaultFooter,
  },
  map: {
    modal: {
      a1: "Cierre",
      h1: "Uso del mapa",
      li1: "Este mapa muestra los informes de los olores de todas partes <span class='your-city'>su ciudad</span>",
      li2: "Compensamos las ubicaciones de los informes de olor para proteger su privacidad",
      li3: "Desplácese por la línea de tiempo para ver los informes de cualquier día",
      li4: "Las fechas resaltadas con un color más oscuro indican AVG. rating de los reportes de olfato",
      li5: "Haga clic en un informe de olor o estación de supervisión para ver más detalles",
      a2: "OK",
    },
    newCity: {
      h3: "Bienvenido a <span class='your-city'>su ciudad</span>",
      p: "AQI actual es: <span class='aqi'>desconocido</span>",
    },
    panel: constants.defaultPanel,
    header: constants.defaultHeader,
    p_iframe: "Su navegador no soporta iframes.",
    footer: constants.defaultFooter,
  },
  settings: {
    panel: constants.defaultPanel,
    header: {
      h1: "Configuración",
      a: constants.defaultHeader.a,
    },
    contact: {
      h3: "la información de contacto",
      label: "Si bien estos campos son opcionales, la firma de su nombre en los informes al Departamento de salud puede mejorar la autenticidad y la efectividad.",
      placeholder1: "nombre (recomendado)",
      placeholder2: "email (recomendado)",
      placeholder3: "la dirección postal",
      placeholder4: "el número de teléfono",
    },
    notification: {
      h3: "Notificaciónes",
      label1: "Active las notificaciones de calidad del olor y del aire que son importantes para usted",
      label2: "Smell Event Alertas",
      label3: "(notificaciones sobre un evento de olor potencial en las próximas 4-8 horas)",
      label4: "Cambios en el índice de calidad del aire",
      label5: "(notifications about pgh air quality conditions)",
    },
    lang: {
      h3: "Lengua",
      label: "Selecciona tu idioma preferido",
      l0: Constants.LANGUAGES[0],
      l1: Constants.LANGUAGES[1],
    },
    footer: constants.defaultFooter,
  },
  startup: {
    header: constants.defaultHeader,
    h3: "Bienvenido a Smell MyCity!",
    p1: "¡Gracias por instalar Smell MyCity App!",
    p2: "Esta app es creada por el CMU CREATE Lab y está diseñado para rastrear los olores de la contaminación en todo el mundo. Si usted detecta un olor fétido mientras está fuera, por favor informe a través de esta aplicación.",
    p3: "Todos Smell MyCity se pone a disposición del Departamento de salud local informes de participación.",
    footer: "Fin",
    lang: {
      h3: "Lengua",
      label: "Selecciona tu idioma preferido",
      l0: Constants.LANGUAGES[0],
      l1: Constants.LANGUAGES[1],
    },
  },
  about: { //needs redone
    panel: constants.defaultPanel,
    header: {
      h1: "Sobre",
      a: constants.defaultHeader.a,
    },
    h3: "Sobre Smell MyCity",
    link: {
      p: "Smell PGH Website",
      url_notDisplayed: "http://smellpgh.org/", //??
    },
    p1: "Spinning out of the Smell PGH application, Smell MyCity is a mobile phone app designed to engage local residents in tracking pollution odors. Smell MyCity can be used anywhere in the United States. The map view displays smell reports submitted in the area on a given date. This allows residents to track where odors are frequently concentrated, and link those smell events to poor air quality in, or upwind from, those areas.",
    center: "-- Smell -- Submit -- Share --",
    version: "version: ###",
    footer: constants.defaultFooter,
  },
  howitworks: {
    panel: constants.defaultPanel,
    header: {
      h1: "How It Works",
      a: constants.defaultHeader.a
    },
    h3: "How It Works",
    p1: "We take every precaution to protect any personally identifiable data. All information shown on the public map visualization for Smell MyCity is anonymous and location data is skewed to protect your privacy. Personal contact information you enter in the settings tab is only made available to the local health department. Our backend database only contains anonymous User ID's created by your app service (Apple or Google Play).",
    p2: "The basic function of the Smell MyCity app is as follows:",
    li1: "When you experience a pollution odor outdoors, you launch the app and pick a rating for the smell you experience (from 1 through 5)",
    li2: "Adding a description of the smell (e.g. \"Industrial\", \"Woodsmoke\", etc.) is highly encouraged, since this can help the county isolate the source",
    li3: "You also have the option to (but are not required to):",
    li4: "List any symptoms attributable to the experience",
    li5: "Send a personal note/question to the local health department",
    li6: "NOTE: Please only enter information that you are comfortable with sharing anonymously on the public Smell MyCity map",
    li7: "Once you hit 'Submit', the information you report is pulled together in an email format that includes:",
    li8: "The location of the smell (based on the GPS location of your phone)",
    li9: "Date and Time of smell",
    li10: "Rating and description (if provided) of smell",
    li11: "Any personal notes and/or questions (if provided)",
    li12: "This information is then made available to the local health department",
    li13: "At the same time your smell report is added to the public Smell MyCity map",
    li14: "A triangle icon that's the color of your smell rating represents your report",
    li15: "Your location is obscured on the map by slightly shifting the coordinates to protect your privacy",
    li16: "Tapping your smell report icon will show the details of your report, including the: date, time, rating, description (if provided) and symptoms (if provided)",
    li17: "No personally identifiable information is shown on the map",
    footer: constants.defaultFooter,
  }
}