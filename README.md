# MegaLife

A MegaLife egy eredeti, böngészőben futó élet-szimulátor, amely a life-sim műfajból merít ihletet. Nem használ más játékok forráskódját vagy assetjeit.

## Release

**Jelenlegi stabil fejlesztési ág: v0.1.9**.

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
