# Tulajdonosi műhelyfotók – válogatás és elhelyezés

Forrás: a tulajdonos telefonjának „1 Night Vision Service” mappája (52 fájl), átnézve 2026-11-15-én, valamint a korábbi PR #3 három csatolmánya. Minden képet tartalom alapján néztünk végig; egy fotóhoz csak az a szolgáltatás kapcsolódik, amely ténylegesen felismerhető rajta. Nem írtunk hozzá ügyféltörténetet, mérési eredményt vagy referenciaállítást.

## Munkafolyamat

- Eredetiek változtatás nélkül: `media/originals/` (nem kerül ki a weboldalra). A korábbi `public/assets/workshop/*.jpg` fájlok is ide kerültek eredeti nevükkel.
- Katalógus (alt szöveg HU/RO/EN, címke, fókuszpont, elhelyezés): `media/photos.json`.
- Webes változatok: `python3 scripts/optimize-photos.py` → `public/assets/photos/<slug>-<szélesség>.{avif,webp}` + egy JPEG tartalék a legnagyobb méretben, valamint `src/photo-variants.json`. Csak átméretezés (arány megtartva, nincs vágás, retus vagy vízjel-eltávolítás); az EXIF/GPS metaadatok a webes változatokból kimaradnak.
- Megjelenítés: `<picture>` AVIF → WebP → JPEG, `srcset`/`sizes`, valós `width`/`height` (nincs elrendezés-ugrás), `object-fit: cover` fotónkénti fókuszponttal (generált `assets/photo-positions.css`, inline stílus nélkül). A teljes kép a nagyítóban vágás nélkül látszik.
- Hero: `fetchpriority="high"`, eager betöltés és `<link rel="preload">`; a többi kép `loading="lazy"`.
- Galéria: natív `<dialog>` nagyító; egér, billentyű (←/→, Home/End, Esc, Tab a dialóguson belül), mobilon lapozás; bezáráskor a fókusz visszatér. JavaScript nélkül a hivatkozás a teljes JPEG-et nyitja meg.

## Melyik eredeti fájl hova került

| Eredeti fájl | Webes név (slug) | Tartalom | Hely |
|---|---|---|---|
| 1000115238.jpg (PR #3) | headlight-adjustment | LED-fényszóró beállítása fénymérő berendezéssel | Főoldali hero; LED / Matrix szolgáltatási oldal; galéria 03 |
| 1000115247.jpg (PR #3) | headlight-beam-check | Világító fényszóró a beállítóberendezés mellett | Galéria 04 |
| IMG-20261018-WA0012.jpg | adas-calibration-target | MAHLE TechPRO Digital ADAS kalibrálókijelző, kerékre szerelt mérőfejek | ADAS szolgáltatási oldal; galéria 01 |
| IMG-20261018-WA0009.jpg | acc-radar-calibration-screen | MAHLE TechPRO tablet: statikus elülső radarkalibrálás lépése | ACC szolgáltatási oldal; galéria 02 |
| IMG-20261115-WA0024.jpg | workshop-lift-bay | Emelőn álló jármű alváza, szerszámfal, szerelőpadok | Műhelybemutató („A műhely mögött”); galéria 05 |
| IMG-20261115-WA0017.jpg | gearbox-mechatronic-unit | Kiszerelt váltóvezérlő (mechatronikai) egység | Galéria 06 |
| IMG-20261115-WA0007.jpg | gearbox-shafts | Szétszerelt váltó tengelyei, fogaskerekei | Galéria 07 |
| IMG-20261115-WA0011.jpg | gearbox-on-workbench | Kiszerelt váltóegység a munkapadon | Galéria 08 |
| IMG-20261115-WA0013.jpg | gearbox-open-case | Nyitott váltóház tengelyekkel | Galéria 09 |
| IMG-20261115-WA0036.jpg | gearbox-housing | Váltóház a szerelőkocsin | Galéria 10 |
| IMG-20261115-WA0014.jpg | gearbox-control-unit-installed | Váltó vezérlőegysége a járműben, alulnézet | Galéria 11 |
| IMG-20261115-WA0034.jpg | gearbox-assembly-work | Munka a nyitott váltón a szerelőpadnál | Galéria 12 |
| 1000136612.jpg (PR #3) | – | Ugyanaz a jelenet, mint IMG-20261018-WA0012, kisebb felbontásban | Csak megőrizve; helyette a nagyobb felbontású változat szerepel |

## Főoldali szolgáltatás-slider

A főoldal jobb oldalán (a korábbi álló hero kép helyén) a hat szolgáltatás lapozható sorban: LED / Matrix → ADAS → ACC → Hunter 3D → kamerakalibrálás → diagnosztika. Minden dián a szolgáltatás saját, valódi fotója szerepel (a második kör óta Hunter 3D, kamerakalibrálás és diagnosztika is); ha egy szolgáltatásnak nincs fotója, a dia ikont és „Fotó hamarosan” feliratot mutat helyettesítő kép nélkül. Az első dia képe a gyorsan töltődő hero kép, a többi lusta betöltésű.

Működés: CSS scroll-snap sáv (JS nélkül is lapozható, mobilon húzható); JS-sel előző/következő gomb, pontok, szünet/lejátszás gomb, 5,5 mp-es automatikus lapozás, amely egérrel vagy fókusszal a sliderre állva, rejtett lapon és „csökkentett mozgás” beállításnál szünetel. Billentyű: ←/→ a sávon.

## Bővítés a teljes telefonos mappából (2026-11-15, második kör)

A tulajdonos a teljes „1 Night Vision Service” mappát átmásolta (306 kép, 16 videó, 3 PDF). A 255 új képből 173 valódi `IMG-*` fotót egyenként, kontaktlapokon néztünk át, a bal alsó sarkot külön ellenőrizve.

| Eredeti fájl | Webes név (slug) | Tartalom | Hely |
|---|---|---|---|
| IMG-20260511-WA0011.jpg | hunter-alignment-lift | Jármű a futóműállító emelőn, Hunter állomással | Hunter 3D szolgáltatási oldal; slider; galéria 04 |
| IMG-20260511-WA0017.jpg | hunter-alignment-screens | Hunter futóműmérő szoftver a monitorokon | Galéria 05 |
| IMG-20260717-WA0009.jpg | camera-calibration-target | Kamerakalibráló tábla a jármű előtt | Kamerakalibrálás oldal; slider; galéria 03 |
| IMG-20251104-WA0070.jpg | camera-calibration-target-front | Kamerakalibráló tábla egy jármű orra előtt | Galéria 10 |
| IMG-20260717-WA0001.jpg | diagnostics-laptop | Járműhöz csatlakoztatott diagnosztikai szoftver laptopon | Autódiagnosztika oldal; slider; galéria 06 |
| IMG-20260816-WA0000.jpg | adas-station | MAHLE TechPRO Digital ADAS állomás és diagnosztikai kocsi | Galéria 09 |
| IMG-20260717-WA0013.jpg | headlight-laser-check | Fényszóró-beállító lézeres vonallal | Galéria 08 |
| IMG-20260509-WA0018.jpg | ac-service-unit | Járműhöz csatlakoztatott klímaszerviz-berendezés | Galéria 12 |

**Szolgáltatásonkénti képsorok (harmadik kör):** a szolgáltatási oldalakon a korábbi egyetlen kép helyén nagyítható képsor (slider) fut, 3–5 valódi fotóval (`placement.serviceSlides`):

- ACC: acc-radar-calibration-screen, acc-radar-reflector (IMG-20251104-WA0045), diagnostics-tablet-in-car (IMG-20260717-WA0007)
- ADAS: adas-calibration-target, adas-screen-front (IMG-20251104-WA0059), adas-guided-setup (IMG-20260717-WA0006), adas-station, adas-station-van (IMG-20260816-WA0002)
- Hunter 3D: hunter-alignment-lift, hunter-alignment-wheel (IMG-20251104-WA0047), hunter-alignment-screens, hunter-console (IMG-20260527-WA0009), hunter-camera-beam (IMG-20260527-WA0011)
- Kamerakalibrálás: camera-calibration-target, camera-target-angle (IMG-20260717-WA0011), camera-calibration-target-front, camera-target-portrait (IMG-20251104-WA0034), camera-target-cabin (IMG-20251104-WA0074)
- LED / Matrix: headlight-adjustment, headlight-matrix-led (IMG-20260619-WA0005), headlight-laser-check, headlight-beam-check
- Diagnosztika: diagnostics-laptop, diagnostics-tablet-in-car, adas-station

Mind rendszám és felismerhető személy nélküli felvétel; a képaláírások csak azt írják le, ami a képen látszik, konkrét ügyfélmunkához nem kötjük őket.

**Facebook-bejegyzések:** a „Munkáink” szakasz tetején és a szolgáltatási oldalak alján 9 kiválasztott bejegyzés kártyája jelenik meg a hivatalos oldalról (src/facebook-posts.mjs): cím, dátum, rövid összefoglaló a tulajdonos saját HU/RO szövege alapján (EN fordítás), és statikus link a bejegyzésre. Csak olyan bejegyzés került be, amelyen nincs Meta „MI-tartalom” jelölés; a 69 bejegyzésből 21 ilyen jelölésű volt, ezek kimaradtak. Nincs Facebook SDK, iframe, automatikusan betöltődő beágyazás vagy követőkód; a Facebook-képek/videók nem lettek letöltve.

**Adatvédelmi kitakarás:** az IMG-20260717-WA0001 laptopképernyőjén olvasható alvázszám (VIN) és egy azonosítószám csak a webes változatokon el van homályosítva (`redact` a media/photos.json-ban); az eredeti fájl változatlan. Ez nem vízjel- vagy eredetjelölés-eltávolítás.

Ezzel mind a hat szolgáltatásnak van valódi fotója; helykitöltő már nem szerepel. A slider is minden szolgáltatásnál valódi képet mutat.

**A második körben kizárva:**
- minden „(1)” végű másolat (15 db): szerkesztett EXIF-mintájúak, közülük hatban látható „AI által előállított tartalom” jelölés (pl. IMG-20251104-WA0026(1), WA0053(1), IMG-20260509-WA0001(1), WA0005(1), IMG-20260527-WA0004(1), WA0008(1));
- 67 PNG (`file_0000…`, `a_banner…`, `a_digital_advertisement…`, `a_facebook_announcement…`, F.png stb.), 2 `grok_image_*` és 8 `Messenger_creation_*` kép: generált vagy szerkesztett grafikák;
- olvasható rendszámú vagy ügyféljárművet azonosító felvételek (pl. IMG-20251104-WA0025, WA0026, WA0053);
- mérési eredményt mutató kijelzők (pl. IMG-20260717-WA0000 „Measure confirmed”) – mérési eredményt nem teszünk közzé referenciaként;
- videók és PDF-ek: nem kerültek feldolgozásra.

További jó, de kihagyott fotók (később felhasználhatók): sok ADAS-kalibrálás (IMG-20251104-WA0036–0101), Hunter-állomás (IMG-20260527-WA0001–0013), fényszóró-beállítás (IMG-20260619-WA0002–0007), váltó/mechatronika (IMG-20260613-*, IMG-20260717-WA0015–0029).

## Kizárt fájlok és indok

- **Látható „AI által előállított tartalom” jelölés** (bal alsó sarok): IMG-20261115-WA0000, WA0003, WA0009, WA0012, WA0028 – kizárva, a jelölés nem került eltávolításra.
- **IMG-20261115-WA0032**: ugyanazzal a szerkesztési EXIF-mintával (2026:11:15 10:08) és levágott mérettel érkezett, mint a jelölt képek; a jelölés hiánya a vágás miatt nem bizonyítja az eredetet – óvatosságból kizárva, amíg tisztázódik.
- **1000115918.jpg** (Mercedes, korábban küldve): látható AI-jelölés miatt továbbra is kizárva.
- **12 db `file_0000…png`**: generált reklámplakátok (felirat, illusztrált autók, gumik, akkumulátorok) – nem valódi műhelyfotók, referenciaként nem használhatók.
- **IMG-20261115-WA0006**: olvasható rendszám – kihagyva (adatvédelem).
- Egyéb, nem választott váltójavítási képek (WA0001, 0002, 0004, 0005, 0008, 0010, 0015, 0016, 0018–0023, 0025–0027, 0029–0031, 0033, 0035, 0037): valódi, de a kiválasztottakhoz nagyon hasonló vagy kevésbé éles/kifejező felvételek; később felhasználhatók.

## Megjegyzés a látványtervhez

A munkamenethez csatolt Claude-artifact az NVS **mobilalkalmazás** látványterve (Android keret, rendszámfelismerés), nem a weboldalé. A webes elrendezés a korábban (PR #2/#3) átvett webes látványterv irányát követi: fekete háttér, élénkzöld hangsúly, fehér szöveg, eredeti NVS-logó. A látványterv szem alakú emblémája és képei nincsenek használva.
