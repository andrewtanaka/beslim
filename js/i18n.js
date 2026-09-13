/* ============================================================
   BeSlim — translations (EN default, ES available)
   Add more languages by adding a new key to I18N and to
   LANG_NAMES, then adding a button in the #langMenu markup.
   ============================================================ */
const I18N = {
  en: {
    "onb.stepLabel":"Step", "onb.of":"of",
    "auth.emailTitle":"Sign in","auth.emailSub":"Enter the email you used at checkout.",
    "auth.email":"Email",
    "auth.continueBtn":"Continue",
    "auth.logout":"Log out",
    "auth.errGeneric":"Something went wrong. Please try again.",
    "auth.errFields":"Please enter a valid email.",
    "onb.step1.title":"Let's start with a bit about you.",
    "onb.step1.sub":"This helps us personalize your plan.",
    "onb.name":"Name (optional)", "onb.namePh":"e.g. Alex",
    "onb.age":"Age", "onb.gender":"Biological sex",
    "onb.male":"Male", "onb.female":"Female",
    "onb.continue":"Continue", "onb.back":"Back",
    "onb.step2.title":"Now, your body measurements.",
    "onb.step2.sub":"Used to calculate your basal metabolic rate.",
    "onb.weight":"Weight (kg)", "onb.height":"Height (cm)",
    "onb.goalWeight":"Goal weight (kg)",
    "onb.step3.title":"Last step — your lifestyle.",
    "onb.step3.sub":"This fine-tunes your daily calorie target.",
    "onb.activity":"Activity level",
    "onb.act.sedentary":"Sedentary","onb.act.sedentaryDesc":"Little or no exercise",
    "onb.act.light":"Lightly active","onb.act.lightDesc":"Exercise 1–3 days/week",
    "onb.act.moderate":"Moderately active","onb.act.moderateDesc":"Exercise 3–5 days/week",
    "onb.act.veryActive":"Very active","onb.act.veryActiveDesc":"Exercise 6–7 days/week",
    "onb.goal":"Goal", "onb.goalLose":"Lose weight", "onb.goalMaintain":"Maintain", "onb.goalGain":"Gain muscle",
    "onb.calculate":"Calculate my plan",
    "onb.loadingTitle":"Calculating your metabolism…",
    "onb.check1":"Analyzing your body data",
    "onb.check2":"Calculating basal metabolic rate",
    "onb.check3":"Building your calorie target",
    "onb.check4":"Preparing your plan",

    "nav.home":"Home","nav.plan":"Plan","nav.lessons":"Lessons","nav.shop":"Shop","nav.progress":"Progress",

    "home.today":"Today","home.tipOfDay":"Tip of the day","home.newTip":"Another tip",
    "home.caloriesLeft":"Calories left","home.of":"of",
    "home.dailyGoal":"Daily goal","home.kcal":"kcal","home.consumed":"Consumed","home.remaining":"Remaining",
    "home.protein":"Protein","home.carbs":"Carbs","home.fat":"Fat",
    "home.proteinLeft":"Protein left","home.carbsLeft":"Carbs left","home.fatLeft":"Fat left",
    "home.mealsToday":"🍽️ Today's meals","home.clear":"Clear",
    "home.emptyMeals":"No meals logged yet. Tap a quick-add above.",
    "home.greetingHi":"Hi",
    "home.qaBreakfast":"🍳 Breakfast","home.qaLunch":"🥗 Lunch","home.qaSnack":"🍎 Snack","home.qaDinner":"🌙 Dinner",

    "plan.title":"📋 Your plan","plan.edit":"Edit data","plan.bmr":"Basal metabolic rate","plan.tdee":"Total daily expenditure",
    "plan.macroTargets":"Daily macro targets","plan.sampleMenu":"Sample daily menu","plan.regenerate":"🔀 Shuffle",
    "plan.disclaimer":"Estimate for general guidance only. Does not replace advice from a nutritionist or physician.",
    "plan.breakfast":"🍳 Breakfast","plan.lunch":"🥗 Lunch","plan.snack":"🍎 Snack","plan.dinner":"🌙 Dinner",

    "lessons.title":"🎬 Lessons",
    "lessons.locked":"Locked","lessons.free":"Free","lessons.comingSoon":"Video coming soon — attach your lesson link here.",
    "lessons.recipeLabel":"Recipe","lessons.ingredients":"Ingredients","lessons.instructions":"Instructions",

    "shop.title":"🛍️ Shop","shop.sub":"Guides and programs to go further.","shop.buy":"Buy now",
    "shop.bestseller":"Best seller","shop.off":"50% OFF",

    "progress.title":"📈 Progress","progress.start":"Start","progress.current":"Current","progress.goal":"Goal",
    "progress.chart":"Weight trend","progress.logNew":"Log today's weight","progress.add":"Add",
    "progress.history":"History","progress.empty":"No entries yet — add your first weigh-in above.",


    "tips":[
      "💧 Drink a glass of water right now — hydration keeps your metabolism working.",
      "🎯 Small consistent steps beat perfect plans. Stay focused on today.",
      "🚶 A 10-minute walk after meals helps regulate blood sugar.",
      "🍗 Protein at every meal keeps you fuller for longer.",
      "✨ You don't have to be extreme, just consistent.",
      "😴 Sleep is part of the plan too — aim for 7–9 hours tonight.",
      "🙂 Progress isn't always the scale. Notice your energy and mood.",
      "🥗 Plan your next meal before hunger makes the decision for you.",
      "🌱 Every healthy choice today is a vote for the person you're becoming.",
      "💧 Keep a water bottle nearby — most 'hunger' is actually thirst."
    ]
  },

  es: {
    "onb.stepLabel":"Paso", "onb.of":"de",
    "auth.emailTitle":"Iniciar sesión","auth.emailSub":"Ingresa el correo que usaste en tu compra.",
    "auth.email":"Correo electrónico",
    "auth.continueBtn":"Continuar",
    "auth.logout":"Cerrar sesión",
    "auth.errGeneric":"Algo salió mal. Inténtalo de nuevo.",
    "auth.errFields":"Ingresa un correo válido.",
    "onb.step1.title":"Empecemos con un poco sobre ti.",
    "onb.step1.sub":"Esto nos ayuda a personalizar tu plan.",
    "onb.name":"Nombre (opcional)", "onb.namePh":"ej. Alex",
    "onb.age":"Edad", "onb.gender":"Sexo biológico",
    "onb.male":"Masculino", "onb.female":"Femenino",
    "onb.continue":"Continuar", "onb.back":"Atrás",
    "onb.step2.title":"Ahora, tus medidas corporales.",
    "onb.step2.sub":"Se usan para calcular tu tasa metabólica basal.",
    "onb.weight":"Peso (kg)", "onb.height":"Altura (cm)",
    "onb.goalWeight":"Peso objetivo (kg)",
    "onb.step3.title":"Último paso — tu estilo de vida.",
    "onb.step3.sub":"Esto ajusta tu meta calórica diaria.",
    "onb.activity":"Nivel de actividad",
    "onb.act.sedentary":"Sedentario","onb.act.sedentaryDesc":"Poco o ningún ejercicio",
    "onb.act.light":"Ligeramente activo","onb.act.lightDesc":"Ejercicio 1–3 días/semana",
    "onb.act.moderate":"Moderadamente activo","onb.act.moderateDesc":"Ejercicio 3–5 días/semana",
    "onb.act.veryActive":"Muy activo","onb.act.veryActiveDesc":"Ejercicio 6–7 días/semana",
    "onb.goal":"Objetivo", "onb.goalLose":"Perder peso", "onb.goalMaintain":"Mantener", "onb.goalGain":"Ganar músculo",
    "onb.calculate":"Calcular mi plan",
    "onb.loadingTitle":"Calculando tu metabolismo…",
    "onb.check1":"Analizando tus datos corporales",
    "onb.check2":"Calculando tasa metabólica basal",
    "onb.check3":"Definiendo tu meta calórica",
    "onb.check4":"Preparando tu plan",

    "nav.home":"Inicio","nav.plan":"Plan","nav.lessons":"Clases","nav.shop":"Tienda","nav.progress":"Progreso",

    "home.today":"Hoy","home.tipOfDay":"Consejo del día","home.newTip":"Otro consejo",
    "home.caloriesLeft":"Calorías restantes","home.of":"de",
    "home.dailyGoal":"Meta diaria","home.kcal":"kcal","home.consumed":"Consumido","home.remaining":"Restante",
    "home.protein":"Proteína","home.carbs":"Carbohidratos","home.fat":"Grasa",
    "home.proteinLeft":"Proteína restante","home.carbsLeft":"Carbos restantes","home.fatLeft":"Grasa restante",
    "home.mealsToday":"🍽️ Comidas de hoy","home.clear":"Borrar",
    "home.emptyMeals":"Aún no hay comidas registradas. Toca un acceso rápido arriba.",
    "home.greetingHi":"Hola",
    "home.qaBreakfast":"🍳 Desayuno","home.qaLunch":"🥗 Almuerzo","home.qaSnack":"🍎 Merienda","home.qaDinner":"🌙 Cena",

    "plan.title":"📋 Tu plan","plan.edit":"Editar datos","plan.bmr":"Tasa metabólica basal","plan.tdee":"Gasto total diario",
    "plan.macroTargets":"Metas diarias de macros","plan.sampleMenu":"Menú diario de ejemplo","plan.regenerate":"🔀 Mezclar",
    "plan.disclaimer":"Estimación con fines orientativos. No sustituye la asesoría de un nutricionista o médico.",
    "plan.breakfast":"🍳 Desayuno","plan.lunch":"🥗 Almuerzo","plan.snack":"🍎 Merienda","plan.dinner":"🌙 Cena",

    "lessons.title":"🎬 Clases",
    "lessons.locked":"Bloqueado","lessons.free":"Gratis","lessons.comingSoon":"Video próximamente — adjunta aquí tu enlace de la clase.",
    "lessons.recipeLabel":"Receta","lessons.ingredients":"Ingredientes","lessons.instructions":"Instrucciones",

    "shop.title":"🛍️ Tienda","shop.sub":"Guías y programas para ir más allá.","shop.buy":"Comprar",
    "shop.bestseller":"Más vendido","shop.off":"50% OFF",

    "progress.title":"📈 Progreso","progress.start":"Inicio","progress.current":"Actual","progress.goal":"Meta",
    "progress.chart":"Tendencia de peso","progress.logNew":"Registrar peso de hoy","progress.add":"Añadir",
    "progress.history":"Historial","progress.empty":"Aún no hay registros — añade tu primer peso arriba.",


    "tips":[
      "💧 Bebe un vaso de agua ahora mismo — la hidratación mantiene tu metabolismo activo.",
      "🎯 Pasos pequeños y constantes superan a los planes perfectos. Enfócate en hoy.",
      "🚶 Caminar 10 minutos después de comer ayuda a regular el azúcar en sangre.",
      "🍗 Proteína en cada comida te mantiene satisfecho por más tiempo.",
      "✨ No tienes que ser extremo, solo constante.",
      "😴 El sueño también es parte del plan — apunta a 7–9 horas esta noche.",
      "🙂 El progreso no siempre es la báscula. Nota tu energía y tu ánimo.",
      "🥗 Planea tu próxima comida antes de que el hambre decida por ti.",
      "🌱 Cada elección saludable hoy es un voto por la persona en la que te conviertes.",
      "💧 Ten una botella de agua cerca — la mayoría del 'hambre' es en realidad sed."
    ]
  }
};

const LANG_NAMES = { en:"EN", es:"ES" };

/* Static content datasets that vary by language: lessons, shop
   products and the sample-menu food pool. Kept separate from the
   UI dictionary so they're easy to find and edit later. */
const CONTENT = {
  en: {
    lessons: [
      { title:"Start here", duration:"", free:true, videoId:"NkjjRqSG0Qk", cover:"assets/lessons/lesson1.jpg", desc:"Begin here — the first steps to get the most out of your BeSlim journey." },
      { title:"What stops your weight loss", duration:"", free:true, videoId:"hTFmAaCbXgw", cover:"assets/lessons/lesson2.jpg", desc:"The hidden habits that quietly stall your progress." },
      { title:"How to prepare the gelatin trick", duration:"", free:true, videoId:"HQMNvUsHwwY", cover:"assets/lessons/lesson3.jpg", desc:"A simple recipe trick to support your routine.",
        recipe:{
          title:"Anti-Bloating Gelatin",
          subtitle:"Reduces inflammation and fluid retention",
          ingredients:[
            "Unflavored, colorless gelatin — 12 g",
            "Warm water — 150 ml",
            "Grated ginger — 1 tsp",
            "Lemon juice — 1/2 lemon",
            "Honey — 1/2 tsp (optional)"
          ],
          steps:[
            "Mix the gelatin with the warm water until fully dissolved.",
            "Add the ginger and lemon juice. Sweeten with honey if desired.",
            "Refrigerate for 2 hours until set.",
            "Eat it first thing in the morning to activate your fat-burning hormones."
          ]
        }
      },
      { title:"The 5 mistakes that prevent weight loss", duration:"", free:true, videoId:"MhwqXzJ5lDQ", cover:"assets/lessons/lesson4.jpg", desc:"Avoid these five common mistakes holding you back." },
      { title:"Morning ritual to activate slimming", duration:"", free:true, videoId:"fu0FarkgAuo", cover:"assets/lessons/lesson5.jpg", desc:"A short morning ritual to kickstart your metabolism." },
      { title:"Real stories of women who have lost weight", duration:"", free:true, videoId:"adAf2pl1s9s", cover:"assets/lessons/lesson6.jpg", desc:"Real, relatable stories for extra motivation." },
      { title:"Community", duration:"", free:true, url:"https://t.me/+bz0kN-5aazJjMzkx", cover:"assets/lessons/community.png", desc:"Join our private community group." }
    ],
    products: [
      { cover:"assets/shop/banner1.jpg", name:"SUPER ACCELERATE 10X", price:"$69", desc:"Accelerate your results 10X in a practical and powerful way.", checkoutUrl:"https://checkout.kashpay.com.br/checkout/checkout-1789193073402" },
      { cover:"assets/shop/banner2.jpg", name:"ELIMINATE SAGGINS", price:"$49", desc:"Restore your skin's firmness and achieve a more defined body after weight loss.", checkoutUrl:"https://checkout.kashpay.com.br/checkout/checkout-1789242784519" },
      { cover:"assets/shop/banner3.jpg", name:"BYE! STRETCH MARKS", price:"$19", desc:"Reduce stretch marks and restore your skin's beauty.", checkoutUrl:"https://checkout.kashpay.com.br/checkout/checkout-1789244064523" }
    ],
    foods: {
      breakfast: ["Greek yogurt with berries and oats","Scrambled eggs with whole-grain toast","Protein oatmeal with banana","Cottage cheese with pineapple"],
      lunch: ["Grilled chicken with rice and vegetables","Tuna salad with quinoa","Turkey wrap with mixed greens","Salmon with sweet potato"],
      snack: ["Protein shake with almond milk","Apple with peanut butter","Handful of almonds and a banana","Rice cakes with cottage cheese"],
      dinner: ["Baked cod with steamed broccoli","Lean beef stir-fry with vegetables","Grilled tofu with brown rice","Chicken soup with whole-grain bread"]
    }
  },
  es: {
    lessons: [
      { title:"Empieza aquí", duration:"", free:true, videoId:"NkjjRqSG0Qk", cover:"assets/lessons/lesson1.jpg", desc:"Empieza por aquí — los primeros pasos en tu recorrido con BeSlim." },
      { title:"Qué frena tu pérdida de peso", duration:"", free:true, videoId:"hTFmAaCbXgw", cover:"assets/lessons/lesson2.jpg", desc:"Los hábitos ocultos que frenan tu progreso en silencio." },
      { title:"Cómo preparar el truco de la gelatina", duration:"", free:true, videoId:"HQMNvUsHwwY", cover:"assets/lessons/lesson3.jpg", desc:"Un truco sencillo de receta para apoyar tu rutina.",
        recipe:{
          title:"Gelatina Antihinchazón",
          subtitle:"Reduce la inflamación y la retención de líquidos",
          ingredients:[
            "Gelatina incolora sin sabor — 12 g",
            "Agua tibia — 150 ml",
            "Jengibre rallado — 1 cucharadita",
            "Jugo de limón — 1/2 limón",
            "Miel — 1/2 cucharadita (opcional)"
          ],
          steps:[
            "Mezcla la gelatina con el agua tibia hasta disolver por completo.",
            "Agrega el jengibre y el jugo de limón. Endulza con miel si lo deseas.",
            "Refrigera por 2 horas hasta que esté firme.",
            "Consúmela a primera hora de la mañana para activar tus hormonas quema grasa."
          ]
        }
      },
      { title:"Los 5 errores que impiden bajar de peso", duration:"", free:true, videoId:"MhwqXzJ5lDQ", cover:"assets/lessons/lesson4.jpg", desc:"Evita estos cinco errores comunes que te frenan." },
      { title:"Ritual matutino para activar tu metabolismo", duration:"", free:true, videoId:"fu0FarkgAuo", cover:"assets/lessons/lesson5.jpg", desc:"Un breve ritual matutino para activar tu metabolismo." },
      { title:"Historias reales de mujeres que bajaron de peso", duration:"", free:true, videoId:"adAf2pl1s9s", cover:"assets/lessons/lesson6.jpg", desc:"Historias reales y cercanas para motivarte." },
      { title:"Comunidad", duration:"", free:true, url:"https://t.me/+bz0kN-5aazJjMzkx", cover:"assets/lessons/community.png", desc:"Únete a nuestro grupo privado de la comunidad." }
    ],
    products: [
      { cover:"assets/shop/banner1.jpg", name:"SUPER ACCELERATE 10X", price:"$69", desc:"Acelera tus resultados 10 veces de forma práctica y poderosa.", checkoutUrl:"https://checkout.kashpay.com.br/checkout/checkout-1789193073402" },
      { cover:"assets/shop/banner2.jpg", name:"ELIMINATE SAGGINS", price:"$49", desc:"Recupera la firmeza de tu piel y logra un cuerpo más definido después de bajar de peso.", checkoutUrl:"https://checkout.kashpay.com.br/checkout/checkout-1789242784519" },
      { cover:"assets/shop/banner3.jpg", name:"BYE! STRETCH MARKS", price:"$19", desc:"Reduce las estrías y recupera la belleza de tu piel.", checkoutUrl:"https://checkout.kashpay.com.br/checkout/checkout-1789244064523" }
    ],
    foods: {
      breakfast: ["Yogur griego con frutos rojos y avena","Huevos revueltos con pan integral","Avena proteica con plátano","Requesón con piña"],
      lunch: ["Pollo a la plancha con arroz y verduras","Ensalada de atún con quinoa","Wrap de pavo con hojas verdes","Salmón con batata"],
      snack: ["Batido de proteína con leche de almendra","Manzana con mantequilla de maní","Puñado de almendras y un plátano","Tortitas de arroz con requesón"],
      dinner: ["Bacalao al horno con brócoli al vapor","Salteado de res magra con verduras","Tofu a la plancha con arroz integral","Sopa de pollo con pan integral"]
    }
  }
};
