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
    "metal-products.html", "pressure-vessels.html", "process-equipment.html",
    "facilities.html", "quality.html", "industries.html",
    "news.html", "contact.html"
  ];

  function read(key, fb) { try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fb; } catch (e) { return fb; } }
  function write(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  /* ---------------- Admin i18n (English default, Vietnamese on toggle) ---------------- */
  var ADMIN_VI = {
    // Gate
    "Admin sign in": "Đăng nhập quản trị",
    "Enter the admin passphrase to manage content.": "Nhập mật khẩu quản trị để quản lý nội dung.",
    "Passphrase": "Mật khẩu",
    "Sign in": "Đăng nhập",
    "This is a lightweight, client-side gate for convenience. For real protection, host the admin behind authentication or a private deployment.": "Đây chỉ là lớp bảo vệ nhẹ phía trình duyệt cho tiện lợi. Để bảo mật thực sự, hãy đặt trang quản trị sau lớp xác thực hoặc triển khai riêng tư.",
    // Top bar
    "Working copy saved in this browser": "Bản nháp được lưu trong trình duyệt này",
    "View site ↗": "Xem website ↗",
    "Sign out": "Đăng xuất",
    // Tabs
    "📄 Page content": "📄 Nội dung trang",
    "📰 News": "📰 Tin tức",
    "📞 Contact info": "📞 Thông tin liên hệ",
    "⚙️ Settings": "⚙️ Cài đặt",
    "⬆️ Publish": "⬆️ Xuất bản",
    // Pages panel
    "Edit page text & images": "Chỉnh sửa văn bản & hình ảnh trang",
    "Pick a page, edit its fields, then": "Chọn một trang, chỉnh sửa các trường, rồi",
    "Save": "Lưu",
    ". Changes preview instantly on the live site in this browser. Use": ". Thay đổi hiển thị ngay trên website trong trình duyệt này. Dùng",
    "Publish": "Xuất bản",
    "to make them permanent for everyone.": "để áp dụng vĩnh viễn cho mọi người.",
    "Page:": "Trang:",
    "Reload": "Tải lại",
    "💾 Save page": "💾 Lưu trang",
    "Reset this page to defaults": "Đặt lại trang này về mặc định",
    "Loading fields…": "Đang tải các trường…",
    "TEXT": "VĂN BẢN",
    "IMAGES": "HÌNH ẢNH",
    "(background / image)": "(nền / hình ảnh)",
    "…or paste an image URL": "…hoặc dán URL hình ảnh",
    "This page has no editable fields.": "Trang này không có trường nào để chỉnh sửa.",
    // News panel
    "News articles": "Bài viết tin tức",
    "Add, edit or remove news posts. They appear on the News page and the homepage feed.": "Thêm, sửa hoặc xóa bài tin tức. Chúng hiển thị ở trang Tin tức và mục tin trên trang chủ.",
    "+ New article": "+ Bài viết mới",
    "Edit article": "Chỉnh sửa bài viết",
    "New article": "Bài viết mới",
    "Title": "Tiêu đề",
    "Date": "Ngày",
    "Excerpt (short summary)": "Tóm tắt (mô tả ngắn)",
    "Cover image": "Ảnh bìa",
    "Body (HTML allowed)": "Nội dung (cho phép HTML)",
    "💾 Save article": "💾 Lưu bài viết",
    "Cancel": "Hủy",
    "No articles yet.": "Chưa có bài viết nào.",
    "Edit": "Sửa",
    "Delete": "Xóa",
    // Contact info
    "Contact information": "Thông tin liên hệ",
    "Used across the header, footer and contact page.": "Được dùng ở header, footer và trang liên hệ.",
    "Phone": "Điện thoại",
    "Email": "Email",
    "Address": "Địa chỉ",
    "💾 Save contact info": "💾 Lưu thông tin liên hệ",
    // Settings
    "Optional sections": "Mục tùy chọn",
    "AMF is a new company, so track-record sections are hidden. Turn them on once you have content to show.": "AMF là công ty mới nên các mục về kinh nghiệm/dự án đang được ẩn. Hãy bật khi bạn có nội dung để hiển thị.",
    "Show": "Hiển thị",
    "“Selected projects”": "“Dự án tiêu biểu”",
    "section (homepage)": "mục (trang chủ)",
    "“Company milestones / history”": "“Cột mốc / lịch sử công ty”",
    "section (About)": "mục (Giới thiệu)",
    "💾 Save settings": "💾 Lưu cài đặt",
    "Change passphrase": "Đổi mật khẩu",
    "Stored in this browser only.": "Chỉ lưu trong trình duyệt này.",
    "New passphrase": "Mật khẩu mới",
    "Update passphrase": "Cập nhật mật khẩu",
    // Publish
    "Publish your changes": "Xuất bản thay đổi của bạn",
    "Your edits are saved in this browser. To make them visible to everyone, download the two data files and commit them to the GitHub repository (they live in": "Các chỉnh sửa của bạn được lưu trong trình duyệt này. Để mọi người thấy được, hãy tải hai tệp dữ liệu và commit vào kho GitHub (chúng nằm trong",
    "⬇️ Download content.json": "⬇️ Tải content.json",
    "⬇️ Download news.json": "⬇️ Tải news.json",
    "How to publish (one time setup is easy):": "Cách xuất bản (thiết lập một lần rất dễ):",
    "1. Click the two download buttons above.": "1. Nhấn hai nút tải ở trên.",
    "3. Commit & push (or drag-drop them in GitHub's web UI). GitHub Pages updates automatically.": "3. Commit & push (hoặc kéo-thả trên giao diện web GitHub). GitHub Pages tự cập nhật.",
    "Preview: content.json": "Xem trước: content.json",
    "Preview: news.json": "Xem trước: news.json",
    "⚠️ Reset all local changes": "⚠️ Đặt lại toàn bộ thay đổi cục bộ",
    // Flash / dialogs
    "Passphrase updated ✓": "Đã cập nhật mật khẩu ✓",
    "Saved ✓ — open the page to preview": "Đã lưu ✓ — mở trang để xem trước",
    "Reset ✓": "Đã đặt lại ✓",
    "Saved ✓": "Đã lưu ✓",
    "Incorrect passphrase.": "Sai mật khẩu.",
    "Reset all edits on this page back to defaults?": "Đặt lại toàn bộ chỉnh sửa của trang này về mặc định?",
    "Title is required.": "Cần nhập tiêu đề.",
    "Delete this article?": "Xóa bài viết này?",
    "This clears ALL local edits (page content, news, settings) in this browser. Continue?": "Thao tác này xóa TOÀN BỘ chỉnh sửa cục bộ (nội dung trang, tin tức, cài đặt) trong trình duyệt này. Tiếp tục?"
  };
  function aNorm(s) { return String(s).replace(/\s+/g, " ").trim(); }
  function adminLang() { try { return localStorage.getItem("amf_lang") === "vi" ? "vi" : "en"; } catch (e) { return "en"; } }
  function tr(k) { return (adminLang() === "vi" && ADMIN_VI[k] != null) ? ADMIN_VI[k] : k; }
  function flash(el, msg) { if (!el) return; el.textContent = tr(msg); setTimeout(function () { el.textContent = ""; }, 2600); }
  function adminTranslate() {
    var lang = adminLang();
    var skip = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1, INPUT: 1, OPTION: 1, PRE: 1 };
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null), n, nodes = [];
    while ((n = w.nextNode())) nodes.push(n);
    nodes.forEach(function (node) {
      var p = node.parentNode;
      if (!p || skip[p.nodeName] || p.id === "admin-lang" || p.id === "gate-lang") return;
      if (p.classList && p.classList.contains("key")) return; // technical field keys
      if (node.__en === undefined) node.__en = node.nodeValue;
      var key = aNorm(node.__en); if (!key) return;
      if (lang === "vi" && ADMIN_VI[key] != null) {
        var lead = (node.__en.match(/^\s*/) || [""])[0], trail = (node.__en.match(/\s*$/) || [""])[0];
        node.nodeValue = lead + ADMIN_VI[key] + trail;
      } else { node.nodeValue = node.__en; }
    });
    document.querySelectorAll("[placeholder]").forEach(function (el) {
      if (el.__enPh === undefined) el.__enPh = el.getAttribute("placeholder") || "";
      var key = aNorm(el.__enPh);
      el.setAttribute("placeholder", (lang === "vi" && ADMIN_VI[key] != null) ? ADMIN_VI[key] : el.__enPh);
    });
    ["admin-lang", "gate-lang"].forEach(function (id) { var b = document.getElementById(id); if (b) b.textContent = lang === "vi" ? "English" : "Tiếng Việt"; });
  }

  var Admin = {};
  var pageState = { page: null, text: [], img: [] };

  /* ---------------- Auth ---------------- */
  Admin.login = function () {
    var pass = read(K.pass, DEFAULT_PASS);
    if ($("gate-pass").value === pass) {
      sessionStorage.setItem(K.authed, "1");
      showApp();
    } else { alert(tr("Incorrect passphrase.")); }
  };
  Admin.logout = function () { sessionStorage.removeItem(K.authed); location.reload(); };
  Admin.toggleLang = function () { var l = adminLang() === "vi" ? "en" : "vi"; try { localStorage.setItem("amf_lang", l); } catch (e) {} adminTranslate(); };
  Admin.setPass = function () {
    var v = $("new-pass").value.trim();
    if (!v) return;
    write(K.pass, v); $("new-pass").value = ""; flash($("pass-saved"), "Passphrase updated ✓");
  };

  function showApp() {
    $("gate").style.display = "none";
    $("app").style.display = "block";
    initTabs(); initPages(); renderNewsAdmin(); loadGlobal(); loadFeatures();
    adminTranslate();
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
      adminTranslate();
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
    if (!confirm(tr("Reset all edits on this page back to defaults?"))) return;
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
      if (!items.length) { el.innerHTML = '<p class="muted">No articles yet.</p>'; adminTranslate(); return; }
      el.innerHTML = items.map(function (n) {
        return '<div class="news-item"><div><span class="tag">' + esc(n.date || "") + '</span> <strong>' + esc(n.title) + "</strong>" +
          '<br><small>' + esc(n.excerpt || "") + "</small></div>" +
          '<div style="display:flex;gap:8px"><button class="btn btn--line btn--sm" onclick="AMFAdmin.editArticle(\'' + esc(n.id) + '\')">Edit</button>' +
          '<button class="btn btn--danger btn--sm" onclick="AMFAdmin.deleteArticle(\'' + esc(n.id) + '\')">Delete</button></div></div>';
      }).join("");
      adminTranslate();
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
    $("news-editor-title").textContent = tr(title);
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
    if (!rec.title) { alert(tr("Title is required.")); return; }
    var idx = items.findIndex(function (x) { return String(x.id) === String(rec.id); });
    if (idx >= 0) items[idx] = rec; else items.unshift(rec);
    items.sort(function (a, b) { return (b.date || "").localeCompare(a.date || ""); });
    write(K.news, items);
    renderNewsAdmin();
    flash($("news-saved"), "Saved ✓");
    Admin.closeArticle();
  };
  Admin.deleteArticle = function (id) {
    if (!confirm(tr("Delete this article?"))) return;
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
    if (!confirm(tr("This clears ALL local edits (page content, news, settings) in this browser. Continue?"))) return;
    localStorage.removeItem(K.content); localStorage.removeItem(K.news); localStorage.removeItem(K.features);
    location.reload();
  };

  /* ---------------- Boot ---------------- */
  window.AMFAdmin = Admin;
  if (sessionStorage.getItem(K.authed) === "1") showApp();
  $("gate-pass") && $("gate-pass").addEventListener("keydown", function (e) { if (e.key === "Enter") Admin.login(); });
  adminTranslate(); // translate the gate (and app, if already shown) in the saved language
})();
