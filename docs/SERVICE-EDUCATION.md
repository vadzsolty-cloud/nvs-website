# Általános szervizkártya és „Tudtad-e?” szolgáltatási ismertetők

2026-11-18, tulajdonosi kérésre.

## Műhelybemutató

A hét meglévő technológiai kártya változatlan szövege mellett a nyolcadik, jobb oldali helyre külön általános szervizkártya került: „Általános szerviz és karbantartás”. Átvizsgálást, időszakos karbantartást, mechanikus/elektronikus hibafeltárást és javítást mutat be; nem új berendezést vagy igazolatlan tanúsítást állít. Saját vonalas szerszámikon, visszafogott zöld kiemelés és ügyfélkapu-hivatkozás tartozik hozzá. Teljes HU/RO/EN szöveg. A korábbi tulajdonosi döntés szerint nem sorolja fel a nem vállalt munkákat.

## Hat önálló ismeretterjesztő téma

Az ACC, ADAS, Hunter 3D, kamerakalibrálás, LED/Matrix és diagnosztika meglévő nyelvi aloldalai külön eredeti magyarázatot kaptak. A korábbi általános, azonos leírásokat ismétlő folyamatblokk helyét az egyes témához írt ismertető veszi át:

- Érdekes nyitókérdés és közérthető összefoglaló.
- Egy rövid „Tudtad-e?” érdekesség.
- Kapcsolódó rendszerek/fogalmak három magyarázó kártyában.
- Tipikus helyzetek, amikor érdemes ellenőrzést egyeztetni.
- Három lépés a műhelyben, saját témaspecifikus szöveggel.
- Két natív, billentyűzettel is nyitható gyakori kérdés.
- Kapcsolódó szolgáltatások, gyártói szakmai háttér és meglévő ügyfélkapu-CTA.

Mind a 18 nyelvi változat buildelt HTML. Az ismertetők, kérdések és linkek JavaScript nélkül is olvashatók/használhatók; nem kliensoldali töltés vagy gépi fordítás futásidőben. Az eredeti, valódi műhelyfotók és képlapozók megmaradnak. A nyitóképből külön link vezet az ismertetőhöz. A canonical/hreflang, a hat szolgáltatási URL és a noindex előnézeti működés változatlan; összesen továbbra is 39 oldal készül.

## Szakmai keretek és források

A szöveg nem otthoni javítási útmutató és nem ígér minden járműre minden funkciót. A konkrét eljárás, hozzáférés és szükséges művelet modell-, felszereltség- és állapotfüggő, a gyári előírások alapján tisztázandó. A hibakód nem bizonyít automatikusan hibás alkatrészt, az ACC nem önvezetés, a kalibrálás nem extraaktiválás, a LED nem automatikusan Matrix. A szöveg nem állít új gépet, márkaszerviz-jogosultságot, fix időtartamot vagy árat.

Saját fogalmazású ügyféltájékoztatás, a műhely tulajdonosi leírásával és gyártói technikai háttérrel:

- [Bosch – ACC](https://www.bosch-mobility.com/en/solutions/assistance-systems/adaptive-cruise-control/), [vezetéstámogató rendszerek](https://www.bosch-mobility.com/en/solutions/assistance-systems/), [sávtartás](https://www.bosch-mobility.com/en/solutions/assistance-systems/lane-keeping-assist/), [AEB](https://www.bosch-mobility.com/en/solutions/assistance-systems/automatic-emergency-braking/).
- [MAHLE – ADAS](https://www.mahle-aftermarket.com/eu/en/automechanika/adas/), [kamera- és radarkalibrálás](https://newsroom.mahle.com/press/en/press-releases/revolutionary-mahle-solution-for-calibrating-driver-assistance-systems-63361).
- [Hunter – futóműgeometria](https://www.hunter.com/media-center/industry-insights/newthings-to-consider-wheel-aligners/), [WinAlign dokumentáció](https://www.hunter.com/globalassets/hunter/products/alignment-systems/winalign-standard/documents/align-winalign-ops-3850-t.pdf).
- [HELLA – radar](https://www.hella.com/techworld/en/technical/sensors-and-actuators/maintenance-and-diagnostics-of-77-ghz-radar-sensors/), [ADAS](https://www.hella.com/techworld/en/technical/adas/), [kalibrálás](https://www.hella.com/techworld/en/workshop-equipment/testing-and-adjustment-solutions/adas-calibration/).
- [HELLA – fényszóróbeállítás](https://www.hella.com/techworld/en/technical/automotive-lighting/headlight-adjustment/), [LED vezérlők](https://www.hella.com/techworld/en/technical/automotive-lighting/electronic-control-units-in-contemporary-vehicles-with-led-headlamps/), [Matrix LED](https://www.hella.com/techworld/uk/technical/automotive-lighting/ssl-hd-matrix-led-lamps/).
- [HELLA – érzékelők és beavatkozók](https://www.hella.com/techworld/us/lounge/sensors-actuators/), [hibakód és vizsgálati összefüggések](https://www.hella.com/techworld/in/lounge/new-to-range-july-2026-new-products-at-a-glance/).

A források az aloldalakon is elérhetők. Nincs gyártói logó vagy partneri/minősítési állítás.

## Ellenőrzés és hatókör

A meglévő statikus/site tesztek továbbra is ellenőrzik a nyelvi URL-eket, belső linkeket és képeket. A kibővített böngészőteszt mind a 18 ismertetőn megvizsgálja az elemek és a CTA jelenlétét, a FAQ nyitását, valamint a 320/768/1440 px-es világos/sötét elrendezést. A főoldalon nyolc kártya és a nyelvhelyes általános szervizlink is ellenőrzött. A korábbi fejléc/lábléc/hover/menü/app-letöltési regresszió megmarad.

Kizárólag az nvs-website statikus tartalma és elrendezése változik. Nincs új Firebase/API/SMTP művelet, app/APK/frissítő/rules módosítás, tesztfoglalás vagy valódi tesztlevél.
