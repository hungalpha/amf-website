/* ===================================================================
   AMF Admin — flat-file CMS editor (localStorage working copy → JSON export)
   =================================================================== */
(function () {
  "use strict";

  var K = {
    content: "amf_content",
    news: "amf_news",
    features: "amf_features",
    pass: "amf_admin_pass",
    authed: "amf_admin_authed"
  };
  var DEFAULT_PASS = "amf-admin";

  var PAGES = [
    "index.html", "about.html", "capabilities.html",
    "steel-structures.html", "pressure-vessels.html", "process-equipment.html",
    "facilities.html", "quality.html", "industries.html",
    "news.html", "contact.html"
  ];

  function read(key, fb) { try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fb; } catch (e) { return fb; } }
  function write(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
  function $(id) { return document.getElementById(id); }
  function flash(el, msg) { if (!el) return; el.textContent = msg; setTimeout(function () { el.textContent = ""; }, 2600); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  var Admin = {};
  var pageState = { page: null, text: [], img: [] };

  /* ---------------- Auth ---------------- */
  Admin.login = function () {
    var pass = read(K.pass, DEFAULT_PASS);
    if ($("gate-pass").value === pass) {
      sessionStorage.setItem(K.authed, "1");
      showApp();
    } else { alert("Incorrect passphrase."); }
  };
  Admin.logout = function () { sessionStorage.removeItem(K.authed); location.reload(); };
  Admin.setPass = function () {
    var v = $("new-pass").value.trim();
    if (!v) return;
    write(K.pass, v); $("new-pass").value = ""; flash($("pass-saved"), "Passphrase updated ✓");
  };

  function showApp() {
    $("gate").style.display = "none";
    $("app").style.display = "block";
    initTabs(); initPages(); renderNewsAdmin(); loadGlobal(); loadFeatures();
  }

  /* ---------------- Tabs ---------------- */
  function initTabs() {
    document.querySelectorAll(".tab").forEach(function (t) {
      t.addEventListener("click", function () {
        document.querySelectorAll(".tab").forEach(function (x) { x.classList.remove("active"); });
        document.querySelectorAll(".panel").forEach(function (x) { x.classList.remove("active"); });
        t.classList.add("active");
        $("panel-" + t.dataset.panel).classList.add("active");
        if (t.dataset.panel === "publish") renderPreviews();
      });
    });
  }

  /* ---------------- Pages ---------------- */
  function initPages() {
    var sel = $("page-select");
    sel.innerHTML = PAGES.map(function (p) { return '<option value="' + p + '">' + p + "</option>"; }).join("");
    sel.addEventListener("change", Admin.loadPage);
    Admin.loadPage();
  }

  Admin.loadPage = function () {
    var page = $("page-select").value;
    pageState = { page: page, text: [], img: [] };
    var wrap = $("page-fields");
    wrap.innerHTML = '<p class="muted">Loading fields…</p>';
    fetch(page).then(function (r) { return r.text(); }).then(function (html) {
      var doc = new DOMParser().parseFromString(html, "text/html");
      var content = read(K.content, {});
      var ov = content[page] || {};
      var html_out = "";

      var texts = doc.querySelectorAll("[data-edit]");
      if (texts.length) {
        html_out += '<h3 style="font-size:14px;color:#5a6b7b;margin:6px 0 10px">TEXT</h3>';
        texts.forEach(function (el, i) {
          var key = el.getAttribute("data-edit");
          var def = el.innerHTML.trim();
          var val = ov[key] != null ? ov[key] : def;
          pageState.text.push({ key: key, def: def, id: "t_" + i });
          html_out += '<div class="field"><label><span class="key">' + esc(key) + '</span></label>' +
            '<textarea id="t_' + i + '">' + esc(val) + '</textarea></div>';
        });
      }

      var imgs = doc.querySelectorAll("[data-edit-img]");
      if (imgs.length) {
        html_out += '<h3 style="font-size:14px;color:#5a6b7b;margin:18px 0 10px">IMAGES</h3>';
        imgs.forEach(function (el, i) {
          var key = el.getAttribute("data-edit-img");
          var val = ov[key] || "";
          pageState.img.push({ key: key, id: "i_" + i });
          var prev = val ? '<img src="' + esc(val) + '">' : '<img alt="">';
          html_out += '<div class="field"><label><span class="key">' + esc(key) + '</span> (background / image)</label>' +
            '<div class="imgrow">' + prev +
            '<input type="file" accept="image/*" onchange="AMFAdmin.pickImage(event,\'i_' + i + '\')"></div>' +
            '<input id="i_' + i + '" placeholder="…or paste an image URL" value="' + esc(val) + '" style="margin-top:8px">' +
            '</div>';
        });
      }

      if (!texts.length && !imgs.length) html_out = '<p class="muted">This page has no editable fields.</p>';
      wrap.innerHTML = html_out;
    });
  };

  Admin.savePage = function () {
    var content = read(K.content, {});
    var page = pageState.page;
    var obj = content[page] || {};
    pageState.text.forEach(function (f) {
      var v = $(f.id).value;
      if (v.trim() === f.def.trim()) delete obj[f.key]; // unchanged → keep default
      else obj[f.key] = v;
    });
    pageState.img.forEach(function (f) {
      var v = $(f.id).value.trim();
      if (v) obj[f.key] = v; else delete obj[f.key];
    });
    if (Object.keys(obj).length) content[page] = obj; else delete content[page];
    write(K.content, content);
    flash($("page-saved"), "Saved ✓ — open the page to preview");
  };

  Admin.resetPage = function () {
    if (!confirm("Reset all edits on " + pageState.page + " back to defaults?")) return;
    var content = read(K.content, {});
    delete content[pageState.page];
    write(K.content, content);
    Admin.loadPage();
    flash($("page-saved"), "Reset ✓");
  };

  Admin.pickImage = function (e, targetId) {
    var file = e.target.files[0]; if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      $(targetId).value = reader.result;
      var prev = e.target.parentNode.querySelector("img");
      if (prev) prev.src = reader.result;
      var np = $(targetId + "-prev"); if (np) np.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  /* ---------------- News ---------------- */
  function getNews() {
    var local = read(K.news, null);
    if (local) return Promise.resolve(local);
    return fetch("assets/data/news.json").then(function (r) { return r.ok ? r.json() : []; }).catch(function () { return []; });
  }
  function renderNewsAdmin() {
    getNews().then(function (items) {
      write(K.news, items); // promote to working copy
      var el = $("news-list-admin");
      if (!items.length) { el.innerHTML = '<p class="muted">No articles yet.</p>'; return; }
      el.innerHTML = items.map(function (n) {
        return '<div class="news-item"><div><span class="tag">' + esc(n.date || "") + '</span> <strong>' + esc(n.title) + "</strong>" +
          '<br><small>' + esc(n.excerpt || "") + "</small></div>" +
          '<div style="display:flex;gap:8px"><button class="btn btn--line btn--sm" onclick="AMFAdmin.editArticle(\'' + esc(n.id) + '\')">Edit</button>' +
          '<button class="btn btn--danger btn--sm" onclick="AMFAdmin.deleteArticle(\'' + esc(n.id) + '\')">Delete</button></div></div>';
      }).join("");
    });
  }
  Admin.newArticle = function () {
    openEditor({ id: "post-" + Date.now(), title: "", date: new Date().toISOString().slice(0, 10), excerpt: "", image: "", body: "<p></p>" }, "New article");
  };
  Admin.editArticle = function (id) {
    getNews().then(function (items) {
      var n = items.filter(function (x) { return String(x.id) === String(id); })[0];
      if (n) openEditor(n, "Edit article");
    });
  };
  function openEditor(n, title) {
    $("news-editor").style.display = "block";
    $("news-editor-title").textContent = title;
    $("n-id").value = n.id; $("n-title").value = n.title; $("n-date").value = n.date;
    $("n-excerpt").value = n.excerpt || ""; $("n-image").value = n.image || ""; $("n-body").value = n.body || "";
    $("n-image-prev").src = n.image || "";
    $("news-editor").scrollIntoView({ behavior: "smooth" });
  }
  Admin.closeArticle = function () { $("news-editor").style.display = "none"; };
  Admin.saveArticle = function () {
    var items = read(K.news, []);
    var rec = {
      id: $("n-id").value, title: $("n-title").value.trim(), date: $("n-date").value,
      excerpt: $("n-excerpt").value.trim(), image: $("n-image").value.trim(), body: $("n-body").value
    };
    if (!rec.title) { alert("Title is required."); return; }
    var idx = items.findIndex(function (x) { return String(x.id) === String(rec.id); });
    if (idx >= 0) items[idx] = rec; else items.unshift(rec);
    items.sort(function (a, b) { return (b.date || "").localeCompare(a.date || ""); });
    write(K.news, items);
    renderNewsAdmin();
    flash($("news-saved"), "Saved ✓");
    Admin.closeArticle();
  };
  Admin.deleteArticle = function (id) {
    if (!confirm("Delete this article?")) return;
    var items = read(K.news, []).filter(function (x) { return String(x.id) !== String(id); });
    write(K.news, items); renderNewsAdmin();
  };

  /* ---------------- Global / contact ---------------- */
  function loadGlobal() {
    var c = read(K.content, {}); var g = c.global || {};
    var S = (window.AMF && AMF.SITE) || {};
    $("g-phone").value = g.phone || S.phone || "";
    $("g-email").value = g.email || S.email || "";
    $("g-address").value = g.address || S.address || "";
  }
  Admin.saveGlobal = function () {
    var c = read(K.content, {});
    c.global = { phone: $("g-phone").value.trim(), email: $("g-email").value.trim(), address: $("g-address").value.trim() };
    write(K.content, c); flash($("global-saved"), "Saved ✓");
  };

  /* ---------------- Features ---------------- */
  function loadFeatures() {
    var f = read(K.features, {});
    $("f-projects").checked = !!f.projects;
    $("f-experience").checked = !!f.experience;
  }
  Admin.saveFeatures = function () {
    write(K.features, { projects: $("f-projects").checked, experience: $("f-experience").checked });
    flash($("features-saved"), "Saved ✓");
  };

  /* ---------------- Publish / export ---------------- */
  function renderPreviews() {
    $("preview-content").textContent = JSON.stringify(read(K.content, {}), null, 2);
    $("preview-news").textContent = JSON.stringify(read(K.news, []), null, 2);
  }
  Admin.download = function (type) {
    var data, name;
    if (type === "content") { data = read(K.content, {}); name = "content.json"; }
    else { data = read(K.news, []); name = "news.json"; }
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = name; a.click();
    URL.revokeObjectURL(a.href);
  };
  Admin.resetAll = function () {
    if (!confirm("This clears ALL local edits (page content, news, settings) in this browser. Continue?")) return;
    localStorage.removeItem(K.content); localStorage.removeItem(K.news); localStorage.removeItem(K.features);
    location.reload();
  };

  /* ---------------- Boot ---------------- */
  window.AMFAdmin = Admin;
  if (sessionStorage.getItem(K.authed) === "1") showApp();
  $("gate-pass") && $("gate-pass").addEventListener("keydown", function (e) { if (e.key === "Enter") Admin.login(); });
})();
