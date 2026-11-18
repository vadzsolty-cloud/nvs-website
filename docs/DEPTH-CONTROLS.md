# Térhatású ikonok és egységes navigációs keretek

2026. november 18. – HU / RO / EN, az elfogadott prémium arculat finomítása.

- A visszalépő hivatkozások saját, balra mutató SVG-nyilat és lekerekített, fényéllel/alsó árnyékkal kiemelt keretet kapnak a szolgáltatási, ügyfélkapu- és letöltési oldalakon.
- A szolgáltatás- és fotólapozók előző/következő vezérlőiben egységes SVG-nyilak szerepelnek. Az akadálymentes nevek, billentyűzetes kezelés és lapozási működés megmarad.
- A kiemelt szöveges hivatkozások, a szolgáltatáskártyák részletező feliratai és a referenciák lenyitó vezérlői azonos keretezést kapnak. A szolgáltatáskártya továbbra is egyetlen hivatkozás; nem kerül bele beágyazott gomb.
- A közös UI-ikonok és a hat szolgáltatásikon két eltolt vektoros vonalréteggel készülnek. Az ikontartók finom domborított felületet kapnak. Nincs új képfájl, külső ikonkönyvtár vagy animációs függőség.
- A plusz/mínusz jel a natív referencialenyitó állapotát követi, JavaScript nélkül is. Az ikonok dekoratívak (`aria-hidden`, `focusable=false`), a vezérlőket felirat vagy meglévő akadálymentes név azonosítja.
- A galéria képaláírása külön keretet kap; mobilon a kép mérete és az alsó tér biztosítja, hogy a felirat és a tovább/vissza gombok ne fedjék egymást.
- A sötét felületű lapozógombok világos és sötét oldaltémában is világos ikont mutatnak, interakciónál élénkzöldet. A Facebook ikon szürke/alap és kék/hover viselkedése megmarad.
- A fókuszjelölések és legalább 44 px-es önálló navigációs gombok megmaradnak. Csökkentett mozgás esetén a hozzáadott mozgások kikapcsoltak; a térhatás statikus.

Ellenőrzés: 39 oldal buildje, 18 automatizált teszt; kibővített Playwright HU/RO/EN, 320–2560 px, világos/sötét témák. A regresszió kiterjed a vissza- és lapozóikonokra, keretekre, galérialapozásra, fókusz-visszaadásra, mobilos felirat/gomb elhelyezésre, natív lenyitásra, mozgáscsökkentésre és JavaScript nélküli megjelenítésre. Képi ellenőrzés készült a világos vissza-gombról, szolgáltatáskártyáról és lapozóról, illetve a sötét mobilos fotónézegetőről. A végleges CI és publikálás eredménye a #1 GitHub-feladatban szerepel.

A logó, eredeti fotók, foglalási működés, Firebase, meglévő app, APK és frissítési rendszer nem változik. A cégadatok és adatvédelmi beállítások megmaradnak.
