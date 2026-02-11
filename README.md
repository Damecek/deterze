# Deterze web (one-page)

Jednoduchý statický web kapely **Deterze** připravený na rychlé úpravy.
Projekt je čisté **HTML + CSS + JavaScript** bez build kroku.

## Co obsahuje

- `index.html` – celý one-page web.
- `styles.css` – styly (tmavá paleta + červený akcent podle vizuálu kapely).
- `script.js` – data pro sekce Členové a Galerie + mobilní menu.
- `public/` – obrázky (logo / hero), které můžeš nahradit vlastními.
- `CNAME` – custom doména pro GitHub Pages (`deterze.cz`).

## Rychlé úpravy obsahu

### 1) Texty
Uprav přímo v `index.html`:
- Hero text,
- O kapele,
- Kontakt a e-mail.

### 2) Členové kapely
Uprav pole `members` v `script.js`:
- jméno,
- role,
- popisek.

### 3) Galerie
Uprav pole `gallery` v `script.js`.

## Lokální spuštění

Stačí otevřít `index.html` v prohlížeči.

Nebo přes jednoduchý server:

```bash
python -m http.server 8080
```

A pak otevři `http://localhost:8080`.

## Deploy a publikace na deterze.cz

### Varianta A: GitHub Pages (doporučeno)

1. Nahraj repozitář na GitHub.
2. V repu otevři **Settings → Pages**.
3. V části **Build and deployment** zvol:
   - **Source: Deploy from a branch**
   - **Branch: `main`** (root)
4. Počkej na deploy (obvykle 1–3 min).
5. Ověř, že soubor `CNAME` obsahuje `deterze.cz` (už je nastaveno).
6. U domény nastav DNS na GitHub Pages (A/CNAME záznamy podle dokumentace GitHubu).

### Varianta B: ruční hosting

Nahraj obsah repozitáře (hlavně `index.html`, `styles.css`, `script.js`, `public/`) na jakýkoliv statický hosting.

## Poznámka k koncertům

Koncerty jsou záměrně odkázané na Facebook/Instagram, jak bylo požadováno.
