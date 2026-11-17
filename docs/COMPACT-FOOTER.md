# Tömör, csoportosított lábléc

2026-11-17, a tulajdonos képernyőképes visszajelzése alapján.

Szerkezeti referencia: [Dedeman főoldal, lábléc](https://www.dedeman.ro/ro). A tematikus hivatkozáscsoportok és a legalul elhelyezett copyright elvét követtük; nem vettünk át szöveget, képet, kódot vagy webshopfunkciót.

Négy rendezett blokk váltotta fel a szabadon tördelődő flex-elrendezést: cégadatok, információk, NVS alkalmazások, kapcsolat. A tulajdonos által azonosként megerősített székhely/műhelycím egyszer szerepel. A CUI/TVA, cégjegyzékszám, telefon, e-mail és minden jogi/app/hatósági hivatkozás megmarad. A hiányzó cégadatokról szóló meglévő közlés lenyitható részbe került, továbbra is elérhető a cégadat-oldallal együtt. A Facebook-ikon és az ANPC SAL-jelzés közös sorba került; a szürke/kék ikonhatás változatlan.

A copyright, a médiatulajdonosi nyilatkozat, a 2026-os készítési év és az állandóan látható adatvédelmi beállítási link keskeny alsó sávot alkot. A fejlesztői előnézeti figyelmeztetés a lábléc elé került, így a lábléc az utolsó normál elrendezésű tartalom. Rövid oldalakon a fő tartalom tölti ki a szabad magasságot, a lábléc a lap alján marad; nincs rögzített, tartalmat takaró footer.

Asztalon négy, tableten két oszlop látható. 700 px alatt az információs és alkalmazáscsoportok natív details/summary elemekként alapból összecsukódnak, billentyűzettel is nyithatók. Szélességváltáskor újrarendeződnek. JavaScript nélkül minden link alapból nyitva marad. A telefon/e-mail/Facebook, az azonosító adatok és az adatvédelmi beállítás továbbra is közvetlenül elérhető.

Ellenőrzés: 39 oldalas build, meglévő site- és privacy-regresszió; HU/RO/EN, világos/sötét téma, 320–2560 px szélesség, mobilos lenyitás és asztali visszarendeződés. A böngészőteszt külön figyeli a lábléc magasságát, alsó elhelyezését és a csoportok állapotát; képernyőképek készültek. Nincs Firebase-, foglalási API-, app-, APK- vagy frissítőmódosítás.

