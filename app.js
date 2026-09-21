const VERSION="0.0.33";
const $=id=>document.getElementById(id),money=n=>new Intl.NumberFormat("hu-HU",{style:"currency",currency:"HUF",maximumFractionDigits:0}).format(n),clamp=(n,a=0,b=100)=>Math.max(a,Math.min(b,n)),rand=(a,b)=>Math.floor(Math.random()*(b-a+1))+a,pick=a=>a[Math.floor(Math.random()*a.length)];
const names={female:["Anna","Emma","Lili","Nóra","Luca","Hanna","Sára","Zsófia"],male:["Bence","Dávid","Máté","Levente","Ádám","Marcell","Balázs","Péter"],neutral:["Alex","Noa","Sam","Robin","Dani"]},surnames=["Kovács","Nagy","Tóth","Szabó","Horváth","Varga","Kiss","Molnár","Farkas","Németh"];
const jobs=[["Munkanélküli",0,0],["Pincér",220000,10],["Eladó",260000,10],["Irodai asszisztens",330000,25],["Szakmunkás",420000,25],["Programozó",750000,55],["Mérnök",820000,60],["Orvos",1250000,80],["Ügyvéd",1050000,70],["Tanár",520000,45],["Rendőr",560000,45],["Pilóta",1100000,70],["Művész",480000,45],["Tartalomkészítő",650000,50],["Cégvezető",1800000,85],["Vállalkozó",0,65]];
const achievements=[["first-year","🌱","Első év","Éld túl az első évfordulót."],["millionaire","💎","Milliomos","Érj el 1 000 000 Ft vagyont."],["rich","👑","Nagypályás","Érj el 100 000 000 Ft vagyont."],["degree","🎓","Diplomás","Szerezz egy diplomát."],["married","💍","Igent mondtam","Házasodj meg."],["parent","👶","Szülő","Legyen gyermeked."],["travel","✈️","Világjáró","Utazz legalább 5 alkalommal."],["crime","🕶️","Tiltott ösvény","Kövess el egy bűncselekményt."],["car","🚗","Garázs","Legyen autód."],["house","🏠","Otthon","Legyen saját ingatlanod."],["old","🧓","Tapasztalat","Érd el a 80 éves kort."],["social","📱","Vírusos","Érd el az 1 000 000 követőt."]];
let state=null,saveKey="megalife-save-v1";
function fresh(){const gender=$("gender").value,first=$("firstName").value.trim()||pick(names[gender]||names.neutral),last=$("lastName").value.trim()||pick(surnames);return{version:1,alive:true,first,last,gender,country:$("country").value,age:0,year:new Date().getFullYear(),money:rand(20000,80000),debt:0,bank:0,health:rand(70,95),happiness:rand(55,85),smarts:rand(35,80),looks:rand(35,85),discipline:rand(30,80),karma:50,job:jobs[0],education:"Általános iskola",degree:null,relationships:[],children:[],family:{parents:[{name:pick(names.male)+" "+pick(surnames),type:"Apa",alive:true},{name:pick(names.female)+" "+pick(surnames),type:"Anya",alive:true}],siblings:rand(0,2)},assets:[],crimes:[],social:{followers:0,posts:0,platforms:{}},travelCount:0,hobbies:[],events:[],achievements:[],stats:{years:0,earned:0,spent:0,days:0,actions:0,relationships:0,children:0,crimes:0,investProfit:0,deathCause:null},flags:{married:false,university:false},traits:[pick(["Ambiciózus","Kreatív","Nyugodt","Vakmerő","Empatikus","Versengő"]),pick(["Társasági","Introvertált","Szerencsés","Makacs","Optimista","Spórolós"])],jail:0,business:null,pet:null}}
function save(){if(!state)return;localStorage.setItem(saveKey,JSON.stringify(state));toast("Játék mentve.")}
function load(){try{const x=JSON.parse(localStorage.getItem(saveKey));if(x&&x.alive!==undefined){state=x;return true}}catch(e){}return false}
function toast(t){const e=$("toast");e.textContent=t;e.classList.add("show");setTimeout(()=>e.classList.remove("show"),1800)}
function log(text,type="Élet"){state.events.push({age:state.age,year:state.year,text,type});if(state.events.length>80)state.events=state.events.slice(-80)}
function wealth(){return state.money+state.bank-state.debt+state.assets.reduce((s,a)=>s+(a.value||0),0)}
function fmt(n){return money(Math.round(n))}
function normalize(){if(!state)return;state.first=String(state.first||"Alex");state.last=String(state.last||"Life");state.gender=state.gender||"neutral";state.country=state.country||"Magyarország";state.age=Math.max(0,Number(state.age)||0);state.year=Number(state.year)||new Date().getFullYear();state.money=Math.max(0,Math.round(Number(state.money)||0));state.bank=Math.max(0,Math.round(Number(state.bank)||0));state.debt=Math.max(0,Math.round(Number(state.debt)||0));for(const k of["health","happiness","smarts","looks","discipline","karma"])state[k]=clamp(Number(state[k])||0);state.relationships=Array.isArray(state.relationships)?state.relationships:[];state.relationships.forEach(r=>{r.name=String(r.name||"Ismeretlen");r.type=String(r.type||"Ismerős");r.age=Math.max(0,Number(r.age)||state.age);r.closeness=clamp(Number(r.closeness)||0)});state.children=Array.isArray(state.children)?state.children:[];state.children.forEach(ch=>{ch.name=String(ch.name||"Gyermek");ch.age=Math.max(0,Number(ch.age)||0)});state.hobbies=Array.isArray(state.hobbies)?state.hobbies:[];state.hobbies.forEach(h=>{h.id=String(h.id||"");h.name=String(h.name||"Hobbi");h.level=Math.max(1,Number(h.level)||1);h.years=Math.max(0,Number(h.years)||0)});state.assets=Array.isArray(state.assets)?state.assets:[];state.events=Array.isArray(state.events)?state.events:[];state.achievements=Array.isArray(state.achievements)?state.achievements:[];state.crimes=Array.isArray(state.crimes)?state.crimes:[];state.family=state.family||{parents:[],siblings:0};state.family.parents=Array.isArray(state.family.parents)?state.family.parents:[];state.social=state.social||{followers:0,posts:0,platforms:{}};state.social.platforms=state.social.platforms||{};state.stats=state.stats||{};for(const k of["years","earned","spent","days","actions","relationships","children","crimes","investProfit"])state.stats[k]=Number(state.stats[k])||0;state.flags=state.flags||{married:false,university:false};state.traits=Array.isArray(state.traits)?state.traits:[];state.jail=Math.max(0,Number(state.jail)||0);state.business=state.business||null;state.job=Array.isArray(state.job)&&state.job.length>=3?state.job:jobs[0];state.education=state.education||"Általános iskola";state.degree=state.degree||null;state.business=state.business||null;state.pet=state.pet||null;state.meta=state.meta||{};state.meta.version=VERSION;state.meta.slot=currentSlot||1;}
function render(){if(!state){$("startScreen").classList.remove("hidden");$("gameScreen").classList.add("hidden");return}$("startScreen").classList.add("hidden");$("gameScreen").classList.remove("hidden");$("pName").textContent=state.first+" "+state.last;$("avatar").textContent=state.first[0].toUpperCase();$("pMeta").textContent=state.age+" éves • "+state.gender+" • "+state.country;$("ageText").textContent=state.age+" éves";$("yearText").textContent=" • "+state.year;$("wealth").textContent=fmt(wealth());renderStats();renderLife();renderRelations();renderCareer();renderFinance();renderAssets();renderActivities();renderAchievements();renderStatsTab();renderSocial();renderSocial()}
function renderStats(){const d=[["❤️ Egészség",state.health],["😊 Boldogság",state.happiness],["🧠 Intelligencia",state.smarts],["✨ Kinézet",state.looks],["🎯 Fegyelem",state.discipline]];$("statBars").innerHTML='<div class="stats">'+d.map(x=>'<div class="stat"><span>'+x[0]+'</span><div class="bar"><i style="width:'+x[1]+'%"></i></div><b>'+Math.round(x[1])+'</b></div>').join("")+"</div>"}
function panel(t,b){return'<div class="card panel"><h3>'+t+"</h3>"+b+"</div>"}
function renderLife(){const jail=state.jail>0?panel("⚖️ Jogi helyzet",`<div class="action"><b>Börtönben vagy</b><small>Még ${state.jail} év van hátra.</small></div>`):"";const traits=panel("Személyiséged",`<div class="row">${state.traits.map(t=>`<span class="pill">${t}</span>`).join("")}</div>`);const ev=state.events.slice(0,12).map(e=>`<div class="event"><span class="tag">${e.year} • ${e.type}</span>${e.text}</div>`).join("")||'<div class="muted">Még nincs történés. Nyomd meg a Következő év gombot!</div>';const f=`<div class="grid"><div class="action"><b>👨‍👩‍👧 Szülők</b><small>${state.family.parents.map(p=>p.name).join(" • ")}</small></div><div class="action"><b>👶 Gyerekek</b><small>${state.children.length} gyermek</small></div><div class="action"><b>👥 Testvérek</b><small>${state.family.siblings} testvér</small></div><div class="action"><b>💼 Munka</b><small>${state.job[0]}</small></div></div>`;$("tab-life").innerHTML=jail+traits+panel("Életút",f)+panel("Legutóbbi események",ev)}
function renderRelations(){const r=state.relationships.map((x,i)=>`<div class="list-item"><div><b>${x.name}</b> <span class="pill">${x.type}</span><br><small class="muted">${x.age} éves • kapcsolat: ${x.closeness}%</small></div><button class="ghost" onclick="interact(${i})">Interakció</button></div>`).join("")||'<p class="muted">Még nincs közeli kapcsolatod.</p>';const family=`<div class="grid"><button class="action" onclick="dateAction()"><b>❤️ Randi</b><small>Ismerkedj új emberrel.</small></button><button class="action" onclick="proposal()"><b>💎 Eljegyzés</b><small>85%+ kapcsolat esetén.</small></button><button class="action" onclick="marryAction()"><b>💍 Házasság</b><small>Ha van megfelelő párod.</small></button><button class="action" onclick="childAction()"><b>👶 Gyermek</b><small>Gyermekvállalás.</small></button></div>`;$("tab-relations").innerHTML=panel("Kapcsolataid",r)+panel("Család",family)}
function renderCareer(){const business=state.business?panel("Vállalkozás",`<div class="grid"><div class="action"><b>🏢 ${state.business.name}</b><small>Érték: ${fmt(state.business.value)}</small></div><button class="action" onclick="sellBusiness()"><b>💼 Eladás</b><small>Értékesítsd a céged.</small></button></div>`):panel("Vállalkozás",'<button class="action" onclick="startBusiness()"><b>🚀 Vállalkozás indítása</b><small>1 000 000 Ft indulótőke.</small></button>');const current=`<div class="grid"><div class="action"><b>${state.job[0]}</b><small>Éves fizetés: ${fmt(state.job[1])}</small></div><div class="action"><b>${state.education}</b><small>${state.degree||"Nincs diploma"}</small></div></div>`;const j=jobs.filter(x=>x[0]!==state.job[0]).map(x=>`<button class="action" onclick="getJob(${jobs.indexOf(x)})"><b>${x[0]}</b><small>${fmt(x[1])} / év • IQ ${x[2]}+</small></button>`).join("");$("tab-career").innerHTML=business+panel("Karrier",current)+panel("Álláskeresés",`<div class="grid">${j}</div>`)+panel("Oktatás",'<div class="grid"><button class="action" onclick="study()"><b>📚 Tanulás</b><small>Intelligencia és fegyelem.</small></button><button class="action" onclick="university()"><b>🎓 Egyetem</b><small>Diploma és jobb állások.</small></button></div>')}
function renderFinance(){$("tab-finance").innerHTML=panel("Pénzügyek",'<div class="grid"><div class="action"><b>Készpénz</b><small>'+fmt(state.money)+'</small></div><div class="action"><b>Bank</b><small>'+fmt(state.bank)+'</small></div><div class="action"><b>Tartozás</b><small>'+fmt(state.debt)+'</small></div><div class="action"><b>Teljes vagyon</b><small>'+fmt(wealth())+'</small></div></div>')+panel("Műveletek",'<div class="grid"><button class="action" onclick="bank(50000)"><b>🏦 Betét</b><small>+50 000 Ft bankba</small></button><button class="action" onclick="bank(-50000)"><b>💳 Kivét</b><small>50 000 Ft kivétele</small></button><button class="action" onclick="loan()"><b>💸 Hitel</b><small>Vegyél fel hitelt.</small></button><button class="action" onclick="invest()"><b>📈 Befektetés</b><small>Kockázatos hozam.</small></button><button class="action" onclick="gamble()"><b>🎰 Szerencsejáték</b><small>Nyerhetsz vagy veszíthetsz.</small></button></div>')}
function renderAssets(){const a=state.assets.map((x,i)=>'<div class="list-item"><div><b>'+x.icon+" "+x.name+'</b><br><small class="muted">Érték: '+fmt(x.value)+'</small></div><button class="ghost" onclick="sellAsset('+i+')">Eladás</button></div>').join("")||'<p class="muted">Még nincs jelentős vagyontárgyad.</p>';$("tab-assets").innerHTML=panel("Vagyontárgyak",a)+panel("Vásárlás",'<div class="grid"><button class="action" onclick="buyHouse()"><b>🏠 Lakás</b><small>6 000 000 Ft</small></button><button class="action" onclick="buyCar()"><b>🚗 Autó</b><small>3 000 000 Ft</small></button><button class="action" onclick="buyLuxury()"><b>💎 Luxusóra</b><small>1 200 000 Ft</small></button></div>')}
function renderActivities(){$("tab-activities").innerHTML=panel("Mindennapok",'<div class="grid"><button class="action" onclick="activity(\'exercise\')"><b>🏋️ Edzés</b><small>Egészség +, boldogság +</small></button><button class="action" onclick="activity(\'meditate\')"><b>🧘 Meditáció</b><small>Stresszcsökkentés.</small></button><button class="action" onclick="activity(\'party\')"><b>🎉 Buli</b><small>Boldogság +, pénz −</small></button><button class="action" onclick="activity(\'doctor\')"><b>🏥 Orvos</b><small>Egészség javítása.</small></button><button class="action" onclick="activity(\'social\')"><b>📱 Közösségi média</b><small>Profil, posztok és trendek.</small></button><button class="action" onclick="travel()"><b>✈️ Utazás</b><small>250 000 Ft.</small></button><button class="action" onclick="crime()"><b>🕶️ Bűncselekmény</b><small>Nagy kockázat.</small></button><button class="action" onclick="pet()"><b>🐕 Háziállat</b><small>Új családtag.</small></button></div>')+renderHobbies();}const HOBBIES=[{id:"gaming",name:"🎮 Gaming",cost:5000,stat:"happiness",desc:"Játék, versenyek és közösségi élmények."},{id:"music",name:"🎸 Zene",cost:8000,stat:"happiness",desc:"Tanulj hangszert és fejleszd a kreativitásod."},{id:"sport",name:"⚽ Sport",cost:6000,stat:"health",desc:"Edzés, verseny és jobb állóképesség."},{id:"cooking",name:"🍳 Főzés",cost:4500,stat:"discipline",desc:"Saját receptek, rutin és önállóság."},{id:"photo",name:"📷 Fotózás",cost:7000,stat:"looks",desc:"Képek, helyek és új ismeretségek."},{id:"art",name:"🎨 Rajzolás",cost:3500,stat:"smarts",desc:"Kreatív alkotás és koncentráció."}];
function hobbyById(id){return HOBBIES.find(h=>h.id===id)}
function startHobby(id){const h=hobbyById(id);if(!h)return;if(state.age<6)return toast("6 éves kor alatt még nem kezdenél hobbit.");if(state.hobbies.some(x=>x.id===id))return toast("Ezt a hobbit már űzöd.");if(state.money<h.cost)return toast("Ehhez "+fmt(h.cost)+" Ft kell.");state.money-=h.cost;state.stats.spent+=h.cost;state.hobbies.push({id:h.id,name:h.name,level:1,years:0});state.happiness=clamp(state.happiness+3);log("Elkezdted: "+h.name+".","Hobbi");save();render();mlCloseAfterAction()}
function practiceHobby(id){const item=state.hobbies.find(x=>x.id===id),h=hobbyById(id);if(!item||!h)return;const gain=rand(1,3);item.level=Math.min(100,item.level+gain);state[h.stat]=clamp(state[h.stat]+(item.level%10===0?2:1));state.happiness=clamp(state.happiness+rand(1,3));log("Időt szántál erre: "+h.name+". Szint "+item.level+".","Hobbi");save();render();mlCloseAfterAction()}
function renderHobbies(){const owned=state.hobbies.map(x=>{const h=hobbyById(x.id)||{name:x.name,desc:""};return '<div class="hobby-card"><div class="hobby-head"><b>'+h.name+'</b><span>Lv. '+x.level+'</span></div><small>'+h.desc+'</small><div class="hobby-bar"><i style="width:'+x.level+'%"></i></div><button class="action" onclick="practiceHobby(&quot;'+x.id+'&quot;)"><b>🎯 Gyakorlás</b><small>Fejlődj és kapj kis statbónuszt.</small></button></div>'}).join("")||'<p class="muted">Még nincs hobbid. Válassz egyet, amit rendszeresen csinálnál.</p>';const available=HOBBIES.filter(h=>!state.hobbies.some(x=>x.id===h.id)).map(h=>'<button class="action" onclick="startHobby(&quot;'+h.id+'&quot;)"><b>'+h.name+'</b><small>'+fmt(h.cost)+' indulás • '+h.desc+'</small></button>').join("");return panel("🎯 Hobbiid",owned)+panel("Új hobbi",'<div class="grid">'+available+'</div>')}
function socialNames(){return{instantframe:{name:"Instantframe",icon:"📸",desc:"Fotók és pillanatok."},mikmok:{name:"MikMok",icon:"🎵",desc:"Rövid videók és trendek."},mega:{name:"Mega",icon:"🌐",desc:"A MegaLife saját hálózata."}}}
function socialProfile(k){return state.social.platforms[k]||null}
function joinSocial(k){if(state.age<10)return toast("10 éves kor alatt még nem csatlakozhatsz.");const p=socialNames()[k];if(!p)return;if(socialProfile(k))return toast("Már csatlakoztál.");const h="@"+((state.first+state.last).toLowerCase().replace(/[^a-z0-9]/g,"").slice(0,16)||"megalife")+rand(10,99);state.social.platforms[k]={handle:h,followers:0,posts:0,likes:0,joinedAge:state.age};state.social.followers=Object.values(state.social.platforms).reduce((n,x)=>n+(x.followers||0),0);log("Csatlakoztál a "+p.name+" platformhoz: "+h+".","Közösség");render();save();toast("Csatlakoztál: "+p.name)}
function socialPost(k){const p=socialNames()[k],a=socialProfile(k);if(!a)return toast("Előbb csatlakozz.");const base=rand(10,90)+Math.round(state.looks*2)+Math.round(state.happiness/2),viral=Math.random()<.08,gain=viral?base*rand(15,50):base,likes=Math.max(1,Math.round(gain*(.4+Math.random())));a.posts++;a.followers+=gain;a.likes+=likes;state.social.posts++;state.social.followers=Object.values(state.social.platforms).reduce((n,x)=>n+(x.followers||0),0);state.happiness=clamp(state.happiness+rand(1,4));log(viral?"VIRÁLIS lett a posztod a "+p.name+"-on! +"+gain+" követő.":"Posztoltál a "+p.name+"-on. +"+gain+" követő, +"+likes+" kedvelés.","Közösség");checkAchievements();render();save();toast(viral?"🔥 VIRÁLIS!":"Poszt közzétéve")}
function socialTrend(k){const p=socialNames()[k],a=socialProfile(k);if(!a)return toast("Előbb csatlakozz.");const cost=rand(0,15000);if(state.money<cost)return toast("Ehhez "+fmt(cost)+" Ft kell.");state.money-=cost;state.stats.spent+=cost;const gain=rand(150,1800)+Math.round(state.looks*5);a.followers+=gain;a.likes+=rand(50,800);state.social.followers=Object.values(state.social.platforms).reduce((n,x)=>n+(x.followers||0),0);log("Felültél egy trend hullámára a "+p.name+"-on. +"+gain+" követő.","Közösség");render();save()}
function renderSocial(){const box=$("tab-social");if(!box)return;const ns=socialNames();box.innerHTML=panel("📱 Közösségi élet",'<p class="muted social-intro">Építs saját online életet: csatlakozz, posztolj, trendelj, és válj ismertté.</p><div class="social-list">'+Object.entries(ns).map(([k,p])=>{const a=socialProfile(k);return '<div class="social-card"><div class="social-card-head"><div class="social-icon">'+p.icon+'</div><div><b>'+p.name+'</b><small>'+p.desc+'</small></div></div>'+(a?'<div class="social-meta"><span>'+a.handle+'</span><span>👥 '+a.followers+'</span><span>❤️ '+a.likes+'</span><span>📝 '+a.posts+'</span></div><div class="social-actions"><button class="action" onclick="socialPost(&quot;'+k+'&quot;)"><b>✍️ Posztolás</b><small>Oszd meg a napod.</small></button><button class="action" onclick="socialTrend(&quot;'+k+'&quot;)"><b>🔥 Trend</b><small>Próbálj berobbanni.</small></button></div>':'<button class="action" onclick="joinSocial(&quot;'+k+'&quot;)"><b>➕ Csatlakozás</b><small>Hozd létre a profilod.</small></button>')+'</div>'}).join('')+'</div>')+panel("🌟 Hírnév",'<div class="social-total"><b>'+state.social.followers+'</b><span>összes követő</span></div>')}
function renderAchievements(){$("tab-achievements").innerHTML=panel("Eredmények",achievements.map(a=>'<div class="achievement list-item"><div class="ico">'+a[1]+'</div><div style="flex:1"><b>'+a[2]+'</b><br><small class="muted">'+a[3]+'</small></div><span class="pill">'+(state.achievements.includes(a[0])?"✓":"—")+"</span></div>").join(""))}
function renderStatsTab(){$("tab-stats").innerHTML=panel("Életstatisztika",'<div class="grid">'+[["Megélt évek",state.stats.years],["Összes kereset",fmt(state.stats.earned)],["Összes költés",fmt(state.stats.spent)],["Kapcsolatok",state.stats.relationships],["Gyerekek",state.stats.children],["Bűncselekmények",state.stats.crimes],["Utazások",state.travelCount],["Befektetési profit",fmt(state.stats.investProfit)],["Követők",state.social.followers]].map(x=>'<div class="action"><b>'+x[0]+'</b><small>'+x[1]+"</small></div>").join("")+"</div>")+panel("Karma",'<div class="meter"><i style="width:'+state.karma+'%"></i></div><small class="muted">Karma: '+Math.round(state.karma)+'/100</small>')}
function toggleSetup(){const e=$("advancedSetup");if(!e)return;e.classList.toggle("hidden");const b=document.querySelector(".setup-toggle");if(b)b.classList.toggle("open",!e.classList.contains("hidden"))}
function mlCloseAfterAction(){setTimeout(()=>{if(!$("modal")||$("modal").classList.contains("hidden")){closeTabs();render();}},60)}
function start(){state=fresh();log("Megszülettél. A történeted most kezdődik.","Sors");save();render();toast("Új élet elindítva!")}
function nextYear(){if(!state||!state.alive)return;state.age++;state.year++;state.stats.years++;state.stats.days+=365;state.stats.actions++;state.relationships.forEach(r=>r.age++);state.children.forEach(ch=>ch.age++);state.hobbies.forEach(h=>{h.years=(Number(h.years)||0)+1;if(Math.random()<.35){h.level=Math.min(100,h.level+1);const def=hobbyById(h.id);if(def&&h.level%10===0)log("Szintet léptél a hobbidban: "+def.name+" (Lv. "+h.level+").","Hobbi")}});if(state.jail>0){state.jail--;state.health=clamp(state.health-rand(1,4));state.happiness=clamp(state.happiness-rand(3,8));log("Börtönben töltöttél egy évet. Még "+state.jail+" év van hátra.","Jog")}if(state.business){const profit=Math.round(state.business.value*(Math.random()*.12-.03));state.business.value=Math.max(0,state.business.value+profit);state.money+=Math.max(0,profit);if(profit>0)state.stats.earned+=profit;log("A vállalkozásod éves eredménye: "+fmt(profit)+".","Üzlet")}state.assets.forEach(a=>{if(a.income){state.money+=a.income;state.stats.earned+=a.income}});if(state.age>=18&&state.jail===0){const income=state.job[1];state.money+=income;state.stats.earned+=income;if(state.job[0]!=="Munkanélküli")log("Megkaptad az éves fizetésed: "+fmt(income),"Pénz")}state.bank=Math.round(state.bank*1.025);const expense=state.age<18?rand(1000,6000):rand(60000,Math.max(70000,Math.round((state.job[1]||150000)/5)));if(state.money>=expense){state.money-=expense;state.stats.spent+=expense}else{const shortage=expense-state.money;state.debt+=shortage;state.money=0;log("Nem tudtad fedezni a kiadásaidat, "+fmt(shortage)+" Ft-tal nőtt a tartozásod.","Pénz")}state.happiness-=rand(0,5);state.health-=state.age>60?rand(1,5):rand(0,2);if(state.age===6)log("Elkezdted az általános iskolát.","Oktatás");if(state.age===14)log("Középiskolás lettél.","Oktatás");if(state.age===18)log("Nagykorú lettél.","Mérföldkő");if(state.age===65)log("Nyugdíjas korba léptél.","Mérföldkő");if(state.age>=10){Object.values(state.social.platforms||{}).forEach(a=>{if(a&&a.followers>0){const g=Math.max(0,Math.round(a.followers*(Math.random()*.08-.01)));a.followers+=g;if(g>0&&Math.random()<.2)log("A profilod magától is növekedett: +"+g+" követő.","Közösség")}});state.social.followers=Object.values(state.social.platforms||{}).reduce((n,x)=>n+(x.followers||0),0)}randomLifeEvent();if(state.age>=18&&state.job[0]!=="Munkanélküli"&&!/Előléptetve/.test(state.job[0])&&Math.random()<.18){state.job=[state.job[0]+" • Előléptetve",Math.round(state.job[1]*1.18),state.job[2]];log("Előléptettek a munkahelyeden!","Karrier")}if(Math.random()<.18)choiceEvent();checkAchievements();if(state.age>70&&Math.random()<Math.min(.06,(state.age-70)*.006))die(pick(["időskori természetes okok","szívprobléma","betegség"]));normalize();save();render()}
function randomLifeEvent(){if(Math.random()>.62)return;pick([()=>{const n=rand(5000,80000);state.money+=n;log("Egy távoli rokon "+fmt(n)+" örökséget hagyott rád.","Szerencse")},()=>{state.happiness=clamp(state.happiness+rand(8,18));log("Fantasztikus napot töltöttél a barátaiddal.","Élet")},()=>{state.health=clamp(state.health-rand(8,20));log("Elkaptál egy kellemetlen betegséget.","Egészség")},()=>{const n=rand(10000,120000);state.money+=n;state.stats.earned+=n;log("Egy váratlan mellékesből "+fmt(n)+" érkezett.","Pénz")},()=>{if(state.job[0]!=="Munkanélküli"&&!/Senior|Előléptetve/.test(state.job[0])){state.job=[state.job[0]+" • Senior",Math.round(state.job[1]*1.25),state.job[2]];log("Előléptettek! A fizetésed 25%-kal nőtt.","Karrier")}},()=>{if(state.social.followers>100){const n=rand(1000,20000);state.social.followers+=n;log("Egy posztod felrobbant az interneten, +"+n+" követő.","Közösség")}},()=>{if(state.relationships.length){state.relationships[0].closeness=clamp(state.relationships[0].closeness+15);log(state.relationships[0].name+" meglepett egy ajándékkal.","Kapcsolat")}}])()}
function dateAction(){if(state.age<14)return toast("Még túl fiatal vagy a randizáshoz.");const r={name:pick(names.female.concat(names.male).concat(names.neutral))+" "+pick(surnames),age:state.age+rand(-2,3),type:"Randi",closeness:rand(40,75)};state.relationships.push(r);state.stats.relationships++;log("Megismerkedtél "+r.name+" nevű emberrel.","Kapcsolat");render()}
function interact(i){const r=state.relationships[i];if(!r)return toast("Ez a kapcsolat már nem elérhető.");r.closeness=clamp(r.closeness+rand(5,18));state.happiness=clamp(state.happiness+rand(2,7));log("Időt töltöttél "+r.name+" társaságában. Kapcsolat: "+r.closeness+"%.","Kapcsolat");render()}
function marryAction(){if(state.age<18)return toast("18 éves kor előtt nem házasodhatsz.");if(state.flags.married)return toast("Már házas vagy.");const r=state.relationships.find(x=>x.closeness>=70&&x.type!=="Jegyes");if(!r)return toast("Nincs még elég erős kapcsolatod.");state.flags.married=true;r.type="Házastárs";state.happiness=clamp(state.happiness+15);log("Összeházasodtál "+r.name+"-nel!","Kapcsolat");checkAchievements();render()}
function childAction(){if(!state.flags.married)return toast("Előbb házasodj meg.");if(state.age<18||state.age>50)return toast("Ebben az életkorban ez most nem lehetséges.");if(!state.relationships.some(x=>x.type==="Házastárs"))return toast("Gyermekvállaláshoz házastársi kapcsolat kell.");if(state.children.length>=10)return toast("Ennyi gyermek már túl sok lenne ebben a történetben.");const child={name:pick(names.female.concat(names.male))+" "+state.last,age:0};state.children.push(child);state.stats.children++;log("Megszületett "+child.name+"!","Család");checkAchievements();render()}
function study(){if(state.age<6)return toast("Még nem vagy iskolás.");state.smarts=clamp(state.smarts+rand(2,7));state.discipline=clamp(state.discipline+rand(1,5));log("Sokat tanultál, az intelligenciád nőtt.","Oktatás");render()}
function university(){if(state.flags.university||state.degree)return toast("Már van diplomád.");if(state.age<17||state.age>35)return toast("Az egyetemhez megfelelő életkor kell.");if(state.smarts<45)return toast("Fejleszd az intelligenciád.");state.flags.university=true;state.education="Egyetem";state.degree=pick(["informatika","mérnöki","orvosi","jogi","gazdasági"]);state.smarts=clamp(state.smarts+rand(8,18));state.money-=Math.min(state.money,rand(100000,400000));log("Elvégezted az egyetemet: "+state.degree+" diploma.","Oktatás");checkAchievements();render()}
function getJob(i){const j=jobs[i];if(state.age<16)return toast("Még túl fiatal vagy ehhez.");if(state.smarts<j[2])return toast("Ehhez az álláshoz több intelligencia/tanulmány kell.");if(j[0]==="Orvos"&&!state.degree)return toast("Ehhez diploma kell.");state.job=j;log("Új munkád lett: "+j[0]+".","Karrier");render()}
function bank(amount){if(amount>0){if(state.money<amount)return toast("Nincs ennyi készpénzed.");state.money-=amount;state.bank+=amount}else{const n=Math.min(state.bank,-amount);state.bank-=n;state.money+=n}save();render()}
function loan(){const n=rand(500000,3000000);state.money+=n;state.debt+=Math.round(n*1.2);log("Felvettél "+fmt(n)+" hitelt.","Pénz");render()}
function invest(){if(state.money<100000)return toast("Legalább 100 000 Ft kell.");const stake=rand(100000,Math.min(2000000,state.money));state.money-=stake;const ret=Math.round(stake*(Math.random()*.9+.55));state.money+=ret;state.stats.investProfit+=ret-stake;log("Befektetés: "+fmt(stake)+" → "+fmt(ret)+".","Pénz");render()}
function gamble(){if(state.money<10000)return toast("Legalább 10 000 Ft kell.");const stake=rand(10000,Math.min(250000,state.money));state.money-=stake;if(Math.random()<.43){const win=stake*rand(2,5);state.money+=win;log("Nagyot nyertél: "+fmt(win)+"!","Szerencse")}else log("Elvesztetted a feltett "+fmt(stake)+" összeget.","Szerencse");render()}
function buy(name,icon,value){if(state.money<value)return toast("Nincs elég pénzed.");state.money-=value;state.assets.push({name,icon,value});state.stats.spent+=value;log("Megvásároltad: "+name+".","Vagyon");checkAchievements();render()}
function buyHouse(){buy("Belvárosi lakás","🏠",6000000)}function buyCar(){buy("Sportos autó","🚗",3000000)}function buyLuxury(){buy("Luxusóra","💎",1200000)}
function sellAsset(i){const a=state.assets[i],v=Math.round(a.value*rand(75,105)/100);state.money+=v;state.assets.splice(i,1);log("Eladtad: "+a.name+" "+fmt(v)+" összegért.","Vagyon");render()}
function activity(t){if(t==="exercise"){state.health=clamp(state.health+rand(5,12));state.happiness=clamp(state.happiness+3);log("Edzettél és jobban érzed magad.","Egészség")}if(t==="meditate"){state.happiness=clamp(state.happiness+rand(4,10));state.discipline=clamp(state.discipline+3);log("Meditáltál, kitisztult a fejed.","Élet")}if(t==="party"){const c=rand(5000,50000);state.money=Math.max(0,state.money-c);state.happiness=clamp(state.happiness+rand(8,16));log("Buliztál egy nagyot, "+fmt(c)+"-ba került.","Élet")}if(t==="doctor"){if(state.money<50000)return toast("Az orvosi vizit 50 000 Ft.");state.money-=50000;state.health=clamp(state.health+rand(10,25));log("Elmentél orvoshoz.","Egészség")}if(t==="social"){const gain=rand(50,3000)+Math.round(state.looks*8);state.social.followers+=gain;state.social.posts++;log("Új posztod "+gain+" új követőt hozott.","Közösség")}render();checkAchievements()}
function travel(){if(state.money<250000)return toast("Az utazás 250 000 Ft.");state.money-=250000;state.travelCount++;state.happiness=clamp(state.happiness+rand(10,20));log("Elutaztál egy új országba.","Utazás");checkAchievements();render()}
function pet(){if(state.pet||state.assets.some(a=>a.name.includes("Háziállat")))return toast("Már van háziállatod.");if(state.money<150000)return toast("A háziállat 150 000 Ft.");state.money-=150000;state.pet={name:pick(["Morzsi","Luna","Max","Bella"]),age:0};state.stats.spent+=150000;log("Örökbe fogadtál egy háziállatot: "+state.pet.name+".","Család");render()}
function crime(){if(state.age<16)return toast("Még túl fiatal vagy.");if(state.jail>0)return toast("Börtönben vagy.");const gain=rand(100000,1500000);state.stats.crimes++;state.crimes.push({age:state.age});if(Math.random()<.32){const sentence=rand(1,6);state.jail+=sentence;state.debt+=rand(100000,800000);state.happiness-=15;log("Elkövettél egy bűncselekményt, elkaptak és "+sentence+" év börtönt kaptál.","Jog")}else{state.money+=gain;state.karma-=20;log("Sikeres bűncselekmény: "+fmt(gain)+" zsákmány.","Jog")}checkAchievements();render()}
function die(cause){state.alive=false;state.stats.deathCause=cause;log("Meghaltál "+state.age+". éves korodban. Ok: "+cause+".","Halál");save();render();showDeath()}
function showDeath(){$("modalBody").innerHTML='<div class="death"><h2>🪦 Az életed véget ért</h2><p>'+state.first+" "+state.last+" "+state.age+" évet élt.</p><p><b>Halál oka:</b> "+state.stats.deathCause+'</p><p class="muted">Vagyon: '+fmt(wealth())+" • Gyerekek: "+state.children.length+" • Utazások: "+state.travelCount+'</p><button class="primary big" onclick="closeModal();newLife()">Új élet</button></div>';$("modal").classList.remove("hidden")}
function checkAchievements(){const c={"first-year":state.age>=1,"millionaire":wealth()>=1000000,"rich":wealth()>=100000000,"degree":!!state.degree,"married":state.flags.married,"parent":state.children.length>0,"travel":state.travelCount>=5,"crime":state.crimes.length>0,"car":state.assets.some(a=>a.name.includes("autó")),"house":state.assets.some(a=>a.name.includes("lakás")),"old":state.age>=80,"social":state.social.followers>=1000000};for(const a of achievements)if(c[a[0]]&&!state.achievements.includes(a[0])){state.achievements.push(a[0]);log("🏆 Eredmény feloldva: "+a[2],"Eredmény");toast("🏆 "+a[2])}}
function newLife(){localStorage.removeItem(saveKey);state=null;$("modal").classList.add("hidden");render()}
function showTab(tab){document.querySelectorAll(".tab").forEach(e=>e.classList.add("hidden"));$("tab-"+tab).classList.remove("hidden");document.querySelectorAll("#tabs button").forEach(b=>b.classList.toggle("active",b.dataset.tab===tab))}
function closeModal(){$("modal").classList.add("hidden")}
/* Legacy immediate bindings removed. Initialization is handled once after DOMContentLoaded. */
function choiceEvent(){const events=[{title:"Kockázatos lehetőség",text:"Egy ismerősöd azt ajánlja, hogy fektess be egy új projektbe.",choices:[["💰 500 000 Ft befektetés",()=>{if(state.money<500000)return toast("Nincs elég pénzed.");state.money-=500000;const win=Math.random()<.58;const n=win?rand(700000,1800000):0;state.money+=n;log(win?"A projekt hatalmasat ment: +"+fmt(n)+".":"A projekt bedőlt, elvesztetted a pénzed.","Döntés") }],["❌ Nem vállalom",()=>log("Nem vállaltad a kockázatot.","Döntés")]]},{title:"Életfordító találkozás",text:"Egy régi ismerős újra felbukkan az életedben.",choices:[["❤️ Közeledj hozzá",()=>{dateAction();state.happiness=clamp(state.happiness+8)}],["👋 Maradj távol",()=>{state.karma=clamp(state.karma+2);log("Továbbmentél.","Döntés")}]]},{title:"Karrierdöntés",text:"Felajánlanak egy nehezebb, de jobban fizető pozíciót.",choices:[["🚀 Elfogadom",()=>{if(state.age<18)return toast("Ehhez nagykorúnak kell lenned.");state.job=["Projektvezető",Math.max(700000,state.job[1]*1.35),Math.max(55,state.job[2])];log("Elfogadtad az új pozíciót.","Karrier")}],["🧘 Maradok",()=>{state.happiness=clamp(state.happiness+4);log("A stabilitást választottad.","Döntés")}]]}];const e=pick(events);$("modalBody").innerHTML="<h2>"+e.title+"</h2><p>"+e.text+"</p>"+e.choices.map((x,i)=>'<button class="choice" onclick="resolveChoice('+i+')">'+x[0]+"</button>").join("");window.__choices=e.choices.map(x=>x[1]);$("modal").classList.remove("hidden")}
function resolveChoice(i){const fn=window.__choices&&window.__choices[i];closeModal();if(fn){fn();normalize();save();render()}}
function startBusiness(){if(state.age<18)return toast("Vállalkozást nagykorúként indíthatsz.");if(state.business)return toast("Már van vállalkozásod.");if(state.money<1000000)return toast("Legalább 1 000 000 Ft indulótőke kell.");state.money-=1000000;state.business={name:pick(["Nova Labs","Urban Works","Pixel Forge","Mega Market","Stellar Studio"]),value:1000000};log("Elindítottad a saját vállalkozásodat: "+state.business.name+".","Üzlet");render()}
function sellBusiness(){if(!state.business)return toast("Nincs vállalkozásod.");const v=Math.round(state.business.value*(.7+Math.random()*.7));state.money+=v;log("Eladtad a vállalkozásodat "+fmt(v)+" összegért.","Üzlet");state.business=null;render()}
function proposal(){if(state.age<18)return toast("18 éves kor előtt nem jegyezheted el.");if(state.flags.married)return toast("Már házas vagy.");if(state.relationships.some(x=>x.type==="Jegyes"))return toast("Már el vagy jegyezve.");const r=state.relationships.find(x=>x.closeness>=85&&x.type!=="Házastárs");if(!r)return toast("Ehhez legalább 85%-os kapcsolat kell.");r.type="Jegyes";r.closeness=95;log("Eljegyezted "+r.name+"-t.","Kapcsolat");render()}

/* Pull-to-refresh mobile gesture */
(function setupPullToRefresh(){
  let startY=0,startX=0,pulling=false,refreshing=false;
  const threshold=78;
  const indicator=document.createElement("div");
  indicator.id="pullRefreshIndicator";
  indicator.innerHTML='<span class="pull-icon">↓</span><span class="pull-label">Húzd le a frissítéshez</span>';
  document.body.appendChild(indicator);
  const setProgress=(distance)=>{
    const progress=Math.min(1,distance/threshold);
    indicator.style.setProperty("--pull-progress",progress);
    indicator.classList.toggle("ready",progress>=1);
    indicator.querySelector(".pull-icon").textContent=progress>=1?"↻":"↓";
    indicator.querySelector(".pull-label").textContent=progress>=1?"Engedd el a frissítéshez":"Húzd le a frissítéshez";
  };
  window.addEventListener("touchstart",e=>{
    if(refreshing||window.scrollY>0||e.touches.length!==1)return;
    startY=e.touches[0].clientY;startX=e.touches[0].clientX;pulling=true;
  },{passive:true});
  window.addEventListener("touchmove",e=>{
    if(!pulling||refreshing||window.scrollY>0||e.touches.length!==1)return;
    const dy=e.touches[0].clientY-startY,dx=Math.abs(e.touches[0].clientX-startX);
    if(dy<=0||dy<dx)return;
    const distance=Math.min(110,dy*.55);
    indicator.style.transform="translate(-50%, "+Math.round(distance-52)+"px)";
    indicator.classList.add("visible");
    setProgress(distance);
  },{passive:true});
  window.addEventListener("touchend",e=>{
    if(!pulling)return;
    pulling=false;
    const ready=indicator.classList.contains("ready");
    if(ready){
      refreshing=true;
      indicator.classList.add("refreshing");
      indicator.querySelector(".pull-label").textContent="Frissítés…";
      indicator.querySelector(".pull-icon").textContent="↻";
      setTimeout(()=>location.reload(),220);
    }else{
      indicator.classList.remove("visible","ready");
      indicator.style.transform="translate(-50%, -52px)";
      setProgress(0);
    }
  },{passive:true});
  window.addEventListener("touchcancel",()=>{pulling=false;indicator.classList.remove("visible","ready");indicator.style.transform="translate(-50%, -52px)";setProgress(0)},{passive:true});
})();

function refreshPage(){location.reload();}

window.addEventListener("load",()=>{const v=document.getElementById("versionText");if(v)v.textContent="v"+VERSION;});

/* MegaLife 0.0.4 — mobile + multi-life saves + 10,000 generated annual events */
var currentSlot=1;
const SLOT_COUNT=8;
const slotKey=n=>"megalife-slot-"+n;

function getSlotData(n){
  try{return JSON.parse(localStorage.getItem(slotKey(n))||"null")}catch(e){return null}
}
function save(){
  if(!state)return;
  state.meta=state.meta||{};
  state.meta.version=VERSION;
  state.meta.slot=currentSlot;
  localStorage.setItem(slotKey(currentSlot),JSON.stringify(state));
  localStorage.setItem("megalife-active-slot",String(currentSlot));
  toast("Mentve • Élet "+currentSlot);
  renderSlots();
}
function load(){
  const old=localStorage.getItem("megalife-save-v1");
  if(!getSlotData(1)&&old){localStorage.setItem(slotKey(1),old);localStorage.removeItem("megalife-save-v1")}
  currentSlot=Math.max(1,Math.min(SLOT_COUNT,Number(localStorage.getItem("megalife-active-slot"))||1));
  const x=getSlotData(currentSlot);
  if(x&&x.alive!==undefined){state=x;normalize();return true}
  state=null;return false
}
function start(){
  state=fresh();
  state.meta={version:VERSION,slot:currentSlot};
  log("Megszülettél. A történeted most kezdődik.","Sors");
  save();render();toast("Új élet "+currentSlot+" elindítva!");
}
function newLife(){
  try{localStorage.removeItem(slotKey(currentSlot));}catch(e){}
  state=null;
  $("modal").classList.add("hidden");
  $("gameScreen").classList.add("hidden");
  $("startScreen").classList.remove("hidden");
  $("saveNotice").textContent="Új élet indítására kész.";
  renderSlots();
}
function manageSaves(){
  const slots=[];
  for(let i=1;i<=SLOT_COUNT;i++){
    const x=getSlotData(i);
    slots.push('<div class="save-slot '+(i===currentSlot?"selected":"")+'"><div><b>💾 Élet '+i+'</b><small>'+(x?(x.first+" "+x.last+" • "+x.age+" éves • "+fmt(x.money)+" készpénz"):"Üres mentési hely")+'</small></div><div class="save-actions">'+(x?'<button class="ghost" onclick="switchSaveSlot('+i+')">Betöltés</button><button class="danger" onclick="deleteSaveSlot('+i+')">Törlés</button>':'<button class="primary" onclick="useEmptySlot('+i+')">Új élet</button>')+'</div></div>');
  }
  $("modalBody").innerHTML='<h2>💾 Életek és mentések</h2><p class="muted">8 teljesen különálló életet kezelhetsz. Az aktuális élet automatikusan menthető.</p><div class="save-slots">'+slots.join("")+'</div><button class="ghost big" onclick="closeModal()">Bezárás</button>';
  $("modal").classList.remove("hidden");
}
function switchSaveSlot(n){
  currentSlot=n;
  localStorage.setItem("megalife-active-slot",String(n));
  const x=getSlotData(n);
  if(x){state=x;normalize();closeModal();render();toast("Élet "+n+" betöltve.");}
  else{state=null;closeModal();render();toast("Élet "+n+" üres.");}
}
function useEmptySlot(n){currentSlot=n;localStorage.setItem("megalife-active-slot",String(n));state=null;closeModal();render();toast("Élet "+n+" kiválasztva. Indítsd el az új életet.");}
function deleteSaveSlot(n){
  if(!confirm("Törlöd az Élet "+n+" mentését?"))return;
  localStorage.removeItem(slotKey(n));
  if(currentSlot===n){state=null}
  manageSaves();render();
}
function renderSlots(){}
function render(){if(!state){$("startScreen").classList.remove("hidden");$("gameScreen").classList.add("hidden");$("versionText")&&($("versionText").textContent="v"+VERSION);return}
  $("startScreen").classList.add("hidden");$("gameScreen").classList.remove("hidden");
  $("pName").textContent=state.first+" "+state.last;$("avatar").textContent=state.first[0].toUpperCase();$("pMeta").textContent=state.age+" éves • "+state.gender+" • "+state.country+" • Élet "+currentSlot;$("ageText").textContent=state.age+" éves";$("yearText").textContent=" • "+state.year;$("wealth").textContent=fmt(wealth());renderStats();renderLife();renderRelations();renderCareer();renderFinance();renderAssets();renderActivities();renderAchievements();renderStatsTab();renderSocial();$("versionText")&&($("versionText").textContent="v"+VERSION);
}

/* 10,000 unique event combinations: 100 situations × 100 variants. */
const EVENT_SITUATIONS=[["Egy régi barát váratlanul megjelent az életedben","Élet",["happiness",3,15]],["Egy váratlan lehetőség váratlanul megjelent az életedben","Élet",["money",5000,90000]],["Egy családi ügy váratlanul megjelent az életedben","Élet",["karma",1,7]],["Egy munkahelyi helyzet váratlanul megjelent az életedben","Élet",["smarts",1,6]],["Egy új ismerős váratlanul megjelent az életedben","Élet",["followers",100,15000]],["Egy régi emlék váratlanul megjelent az életedben","Élet",["happiness",3,15]],["Egy online bejegyzés váratlanul megjelent az életedben","Élet",["money",5000,90000]],["Egy különös találkozás váratlanul megjelent az életedben","Élet",["karma",1,7]],["Egy fontos döntés váratlanul megjelent az életedben","Élet",["smarts",1,6]],["Egy szerencsés pillanat váratlanul megjelent az életedben","Élet",["followers",100,15000]],["Egy régi barát váratlanul megjelent az életedben","Élet",["happiness",3,15]],["Egy váratlan lehetőség váratlanul megjelent az életedben","Élet",["money",5000,90000]],["Egy családi ügy váratlanul megjelent az életedben","Élet",["karma",1,7]],["Egy munkahelyi helyzet váratlanul megjelent az életedben","Élet",["smarts",1,6]],["Egy új ismerős váratlanul megjelent az életedben","Élet",["followers",100,15000]],["Egy régi emlék váratlanul megjelent az életedben","Élet",["happiness",3,15]],["Egy online bejegyzés váratlanul megjelent az életedben","Élet",["money",5000,90000]],["Egy különös találkozás váratlanul megjelent az életedben","Élet",["karma",1,7]],["Egy fontos döntés váratlanul megjelent az életedben","Élet",["smarts",1,6]],["Egy szerencsés pillanat váratlanul megjelent az életedben","Élet",["followers",100,15000]],["Egy régi barát váratlanul megjelent az életedben","Élet",["happiness",3,15]],["Egy váratlan lehetőség váratlanul megjelent az életedben","Élet",["money",5000,90000]],["Egy családi ügy váratlanul megjelent az életedben","Élet",["karma",1,7]],["Egy munkahelyi helyzet váratlanul megjelent az életedben","Élet",["smarts",1,6]],["Egy új ismerős váratlanul megjelent az életedben","Élet",["followers",100,15000]],["Egy régi emlék váratlanul megjelent az életedben","Élet",["happiness",3,15]],["Egy online bejegyzés váratlanul megjelent az életedben","Élet",["money",5000,90000]],["Egy különös találkozás váratlanul megjelent az életedben","Élet",["karma",1,7]],["Egy fontos döntés váratlanul megjelent az életedben","Élet",["smarts",1,6]],["Egy szerencsés pillanat váratlanul megjelent az életedben","Élet",["followers",100,15000]],["Egy régi barát váratlanul megjelent az életedben","Élet",["happiness",3,15]],["Egy váratlan lehetőség váratlanul megjelent az életedben","Élet",["money",5000,90000]],["Egy családi ügy váratlanul megjelent az életedben","Élet",["karma",1,7]],["Egy munkahelyi helyzet váratlanul megjelent az életedben","Élet",["smarts",1,6]],["Egy új ismerős váratlanul megjelent az életedben","Élet",["followers",100,15000]],["Egy régi emlék váratlanul megjelent az életedben","Élet",["happiness",3,15]],["Egy online bejegyzés váratlanul megjelent az életedben","Élet",["money",5000,90000]],["Egy különös találkozás váratlanul megjelent az életedben","Élet",["karma",1,7]],["Egy fontos döntés váratlanul megjelent az életedben","Élet",["smarts",1,6]],["Egy szerencsés pillanat váratlanul megjelent az életedben","Élet",["followers",100,15000]],["Egy régi barát váratlanul megjelent az életedben","Élet",["happiness",3,15]],["Egy váratlan lehetőség váratlanul megjelent az életedben","Élet",["money",5000,90000]],["Egy családi ügy váratlanul megjelent az életedben","Élet",["karma",1,7]],["Egy munkahelyi helyzet váratlanul megjelent az életedben","Élet",["smarts",1,6]],["Egy új ismerős váratlanul megjelent az életedben","Élet",["followers",100,15000]],["Egy régi emlék váratlanul megjelent az életedben","Élet",["happiness",3,15]],["Egy online bejegyzés váratlanul megjelent az életedben","Élet",["money",5000,90000]],["Egy különös találkozás váratlanul megjelent az életedben","Élet",["karma",1,7]],["Egy fontos döntés váratlanul megjelent az életedben","Élet",["smarts",1,6]],["Egy szerencsés pillanat váratlanul megjelent az életedben","Élet",["followers",100,15000]],["Egy régi barát váratlanul megjelent az életedben","Élet",["happiness",3,15]],["Egy váratlan lehetőség váratlanul megjelent az életedben","Élet",["money",5000,90000]],["Egy családi ügy váratlanul megjelent az életedben","Élet",["karma",1,7]],["Egy munkahelyi helyzet váratlanul megjelent az életedben","Élet",["smarts",1,6]],["Egy új ismerős váratlanul megjelent az életedben","Élet",["followers",100,15000]],["Egy régi emlék váratlanul megjelent az életedben","Élet",["happiness",3,15]],["Egy online bejegyzés váratlanul megjelent az életedben","Élet",["money",5000,90000]],["Egy különös találkozás váratlanul megjelent az életedben","Élet",["karma",1,7]],["Egy fontos döntés váratlanul megjelent az életedben","Élet",["smarts",1,6]],["Egy szerencsés pillanat váratlanul megjelent az életedben","Élet",["followers",100,15000]],["Egy régi barát váratlanul megjelent az életedben","Élet",["happiness",3,15]],["Egy váratlan lehetőség váratlanul megjelent az életedben","Élet",["money",5000,90000]],["Egy családi ügy váratlanul megjelent az életedben","Élet",["karma",1,7]],["Egy munkahelyi helyzet váratlanul megjelent az életedben","Élet",["smarts",1,6]],["Egy új ismerős váratlanul megjelent az életedben","Élet",["followers",100,15000]],["Egy régi emlék váratlanul megjelent az életedben","Élet",["happiness",3,15]],["Egy online bejegyzés váratlanul megjelent az életedben","Élet",["money",5000,90000]],["Egy különös találkozás váratlanul megjelent az életedben","Élet",["karma",1,7]],["Egy fontos döntés váratlanul megjelent az életedben","Élet",["smarts",1,6]],["Egy szerencsés pillanat váratlanul megjelent az életedben","Élet",["followers",100,15000]],["Egy régi barát váratlanul megjelent az életedben","Élet",["happiness",3,15]],["Egy váratlan lehetőség váratlanul megjelent az életedben","Élet",["money",5000,90000]],["Egy családi ügy váratlanul megjelent az életedben","Élet",["karma",1,7]],["Egy munkahelyi helyzet váratlanul megjelent az életedben","Élet",["smarts",1,6]],["Egy új ismerős váratlanul megjelent az életedben","Élet",["followers",100,15000]],["Egy régi emlék váratlanul megjelent az életedben","Élet",["happiness",3,15]],["Egy online bejegyzés váratlanul megjelent az életedben","Élet",["money",5000,90000]],["Egy különös találkozás váratlanul megjelent az életedben","Élet",["karma",1,7]],["Egy fontos döntés váratlanul megjelent az életedben","Élet",["smarts",1,6]],["Egy szerencsés pillanat váratlanul megjelent az életedben","Élet",["followers",100,15000]],["Egy régi barát váratlanul megjelent az életedben","Élet",["happiness",3,15]],["Egy váratlan lehetőség váratlanul megjelent az életedben","Élet",["money",5000,90000]],["Egy családi ügy váratlanul megjelent az életedben","Élet",["karma",1,7]],["Egy munkahelyi helyzet váratlanul megjelent az életedben","Élet",["smarts",1,6]],["Egy új ismerős váratlanul megjelent az életedben","Élet",["followers",100,15000]],["Egy régi emlék váratlanul megjelent az életedben","Élet",["happiness",3,15]],["Egy online bejegyzés váratlanul megjelent az életedben","Élet",["money",5000,90000]],["Egy különös találkozás váratlanul megjelent az életedben","Élet",["karma",1,7]],["Egy fontos döntés váratlanul megjelent az életedben","Élet",["smarts",1,6]],["Egy szerencsés pillanat váratlanul megjelent az életedben","Élet",["followers",100,15000]],["Egy régi barát váratlanul megjelent az életedben","Élet",["happiness",3,15]],["Egy váratlan lehetőség váratlanul megjelent az életedben","Élet",["money",5000,90000]],["Egy családi ügy váratlanul megjelent az életedben","Élet",["karma",1,7]],["Egy munkahelyi helyzet váratlanul megjelent az életedben","Élet",["smarts",1,6]],["Egy új ismerős váratlanul megjelent az életedben","Élet",["followers",100,15000]],["Egy régi emlék váratlanul megjelent az életedben","Élet",["happiness",3,15]],["Egy online bejegyzés váratlanul megjelent az életedben","Élet",["money",5000,90000]],["Egy különös találkozás váratlanul megjelent az életedben","Élet",["karma",1,7]],["Egy fontos döntés váratlanul megjelent az életedben","Élet",["smarts",1,6]],["Egy szerencsés pillanat váratlanul megjelent az életedben","Élet",["followers",100,15000]]];
const EVENT_VARIANTS=Array.from({length:100},(_,i)=>({adjs:["különleges","meglepő","váratlan","izgalmas","furcsa","szerencsés","nehéz","tanulságos","emlékezetes","sorsfordító"][i%10],place:["otthon","a városban","utazás közben","munka után","egy régi helyen","online","egy rendezvényen","egy boltban","a természetben","egy ismerősödnél"][Math.floor(i/10)%10],tone:i%2?"jó":"vegyes"}));
function annualEvent(){
  const idx=((state.age*97)+(state.year*13)+(state.stats.actions*7)+currentSlot*31)%10000;
  const situation=EVENT_SITUATIONS[Math.floor(idx/100)];
  const variant=EVENT_VARIANTS[idx%100];
  const [base,type,effect]=situation;
  let amount=rand(effect[1],effect[2]);
  if(effect[0]==="money"){state.money=Math.max(0,state.money+amount);if(amount>0)state.stats.earned+=amount;else state.stats.spent+=Math.abs(amount)}
  if(effect[0]==="happiness")state.happiness=clamp(state.happiness+amount);
  if(effect[0]==="karma")state.karma=clamp(state.karma+amount);
  if(effect[0]==="smarts")state.smarts=clamp(state.smarts+amount);
  if(effect[0]==="followers"){state.social.followers+=amount;state.social.posts++}
  log(base+" "+variant.adjs+" pillanat volt "+variant.place+" — "+(amount>=0?"+":"")+amount+(effect[0]==="money"?" Ft":effect[0]==="followers"?" követő":effect[0]==="happiness"?" boldogság":effect[0]==="smarts"?" intelligencia":" karma")+".",type);
  state.stats.annualEvent=idx;
}
function nextYear(){
  if(!state||!state.alive)return;
  state.age++;state.year++;state.stats.years++;state.stats.days+=365;state.stats.actions++;
  state.relationships.forEach(r=>r.age++);state.children.forEach(ch=>ch.age++);
  if(state.jail>0){state.jail--;state.health=clamp(state.health-rand(1,4));state.happiness=clamp(state.happiness-rand(3,8));log("Börtönben töltöttél egy évet. Még "+state.jail+" év van hátra.","Jog")}
  if(state.business){const profit=Math.round(state.business.value*(Math.random()*.12-.03));state.business.value=Math.max(0,state.business.value+profit);if(profit>0){state.money+=profit;state.stats.earned+=profit}else if(profit<0){const loss=Math.abs(profit);if(state.money>=loss){state.money-=loss;state.stats.spent+=loss}else{const shortage=loss-state.money;state.money=0;state.debt+=shortage;state.stats.spent+=loss;log("A vállalkozás vesztesége meghaladta a készpénzedet: +"+fmt(shortage)+" tartozás.","Üzlet")}}log("A vállalkozásod éves eredménye: "+fmt(profit)+".","Üzlet")}
  state.assets.forEach(a=>{if(a.income){state.money+=a.income;state.stats.earned+=a.income}});
  if(state.age>=18&&state.jail===0){const income=state.job[1];state.money+=income;state.stats.earned+=income;if(state.job[0]!=="Munkanélküli")log("Megkaptad az éves fizetésed: "+fmt(income),"Pénz")}
  state.bank=Math.round(state.bank*1.025);
  const expense=state.age<18?rand(1000,6000):rand(60000,Math.max(70000,Math.round((state.job[1]||150000)/5)));
  if(state.money>=expense){state.money-=expense;state.stats.spent+=expense}else{state.debt+=expense-state.money;state.money=0;log("Nem tudtad fedezni a kiadásaidat, nőtt a tartozásod.","Pénz")}
  state.happiness-=rand(0,5);state.health-=state.age>60?rand(1,5):rand(0,2);
  if(state.age===6)log("Elkezdted az általános iskolát.","Oktatás");if(state.age===14)log("Középiskolás lettél.","Oktatás");if(state.age===18)log("Nagykorú lettél.","Mérföldkő");if(state.age===65)log("Nyugdíjas korba léptél.","Mérföldkő");
  annualEvent();
  if(state.age>=18&&state.job[0]!=="Munkanélküli"&&Math.random()<.18){state.job=[state.job[0]+" • Előléptetve",Math.round(state.job[1]*1.18),state.job[2]];log("Előléptettek a munkahelyeden!","Karrier")}
  if(Math.random()<.18)choiceEvent();
  checkAchievements();
  if(state.health<=0)die("súlyos egészségromlás");
  else if(state.age>70&&Math.random()<Math.min(.06,(state.age-70)*.006))die(pick(["időskori természetes okok","szívprobléma","betegség"]));
  normalize();save();render();
}
window.addEventListener("load",()=>{const v=$("versionText");if(v)v.textContent="v"+VERSION});


/* Final UI bindings — keep controls connected to the latest game functions. */
// mlActionDelegation: actions inside full-screen pages return to the main life screen.
document.addEventListener("click",e=>{
 const b=e.target.closest(".legacy-tab .action,.legacy-tab .ghost");
 if(!b)return;
 setTimeout(()=>{if($("modal")&&$("modal").classList.contains("hidden")){closeTabs();}},90);
},{passive:true});
window.addEventListener("DOMContentLoaded",()=>{
  const startBtn=$("startBtn"),ageBtn=$("ageBtn"),saveBtn=$("saveBtn"),newBtn=$("newBtn"),modalClose=$("modalClose"),tabs=$("tabs");
  if(startBtn)startBtn.onclick=()=>start();
  if(ageBtn)ageBtn.onclick=()=>state&&state.alive?nextYear():showDeath();
  if(saveBtn)saveBtn.onclick=()=>save();
  if(newBtn){
    newBtn.onclick=(e)=>{
      e.preventDefault();
      e.stopPropagation();
      if(!window.confirm("Biztosan új életet kezdesz?"))return;
      newLife();
    };
  }
  if(modalClose)modalClose.onclick=()=>closeModal();
  if(tabs)tabs.onclick=e=>{
    const b=e.target.closest("button[data-tab]");
    if(b)showTab(b.dataset.tab);
  };
  if(load()){normalize();render();$("saveNotice").textContent="Mentett játék betöltve."}
  else render();
});


/* MegaLife v0.0.10 — BitLife-style HUD + coherent annual event engine */
const ML_EVENT_POOLS=[
 {name:"Pénzügy",items:[
  ["Adó-visszatérítés érkezett","Pénz",()=>{let n=rand(18000,140000);state.money+=n;state.stats.earned+=n;return "Adó-visszatérítésként "+fmt(n)+" érkezett a számládra."}],
  ["Elromlott egy fontos háztartási géped","Pénz",()=>{let n=rand(25000,180000);state.money=Math.max(0,state.money-n);state.stats.spent+=n;return "A javítás és csere összesen "+fmt(n)+"-ba került."}],
  ["Visszakaptál egy régi kauciót","Pénz",()=>{let n=rand(30000,160000);state.money+=n;state.stats.earned+=n;return "Egy régi kaucióból "+fmt(n)+" érkezett."}],
  ["Egy számlát kétszer vontak le","Pénz",()=>{let n=rand(7000,45000);state.money=Math.max(0,state.money-n);state.stats.spent+=n;return "Egy téves levonás miatt "+fmt(n)+"-nal kevesebb pénzed maradt."}],
  ["Találtál egy jobb banki megtakarítást","Pénz",()=>{let n=rand(5000,30000);state.bank+=n;return "Átutaltál "+fmt(n)+"-ot a megtakarításodba, és jobb kamatot kapsz."}]
 ]},
 {name:"Munka",items:[
  ["Új feladatot bíztak rád","Karrier",()=>{state.discipline=clamp(state.discipline+rand(2,6));return "A plusz felelősséget jól kezelted; a fegyelem értéked nőtt."}],
  ["Béremelést kaptál","Karrier",()=>{if(state.job[0]==="Munkanélküli")return "Még nincs munkahelyed, ezért most csak tapasztalatot szereztél.";state.job=[state.job[0],Math.round(state.job[1]*1.07),state.job[2]];return "A fizetésed 7%-kal emelkedett a teljesítményed miatt."}],
  ["Egy kolléga ajánlott egy lehetőséget","Karrier",()=>{state.smarts=clamp(state.smarts+rand(1,4));return "Egy új szakmai kapcsolatot szereztél, és sokat tanultál tőle."}],
  ["Nehéz hónapok jöttek a munkahelyeden","Karrier",()=>{state.happiness=clamp(state.happiness-rand(4,10));return "A munkahelyi bizonytalanság megterhelt."}],
  ["Egy ügyfél külön megköszönte a munkádat","Karrier",()=>{state.happiness=clamp(state.happiness+rand(3,8));state.karma=clamp(state.karma+rand(1,4));return "Jó érzés volt látni, hogy másnak is számít, amit csinálsz."}]
 ]},
 {name:"Egészség",items:[
  ["Egy rövid betegség ledöntött","Egészség",()=>{state.health=clamp(state.health-rand(4,13));return "Néhány nap pihenésre volt szükséged, de felépültél."}],
  ["Elkezdtél rendszeresen sétálni","Egészség",()=>{state.health=clamp(state.health+rand(3,8));state.happiness=clamp(state.happiness+rand(1,5));return "A rendszeres mozgás érezhetően javított a közérzeteden."}],
  ["Egy rutinellenőrzésen jó hírt kaptál","Egészség",()=>{state.health=clamp(state.health+rand(2,6));return "Nem találtak komoly problémát, megnyugodtál."}],
  ["Túl sokáig halogattad a pihenést","Egészség",()=>{state.health=clamp(state.health-rand(3,9));state.happiness=clamp(state.happiness-rand(2,7));return "A kimerültség végül utolért."}],
  ["Egy régi panaszod javult","Egészség",()=>{state.health=clamp(state.health+rand(4,10));return "A kezelés és a pihenés meghozta az eredményét."}]
 ]},
 {name:"Kapcsolatok",items:[
  ["Egy régi barát újra felbukkant","Kapcsolat",()=>{state.happiness=clamp(state.happiness+rand(4,10));return "Újra felvetted a kapcsolatot valakivel a múltadból."}],
  ["Egy fontos embernek szüksége volt rád","Kapcsolat",()=>{state.karma=clamp(state.karma+rand(2,7));state.happiness=clamp(state.happiness+rand(2,6));return "Segítettél neki, és közelebb kerültetek egymáshoz."}],
  ["Félreértés alakult ki köztetek","Kapcsolat",()=>{if(state.relationships.length){state.relationships[0].closeness=clamp(state.relationships[0].closeness-rand(5,16));}state.happiness=clamp(state.happiness-rand(2,7));return "Egy félreértés miatt feszült lett egy közeli kapcsolatod."}],
  ["Egy közös program sokat jelentett","Kapcsolat",()=>{if(state.relationships.length)state.relationships[0].closeness=clamp(state.relationships[0].closeness+rand(6,14));state.happiness=clamp(state.happiness+rand(4,9));return "Egy közös élmény közelebb hozott valakihez."}],
  ["Új ismeretséget kötöttél","Kapcsolat",()=>{state.stats.relationships++;state.happiness=clamp(state.happiness+rand(2,6));return "Egy teljesen új emberrel ismerkedtél meg."}]
 ]},
 {name:"Tanulás",items:[
  ["Egy vizsgád jobban sikerült a vártnál","Oktatás",()=>{state.smarts=clamp(state.smarts+rand(4,10));return "A befektetett munka meghozta az eredményét."}],
  ["Egy mentor segített","Oktatás",()=>{state.smarts=clamp(state.smarts+rand(3,8));state.discipline=clamp(state.discipline+rand(1,5));return "Hasznos tanácsokat kaptál, amelyeket később is kamatoztatsz."}],
  ["Rájöttél, hogy más módszerrel tanulsz jobban","Oktatás",()=>{state.smarts=clamp(state.smarts+rand(2,6));return "Megtaláltad a számodra hatékonyabb tanulási módszert."}],
  ["Egy rossz eredmény elvette a kedved","Oktatás",()=>{state.happiness=clamp(state.happiness-rand(3,8));return "Egy kudarc most visszavetett, de tanultál belőle."}],
  ["Új hobbit kezdtél tanulni","Oktatás",()=>{state.smarts=clamp(state.smarts+rand(1,5));state.happiness=clamp(state.happiness+rand(2,7));return "Az új hobbi egyszerre adott sikerélményt és új tudást."}]
 ]},
 {name:"Otthon",items:[
  ["Kisebb felújítást csináltál","Otthon",()=>{let n=rand(30000,250000);if(state.assets.length){state.money=Math.max(0,state.money-n);state.stats.spent+=n;state.happiness=clamp(state.happiness+rand(4,9));return "A felújítás "+fmt(n)+"-ba került, de sokkal jobban érzed magad otthon."}return "Még nincs saját ingatlanod, ezért most csak tervezted a felújítást."}],
  ["Jó szomszédra találtál","Otthon",()=>{state.happiness=clamp(state.happiness+rand(2,6));return "A környék barátságosabbnak tűnik, mint korábban."}],
  ["Megdrágultak a lakhatási költségeid","Otthon",()=>{let n=rand(25000,120000);state.money=Math.max(0,state.money-n);state.stats.spent+=n;return "A megnövekedett rezsi és karbantartás "+fmt(n)+" plusz kiadást jelentett."}],
  ["Egy családi emlék került elő","Otthon",()=>{state.happiness=clamp(state.happiness+rand(3,8));return "Egy régi tárgy emlékeztetett arra, honnan indultál."}],
  ["Elvesztettél egy kisebb értéktárgyat","Otthon",()=>{let n=rand(5000,70000);state.money=Math.max(0,state.money-n);state.stats.spent+=n;return "A pótlása körülbelül "+fmt(n)+"-ba került."}]
 ]},
 {name:"Szerencse",items:[
  ["Kaparós sorsjegyet vettél","Szerencse",()=>mlScratch()],
  ["Egy régi ismerős tartozását visszafizette","Szerencse",()=>{let n=rand(10000,90000);state.money+=n;state.stats.earned+=n;return "Váratlanul visszakaptál "+fmt(n)+"-ot egy régi kölcsönből."}],
  ["Egy kis versenyen nyertél","Szerencse",()=>{let n=rand(10000,150000);state.money+=n;state.stats.earned+=n;return "Egy versenyen "+fmt(n)+" pénzdíjat nyertél."}],
  ["Találtál egy jó vételt","Szerencse",()=>{let n=rand(15000,90000);state.money+=n;state.stats.earned+=n;return "Egy továbbértékesített tárgyon "+fmt(n)+" hasznod lett."}],
  ["Késedelmi díjat sikerült elengedtetned","Szerencse",()=>{let n=rand(10000,80000);state.debt=Math.max(0,state.debt-n);return "Egy szolgáltató méltányosságból "+fmt(n)+" tartozást elengedett."}]
 ]},
 {name:"Közösség",items:[
  ["Egy posztod szokatlanul jól teljesített","Közösség",()=>{let n=rand(2000,35000);state.social.followers+=n;state.social.posts++;return "A tartalmad felkapott lett: +"+n.toLocaleString("hu-HU")+" követő."}],
  ["Meghívtak egy közösségi eseményre","Közösség",()=>{state.happiness=clamp(state.happiness+rand(4,10));return "Új embereket ismertél meg, és jól érezted magad."}],
  ["Egy kommentvita feleslegesen elfajult","Közösség",()=>{state.happiness=clamp(state.happiness-rand(2,7));return "Egy online vita több energiát vitt el, mint amennyit ért."}],
  ["Segítettél egy helyi kezdeményezésben","Közösség",()=>{state.karma=clamp(state.karma+rand(3,9));return "Időt szántál egy közösségi ügyre."}],
  ["Egy ajánlás miatt új lehetőséghez jutottál","Közösség",()=>{state.smarts=clamp(state.smarts+rand(1,4));return "Valaki ajánlott egy lehetőséget, amit érdemes lesz később kihasználnod."}]
 ]},
 {name:"Közlekedés",items:[
  ["Lekésted a járatodat","Utazás",()=>{state.happiness=clamp(state.happiness-rand(2,6));return "Új jegyet kellett venned, és elvesztettél néhány órát."}],
  ["Találtál egy olcsóbb utazási lehetőséget","Utazás",()=>{let n=rand(10000,60000);state.money+=n;state.stats.earned+=n;return "Az út szervezésén "+fmt(n)+"-ot spóroltál."}],
  ["Kisebb közlekedési kár keletkezett","Utazás",()=>{let n=rand(30000,220000);state.money=Math.max(0,state.money-n);state.stats.spent+=n;return "A javítás "+fmt(n)+"-ba került."}],
  ["Egy spontán kiruccanás jól sikerült","Utazás",()=>{state.happiness=clamp(state.happiness+rand(5,12));return "Egy rövid kiruccanásból emlékezetes élmény lett."}],
  ["Egy idegen városban hasznos kapcsolatot szereztél","Utazás",()=>{state.smarts=clamp(state.smarts+rand(1,5));return "Az utazás alatt valakitől olyan tanácsot kaptál, amit később felhasználhatsz."}]
 ]},
 {name:"Élethelyzet",items:[
  ["Új felelősséget vállaltál","Mérföldkő",()=>{state.discipline=clamp(state.discipline+rand(3,8));return "A nagyobb felelősség eleinte nehéz volt, de sokat fejlődtél."}],
  ["Egy régi célodat végre kipipáltad","Mérföldkő",()=>{state.happiness=clamp(state.happiness+rand(7,14));return "Jó érzés volt látni, hogy egy régi terved végre valóra vált."}],
  ["Új rutint alakítottál ki","Mérföldkő",()=>{state.discipline=clamp(state.discipline+rand(3,7));state.health=clamp(state.health+rand(1,4));return "A következetesebb rutin lassan éreztette a hatását."}],
  ["Egy döntésed miatt tanultál valami fontosat","Mérföldkő",()=>{state.smarts=clamp(state.smarts+rand(2,6));return "Nem minden úgy alakult, ahogy tervezted, de értékes tapasztalatot szereztél."}],
  ["Egy váratlan változás átírta a terveidet","Mérföldkő",()=>{state.happiness=clamp(state.happiness-rand(1,7));state.discipline=clamp(state.discipline+rand(1,5));return "Alkalmazkodnod kellett, és végül jobban bírtad, mint gondoltad."}]
 ]}
];

function mlScratch(){
 const r=Math.random()*100;
 let prize=0;
 if(r<87)prize=0; else if(r<94)prize=3000; else if(r<97)prize=5000; else if(r<98.5)prize=10000; else if(r<98.9)prize=50000; else if(r<99.99)prize=1000000; else prize=100000000;
 const ticket=3000;state.money=Math.max(0,state.money-ticket);state.stats.spent+=ticket;
 if(prize){state.money+=prize;state.stats.earned+=prize;return "A "+fmt(ticket)+"-os kaparós sorsjegyen "+fmt(prize)+"-ot nyertél ("+(prize===100000000?"0,01%":prize===1000000?"1,09%":"különleges nyerőosztály") + ").";}
 return "A "+fmt(ticket)+"-os kaparós sorsjegy nem nyert. A nagy nyeremények esélye nagyon alacsony volt.";
}

function mlAnnualEvent(){
 const eligible=ML_EVENT_POOLS.filter(p=>{
   if(p.name==="Munka"&&state.age<18)return false;
   if(p.name==="Tanulás"&&(state.age<6||state.age>70))return false;
   if(p.name==="Közlekedés"&&state.age<5)return false;
   return true;
 });
 const pool=pick(eligible),item=pick(pool.items),detail=item[2]();
 log(item[0]+". "+detail,pool.name);
 state.stats.annualEvent=(state.stats.annualEvent||0)+1;
}

const ML_CHOICES=[
 {title:"Munkahelyi ajánlat",text:"Egy másik cég jobb fizetést ígér, de próbaidővel. Mit teszel?",choices:[
  ["Elfogadom a váltást",()=>{state.money+=120000;state.stats.earned+=120000;state.job=[state.job[0]==="Munkanélküli"?"Irodai asszisztens":state.job[0],Math.round(state.job[1]*1.15),state.job[2]];return ["Azonnali fizetésemelést kapsz.","A következő évben 35% eséllyel csalódást okoz a munkahely."]}],
  ["Maradok",()=>{state.happiness=clamp(state.happiness+5);return ["Biztonságban maradtál.","A jelenlegi munkahelyeden 10% eséllyel kapsz később emelést."]}]
 ]},
 {title:"Családi pénzügy",text:"Egy közeli családtag átmenetileg segítséget kér tőled.",choices:[
  ["Segítek",()=>{let n=Math.min(state.money,120000);state.money-=n;state.stats.spent+=n;state.karma=clamp(state.karma+7);return [""+fmt(n)+"-ot adtál.","Később 40% eséllyel viszonozza a segítséget."]}],
  ["Most nem tudok segíteni",()=>{state.happiness=clamp(state.happiness-2);return ["Most a saját pénzügyeidet védted.","A kapcsolatotok egy ideig kissé hűvösebb lesz."]}]
 ]},
 {title:"Egészség vagy spórolás",text:"Egy vizsgálatot javasolnak, de a magánellátás drága.",choices:[
  ["Elmegyek",()=>{let n=rand(45000,120000);state.money=Math.max(0,state.money-n);state.stats.spent+=n;state.health=clamp(state.health+8);return ["A vizsgálat "+fmt(n)+"-ba került, de megnyugtató eredményt kaptál.","A következő 2 évben kisebb eséllyel romlik az egészséged."]}],
  ["Várok",()=>{state.money+=0;return ["Most megtakarítottad a pénzt.","A következő évben 18% eséllyel kellemetlenebb tünet jelentkezik."]}]
 ]},
 {title:"Könnyű pénz",text:"Egy ismerős gyors, de kockázatos pénzkeresetet ajánl.",choices:[
  ["Belevágok",()=>{if(Math.random()<.62){let n=rand(80000,500000);state.money+=n;state.stats.earned+=n;return ["+"+fmt(n)+" gyors bevétel.","A módszer később 25% eséllyel veszteséget okoz."]}let n=rand(50000,220000);state.money=Math.max(0,state.money-n);state.stats.spent+=n;return ["+"+fmt(0)+" bevétel, viszont "+fmt(n)+"-ot veszítettél.","A tanulság megmarad."]}],
  ["Nem vállalom",()=>{state.discipline=clamp(state.discipline+3);return ["A biztosabb utat választottad.","A döntésed növelte a pénzügyi fegyelmedet."]}]
 ]},
 {title:"Kapcsolati fordulópont",text:"A párod komolyabb közös jövőt szeretne, de neked vannak kétségeid.",choices:[
  ["Beszélünk róla",()=>{if(state.relationships.length)state.relationships[0].closeness=clamp(state.relationships[0].closeness+8);return ["Őszintén átbeszéltétek a terveket.","Ha a kapcsolat 80% fölé kerül, később eljegyzésre is lehetőség nyílhat."]}],
  ["Elodázom",()=>{if(state.relationships.length)state.relationships[0].closeness=clamp(state.relationships[0].closeness-8);return ["Most nem akartál dönteni.","A halogatás később feszültséget okozhat."]}]
 ]},
 {title:"Tanulás vagy munka",text:"Felajánlanak egy képzést, de mellette kevesebb időd marad dolgozni.",choices:[
  ["Tanulok",()=>{state.smarts=clamp(state.smarts+7);state.discipline=clamp(state.discipline+4);return ["A képzést választottad.","2 évig nagyobb eséllyel kapsz jobb állást."]}],
  ["Dolgozom tovább",()=>{let n=rand(70000,180000);state.money+=n;state.stats.earned+=n;return ["Idén "+fmt(n)+" extra bevételt szereztél.","A képzés lehetősége később már nem biztos, hogy elérhető."]}]
 ]},
 {title:"Lakhatási döntés",text:"Olcsóbb lakást találsz messzebb a munkahelyedtől.",choices:[
  ["Költözöm",()=>{let n=rand(80000,220000);state.money=Math.max(0,state.money-n);state.stats.spent+=n;return ["A költözés "+fmt(n)+"-ba került.","A következő évektől kisebbek lesznek a havi kiadásaid."]}],
  ["Maradok",()=>{state.happiness=clamp(state.happiness+3);return ["Nem vállaltad a költözés stresszét.","A magasabb lakhatási költség viszont megmarad."]}]
 ]},
 {title:"Véletlen lehetőség",text:"Egy barátod közös kisvállalkozást indítana veled.",choices:[
  ["Beszállok",()=>{let n=Math.min(state.money,300000);state.money-=n;state.stats.spent+=n;state.business=state.business||{name:"Közös vállalkozás",value:Math.max(300000,n*2),profit:0};return ["Befektettél "+fmt(n)+"-ot.","A következő 3 évben a vállalkozás értéke változhat."]}],
  ["Kihagyom",()=>{state.discipline=clamp(state.discipline+2);return ["Most nem vállaltál plusz kockázatot.","A kapcsolat megmarad, de a lehetőség elúszhat."]}]
 ]}
];

function mlApplyDelayed(){
 if(!Array.isArray(state.pendingConsequences))state.pendingConsequences=[];
 const due=state.pendingConsequences.filter(x=>x.dueYear<=state.year);
 state.pendingConsequences=state.pendingConsequences.filter(x=>x.dueYear>state.year);
 due.forEach(x=>{if(Math.random()<x.chance){if(x.kind==="money"){state.money=Math.max(0,state.money+x.amount);if(x.amount>0)state.stats.earned+=x.amount;else state.stats.spent+=Math.abs(x.amount);log(x.text+(x.amount>=0?" +"+fmt(x.amount):" "+fmt(Math.abs(x.amount))+" veszteség"),"Következmény")}else if(x.kind==="health")state.health=clamp(state.health+x.amount);else if(x.kind==="closeness"&&state.relationships.length)state.relationships[0].closeness=clamp(state.relationships[0].closeness+x.amount);log(x.text,"Következmény")}});}

function choiceEvent(){
 if(!state||state.age<8||Math.random()>.24)return;
 const c=pick(ML_CHOICES);
 $("modalBody").innerHTML='<div class="eyebrow">DÖNTÉSI HELYZET</div><h2>'+c.title+'</h2><p class="muted">'+c.text+'</p>'+c.choices.map((x,i)=>'<button class="choice" onclick="mlResolveChoice('+i+')">'+x[0]+'</button>').join("");
 window.__mlChoice=c;
 $("modal").classList.remove("hidden");
}
function mlResolveChoice(i){
 const c=window.__mlChoice;if(!c)return;
 const result=c.choices[i][1]();
 const now=result[0],future=result[1];
 if(future){
   state.pendingConsequences=state.pendingConsequences||[];
   state.pendingConsequences.push({dueYear:state.year+rand(1,3),chance:.4,kind:"money",amount:rand(15000,90000),text:future});
 }
 log(now,"Döntés");
 window.__mlChoice=null;$("modal").classList.add("hidden");normalize();save();render();
}

function renderStats(){
 const data=[["❤️","Egészség",state.health],["😊","Boldogság",state.happiness],["🧠","Intelligencia",state.smarts],["✨","Kinézet",state.looks],["🎯","Fegyelem",state.discipline]];
 $("statBars").innerHTML=data.map(x=>'<div class="hud-stat"><div class="hud-stat-top"><span>'+x[0]+' '+x[1]+'</span><b>'+Math.round(x[2])+'</b></div><div class="hud-bar"><i style="width:'+x[2]+'%"></i></div></div>').join("");
}
function renderLife(){
 const jail=state.jail>0?panel("⚖️ Jogi helyzet",'<div class="action"><b>Börtönben vagy</b><small>Még '+state.jail+' év van hátra.</small></div>'):"";
 const traits=panel("Személyiséged",'<div class="row">'+state.traits.map(t=>'<span class="pill">'+t+"</span>").join("")+"</div>");
 const groups={};
 [...state.events].sort((a,b)=>(Number(a.age)||0)-(Number(b.age)||0)||(Number(a.year)||0)-(Number(b.year)||0)).forEach(e=>{const key=(Number(e.age)||0)+"|"+(Number(e.year)||0);(groups[key]??=[]).push(e)});
 const years=Object.entries(groups).map(([key,items])=>{const parts=key.split("|"),age=parts[0],year=parts[1];return '<section class="life-thread"><div class="thread-node"><span>'+age+'</span><small>'+year+'</small></div><div class="thread-content"><div class="thread-title">'+age+' éves <span>'+year+'</span></div><div class="thread-events">'+items.map(e=>'<article class="thread-event"><span class="tag">'+(e.type||"Élet")+"</span><div>"+String(e.text||"")+"</div></article>").join("")+"</div></div></section>"}).join("");
 const f='<div class="grid"><div class="action"><b>👨‍👩‍👧 Szülők</b><small>'+state.family.parents.map(p=>p.name).join(" • ")+"</small></div><div class=\"action\"><b>👶 Gyerekek</b><small>"+state.children.length+" gyermek</small></div><div class=\"action\"><b>👥 Testvérek</b><small>"+state.family.siblings+" testvér</small></div><div class=\"action\"><b>💼 Munka</b><small>"+state.job[0]+"</small></div></div>";
 $("tab-life").innerHTML=jail+traits+panel("Életút",f)+panel("Életnapló",years||'<div class="muted">Még nincs történés. Nyomd meg a Következő év gombot!</div>');
}


/* MegaLife v0.0.23 — final mobile navigation */
function closeTabs(){
  ["life","relations","career","finance","assets","activities","achievements","stats","social"].forEach(x=>{const e=$("tab-"+x);if(e)e.classList.add("hidden")});
}
function showTab(tab){
  const ids=["life","relations","career","finance","assets","activities","achievements","stats","social"];
  if(tab==="life"){closeTabs();render();return}
  const el=$("tab-"+tab);if(!el)return;
  ids.forEach(x=>{const e=$("tab-"+x);if(e)e.classList.add("hidden")});
  if(tab==="relations")renderRelations();
  if(tab==="career")renderCareer();
  if(tab==="finance")renderFinance();
  if(tab==="assets")renderAssets();
  if(tab==="activities")renderActivities();
  if(tab==="achievements")renderAchievements();
  if(tab==="stats")renderStatsTab();
  if(tab==="social")renderSocial();
  if(tab==="life")renderLife();
  el.classList.remove("hidden");
}
function profileSlotButton(n){
  const x=getSlotData(n),active=n===currentSlot;
  return '<button class="profile-slot '+(active?'active ':'')+(!x?'empty':'')+'" onclick="profileSelectSlot('+n+')"><b>Élet '+n+'</b><small>'+(x?(x.first+" "+x.last+" • "+x.age+" év"):"Üres")+'</small></button>';
}
function renderProfileHub(){
  const x=state;
  const current=x?(x.first+" "+x.last):"Nincs aktív élet";
  const meta=x?(x.age+" éves • "+(x.job&&x.job[0]||"—")):"Válassz vagy indíts életet";
  $("modalBody").innerHTML='<div class="profile-hub"><div class="profile-hub-head"><div class="profile-hub-avatar">'+(x&&x.first?x.first[0].toUpperCase():"👤")+'</div><div><b>'+current+'</b><small>'+meta+'</small></div></div><div class="profile-section"><div class="profile-section-title">Életek</div><div class="profile-slots">'+Array.from({length:SLOT_COUNT},(_,i)=>profileSlotButton(i+1)).join("")+'</div></div><div class="profile-row"><button class="primary action" onclick="profileNewLife()"><b>✨ Új élet</b><small>Új történet indítása</small></button><button class="action" onclick="profileSettings()"><b>⚙️ Beállítások</b><small>Játék és alkalmazás</small></button></div><div class="profile-row"><button class="action" onclick="save();toast(\'Élet elmentve.\');renderProfileHub()"><b>💾 Mentés</b><small>Aktuális élet mentése</small></button><button class="action" onclick="refreshPage()"><b>↻ Frissítés</b><small>Alkalmazás újratöltése</small></button></div><button class="ghost big profile-close" onclick="closeModal()">Kész</button></div>';
}
function openProfile(){renderProfileHub();$("modal").classList.remove("hidden")}
function profileSelectSlot(n){
  currentSlot=n;localStorage.setItem("megalife-active-slot",String(n));
  const x=getSlotData(n);
  if(x){state=x;normalize();closeModal();render();toast("Élet "+n+" betöltve.")}
  else{state=null;closeModal();render();toast("Élet "+n+" kiválasztva. Indítsd el az új életet.")}
}
function profileNewLife(){
  if(!confirm("Biztosan új életet kezdesz?"))return;
  closeModal();newLife();
}
function profileSettings(){
  const s=mlEventSettings();
  $("modalBody").innerHTML='<div class="profile-hub"><h2>⚙️ Beállítások</h2>'+
    '<div class="profile-section"><div class="profile-section-title">Éves események</div>'+
    '<label class="settings-field"><b>🎲 Random események / év</b><small>Alapértelmezett: 2. Az események többsége negatív vagy semleges.</small><select id="randomEventCount"><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option></select></label>'+
    '<label class="settings-field"><b>⚖️ Választós esemény / év</b><small>Alapértelmezett: 1. A döntési helyzetek külön jelennek meg.</small><select id="choiceEventCount"><option value="0">0</option><option value="1">1</option></select></label>'+
    '<button class="primary action" onclick="saveEventSettingsFromUI()"><b>💾 Beállítások mentése</b><small>Azonnal érvénybe lépnek a következő évben.</small></button></div>'+
    '<div class="profile-section"><div class="profile-section-title">Mentés</div><button class="action" onclick="save();toast(\'Élet elmentve.\')"><b>💾 Automatikus mentés</b><small>Az élet előrehaladáskor is mentésre kerül.</small></button></div>'+
    '<button class="ghost big profile-close" onclick="renderProfileHub()">← Vissza a profilhoz</button></div>';
  setTimeout(()=>{const r=$("randomEventCount"),c=$("choiceEventCount");if(r)r.value=String(s.randomEvents);if(c)c.value=String(Math.min(1,s.choiceEvents))},0);
}
function saveEventSettingsFromUI(){
  const r=$("randomEventCount"),c=$("choiceEventCount");
  const s=mlSaveEventSettings(r?r.value:2,c?c.value:1);
  toast("Eseménybeállítások mentve: "+s.randomEvents+" random + "+s.choiceEvents+" választós / év.");
  profileSettings();
}

/* MegaLife v0.0.24 — tab back button and refresh feedback */
function showRefreshOverlay(){const e=$("refreshOverlay");if(e)e.classList.remove("hidden")}
function refreshPage(){showRefreshOverlay();setTimeout(()=>location.reload(),420)}
function showTab(tab){const ids=["life","relations","career","finance","assets","activities","achievements","stats","social"];if(tab==="life"){closeTabs();render();return}const el=$("tab-"+tab);if(!el)return;ids.forEach(x=>{const e=$("tab-"+x);if(e)e.classList.add("hidden")});if(tab==="relations")renderRelations();if(tab==="career")renderCareer();if(tab==="finance")renderFinance();if(tab==="assets")renderAssets();if(tab==="activities")renderActivities();if(tab==="achievements")renderAchievements();if(tab==="stats")renderStatsTab();if(tab==="social")renderSocial();el.classList.remove("hidden");let back=el.querySelector(".tab-back");if(!back){back=document.createElement("button");back.className="tab-back";back.type="button";back.setAttribute("aria-label","Vissza");back.textContent="‹";back.onclick=closeTabs;el.prepend(back)}}

/* MegaLife v0.0.25 — restore main life journal rendering */
function renderMainLifeLog(){
 const box=$("lifeLog");if(!box)return;
 const events=[...state.events].sort((a,b)=>(Number(a.age)||0)-(Number(b.age)||0)||(Number(a.year)||0)-(Number(b.year)||0));
 if(!events.length){box.innerHTML='<div class="muted">Még nincs történés. Nyomd meg a Következő év gombot!</div>';return}
 const groups={};events.slice(-24).forEach(e=>{const key=(Number(e.age)||0)+"|"+(Number(e.year)||0);(groups[key]??=[]).push(e)});
 box.innerHTML=Object.entries(groups).map(([key,items])=>{const [age,year]=key.split("|");return '<section class="life-thread"><div class="thread-node"><span>'+age+'</span><small>'+year+'</small></div><div class="thread-content"><div class="thread-title">'+age+' éves <span>'+year+'</span></div><div class="thread-events">'+items.map(e=>'<article class="thread-event"><span class="tag">'+(e.type||"Élet")+'</span><div>'+String(e.text||"")+'</div></article>').join("")+'</div></div></section>'}).join("");
}
function ensureTabBackButtons(){["life","relations","career","finance","assets","activities","achievements","stats","social"].forEach(tab=>{const el=$("tab-"+tab);if(!el)return;let back=el.querySelector(".tab-back");if(!back){back=document.createElement("button");back.className="tab-back";back.type="button";back.setAttribute("aria-label","Vissza");back.textContent="‹";back.onclick=closeTabs;el.prepend(back)}})}
function render(){if(!state){$("startScreen").classList.remove("hidden");$("gameScreen").classList.add("hidden");return}$("startScreen").classList.add("hidden");$("gameScreen").classList.remove("hidden");$("pName").textContent=state.first+" "+state.last;$("avatar").textContent=state.first[0].toUpperCase();$("pMeta").textContent=state.age+" éves • "+state.gender+" • "+state.country;$("ageText").textContent=state.age+" éves";$("yearText").textContent=" • "+state.year;$("wealth").textContent=fmt(wealth());renderStats();renderMainLifeLog();renderLife();renderRelations();renderCareer();renderFinance();renderAssets();renderActivities();renderAchievements();renderStatsTab();renderSocial();ensureTabBackButtons()}

/* MegaLife v0.0.27 — pull-to-refresh indicator + newest journal position */
function scrollLifeLogToLatest(){const box=$("lifeLog");if(box)setTimeout(()=>{box.scrollTop=box.scrollHeight},0)}
const _renderMainLifeLog=renderMainLifeLog;
renderMainLifeLog=function(){_renderMainLifeLog();scrollLifeLogToLatest()}
function showRefreshOverlay(){const e=$("refreshOverlay");if(e)e.classList.remove("hidden");const p=$("pullRefreshIndicator");if(p){p.classList.add("visible","refreshing");p.querySelector(".pull-icon").textContent="↻";p.querySelector(".pull-label").textContent="Frissítés…"}}
function refreshPage(){showRefreshOverlay();setTimeout(()=>location.reload(),420)}


/* MegaLife v0.0.29 — age-aware life simulation + childhood economy */
const ML_ACTION_RULES={
  exercise:{min:6,msg:"6 éves kortól önállóan edzhetsz."},
  meditate:{min:8,msg:"8 éves kortól tanulhatsz meditálni."},
  party:{min:16,msg:"Bulizni 16 éves kortól lehet."},
  social:{min:10,msg:"Közösségi médiát 10 éves kortól használhatsz."},
  travel:{min:10,msg:"Önálló utazás 10 éves kortól lehetséges."},
  pet:{min:10,msg:"Háziállatot 10 éves kortól vállalhatsz."},
  crime:{min:16,msg:"Ehhez még túl fiatal vagy."},
  date:{min:14,msg:"Randizni 14 éves kortól lehet."},
  proposal:{min:18,msg:"Eljegyzéshez nagykorúnak kell lenned."},
  marriage:{min:18,msg:"Házasság 18 éves kortól lehetséges."},
  child:{min:18,msg:"Gyermekvállalás 18 éves kortól lehetséges."},
  job:{min:16,msg:"Munkát 16 éves kortól vállalhatsz."},
  university:{min:18,max:35,msg:"Az egyetemhez 18–35 év közötti életkor szükséges."},
  bank:{min:18,msg:"Saját bankszámlát 18 éves kortól kezelhetsz."},
  loan:{min:18,msg:"Hitelt 18 éves kortól vehetsz fel."},
  invest:{min:18,msg:"Befektetni 18 éves kortól lehet."},
  gamble:{min:18,msg:"Szerencsejáték csak 18 éves kortól érhető el."},
  house:{min:18,msg:"Saját ingatlant 18 éves kortól vásárolhatsz."},
  car:{min:18,msg:"Saját autót 18 éves kortól vásárolhatsz."},
  luxury:{min:18,msg:"Luxuscikket 18 éves kortól vásárolhatsz."},
  business:{min:18,msg:"Vállalkozást 18 éves kortól indíthatsz."},
  hobby:{min:6,msg:"Hobbit 6 éves kortól kezdhetsz."}
};
function mlCanAction(key,quiet=true){
  const r=ML_ACTION_RULES[key]; if(!r||!state)return true;
  if(state.age<r.min||r.max!==undefined&&state.age>r.max){if(quiet)toast(r.msg);return false}
  return true
}
const _mlFresh29=fresh;
fresh=function(){const x=_mlFresh29();x.money=0;x.bank=0;x.debt=0;x.flags=x.flags||{};x.flags.pocketMoneyYear=-1;x.flags.childhoodSupported=true;return x};

function mlPocketAmount(){
  if(state.age<=8)return rand(500,2500);
  if(state.age<=12)return rand(1000,5000);
  if(state.age<=15)return rand(2500,9000);
  return rand(5000,18000);
}
function requestPocketMoney(){
  if(!state||state.age<6||state.age>17)return toast("Zsebpénzt 6–17 éves kor között kérhetsz.");
  if(state.flags.pocketMoneyYear===state.year)return toast("Idén már beszéltél a szüleiddel a zsebpénzről.");
  const amount=mlPocketAmount();
  $("modalBody").innerHTML='<div class="eyebrow">GYEREKKOR • PÉNZ</div><h2>💬 Kérsz zsebpénzt?</h2><p class="muted">A szüleidtől kérhetsz egy kis pénzt erre az évre. Az összeg az életkorodtól és a fegyelmedtől is függ.</p><button class="choice" onclick="mlPocketDecision('+amount+',true)">💰 Igen, kérek zsebpénzt</button><button class="choice" onclick="mlPocketDecision(0,false)">🙅 Nem kérek</button>';
  $("modal").classList.remove("hidden");
}
function mlPocketDecision(amount,asked){
  state.flags.pocketMoneyYear=state.year;
  if(asked){
    const generous=Math.random()<(.72+Math.min(.15,state.discipline/1000));
    if(generous){
      const bonus=Math.round(amount*(.8+Math.random()*.45));
      state.money+=bonus;state.stats.earned+=bonus;
      log("Zsebpénzt kaptál a szüleidtől: "+fmt(bonus)+".","Család");
      toast("💰 Kaptál "+fmt(bonus)+" zsebpénzt.");
    }else{
      state.happiness=clamp(state.happiness-2);
      log("Idén nem kaptál zsebpénzt a szüleidtől.","Család");
      toast("Idén nem kaptál zsebpénzt.");
    }
  }else log("Úgy döntöttél, hogy idén nem kérsz zsebpénzt.","Döntés");
  $("modal").classList.add("hidden");save();render();
}
function mlChildSupportYear(){
  if(!state||state.age<6||state.age>17)return;
  if(state.flags.pocketMoneyYear===state.year)return;
  requestPocketMoney();
}

const _mlNextYear29=nextYear;
nextYear=function(){
  if(!state||!state.alive)return;
  const minor=state.age<18;
  const parentBuffer=minor?10000:0;
  if(parentBuffer)state.money+=parentBuffer;
  _mlNextYear29();
  if(minor&&state&&state.alive)state.money=Math.max(0,state.money-parentBuffer);
  if(state&&state.alive){
    normalize();save();render();
    if(state.age>=6&&state.age<=17)setTimeout(mlChildSupportYear,140);
  }
};

const _mlActivity29=activity;
activity=function(t){
  if(!state)return;
  const key=t;
  if(!mlCanAction(key))return;
  if(t==="doctor"&&state.age<18){
    const before=state.money;state.money+=50000;
    _mlActivity29(t);
    if(state&&state.alive)state.money=Math.max(0,state.money-50000);
    render();save();return;
  }
  _mlActivity29(t);
};
const _mlTravel29=travel;
travel=function(){if(mlCanAction("travel"))_mlTravel29()};
const _mlPet29=pet;
pet=function(){if(mlCanAction("pet"))_mlPet29()};
const _mlCrime29=crime;
crime=function(){if(mlCanAction("crime"))_mlCrime29()};
const _mlDate29=dateAction;
dateAction=function(){if(mlCanAction("date"))_mlDate29()};
const _mlProposal29=proposal;
proposal=function(){if(mlCanAction("proposal"))_mlProposal29()};
const _mlMarry29=marryAction;
marryAction=function(){if(mlCanAction("marriage"))_mlMarry29()};
const _mlChild29=childAction;
childAction=function(){if(mlCanAction("child"))_mlChild29()};
const _mlStudy29=study;
study=function(){if(state.age<6)return toast("Még túl fiatal vagy az iskolai tanuláshoz.");_mlStudy29()};
const _mlUniversity29=university;
university=function(){if(mlCanAction("university"))_mlUniversity29()};
const _mlGetJob29=getJob;
getJob=function(i){if(mlCanAction("job"))_mlGetJob29(i)};
const _mlBank29=bank;
bank=function(amount){if(!mlCanAction("bank"))return;_mlBank29(amount)};
const _mlLoan29=loan;
loan=function(){if(!mlCanAction("loan"))return;_mlLoan29()};
const _mlInvest29=invest;
invest=function(){if(!mlCanAction("invest"))return;_mlInvest29()};
const _mlGamble29=gamble;
gamble=function(){if(!mlCanAction("gamble"))return;_mlGamble29()};
const _mlBuyHouse29=buyHouse;
buyHouse=function(){if(mlCanAction("house"))_mlBuyHouse29()};
const _mlBuyCar29=buyCar;
buyCar=function(){if(mlCanAction("car"))_mlBuyCar29()};
const _mlBuyLuxury29=buyLuxury;
buyLuxury=function(){if(mlCanAction("luxury"))_mlBuyLuxury29()};
const _mlStartBusiness29=startBusiness;
startBusiness=function(){if(mlCanAction("business"))_mlStartBusiness29()};

function renderActivities(){
  const a=[];
  if(state.age>=6)a.push('<button class="action" onclick="activity(\'exercise\')"><b>🏋️ Edzés</b><small>Egészség +, boldogság +</small></button>');
  if(state.age>=8)a.push('<button class="action" onclick="activity(\'meditate\')"><b>🧘 Meditáció</b><small>Boldogság és fegyelem +</small></button>');
  if(state.age>=16)a.push('<button class="action" onclick="activity(\'party\')"><b>🎉 Buli</b><small>Boldogság +, pénz −</small></button>');
  a.push('<button class="action" onclick="activity(\'doctor\')"><b>🏥 Orvos</b><small>'+(state.age<18?"A szüleid fizetik.":"Egészség javítása.")+'</small></button>');
  if(state.age>=10)a.push('<button class="action" onclick="activity(\'social\')"><b>📱 Közösségi média</b><small>Posztolj és építs közönséget.</small></button>');
  if(state.age>=10)a.push('<button class="action" onclick="travel()"><b>✈️ Utazás</b><small>Új helyek és élmények.</small></button>');
  if(state.age>=16)a.push('<button class="action" onclick="crime()"><b>🕶️ Bűncselekmény</b><small>Nagy kockázat, jogi következmények.</small></button>');
  if(state.age>=10)a.push('<button class="action" onclick="pet()"><b>🐕 Háziállat</b><small>Új családtag és rendszeres kiadás.</small></button>');
  if(state.age>=6&&state.age<=17)a.push('<button class="action" onclick="requestPocketMoney()"><b>💰 Zsebpénz</b><small>Kérj a szüleidtől vagy utasítsd el.</small></button>');
  $("tab-activities").innerHTML=panel("Mindennapok",'<div class="grid">'+a.join("")+'</div>')+renderHobbies();
}
function renderFinance(){
  const adult=state.age>=18;
  const summary=panel("Pénzügyek",`<div class="grid"><div class="action"><b>Készpénz</b><small>${fmt(state.money)}</small></div><div class="action"><b>Bank</b><small>${fmt(state.bank)}</small></div><div class="action"><b>Tartozás</b><small>${fmt(state.debt)}</small></div><div class="action"><b>Teljes vagyon</b><small>${fmt(wealth())}</small></div></div>`);
  const tools=adult
    ? panel("Felnőtt pénzügyek",`<div class="grid"><button class="action" onclick="bank(50000)"><b>🏦 Betét</b><small>50 000 Ft bankba</small></button><button class="action" onclick="bank(-50000)"><b>💳 Kivét</b><small>50 000 Ft kivétele</small></button><button class="action" onclick="loan()"><b>💸 Hitel</b><small>Hitel és tartozás</small></button><button class="action" onclick="invest()"><b>📈 Befektetés</b><small>Kockázatos hozam</small></button><button class="action" onclick="gamble()"><b>🎰 Szerencsejáték</b><small>18+</small></button></div>`)
    : panel("Gyermekkori pénz",`<div class="action"><b>👨‍👩‍👧 Szülői támogatás</b><small>6–17 évesen évente kérhetsz zsebpénzt.</small></div>`);
  $("tab-finance").innerHTML=summary+tools;
}
function renderAssets(){
  const a=state.assets.map((x,i)=>'<div class="list-item"><div><b>'+x.icon+" "+x.name+'</b><br><small class="muted">Érték: '+fmt(x.value)+'</small></div><button class="ghost" onclick="sellAsset('+i+')">Eladás</button></div>').join("")||'<p class="muted">Még nincs jelentős vagyontárgyad.</p>';
  const buys=state.age>=18?'<div class="grid"><button class="action" onclick="buyHouse()"><b>🏠 Lakás</b><small>6 000 000 Ft</small></button><button class="action" onclick="buyCar()"><b>🚗 Autó</b><small>3 000 000 Ft</small></button><button class="action" onclick="buyLuxury()"><b>💎 Luxusóra</b><small>1 200 000 Ft</small></button></div>':'<p class="muted">Saját vagyontárgyakat 18 éves kortól vásárolhatsz.</p>';
  $("tab-assets").innerHTML=panel("Vagyontárgyak",a)+panel("Vásárlás",buys);
}


/* MegaLife v0.0.31 — realistic annual event engine + configurable event frequency */
const ML_EVENT_DEFAULTS={randomEvents:2,choiceEvents:1};
function mlEventSettings(){
  try{
    const x=JSON.parse(localStorage.getItem("megalife-event-settings")||"{}");
    return {
      randomEvents:Math.max(0,Math.min(6,Number(x.randomEvents??ML_EVENT_DEFAULTS.randomEvents))),
      choiceEvents:Math.max(0,Math.min(3,Number(x.choiceEvents??ML_EVENT_DEFAULTS.choiceEvents)))
    };
  }catch(e){return {...ML_EVENT_DEFAULTS}}
}
function mlSaveEventSettings(randomEvents,choiceEvents){
  const x={
    randomEvents:Math.max(0,Math.min(6,Number(randomEvents)||0)),
    choiceEvents:Math.max(0,Math.min(3,Number(choiceEvents)||0))
  };
  localStorage.setItem("megalife-event-settings",JSON.stringify(x));
  return x;
}
function mlWeightedPick(list){
  const total=list.reduce((n,x)=>n+x.weight,0);
  let r=Math.random()*total;
  for(const x of list){r-=x.weight;if(r<=0)return x}
  return list[list.length-1];
}
function mlEventPool(){
  const a=state.age,adult=a>=18;
  const E=[];
  const add=(weight,min,max,kind,title,run)=>{if(a<min||(max!==undefined&&a>max))return;E.push({weight,kind,title,run})};

  // Negative events deliberately dominate the pool. Positive events are rarer,
  // and childhood cash gifts are especially rare.
  add(16,0,120,"negative","🤒 Megbetegedtél",()=>{const n=rand(3,10);state.health=clamp(state.health-n);state.happiness=clamp(state.happiness-rand(1,5));return "Beteg lettél, ezért néhány napig rosszabbul érezted magad."});
  add(11,3,17,"negative","📚 Iskolai nehézség",()=>{state.discipline=clamp(state.discipline-rand(2,6));state.happiness=clamp(state.happiness-rand(2,6));return "Nehéz időszakod volt az iskolában, és ez megviselt."});
  add(9,6,17,"negative","😔 Baráti konfliktus",()=>{state.happiness=clamp(state.happiness-rand(3,9));if(state.relationships.length)state.relationships[0].closeness=clamp(state.relationships[0].closeness-rand(3,10));return "Összevesztél valakivel, aki fontos neked."});
  add(8,10,17,"negative","📱 Elvesztettél egy fontos tárgyat",()=>{state.happiness=clamp(state.happiness-rand(2,6));return "Elvesztettél egy fontos tárgyat."});
  add(7,14,17,"negative","💔 Csalódás",()=>{state.happiness=clamp(state.happiness-rand(4,10));return "Egy fontos ismerkedés vagy barátság csalódással végződött."});
  add(10,16,120,"negative","😵 Stresszes időszak",()=>{state.health=clamp(state.health-rand(1,5));state.happiness=clamp(state.happiness-rand(3,8));return "Stresszes időszakod volt."});
  add(9,18,120,"negative","💸 Váratlan kiadás",()=>{const n=rand(15000,90000);if(state.money>=n){state.money-=n;state.stats.spent+=n}else{const s=n-state.money;state.stats.spent+=state.money;state.money=0;state.debt+=s}return "Egy váratlan kiadás terhelte a pénzügyeidet: "+fmt(n)+"."});
  add(7,18,120,"negative","🏠 Háztartási probléma",()=>{const n=rand(10000,70000);if(state.money>=n){state.money-=n;state.stats.spent+=n}else{const s=n-state.money;state.money=0;state.debt+=s}return "Elromlott valami otthon, ezért javításra kellett költened."});
  add(6,18,120,"negative","💼 Munkahelyi gond",()=>{if(state.job[0]!=="Munkanélküli"){state.happiness=clamp(state.happiness-rand(3,8));if(Math.random()<.12){state.job=jobs[0];return "Komoly gond alakult ki a munkahelyeden, és elvesztetted az állásod."}return "Nehéz helyzet alakult ki a munkahelyeden."}return "Álláskeresőként egy újabb nehéz időszakot éltél át."});
  add(4,18,120,"negative","🚗 Közlekedési költség",()=>{if(state.assets.some(x=>x.name==="Autó")){const n=rand(20000,120000);state.money=Math.max(0,state.money-n);state.stats.spent+=n;return "Az autód javításra szorult."}return "A közlekedés többe került a vártnál."});

  add(7,0,120,"neutral","👨‍👩‍👧 Családi nap",()=>{state.happiness=clamp(state.happiness+rand(1,5));return "Egy nyugodt napot töltöttél a családoddal."});
  add(6,6,17,"neutral","🎒 Új élmény az iskolában",()=>{state.smarts=clamp(state.smarts+rand(1,3));return "Egy iskolai program vagy projekt új élményt adott."});
  add(5,8,17,"neutral","🎨 Új érdeklődési kör",()=>{state.happiness=clamp(state.happiness+rand(1,4));return "Találtál valamit, ami felkeltette az érdeklődésedet."});
  add(5,14,120,"neutral","👥 Új ismeretség",()=>{if(state.relationships.length<12){const r={name:pick(names.female.concat(names.male).concat(names.neutral))+" "+pick(surnames),age:Math.max(14,state.age+rand(-2,3)),type:"Ismerős",closeness:rand(30,55)};state.relationships.push(r);state.stats.relationships++;return "Megismerkedtél "+r.name+"-nel."}return "Új emberekkel találkoztál, de egyik kapcsolat sem lett komoly."});
  add(4,0,17,"positive","🎁 Családi ajándék",()=>{if(Math.random()>0.035)return "A családod kedveskedett neked valamivel, de pénzt nem kaptál.";const n=rand(1000,8000);state.money+=n;state.stats.earned+=n;return "Nagyon ritka alkalomként a családod "+fmt(n)+" Ft-tal megajándékozott."});
  add(5,6,17,"positive","🏫 Jó eredmény",()=>{state.smarts=clamp(state.smarts+rand(2,5));state.happiness=clamp(state.happiness+rand(2,6));return "Jól teljesítettél egy fontos feladatban vagy dolgozatban."});
  add(3,18,120,"positive","💰 Extra bevétel",()=>{if(state.job[0]==="Munkanélküli")return "Egy alkalmi lehetőség felmerült, de most nem tudtad kihasználni.";const n=rand(15000,70000);state.money+=n;state.stats.earned+=n;return "Egy kisebb pluszmunkából "+fmt(n)+" bevételed lett."});
  add(3,18,120,"positive","❤️ Támogatás",()=>{if(!state.relationships.length)return "Valaki melletted állt egy nehezebb időszakban.";state.relationships[0].closeness=clamp(state.relationships[0].closeness+rand(3,8));state.happiness=clamp(state.happiness+rand(2,5));return state.relationships[0].name+" támogatott egy nehezebb időszakban."});
  return E;
}
function annualEvent(){
  const settings=mlEventSettings();
  const used=[];
  for(let n=0;n<settings.randomEvents;n++){
    const pool=mlEventPool().filter(x=>!used.includes(x.title));
    if(!pool.length)break;
    const e=mlWeightedPick(pool);used.push(e.title);
    const result=e.run();
    log(result,e.kind==="negative"?"Nehézség":e.kind==="positive"?"Szerencse":"Élet");
  }
  state.stats.annualEvents=settings.randomEvents;
}
function choiceEvent(){
  const settings=mlEventSettings();
  if(!state||state.age<8)return;
  for(let n=0;n<settings.choiceEvents;n++){
    const choices=[];
    if(state.age>=8&&state.age<18)choices.push(
      {title:"Iskolai döntés",text:"Egy fontos feladat és egy szabad délután közül kell választanod.",choices:[
        ["📚 Tanulok",()=>{state.smarts=clamp(state.smarts+rand(2,5));state.discipline=clamp(state.discipline+rand(1,4));return "A tanulást választottad."}],
        ["🎮 Pihenek",()=>{state.happiness=clamp(state.happiness+rand(3,7));return "A pihenést választottad."}]
      ]},
      {title:"Zsebpénzes kérdés",text:"Valami fontosra szeretnél pénzt. Megkéred a szüleidet?",choices:[
        ["💬 Megkérem őket",()=>{const ok=Math.random()<.18;const n=mlPocketAmount();if(ok){const x=Math.round(n*(.7+Math.random()*.5));state.money+=x;state.stats.earned+=x;return "A szüleid most beleegyeztek és "+fmt(x)+" Ft-ot adtak."}state.happiness=clamp(state.happiness-1);return "Most nemet mondtak, mert nem tartották indokoltnak."}],
        ["🙅 Nem kérek",()=>{state.discipline=clamp(state.discipline+1);return "Úgy döntöttél, hogy most nem kérsz pénzt."}]
      ]}
    );
    if(state.age>=18)choices.push(
      {title:"Munkahelyi döntés",text:"Több pénzért nagyobb felelősséget vállalnál.",choices:[
        ["🚀 Vállalom",()=>{state.discipline=clamp(state.discipline+3);if(state.job[0]!=="Munkanélküli")state.job=[state.job[0],Math.round(state.job[1]*1.1),state.job[2]];return "Elvállaltad a nagyobb felelősséget."}],
        ["🧘 Maradok",()=>{state.happiness=clamp(state.happiness+3);return "A stabilitást választottad."}]
      ]},
      {title:"Váratlan kiadás",text:"Egy szükséges kiadást most vagy később is rendezhetsz.",choices:[
        ["💳 Kifizetem",()=>{const n=rand(20000,60000);if(state.money>=n){state.money-=n;state.stats.spent+=n;return "Most rendezted a kiadást."}state.debt+=n-state.money;state.money=0;return "Nem volt elég készpénzed, ezért tartozás keletkezett."}],
        ["⏳ Halasztom",()=>{state.happiness=clamp(state.happiness-1);return "Elhalasztottad a kiadást."}]
      ]}
    );
    if(!choices.length)break;
    const c=pick(choices);
    $("modalBody").innerHTML='<div class="eyebrow">DÖNTÉSI HELYZET</div><h2>'+c.title+'</h2><p class="muted">'+c.text+'</p>'+c.choices.map((x,i)=>'<button class="choice" onclick="mlResolveChoice('+i+')">'+x[0]+'</button>').join("");
    window.__mlChoice=c;
    $("modal").classList.remove("hidden");
    return; // one modal at a time; remaining configured choices can appear next year
  }
}

/* MegaLife v0.0.31 — context-aware event eligibility */
function mlLifeContext(){
  const job=Array.isArray(state.job)?state.job:null;
  const employed=!!(job&&job[0]&&job[0]!=="Munkanélküli");
  const university=!!(state.flags&&state.flags.university) || /egyetem|hallgat/i.test(String(state.education||""));
  const married=!!(state.flags&&state.flags.married) || state.relationships.some(r=>/házastárs|férj|feleség/i.test(String(r.type||"")));
  const partner=state.relationships.some(r=>/pár|partner|barát|barátnő|vőlegény|menyasszony/i.test(String(r.type||"")));
  const children=Array.isArray(state.children)&&state.children.length>0;
  const pet=!!state.pet;
  const car=Array.isArray(state.assets)&&state.assets.some(x=>/autó|kocsi/i.test(String(x.name||"")));
  const house=Array.isArray(state.assets)&&state.assets.some(x=>/lakás|ház|ingatlan|otthon/i.test(String(x.name||"")));
  const business=!!state.business;
  const loan=Number(state.debt)>0;
  const social=!!(state.social&&state.social.platforms&&Object.keys(state.social.platforms).length);
  return {age:Number(state.age)||0,adult:(Number(state.age)||0)>=18,employed,university,married,partner,children,pet,car,house,business,loan,social};
}
function mlEventAllowed31(title,ctx){
  const t=String(title||"");
  if(t.includes("Munkahelyi gond")||t.includes("Extra bevétel")) return ctx.employed;
  if(t.includes("Közlekedési költség")) return ctx.car;
  if(t.includes("Háztartási probléma")) return ctx.house;
  if(t.includes("Baráti konfliktus")) return ctx.partner || state.relationships.length>0;
  if(t.includes("Csalódás")) return ctx.partner;
  return true;
}
function mlContextEventPool31(){
  const base=mlEventPool().filter(e=>mlEventAllowed31(e.title,mlLifeContext()));
  const ctx=mlLifeContext();
  const add=(weight,kind,title,run,when)=>{if(when(ctx))base.push({weight,kind,title,run})};
  add(6,"negative","🎓 Egyetemi nyomás",()=>{state.happiness=clamp(state.happiness-rand(3,8));state.discipline=clamp(state.discipline-rand(1,4));return "Az egyetemi terhelés egy időre megviselt."},c=>c.university);
  add(5,"negative","👶 Gyermek körüli váratlan kiadás",()=>{const n=rand(10000,60000);if(state.money>=n){state.money-=n;state.stats.spent+=n}else{const d=n-state.money;state.stats.spent+=state.money;state.money=0;state.debt+=d}return "A gyermekeddel kapcsolatban váratlan kiadás merült fel: "+fmt(n)+"."},c=>c.children);
  add(5,"negative","🐾 Háziállat állatorvosi költsége",()=>{const n=rand(8000,50000);if(state.money>=n){state.money-=n;state.stats.spent+=n}else{const d=n-state.money;state.stats.spent+=state.money;state.money=0;state.debt+=d}return "A háziállatodnak állatorvosi ellátásra volt szüksége."},c=>c.pet);
  add(5,"negative","🚗 Autójavítás",()=>{const n=rand(20000,120000);if(state.money>=n){state.money-=n;state.stats.spent+=n}else{const d=n-state.money;state.stats.spent+=state.money;state.money=0;state.debt+=d}return "Az autód váratlanul javításra szorult."},c=>c.car);
  add(4,"negative","🏠 Ingatlanprobléma",()=>{const n=rand(30000,150000);if(state.money>=n){state.money-=n;state.stats.spent+=n}else{const d=n-state.money;state.stats.spent+=state.money;state.money=0;state.debt+=d}return "Az ingatlanodnál javítási probléma merült fel."},c=>c.house);
  add(4,"negative","💳 Hitelteher",()=>{const n=Math.max(5000,Math.round(state.debt*0.04));state.debt+=n;return "A meglévő tartozásod miatt további kamatteher jelent meg: "+fmt(n)+"."},c=>c.loan);
  add(4,"negative","🏢 Vállalkozási probléma",()=>{const n=rand(20000,100000);if(state.money>=n){state.money-=n;state.stats.spent+=n}else{const d=n-state.money;state.stats.spent+=state.money;state.money=0;state.debt+=d}return "A vállalkozásodnál váratlan költség merült fel."},c=>c.business);
  add(4,"negative","📱 Közösségi visszajelzés",()=>{state.happiness=clamp(state.happiness-rand(2,6));return "Egy online posztod negatív visszajelzéseket kapott."},c=>c.social);
  add(4,"negative","❤️ Kapcsolati feszültség",()=>{state.happiness=clamp(state.happiness-rand(2,7));const r=state.relationships.find(x=>/pár|partner|barát|barátnő|vőlegény|menyasszony/i.test(String(x.type||"")));if(r)r.closeness=clamp(r.closeness-rand(3,9));return "Feszültebb időszak alakult ki a kapcsolatodban."},c=>c.partner);
  add(3,"positive","💼 Munkahelyi elismerés",()=>{const n=rand(10000,50000);state.money+=n;state.stats.earned+=n;state.happiness=clamp(state.happiness+rand(2,5));return "Jól teljesítettél a munkában, és extra jutalmat kaptál: "+fmt(n)+"."},c=>c.employed);
  add(3,"positive","🏢 Vállalkozási siker",()=>{const n=rand(20000,120000);state.money+=n;state.stats.earned+=n;return "A vállalkozásod egy jó időszakot zárt: +"+fmt(n)+"."},c=>c.business);
  add(3,"positive","📱 Online növekedés",()=>{for(const p of Object.values(state.social.platforms)){p.followers+=rand(20,180)}state.social.followers=Object.values(state.social.platforms).reduce((n,x)=>n+(x.followers||0),0);return "A közösségi profiljaid az átlagosnál jobban teljesítettek."},c=>c.social);
  add(3,"positive","🎓 Egyetemi siker",()=>{state.smarts=clamp(state.smarts+rand(2,5));state.happiness=clamp(state.happiness+rand(1,4));return "Egyetemi teljesítményedre pozitív visszajelzést kaptál."},c=>c.university);
  add(3,"positive","👶 Családi öröm",()=>{state.happiness=clamp(state.happiness+rand(3,7));return "Egy örömteli pillanatot éltél át a gyermekeddel."},c=>c.children);
  return base;
}
function annualEvent(){
  const settings=mlEventSettings();
  const used=[];
  for(let n=0;n<settings.randomEvents;n++){
    const pool=mlContextEventPool31().filter(x=>!used.includes(x.title));
    if(!pool.length)break;
    const e=mlWeightedPick(pool);used.push(e.title);
    const result=e.run();
    log(result,e.kind==="negative"?"Nehézség":e.kind==="positive"?"Szerencse":"Élet");
  }
  state.stats.annualEvents=settings.randomEvents;
}

/* MegaLife v0.0.32 — contextual event weighting + Hungarian text cleanup */
function mlEventContextScore32(e,ctx){
  let weight=Math.max(1,Number(e.weight)||1);
  const t=String(e.title||"");
  if(t.includes("Megbetegedtél")) weight*=ctx.health<45?2.2:ctx.health<65?1.5:.75;
  if(t.includes("Iskolai nehézség")||t.includes("Egyetemi nyomás")||t.includes("Egyetemi siker")) weight*=ctx.university?1.25:1;
  if(t.includes("Baráti konfliktus")) weight*=ctx.relationships>0?1.35:.6;
  if(t.includes("Csalódás")||t.includes("Kapcsolati feszültség")) weight*=ctx.partner?(ctx.closeness<45?1.7:1.15):.4;
  if(t.includes("Stresszes időszak")||t.includes("Munkahelyi gond")) weight*=ctx.employed?(ctx.discipline<45?1.45:.9):.45;
  if(t.includes("Váratlan kiadás")||t.includes("Háztartási probléma")) weight*=ctx.adult?(ctx.money<100000?1.45:1):.7;
  if(t.includes("Közlekedési költség")||t.includes("Autójavítás")) weight*=ctx.car?(ctx.money<200000?1.6:1):.35;
  if(t.includes("Ingatlanprobléma")) weight*=ctx.house?(ctx.money<300000?1.5:1):.25;
  if(t.includes("Hitelteher")) weight*=ctx.loan?1.4:.2;
  if(t.includes("Vállalkozási probléma")||t.includes("Vállalkozási siker")) weight*=ctx.business?(ctx.money<300000?1.35:1):.25;
  if(t.includes("Közösségi visszajelzés")||t.includes("Online növekedés")) weight*=ctx.social?(ctx.socialFollowers>10000?1.3:1):.2;
  if(t.includes("Gyermek körüli")||t.includes("Családi öröm")) weight*=ctx.children?(ctx.childrenCount>1?1.2:1):.2;
  if(t.includes("Háziállat")) weight*=ctx.pet?1.25:.2;
  if(t.includes("Munkahelyi elismerés")||t.includes("Extra bevétel")) weight*=ctx.employed?(ctx.discipline>=60?1.25:.95):.2;
  if(t.includes("Jó eredmény")) weight*=ctx.smarts>=65?1.3:.9;
  return weight;
}
function mlContextEventPool32(){
  const base=mlContextEventPool31();
  const ctx=mlLifeContext();
  ctx.health=Number(state.health)||0;
  ctx.discipline=Number(state.discipline)||0;
  ctx.smarts=Number(state.smarts)||0;
  ctx.money=Number(state.money)||0;
  ctx.relationships=state.relationships.length;
  const partner=state.relationships.find(r=>/pár|partner|barát|barátnő|vőlegény|menyasszony/i.test(String(r.type||"")));
  ctx.closeness=partner?Number(partner.closeness)||0:0;
  ctx.childrenCount=state.children.length;
  ctx.socialFollowers=Number(state.social&&state.social.followers)||0;
  return base.map(e=>({...e,weight:mlEventContextScore32(e,ctx)}));
}
function annualEvent(){
  const settings=mlEventSettings();
  const used=[];
  for(let n=0;n<settings.randomEvents;n++){
    const pool=mlContextEventPool32().filter(x=>!used.includes(x.title));
    if(!pool.length)break;
    const e=mlWeightedPick(pool);used.push(e.title);
    const result=e.run();
    log(result,e.kind==="negative"?"Nehézség":e.kind==="positive"?"Szerencse":"Élet");
  }
  state.stats.annualEvents=Math.min(settings.randomEvents,used.length);
}
