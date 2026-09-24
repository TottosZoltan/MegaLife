const VERSION="0.3.1";
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
function render(){if(!state){$("startScreen").classList.remove("hidden");$("gameScreen").classList.add("hidden");return}$("startScreen").classList.add("hidden");$("gameScreen").classList.remove("hidden");$("pName").textContent=state.first+" "+state.last;$("avatar").textContent=state.first[0].toUpperCase();$("pMeta").textContent=state.age+" éves • "+state.gender+" • "+state.country;$("ageText").textContent=state.age+" éves";$("wealth").textContent=fmt(wealth());renderStats();renderLife();renderRelations();renderCareer();renderFinance();renderAssets();renderActivities();renderAchievements();renderStatsTab();renderSocial();renderSocial()}
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

/* MegaLife v0.1.5 — main-screen-only pull-to-refresh */
(function setupPullToRefresh015(){
  let startY=0,startX=0,pulling=false,refreshing=false,startScroller=null;
  const threshold=48;
  const indicator=document.createElement("div");
  indicator.id="pullRefreshIndicator";
  indicator.innerHTML='<span class="pull-icon">↓</span><span class="pull-label">Húzd le a frissítéshez</span>';
  document.body.appendChild(indicator);
  const setProgress=distance=>{
    const progress=Math.min(1,distance/threshold);
    indicator.style.setProperty("--pull-progress",progress);
    indicator.classList.toggle("ready",progress>=1);
    indicator.querySelector(".pull-icon").textContent=progress>=1?"↻":"↓";
    indicator.querySelector(".pull-label").textContent=progress>=1?"Engedd el a frissítéshez":"Húzd le a frissítéshez";
  };
  const reset=()=>{
    pulling=false;startScroller=null;
    indicator.classList.remove("visible","ready","refreshing");
    indicator.style.transform="translate(-50%, -58px)";
    setProgress(0);
  };
  window.addEventListener("touchstart",e=>{
    if(refreshing||document.body.classList.contains("ml-tab-open")||$("gameScreen")?.classList.contains("hidden")||e.touches.length!==1)return;
    const scroller=e.target.closest(".life-log");
    if(scroller&&scroller.scrollTop>0)return;
    if(!scroller&&window.scrollY>0)return;
    startScroller=scroller;
    startY=e.touches[0].clientY;
    startX=e.touches[0].clientX;
    pulling=true;
  },{passive:true});
  window.addEventListener("touchmove",e=>{
    if(!pulling||refreshing||document.body.classList.contains("ml-tab-open")||e.touches.length!==1)return;
    if(startScroller&&startScroller.scrollTop>0){reset();return;}
    const dy=e.touches[0].clientY-startY,dx=Math.abs(e.touches[0].clientX-startX);
    if(dy<=0||dy<dx)return;
    const distance=Math.min(150,dy*.9);
    indicator.style.transform="translate(-50%, "+Math.round(distance-58)+"px)";
    indicator.classList.add("visible");
    setProgress(distance);
  },{passive:true});
  window.addEventListener("touchend",()=>{
    if(!pulling)return;
    const ready=indicator.classList.contains("ready");
    if(ready){
      refreshing=true;
      indicator.classList.add("visible","refreshing");
      indicator.querySelector(".pull-label").textContent="Frissítés folyamatban…";
      indicator.querySelector(".pull-icon").textContent="↻";
      setTimeout(()=>refreshPage(),900);
    }else reset();
  },{passive:true});
  window.addEventListener("touchcancel",reset,{passive:true});
})();
function refreshPage(){
  showRefreshOverlay();
  const b=$("refreshBtn");
  if(b){b.disabled=true;b.setAttribute("aria-busy","true");}
  setTimeout(()=>location.reload(),1400);
}


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
  $("pName").textContent=state.first+" "+state.last;$("avatar").textContent=state.first[0].toUpperCase();$("pMeta").textContent=state.age+" éves • "+state.gender+" • "+state.country+" • Élet "+currentSlot;$("ageText").textContent=state.age+" éves";$("wealth").textContent=fmt(wealth());renderStats();renderLife();renderRelations();renderCareer();renderFinance();renderAssets();renderActivities();renderAchievements();renderStatsTab();renderSocial();$("versionText")&&($("versionText").textContent="v"+VERSION);
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
function render(){if(!state){$("startScreen").classList.remove("hidden");$("gameScreen").classList.add("hidden");return}$("startScreen").classList.add("hidden");$("gameScreen").classList.remove("hidden");$("pName").textContent=state.first+" "+state.last;$("avatar").textContent=state.first[0].toUpperCase();$("pMeta").textContent=state.age+" éves • "+state.gender+" • "+state.country;$("ageText").textContent=state.age+" éves";$("wealth").textContent=fmt(wealth());renderStats();renderMainLifeLog();renderLife();renderRelations();renderCareer();renderFinance();renderAssets();renderActivities();renderAchievements();renderStatsTab();renderSocial();ensureTabBackButtons()}

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


/* MegaLife v0.1.0 — release hardening, deterministic settings and save compatibility */
function mlSafeText(value,fallback=""){
  return String(value??fallback).replace(/[<>]/g,"").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,"").trim().slice(0,80)||fallback;
}
const _mlNormalizeRelease=normalize;
normalize=function(){
  _mlNormalizeRelease();
  if(!state)return;
  state.alive=state.alive!==false;
  state.first=mlSafeText(state.first,"Alex");
  state.last=mlSafeText(state.last,"Life");
  state.country=mlSafeText(state.country,"Magyarország");
  state.money=Math.max(0,Math.round(Number(state.money)||0));
  state.bank=Math.max(0,Math.round(Number(state.bank)||0));
  state.debt=Math.max(0,Math.round(Number(state.debt)||0));
  state.health=clamp(Number(state.health)||0);
  state.happiness=clamp(Number(state.happiness)||0);
  state.smarts=clamp(Number(state.smarts)||0);
  state.looks=clamp(Number(state.looks)||0);
  state.discipline=clamp(Number(state.discipline)||0);
  state.karma=clamp(Number(state.karma)||0);
  state.relationships=Array.isArray(state.relationships)?state.relationships:[];
  state.children=Array.isArray(state.children)?state.children:[];
  state.assets=Array.isArray(state.assets)?state.assets:[];
  state.crimes=Array.isArray(state.crimes)?state.crimes:[];
  state.hobbies=Array.isArray(state.hobbies)?state.hobbies:[];
  state.events=Array.isArray(state.events)?state.events:[];
  state.achievements=Array.isArray(state.achievements)?state.achievements:[];
  state.social=state.social&&typeof state.social==="object"?state.social:{followers:0,posts:0,platforms:{}};
  state.social.followers=Math.max(0,Math.round(Number(state.social.followers)||0));
  state.social.posts=Math.max(0,Math.round(Number(state.social.posts)||0));
  state.social.platforms=state.social.platforms&&typeof state.social.platforms==="object"?state.social.platforms:{};
  Object.values(state.social.platforms).forEach(p=>{
    if(!p||typeof p!=="object")return;
    p.handle=mlSafeText(p.handle,"@megalife");
    p.followers=Math.max(0,Math.round(Number(p.followers)||0));
    p.posts=Math.max(0,Math.round(Number(p.posts)||0));
    p.likes=Math.max(0,Math.round(Number(p.likes)||0));
  });
  state.stats=state.stats&&typeof state.stats==="object"?state.stats:{};
  for(const k of["years","earned","spent","days","actions","relationships","children","crimes","investProfit","annualEvents"])state.stats[k]=Math.max(0,Number(state.stats[k])||0);
  state.pendingConsequences=Array.isArray(state.pendingConsequences)?state.pendingConsequences:[];
  state.flags=state.flags&&typeof state.flags==="object"?state.flags:{};
  state.flags.married=!!state.flags.married;
  state.flags.university=!!state.flags.university;
  state.meta=state.meta&&typeof state.meta==="object"?state.meta:{};
  state.meta.version=VERSION;
  state.meta.slot=currentSlot||1;
  if(state.events.length>80)state.events=state.events.slice(-80);
};
const _mlSaveRelease=save;
save=function(){
  if(!state)return false;
  try{normalize();_mlSaveRelease();return true}catch(e){console.error("MegaLife mentési hiba:",e);toast("A mentés nem sikerült.");return false}
};
function randomLifeEvent(){return null}
const _mlChoiceRelease=choiceEvent;
choiceEvent=function(){
  if(!state||state.age<8)return;
  const settings=mlEventSettings();
  if(settings.choiceEvents<=0)return;
  state.meta=state.meta||{};
  if(state.meta.choiceYear===state.year)return;
  _mlChoiceRelease();
  if($("modal")&&!$("modal").classList.contains("hidden"))state.meta.choiceYear=state.year;
}
const _mlNextYearRelease=nextYear;
nextYear=function(){
  if(!state||!state.alive)return;
  _mlNextYearRelease();
  if(state&&state.alive){
    const settings=mlEventSettings();
    if(settings.choiceEvents>0&&state.age>=8&&state.meta?.choiceYear!==state.year)choiceEvent();
    normalize();save();render();
  }
}
const _mlRenderLifeRelease=renderLife;
renderLife=function(){
  if(!state)return;
  _mlRenderLifeRelease();
  const box=$("tab-life");
  if(!box)return;
  const events=[...state.events].sort((a,b)=>(Number(a.age)||0)-(Number(b.age)||0)||(Number(a.year)||0)-(Number(b.year)||0));
  const groups={};
  events.slice(-24).forEach(e=>{const key=(Number(e.age)||0)+"|"+(Number(e.year)||0);(groups[key]??=[]).push(e)});
  const timeline=Object.entries(groups).map(([key,items])=>{
    const [age,year]=key.split("|");
    return '<section class="life-thread"><div class="thread-node"><span>'+age+'</span><small>'+year+'</small></div><div class="thread-content"><div class="thread-title">'+age+' éves <span>'+year+'</span></div><div class="thread-events">'+items.map(e=>'<article class="thread-event"><span class="tag">'+mlSafeText(e.type||"Élet","Élet")+'</span><div>'+mlSafeText(e.text||"")+'</div></article>').join("")+'</div></div></section>';
  }).join("");
  const target=box.querySelector(".panel:last-child");
  if(target)target.innerHTML="<h3>Életnapló</h3>"+(timeline||'<div class="muted">Még nincs történés. Nyomd meg a Következő év gombot!</div>');
};

/* MegaLife v0.1.0 — choice-event guarantee */
const _mlChoiceRelease01=choiceEvent;
choiceEvent=function(){
  if(!state||state.age<8)return;
  const settings=mlEventSettings();
  if(settings.choiceEvents<=0)return;
  state.meta=state.meta||{};
  if(state.meta.choiceYear===state.year)return;
  if(Array.isArray(ML_CHOICES)&&ML_CHOICES.length){
    const c=pick(ML_CHOICES);
    $("modalBody").innerHTML='<div class="eyebrow">DÖNTÉSI HELYZET</div><h2>'+c.title+'</h2><p class="muted">'+c.text+'</p>'+c.choices.map((x,i)=>'<button class="choice" onclick="mlResolveChoice('+i+')">'+x[0]+'</button>').join("");
    window.__mlChoice=c;
    $("modal").classList.remove("hidden");
    state.meta.choiceYear=state.year;
    return;
  }
  _mlChoiceRelease01();
  if($("modal")&&!$("modal").classList.contains("hidden"))state.meta.choiceYear=state.year;
}


/* MegaLife v0.1.2 — decision-first events and readable mobile HUD */
function mlSnapshot(){
  return {
    money:Number(state.money)||0,bank:Number(state.bank)||0,debt:Number(state.debt)||0,
    health:Number(state.health)||0,happiness:Number(state.happiness)||0,smarts:Number(state.smarts)||0,
    looks:Number(state.looks)||0,discipline:Number(state.discipline)||0,karma:Number(state.karma)||0,
    followers:Number(state.social?.followers)||0,children:Array.isArray(state.children)?state.children.length:0,
    relationships:Array.isArray(state.relationships)?state.relationships.length:0,
    assets:Array.isArray(state.assets)?state.assets.length:0,events:Array.isArray(state.events)?state.events.length:0,
    job:Array.isArray(state.job)?state.job[0]:"",business:!!state.business,pet:!!state.pet,jail:Number(state.jail)||0
  };
}
function mlNumDiff(a,b,key,label,positive=" +",negative=" −"){
  const d=(Number(b[key])||0)-(Number(a[key])||0);
  if(!d)return "";
  const sign=d>0?positive:negative;
  const v=Math.abs(Math.round(d));
  return label+" "+sign+((key==="money"||key==="bank"||key==="debt")?fmt(v):v);
}
function mlActionEffects(before,after){
  const out=[];
  [["health","Egészség"],["happiness","Boldogság"],["smarts","Intelligencia"],["looks","Kinézet"],["discipline","Fegyelem"],["karma","Karma"],["money","Pénz"],["bank","Bank"],["debt","Tartozás"],["followers","Követők"],["children","Gyerekek"],["relationships","Kapcsolatok"],["assets","Vagyontárgyak"],["jail","Börtönévek"]].forEach(([k,l])=>{const x=mlNumDiff(before,after,k,l);if(x)out.push(x)});
  if(before.job!==after.job)out.push("Munka: "+after.job);
  if(!before.business&&after.business)out.push("Vállalkozás indult");
  if(before.business&&!after.business)out.push("Vállalkozás lezárva");
  if(!before.pet&&after.pet)out.push("Új háziállat");
  return out;
}
function mlQueueConsequence(kind,title,text,run){
  state.pendingConsequences=Array.isArray(state.pendingConsequences)?state.pendingConsequences:[];
  if(state.pendingConsequences.length>=4)return;
  state.pendingConsequences.push({id:"c"+Date.now()+rand(10,99),dueYear:state.year+1,kind,title,text,runKey:run});
}
function mlConsequenceDefinitions(action,before,after){
  if(action==="buyCar"&&after.assets<=before.assets)return;
  const chance=Math.random();
  if(action==="buyCar"&&after.assets>before.assets&&chance<.45)mlQueueConsequence("vehicle","🚗 Autószerviz","Az autódnak éves szervizre van szüksége.", "car-service");
  if(action==="pet"&&!before.pet&&after.pet&&chance<.55)mlQueueConsequence("pet","🐾 Állatorvosi ellenőrzés","A háziállatodnak esedékes egy ellenőrzés.", "vet-check");
  if(action==="startBusiness"&&!before.business&&after.business&&chance<.55)mlQueueConsequence("business","🏢 Üzleti adminisztráció","A vállalkozásodnak el kell intézned egy költséges adminisztratív feladatot.", "business-admin");
  if(action==="socialPost"&&after.followers>before.followers&&chance<.3)mlQueueConsequence("social","📣 Megkeresés","Egy új követő megkeresett egy együttműködési lehetőséggel.", "social-deal");
  if(action==="travel"&&after.happiness>before.happiness&&chance<.25)mlQueueConsequence("travel","📸 Utazási emlék","Az utazásod után készíthetsz egy fotósorozatot és megoszthatod.", "travel-post");
}
function mlRunConsequence(i){
  const c=state.pendingConsequences?.[i];
  if(!c)return;
  let message="";
  if(c.runKey==="car-service"){const n=rand(45000,140000);if(state.money<n){state.debt+=n-state.money;state.money=0;message="Nem volt elég pénzed a szervizre, ezért tartozás keletkezett: "+fmt(n)+"."}else{state.money-=n;state.stats.spent+=n;message="Kifizetted az autó szervizét: "+fmt(n)+"."}}
  if(c.runKey==="vet-check"){const n=rand(15000,65000);if(state.money<n){state.happiness=clamp(state.happiness-4);message="Nem tudtad teljesen kifizetni az állatorvost, ezért elhalasztottad az ellenőrzést."}else{state.money-=n;state.stats.spent+=n;state.health=clamp(state.health+2);message="Elvitted az állatodat ellenőrzésre: "+fmt(n)+"."}}
  if(c.runKey==="business-admin"){const n=rand(30000,120000);if(state.money<n){state.debt+=n-state.money;state.money=0;message="Az adminisztrációt csak tartozásból tudtad rendezni: "+fmt(n)+"."}else{state.money-=n;state.stats.spent+=n;state.discipline=clamp(state.discipline+2);message="Elintézted a vállalkozás adminisztrációját: "+fmt(n)+"."}}
  if(c.runKey==="social-deal"){const gain=rand(200,2500);state.social.followers+=gain;state.happiness=clamp(state.happiness+3);message="Elfogadtad az együttműködést: +"+gain+" követő."}
  if(c.runKey==="travel-post"){const gain=rand(80,900);state.social.followers+=gain;state.social.posts++;message="Megosztottad az utazási fotóidat: +"+gain+" követő."}
  if(message){log(message,"Következmény");state.social.followers=Object.values(state.social.platforms||{}).reduce((n,x)=>n+(x.followers||0),0)}
  state.pendingConsequences.splice(i,1);normalize();save();render();toast("↪ "+message);setTimeout(()=>mlCloseTabsAfterAction(),60);
}
function renderPendingConsequences(){
  const box=$("choiceBanner");if(!box||!state)return;
  const due=(state.pendingConsequences||[]).filter(x=>Number(x.dueYear||0)<=state.year);
  if(!due.length){box.classList.add("hidden");box.innerHTML="";return}
  const c=due[0],i=state.pendingConsequences.indexOf(c);
  box.classList.remove("hidden");
  box.innerHTML='<div class="action consequence-card"><b>↪ '+mlSafeText(c.title,"Következő lépés")+'</b><small>'+mlSafeText(c.text,"Az előző döntésednek következménye lett.")+'</small><button class="action consequence-button" onclick="mlRunConsequence('+i+')"><b>Folytatom</b><small>Hajtsd végre ezt a következő lépést.</small></button><button class="ghost consequence-skip" onclick="mlSkipConsequence('+i+')">Most kihagyom</button></div>';
}
function mlSkipConsequence(i){
  const c=state.pendingConsequences?.[i];if(!c)return;
  state.pendingConsequences.splice(i,1);log("Kihagytad: "+mlSafeText(c.title,"egy következő lépést")+".","Döntés");save();render();setTimeout(()=>mlCloseTabsAfterAction(),60);
}
function mlCloseTabsAfterAction(){
  closeTabs();render();scrollLifeLogToLatest();
}
function mlActionFeedback(action,before){
  if(!state||!state.alive)return;
  const after=mlSnapshot(),effects=mlActionEffects(before,after);
  if(after.events===before.events&&effects.length===0)return;
  if(effects.length){
    const msg="Hatás: "+effects.slice(0,5).join(" • ");
    log(msg,"Hatás");
    toast("✨ "+msg);
  }
  mlConsequenceDefinitions(action,before,after);
  save();render();renderPendingConsequences();
  setTimeout(()=>mlCloseTabsAfterAction(),70);
}
function mlWrapAction(name){
  const fn=window[name];if(typeof fn!=="function"||fn.__ml011)return;
  const wrapped=function(...args){
    if(!state||!state.alive)return fn.apply(this,args);
    const before=mlSnapshot();
    const result=fn.apply(this,args);
    setTimeout(()=>mlActionFeedback(name,before),0);
    return result;
  };
  wrapped.__ml011=true;window[name]=wrapped;
}
function mlRememberMenu(tab){
  if(state){state.meta=state.meta||{};state.meta.lastMenu=tab}
}
function mlReturnShortcut(){
  const box=$("returnShortcut");if(!box||!state)return;
  const tab=state.meta?.lastMenu;
  const labels={relations:"Kapcsolatok",career:"Karrier",finance:"Pénz",assets:"Vagyon",activities:"Mindennapok",achievements:"Eredmények",stats:"Statisztikák",social:"Közösségi élet"};
  if(!tab||!labels[tab]){box.classList.add("hidden");return}
  box.classList.remove("hidden");box.innerHTML='<button type="button" class="return-shortcut" onclick="showTab(&quot;'+tab+'&quot;)">↩ '+labels[tab]+' megnyitása</button>';
}
const _mlShowTab011=showTab;
showTab=function(tab){
  mlRememberMenu(tab);
  _mlShowTab011(tab);
  if(tab==="life")return;
  setTimeout(()=>{mlReturnShortcut();},0);
};
const _mlRender011=render;
render=function(){
  _mlRender011();
  if(state){renderPendingConsequences();mlReturnShortcut();mlChoiceBanner012()}
};
const _mlPocket011=mlPocketDecision;
mlPocketDecision=function(...args){
  const before=mlSnapshot();const result=_mlPocket011(...args);setTimeout(()=>mlActionFeedback("pocketMoney",before),0);return result;
};

/* v0.1.1 consequence migration */
const _mlNormalize011=normalize;
normalize=function(){
  _mlNormalize011();
  if(!state)return;
  state.pendingConsequences=(Array.isArray(state.pendingConsequences)?state.pendingConsequences:[]).filter(x=>x&&typeof x==="object").slice(-4);
  state.pendingConsequences.forEach(x=>{x.dueYear=Number(x.dueYear)||state.year;x.title=mlSafeText(x.title,"Következő lépés");x.text=mlSafeText(x.text,"Az előző döntésednek következménye lett.");x.kind=mlSafeText(x.kind,"general");x.runKey=mlSafeText(x.runKey,"")});
};

/* v0.1.2 — make real decision situations interactive instead of passive events */
const ML_DECISION_EVENTS_012=[
 {id:"school",min:8,max:17,weight:8,title:"📚 Iskolai döntés",text:"Fontos dolgozatod lesz. Mit teszel?",options:[
  {label:"Tanulok",run:()=>{state.smarts=clamp(state.smarts+4);state.discipline=clamp(state.discipline+2);state.happiness=clamp(state.happiness-2);log("Tanultál a fontos dolgozatra. +Intelligencia, +Fegyelem, −Boldogság.","Döntés")}},
  {label:"Pihenek",run:()=>{state.happiness=clamp(state.happiness+4);state.smarts=clamp(state.smarts-1);log("A pihenést választottad a tanulás helyett. +Boldogság, −Intelligencia.","Döntés")}}
 ]},
 {id:"friends",min:10,weight:7,title:"🤝 Baráti döntés",text:"Egy barátodnak szüksége van rád, de neked is tele van a napod. Mit teszel?",options:[
  {label:"Segítek neki",run:()=>{state.happiness=clamp(state.happiness+3);state.karma=clamp(state.karma+3);state.discipline=clamp(state.discipline-1);log("Időt szántál a barátodra. +Boldogság, +Karma.","Döntés")}},
  {label:"A saját dolgaimmal foglalkozom",run:()=>{state.discipline=clamp(state.discipline+2);state.happiness=clamp(state.happiness-1);log("A saját feladataidat választottad. +Fegyelem, −Boldogság.","Döntés")}}
 ]},
 {id:"money",min:16,weight:6,title:"💰 Pénzügyi döntés",text:"Váratlanul plusz pénzhez jutottál. Mire használod?",onOpen:()=>{const n=rand(5000,25000);state.money+=n;state.stats.earned+=n;log("Váratlanul kaptál "+fmt(n)+" Ft-ot.","Pénz")},options:[
  {label:"Félreteszem",run:()=>{const n=rand(5000,25000);state.money+=n;state.bank+=n;state.money-=n;state.discipline=clamp(state.discipline+2);log("A plusz pénzt félretetted: "+fmt(n)+".","Döntés")}},
  {label:"Elköltöm magamra",run:()=>{const n=rand(3000,18000);state.money+=n;state.money-=n;state.happiness=clamp(state.happiness+5);log("A plusz pénzt élményre költötted. +Boldogság.","Döntés")}}
 ]},
 {id:"work",min:18,weight:7,requires:s=>!!s.job,title:"💼 Munkahelyi döntés",text:"A munkahelyeden kapsz egy plusz feladatot. Többet kereshetsz, de kevesebb szabadidőd marad.",options:[
  {label:"Elvállalom",run:()=>{const n=rand(10000,60000);state.money+=n;state.stats.earned+=n;state.discipline=clamp(state.discipline+3);state.happiness=clamp(state.happiness-3);log("Elvállaltad a plusz feladatot: +"+fmt(n)+" pénz, +Fegyelem, −Boldogság.","Döntés")}},
  {label:"Nem vállalom",run:()=>{state.happiness=clamp(state.happiness+2);state.discipline=clamp(state.discipline-1);log("A szabadidőt választottad a plusz munka helyett. +Boldogság.","Döntés")}}
 ]},
 {id:"health",min:18,weight:5,title:"🏥 Egészségügyi döntés",text:"Egy ideje nem érzed magad teljesen jól. Mit teszel?",options:[
  {label:"Elmegyek orvoshoz",run:()=>{const n=rand(5000,30000);if(state.money>=n){state.money-=n;state.stats.spent+=n;state.health=clamp(state.health+7);log("Orvoshoz mentél és kivizsgáltattad magad. +Egészség, −Pénz.","Döntés")}else{state.health=clamp(state.health+2);log("Orvoshoz mentél, de csak alapvizsgálatra volt elég pénzed. +Egészség.","Döntés")}}},
  {label:"Pihenek és figyelek magamra",run:()=>{state.health=clamp(state.health+3);state.happiness=clamp(state.happiness+2);log("Pihentél és jobban figyeltél magadra. +Egészség, +Boldogság.","Döntés")}}
 ]},
 {id:"relationship",min:18,weight:5,requires:s=>s.relationships?.length>0,title:"❤️ Kapcsolati döntés",text:"A párod több időt szeretne veled tölteni. Mit teszel?",options:[
  {label:"Időt szánok rá",run:()=>{state.happiness=clamp(state.happiness+5);state.karma=clamp(state.karma+1);log("Időt töltöttél a pároddal. +Boldogság.","Döntés")}},
  {label:"Most a saját dolgaim fontosabbak",run:()=>{state.discipline=clamp(state.discipline+1);state.happiness=clamp(state.happiness-4);log("A saját dolgaidat választottad. −Boldogság, +Fegyelem.","Döntés")}}
 ]}
];
function mlDecisionPool012(){
 return ML_DECISION_EVENTS_012.filter(e=>state.age>=e.min&&(e.max===undefined||state.age<=e.max)&&(!e.requires||e.requires(state)));
}
function mlPickDecision012(){
 const pool=mlDecisionPool012();if(!pool.length)return null;
 return pool[Math.floor(Math.random()*pool.length)];
}
function mlChoiceBanner012(){
 const box=$("choiceBanner");if(!box||!state)return;
 const c=state.meta?.activeDecision;
 if(!c){return}
 box.classList.remove("hidden");
 box.innerHTML='<div class="decision-card"><div class="decision-kicker">DÖNTÉSI HELYZET</div><h3>'+mlSafeText(c.title,"Döntés")+'</h3><p>'+mlSafeText(c.text,"Mit választasz?")+'</p><div class="decision-options">'+c.options.map((o,i)=>'<button class="action decision-option" onclick="mlResolveDecision012('+i+')"><b>'+mlSafeText(o.label,"Választás")+'</b></button>').join("")+'</div></div>';
}
function mlOpenDecision012(){
 if(!state||state.meta?.activeDecision)return false;
 const c=mlPickDecision012();if(!c)return false;
 state.meta=state.meta||{};state.meta.activeDecision={id:c.id,title:c.title,text:c.text,options:c.options.map((o,i)=>({label:o.label,index:i}))};
 state.meta.activeDecisionPayload=c;
 mlChoiceBanner012();return true;
}
function mlResolveDecision012(i){
 const a=state.meta?.activeDecisionPayload;
 if(!a||!a.options?.[i])return;
 const picked=a.options[i];
 state.meta.activeDecision=null;state.meta.activeDecisionPayload=null;
 picked.run();normalize();save();render();toast("✓ Döntés rögzítve: "+picked.label);
 setTimeout(()=>mlCloseTabsAfterAction(),80);
}
const _mlNextYear012=nextYear;
nextYear=function(){
 if(!state||!state.alive)return _mlNextYear012();
 const had=state.meta?.activeDecision;
 if(had)return toast("Előbb válassz a jelenlegi döntési helyzetben.");
 const savedChoiceSetting=localStorage.getItem("megalife-event-settings");
 try{
   const cfg=mlEventSettings();
   localStorage.setItem("megalife-event-settings",JSON.stringify({...cfg,choiceEvents:0}));
   const result=_mlNextYear012();
   if(savedChoiceSetting===null)localStorage.removeItem("megalife-event-settings");
   else localStorage.setItem("megalife-event-settings",savedChoiceSetting);
   if(state&&state.alive&&state.meta?.activeDecision==null&&cfg.choiceEvents>0&&state.age>=8){
     if(mlOpenDecision012())toast("Új döntési helyzet vár rád.");
   }
   normalize();save();render();
   return result;
 }catch(e){
   if(savedChoiceSetting===null)localStorage.removeItem("megalife-event-settings");
   else localStorage.setItem("megalife-event-settings",savedChoiceSetting);
   throw e;
 }
};


/* MegaLife v0.1.3 — longer refresh feedback + visible new-event pulse */
const ML_NEW_EVENT_IDS_013=new Set();
const _mlLog013=log;
log=function(text,type="Élet"){
  _mlLog013(text,type);
  const e=state?.events?.[state.events.length-1];
  if(e){
    e.id=e.id||("evt-"+Date.now()+"-"+Math.random().toString(36).slice(2,8));
    ML_NEW_EVENT_IDS_013.add(e.id);
  }
};
const _mlRenderMainLifeLog013=renderMainLifeLog;
renderMainLifeLog=function(){
  _mlRenderMainLifeLog013();
  const events=[...state.events].sort((x,y)=>(Number(x.age)||0)-(Number(y.age)||0)||(Number(x.year)||0)-(Number(y.year)||0)).slice(-24);
  const nodes=[...document.querySelectorAll("#lifeLog .thread-event")];
  let n=0;
  for(const e of events){
    const node=nodes[n++];
    if(node&&e.id){
      node.dataset.eventId=e.id;
      if(ML_NEW_EVENT_IDS_013.has(e.id))node.classList.add("ml-new-event");
    }
  }
  if(ML_NEW_EVENT_IDS_013.size){
    setTimeout(()=>{
      document.querySelectorAll("#lifeLog .ml-new-event").forEach(el=>el.classList.remove("ml-new-event"));
      ML_NEW_EVENT_IDS_013.clear();
    },2800);
  }
};
function showRefreshOverlay(){
  const e=$("refreshOverlay");
  if(e){
    e.classList.remove("hidden");
    const small=e.querySelector("small");
    if(small)small.textContent="Az oldal újratöltése folyamatban…";
  }
  const p=$("pullRefreshIndicator");
  if(p){
    p.classList.add("visible","refreshing");
    p.querySelector(".pull-icon").textContent="↻";
    p.querySelector(".pull-label").textContent="Frissítés folyamatban…";
  }
}
function refreshPage(){
  showRefreshOverlay();
  const b=$("refreshBtn");
  if(b){b.disabled=true;b.setAttribute("aria-busy","true");}
  setTimeout(()=>location.reload(),1400);
}


/* MegaLife v0.1.4 — life phase HUD */
function mlLifePhase014(age){
  if(age<6)return "👶 Kisgyermekkor";
  if(age<14)return "🧒 Gyermekkor";
  if(age<18)return "🎒 Kamaszkor";
  if(age<30)return "🌱 Fiatal felnőttkor";
  if(age<50)return "🏡 Felnőttkor";
  if(age<65)return "⭐ Érett felnőttkor";
  return "🧓 Időskor";
}
const _mlRender014=render;
render=function(){
  _mlRender014();
  if(state){
    const meta=$("pMeta");
    if(meta)meta.textContent=state.age+" éves • "+mlLifePhase014(state.age)+" • "+state.country;
  }
};


/* MegaLife v0.1.4 — decision opening effects */
const _mlOpenDecision014=mlOpenDecision012;
mlOpenDecision012=function(){
  if(!state||state.meta?.activeDecision)return false;
  const beforeEvents=state.events?.length||0;
  const ok=_mlOpenDecision014();
  if(ok){
    const payload=state.meta?.activeDecisionPayload;
    if(payload?.onOpen){
      payload.onOpen();
      normalize();
      save();
      render();
    }
  }
  return ok;
};


/* MegaLife v0.1.5 — mobile page separation, sticky controls and main-only pull gesture */
const ML_TAB_TITLES_015={
  relations:"Kapcsolatok",career:"Karrier",finance:"Pénzügyek",assets:"Vagyon",
  activities:"Mindennapok",achievements:"Eredmények",stats:"Statisztikák",social:"Közösségi élet"
};
function ensureTabChrome015(tab){
  if(!tab)return;
  const old=tab.querySelector(".ml-tab-chrome");
  if(old)old.remove();
  const title=ML_TAB_TITLES_015[tab.id.replace("tab-","")]||"MegaLife";
  tab.insertAdjacentHTML("afterbegin",'<div class="ml-tab-chrome"><button type="button" class="ml-tab-back" onclick="closeTabs()" aria-label="Vissza">‹</button><div class="ml-tab-title">'+title+'</div><button type="button" class="ml-tab-close" onclick="closeTabs()" aria-label="Bezárás">×</button></div>');
}
function closeTabs(){
  document.querySelectorAll(".legacy-tab").forEach(e=>e.classList.add("hidden"));
  document.body.classList.remove("ml-tab-open");
  const game=$("gameScreen");
  if(game)game.classList.remove("ml-tab-dim");
  if(state){
    renderPendingConsequences();
    mlReturnShortcut();
  }
}
showTab=function(tab){
  if(!state)return;
  if(tab==="life"){closeTabs();return;}
  const target=$("tab-"+tab);
  if(!target)return;
  document.querySelectorAll(".legacy-tab").forEach(e=>e.classList.add("hidden"));
  target.classList.remove("hidden");
  target.classList.add("ml-page-open");
  document.body.classList.add("ml-tab-open");
  const game=$("gameScreen");
  if(game)game.classList.add("ml-tab-dim");
  ensureTabChrome015(target);
  mlRememberMenu(tab);
  mlReturnShortcut();
};
const _mlRender015=render;
render=function(){
  _mlRender015();
  if(state){
    document.querySelectorAll(".legacy-tab").forEach(tab=>{
      if(!tab.classList.contains("hidden"))ensureTabChrome015(tab);
    });
  }
};


/* MegaLife v0.1.7 — robust full-screen navigation + reliable action return */
(function(){
  function mlCloseTabs017(){
    document.querySelectorAll(".legacy-tab").forEach(el=>{
      el.classList.add("hidden");
      el.classList.remove("ml-page-open");
    });
    document.body.classList.remove("ml-tab-open");
    const game=$("gameScreen");
    if(game)game.classList.remove("ml-tab-dim");
    if(state){
      renderPendingConsequences();
      mlReturnShortcut();
      setTimeout(()=>scrollLifeLogToLatest(),0);
    }
  }
  closeTabs=mlCloseTabs017;

  function mlShowTab017(tab){
    if(!state)return;
    if(tab==="life"){mlCloseTabs017();return;}
    const target=$("tab-"+tab);
    if(!target)return;
    document.querySelectorAll(".legacy-tab").forEach(el=>{
      el.classList.add("hidden");
      el.classList.remove("ml-page-open");
    });
    target.classList.remove("hidden");
    target.classList.add("ml-page-open");
    document.body.classList.add("ml-tab-open");
    const game=$("gameScreen");
    if(game)game.classList.add("ml-tab-dim");
    ensureTabChrome015(target);
    mlRememberMenu(tab);
    mlReturnShortcut();
    target.scrollTop=0;
  }
  showTab=mlShowTab017;

  // Use delegated handlers so the sticky controls keep working after every render().
  if(!window.__mlNav017){
    window.__mlNav017=true;
    document.addEventListener("click",e=>{
      const close=e.target.closest(".ml-tab-close,.ml-tab-back");
      if(close){
        e.preventDefault();
        e.stopPropagation();
        mlCloseTabs017();
        return;
      }
      const action=e.target.closest(".legacy-tab .action,.legacy-tab .ghost");
      if(action){
        setTimeout(()=>{
          if(state && $("modal")?.classList.contains("hidden")) mlCloseTabs017();
        },140);
      }
    },true);
  }

  // Wrap the important action entry points once. This catches actions that render
  // their page immediately and would otherwise lose the navigation context.
  [
    "dateAction","proposal","marryAction","childAction","interact",
    "getJob","study","university","startBusiness","sellBusiness",
    "bank","loan","invest","gamble","sellAsset","buyHouse","buyCar","buyLuxury",
    "activity","travel","crime","pet","joinSocial","socialPost","socialTrend",
    "startHobby","practiceHobby","buyHobby","mlPocketDecision"
  ].forEach(name=>{
    const fn=window[name];
    if(typeof fn!=="function"||fn.__ml017)return;
    const wrapped=function(...args){
      const wasTab=document.body.classList.contains("ml-tab-open");
      const result=fn.apply(this,args);
      if(wasTab)setTimeout(()=>{
        if(state && $("modal")?.classList.contains("hidden")) mlCloseTabs017();
      },180);
      return result;
    };
    wrapped.__ml017=true;
    window[name]=wrapped;
  });
})();


/* MegaLife v0.2.0 — life-depth, economy, family, careers, world systems */
(function(){
  const ML20_VERSION="0.2.0";
  const num=(v,d=0)=>Number.isFinite(Number(v))?Number(v):d;
  function ml20Init(){
    if(!state)return;
    state.meta=state.meta||{};
    state.meta.world=state.meta.world||{
      inflation:1,yearlyCost:0,lifestyle:"Átlagos",countryMood:50,
      housingLevel:0,careerLevel:0,worldEvents:0
    };
    state.meta.goals=Array.isArray(state.meta.goals)?state.meta.goals:[];
    state.meta.storylines=Array.isArray(state.meta.storylines)?state.meta.storylines:[];
    state.meta.friends=Array.isArray(state.meta.friends)?state.meta.friends:[];
    state.meta.skills=state.meta.skills&&typeof state.meta.skills==="object"?state.meta.skills:{communication:0,finance:0,creativity:0,fitness:0,leadership:0};
    state.meta.familyLife=state.meta.familyLife&&typeof state.meta.familyLife==="object"?state.meta.familyLife:{reputation:50};
    state.meta.world.inflation=Math.max(1,num(state.meta.world.inflation,1));
    state.meta.world.lifestyle=state.meta.world.lifestyle||"Átlagos";
    state.meta.world.housingLevel=Math.max(0,num(state.meta.world.housingLevel));
    state.meta.world.careerLevel=Math.max(0,num(state.meta.world.careerLevel));
    state.meta.world.countryMood=clamp(num(state.meta.world.countryMood,50));
  }
  const _norm20=normalize;
  normalize=function(){_norm20();ml20Init();if(!state)return;
    state.meta.goals=(state.meta.goals||[]).filter(Boolean).slice(-20);
    state.meta.storylines=(state.meta.storylines||[]).filter(Boolean).slice(-12);
    state.meta.friends=(state.meta.friends||[]).filter(Boolean).slice(-30);
  };

  function ml20Goal(title,text,check,reward){
    if(state.meta.goals.some(g=>g.title===title&&g.done))return;
    let g=state.meta.goals.find(x=>x.title===title);
    if(!g){g={title,text,done:false,reward};state.meta.goals.push(g);}
    if(check()){
      g.done=true;
      if(reward.money){state.money+=reward.money;state.stats.earned+=reward.money;}
      if(reward.happiness)state.happiness=clamp(state.happiness+reward.happiness);
      log("🎯 Cél teljesítve: "+title+".","Cél");
      toast("🎯 "+title);
    }
  }

  function ml20ApplyLivingCosts(){
    const w=state.meta.world;
    const base=state.age<18?0:Math.round((state.job?.[1]||0)*0.18*w.inflation);
    const lifestyle={"Spórolós":0.7,"Átlagos":1,"Kényelmes":1.35,"Luxus":1.9}[w.lifestyle]||1;
    const cost=Math.max(0,Math.round(base*lifestyle));
    if(!cost)return;
    w.yearlyCost=cost;
    if(state.money>=cost){state.money-=cost;state.stats.spent+=cost;}
    else if(state.bank>=cost){state.bank-=cost;state.stats.spent+=cost;}
    else{const missing=cost-state.money-state.bank;state.money=0;state.bank=0;state.debt+=missing;state.happiness=clamp(state.happiness-3);log("A megélhetési költségeket nem tudtad teljesen fedezni: "+fmt(missing)+" Ft tartozás keletkezett.","Gazdaság");return;}
    if(cost>0)log("Megélhetési költség: −"+fmt(cost)+" Ft.","Gazdaság");
  }

  function ml20Inflation(){
    const w=state.meta.world;
    if(state.age>=18)w.inflation=Math.min(2.5,w.inflation*(1+rand(0,5)/100));
    w.countryMood=clamp(w.countryMood+rand(-5,5));
  }

  const ML20_LIFESTYLES=[
    ["Spórolós","Kevesebb kiadás, kisebb komfort."],
    ["Átlagos","Kiegyensúlyozott életvitel."],
    ["Kényelmes","Több kényelem, magasabb költségek."],
    ["Luxus","Magas életszínvonal, nagyon magas költségek."]
  ];
  function ml20SetLifestyle(v){
    if(!ML20_LIFESTYLES.some(x=>x[0]===v))return;
    state.meta.world.lifestyle=v;state.happiness=clamp(state.happiness+(v==="Luxus"?3:1));
    log("Életstílust választottál: "+v+".","Életmód");save();render();mlCloseAfterAction();
  }

  const ML20_SKILLS={communication:"Kommunikáció",finance:"Pénzügy",creativity:"Kreativitás",fitness:"Fittség",leadership:"Vezetés"};
  function ml20Train(k){
    if(!ML20_SKILLS[k]||state.age<8)return;
    const cost=rand(1500,9000);
    if(state.money<cost)return toast("Ehhez "+fmt(cost)+" Ft kell.");
    state.money-=cost;state.stats.spent+=cost;
    state.meta.skills[k]=clamp(num(state.meta.skills[k])+rand(2,6),0,100);
    state.happiness=clamp(state.happiness+1);
    log("Fejlesztetted a "+ML20_SKILLS[k]+" készségedet.","Fejlődés");
    save();render();mlCloseAfterAction();
  }

  function ml20FriendAction(i){
    const f=state.meta.friends[i];if(!f)return;
    const cost=rand(0,8000);if(state.money<cost)return toast("Ehhez nincs elég pénzed.");
    state.money-=cost;state.stats.spent+=cost;f.closeness=clamp(num(f.closeness)+rand(4,10));
    state.happiness=clamp(state.happiness+rand(2,5));state.meta.skills.communication=clamp(num(state.meta.skills.communication)+1);
    log("Időt töltöttél "+f.name+" barátoddal.","Barátság");
    save();render();mlCloseAfterAction();
  }
  function ml20MakeFriend(){
    if(state.age<8)return toast("Ehhez még túl fiatal vagy.");
    const names=["Márk","Dóra","Bálint","Réka","Gergő","Eszter","Noel","Jázmin"];
    const f={name:pick(names)+" "+pick(surnames),age:state.age,closeness:rand(20,55),since:state.age};
    state.meta.friends.push(f);state.happiness=clamp(state.happiness+3);
    state.stats.relationships++;log("Új barátság alakult: "+f.name+".","Barátság");
    save();render();mlCloseAfterAction();
  }

  function ml20CareerEvent(){
    if(state.age<18||!state.job||state.job[0]==="Munkanélküli")return;
    const roll=Math.random();
    if(roll<.12){
      const bonus=Math.round((state.job[1]||0)*(.04+Math.random()*.08));
      state.job=[state.job[0],(state.job[1]||0)+bonus,state.job[2]];
      state.meta.world.careerLevel++;
      state.happiness=clamp(state.happiness+4);state.stats.earned+=bonus;
      log("Előléptettek a munkádban: +"+fmt(bonus)+" éves fizetés.","Karrier");
    }else if(roll<.18){
      state.happiness=clamp(state.happiness-6);
      if(Math.random()<.35){log("Elvesztetted a munkádat.","Karrier");state.job=jobs[0];}
      else log("Nehéz év volt a munkahelyeden.","Karrier");
    }
  }

  const ML20_WORLD_EVENTS=[
    {min:18,weight:5,run:()=>{const n=rand(10000,70000);state.money+=n;state.stats.earned+=n;log("Váratlan visszatérítést kaptál: +"+fmt(n)+" Ft.","Világ");}},
    {min:18,weight:7,run:()=>{const n=rand(5000,45000);state.money=Math.max(0,state.money-n);state.stats.spent+=n;log("Egy váratlan kiadás terhelt: −"+fmt(n)+" Ft.","Világ");}},
    {min:14,weight:5,run:()=>{state.happiness=clamp(state.happiness+rand(2,6));state.meta.world.countryMood=clamp(state.meta.world.countryMood+5);log("Egy jó közösségi időszak feldobta a környezetedet.","Világ");}},
    {min:25,weight:3,run:()=>{if(state.business){const n=rand(30000,160000);state.business.value+=n;log("A piac kedvezett a vállalkozásodnak: +"+fmt(n)+" érték.","Üzlet");}}},
    {min:0,weight:4,run:()=>{state.meta.world.worldEvents++;}}
  ];
  function ml20WorldEvent(){
    const pool=ML20_WORLD_EVENTS.filter(e=>state.age>=e.min);
    if(!pool.length)return;
    const weighted=[];pool.forEach(e=>{for(let i=0;i<e.weight;i++)weighted.push(e)});
    if(Math.random()<.34)pick(weighted).run();
  }

  function ml20FamilyMilestone(){
    (state.children||[]).forEach(ch=>{
      if(!ch.meta)ch.meta={};
      if(ch.age===6&&!ch.meta.school){ch.meta.school=true;log(ch.name+" elkezdte az iskolát.","Család");}
      if(ch.age===14&&!ch.meta.teen){ch.meta.teen=true;log(ch.name+" kamaszkorba lépett.","Család");}
      if(ch.age===18&&!ch.meta.adult){ch.meta.adult=true;log(ch.name+" felnőtt lett.","Család");}
    });
  }

  function ml20Storyline(){
    if(state.meta.storylines.length>=12)return;
    if(state.age===18)state.meta.storylines.push({id:"adult",title:"Az önálló élet kezdete",stage:1});
    if(state.age===30&&state.flags?.married)state.meta.storylines.push({id:"family",title:"Családi korszak",stage:1});
    if(state.age===40&&state.business)state.meta.storylines.push({id:"business",title:"A vállalkozás következő szintje",stage:1});
  }

  function ml20Advance(){
    if(!state||!state.alive)return;
    ml20Init();
    ml20ApplyLivingCosts();
    ml20Inflation();
    ml20CareerEvent();
    ml20WorldEvent();
    ml20FamilyMilestone();
    ml20Storyline();
    ml20Goal("Élj önállóan","Legyen saját felnőtt életviteled.",()=>state.age>=18,{happiness:3});
    ml20Goal("Készségépítő","Fejlessz egy készséget 25 fölé.",()=>Object.values(state.meta.skills).some(v=>v>=25),{money:25000});
    ml20Goal("Családépítő","Legyen gyermeked.",()=>state.children.length>0,{happiness:5});
    ml20Goal("Karrierút","Érj el legalább 3 karrierszintet.",()=>state.meta.world.careerLevel>=3,{money:100000});
  }

  function ml20RenderDepth(){
    const box=$("tab-activities");if(!box||!state)return;
    const skills=Object.entries(state.meta.skills).map(([k,v])=>'<div class="action"><b>'+ML20_SKILLS[k]+'</b><small>'+Math.round(v)+'/100</small><div class="meter"><i style="width:'+v+'%"></i></div><button class="ghost ml20-small" onclick="ml20Train(&quot;'+k+'&quot;)">Fejlesztés</button></div>').join("");
    const friends=state.meta.friends.map((f,i)=>'<div class="list-item"><div><b>🤝 '+mlSafeText(f.name,"Barát")+'</b><br><small class="muted">'+f.age+' éves • közelség '+f.closeness+'%</small></div><button class="ghost" onclick="ml20FriendAction('+i+')">Időtöltés</button></div>').join("")||'<p class="muted">Még nincs külön baráti köröd.</p>';
    const goals=state.meta.goals.map(g=>'<div class="action"><b>'+(g.done?"✅ ":"🎯 ")+mlSafeText(g.title,"Cél")+'</b><small>'+mlSafeText(g.text,"Hosszú távú cél")+'</small></div>').join("")||'<p class="muted">A céljaid idővel jelennek meg.</p>';
    const lifestyle=ML20_LIFESTYLES.map(x=>'<button class="action" onclick="ml20SetLifestyle(&quot;'+x[0]+'&quot;)"><b>'+x[0]+(state.meta.world.lifestyle===x[0]?" ✓":"")+'</b><small>'+x[1]+'</small></button>').join("");
    box.insertAdjacentHTML("beforeend",panel("🧠 Készségek",'<div class="grid">'+skills+'</div>')+
      panel("🤝 Baráti kör",friends+'<button class="action" onclick="ml20MakeFriend()"><b>➕ Új barát</b><small>Ismerkedj meg valakivel.</small></button>')+
      panel("🎯 Hosszú távú célok",'<div class="grid">'+goals+'</div>')+
      panel("🏡 Életmód",'<div class="grid">'+lifestyle+'</div>'));
  }

  const _render20=render;
  render=function(){
    _render20();
    if(!state)return;
    ml20Init();
    setTimeout(()=>{if($("tab-activities")&&!$("tab-activities").querySelector(".ml20-depth")){const marker=document.createElement("div");marker.className="ml20-depth hidden";marker.dataset.ready="1";$("tab-activities").appendChild(marker);ml20RenderDepth();}},0);
  };

  // Replace the visible journal renderer with age-only timeline.
  if(typeof renderMainLifeLog==="function"){
    const _life20=renderMainLifeLog;
    renderMainLifeLog=function(){
      _life20();
      document.querySelectorAll("#lifeLog .thread-node small,#lifeLog .thread-title span").forEach(el=>el.remove());
    };
  }

  // Run world progression once per age advancement.
  const _next20=nextYear;
  nextYear=function(){
    if(!state||!state.alive)return _next20();
    const beforeAge=state.age;
    const result=_next20();
    if(state&&state.age!==beforeAge&&state.alive){
      ml20Advance();
      normalize();save();render();
    }
    return result;
  };

  window.ml20Train=ml20Train;
  window.ml20FriendAction=ml20FriendAction;
  window.ml20MakeFriend=ml20MakeFriend;
  window.ml20SetLifestyle=ml20SetLifestyle;

  // Make children develop and receive age-appropriate pocket money opportunities.
  const _child20=childAction;
  childAction=function(...args){
    const r=_child20(...args);ml20Init();return r;
  };

  ml20Init();
})();

/* MegaLife v0.2.2 — NPC character system + modal decisions + relationship hub */
(function(){
  const BG=[
    "Átlagos családban nőtt fel, ahol a tanulást fontosnak tartották.",
    "Sokat költözött gyerekkorában, ezért könnyen alkalmazkodik.",
    "Nagy, összetartó családból érkezett, erős családi kötődésekkel.",
    "Csendes környezetben nőtt fel, és korán önállósodott.",
    "Sportos közegben nőtt fel, ahol a kitartást tanulta meg.",
    "Kreatív családból jött, gyerekként sokat alkotott.",
    "Anyagi nehézségeket is megélt, ezért óvatos a pénzzel.",
    "Jómódú háttérből indult, de szeretne saját lábára állni."
  ];
  const NPC_FIRST=["Anna","Emma","Lili","Nóra","Luca","Hanna","Sára","Zsófia","Dóra","Réka","Eszter","Jázmin","Bence","Dávid","Máté","Levente","Ádám","Marcell","Balázs","Péter","Márk","Bálint","Gergő","Noel"];
  const NPC_ACTIONS=[["💬 Beszélgetés","talk"],["☕ Találkozás","hangout"],["🎁 Ajándék","gift"],["✨ Dicséret","compliment"],["⚡ Vita","argue"]];
  function npcName(){return pick(NPC_FIRST)+" "+pick(surnames)}
  function npcStats(){return{health:rand(35,95),happiness:rand(30,90),smarts:rand(25,95),looks:rand(25,95),discipline:rand(20,90),karma:rand(25,85),communication:rand(20,95),finance:rand(15,90),creativity:rand(20,95),fitness:rand(20,95),leadership:rand(15,90)}}
  function npcCreate(type="Ismerős",age=state.age){
    const a=Math.max(8,Math.min(100,Math.round(Number(age)||state.age)+rand(-3,3)));
    return{id:"npc-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,7),name:npcName(),gender:pick(["female","male","neutral"]),age:a,type,closeness:type==="Barát"?rand(45,70):rand(15,48),trust:rand(25,75),status:pick(["tanuló","dolgozó","szabadúszó","pályakezdő","vállalkozó","álláskereső"]),background:pick(BG),stats:npcStats(),knownAge:state.age,lastSeenAge:state.age,alive:true}
  }
  function npcNormalize(){
    if(!state)return;
    state.meta=state.meta||{};state.meta.characters=Array.isArray(state.meta.characters)?state.meta.characters:[];
    state.meta.characters=state.meta.characters.filter(Boolean).slice(-60);
    state.meta.characters.forEach(c=>{c.id=String(c.id||("npc-"+Math.random().toString(36).slice(2)));c.name=mlSafeText(c.name,"Ismeretlen");c.type=String(c.type||"Ismerős");c.age=Math.max(0,Math.round(Number(c.age)||state.age));c.closeness=clamp(Number(c.closeness)||20);c.trust=clamp(Number(c.trust)||50);c.background=mlSafeText(c.background,"Átlagos háttérből érkezett.");c.stats=c.stats&&typeof c.stats==="object"?c.stats:npcStats();c.alive=c.alive!==false});
    if(!state.meta.characters.length){
      const parents=(state.family?.parents||[]);parents.forEach((p,i)=>{const c=npcCreate(i===0?"Család • Apa":"Család • Anya",Math.max(18,state.age+rand(24,36)));c.name=mlSafeText(p.name,c.name);c.closeness=rand(55,80);c.trust=rand(55,90);state.meta.characters.push(c)});
      const count=Math.min(3,Number(state.family?.siblings)||0);for(let i=0;i<count;i++)state.meta.characters.push(npcCreate("Család • Testvér",Math.max(6,state.age+rand(-4,4))));
      (state.children||[]).slice(0,6).forEach(ch=>{const c=npcCreate("Család • Gyermek",Number(ch.age)||0);c.name=mlSafeText(ch.name,c.name);c.closeness=rand(55,85);state.meta.characters.push(c)});
    }
    if(state.age>=8&&state.meta.characters.length<4&&Math.random()<.75)state.meta.characters.push(npcCreate("Ismerős",state.age));
  }
  const _norm22=normalize;
  normalize=function(){_norm22();if(state)npcNormalize()};
  function npcFind(id){return state?.meta?.characters?.find(c=>c.id===id)}
  function npcIsFamily(c){return String(c?.type||"").startsWith("Család")}
  function npcInteract(id,action){
    const c=npcFind(id);if(!c||!c.alive)return toast("Ez a karakter már nem érhető el.");
    const cost=action==="hangout"?rand(0,6000):action==="gift"?rand(1000,12000):0;
    if(cost>state.money)return toast("Ehhez nincs elég pénzed.");
    if(cost){state.money-=cost;state.stats.spent+=cost}
    let delta=0,msg="";
    if(action==="talk"){delta=rand(3,9);c.trust=clamp(c.trust+rand(2,6));msg="Beszélgettél vele."}
    if(action==="hangout"){delta=rand(6,14);state.happiness=clamp(state.happiness+rand(2,6));msg="Találkoztatok és együtt töltöttétek az időt."}
    if(action==="gift"){delta=rand(5,12);c.trust=clamp(c.trust+rand(3,8));msg="Meglepted egy ajándékkal."}
    if(action==="compliment"){delta=rand(2,8);c.happiness=clamp(Number(c.happiness||50)+rand(1,5));msg="Meglepően jól fogadta a dicséretedet."}
    if(action==="argue"){delta=-rand(5,15);c.trust=clamp(c.trust-rand(3,10));state.happiness=clamp(state.happiness-2);msg="Összevesztetek."}
    c.closeness=clamp(c.closeness+delta);c.lastSeenAge=state.age;log(msg+" "+c.name+" kapcsolat: "+Math.round(c.closeness)+"%.","Kapcsolat");save();render();mlCloseTabsAfterAction();
  }
  function npcNew(type="Ismerős"){
    if(state.age<8)return toast("8 éves kortól kezdesz önállóan új ismeretségeket kialakítani.");
    if(state.meta.characters.length>=60)return toast("Már nagyon sok ismert karaktered van.");
    const c=npcCreate(type,state.age);state.meta.characters.push(c);state.stats.relationships++;state.happiness=clamp(state.happiness+2);log("Megismerted "+c.name+" karakterét. "+c.background,"Kapcsolat");save();render();mlCloseTabsAfterAction();
  }
  function npcDecision(){
    if(!state||state.age<8)return false;
    const pool=state.meta.characters.filter(c=>c.alive&&c.closeness>=35);if(!pool.length)return false;
    const c=pick(pool);
    const situations=[
      {title:"🤝 Egy ismerős megkeresett",text:c.name+" segítséget kér tőled egy fontos ügyben.",a:[["💬 Segítek neki",()=>{c.closeness=clamp(c.closeness+9);c.trust=clamp(c.trust+8);state.happiness=clamp(state.happiness+3);return"Segítettél "+c.name+"-nek."}],["🙅 Most nem vállalom",()=>{c.closeness=clamp(c.closeness-3);return"Most nem tudtál segíteni neki."}]]},
      {title:"☕ Találkozóra hívott",text:c.name+" szeretne találkozni veled. Mit teszel?",a:[["❤️ Találkozom vele",()=>{c.closeness=clamp(c.closeness+10);state.happiness=clamp(state.happiness+5);return"Találkoztál "+c.name+"-nel."}],["📅 Későbbre halasztom",()=>{c.closeness=clamp(c.closeness-2);return"Most elhalasztottad a találkozót."}]]},
      {title:"💬 Fontos beszélgetés",text:c.name+" őszintén megoszt veled valamit a múltjáról.",a:[["👂 Meghallgatom",()=>{c.trust=clamp(c.trust+12);c.closeness=clamp(c.closeness+7);return"Meghallgattad "+c.name+" történetét."}],["➡️ Témát váltok",()=>{c.trust=clamp(c.trust-5);return"Nem szerettél volna belemenni a témába."}]]}
    ];
    const s=pick(situations);
    $("modalBody").innerHTML='<div class="eyebrow">KARAKTER • DÖNTÉS</div><h2>'+s.title+'</h2><p class="muted">'+mlSafeText(c.name,"Ismerős")+": "+mlSafeText(s.text,"Mit teszel?")+'</p>'+s.a.map((x,i)=>'<button class="choice" onclick="mlNpcDecisionResolve('+i+')">'+x[0]+'</button>').join("");
    window.__mlNpcDecision={c,s};$("modal").classList.remove("hidden");return true;
  }
  function mlNpcDecisionResolve(i){const x=window.__mlNpcDecision;if(!x?.s?.a?.[i])return;const msg=x.s.a[i][1]();log(msg,"Döntés • "+x.c.name);window.__mlNpcDecision=null;$("modal").classList.add("hidden");normalize();save();render();mlCloseTabsAfterAction()}
  function renderRelationshipHub(){
    const box=$("tab-relations");if(!box||!state)return;npcNormalize();
    const family=state.meta.characters.filter(npcIsFamily),friends=state.meta.characters.filter(c=>!npcIsFamily(c)&&c.closeness>=35),known=state.meta.characters.filter(c=>!npcIsFamily(c)&&c.closeness<35);
    const card=c=>{const acts=NPC_ACTIONS.map(a=>'<button class="ghost npc-action" onclick="mlNpcInteract(&quot;'+c.id+'&quot;,&quot;'+a[1]+'&quot;)">'+a[0]+'</button>').join("");return'<div class="list-item npc-card"><div class="npc-main"><div class="npc-avatar">'+mlSafeText(c.name,"?").charAt(0).toUpperCase()+'</div><div><b>'+mlSafeText(c.name,"Ismeretlen")+'</b> <span class="pill">'+mlSafeText(c.type,"Ismerős")+'</span><br><small class="muted">'+c.age+' éves • kapcsolat '+Math.round(c.closeness)+'% • bizalom '+Math.round(c.trust)+'%</small><small class="npc-stats">🧠 '+Math.round(Number(c.stats?.smarts)||0)+' • 💬 '+Math.round(Number(c.stats?.communication)||0)+' • 💰 '+Math.round(Number(c.stats?.finance)||0)+' • 🎨 '+Math.round(Number(c.stats?.creativity)||0)+'</small><small class="npc-bg">'+mlSafeText(c.background,"Átlagos háttér.")+'</small></div></div><div class="npc-actions">'+acts+'</div></div>'};
    const familyCards=family.map(card).join("")||'<p class="muted">A családtagjaid még nincsenek részletesen felvéve.</p>';
    const friendCards=friends.map(card).join("")||'<p class="muted">Még nincs közeli barátod. Ismerkedj meg valakivel.</p>';
    const knownCards=known.map(card).join("")||'<p class="muted">Nincs új ismerősöd.</p>';
    const romantic=state.relationships.map((x,i)=>'<div class="list-item"><div><b>'+mlSafeText(x.name,"Ismeretlen")+'</b> <span class="pill">'+mlSafeText(x.type,"Kapcsolat")+'</span><br><small class="muted">'+x.age+' éves • kapcsolat '+Math.round(x.closeness)+'%</small></div><button class="ghost" onclick="interact('+i+')">Interakció</button></div>').join("")||'<p class="muted">Még nincs romantikus kapcsolatod.</p>';
    const familyActions='<div class="grid"><button class="action" onclick="dateAction()"><b>❤️ Randi</b><small>Új romantikus kapcsolat.</small></button><button class="action" onclick="proposal()"><b>💎 Eljegyzés</b><small>Magas kapcsolat esetén.</small></button><button class="action" onclick="marryAction()"><b>💍 Házasság</b><small>Megfelelő kapcsolat esetén.</small></button><button class="action" onclick="childAction()"><b>👶 Gyermek</b><small>Gyermekvállalás.</small></button></div>';
    const ask=state.age>=6&&state.age<=17?'<button class="action" onclick="requestPocketMoney()"><b>💰 Zsebpénz</b><small>Kérdezd meg a szüleidet, mint egy valódi döntési helyzetben.</small></button>':"";
    box.innerHTML=panel("👨‍👩‍👧 Család",familyCards+ask)+panel("🤝 Barátok",friendCards+'<button class="action" onclick="mlNpcNew(&quot;Barát&quot;)"><b>➕ Új barát</b><small>Random karakter, random háttérrel és statokkal.</small></button>')+panel("🧑 Ismerősök",knownCards+'<button class="action" onclick="mlNpcNew(&quot;Ismerős&quot;)"><b>➕ Új ismerős</b><small>Találkozz egy új, generált karakterrel.</small></button>')+panel("❤️ Romantikus kapcsolatok",romantic)+panel("💍 Családi élet",familyActions);
  }
  const _renderRelations22=renderRelations;renderRelations=function(){_renderRelations22();renderRelationshipHub()};
  const _annual22=annualEvent;annualEvent=function(){_annual22();if(state&&state.age>=8&&Math.random()<.45){if(state.meta.characters.length<60)state.meta.characters.push(npcCreate("Ismerős",state.age));const pool=state.meta.characters.filter(x=>x.alive&&!npcIsFamily(x));if(pool.length){const c=pick(pool);c.lastSeenAge=state.age;log("Véletlen találkozás: "+c.name+" felbukkant az életedben.","Karakter");c.closeness=clamp(c.closeness+rand(1,5))}}};
  const _next22=nextYear;nextYear=function(){if(!state||!state.alive)return _next22();if(state.meta?.activeDecision||$("modal")&&!$("modal").classList.contains("hidden"))return toast("Előbb válaszd ki, mit teszel.");const saved=localStorage.getItem("megalife-event-settings");try{const cfg=mlEventSettings();localStorage.setItem("megalife-event-settings",JSON.stringify({...cfg,choiceEvents:0}));const result=_next22();if(saved===null)localStorage.removeItem("megalife-event-settings");else localStorage.setItem("megalife-event-settings",saved);if(state&&state.alive){if(Math.random()<.5)npcDecision();normalize();save();render()}return result}catch(e){if(saved===null)localStorage.removeItem("megalife-event-settings");else localStorage.setItem("megalife-event-settings",saved);throw e}};
  window.mlNpcInteract=npcInteract;window.mlNpcNew=npcNew;window.mlNpcDecisionResolve=mlNpcDecisionResolve;window.mlNpcDecision=npcDecision;npcNormalize();
})();
