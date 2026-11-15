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

A főoldal jobb oldalán (a korábbi álló hero kép helyén) a hat szolgáltatás lapozható sorban: LED / Matrix → ADAS → ACC → Hunter 3D → kamerakalibrálás → diagnosztika. Valódi fotó csak ott szerepel, ahol a szolgáltatás felismerhető (headlight-adjustment, adas-calibration-target, acc-radar-calibration-screen); a többi dián a szolgáltatás ikonja és „Fotó hamarosan” felirat áll, helyettesítő kép nélkül. Az első dia képe a gyorsan töltődő hero kép, a többi lusta betöltésű.

Működés: CSS scroll-snap sáv (JS nélkül is lapozható, mobilon húzható); JS-sel előző/következő gomb, pontok, szünet/lejátszás gomb, 5,5 mp-es automatikus lapozás, amely egérrel vagy fókusszal a sliderre állva, rejtett lapon és „csökkentett mozgás” beállításnál szünetel. Billentyű: ←/→ a sávon.

## Helykitöltő maradt

- **Hunter 3D futóműállítás**: nincs valódi Hunter-/futóműállítási fotó (a Hunter-feliratú képek a generált plakátokon szerepelnek).
- **Kamerakalibrálás**: nincs olyan fotó, amelyen kifejezetten kamerakalibrálás látszik.
- **Autódiagnosztika**: a TechPRO-tablet képe radarkalibrálást mutat, ezért az ACC-hez került; önálló diagnosztikai munkafotó nincs.

A helykitöltő HU/RO/EN nyelven jelzi: „Ehhez a szolgáltatáshoz még nincs jóváhagyott, valódi műhelyfotó.”

## Kizárt fájlok és indok

- **Látható „AI által előállított tartalom” jelölés** (bal alsó sarok): IMG-20261115-WA0000, WA0003, WA0009, WA0012, WA0028 – kizárva, a jelölés nem került eltávolításra.
- **IMG-20261115-WA0032**: ugyanazzal a szerkesztési EXIF-mintával (2026:11:15 10:08) és levágott mérettel érkezett, mint a jelölt képek; a jelölés hiánya a vágás miatt nem bizonyítja az eredetet – óvatosságból kizárva, amíg tisztázódik.
- **1000115918.jpg** (Mercedes, korábban küldve): látható AI-jelölés miatt továbbra is kizárva.
- **12 db `file_0000…png`**: generált reklámplakátok (felirat, illusztrált autók, gumik, akkumulátorok) – nem valódi műhelyfotók, referenciaként nem használhatók.
- **IMG-20261115-WA0006**: olvasható rendszám – kihagyva (adatvédelem).
- Egyéb, nem választott váltójavítási képek (WA0001, 0002, 0004, 0005, 0008, 0010, 0015, 0016, 0018–0023, 0025–0027, 0029–0031, 0033, 0035, 0037): valódi, de a kiválasztottakhoz nagyon hasonló vagy kevésbé éles/kifejező felvételek; később felhasználhatók.

## Megjegyzés a látványtervhez

A munkamenethez csatolt Claude-artifact az NVS **mobilalkalmazás** látványterve (Android keret, rendszámfelismerés), nem a weboldalé. A webes elrendezés a korábban (PR #2/#3) átvett webes látványterv irányát követi: fekete háttér, élénkzöld hangsúly, fehér szöveg, eredeti NVS-logó. A látványterv szem alakú emblémája és képei nincsenek használva.
