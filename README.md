# Alpha Metal Fabrication (AMF) — Website

Static marketing website for **Alpha Metal Fabrication (AMF)** — fabrication of
steel structures, pressure vessels and process equipment for the oil & gas,
power and steel industries.

No backend required — it runs as plain static files and is **GitHub Pages ready**.
A lightweight flat-file CMS (`admin.html`) lets you edit page text/images and
manage news in the browser, then export JSON to publish.

## Structure

```
index.html              Home
about.html              About AMF
capabilities.html       Capabilities overview
steel-structures.html   ┐
pressure-vessels.html   ├ capability detail pages
process-equipment.html  ┘
facilities.html         Facilities & equipment
quality.html            Quality & certifications
industries.html         Industries (oil & gas / power / steel)
news.html               News list   (data-driven)
news-detail.html        News article (?id=…)
contact.html            Contact + Request-a-Quote
admin.html              Admin CMS (client-side)

assets/
  css/styles.css        Site styles
  css/admin.css         Admin styles
  js/site.js            Shared header/footer + CMS engine + news rendering
  js/admin.js           Admin logic
  img/amf-logo.svg      Horizontal logo lockup
  img/amf-mark.svg      Icon mark
  data/content.json     Published page-content overrides (edited via admin)
  data/news.json        Published news articles (edited via admin)
```

## Editing content (admin)

1. Open `admin.html` and sign in (default passphrase: **`amf-admin`** — change it in Settings).
2. **Page content** — pick a page, edit text/images, **Save** (previews live in your browser).
3. **News** — add/edit/delete articles.
4. **Contact info / Settings** — phone/email/address and optional sections.
5. **Publish** — download `content.json` and `news.json`, commit them to
   `assets/data/`, and push. GitHub Pages updates automatically.

> The admin gate is client-side convenience only. For real protection, host the
> admin behind authentication or a private deployment.

## New-company note

AMF is newly established, so "track-record" sections (Selected projects, Company
milestones) are **hidden by default**. Turn them on in **Admin → Settings** once
there is content to show.

## Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy on GitHub Pages

Push to GitHub, then enable **Settings → Pages → Deploy from branch → `main` / root**.
