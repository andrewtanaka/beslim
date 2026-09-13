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
let currentUser = null;

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
    btn.addEventListener("click", async ()=>{
      const now = new Date();
      const time = now.toLocaleTimeString(lang==="es"?"es-ES":"en-US", { hour:"2-digit", minute:"2-digit" });
      const { data, error } = await sb.from("meals").insert({
        user_id: currentUser.id, date: todayStr(), name: t(preset.key), kcal: preset.kcal, time
      }).select().single();
      if(!error){
        mealsData.items.push({ id:data.id, name:data.name, kcal:Number(data.kcal), time:data.time });
        renderHome();
      }
    });
    wrap.appendChild(btn);
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
   Tip of the day
   ============================================================ */
function dayOfYear(){
  const now = new Date();
  const start = new Date(now.getFullYear(),0,0);
  const diff = now - start;
  return Math.floor(diff / 86400000);
}

function renderTip(random){
  const tips = t("tips");
  let idx;
  if(random){
    idx = Math.floor(Math.random()*tips.length);
  }else{
    idx = dayOfYear() % tips.length;
  }
  document.getElementById("tipText").textContent = tips[idx];
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
  renderTip(false);
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
function renderPlan(){
  const calc = computeCalcs(profile);
  document.getElementById("bmrValue").textContent = calc.bmr;
  document.getElementById("tdeeValue").textContent = calc.tdee;
  document.getElementById("macroProteinG").textContent = calc.proteinG + "g";
  document.getElementById("macroCarbsG").textContent = calc.carbsG + "g";
  document.getElementById("macroFatG").textContent = calc.fatG + "g";
  renderMenu();
}

function renderMenu(){
  const foods = CONTENT[lang].foods;
  const seed = parseInt(localStorage.getItem(LS_MENU_SEED) || "0", 10);
  const slots = [
    { key:"plan.breakfast", pool:foods.breakfast, share:0.25 },
    { key:"plan.lunch", pool:foods.lunch, share:0.35 },
    { key:"plan.snack", pool:foods.snack, share:0.10 },
    { key:"plan.dinner", pool:foods.dinner, share:0.30 }
  ];
  const calc = computeCalcs(profile);
  const menuList = document.getElementById("menuList");
  menuList.innerHTML = "";
  slots.forEach((slot, i)=>{
    const food = slot.pool[(seed + i) % slot.pool.length];
    const kcal = Math.round(calc.targetKcal * slot.share);
    const div = document.createElement("div");
    div.className = "menu-meal";
    div.innerHTML = `
      <div class="menu-meal-head"><strong>${t(slot.key)}</strong><span>${kcal} kcal</span></div>
      <p>${food}</p>`;
    menuList.appendChild(div);
  });
}

function initPlanHandlers(){
  document.getElementById("regeneratePlanBtn").addEventListener("click", ()=>{
    const seed = parseInt(localStorage.getItem(LS_MENU_SEED) || "0", 10);
    localStorage.setItem(LS_MENU_SEED, String(seed + 1));
    renderMenu();
  });
  document.getElementById("editProfileBtn").addEventListener("click", reopenOnboardingForEdit);
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
function renderLessons(){
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
  if(lesson.videoId){
    wrap.innerHTML = `<iframe src="https://www.youtube.com/embed/${lesson.videoId}?rel=0" title="${lesson.title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
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

  document.getElementById("lessonOverlay").hidden = false;
}

function initLessonHandlers(){
  document.getElementById("closeLesson").addEventListener("click", ()=>{
    document.getElementById("lessonOverlay").hidden = true;
    document.getElementById("videoWrap").innerHTML = "";
    document.getElementById("lessonRecipe").innerHTML = "";
  });
  document.getElementById("lessonOverlay").addEventListener("click", e=>{
    if(e.target.id === "lessonOverlay"){
      document.getElementById("lessonOverlay").hidden = true;
      document.getElementById("videoWrap").innerHTML = "";
      document.getElementById("lessonRecipe").innerHTML = "";
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
let weightsLoaded = false;

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
  document.getElementById("newTipBtn").addEventListener("click", ()=>renderTip(true));
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
  initPlanHandlers();
  initLessonHandlers();
  initShopHandlers();
  initProgressHandlers();
  initAuthHandlers();
  initLogoutHandler();

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
    }
  });
}

document.addEventListener("DOMContentLoaded", boot);
