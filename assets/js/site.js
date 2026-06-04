/* ===================================================================
   AMF — Alpha Metal Fabrication
   Shared site engine: header/footer injection, flat-file CMS overrides,
   feature flags, news rendering. No backend required (GitHub Pages safe).
   =================================================================== */
(function () {
  "use strict";

  /* ---------- Default site config (editable defaults) ---------- */
  var SITE = {
    name: "Alpha Metal Fabrication",
    short: "AMF",
    tagline: "Steel structures, pressure vessels & process equipment",
    phone: "+84 000 000 000",
    email: "info@alphametalfab.com",
    address: "Industrial Zone, Vietnam",
    nav: [
      { label: "Home", href: "index.html" },
      { label: "About", href: "about.html" },
      { label: "Capabilities", href: "capabilities.html", children: [
        { label: "Steel Structures", href: "steel-structures.html" },
        { label: "Pressure Vessels", href: "pressure-vessels.html" },
        { label: "Process Equipment", href: "process-equipment.html" }
      ] },
      { label: "Facilities", href: "facilities.html" },
      { label: "Quality", href: "quality.html" },
      { label: "Industries", href: "industries.html" },
      { label: "News", href: "news.html" },
      { label: "Contact", href: "contact.html" }
    ],
    // Track-record sections are OFF until the company has real projects/history.
    // Flip in admin (Settings) once there is content to show.
    features: { experience: false, projects: false }
  };

  /* ---------- Storage keys ---------- */
  var LS_CONTENT = "amf_content";   // { "page.html": { key: value } }
  var LS_NEWS = "amf_news";         // [ {id,title,date,excerpt,image,body} ]
  var LS_FEATURES = "amf_features"; // { experience:bool, projects:bool }

  /* ---------- Helpers ---------- */
  function pageKey() {
    var p = location.pathname.split("/").pop();
    return p && p.length ? p : "index.html";
  }
  function relRoot() {
    // All pages live at the repo root, so assets are reached directly.
    return "";
  }
  function readLS(key, fallback) {
    try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch (e) { return fallback; }
  }
  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  window.AMF = window.AMF || {};
  window.AMF.SITE = SITE;
  window.AMF.escapeHtml = escapeHtml;
  window.AMF.readLS = readLS;
  window.AMF.keys = { content: LS_CONTENT, news: LS_NEWS, features: LS_FEATURES };

  /* ---------- Header / footer markup ---------- */
  function navLinks(current, mobile) {
    return SITE.nav.map(function (item) {
      var active = item.href === current ? " active" : "";
      if (item.children && !mobile) {
        var sub = item.children.map(function (c) {
          return '<a href="' + c.href + '">' + c.label + "</a>";
        }).join("");
        return '<div class="nav__drop">' +
          '<a class="nav__link' + active + '" href="' + item.href + '">' + item.label + ' <span class="caret">▾</span></a>' +
          '<div class="nav__menu">' + sub + "</div></div>";
      }
      if (item.children && mobile) {
        var subm = item.children.map(function (c) {
          return '<a class="nav__sublink" href="' + c.href + '">' + c.label + "</a>";
        }).join("");
        return '<a class="nav__link' + active + '" href="' + item.href + '">' + item.label + "</a>" + subm;
      }
      return '<a class="nav__link' + active + '" href="' + item.href + '">' + item.label + "</a>";
    }).join("");
  }

  function buildHeader() {
    var current = pageKey();
    return '' +
    '<div class="topbar"><div class="container topbar__inner">' +
      '<div class="topbar__contact">' +
        '<a href="tel:' + SITE.phone.replace(/\s/g, "") + '">📞 <span data-bind="phone">' + SITE.phone + '</span></a>' +
        '<a href="mailto:' + SITE.email + '">✉️ <span data-bind="email">' + SITE.email + '</span></a>' +
      '</div>' +
      '<div class="topbar__certs">' +
        '<span>ISO 9001</span><span>ISO 14001</span><span>ISO 3834</span><span>ISO 1090</span><span>ASME “U”</span>' +
      '</div>' +
    '</div></div>' +
    '<header class="header" id="header"><div class="container header__inner">' +
      '<a class="brand" href="index.html"><img src="assets/img/amf-logo.png" alt="' + SITE.name + ' (AMF)"></a>' +
      '<nav class="nav" id="nav">' + navLinks(current, false) +
        '<a class="btn btn--accent btn--sm nav__cta" href="contact.html#rfq">Request a Quote</a>' +
      '</nav>' +
      '<button class="nav-toggle" id="navToggle" aria-label="Menu">☰</button>' +
    '</div>' +
      '<nav class="nav-mobile" id="navMobile">' + navLinks(current, true) +
        '<a class="btn btn--accent nav__cta" href="contact.html#rfq">Request a Quote</a>' +
      '</nav>' +
    '</header>';
  }

  function buildFooter() {
    var caps = SITE.nav.find(function (n) { return n.href === "capabilities.html"; });
    var capLinks = caps && caps.children ? caps.children.map(function (c) {
      return '<a href="' + c.href + '">' + c.label + "</a>";
    }).join("") : "";
    return '' +
    '<footer class="footer"><div class="container footer__inner">' +
      '<div class="footer__brand">' +
        '<span class="footer__logo-plate"><img src="assets/img/amf-logo.png" alt="' + SITE.name + '" class="footer__logo"></span>' +
        '<p>Alpha Metal Fabrication (AMF) — fabrication of steel structures, pressure vessels and process equipment to international standards.</p>' +
      '</div>' +
      '<div class="footer__col"><h4>Capabilities</h4>' + capLinks + '</div>' +
      '<div class="footer__col"><h4>Company</h4>' +
        '<a href="about.html">About AMF</a><a href="facilities.html">Facilities</a>' +
        '<a href="quality.html">Quality &amp; Certifications</a><a href="news.html">News</a></div>' +
      '<div class="footer__col"><h4>Contact</h4>' +
        '<a href="tel:' + SITE.phone.replace(/\s/g, "") + '" data-bind="phone">' + SITE.phone + '</a>' +
        '<a href="mailto:' + SITE.email + '" data-bind="email">' + SITE.email + '</a>' +
        '<p class="footer__certs" data-bind="address">' + SITE.address + '</p></div>' +
    '</div>' +
    '<div class="footer__bar"><div class="container">© ' + (window.AMF.year || "2026") + ' ' + SITE.name +
      ' (AMF). All rights reserved. · <a href="admin.html">Admin</a></div></div></footer>';
  }

  /* ---------- Content override application ---------- */
  function applyContent(published) {
    var local = readLS(LS_CONTENT, {});
    var page = pageKey();
    var merged = {};
    if (published && published[page]) Object.assign(merged, published[page]);
    if (local && local[page]) Object.assign(merged, local[page]);

    document.querySelectorAll("[data-edit]").forEach(function (el) {
      var k = el.getAttribute("data-edit");
      if (merged[k] != null) el.innerHTML = merged[k];
    });
    document.querySelectorAll("[data-edit-img]").forEach(function (el) {
      var k = el.getAttribute("data-edit-img");
      if (merged[k] != null && merged[k] !== "") {
        if (el.tagName === "IMG") el.src = merged[k];
        else el.style.backgroundImage = "url('" + merged[k] + "')";
      }
    });
  }

  function applyBindings(published) {
    // Global fields (phone/email/address) reflected from config or overrides.
    var local = readLS(LS_CONTENT, {});
    var pg = (published && published.global) || {};
    var lg = (local && local.global) || {};
    var g = Object.assign({}, pg, lg);
    var map = { phone: g.phone || SITE.phone, email: g.email || SITE.email, address: g.address || SITE.address };
    // keep SITE in sync so contact form / mailto use the live email
    if (g.email) SITE.email = g.email;
    if (g.phone) SITE.phone = g.phone;
    if (g.address) SITE.address = g.address;
    document.querySelectorAll("[data-bind]").forEach(function (el) {
      var k = el.getAttribute("data-bind");
      if (map[k] != null) el.textContent = map[k];
    });
  }

  function applyFeatures() {
    var f = Object.assign({}, SITE.features, readLS(LS_FEATURES, {}));
    document.querySelectorAll("[data-feature]").forEach(function (el) {
      var k = el.getAttribute("data-feature");
      el.style.display = f[k] ? "" : "none";
    });
  }

  /* ---------- Interactions ---------- */
  function wireInteractions() {
    var header = document.getElementById("header");
    function onScroll() {
      if (!header) return;
      header.classList.toggle("scrolled", window.scrollY > 8);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    var toggle = document.getElementById("navToggle");
    var mobile = document.getElementById("navMobile");
    if (toggle && mobile) {
      toggle.addEventListener("click", function () { mobile.classList.toggle("open"); });
      mobile.addEventListener("click", function (e) {
        if (e.target.tagName === "A") mobile.classList.remove("open");
      });
    }
  }

  /* ---------- News (public pages) ---------- */
  window.AMF.loadNews = function () {
    // localStorage working copy wins; else fetch published news.json.
    var local = readLS(LS_NEWS, null);
    if (local) return Promise.resolve(local);
    return fetch("assets/data/news.json").then(function (r) { return r.ok ? r.json() : []; })
      .catch(function () { return []; });
  };

  window.AMF.renderNewsList = function (el) {
    window.AMF.loadNews().then(function (items) {
      if (!items.length) { el.innerHTML = '<p class="muted">No news yet. Check back soon.</p>'; return; }
      el.innerHTML = items.map(function (n) {
        var img = n.image ? '<div class="ncard__img" style="background-image:url(\'' + n.image + '\')"></div>'
                          : '<div class="ncard__img ncard__img--ph"></div>';
        return '<a class="ncard" href="news-detail.html?id=' + encodeURIComponent(n.id) + '">' + img +
          '<div class="ncard__body"><span class="ncard__date">' + escapeHtml(n.date || "") + '</span>' +
          '<h3>' + escapeHtml(n.title) + '</h3><p>' + escapeHtml(n.excerpt || "") + '</p>' +
          '<span class="card__link">Read more →</span></div></a>';
      }).join("");
    });
  };

  window.AMF.renderArticle = function (el) {
    var id = new URLSearchParams(location.search).get("id");
    window.AMF.loadNews().then(function (items) {
      var n = items.filter(function (x) { return String(x.id) === String(id); })[0];
      if (!n) { el.innerHTML = '<p class="muted">Article not found. <a href="news.html">Back to news</a></p>'; return; }
      document.title = n.title + " — " + SITE.name;
      var hero = n.image ? '<div class="article__hero" style="background-image:url(\'' + n.image + '\')"></div>' : "";
      el.innerHTML = hero + '<span class="ncard__date">' + escapeHtml(n.date || "") + '</span>' +
        '<h1>' + escapeHtml(n.title) + '</h1>' +
        '<div class="article__body">' + (n.body || "<p></p>") + '</div>' +
        '<p><a class="btn btn--ghost-dark" href="news.html">← All news</a></p>';
    });
  };

  /* ---------- Boot ---------- */
  function boot() {
    var h = document.getElementById("site-header");
    if (h) h.innerHTML = buildHeader();
    var f = document.getElementById("site-footer");
    if (f) f.innerHTML = buildFooter();

    wireInteractions();
    applyFeatures();

    // Load published overrides, then apply (local overrides layered on top).
    fetch("assets/data/content.json")
      .then(function (r) { return r.ok ? r.json() : {}; })
      .catch(function () { return {}; })
      .then(function (published) {
        applyContent(published);
        applyBindings(published);
        // expose for admin defaults discovery
        window.AMF._published = published;
      });

    // Page-specific render hooks
    var nl = document.getElementById("news-list");
    if (nl) window.AMF.renderNewsList(nl);
    var art = document.getElementById("article");
    if (art) window.AMF.renderArticle(art);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
