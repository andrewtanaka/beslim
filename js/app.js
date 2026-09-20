/* ============================================================
   BeSlim — app logic
   Profile, meals and weight history are stored in Supabase
   (per-user, protected by Row Level Security). Language and menu
   shuffle stay local since they're per-device/ephemeral.
   Edit CONTENT and I18N in js/i18n.js to change lessons, products,
   food samples or text.
   ============================================================ */

const SUPABASE_URL = "https://mawsuqfojdzqupubzqkl.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_jltSJ29hFYijb9p2Ez8mBg_2DKm8Gxi";
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// TEMPORARY open-access phase: every account created by the
// "passwordless-login" edge function shares this password, so the
// client can sign in right after without the person ever seeing it.
// Must match SHARED_PASSWORD in that function. Remove/rotate this
// once real access control (whitelist or OTP) comes back.
const OPEN_ACCESS_PASSWORD = "beslim-open-access-2026!";

/* ---------- storage keys (local/device-only data) ---------- */
const LS_LANG = "beslim_lang";
const LS_MENU_SEED = "beslim_menu_seed";

/* ---------- state ---------- */
let lang = localStorage.getItem(LS_LANG) || "en";
let profile = null;
let mealsData = null;
let weights = [];
let weightsLoaded = false;
let currentUser = null;

/* My Plan Vivo state (session-cached, reset on logout) */
let myTasks = null;          // { date, done:Set(category) }
let streakInfo = null;       // { current, longest, last }
let achievementsUnlocked = null; // Set(achievement_key)
let pointsTotal = null;      // number
let lastCheckin = null;      // row | false | null(unknown yet)

const onbSelections = { gender:null, activity:null, goal:null };

function t(key){
  const dict = I18N[lang] || I18N.en;
  return dict[key] !== undefined ? dict[key] : (I18N.en[key] || key);
}

function todayStr(){
  const d = new Date();
  return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
}

/* ============================================================
   i18n rendering
   ============================================================ */
function applyI18n(){
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    el.textContent = t(el.getAttribute("data-i18n"));
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el=>{
    el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder")));
  });
  document.querySelectorAll("#langToggle button").forEach(b=>{
    b.classList.toggle("is-active", b.dataset.lang === lang);
  });
  document.documentElement.lang = lang;
}

/* ============================================================
   Auth (Supabase — open access, email only, no verification)
   TEMPORARY: any email gets in. Backed by the "passwordless-login"
   edge function, which creates (or reuses) an account for that
   email using a shared password. Easy to lock down later — see
   the comment above SHARED_PASSWORD usage below.
   ============================================================ */
function showAuthScreen(){
  document.getElementById("mainApp").hidden = true;
  document.getElementById("onboarding").hidden = true;
  document.getElementById("authScreen").hidden = false;
  document.getElementById("authError").hidden = true;
  document.getElementById("authNotice").hidden = true;
}

async function handleEmailSubmit(){
  const email = document.getElementById("authEmail").value.trim().toLowerCase();
  const errEl = document.getElementById("authError");
  errEl.hidden = true;

  if(!email || !email.includes("@")){
    errEl.textContent = t("auth.errFields");
    errEl.hidden = false;
    return;
  }

  const btn = document.getElementById("authSubmit");
  btn.disabled = true;
  try{
    const { error: fnError } = await sb.functions.invoke("passwordless-login", { body: { email } });
    if(fnError) throw fnError;

    const { data, error } = await sb.auth.signInWithPassword({ email, password: OPEN_ACCESS_PASSWORD });
    if(error) throw error;

    currentUser = data.user;
    await loadProfileAndEnter();
  }catch(err){
    errEl.textContent = (err && err.message) ? err.message : t("auth.errGeneric");
    errEl.hidden = false;
  }finally{
    btn.disabled = false;
  }
}

function initAuthHandlers(){
  document.getElementById("authSubmit").addEventListener("click", handleEmailSubmit);
  document.getElementById("authEmail").addEventListener("keydown", e=>{
    if(e.key === "Enter") handleEmailSubmit();
  });
}

async function loadProfileAndEnter(){
  const { data } = await sb.from("profiles").select("*").eq("id", currentUser.id).maybeSingle();
  if(data){
    profile = {
      name: data.name, age: Number(data.age), weight: Number(data.weight), height: Number(data.height),
      goalWeight: Number(data.goal_weight), gender: data.gender, activity: Number(data.activity),
      goal: data.goal, createdAt: (data.created_at || "").slice(0,10) || todayStr()
    };
    enterMainApp();
  }else{
    document.getElementById("authScreen").hidden = true;
    document.getElementById("onboarding").hidden = false;
    showOnbStep(1);
  }
}

function initLogoutHandler(){
  document.getElementById("logoutBtn").addEventListener("click", async ()=>{
    await sb.auth.signOut();
    currentUser = null;
    profile = null;
    mealsData = null;
    weights = [];
    weightsLoaded = false;
    myMenu = null;
    myTasks = null;
    streakInfo = null;
    achievementsUnlocked = null;
    pointsTotal = null;
    lastCheckin = null;
    document.getElementById("authEmail").value = "";
    showAuthScreen();
  });
}

/* ============================================================
   Onboarding
   ============================================================ */
function showOnbStep(step){
  document.querySelectorAll(".onb-step").forEach(el=>{
    el.hidden = el.getAttribute("data-step") !== String(step);
  });
}

function initOnboardingHandlers(){
  document.getElementById("genderSelect").addEventListener("click", e=>{
    const btn = e.target.closest(".seg-btn");
    if(!btn) return;
    onbSelections.gender = btn.dataset.value;
    [...btn.parentElement.children].forEach(b=>b.classList.toggle("is-selected", b===btn));
  });

  document.getElementById("goalSelect").addEventListener("click", e=>{
    const btn = e.target.closest(".seg-btn");
    if(!btn) return;
    onbSelections.goal = btn.dataset.value;
    [...btn.parentElement.children].forEach(b=>b.classList.toggle("is-selected", b===btn));
  });

  document.getElementById("activitySelect").addEventListener("click", e=>{
    const btn = e.target.closest(".opt-btn");
    if(!btn) return;
    onbSelections.activity = btn.dataset.value;
    [...btn.parentElement.children].forEach(b=>b.classList.toggle("is-selected", b===btn));
  });

  document.getElementById("toStep2").addEventListener("click", ()=>{
    const age = document.getElementById("inputAge").value;
    if(!age || !onbSelections.gender){
      shake(document.getElementById("toStep2"));
      return;
    }
    showOnbStep(2);
  });

  document.getElementById("toStep1Back").addEventListener("click", ()=>showOnbStep(1));
  document.getElementById("toStep2Back").addEventListener("click", ()=>showOnbStep(2));

  document.getElementById("toStep3").addEventListener("click", ()=>{
    const w = document.getElementById("inputWeight").value;
    const h = document.getElementById("inputHeight").value;
    if(!w || !h){
      shake(document.getElementById("toStep3"));
      return;
    }
    showOnbStep(3);
  });

  document.getElementById("toCalculating").addEventListener("click", ()=>{
    if(!onbSelections.activity || !onbSelections.goal){
      shake(document.getElementById("toCalculating"));
      return;
    }
    runCalculatingAnimation();
  });
}

function shake(el){
  el.style.transition = "transform .08s";
  el.style.transform = "translateX(-4px)";
  setTimeout(()=>{ el.style.transform="translateX(4px)"; },80);
  setTimeout(()=>{ el.style.transform="translateX(0)"; },160);
}

function runCalculatingAnimation(){
  showOnbStep("loading");
  const fill = document.getElementById("loadingFill");
  const pct = document.getElementById("loadingPercent");
  const items = document.querySelectorAll("#loadingChecklist li");
  let progress = 0;
  const totalMs = 2200;
  const stepMs = 40;
  const increment = 100 / (totalMs/stepMs);

  const timer = setInterval(()=>{
    progress = Math.min(100, progress + increment);
    fill.style.width = progress + "%";
    pct.textContent = Math.round(progress) + "%";

    items.forEach((li,i)=>{
      const threshold = (i+1) * (100/items.length);
      if(progress >= threshold - 2){ li.classList.add("is-done"); }
    });

    if(progress >= 100){
      clearInterval(timer);
      setTimeout(finishOnboarding, 350);
    }
  }, stepMs);
}

async function finishOnboarding(){
  const name = document.getElementById("inputName").value.trim();
  const age = parseFloat(document.getElementById("inputAge").value);
  const weight = parseFloat(document.getElementById("inputWeight").value);
  const height = parseFloat(document.getElementById("inputHeight").value);
  const goalWeight = parseFloat(document.getElementById("inputGoalWeight").value) || weight;
  const activity = parseFloat(onbSelections.activity);

  const { error } = await sb.from("profiles").upsert({
    id: currentUser.id,
    name, age, weight, height,
    goal_weight: goalWeight,
    gender: onbSelections.gender,
    activity,
    goal: onbSelections.goal,
    updated_at: new Date().toISOString()
  });

  if(error){
    alert(error.message || t("auth.errGeneric"));
    showOnbStep(3);
    return;
  }

  profile = { name, age, weight, height, goalWeight, gender: onbSelections.gender, activity, goal: onbSelections.goal, createdAt: todayStr() };

  const { data: existingLogs } = await sb.from("weight_logs").select("id").eq("user_id", currentUser.id).limit(1);
  if(!existingLogs || existingLogs.length === 0){
    await sb.from("weight_logs").insert({ user_id: currentUser.id, date: todayStr(), value: weight });
  }

  enterMainApp();
}

/* ============================================================
   Calculations
   ============================================================ */
function computeCalcs(p){
  let bmr;
  if(p.gender === "male"){
    bmr = 10*p.weight + 6.25*p.height - 5*p.age + 5;
  }else{
    bmr = 10*p.weight + 6.25*p.height - 5*p.age - 161;
  }
  const tdee = bmr * p.activity;

  let targetKcal;
  if(p.goal === "lose"){
    targetKcal = Math.max(1200, tdee - 500);
  }else if(p.goal === "gain"){
    targetKcal = tdee + 300;
  }else{
    targetKcal = tdee;
  }

  const proteinG = Math.round(p.weight * 1.8);
  const fatG = Math.round((targetKcal * 0.25) / 9);
  const carbsKcal = Math.max(0, targetKcal - (proteinG*4) - (fatG*9));
  const carbsG = Math.round(carbsKcal / 4);

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    targetKcal: Math.round(targetKcal),
    proteinG, carbsG, fatG
  };
}

/* ============================================================
   Meals (Home tab)
   ============================================================ */
function loadMealsForToday(){
  // Cached per day — once loaded, tab switches reuse the in-memory
  // copy instead of re-querying Supabase every time (that round trip
  // was the main source of the delay when switching to Home).
  if(mealsData && mealsData.date === todayStr()){
    return Promise.resolve();
  }
  return sb.from("meals")
    .select("*")
    .eq("user_id", currentUser.id)
    .eq("date", todayStr())
    .order("created_at")
    .then(({ data })=>{
      mealsData = { date: todayStr(), items: (data || []).map(r=>({ id:r.id, name:r.name, kcal:Number(r.kcal), time:r.time })) };
    });
}

const QUICK_ADD_PRESETS = [
  { key:"home.qaBreakfast", kcal:420 },
  { key:"home.qaLunch", kcal:650 },
  { key:"home.qaSnack", kcal:200 },
  { key:"home.qaDinner", kcal:580 }
];

function renderMealQuickadd(){
  const wrap = document.getElementById("mealQuickadd");
  wrap.innerHTML = "";
  QUICK_ADD_PRESETS.forEach(preset=>{
    const btn = document.createElement("button");
    btn.className = "qa-btn";
    btn.textContent = `+ ${t(preset.key)}`;
    btn.addEventListener("click", ()=> openAddMealModal(t(preset.key)));
    wrap.appendChild(btn);
  });
}

function openAddMealModal(prefillName){
  document.getElementById("addMealName").value = prefillName || "";
  document.getElementById("addMealKcal").value = "";
  document.getElementById("addMealOverlay").hidden = false;
}

function initAddMealHandlers(){
  document.getElementById("closeAddMeal").addEventListener("click", ()=>{
    document.getElementById("addMealOverlay").hidden = true;
  });
  document.getElementById("addMealOverlay").addEventListener("click", e=>{
    if(e.target.id === "addMealOverlay") document.getElementById("addMealOverlay").hidden = true;
  });
  document.getElementById("addMealForm").addEventListener("submit", async e=>{
    e.preventDefault();
    const name = document.getElementById("addMealName").value.trim();
    const kcal = Number(document.getElementById("addMealKcal").value);
    if(!name || !kcal) return;
    const now = new Date();
    const time = now.toLocaleTimeString(lang==="es"?"es-ES":"en-US", { hour:"2-digit", minute:"2-digit" });
    const btn = document.getElementById("addMealSubmitBtn");
    btn.disabled = true;
    const { data, error } = await sb.from("meals").insert({
      user_id: currentUser.id, date: todayStr(), name, kcal, time
    }).select().single();
    btn.disabled = false;
    if(!error){
      mealsData.items.push({ id:data.id, name:data.name, kcal:Number(data.kcal), time:data.time });
      document.getElementById("addMealOverlay").hidden = true;
      renderHome();
    }
  });
}

function renderMealList(){
  const list = document.getElementById("mealList");
  list.innerHTML = "";
  if(!mealsData.items.length){
    const empty = document.createElement("li");
    empty.className = "empty-state";
    empty.textContent = t("home.emptyMeals");
    list.appendChild(empty);
    return;
  }
  mealsData.items.forEach(item=>{
    const li = document.createElement("li");
    li.className = "meal-item";
    const match = item.name.match(/^(\p{Emoji_Presentation}|\p{Extended_Pictographic})\s*(.*)$/u);
    const emoji = match ? match[1] : "🍽️";
    const label = match ? match[2] : item.name;
    li.innerHTML = `
      <div class="meal-item-thumb"><span class="meal-emoji">${emoji}</span></div>
      <div class="meal-item-body">
        <div class="meal-item-name">${label}</div>
        <div class="meal-item-meta">${item.time || ""}</div>
      </div>
      <span class="meal-item-kcal">${item.kcal} kcal</span>
      <button class="meal-remove" aria-label="remove">×</button>`;
    li.querySelector(".meal-remove").addEventListener("click", async ()=>{
      await sb.from("meals").delete().eq("id", item.id);
      mealsData.items = mealsData.items.filter(i=>i.id!==item.id);
      renderHome();
    });
    list.appendChild(li);
  });
}

/* ============================================================
   Day-of-year helper (used for task/tip rotation)
   ============================================================ */
function dayOfYear(){
  const now = new Date();
  const start = new Date(now.getFullYear(),0,0);
  const diff = now - start;
  return Math.floor(diff / 86400000);
}

/* ============================================================
   HOME tab
   ============================================================ */
async function renderHome(){
  await loadMealsForToday();
  const calc = computeCalcs(profile);

  document.getElementById("greetingText").textContent =
    profile.name ? `${t("home.greetingHi")}, ${profile.name} 👋` : `${t("home.greetingHi")} 👋`;

  const dateFmt = new Intl.DateTimeFormat(lang === "es" ? "es-ES" : "en-US", { weekday:"long", day:"numeric", month:"long" });
  document.getElementById("dateTitle").textContent = capitalize(dateFmt.format(new Date()));

  const consumed = mealsData.items.reduce((s,i)=>s+i.kcal, 0);
  const remaining = Math.max(0, calc.targetKcal - consumed);
  const pct = calc.targetKcal ? Math.min(1, consumed / calc.targetKcal) : 0;

  document.getElementById("kcalTarget").textContent = calc.targetKcal;
  document.getElementById("kcalConsumed").textContent = consumed;
  document.getElementById("kcalRemaining").textContent = remaining;

  const circumference = 2 * Math.PI * 34;
  const ring = document.getElementById("ringProgress");
  ring.setAttribute("stroke-dasharray", circumference);
  ring.setAttribute("stroke-dashoffset", circumference * (1 - pct));

  // macro estimate consumed proportional to kcal consumed vs target (simple approximation)
  const ratio = calc.targetKcal ? consumed / calc.targetKcal : 0;
  setMiniRing("protein", Math.round(calc.proteinG*ratio), calc.proteinG);
  setMiniRing("carbs", Math.round(calc.carbsG*ratio), calc.carbsG);
  setMiniRing("fat", Math.round(calc.fatG*ratio), calc.fatG);

  renderDayStrip();
  renderMealQuickadd();
  renderMealList();
  await renderTodayPlan();
  await renderHomeChallenge();
}

function setMiniRing(key, consumedVal, targetG){
  const remainingG = Math.max(0, targetG - consumedVal);
  const pct = targetG ? Math.min(1, consumedVal/targetG) : 0;
  document.getElementById(key+"Val").textContent = `${remainingG}g`;
  const circumference = 2 * Math.PI * 16;
  const ring = document.getElementById(key+"Ring");
  ring.setAttribute("stroke-dasharray", circumference);
  ring.setAttribute("stroke-dashoffset", circumference * (1 - pct));
}

function renderDayStrip(){
  const strip = document.getElementById("dayStrip");
  strip.innerHTML = "";
  const today = new Date();
  const dow = (today.getDay() + 6) % 7; // 0 = Monday
  const monday = new Date(today);
  monday.setDate(today.getDate() - dow);
  const dayFmt = new Intl.DateTimeFormat(lang === "es" ? "es-ES" : "en-US", { weekday:"narrow" });

  for(let i=0;i<7;i++){
    const d = new Date(monday);
    d.setDate(monday.getDate()+i);
    const isToday = d.toDateString() === today.toDateString();
    const chip = document.createElement("div");
    chip.className = "day-chip" + (isToday ? " is-today" : "");
    chip.innerHTML = `<span class="day-chip-label">${dayFmt.format(d).toUpperCase()}</span><span class="day-chip-num">${d.getDate()}</span>`;
    strip.appendChild(chip);
  }
}

function capitalize(str){
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/* ============================================================
   PLAN tab
   ============================================================ */
let myMenu = null; // { breakfast, lunch, snack, dinner } | null, cached per session

async function renderPlan(){
  const calc = computeCalcs(profile);
  document.getElementById("bmrValue").textContent = calc.bmr;
  document.getElementById("tdeeValue").textContent = calc.tdee;
  document.getElementById("macroProteinG").textContent = calc.proteinG + "g";
  document.getElementById("macroCarbsG").textContent = calc.carbsG + "g";
  document.getElementById("macroFatG").textContent = calc.fatG + "g";
  await renderMyPlanHeader();
}

/* ============================================================
   My Plan Vivo — daily tasks, streak, points, achievements,
   weekly check-in, recommended lesson, monthly challenge.
   All persisted in Supabase, scoped to the signed-in user.
   ============================================================ */

function getWeekStartStr(){
  const today = new Date();
  const dow = (today.getDay() + 6) % 7; // 0 = Monday
  const monday = new Date(today);
  monday.setDate(today.getDate() - dow);
  return monday.getFullYear()+"-"+String(monday.getMonth()+1).padStart(2,"0")+"-"+String(monday.getDate()).padStart(2,"0");
}

const DIFFICULTY_LESSON_MAP = {
  consistency:"start-here", food:"gelatin-trick", cravings:"gelatin-trick",
  time:"morning-ritual", motivation:"real-stories", exercise:"what-stops", other:"five-mistakes"
};

function getAchievementDefs(){
  return [
    { key:"streak_7", icon:"🏅", titleKey:"ach.firstWeek", reqKey:"ach.firstWeekReq", reqType:"streak", reqValue:7 },
    { key:"streak_14", icon:"🔥", titleKey:"ach.streak14", reqKey:"ach.streak14Req", reqType:"streak", reqValue:14 },
    { key:"streak_30", icon:"🏆", titleKey:"ach.streak30", reqKey:"ach.streak30Req", reqType:"streak", reqValue:30 },
    { key:"first_checkin", icon:"📋", titleKey:"ach.firstCheckin", reqKey:"ach.firstCheckinReq", reqType:"checkin", reqValue:1 },
    { key:"goal_milestone", icon:"🎯", titleKey:"ach.goalMilestone", reqKey:"ach.goalMilestoneReq", reqType:"goal", reqValue:0.5 },
    { key:"referral", icon:"🤝", titleKey:"ach.referral", reqKey:"ach.referralReq", reqType:"referral", reqValue:1 }
  ];
}

/* ---------- Today's Challenge (Home) — one task a day ---------- */
const TASK_CATEGORY_ORDER = ["nutrition","movement","habit"];

function pickTask(category){
  const pool = CONTENT[lang].tasks[category];
  return pool[dayOfYear() % pool.length];
}

function todaysCategory(){
  return TASK_CATEGORY_ORDER[dayOfYear() % TASK_CATEGORY_ORDER.length];
}

async function loadTodayTasks(){
  if(myTasks && myTasks.date === todayStr()) return;
  const { data } = await sb.from("user_daily_tasks").select("category").eq("user_id", currentUser.id).eq("date", todayStr());
  myTasks = { date: todayStr(), done: new Set((data||[]).map(r=>r.category)) };
}

async function renderTodayPlan(){
  await loadTodayTasks();
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  const cat = todaysCategory();
  const task = pickTask(cat);
  const isDone = myTasks.done.has(cat);

  const row = document.createElement("div");
  row.className = "task-item" + (isDone ? " is-done" : "");
  row.innerHTML = `
    <div class="task-icon">${task.emoji}</div>
    <div class="task-body"><strong>${task.title}</strong><p>${task.desc}</p></div>
    <button class="task-check${isDone ? " is-done" : ""}" aria-label="${t("today.done")}">
      ${isDone ? "✓" : ""}
    </button>`;
  if(!isDone){
    row.querySelector(".task-check").addEventListener("click", (e)=>completeTask(cat, task.key, e.currentTarget));
  }
  list.appendChild(row);

  await renderStreakPill();
}

async function completeTask(category, taskKey, btnEl){
  const { error } = await sb.from("user_daily_tasks").insert({
    user_id: currentUser.id, date: todayStr(), category, task_key: taskKey
  });
  if(error) return; // already completed (duplicate click) — ignore quietly
  myTasks.done.add(category);
  await awardPoints(10, "daily_task");
  await updateStreakAfterCompletion();
  await checkAchievements();
  showPointsToast(10, btnEl);
  renderTodayPlan();
}

/* ---------- Points-earned toast animation ---------- */
function showPointsToast(amount, anchorEl){
  const toast = document.getElementById("pointsToast");
  toast.textContent = `+${amount} ${t("home.pointsEarned")}`;
  toast.hidden = false;
  toast.classList.remove("is-animating");
  // force reflow so the animation restarts if triggered again quickly
  void toast.offsetWidth;
  toast.classList.add("is-animating");
  setTimeout(()=>{ toast.hidden = true; toast.classList.remove("is-animating"); }, 1400);
}

/* ---------- Streak ---------- */
async function loadStreak(){
  if(streakInfo) return;
  const { data } = await sb.from("streaks").select("*").eq("user_id", currentUser.id).maybeSingle();
  streakInfo = data
    ? { current:data.current_streak, longest:data.longest_streak, last:data.last_completed_date }
    : { current:0, longest:0, last:null };
}

async function updateStreakAfterCompletion(){
  await loadStreak();
  const today = todayStr();
  let current = streakInfo.current, longest = streakInfo.longest;
  if(streakInfo.last === today){
    // already counted today, nothing to do
  }else{
    const y = new Date(); y.setDate(y.getDate()-1);
    const yStr = y.getFullYear()+"-"+String(y.getMonth()+1).padStart(2,"0")+"-"+String(y.getDate()).padStart(2,"0");
    current = (streakInfo.last === yStr) ? streakInfo.current + 1 : 1;
    longest = Math.max(streakInfo.longest||0, current);
  }
  await sb.from("streaks").upsert(
    { user_id: currentUser.id, current_streak: current, longest_streak: longest, last_completed_date: today },
    { onConflict:"user_id" }
  );
  streakInfo = { current, longest, last: today };
}

async function renderStreakPill(){
  await loadStreak();
  const pill = document.getElementById("homeStreakPill");
  if(streakInfo.current > 0){
    pill.textContent = `🔥 ${streakInfo.current} ${t("home.streakDays")}`;
    pill.hidden = false;
  }else{
    pill.hidden = true;
  }
}

/* ---------- Points ---------- */
async function loadPoints(){
  if(pointsTotal !== null) return;
  const { data } = await sb.from("points").select("amount").eq("user_id", currentUser.id);
  pointsTotal = (data||[]).reduce((s,r)=>s+Number(r.amount), 0);
}

async function awardPoints(amount, reason){
  await sb.from("points").insert({ user_id: currentUser.id, amount, reason });
  await loadPoints();
  pointsTotal += amount;
}

/* ---------- Achievements ---------- */
async function loadAchievements(){
  if(achievementsUnlocked) return;
  const { data } = await sb.from("user_achievements").select("achievement_key").eq("user_id", currentUser.id);
  achievementsUnlocked = new Set((data||[]).map(r=>r.achievement_key));
}

async function checkAchievements(){
  await loadAchievements();
  await loadStreak();
  for(const def of getAchievementDefs()){
    if(achievementsUnlocked.has(def.key)) continue;
    let qualifies = false;
    if(def.reqType === "streak") qualifies = streakInfo.current >= def.reqValue;
    else if(def.reqType === "checkin") qualifies = !!lastCheckin;
    else if(def.reqType === "goal" && profile){
      const start = profile.weight, goal = profile.goalWeight;
      const currentW = weightsLoaded && weights.length ? weights[weights.length-1].value : start;
      const total = Math.abs(goal - start);
      qualifies = total > 0 && (Math.abs(start - currentW)/total) >= def.reqValue;
    }
    if(qualifies){
      const { error } = await sb.from("user_achievements").insert({ user_id: currentUser.id, achievement_key: def.key });
      if(!error){
        achievementsUnlocked.add(def.key);
        if(def.key === "streak_7") await awardPoints(100, "streak_7_bonus");
      }
    }
  }
}

/* ---------- Weekly check-in ---------- */
async function loadLastCheckin(){
  if(lastCheckin !== null) return;
  const { data } = await sb.from("weekly_checkins").select("*").eq("user_id", currentUser.id).eq("week_start", getWeekStartStr()).maybeSingle();
  lastCheckin = data || false;
}

function renderScaleSelect(containerId){
  const el = document.getElementById(containerId);
  el.innerHTML = "";
  el.dataset.value = "";
  for(let i=1;i<=5;i++){
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = String(i);
    btn.addEventListener("click", ()=>{
      el.querySelectorAll("button").forEach(b=>b.classList.toggle("is-selected", b===btn));
      el.dataset.value = String(i);
    });
    el.appendChild(btn);
  }
}

async function openCheckinModal(){
  await loadLastCheckin();
  document.getElementById("checkinForm").hidden = false;
  document.getElementById("checkinSuccess").hidden = true;
  document.getElementById("checkinError").hidden = true;
  renderScaleSelect("checkinEnergy");
  renderScaleSelect("checkinNutrition");
  renderScaleSelect("checkinSleep");
  renderScaleSelect("checkinOverall");
  document.querySelectorAll("#checkinDifficulty .opt-btn").forEach(b=>b.classList.remove("is-selected"));
  document.getElementById("checkinWeight").value = profile.weight || "";
  document.getElementById("checkinMovement").value = "";
  document.getElementById("checkinOverlay").hidden = false;
}

function initCheckinHandlers(){
  document.getElementById("openCheckinBtn").addEventListener("click", openCheckinModal);
  document.getElementById("closeCheckin").addEventListener("click", ()=>{ document.getElementById("checkinOverlay").hidden = true; });
  document.getElementById("checkinOverlay").addEventListener("click", e=>{
    if(e.target.id === "checkinOverlay") document.getElementById("checkinOverlay").hidden = true;
  });
  document.getElementById("checkinDifficulty").addEventListener("click", e=>{
    const btn = e.target.closest(".opt-btn");
    if(!btn) return;
    document.querySelectorAll("#checkinDifficulty .opt-btn").forEach(b=>b.classList.toggle("is-selected", b===btn));
  });

  document.getElementById("checkinForm").addEventListener("submit", async e=>{
    e.preventDefault();
    const errEl = document.getElementById("checkinError");
    errEl.hidden = true;

    const weight = parseFloat(document.getElementById("checkinWeight").value);
    const energy = document.getElementById("checkinEnergy").dataset.value;
    const nutrition = document.getElementById("checkinNutrition").dataset.value;
    const movement = document.getElementById("checkinMovement").value;
    const sleep = document.getElementById("checkinSleep").dataset.value;
    const diffBtn = document.querySelector("#checkinDifficulty .opt-btn.is-selected");
    const overall = document.getElementById("checkinOverall").dataset.value;

    if(!weight || !energy || !nutrition || movement === "" || !sleep || !diffBtn || !overall){
      errEl.textContent = t("auth.errFields");
      errEl.hidden = false;
      return;
    }

    const entry = {
      user_id: currentUser.id, week_start: getWeekStartStr(), weight,
      energy_level:Number(energy), nutrition_score:Number(nutrition), movement_days:Number(movement),
      sleep_score:Number(sleep), main_difficulty:diffBtn.dataset.value, overall_score:Number(overall)
    };

    const btn = document.getElementById("checkinSubmitBtn");
    btn.disabled = true;
    const { error } = await sb.from("weekly_checkins").upsert(entry, { onConflict:"user_id,week_start" });
    btn.disabled = false;
    if(error){
      errEl.textContent = t("auth.errGeneric");
      errEl.hidden = false;
      return;
    }

    lastCheckin = entry;
    await sb.from("weight_logs").insert({ user_id: currentUser.id, date: todayStr(), value: weight });
    weightsLoaded = false;
    await awardPoints(50, "weekly_checkin");
    await checkAchievements();

    document.getElementById("checkinForm").hidden = true;
    document.getElementById("checkinSuccess").hidden = false;
    renderMyPlanHeader();
    renderMyPlanThisWeek();
  });
}

/* ---------- Plan tab — My Plan header + this week + recommended lesson ---------- */
function computeJourneyWeek(){
  const created = profile.createdAt ? new Date(profile.createdAt) : new Date();
  const diffDays = Math.floor((new Date() - created) / 86400000);
  return Math.max(1, Math.floor(diffDays/7) + 1);
}

function getRecommendedLesson(){
  const key = (lastCheckin && DIFFICULTY_LESSON_MAP[lastCheckin.main_difficulty]) || "start-here";
  return CONTENT[lang].lessons.find(l=>l.key===key) || CONTENT[lang].lessons[0];
}

async function renderMyPlanHeader(){
  await loadLastCheckin();
  const week = computeJourneyWeek();
  document.getElementById("planWeekLabel").textContent = t("plan.weekOf").replace("{n}", week);
  document.getElementById("planWeekBar").style.width = Math.min(100, (((week-1)%4)+1)*25) + "%";

  const sub = document.getElementById("checkinCardSub");
  const btn = document.getElementById("openCheckinBtn");
  if(lastCheckin){
    sub.textContent = t("plan.checkinDone");
    btn.textContent = t("checkin.doneThisWeek");
    btn.classList.add("btn-small-done");
  }else{
    sub.textContent = t("plan.checkinSub");
    btn.textContent = t("plan.checkinBtn");
    btn.classList.remove("btn-small-done");
  }
}

/* ---------- Progress tab additions ---------- */
async function computeWeeklyConsistency(){
  const end = new Date();
  const start = new Date(); start.setDate(end.getDate()-6);
  const fmt = d => d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
  const { data } = await sb.from("user_daily_tasks")
    .select("date").eq("user_id", currentUser.id).gte("date", fmt(start)).lte("date", fmt(end));
  const activeDays = new Set((data||[]).map(r=>r.date));
  return Math.round((activeDays.size/7)*100);
}

async function renderProgressExtras(){
  await loadStreak();
  await loadPoints();
  await loadAchievements();
  await loadTodayTasks();
  await loadLastCheckin();

  document.getElementById("progressDayN").textContent = computeJourneyDay();
  document.getElementById("progressCurrentStreak").textContent = streakInfo.current;
  document.getElementById("progressLongestStreak").textContent = streakInfo.longest;
  document.getElementById("streakNote").hidden = streakInfo.current > 0;

  const consistencyPct = await computeWeeklyConsistency();
  document.getElementById("consistencyPct").textContent = consistencyPct + "%";
  document.getElementById("consistencyNote").textContent = consistencyPct >= 66 ? t("progress.consistencyGood") : "";

  const grid = document.getElementById("achievementsGrid");
  grid.innerHTML = "";
  getAchievementDefs().forEach(def=>{
    const unlocked = achievementsUnlocked.has(def.key);
    const badge = document.createElement("div");
    badge.className = "achievement-badge" + (unlocked ? "" : " is-locked");
    badge.innerHTML = `<span class="ach-icon">${def.icon}</span><strong>${t(def.titleKey)}</strong><small>${t(def.reqKey)}</small>`;
    grid.appendChild(badge);
  });

  document.getElementById("pointsTotal").textContent = pointsTotal;
}

function computeJourneyDay(){
  const created = profile.createdAt ? new Date(profile.createdAt) : new Date();
  return Math.max(1, Math.floor((new Date() - created) / 86400000) + 1);
}

/* ---------- Monthly challenge (shown on Home) ---------- */
async function renderHomeChallenge(){
  const challenge = CONTENT[lang].monthlyChallenge;
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(now.getFullYear(), now.getMonth(), challenge.targetDays);
  const fmt = d => d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");

  const { data } = await sb.from("user_daily_tasks")
    .select("date")
    .eq("user_id", currentUser.id)
    .gte("date", fmt(startDate))
    .lte("date", fmt(endDate));

  // A day "counts" if the day's single challenge was completed.
  const activeDays = new Set((data||[]).map(r=>r.date));
  const consistentDays = activeDays.size;
  const pct = Math.min(100, Math.round((consistentDays/challenge.targetDays)*100));

  document.getElementById("homeChallengeBar").style.width = pct + "%";
  document.getElementById("homeChallengeProgressText").textContent =
    `${consistentDays} / ${challenge.targetDays} ${t("progress.challengeDays")}`;

  if(consistentDays >= challenge.targetDays){
    const { error } = await sb.from("user_challenges")
      .insert({ user_id: currentUser.id, challenge_key: challenge.key, completed:true, completed_at:new Date().toISOString() });
    if(!error) await awardPoints(200, "monthly_challenge");
  }
}


function initPlanHandlers(){
  document.getElementById("editProfileBtn").addEventListener("click", reopenOnboardingForEdit);

  document.getElementById("generatePlanBtn").addEventListener("click", generateMealPlan);
}

function generateMealPlan(){
  const btn = document.getElementById("generatePlanBtn");
  const resultEl = document.getElementById("aiPlanResult");
  const introEl = document.getElementById("aiPlanIntro");

  btn.disabled = true;
  btn.textContent = t("plan.generating");

  // Brief delay purely so the action feels like it's "thinking" — the plan
  // itself is generated instantly from the person's own targets below.
  setTimeout(()=>{
    const calc = computeCalcs(profile);
    const foods = CONTENT[lang].foods;
    const seed = Math.floor(Math.random() * 1000);
    const slots = [
      { key:"plan.breakfast", pool:foods.breakfast, share:0.25 },
      { key:"plan.lunch", pool:foods.lunch, share:0.35 },
      { key:"plan.snack", pool:foods.snack, share:0.10 },
      { key:"plan.dinner", pool:foods.dinner, share:0.30 }
    ];
    resultEl.innerHTML = "";
    slots.forEach((slot, i)=>{
      const food = slot.pool[(seed + i) % slot.pool.length];
      const kcal = Math.round(calc.targetKcal * slot.share);
      const div = document.createElement("div");
      div.className = "menu-meal";
      div.innerHTML = `<div class="menu-meal-head"><strong>${t(slot.key)}</strong><span>${kcal} kcal</span></div><p>${food}</p>`;
      resultEl.appendChild(div);
    });
    resultEl.hidden = false;
    introEl.hidden = true;
    btn.disabled = false;
    btn.textContent = t("plan.regeneratePlan");
  }, 650);
}

function reopenOnboardingForEdit(){
  if(!profile) return;
  document.getElementById("inputName").value = profile.name || "";
  document.getElementById("inputAge").value = profile.age;
  document.getElementById("inputWeight").value = profile.weight;
  document.getElementById("inputHeight").value = profile.height;
  document.getElementById("inputGoalWeight").value = profile.goalWeight;

  onbSelections.gender = profile.gender;
  onbSelections.activity = String(profile.activity);
  onbSelections.goal = profile.goal;

  document.querySelectorAll("#genderSelect .seg-btn").forEach(b=>b.classList.toggle("is-selected", b.dataset.value===profile.gender));
  document.querySelectorAll("#goalSelect .seg-btn").forEach(b=>b.classList.toggle("is-selected", b.dataset.value===profile.goal));
  document.querySelectorAll("#activitySelect .opt-btn").forEach(b=>b.classList.toggle("is-selected", b.dataset.value===String(profile.activity)));

  document.getElementById("mainApp").hidden = true;
  document.getElementById("onboarding").hidden = false;
  showOnbStep(1);
}

/* ============================================================
   LESSONS tab
   ============================================================ */
async function renderLessons(){
  const grid = document.getElementById("lessonGrid");
  grid.innerHTML = "";
  CONTENT[lang].lessons.forEach((lesson)=>{
    const card = document.createElement("button");
    card.className = "lesson-card" + (lesson.url ? " lesson-card-link" : "");
    const metaHtml = !lesson.free
      ? `<div class="lesson-meta"><span class="lesson-lock">${t("lessons.locked")}</span></div>`
      : "";
    const actionIcon = lesson.url
      ? `<svg viewBox="0 0 24 24" width="14" height="14"><path d="M7 17 17 7M9 7h8v8" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
      : `<img src="assets/icons/play.png" alt="Play" class="play-icon-img">`;
    const actionClass = "lesson-action" + (lesson.url ? "" : " lesson-action-img");
    card.innerHTML = `
      <div class="lesson-thumb">
        <img src="${lesson.cover}" alt="" loading="lazy">
      </div>
      <div class="lesson-info">
        <strong>${lesson.title}</strong>
        ${metaHtml}
      </div>
      <span class="${actionClass}">${actionIcon}</span>`;
    card.addEventListener("click", ()=>{
      if(lesson.url){ window.open(lesson.url, "_blank", "noopener"); }
      else{ openLesson(lesson); }
    });
    grid.appendChild(card);
  });
}

function openLesson(lesson){
  document.getElementById("lessonModalTitle").textContent = lesson.title;
  document.getElementById("lessonModalDesc").textContent = lesson.desc;
  const wrap = document.getElementById("videoWrap");
  if(lesson.videoFile){
    wrap.innerHTML = `<video src="${lesson.videoFile}" controls playsinline autoplay></video>`;
  }else if(lesson.videoId){
    wrap.innerHTML = `<iframe src="https://www.youtube.com/embed/${lesson.videoId}?rel=0&modestbranding=1&iv_load_policy=3&autoplay=1&playsinline=1" title="${lesson.title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
  }else{
    wrap.innerHTML = `<span>${t("lessons.comingSoon")}</span>`;
  }

  const recipeWrap = document.getElementById("lessonRecipe");
  if(lesson.recipe){
    const r = lesson.recipe;
    recipeWrap.innerHTML = `
      <div class="recipe-card">
        <span class="pill-tag">${t("lessons.recipeLabel")}</span>
        <h3 class="recipe-title">${r.title}</h3>
        <p class="recipe-subtitle">${r.subtitle}</p>
        <div class="recipe-section-label">${t("lessons.ingredients")}</div>
        <ul class="recipe-list">
          ${r.ingredients.map(i=>`<li>${i}</li>`).join("")}
        </ul>
        <div class="recipe-section-label">${t("lessons.instructions")}</div>
        <ol class="recipe-steps">
          ${r.steps.map(s=>`<li>${s}</li>`).join("")}
        </ol>
      </div>`;
    recipeWrap.hidden = false;
  }else{
    recipeWrap.innerHTML = "";
    recipeWrap.hidden = true;
  }

  const guideWrap = document.getElementById("lessonGuide");
  if(lesson.installGuide){
    const g = lesson.installGuide;
    const platformBlock = (p, emoji)=> `
      <div class="guide-platform">
        <div class="guide-platform-label">${emoji} ${p.label}</div>
        <ol class="guide-steps">
          ${p.steps.map(s=>`<li>${s}</li>`).join("")}
        </ol>
      </div>`;
    guideWrap.innerHTML = `
      <div class="recipe-card">
        <span class="pill-tag">${t("lessons.guideLabel")}</span>
        <h3 class="recipe-title">${g.title}</h3>
        <p class="recipe-subtitle">${g.subtitle}</p>
        ${platformBlock(g.ios, "🍎")}
        ${platformBlock(g.android, "🤖")}
      </div>`;
    guideWrap.hidden = false;
  }else{
    guideWrap.innerHTML = "";
    guideWrap.hidden = true;
  }

  document.getElementById("lessonOverlay").hidden = false;
}

function initLessonHandlers(){
  document.getElementById("closeLesson").addEventListener("click", ()=>{
    document.getElementById("lessonOverlay").hidden = true;
    document.getElementById("videoWrap").innerHTML = "";
    document.getElementById("lessonRecipe").innerHTML = "";
    document.getElementById("lessonGuide").innerHTML = "";
  });
  document.getElementById("lessonOverlay").addEventListener("click", e=>{
    if(e.target.id === "lessonOverlay"){
      document.getElementById("lessonOverlay").hidden = true;
      document.getElementById("videoWrap").innerHTML = "";
      document.getElementById("lessonRecipe").innerHTML = "";
      document.getElementById("lessonGuide").innerHTML = "";
    }
  });
}

/* ============================================================
   SHOP tab — direct to checkout, no cart
   ============================================================ */
function formatOriginalPrice(priceStr){
  const match = priceStr.match(/^([^\d]*)([\d.,]+)/);
  if(!match) return priceStr;
  const symbol = match[1] || "";
  const num = parseFloat(match[2].replace(",", "."));
  if(isNaN(num)) return priceStr;
  const original = num * 1.5;
  const formatted = Number.isInteger(original) ? original.toString() : original.toFixed(2);
  return symbol + formatted;
}

function renderShop(){
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";
  CONTENT[lang].products.forEach((product)=>{
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-thumb">
        <img src="${product.cover}" alt="${product.name}" loading="lazy">
      </div>
      <div class="product-body">
        <strong>${product.name}</strong>
        <p>${product.desc}</p>
        <div class="product-foot">
          <span class="product-price-wrap">
            <span class="product-price">${product.price}</span>
            <span class="product-price-old">${formatOriginalPrice(product.price)}</span>
          </span>
          <button class="btn-small">${t("shop.buy")}</button>
        </div>
      </div>`;
    card.querySelector(".btn-small").addEventListener("click", ()=>{
      window.open(product.checkoutUrl, "_blank", "noopener");
    });
    grid.appendChild(card);
  });
}

function initShopHandlers(){
  // No cart to wire up — each product's button opens its checkout link directly.
}

/* ============================================================
   PROGRESS tab
   ============================================================ */

async function loadWeights(){
  if(weightsLoaded) return; // cached — avoids a round trip on every visit to this tab
  const { data } = await sb.from("weight_logs")
    .select("*")
    .eq("user_id", currentUser.id)
    .order("date");
  weights = (data || []).map(r=>({ id:r.id, date:r.date, value:Number(r.value) }));
  weightsLoaded = true;
}

async function renderProgress(){
  await loadWeights();
  if(!weights.length){
    const { data } = await sb.from("weight_logs")
      .insert({ user_id: currentUser.id, date: profile.createdAt, value: profile.weight })
      .select().single();
    if(data) weights = [{ id:data.id, date:data.date, value:Number(data.value) }];
  }
  const sorted = [...weights].sort((a,b)=> new Date(a.date) - new Date(b.date));
  const start = sorted[0].value;
  const current = sorted[sorted.length-1].value;

  document.getElementById("weightStart").textContent = start;
  document.getElementById("weightCurrent").textContent = current;
  document.getElementById("weightGoal").textContent = profile.goalWeight;

  drawWeightChart(sorted);
  renderWeightList(sorted);
  await checkAchievements();
  await renderProgressExtras();
}

function drawWeightChart(sorted){
  const svg = document.getElementById("weightChart");
  const w = 300, h = 140, pad = 16;
  if(sorted.length < 2){
    svg.innerHTML = `<text x="${w/2}" y="${h/2}" text-anchor="middle" font-size="12" fill="#909a9d">Add another entry to see your trend</text>`;
    return;
  }
  const values = sorted.map(p=>p.value);
  const min = Math.min(...values, profile.goalWeight);
  const max = Math.max(...values, profile.goalWeight);
  const range = (max - min) || 1;

  const x = i => pad + (i * (w - pad*2) / (sorted.length - 1));
  const y = v => h - pad - ((v - min) / range) * (h - pad*2);

  const points = sorted.map((p,i)=>`${x(i)},${y(p.value)}`).join(" ");
  const goalY = y(profile.goalWeight);

  svg.innerHTML = `
    <line x1="${pad}" y1="${goalY}" x2="${w-pad}" y2="${goalY}" stroke="#e2e4e4" stroke-width="1.5" stroke-dasharray="4 4"/>
    <polyline points="${points}" fill="none" stroke="#000000" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
    ${sorted.map((p,i)=>`<circle cx="${x(i)}" cy="${y(p.value)}" r="3.2" fill="#000000"/>`).join("")}
  `;
}

function renderWeightList(sorted){
  const list = document.getElementById("weightList");
  list.innerHTML = "";
  if(!sorted.length){
    const li = document.createElement("li");
    li.className = "empty-state";
    li.textContent = t("progress.empty");
    list.appendChild(li);
    return;
  }
  [...sorted].reverse().forEach((entry, idx, arr)=>{
    const prev = arr[idx+1];
    const li = document.createElement("li");
    li.className = "weight-item";
    const dateFmt = new Intl.DateTimeFormat(lang === "es" ? "es-ES" : "en-US", { day:"2-digit", month:"short" });
    let deltaHtml = "";
    if(prev){
      const diff = +(entry.value - prev.value).toFixed(1);
      if(diff !== 0){
        const cls = diff < 0 ? "down" : "up";
        deltaHtml = `<span class="weight-delta ${cls}">${diff>0?"+":""}${diff} kg</span>`;
      }
    }
    li.innerHTML = `
      <span class="weight-item-date">${dateFmt.format(new Date(entry.date))}</span>
      <span class="weight-item-val">${entry.value} kg</span>
      ${deltaHtml}`;
    list.appendChild(li);
  });
}

function initProgressHandlers(){
  document.getElementById("weightLogForm").addEventListener("submit", async e=>{
    e.preventDefault();
    const input = document.getElementById("newWeightInput");
    const value = parseFloat(input.value);
    if(!value) return;
    const { data, error } = await sb.from("weight_logs")
      .insert({ user_id: currentUser.id, date: todayStr(), value })
      .select().single();
    if(!error){
      weights.push({ id:data.id, date:data.date, value:Number(data.value) });
      input.value = "";
      renderProgress();
    }
  });
}

/* ============================================================
   Tabs / navigation
   ============================================================ */
function switchTab(tabName){
  document.querySelectorAll(".tab-pane").forEach(p=>{
    p.hidden = p.id !== "tab-"+tabName;
  });
  document.querySelectorAll(".nav-btn").forEach(b=>{
    b.classList.toggle("is-active", b.dataset.tab === tabName);
  });
  document.querySelectorAll("[data-tab-visible]").forEach(el=>{
    el.hidden = el.getAttribute("data-tab-visible") !== tabName;
  });
  document.getElementById("tabContent").scrollTop = 0;

  if(tabName === "home") renderHome();
  if(tabName === "plan") renderPlan();
  if(tabName === "lessons") renderLessons();
  if(tabName === "shop") renderShop();
  if(tabName === "progress") renderProgress();
}

function initNavHandlers(){
  document.getElementById("bottomNav").addEventListener("click", e=>{
    const btn = e.target.closest(".nav-btn");
    if(!btn) return;
    switchTab(btn.dataset.tab);
  });
}

/* ============================================================
   Language switcher
   ============================================================ */
function initLangHandlers(){
  document.getElementById("langToggle").addEventListener("click", e=>{
    const btn = e.target.closest("button[data-lang]");
    if(!btn || btn.dataset.lang === lang) return;
    lang = btn.dataset.lang;
    localStorage.setItem(LS_LANG, lang);
    applyI18n();
    const activeTab = document.querySelector(".nav-btn.is-active")?.dataset.tab || "home";
    switchTab(activeTab);
  });
}

function initHomeHandlers(){
  document.getElementById("clearMealsBtn").addEventListener("click", async ()=>{
    await sb.from("meals").delete().eq("user_id", currentUser.id).eq("date", todayStr());
    mealsData.items = [];
    renderHome();
  });
}

/* ============================================================
   Entry points
   ============================================================ */
function enterMainApp(){
  document.getElementById("authScreen").hidden = true;
  document.getElementById("onboarding").hidden = true;
  document.getElementById("mainApp").hidden = false;
  switchTab("home");
}

async function boot(){
  applyI18n();
  initOnboardingHandlers();
  initNavHandlers();
  initLangHandlers();
  initHomeHandlers();
  initAddMealHandlers();
  initPlanHandlers();
  initLessonHandlers();
  initShopHandlers();
  initProgressHandlers();
  initAuthHandlers();
  initLogoutHandler();
  initCheckinHandlers();

  const { data } = await sb.auth.getSession();
  if(data && data.session){
    currentUser = data.session.user;
    await loadProfileAndEnter();
  }else{
    showAuthScreen();
  }
  document.getElementById("bootLoader").hidden = true;

  sb.auth.onAuthStateChange((event, session)=>{
    if(event === "SIGNED_OUT"){
      currentUser = null;
      profile = null;
      mealsData = null;
      weights = [];
      weightsLoaded = false;
      myMenu = null;
      myTasks = null;
      streakInfo = null;
      achievementsUnlocked = null;
      pointsTotal = null;
      lastCheckin = null;
    }
  });
}

document.addEventListener("DOMContentLoaded", boot);
