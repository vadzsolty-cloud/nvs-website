# Facebook-ikon és egységes finom kiemelések

2026-11-17, tulajdonosi kérésre.

A közös lábléc mindhárom nyelven kapott egy 50×50 px-es, akadálymentesen elnevezett Facebook-hivatkozást. A helyben rajzolt SVG alapból szürke; egérrel rámutatva vagy billentyűzetes fókusznál Facebook-kék (`#1877f2`). A tulajdonos által jóváhagyott hivatalos oldalra mutat, új lapon, `noopener noreferrer` védelemmel. Az ikon megjelenítéséhez nincs külső kép-, SDK- vagy Meta-kérés; a beágyazott tartalom hozzájárulási működése változatlan.

A szolgáltatáscsempék, képlapozók, Facebook-referenciák, galériafotók, felszereléslista, munkafolyamat-kártyák, regisztrációs és appcsempék, ügyfélkapu-felhívás és foglalási sáv közös, finom keret-/árnyékkiemelést és legfeljebb 4 px-es emelkedést kaptak. A gombok, ikonok és lapozóvezérlők legfeljebb 2 px-et mozdulnak. A fotók nagyítása legfeljebb 2,5%; az elrendezés nem változik a reakció miatt. A nem kattintható felszerelés-/folyamatkártyák nem kapnak megtévesztő gombszerepet vagy mutatókurzort.

A billentyűzetes fókusz is látható reakciót kap. A mozgást kérő egérhatások csak finom mutatóeszköznél működnek; érintőképernyőn nem támaszkodunk rámutatásra. `prefers-reduced-motion: reduce` mellett a mozgás és képzoom kikapcsol, a szín-/keretjelzés megmarad. A jelszómutató pozicionálása és nyomva tartásos működése nem változik; a tiltott gombok nem emelkednek meg.

A meglévő prémium regresszió új vizsgálatai: az ikon alap-/hover-/billentyűzetes színe világos és sötét témában; a fő kártyatípusok tényleges emelkedése; csökkentett mozgásnál a transzformáció hiánya. A teljes HU/RO/EN, 320–2560 px-es regresszió és az app-/letöltési ellenőrzések továbbra is futnak. Minden külső tesztkérés helyettesített; nincs éles e-mail, foglalás vagy APK-letöltés.

Csak a weboldal lábléce, CSS-e, regressziója és ez a dokumentáció változik. Nincs Firebase-, app-, frissítő- vagy szabálymódosítás.

