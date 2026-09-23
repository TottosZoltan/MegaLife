# MegaLife

A MegaLife egy eredeti, böngészőben futó élet-szimulátor, amely a life-sim műfajból merít ihletet. Nem használ más játékok forráskódját vagy assetjeit.

## Release

**Jelenlegi stabil fejlesztési ág: v0.5.7**.

## Jelenlegi rendszerek

- karaktergenerálás, ország, nem, név
- életkor és éves események
- egészség, boldogság, intelligencia, kinézet, fegyelem, karma
- család, szülők, testvérek, kapcsolatok
- randizás, házasság, gyermekvállalás
- iskola, egyetem, diplomák
- állások, fizetések, előléptetés
- készpénz, bank, hitel, tartozás
- befektetés és szerencsejáték
- ingatlan, autó, luxuscikk, háziállat
- utazás, közösségi média
- bűncselekmények és jogi következmények
- véletlen élethelyzetek
- öregedés és halál
- achievementek és életstatisztikák
- localStorage automatikus mentés
- reszponzív, mobilbarát UI
- PWA manifest

## Futtatás

A projekt statikus: az index.html megnyitásával vagy GitHub Pages-szel futtatható.

## Tesztelés

A repository tartalmaz statikus release smoke teszteket, amelyek ellenőrzik a JavaScript szintaxist, a verziókonzisztenciát, a kritikus DOM-elemeket és a fő játékrendszerek jelenlétét. A teljes böngészős és valódi mobil-eszközös teszt továbbra is külön manuális ellenőrzést igényel.

## Következő fejlesztési irányok

A játék további verzióiban bővíthető részletesebb családfával, vállalkozásokkal, több száz eseménnyel, minijátékokkal, karrierágakkal, tárgyakkal és több mentési slottal.

### v0.1.5
- új, elkülönített teljes képernyős oldalak az alsó/gyorsmenüs gombokhoz
- minden belső oldal saját sticky fejlécet kapott bal oldali vissza és jobb oldali X gombbal
- a belső oldalak görgetése független a főképernyőtől
- pull-to-refresh kizárólag a fő életképernyőn aktív
- fő naplóban biztonságosabb pull gesztuskezelés, amely nem zavarja a belső napló görgetését
- egységesebb mobil oldalközök, keretek és olvashatóbb akciógombok


### v0.1.6
- eltávolítva a régi, legacy vissza gomb vizuális maradványa
- a sticky fejléc most teljes szélességben, a képernyő tetejéhez igazítva jelenik meg
- safe-area támogatás az iPhone felső kivágásához
- a jobb oldali X és a bal oldali vissza gomb nem csúszik be a tartalom alá


### v0.1.7
- javítva a teljes képernyős oldalak navigációja
- a sticky bal oldali vissza és jobb oldali X gomb delegált eseménykezelést kapott
- a navigációs gombok minden újrarenderelés után is kattinthatók maradnak
- az akciók megbízhatóbban visszatérnek a fő életképernyőre
- a bezárás törli az előző oldal állapotát is, így nem marad beragadt overlay
- a sticky fejléc kattintható területe külön, magasabb réteget kapott mobilon


### v0.1.8
- az életkor mellől eltűnt a felesleges „•” évjelölés
- a napló fejlécében külön, rendezett blokkba került az aktuális év
- az ÉLETNAPLÓ fejléc új, modernebb vizuális sávot kapott
- a „vissza az előző oldalra” gyorsgomb a napló jobb alsó részébe került
- mobilon a fő életképernyő a rendelkezésre álló magasságot jobban kihasználja


### v0.1.9
- mobilon bekerült egy dedikált, későbbi hirdetésekhez fenntartott bannerhely az állapotjelző alatt
- a hirdetési hely jelenleg csak vizuális placeholder, nincs benne külső hirdetési szolgáltatás
- a hely mérete és pozíciója elő van készítve későbbi reklámrendszer-integrációhoz

## Roadmap

### 1. Következő kör — alap játékmenet stabilizálása
- mobil UI további finomhangolása és valódi készülékeken történő ellenőrzése
- akciók és életkorfüggő korlátozások teljes körű auditja
- éves események és döntési események bővítése, jobb előfeltételekkel
- mentések és élet-slotok megbízhatóságának további javítása
- duplikált/legacy JavaScript részek fokozatos összevonása

### 2. Életmélység
- részletesebb családfa és családtagok saját életútja
- barátságok, konfliktusok és kapcsolati mérföldkövek
- részletesebb iskola- és karrierrendszer
- több szakma, előléptetés, kirúgás és munkahelyi esemény
- egészségügyi és élethelyzeti események nagyobb változatossága

### 3. Gazdaság és világ
- részletesebb lakhatás és ingatlanrendszer
- vállalkozások fejlesztése és több passzív jövedelemforrás
- infláció, megélhetési költségek és életstílus-költségek
- több ország, utazási következmény és kulturális esemény

### 4. Tartalom és újrajátszhatóság
- jelentősen nagyobb esemény-adatbázis
- ritka, többéves történetszálak
- több minijáték és választható tevékenység
- achievementek és hosszú távú célok bővítése

### 5. PWA és bevételi infrastruktúra
- mobil ikon és PWA assetek továbbfejlesztése
- a most létrehozott reklámhely technikai előkészítése és később hirdetési szolgáltató bekötése
- reklámok csak kontrollált helyeken, a játékmenet és az olvashatóság megőrzésével
- opcionális prémium/ads-free irány későbbi mérlegelése

### 6. Nagyobb hosszú távú fejlesztések
- karakterek és családtagok részletesebb vizuális profiljai
- több világállapot és társadalmi/gazdasági esemény
- statisztikák, életút-összehasonlítás és részletesebb élettörténet
- teljesítményoptimalizálás nagyobb mentésekhez és hosszú játékidőhöz


### v0.2.0 — MegaLife Life Depth Update
- az **aktuális év kijelzése teljesen kikerült a felhasználói felületből**; a játékos számára a karakter életkora a releváns időmutató
- a napló vizuális idővonaláról is eltűnt az évszám, így az események életkor szerint olvashatók
- bevezetésre került egy tartós **világállapot**: infláció, megélhetési költség, életstílus és környezeti hangulat
- életkorfüggő megélhetési költségek és életstílus-költségek
- dinamikusabb karrier: előléptetés, nehezebb munkahelyi időszakok és esetleges állásvesztés
- bővített gazdasági/világesemények
- családi mérföldkövek a gyermekek fejlődéséhez
- baráti kör külön rendszerrel, új barátokkal és közös programokkal
- új fejleszthető készségek: kommunikáció, pénzügy, kreativitás, fittség, vezetés
- hosszú távú célrendszer és céljutalmak
- életstílus-rendszer: spórolós, átlagos, kényelmes, luxus
- többéves életút-szálak alapjai 18, 30 és 40 éves mérföldkövekkel
- a korábbi döntési és következményrendszerre ráépítve több, egymásra épülő élethelyzet
- a meglévő reklámhely megmaradt későbbi reklámszolgáltató-integrációhoz
- a fejlesztés során a meglévő mentéseket kompatibilisen migráló metaadatok használata
- a roadmap fő területei közül az életmélység, gazdaság, karrier, család, újrajátszhatóság és bevételi infrastruktúra alapjai bekerültek; a további bővítés ezekre épül

### v0.2.0 dokumentációs megjegyzés
A MegaLife jelenlegi kódalapja több korábbi iterációból áll, ezért az új rendszerek kompatibilitási rétegen keresztül kapcsolódnak a meglévő játékmenethez. A következő karbantartási kör célja a régi/duplikált függvények fokozatos összevonása, hogy az új élet-szimulációs rendszerek hosszú távon is könnyebben bővíthetők legyenek.


### v0.2.1 — kritikus renderelési hibajavítás
- javítva a főképernyő teljes renderelését blokkoló, már nem létező `yearText` DOM-elem hivatkozás
- az állapotjelző ismét megjelenik és frissül
- az életnapló és az események ismét kirajzolódnak
- a kapcsolatok/karrier/pénz/több fülek tartalma ismét renderelődik
- a feleslegessé vált aktuális év UI-hivatkozások az összes render-útvonalból eltávolítva
- a release smoke teszt verzióellenőrzése javítva v0.2.1-re


### v0.2.2 — generált karakterek, kapcsolati hub és döntési helyzetek
- a döntési helyzetek a zsebpénzkéréshez hasonló modális kérdésként jelennek meg, és a játékos választása nélkül nem halad tovább az év
- a Kapcsolatok oldal központi kapcsolati hub lett: család, barátok, ismerősök és romantikus kapcsolatok külön blokkokban
- a családtagokkal és ismert karakterekkel beszélgetés, találkozás, ajándék, dicséret és vita is indítható
- bekerült a generált NPC-rendszer: random név, életkor, háttértörténet, státusz és statok
- a karakterek kapcsolat-, bizalom- és háttéradatai mentődnek
- random éves eseményként karakterek bukkanhatnak fel újra
- a régi mentések automatikusan kapnak karakter-adatokat a családtagokból és új ismerősökből
- ez a réteg későbbi NPC-karrier, saját család, konfliktus, barátság és romantikus életutak alapja

### v0.5.7 — Living Characters
- a fő karakter és az NPC-k most ténylegesen látható, eredeti SVG karakterként jelennek meg
- moduláris kinézet: bőrtónus, arcforma, hajforma, hajszín, szemszín, szemüveg, szakáll, testalkat, ruha és kiegészítő
- minden karakter saját, mentett megjelenést kap, ezért ugyanaz az NPC később is felismerhető
- a régi mentésekhez automatikusan létrejön a hiányzó karaktermegjelenés
- az NPC-k ugyanazt a karaktermotort használják, mint a játékos
- a kapcsolati kártyákon már nem betűkör, hanem valódi karakterportré látható
- a fő napló fejlécéből kikerült az „ÉLETNAPLÓ” felirat és az életkor melletti címke; maga a napló vizuális lapként megmarad
- az „ÁLLAPOT” felirat eltűnt, az állapotértékek megmaradtak
- a vizuális rendszer alapot ad későbbi ruhákhoz, életkor-változásokhoz, családi hasonlósághoz és részletesebb karaktercsomagokhoz


### v0.5.7 — NPC életutak
- az ismert NPC-k évente saját életutat is követnek: öregedés, tanulás, munka és státuszváltozás
- bizonyos karaktereknél párkapcsolat, házasság és saját gyermekek is kialakulhatnak
- a karakterek életútja nem csak a játékos körül történik, hanem a háttérben is továbbhalad
- a családba később bekerülő gyermekek automatikusan kapnak saját karakterprofilt és vizuális megjelenést


### v0.5.7 — Kategorizált interakciós rendszer
- az Egyebek lap most kategóriahubként működik
- a hobbi külön aloldal lett: Egyebek → Hobbik → saját/új hobbi
- a legtöbb interakció kategóriákba és alkategóriákba került
- Karrier: Munka / Tanulás / Vállalkozás
- Pénzügyek: Bank / Befektetések / Hitelek / Szerencsejáték
- Vagyon: Ingatlan / Járművek / Luxus
- Kapcsolatok: Család / Barátok / Ismerősök / Romantika
- Egyebek: Mindennapok / Hobbik / Utazás / Közösségi élet / Háziállatok / Bűnözés
- az aloldalakon belül marad a játékos, nem dob vissza automatikusan a főképernyőre


### v0.5.7 — Kapcsolati osztályok és HUD navigáció
- a felső HUD kapott egy Menü gombot a teljes oldalas lapokból való visszalépéshez
- az aloldalak saját visszanyilait eltávolítottuk
- az Egyebek/Karrier/Pénzügyek/Vagyon/Kapcsolatok kategóriaoldalai teljes oldalas menüként működnek
- az NPC-k három világos társadalmi osztályba kerülnek: Ismerős, Barát, Család
- az Ismerős nem lesz automatikusan Barát attól, hogy magasabb a kapcsolatérték
- az Ismerős kártyán külön Barátság döntés jelenik meg, amellyel a játékos döntheti el, hogy elmélyíti-e a kapcsolatot
- új véletlen karakterek Ismerősként kerülnek be
- a család külön kezelt: Apa és testvérek a főszereplő vezetéknevét viselik, Anya saját vezetéknevét
- régi mentéseknél a családi neveket automatikusan korrigáljuk


### v0.5.7 — HUD navigáció és karakterosztályok
- a külön oldalak felső visszanyila kikerült; a HUD-ban egyetlen Menü/Vissza gomb kezeli a navigációt
- fő kategóriából a HUD gomb visszavisz a főképernyőre
- alkategóriából a HUD gomb egy szinttel visszalép a szülő kategóriába
- Kapcsolatok / Karrier / Pénz / Vagyon / Egyebek ugyanígy hierarchikus navigációt használnak
- minden nem család karakter alapértelmezetten Ismerős
- Ismerős csak kapcsolatépítéssel válhat Baráttá
- a család külön osztály: apa és testvérek a főszereplő vezetéknevét viselik
- az anya saját vezetéknevet/anyaági családnevet használ


### v0.5.7 — Navigációs javítás
- a főképernyő frissítése többé nem nyitja meg automatikusan az Egyebek menüt
- a fő HUD-ban lévő plusz/Több gomb csak akkor nyitja meg az Egyebek kategóriaoldalt, amikor ténylegesen megnyomod
- a fő kategóriák tetején nincs külön visszanyíl
- a HUD jobb felső vezérlője gyökér kategóriánál Menü, alkategóriánál Vissza
- gyökér kategóriából a Vissza a fő életképernyőre visz
- alkategóriából a Vissza pontosan egy szinttel lép feljebb
- az NPC-k szigorúan Ismerős / Barát / Család osztályba kerülnek
- az ismerős csak tudatos döntéssel válhat baráttá
- apa, testvérek és gyermekek a főszereplő vezetéknevét kapják
- az anya külön leánykori vezetéknevet használ


### v0.5.7 — HUD navigáció javítása
- a fő HUD vezérlője nem „Menü”, hanem „Kilépés”
- fő kategóriában × jelzi, hogy visszatérés történik a fő életképernyőre
- alkategóriában ‹ jelzi az egy szinttel feljebb lépést
- a Kapcsolatok → Család/Barátok/Ismerősök/Romantika és a többi alkategória visszalépése szülő kategóriába vezet
- frissítés után a játék mindig a fő életképernyőn marad, az Egyebek nem nyílik meg automatikusan
- a régi, oldalon belüli vissza/menü chrome eltávolításra került


### v0.5.7 — Navigáció javítás
- frissítéskor és mentés betöltésekor mindig a fő életképernyő marad látható
- az Egyebek csak a HUD ☰ gombjának explicit megnyomására nyílik meg
- a kategóriaoldalak felső visszanyila megszűnt
- a HUD bal felső gombja kezeli a visszalépést: kategória → fő kategória → főképernyő
- a fő kategóriákból a visszalépés közvetlenül a főképernyőre visz
- a korábbi render-átirányítások felül lettek írva, hogy ne nyissanak meg menüt frissítéskor


### v0.5.7 — Navigáció stabilizálás
- a plusz gomb kizárólag az Egyebek kategóriahubot nyitja meg
- frissítés után nem marad megnyitott almenüállapot
- a felső vissza nyíl közvetlenül a főképernyőre visz a gyökér kategóriákból
- alkategóriából a vissza nyíl egy szinttel feljebb lép
- a felső fejlécben csak a szükséges navigáció marad


### v0.5.7 — Főoldal + hierarchikus menürendszer
- frissítéskor, belépéskor és kilépéskor mindig a fő életképernyő nyílik meg
- a fő HUD-ban egyetlen vissza/bezárás gomb kezeli a navigációt
- főoldal → kategória → alkategória → egyedi karakter/interakció útvonal készült
- Kapcsolatok → Család / Barátok / Ismerősök / Romantika
- Karrier → Munka / Tanulás / Vállalkozás
- Pénzügyek → Bank / Befektetések / Hitelek / Szerencsejáték
- Vagyon → Ingatlan / Járművek / Luxus
- Egyebek → Mindennapok / Hobbik / Utazás / Közösségi élet / Háziállatok / Bűnözés
- a kapcsolatokon belül minden karakter külön megnyitható és interaktálható
- családi névlogika javítva: apa, testvérek és gyerekek a főszereplő vezetéknevét kapják; az anya külön leánykori vezetéknevet használ


### v0.5.7 — Mobil navigáció javítás
- frissítés után mindig a fő életképernyő nyílik meg
- az Egyebek nem nyílik meg automatikusan
- a mobil HUD felső visszanyila kezeli a teljes hierarchiát
- gyökérkategóriából a visszanyíl a főoldalra visz
- alkategóriából egy szinttel lép vissza
- megszűnt a régi kategória-vissza gomb és a duplikált felső navigáció
- a „Több”/Egyebek belépés csak explicit felhasználói műveletre történik


### v0.5.7 — Egyebek gyökéroldal eltávolítva
- a korábbi Egyebek/Több gyökérmenü nem jelenik meg többé
- az elavult activities gyökérútvonal blokkolva van, így frissítés vagy régi hivatkozás sem tudja megnyitni
- a mobil alsó menüből kikerült a Több/Egyebek elem
- a felső HUD-os visszalépés marad az egyetlen navigációs visszalépési pont
