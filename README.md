# [SoftShelf] — Catalogue de logiciels

> Site vitrine statique hébergé sur **GitHub Pages**. Chaque application est décrite dans un fichier JSON indépendant.

🌐 **Démo live :** `https://<votre-username>.github.io/<nom-du-repo>`

---

## ✨ Fonctionnalités

- 🗂 Catalogue filtrable par catégorie
- 🔍 Recherche en temps réel (nom, description, tags…)
- 🔢 Tri par vedette / date / nom
- 📄 Modal détaillé par application
- 📱 Responsive mobile
- ⚡ Aucune dépendance, aucun build — HTML/CSS/JS pur

---

## 📁 Structure du projet

```
softshelf/
├── index.html              # Page principale
├── assets/
│   ├── css/style.css       # Styles
│   └── js/main.js          # Logique JS
├── apps/
│   ├── index.json          # Liste des fichiers JSON à charger
│   ├── devsuit-pro.json    # Fiche application
│   ├── pixelflow.json
│   └── ...
└── .github/
    └── workflows/
        └── deploy.yml      # Déploiement automatique sur GitHub Pages
```

---

## ➕ Ajouter une application

### 1. Créez un fichier JSON dans `apps/`

```json
{
  "id": "mon-app",
  "name": "Mon Application",
  "tagline": "Courte accroche",
  "description": "Description complète de l'application.",
  "version": "1.0.0",
  "category": "Productivité",
  "icon": "🚀",
  "download_url": "https://example.com/download",
  "homepage_url": "https://example.com",
  "changelog_url": "https://example.com/changelog",
  "published_at": "2025-01-01",
  "updated_at": "2025-01-15",
  "platform": ["Windows", "macOS", "Linux"],
  "size": "25 MB",
  "license": "Gratuit",
  "tags": ["tag1", "tag2", "tag3"],
  "featured": false
}
```

**Valeurs possibles pour `license` :** `Gratuit`, `Freemium`, `Payant`, `Open Source`

### 2. Référencez le fichier dans `apps/index.json`

```json
{
  "apps": [
    "mon-app.json",
    "autre-app.json"
  ]
}
```

### 3. Commitez et poussez

Le workflow GitHub Actions déploiera automatiquement les changements.

---

## 🚀 Déploiement sur GitHub Pages

1. **Forkez** ou importez ce dépôt sur votre compte GitHub
2. Allez dans **Settings → Pages**
3. Source : choisissez **GitHub Actions**
4. Poussez sur `main` — le site est publié automatiquement

---

## 🛠 Développement local

Aucun build requis. Lancez simplement un serveur local :

```bash
# Python
python -m http.server 8080

# Node.js
npx serve .
```

Puis ouvrez `http://localhost:8080`

---

## 📄 Licence

MIT — libre d'utilisation et de modification.
