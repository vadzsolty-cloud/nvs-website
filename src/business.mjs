// Issue #1 owner-supplied data. Street address approved by the owner as final on 2026-11-15;
// the phone still requires explicit approval (CONTACT_APPROVED) before it enters structured data.
export const business={
 name:'Night Vision Service SRL',
 address:'Strada Principală 244/A, Văcărești (Csíkvacsárcsi), Harghita, România',
 street:'Strada Principală 244/A',locality:'Văcărești',region:'Harghita',country:'RO',
 phone:'+40 741 738 604',phoneHref:'tel:+40741738604',email:'nightvisionservice2025@gmail.com',
 facebook:'https://www.facebook.com/share/19q4Kb3jFq/',
 maps:'https://maps.app.goo.gl/PCEcWUp4iUa8GtKy6?g_st=ac',
 app:'https://vadzsolty-cloud.github.io/nvs-app-letoltes/app/',
 addressApproved:true,postalCode:'537203',
 // Coordinates of the owner's Google Business Profile pin (Night Vision Service, Str. Principală nr. 244/A).
 geo:{lat:46.4619963,lng:25.7936655},
 mapEmbed:'https://maps.google.com/maps?q=46.4619963,25.7936655&z=16&output=embed'
};
export const contactCopy={
 hu:{book:'Időpontkérés – demó',maps:'Útvonal a műhelyhez – Google Maps',phone:'Telefon',pending:'A műhely címe végleges. A telefonszám strukturált (keresőmotoros) közzététele még tulajdonosi megerősítésre vár.',app:'NVS App letöltése',privacy:'Adatkezelési tájékoztató',privacyBody:'Ez a fejlesztői bemutató nem hoz létre fiókot, foglalást vagy marketingfeliratkozást. Az időpontválasztás csak a lap memóriájában él, újratöltéskor elvész. Nem használunk analitikát vagy marketingcookie-t. A tárhelyszolgáltató a weboldal kiszolgálásához technikai hozzáférési adatokat kezelhet. A telefon, e-mail, Maps és alkalmazás hivatkozás megnyitásakor a kiválasztott szolgáltató szabályai érvényesek. Az e-mail link nem küld automatikusan üzenetet. Az adatkezelőként megadott cég: Night Vision Service SRL; kapcsolat: nightvisionservice2025@gmail.com. A teljes éles fiók- és foglalási adatkezelési tájékoztató, megőrzési idők, adatfeldolgozók és ügyféljogok részletes rendezése az integráció élesítése előtt szükséges. A külön helyi emulátorlabor kizárólag szintetikus adatokkal tesztelhető, és nincs bekötve ezen a nyilvános oldalon.'},
 ro:{book:'Solicitare de programare – demo',maps:'Traseu către atelier – Google Maps',phone:'Telefon',pending:'Adresa atelierului este definitivă. Publicarea structurată (pentru motoarele de căutare) a numărului de telefon așteaptă confirmarea proprietarului.',app:'Descarcă NVS App',privacy:'Informare privind datele personale',privacyBody:'Această demonstrație nu creează conturi, programări sau abonamente de marketing. Selecția orei există doar în memoria paginii și dispare la reîncărcare. Nu folosim analiză de trafic sau cookie-uri de marketing. Furnizorul de găzduire poate prelucra date tehnice de acces pentru livrarea site-ului. Linkurile către telefon, e-mail, Maps și aplicație sunt supuse regulilor furnizorilor respectivi. Linkul e-mail nu trimite automat un mesaj. Compania indicată ca operator: Night Vision Service SRL; contact: nightvisionservice2025@gmail.com. Înainte de activarea conturilor și programărilor reale sunt necesare informarea completă, perioadele de păstrare, furnizorii și procedurile pentru drepturile clienților. Laboratorul local separat folosește exclusiv date sintetice și nu este conectat la acest site public.'},
 en:{book:'Request an appointment – demo',maps:'Directions to the workshop – Google Maps',phone:'Phone',pending:'The workshop address is final. Structured (search-engine) publication of the phone number still awaits owner confirmation.',app:'Download NVS App',privacy:'Privacy information',privacyBody:'This development demonstration creates no accounts, appointments or marketing subscriptions. Your time selection is held only in page memory and is lost on reload. We use no analytics or marketing cookies. The hosting provider may process technical access data needed to deliver the website. Telephone, email, Maps and application links are subject to the respective providers’ policies. The email link does not send a message automatically. The stated controller is Night Vision Service SRL; contact: nightvisionservice2025@gmail.com. Before live accounts and bookings are enabled, a complete notice, retention periods, processors and customer rights procedures must be agreed. The separate local emulator lab uses synthetic data only and is not connected to this public website.'}
};

export const mapCopy={
 hu:{title:'Itt találsz minket',load:'Térkép betöltése',note:'A térkép csak kattintásra töltődik be a Google Mapsről; ekkor a Google adatkezelési szabályai érvényesek.',frame:'Night Vision Service a térképen – Google Maps',open:'Megnyitás a Google Mapsen'},
 ro:{title:'Unde ne găsești',load:'Încarcă harta',note:'Harta se încarcă de pe Google Maps doar la clic; în acel moment se aplică regulile Google privind datele.',frame:'Night Vision Service pe hartă – Google Maps',open:'Deschide în Google Maps'},
 en:{title:'Where to find us',load:'Load the map',note:'The map loads from Google Maps only when you click; Google’s privacy terms then apply.',frame:'Night Vision Service on the map – Google Maps',open:'Open in Google Maps'}
};
