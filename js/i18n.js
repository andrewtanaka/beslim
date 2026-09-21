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
    "home.todaysPlan":"🔥 Today's Challenge","home.todaysPlanSub":"One small action for your progress today.",
    "home.taskNutrition":"Nutrition","home.taskNutritionDesc":"Follow today's nutrition recommendation",
    "home.taskMovement":"Movement","home.taskMovementDesc":"15 min of movement",
    "home.taskHabit":"Daily Habit","home.taskHabitDesc":"Complete your hydration goal",
    "home.taskView":"View","home.taskStart":"Start","home.taskMarkDone":"Mark as done","home.taskDone":"Done",
    "home.streakDays":"day streak",
    "home.caloriesLeft":"Calories left","home.of":"of",
    "home.dailyGoal":"Daily goal","home.kcal":"kcal","home.consumed":"Consumed","home.remaining":"Remaining",
    "home.protein":"Protein","home.carbs":"Carbs","home.fat":"Fat",
    "home.proteinLeft":"Protein left","home.carbsLeft":"Carbs left","home.fatLeft":"Fat left",
    "home.mealsToday":"🍽️ Today's meals","home.clear":"Clear",
    "home.logMeal":"Log a meal","home.mealName":"Name","home.mealKcal":"Calories (kcal)","home.mealKcalShort":"kcal","home.addMeal":"Add",
    "home.pointsEarned":"points!",
    "home.emptyMeals":"No meals logged yet. Tap a quick-add above.",
    "home.greetingHi":"Hi",
    "home.qaBreakfast":"🍳 Breakfast","home.qaLunch":"🥗 Lunch","home.qaSnack":"🍎 Snack","home.qaDinner":"🌙 Dinner",
    "home.todaysPlan":"🔥 Today's Challenge","home.todaysPlanSub":"One small action for your progress today.",

    "plan.title":"📋 Your plan","plan.edit":"Edit data","plan.bmr":"Basal metabolic rate","plan.tdee":"Total daily expenditure",
    "plan.journeyWeek":"Week {n} of your journey","plan.mainFocus":"Main focus","plan.focusConsistency":"Consistency",
    "plan.thisWeek":"This week","plan.recommendedLesson":"Recommended lesson",
    "plan.checkinTitle":"Weekly Check-in","plan.checkinSub":"Take 2 minutes to update your progress.","plan.checkinBtn":"Start check-in",
    "plan.checkinDoneTitle":"Check-in complete for this week","plan.checkinDoneSub":"See you next week — keep going!",
    "plan.checkinQWeight":"Current weight (kg)","plan.checkinQEnergy":"Energy level","plan.checkinQNutrition":"Nutrition this week",
    "plan.checkinQMovement":"How many days did you move this week?","plan.checkinQSleep":"Sleep","plan.checkinQDifficulty":"Biggest challenge",
    "plan.checkinQOverall":"Overall week","plan.checkinSubmit":"Complete Check-in",
    "plan.scaleLow":"Very low","plan.scaleHigh":"Excellent","plan.scaleLowAlt":"Difficult","plan.scalePoor":"Poor",
    "plan.diffConsistency":"Consistency","plan.diffFood":"Food choices","plan.diffCravings":"Cravings",
    "plan.diffTime":"Lack of time","plan.diffMotivation":"Motivation","plan.diffExercise":"Exercise","plan.diffOther":"Other",
    "plan.checkinCompleteTitle":"Check-in complete! 🎉","plan.checkinCompleteSub":"Your next week has been prepared.",
    "plan.yourNextWeek":"Your next week","plan.close":"Close",
    "plan.macroTargets":"Daily macro targets","plan.sampleMenu":"Sample daily menu","plan.regenerate":"🔀 Shuffle",
    "plan.aiPlanLabel":"Meal plan","plan.aiPlanIntro":"Generate a meal plan built around your calorie and macro targets.",
    "plan.generateBtn":"Generate my plan","plan.generating":"Generating your plan…","plan.regeneratePlan":"Generate again",
    "plan.myMenuTitle":"My own menu","plan.myMenuEdit":"Edit","plan.myMenuSub":"Write what you actually plan to eat today.",
    "plan.myMenuPh":"Type what you'll eat","plan.myMenuSave":"Save my menu",

    "today.title":"Today's Plan","today.subtitle":"Small actions for your progress today.",
    "today.nutritionTitle":"Nutrition","today.nutritionDesc":"Follow today's nutrition recommendation","today.nutritionAction":"View",
    "today.movementTitle":"Movement","today.movementDesc":"15 min of movement","today.movementAction":"Start",
    "today.habitTitle":"Daily Habit","today.habitDesc":"Complete your hydration goal","today.habitAction":"Mark as done",
    "today.done":"Done","today.streak":"day streak",

    "myplan.subtitle":"Your personalized plan","myplan.week":"Week","myplan.ofJourney":"of your journey",
    "myplan.mainFocus":"Main focus","myplan.thisWeek":"This week","myplan.recommendedLesson":"Recommended Lesson",
    "myplan.focusConsistency":"Consistency","myplan.focusFoodChoices":"Food choices","myplan.focusCravings":"Managing cravings",
    "myplan.focusTime":"Making time","myplan.focusMotivation":"Staying motivated","myplan.focusExercise":"Movement",
    "myplan.focusOther":"Your journey",

    "checkin.cardTitle":"Weekly Check-in","checkin.cardSub":"Take 2 minutes to update your progress.",
    "checkin.start":"Start check-in","checkin.doneThisWeek":"Check-in completed this week ✓",
    "checkin.title":"Weekly Check-in","checkin.weight":"Current weight (kg)",
    "checkin.energy":"Energy level","checkin.nutrition":"Nutrition this week","checkin.movement":"How many days did you move this week?",
    "checkin.sleep":"Sleep","checkin.difficulty":"Biggest challenge","checkin.overall":"Overall week",
    "checkin.low":"Very low","checkin.excellent":"Excellent","checkin.poor":"Poor","checkin.difficult":"Difficult",
    "checkin.submit":"Complete Check-in","checkin.complete":"Check-in complete! 🎉","checkin.nextWeekReady":"Your next week has been prepared.",
    "checkin.yourNextWeek":"Your next week",
    "checkin.diffConsistency":"Consistency","checkin.diffFood":"Food choices","checkin.diffCravings":"Cravings",
    "checkin.diffTime":"Lack of time","checkin.diffMotivation":"Motivation","checkin.diffExercise":"Exercise","checkin.diffOther":"Other",

    "progress.day":"Day","progress.currentStreak":"Current streak","progress.longestStreak":"Best streak",
    "progress.points":"Your points","progress.consistency":"Your Consistency","progress.consistencyGood":"Great consistency this week.",
    "progress.referTitle":"Refer a friend","progress.referSub":"Earn more points for every friend you invite.",
    "progress.referModalSub":"Share your link — you'll earn points once you copy it.","progress.copyLink":"Copy link","progress.linkCopied":"Link copied!",
    "progress.thisWeekSummary":"This Week","progress.dailyGoals":"daily goals","progress.checkinCompleted":"Weekly check-in completed",
    "progress.achievements":"Achievements","progress.challenge":"Challenge of the Month","progress.continueChallenge":"Continue Challenge",
    "progress.challengeTitle":"21 Days of Consistency","progress.challengeComplete":"Challenge complete! 🎉",
    "progress.challengeDesc":"Complete daily actions to count as a consistent day.","progress.challengeDays":"days",

    "ach.firstWeek":"First Week","ach.firstWeekReq":"7 day streak",
    "ach.streak14":"14 Day Streak","ach.streak14Req":"14 days in a row",
    "ach.streak30":"30 Day Journey","ach.streak30Req":"30 days in a row",
    "ach.firstCheckin":"First Check-in","ach.firstCheckinReq":"Complete your first weekly check-in",
    "ach.goalMilestone":"Goal Milestone","ach.goalMilestoneReq":"Halfway to your goal weight",
    "ach.referral":"Refer BeSlim","ach.referralReq":"Invite a friend to join",

    "lessons.recommendedTitle":"Recommended for You","lessons.recommendedSub":"Based on your current plan.",
    "plan.disclaimer":"Estimate for general guidance only. Does not replace advice from a nutritionist or physician.",
    "plan.breakfast":"🍳 Breakfast","plan.lunch":"🥗 Lunch","plan.snack":"🍎 Snack","plan.dinner":"🌙 Dinner",

    "plan.myPlanTitle":"My Plan","plan.weekOf":"Week {n} of your journey","plan.mainFocus":"Main focus","plan.focusConsistency":"Consistency",
    "plan.thisWeek":"This week","plan.recommendedLesson":"Recommended lesson",
    "plan.checkinTitle":"Weekly Check-in","plan.checkinSub":"Take 2 minutes to update your progress.",
    "plan.checkinDone":"This week's check-in is complete.","plan.checkinCta":"Start check-in",
    "plan.checkinWeight":"Current weight (kg)","plan.checkinEnergy":"Energy level","plan.checkinNutrition":"Nutrition this week",
    "plan.checkinMovement":"How many days did you move this week?","plan.checkinSleep":"Sleep",
    "plan.checkinChallenge":"Biggest challenge","plan.checkinOverall":"Overall week",
    "plan.checkinLow":"Very low","plan.checkinExcellent":"Excellent","plan.checkinDifficult":"Difficult","plan.checkinPoor":"Poor",
    "plan.challengeConsistency":"Consistency","plan.challengeFood":"Food choices","plan.challengeCravings":"Cravings",
    "plan.challengeTime":"Lack of time","plan.challengeMotivation":"Motivation","plan.challengeExercise":"Exercise","plan.challengeOther":"Other",
    "plan.checkinSubmit":"Complete Check-in","plan.checkinSuccess":"Check-in complete! 🎉","plan.checkinSuccessSub":"Your progress has been recorded.",
    "plan.close":"Close",

    "lessons.title":"🎬 Lessons",
    "lessons.recommendedLabel":"Recommended for You","lessons.recommendedSub":"Based on your current plan.",
    "lessons.locked":"Locked","lessons.free":"Free","lessons.comingSoon":"Video coming soon — attach your lesson link here.",
    "lessons.recipeLabel":"Recipe","lessons.ingredients":"Ingredients","lessons.instructions":"Instructions",
    "lessons.guideLabel":"Setup guide",
    "lessons.recommended":"Recommended for You","lessons.recommendedSub":"Based on your current plan.",

    "shop.title":"Next step","shop.sub":"Guides and programs to go further.","shop.buy":"Buy now",
    "shop.bestseller":"Best seller","shop.off":"50% OFF",

    "progress.title":"📈 Progress","progress.start":"Start","progress.current":"Current","progress.goal":"Goal",
    "progress.streak":"Streak","progress.bestStreak":"Best streak","progress.consistency":"Your Consistency",
    "progress.achievements":"Achievements","progress.locked":"Locked","progress.dayN":"Day {n}",
    "progress.chart":"Weight trend","progress.logNew":"Log today's weight","progress.add":"Add",
    "progress.history":"History","progress.empty":"No entries yet — add your first weigh-in above.",
    "progress.currentStreak":"Current streak","progress.longestStreak":"Best streak",
    "progress.streakBroken":"Tomorrow is a new opportunity to continue.",
    "progress.achievements":"Achievements","progress.locked":"Locked",
    "progress.thisWeek":"This week","progress.dailyGoals":"daily goals completed","progress.checkinCompleted":"Weekly check-in completed",
    "progress.checkinPending":"Weekly check-in pending",


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
    "home.todaysPlan":"🔥 Desafío de Hoy","home.todaysPlanSub":"Una pequeña acción para tu progreso hoy.",
    "home.taskNutrition":"Nutrición","home.taskNutritionDesc":"Sigue la recomendación de nutrición de hoy",
    "home.taskMovement":"Movimiento","home.taskMovementDesc":"15 min de movimiento",
    "home.taskHabit":"Hábito Diario","home.taskHabitDesc":"Completa tu meta de hidratación",
    "home.taskView":"Ver","home.taskStart":"Empezar","home.taskMarkDone":"Marcar como hecho","home.taskDone":"Hecho",
    "home.streakDays":"días de racha",
    "home.caloriesLeft":"Calorías restantes","home.of":"de",
    "home.dailyGoal":"Meta diaria","home.kcal":"kcal","home.consumed":"Consumido","home.remaining":"Restante",
    "home.protein":"Proteína","home.carbs":"Carbohidratos","home.fat":"Grasa",
    "home.proteinLeft":"Proteína restante","home.carbsLeft":"Carbos restantes","home.fatLeft":"Grasa restante",
    "home.mealsToday":"🍽️ Comidas de hoy","home.clear":"Borrar",
    "home.logMeal":"Registrar comida","home.mealName":"Nombre","home.mealKcal":"Calorías (kcal)","home.mealKcalShort":"kcal","home.addMeal":"Añadir",
    "home.pointsEarned":"¡puntos!",
    "home.emptyMeals":"Aún no hay comidas registradas. Toca un acceso rápido arriba.",
    "home.greetingHi":"Hola",
    "home.qaBreakfast":"🍳 Desayuno","home.qaLunch":"🥗 Almuerzo","home.qaSnack":"🍎 Merienda","home.qaDinner":"🌙 Cena",
    "home.todaysPlan":"🔥 Desafío de Hoy","home.todaysPlanSub":"Una pequeña acción para tu progreso hoy.",

    "plan.title":"📋 Tu plan","plan.edit":"Editar datos","plan.bmr":"Tasa metabólica basal","plan.tdee":"Gasto total diario",
    "plan.journeyWeek":"Semana {n} de tu recorrido","plan.mainFocus":"Enfoque principal","plan.focusConsistency":"Consistencia",
    "plan.thisWeek":"Esta semana","plan.recommendedLesson":"Clase recomendada",
    "plan.checkinTitle":"Check-in Semanal","plan.checkinSub":"Tómate 2 minutos para actualizar tu progreso.","plan.checkinBtn":"Iniciar check-in",
    "plan.checkinDoneTitle":"Check-in completado esta semana","plan.checkinDoneSub":"Nos vemos la próxima semana — ¡sigue así!",
    "plan.checkinQWeight":"Peso actual (kg)","plan.checkinQEnergy":"Nivel de energía","plan.checkinQNutrition":"Nutrición esta semana",
    "plan.checkinQMovement":"¿Cuántos días te moviste esta semana?","plan.checkinQSleep":"Sueño","plan.checkinQDifficulty":"Mayor desafío",
    "plan.checkinQOverall":"Semana en general","plan.checkinSubmit":"Completar Check-in",
    "plan.scaleLow":"Muy bajo","plan.scaleHigh":"Excelente","plan.scaleLowAlt":"Difícil","plan.scalePoor":"Malo",
    "plan.diffConsistency":"Consistencia","plan.diffFood":"Elección de alimentos","plan.diffCravings":"Antojos",
    "plan.diffTime":"Falta de tiempo","plan.diffMotivation":"Motivación","plan.diffExercise":"Ejercicio","plan.diffOther":"Otro",
    "plan.checkinCompleteTitle":"¡Check-in completado! 🎉","plan.checkinCompleteSub":"Tu próxima semana ya está lista.",
    "plan.yourNextWeek":"Tu próxima semana","plan.close":"Cerrar",
    "plan.macroTargets":"Metas diarias de macros","plan.sampleMenu":"Menú diario de ejemplo","plan.regenerate":"🔀 Mezclar",
    "plan.aiPlanLabel":"Plan de comidas","plan.aiPlanIntro":"Genera un plan de comidas basado en tus metas de calorías y macros.",
    "plan.generateBtn":"Generar mi plan","plan.generating":"Generando tu plan…","plan.regeneratePlan":"Generar de nuevo",
    "plan.myMenuTitle":"Mi propio menú","plan.myMenuEdit":"Editar","plan.myMenuSub":"Escribe lo que realmente planeas comer hoy.",
    "plan.myMenuPh":"Escribe qué vas a comer","plan.myMenuSave":"Guardar mi menú",

    "today.title":"Plan de Hoy","today.subtitle":"Pequeñas acciones para tu progreso de hoy.",
    "today.nutritionTitle":"Nutrición","today.nutritionDesc":"Sigue la recomendación de nutrición de hoy","today.nutritionAction":"Ver",
    "today.movementTitle":"Movimiento","today.movementDesc":"15 min de movimiento","today.movementAction":"Empezar",
    "today.habitTitle":"Hábito Diario","today.habitDesc":"Cumple tu meta de hidratación","today.habitAction":"Marcar hecho",
    "today.done":"Hecho","today.streak":"días seguidos",

    "myplan.subtitle":"Tu plan personalizado","myplan.week":"Semana","myplan.ofJourney":"de tu recorrido",
    "myplan.mainFocus":"Enfoque principal","myplan.thisWeek":"Esta semana","myplan.recommendedLesson":"Clase recomendada",
    "myplan.focusConsistency":"Consistencia","myplan.focusFoodChoices":"Elección de alimentos","myplan.focusCravings":"Manejo de antojos",
    "myplan.focusTime":"Encontrar tiempo","myplan.focusMotivation":"Mantener la motivación","myplan.focusExercise":"Movimiento",
    "myplan.focusOther":"Tu recorrido",

    "checkin.cardTitle":"Check-in Semanal","checkin.cardSub":"Tómate 2 minutos para actualizar tu progreso.",
    "checkin.start":"Iniciar check-in","checkin.doneThisWeek":"Check-in completado esta semana ✓",
    "checkin.title":"Check-in Semanal","checkin.weight":"Peso actual (kg)",
    "checkin.energy":"Nivel de energía","checkin.nutrition":"Nutrición esta semana","checkin.movement":"¿Cuántos días te moviste esta semana?",
    "checkin.sleep":"Sueño","checkin.difficulty":"Mayor desafío","checkin.overall":"Semana en general",
    "checkin.low":"Muy bajo","checkin.excellent":"Excelente","checkin.poor":"Malo","checkin.difficult":"Difícil",
    "checkin.submit":"Completar Check-in","checkin.complete":"¡Check-in completo! 🎉","checkin.nextWeekReady":"Tu próxima semana ya está lista.",
    "checkin.yourNextWeek":"Tu próxima semana",
    "checkin.diffConsistency":"Consistencia","checkin.diffFood":"Elección de alimentos","checkin.diffCravings":"Antojos",
    "checkin.diffTime":"Falta de tiempo","checkin.diffMotivation":"Motivación","checkin.diffExercise":"Ejercicio","checkin.diffOther":"Otro",

    "progress.day":"Día","progress.currentStreak":"Racha actual","progress.longestStreak":"Mejor racha",
    "progress.points":"Tus puntos","progress.consistency":"Tu Consistencia","progress.consistencyGood":"Muy buena consistencia esta semana.",
    "progress.referTitle":"Invita a un amigo","progress.referSub":"Gana más puntos por cada amigo que invites.",
    "progress.referModalSub":"Comparte tu link — ganarás puntos al copiarlo.","progress.copyLink":"Copiar link","progress.linkCopied":"¡Link copiado!",
    "progress.thisWeekSummary":"Esta Semana","progress.dailyGoals":"metas diarias","progress.checkinCompleted":"Check-in semanal completado",
    "progress.achievements":"Logros","progress.challenge":"Reto del Mes","progress.continueChallenge":"Continuar Reto",
    "progress.challengeTitle":"21 Días de Consistencia","progress.challengeComplete":"¡Reto completado! 🎉",
    "progress.challengeDesc":"Completa la acción diaria para contar como un día consistente.","progress.challengeDays":"días",

    "ach.firstWeek":"Primera Semana","ach.firstWeekReq":"Racha de 7 días",
    "ach.streak14":"Racha de 14 Días","ach.streak14Req":"14 días seguidos",
    "ach.streak30":"Recorrido de 30 Días","ach.streak30Req":"30 días seguidos",
    "ach.firstCheckin":"Primer Check-in","ach.firstCheckinReq":"Completa tu primer check-in semanal",
    "ach.goalMilestone":"Meta Intermedia","ach.goalMilestoneReq":"A mitad de camino hacia tu peso meta",
    "ach.referral":"Recomienda BeSlim","ach.referralReq":"Invita a un amigo a unirse",

    "lessons.recommendedTitle":"Recomendado para ti","lessons.recommendedSub":"Según tu plan actual.",
    "plan.disclaimer":"Estimación con fines orientativos. No sustituye la asesoría de un nutricionista o médico.",
    "plan.breakfast":"🍳 Desayuno","plan.lunch":"🥗 Almuerzo","plan.snack":"🍎 Merienda","plan.dinner":"🌙 Cena",

    "plan.myPlanTitle":"Mi Plan","plan.weekOf":"Semana {n} de tu recorrido","plan.mainFocus":"Enfoque principal","plan.focusConsistency":"Constancia",
    "plan.thisWeek":"Esta semana","plan.recommendedLesson":"Clase recomendada",
    "plan.checkinTitle":"Check-in Semanal","plan.checkinSub":"Tómate 2 minutos para actualizar tu progreso.",
    "plan.checkinDone":"El check-in de esta semana ya está completo.","plan.checkinCta":"Comenzar check-in",
    "plan.checkinWeight":"Peso actual (kg)","plan.checkinEnergy":"Nivel de energía","plan.checkinNutrition":"Nutrición esta semana",
    "plan.checkinMovement":"¿Cuántos días te moviste esta semana?","plan.checkinSleep":"Sueño",
    "plan.checkinChallenge":"Mayor dificultad","plan.checkinOverall":"Semana en general",
    "plan.checkinLow":"Muy bajo","plan.checkinExcellent":"Excelente","plan.checkinDifficult":"Difícil","plan.checkinPoor":"Malo",
    "plan.challengeConsistency":"Constancia","plan.challengeFood":"Elección de alimentos","plan.challengeCravings":"Antojos",
    "plan.challengeTime":"Falta de tiempo","plan.challengeMotivation":"Motivación","plan.challengeExercise":"Ejercicio","plan.challengeOther":"Otro",
    "plan.checkinSubmit":"Completar Check-in","plan.checkinSuccess":"¡Check-in completo! 🎉","plan.checkinSuccessSub":"Tu progreso ha sido registrado.",
    "plan.close":"Cerrar",

    "lessons.title":"🎬 Clases",
    "lessons.recommendedLabel":"Recomendado para Ti","lessons.recommendedSub":"Basado en tu plan actual.",
    "lessons.locked":"Bloqueado","lessons.free":"Gratis","lessons.comingSoon":"Video próximamente — adjunta aquí tu enlace de la clase.",
    "lessons.recipeLabel":"Receta","lessons.ingredients":"Ingredientes","lessons.instructions":"Instrucciones",
    "lessons.guideLabel":"Guía de instalación",
    "lessons.recommended":"Recomendado para Ti","lessons.recommendedSub":"Basado en tu plan actual.",

    "shop.title":"Siguiente paso","shop.sub":"Guías y programas para ir más allá.","shop.buy":"Comprar",
    "shop.bestseller":"Más vendido","shop.off":"50% OFF",

    "progress.title":"📈 Progreso","progress.start":"Inicio","progress.current":"Actual","progress.goal":"Meta",
    "progress.streak":"Racha","progress.bestStreak":"Mejor racha","progress.consistency":"Tu Consistencia",
    "progress.achievements":"Logros","progress.locked":"Bloqueado","progress.dayN":"Día {n}",
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
      { title:"Community", duration:"", free:true, url:"https://t.me/+bz0kN-5aazJjMzkx", cover:"assets/lessons/community.png", desc:"Join our private community group." },
      { title:"Start here", duration:"", free:true, key:"start-here", videoFile:"assets/videos/lesson1-start-here.mp4", cover:"assets/lessons/lesson1.jpg", desc:"Begin here — the first steps to get the most out of your BeSlim journey.",
        installGuide:{
          title:"Add BeSlim to your Home Screen",
          subtitle:"So it opens just like an app — one tap, no browser.",
          ios:{
            label:"iPhone",
            steps:[
              "Open BeSlim. If you see ⋯ at the top, tap it, then tap \"Open in Browser\".",
              "At the bottom of the screen, tap the Share button (the square with an arrow pointing up).",
              "Slide the menu up and tap \"Add to Home Screen\".",
              "Type the name \"BeSlim\" and tap \"Add\" in the top right corner."
            ]
          },
          android:{
            label:"Android",
            steps:[
              "Open BeSlim in Chrome.",
              "Tap the three dots (⋮) in the top right corner.",
              "Tap \"Add to Home screen\" (it may say \"Install app\").",
              "Confirm the name \"BeSlim\" and tap \"Add\"."
            ]
          }
        }
      },
      { title:"What stops your weight loss", duration:"", free:true, key:"what-stops", videoFile:"assets/videos/lesson2-what-stops-weight-loss.mp4", cover:"assets/lessons/lesson2.jpg", desc:"The hidden habits that quietly stall your progress." },
      { title:"How to prepare the gelatin trick", duration:"", free:true, key:"gelatin-trick", videoFile:"assets/videos/lesson3-gelatin-trick.mp4", cover:"assets/lessons/lesson3.jpg", desc:"A simple recipe trick to support your routine.",
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
      { title:"The 5 mistakes that prevent weight loss", duration:"", free:true, key:"five-mistakes", videoFile:"assets/videos/lesson4-5-mistakes.mp4", cover:"assets/lessons/lesson4.jpg", desc:"Avoid these five common mistakes holding you back." },
      { title:"Morning ritual to activate slimming", duration:"", free:true, key:"morning-ritual", videoFile:"assets/videos/lesson5-morning-ritual.mp4", cover:"assets/lessons/lesson5.jpg", desc:"A short morning ritual to kickstart your metabolism." },
      { title:"Real stories of women who have lost weight", duration:"", free:true, key:"real-stories", videoFile:"assets/videos/lesson6-real-stories.mp4", cover:"assets/lessons/lesson6.jpg", desc:"Real, relatable stories for extra motivation." }
    ],
    products: [
      { cover:"assets/shop/banner1.jpg", name:"SUPER ACCELERATE 10X", price:"$69", desc:"Accelerate your results 10X in a practical and powerful way.", checkoutUrl:"https://checkout.kashpay.com.br/checkout/checkout-1789193073402?src=APP" },
      { cover:"assets/shop/banner2.jpg", name:"ELIMINATE SAGGINS", price:"$49", desc:"Restore your skin's firmness and achieve a more defined body after weight loss.", checkoutUrl:"https://checkout.kashpay.com.br/checkout/checkout-1789242784519?src=APP" },
      { cover:"assets/shop/banner3.jpg", name:"BYE! STRETCH MARKS", price:"$19", desc:"Reduce stretch marks and restore your skin's beauty.", checkoutUrl:"https://checkout.kashpay.com.br/checkout/checkout-1789244064523?src=APP" }
    ],
    foods: {
      breakfast: ["Greek yogurt with berries and oats","Scrambled eggs with whole-grain toast","Protein oatmeal with banana","Cottage cheese with pineapple"],
      lunch: ["Grilled chicken with rice and vegetables","Tuna salad with quinoa","Turkey wrap with mixed greens","Salmon with sweet potato"],
      snack: ["Protein shake with almond milk","Apple with peanut butter","Handful of almonds and a banana","Rice cakes with cottage cheese"],
      dinner: ["Baked cod with steamed broccoli","Lean beef stir-fry with vegetables","Grilled tofu with brown rice","Chicken soup with whole-grain bread"]
    },
    tasks: {
      nutrition: [
        { key:"follow_plan", emoji:"🥗", title:"Follow today's nutrition plan", desc:"Stick to your meals or your own menu today.", cta:"View" },
        { key:"protein_meal", emoji:"🍗", title:"Add a protein-rich meal", desc:"Include a good protein source in at least one meal.", cta:"View" },
        { key:"log_meal", emoji:"📝", title:"Log at least one meal", desc:"Track something you ate today, right here in the app.", cta:"View" }
      ],
      movement: [
        { key:"walk_15", emoji:"🚶", title:"15 minutes of movement", desc:"A short walk counts — just get moving today.", cta:"Start" },
        { key:"stretch_10", emoji:"🧘", title:"10 minutes of stretching", desc:"Loosen up, especially if you've been sitting a lot.", cta:"Start" },
        { key:"stairs", emoji:"🏃", title:"Take the stairs today", desc:"Skip the elevator at least once today.", cta:"Start" }
      ],
      habit: [
        { key:"hydration", emoji:"💧", title:"Complete your hydration goal", desc:"Aim for 8 glasses of water today.", cta:"Mark as done" },
        { key:"sleep_early", emoji:"😴", title:"Wind down early tonight", desc:"Give yourself a real chance at good sleep.", cta:"Mark as done" },
        { key:"no_snacking", emoji:"🌙", title:"No late-night snacking", desc:"Give your body a break after dinner.", cta:"Mark as done" }
      ]
    },
    monthlyChallenge: { key:"consistency-21", targetDays:21 },
    achievements: {
      streak_7:{ icon:"🏅", title:"First Week", desc:"7 day streak" },
      streak_14:{ icon:"🔥", title:"14 Day Streak", desc:"Two weeks strong" },
      streak_30:{ icon:"🏆", title:"30 Day Journey", desc:"A full month of consistency" },
      first_checkin:{ icon:"📋", title:"First Check-in", desc:"Completed your first weekly check-in" }
    }
  },
  es: {
    lessons: [
      { title:"Comunidad", duration:"", free:true, url:"https://t.me/+bz0kN-5aazJjMzkx", cover:"assets/lessons/community.png", desc:"Únete a nuestro grupo privado de la comunidad." },
      { title:"Empieza aquí", duration:"", free:true, key:"start-here", videoFile:"assets/videos/lesson1-start-here.mp4", cover:"assets/lessons/lesson1.jpg", desc:"Empieza por aquí — los primeros pasos en tu recorrido con BeSlim.",
        installGuide:{
          title:"Agrega BeSlim a tu pantalla de inicio",
          subtitle:"Así se abre como una app — con un solo toque, sin navegador.",
          ios:{
            label:"iPhone",
            steps:[
              "Abre BeSlim. Si ves ⋯ arriba, tócalo y luego toca \"Abrir en el navegador\".",
              "En la parte de abajo de la pantalla, toca el botón Compartir (el cuadrado con una flecha hacia arriba).",
              "Desliza el menú hacia arriba y toca \"Agregar a pantalla de inicio\".",
              "Escribe el nombre \"BeSlim\" y toca \"Agregar\" en la esquina superior derecha."
            ]
          },
          android:{
            label:"Android",
            steps:[
              "Abre BeSlim en Chrome.",
              "Toca los tres puntos (⋮) en la esquina superior derecha.",
              "Toca \"Agregar a pantalla de inicio\" (puede decir \"Instalar app\").",
              "Confirma el nombre \"BeSlim\" y toca \"Agregar\"."
            ]
          }
        }
      },
      { title:"Qué frena tu pérdida de peso", duration:"", free:true, key:"what-stops", videoFile:"assets/videos/lesson2-what-stops-weight-loss.mp4", cover:"assets/lessons/lesson2.jpg", desc:"Los hábitos ocultos que frenan tu progreso en silencio." },
      { title:"Cómo preparar el truco de la gelatina", duration:"", free:true, key:"gelatin-trick", videoFile:"assets/videos/lesson3-gelatin-trick.mp4", cover:"assets/lessons/lesson3.jpg", desc:"Un truco sencillo de receta para apoyar tu rutina.",
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
      { title:"Los 5 errores que impiden bajar de peso", duration:"", free:true, key:"five-mistakes", videoFile:"assets/videos/lesson4-5-mistakes.mp4", cover:"assets/lessons/lesson4.jpg", desc:"Evita estos cinco errores comunes que te frenan." },
      { title:"Ritual matutino para activar tu metabolismo", duration:"", free:true, key:"morning-ritual", videoFile:"assets/videos/lesson5-morning-ritual.mp4", cover:"assets/lessons/lesson5.jpg", desc:"Un breve ritual matutino para activar tu metabolismo." },
      { title:"Historias reales de mujeres que bajaron de peso", duration:"", free:true, key:"real-stories", videoFile:"assets/videos/lesson6-real-stories.mp4", cover:"assets/lessons/lesson6.jpg", desc:"Historias reales y cercanas para motivarte." }
    ],
    products: [
      { cover:"assets/shop/banner1.jpg", name:"SUPER ACCELERATE 10X", price:"$69", desc:"Acelera tus resultados 10 veces de forma práctica y poderosa.", checkoutUrl:"https://checkout.kashpay.com.br/checkout/checkout-1789193073402?src=APP" },
      { cover:"assets/shop/banner2.jpg", name:"ELIMINATE SAGGINS", price:"$49", desc:"Recupera la firmeza de tu piel y logra un cuerpo más definido después de bajar de peso.", checkoutUrl:"https://checkout.kashpay.com.br/checkout/checkout-1789242784519?src=APP" },
      { cover:"assets/shop/banner3.jpg", name:"BYE! STRETCH MARKS", price:"$19", desc:"Reduce las estrías y recupera la belleza de tu piel.", checkoutUrl:"https://checkout.kashpay.com.br/checkout/checkout-1789244064523?src=APP" }
    ],
    foods: {
      breakfast: ["Yogur griego con frutos rojos y avena","Huevos revueltos con pan integral","Avena proteica con plátano","Requesón con piña"],
      lunch: ["Pollo a la plancha con arroz y verduras","Ensalada de atún con quinoa","Wrap de pavo con hojas verdes","Salmón con batata"],
      snack: ["Batido de proteína con leche de almendra","Manzana con mantequilla de maní","Puñado de almendras y un plátano","Tortitas de arroz con requesón"],
      dinner: ["Bacalao al horno con brócoli al vapor","Salteado de res magra con verduras","Tofu a la plancha con arroz integral","Sopa de pollo con pan integral"]
    },
    tasks: {
      nutrition: [
        { key:"follow_plan", emoji:"🥗", title:"Sigue tu plan de nutrición de hoy", desc:"Cúmplelo con tus comidas o tu propio menú hoy.", cta:"Ver" },
        { key:"protein_meal", emoji:"🍗", title:"Agrega una comida rica en proteína", desc:"Incluye una buena fuente de proteína en al menos una comida.", cta:"Ver" },
        { key:"log_meal", emoji:"📝", title:"Registra al menos una comida", desc:"Anota algo que comiste hoy, aquí mismo en la app.", cta:"Ver" }
      ],
      movement: [
        { key:"walk_15", emoji:"🚶", title:"15 minutos de movimiento", desc:"Una caminata corta cuenta — solo muévete hoy.", cta:"Empezar" },
        { key:"stretch_10", emoji:"🧘", title:"10 minutos de estiramiento", desc:"Relájate, sobre todo si has estado mucho tiempo sentado.", cta:"Empezar" },
        { key:"stairs", emoji:"🏃", title:"Usa las escaleras hoy", desc:"Evita el ascensor al menos una vez hoy.", cta:"Empezar" }
      ],
      habit: [
        { key:"hydration", emoji:"💧", title:"Completa tu meta de hidratación", desc:"Intenta tomar 8 vasos de agua hoy.", cta:"Marcar como hecho" },
        { key:"sleep_early", emoji:"😴", title:"Relájate temprano esta noche", desc:"Date una verdadera oportunidad de dormir bien.", cta:"Marcar como hecho" },
        { key:"no_snacking", emoji:"🌙", title:"Sin picar de noche", desc:"Dale un descanso a tu cuerpo después de cenar.", cta:"Marcar como hecho" }
      ]
    },
    monthlyChallenge: { key:"consistency-21", targetDays:21 },
    achievements: {
      streak_7:{ icon:"🏅", title:"Primera Semana", desc:"Racha de 7 días" },
      streak_14:{ icon:"🔥", title:"Racha de 14 Días", desc:"Dos semanas seguidas" },
      streak_30:{ icon:"🏆", title:"30 Días de Recorrido", desc:"Un mes completo de constancia" },
      first_checkin:{ icon:"📋", title:"Primer Check-in", desc:"Completaste tu primer check-in semanal" }
    }
  }
};
