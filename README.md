# Aphonia Gent 🔴🟡

Website voor **Studentenclub Aphonia Gent**.

Ik heb de site volledig statisch opgebouwd zodat hij gewoon via **GitHub Pages** kan draaien. Geen database, backend of andere hosting nodig.

Ik heb ook geprobeerd het onderhoud zo simpel mogelijk te houden, zodat toekomstige praesidia geen programmeerkennis nodig hebben om activiteiten of het praesidium aan te passen.

## Pagina's

De site bestaat momenteel uit:

* `index.html` — homepage
* `over-ons.html` — over Aphonia, het schild en de geschiedenis
* `activiteiten.html` — activiteiten
* `clubcafe.html` — Café Confrater
* `schachten.html` — doop, schachten, ontgroening en schachtencursus
* `praesidium.html` — huidig praesidium + pro-praesidia
* `contact.html` — contact en socials
* `404.html` — 404-pagina

De styling staat grotendeels in:

```text
assets/css/style.css
```

en de JavaScript in:

```text
assets/js/script.js
```

---

## Activiteiten aanpassen 🎉

Om activiteiten aan te passen hoef je normaal gezien **niet in `activiteiten.html` te prutsen**.

De activiteiten worden bijgehouden in:

```text
content/activiteiten.json
```

Via de voorziene beheeromgeving kunnen activiteiten gewoon toegevoegd, aangepast of verwijderd worden.

Als alles juist staat:

1. Download het nieuwe activiteitenbestand.
2. Controleer de bestandsnaam.
3. Ga in deze repository naar de map `content/`.
4. Vervang daar het oude bestand.
5. Commit de wijziging.

> [!IMPORTANT]
> Het bestand **MOET exact `activiteiten.json` heten**.
>
> Dus:
>
> ```text
> activiteiten.json
> ```
>
> Niet `activiteiten (1).json`, `activiteiten-nieuw.json`, `activiteiten2026.json` of iets anders.
>
> De website zoekt specifiek naar `content/activiteiten.json`. Als de naam anders is, worden de nieuwe activiteiten **niet ingeladen**.

Je computer kan bij meerdere downloads bijvoorbeeld automatisch dit maken:

```text
activiteiten (1).json
```

Hernoem het bestand dan eerst terug naar:

```text
activiteiten.json
```

en upload/vervang pas daarna het bestand op GitHub.

Dus eigenlijk:

```text
Activiteiten aanpassen
        ↓
bestand downloaden
        ↓
NAAM CONTROLEREN
        ↓
activiteiten.json
        ↓
/content/activiteiten.json vervangen
        ↓
Commit
        ↓
Klaar :)
```

---

## Praesidium aanpassen 👑

Het huidige praesidium en de pro-praesidia zitten samen in:

```text
content/praesidium.json
```

Via de beheeromgeving kunnen onder andere:

* namen veranderd worden;
* functies veranderd worden;
* leden toegevoegd of verwijderd worden;
* foto's aangepast worden;
* nieuwe pro-praesidia toegevoegd worden;
* groepsfoto's aan vorige jaren toegevoegd worden.

Na het aanpassen download je het nieuwe praesidiumbestand.

> [!IMPORTANT]
> Ook hier moet de bestandsnaam **exact juist zijn**.
>
> Het bestand moet:
>
> ```text
> praesidium.json
> ```
>
> heten.
>
> Niet `praesidium (1).json`, `nieuw-praesidium.json`, `praesidium2026.json`, enzovoort.
>
> De website zoekt specifiek naar `content/praesidium.json`. Met een andere bestandsnaam werkt de update niet.

Als je browser bijvoorbeeld:

```text
praesidium (1).json
```

downloadt, hernoem je dit eerst naar:

```text
praesidium.json
```

Daarna vervang je:

```text
content/praesidium.json
```

op GitHub en commit je de wijziging.

---

## Nieuw academiejaar

Bij de overgang naar een nieuw praesidium moet de site niet ieder jaar opnieuw aangepast worden.

Ik zou het ongeveer zo doen:

1. huidig praesidium bij de pro-praesidia zetten;
2. het juiste academiejaar invullen;
3. eventueel de groepsfoto toevoegen;
4. nieuw praesidium invullen;
5. praesidiumbestand downloaden;
6. controleren dat het bestand **exact `praesidium.json` heet**;
7. `content/praesidium.json` vervangen;
8. committen.

Het oude praesidium komt dan automatisch in het archief terecht.

---

## Foto's 📸

Bij praesidium/pro-praesidium kunnen ook foto's gebruikt worden.

Probeer hiervoor liefst afbeeldingen te gebruiken die we zelf beheren en waarvan de URL niet zomaar gaat verdwijnen.

Als een foto ooit verplaatst wordt, moet de URL natuurlijk ook aangepast worden.

---

## Schachtencursus

De schachtencursus is iets anders dan activiteiten/praesidium en wordt momenteel rechtstreeks gelinkt vanaf de schachtenpagina.

Bij een nieuwe cursus dus even controleren of:

```text
schachten.html
```

nog naar de juiste versie verwijst.

---

## Mappenstructuur

Voor wie toch iets verder in de site moet zoeken:

```text
/
├── index.html
├── over-ons.html
├── activiteiten.html
├── clubcafe.html
├── schachten.html
├── praesidium.html
├── contact.html
├── 404.html
│
├── content/
│   ├── activiteiten.json
│   └── praesidium.json
│
└── assets/
    ├── css/
    │   └── style.css
    │
    ├── js/
    │   └── script.js
    │
    └── img/
```

Voor gewone jaarlijkse updates zijn eigenlijk vooral deze twee bestanden belangrijk:

```text
content/activiteiten.json
content/praesidium.json
```

### Nog eens omdat dit waarschijnlijk ooit misgaat 😅

De namen van die bestanden mogen **niet veranderd worden**:

```text
✅ activiteiten.json
✅ praesidium.json

❌ activiteiten (1).json
❌ activiteiten-nieuw.json
❌ Activiteiten.json

❌ praesidium (1).json
❌ nieuw-praesidium.json
❌ Praesidium.json
```

Bij twijfel: gewoon exact bovenstaande namen gebruiken.

---

## Online zetten

De site draait via GitHub Pages.

Na een wijziging gewoon committen/pushen naar de repository. GitHub Pages neemt de wijziging daarna automatisch over.

Een commit hoeft niet ingewikkeld te zijn:

```text
Activiteiten oktober toegevoegd
```

of:

```text
Praesidium 2026-2027 toegevoegd
```

Het kan eventjes duren voordat de nieuwe versie effectief zichtbaar is.

---

## Mobiel

Ik heb de site vanaf het begin ook voor gsm opgebouwd.

Er zitten aparte mobiele regels in voor onder andere:

* de navigatie;
* lange titels;
* activiteiten;
* praesidiumnamen;
* kaarten;
* tijdlijnen;
* knoppen;
* kleine schermen.

Als je alleen content aanpast, hoef je daar normaal gezien niets aan te veranderen.

---

## Jaarlijks eens nakijken

Voor een nieuw academiejaar zou ik vooral dit overlopen:

* [ ] nieuw praesidium invullen
* [ ] oud praesidium bij pro-praesidia zetten
* [ ] groepsfoto toevoegen
* [ ] activiteiten vernieuwen
* [ ] oude activiteiten verwijderen
* [ ] controleren dat `activiteiten.json` exact zo genoemd is
* [ ] controleren dat `praesidium.json` exact zo genoemd is
* [ ] nieuwe schachtencursus linken
* [ ] contactgegevens controleren
* [ ] Instagram/Facebook controleren
* [ ] site eens openen op gsm
* [ ] alle knoppen/links kort testen

---

## Als je geen idee hebt wat je doet

Geen paniek.

Als je alleen **activiteiten, praesidium of pro-praesidium** wilt aanpassen, blijf dan gewoon van de HTML/CSS/JS af en gebruik de voorziene beheeromgeving.

Voor de meeste updates is het:

```text
aanpassen
   ↓
JSON downloaden
   ↓
BESTANDSNAAM CONTROLEREN
   ↓
bestand in /content vervangen
   ↓
committen
```

En vooral:

```text
activiteiten = activiteiten.json
praesidium   = praesidium.json
```

**Verander die bestandsnamen niet, want anders vindt de website de bestanden niet.**

---

**Aphonia Gent 🔴🟡**
*HOGENT Campus Vesalius*
