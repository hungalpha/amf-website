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
    email: "info@alphametalfabrication.com",
    address: "Industrial Zone, Vietnam",
    nav: [
      { label: "Home", href: "index.html" },
      { label: "About", href: "about.html" },
      { label: "Capabilities", href: "capabilities.html", children: [
        { label: "Metal Products", href: "metal-products.html" },
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
      '<div class="topbar__right">' +
        '<div class="topbar__certs">' +
          '<span>ISO 9001</span><span>ISO 14001</span><span>ISO 3834</span><span>ISO 1090</span><span>ASME “U”</span>' +
        '</div>' +
        '<button class="lang-toggle" id="langToggle" type="button">Tiếng Việt</button>' +
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

    var lang = document.getElementById("langToggle");
    if (lang) lang.addEventListener("click", function () {
      window.AMF.setLang(currentLang() === "vi" ? "en" : "vi");
    });
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
      if (!items.length) { el.innerHTML = '<p class="muted">No news yet. Check back soon.</p>'; window.AMF.applyLang(); return; }
      el.innerHTML = items.map(function (n) {
        var img = n.image ? '<div class="ncard__img" style="background-image:url(\'' + n.image + '\')"></div>'
                          : '<div class="ncard__img ncard__img--ph"></div>';
        return '<a class="ncard" href="news-detail.html?id=' + encodeURIComponent(n.id) + '">' + img +
          '<div class="ncard__body"><span class="ncard__date">' + escapeHtml(n.date || "") + '</span>' +
          '<h3>' + escapeHtml(n.title) + '</h3><p>' + escapeHtml(n.excerpt || "") + '</p>' +
          '<span class="card__link">Read more →</span></div></a>';
      }).join("");
      window.AMF.applyLang();
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
      window.AMF.applyLang();
    });
  };

  /* ---------- i18n (English default, Vietnamese on toggle) ---------- */
  var VI = {
    // Nav / header / footer
    "Home": "Trang chủ", "About": "Giới thiệu", "Capabilities": "Năng lực",
    "Metal Products": "Sản phẩm kim loại", "Pressure Vessels": "Bồn chịu áp lực",
    "Process Equipment": "Thiết bị công nghệ", "Facilities": "Nhà xưởng",
    "Quality": "Chất lượng", "Industries": "Lĩnh vực", "News": "Tin tức",
    "Contact": "Liên hệ", "Request a Quote": "Yêu cầu báo giá", "Request a Quote →": "Yêu cầu báo giá →",
    "Company": "Công ty", "About AMF": "Giới thiệu AMF", "Quality & Certifications": "Chất lượng & Chứng nhận",
    "Admin": "Quản trị", "Industrial Zone, Vietnam": "Khu công nghiệp, Việt Nam",
    "Alpha Metal Fabrication (AMF) — fabrication of steel structures, pressure vessels and process equipment to international standards.": "Alpha Metal Fabrication (AMF) — chế tạo kết cấu thép, bồn chịu áp lực và thiết bị công nghệ theo tiêu chuẩn quốc tế.",
    "© 2026 Alpha Metal Fabrication (AMF). All rights reserved. ·": "© 2026 Alpha Metal Fabrication (AMF). Bảo lưu mọi quyền. ·",
    // Shared buttons / labels
    "Explore →": "Tìm hiểu →", "View details →": "Xem chi tiết →", "Contact Us →": "Liên hệ →",
    "← All news": "← Tất cả tin tức", "Read more →": "Xem thêm →",
    "No news yet. Check back soon.": "Chưa có tin tức. Vui lòng quay lại sau.",
    "Overview": "Tổng quan", "Specifications": "Thông số", "Typical scope & standards": "Phạm vi & tiêu chuẩn điển hình",
    "Certified to": "Chứng nhận",
    // Breadcrumb tails
    "/ About": "/ Giới thiệu", "/ Capabilities": "/ Năng lực", "/ Metal Products": "/ Sản phẩm kim loại",
    "/ Pressure Vessels": "/ Bồn chịu áp lực", "/ Process Equipment": "/ Thiết bị công nghệ",
    "/ Facilities": "/ Nhà xưởng", "/ Quality": "/ Chất lượng", "/ Industries": "/ Lĩnh vực",
    "/ News": "/ Tin tức", "/ Contact": "/ Liên hệ", "/ Article": "/ Bài viết",
    // Home
    "Precision metal fabrication for": "Chế tạo cơ khí chính xác cho",
    "steel structures, pressure vessels & process equipment": "kết cấu thép, bồn chịu áp lực & thiết bị công nghệ",
    "A modern fabrication facility serving the oil & gas, power and steel industries — engineering, fabrication, blasting, painting and testing under one roof, to international codes and standards.": "Nhà máy chế tạo hiện đại phục vụ các ngành dầu khí, điện và thép — kỹ thuật, chế tạo, làm sạch bề mặt, sơn và kiểm định trong cùng một cơ sở, theo các tiêu chuẩn và quy phạm quốc tế.",
    "Our Capabilities": "Năng lực của chúng tôi", "What we do": "Chúng tôi làm gì",
    "Three core fabrication capabilities": "Ba năng lực chế tạo cốt lõi",
    "From heavy structural steel to coded pressure equipment — fabricated in carbon, stainless and alloy steels.": "Từ kết cấu thép nặng đến thiết bị chịu áp lực theo tiêu chuẩn — chế tạo từ thép carbon, thép không gỉ và thép hợp kim.",
    "Carbon, stainless and alloy steel structures — frames, platforms, supports and heavy fabrications to ISO 1090 / AWS D1.1.": "Kết cấu thép carbon, không gỉ và hợp kim — khung, sàn thao tác, gối đỡ và kết cấu nặng theo ISO 1090 / AWS D1.1.",
    "ASME Section VIII Div. 1 pressure vessels and tanks, fabricated under our ASME “U” stamp and ISO 3834 welding system.": "Bồn chịu áp lực và bồn chứa theo ASME Section VIII Div. 1, chế tạo theo dấu ASME “U” và hệ thống hàn ISO 3834.",
    "Skids, columns, drums, heat-transfer and non-standard process equipment built to client drawings and specifications.": "Skid, tháp, bồn, thiết bị trao đổi nhiệt và thiết bị công nghệ phi tiêu chuẩn chế tạo theo bản vẽ và yêu cầu của khách hàng.",
    "Our facility": "Cơ sở của chúng tôi", "Built for heavy, large-scale fabrication": "Được xây dựng cho chế tạo hạng nặng, quy mô lớn",
    "Covered workshop": "Nhà xưởng có mái che", "Overhead cranes (100 t tandem lift)": "Cầu trục (nâng đôi 100 tấn)",
    "Open yard": "Bãi ngoài trời", "Blast & paint capacity": "Công suất làm sạch & sơn",
    "Tour our facilities →": "Tham quan nhà xưởng →",
    "Why Alpha Metal Fabrication": "Vì sao chọn Alpha Metal Fabrication",
    "A new plant built around proven standards": "Nhà máy mới xây dựng trên các tiêu chuẩn đã được kiểm chứng",
    "AMF combines a modern, large-capacity workshop with internationally certified management systems and qualified welding personnel — so every package is delivered with full traceability and documentation.": "AMF kết hợp nhà xưởng hiện đại, công suất lớn với hệ thống quản lý đạt chứng nhận quốc tế và đội ngũ thợ hàn có chứng chỉ — để mỗi gói công việc được bàn giao với đầy đủ hồ sơ và truy xuất nguồn gốc.",
    "Quality, environmental and welding systems: ISO 9001, ISO 14001, ISO 3834": "Hệ thống chất lượng, môi trường và hàn: ISO 9001, ISO 14001, ISO 3834",
    "ASME “U” stamp and ISO 1090 execution for structures & vessels": "Dấu ASME “U” và thực hiện theo ISO 1090 cho kết cấu & bồn áp lực",
    "Certified welders and procedures (WPS/PQR), in-house NDT coordination": "Thợ hàn và quy trình được chứng nhận (WPS/PQR), điều phối NDT nội bộ",
    "Full material traceability and project documentation (data books)": "Truy xuất nguồn gốc vật liệu đầy đủ và hồ sơ dự án (data book)",
    "More about AMF →": "Tìm hiểu thêm về AMF →", "20,000 m² covered workshop": "Nhà xưởng có mái che 20.000 m²",
    "Where our fabrications are used": "Nơi sản phẩm của chúng tôi được sử dụng",
    "Oil & Gas": "Dầu khí", "Power": "Điện", "Steel": "Thép",
    "Pressure vessels, skids and structural packages for upstream, midstream and downstream.": "Bồn chịu áp lực, skid và gói kết cấu cho thượng nguồn, trung nguồn và hạ nguồn.",
    "Structures and equipment for thermal, gas and renewable power plants.": "Kết cấu và thiết bị cho nhà máy nhiệt điện, điện khí và năng lượng tái tạo.",
    "Heavy fabrications and process equipment for steelmaking and metals plants.": "Kết cấu nặng và thiết bị công nghệ cho nhà máy luyện thép và kim loại.",
    "How we work": "Cách chúng tôi làm việc", "From drawing to delivery": "Từ bản vẽ đến bàn giao",
    "Engineering & MTO": "Kỹ thuật & MTO", "Drawing review, fabrication engineering and material take-off.": "Rà soát bản vẽ, kỹ thuật chế tạo và bóc tách vật tư.",
    "Fabrication & Welding": "Chế tạo & Hàn", "Cutting, rolling, fit-up and welding to approved WPS.": "Cắt, lốc, lắp ráp và hàn theo WPS đã phê duyệt.",
    "Inspection & NDT": "Kiểm tra & NDT", "Dimensional checks, NDT, pressure testing and third-party witness.": "Kiểm tra kích thước, NDT, thử áp và giám định bên thứ ba.",
    "Blast, Paint & Delivery": "Làm sạch, Sơn & Bàn giao", "Surface preparation, coating, packing and delivery.": "Chuẩn bị bề mặt, sơn phủ, đóng gói và bàn giao.",
    "Track record": "Kinh nghiệm", "Selected projects": "Dự án tiêu biểu",
    "Project references will appear here once published. Enable this section in Admin → Settings.": "Các dự án tham khảo sẽ xuất hiện ở đây khi được công bố. Bật mục này trong Quản trị → Cài đặt.",
    "Have a fabrication package to quote?": "Bạn có gói chế tạo cần báo giá?",
    "Send us your drawings or specifications — our team will respond promptly with a proposal.": "Gửi cho chúng tôi bản vẽ hoặc yêu cầu kỹ thuật — đội ngũ của chúng tôi sẽ phản hồi nhanh chóng bằng một đề xuất.",
    // About
    "About Alpha Metal Fabrication": "Giới thiệu Alpha Metal Fabrication",
    "A modern fabrication company built around international standards, a large-capacity workshop and qualified people.": "Một công ty chế tạo hiện đại xây dựng trên các tiêu chuẩn quốc tế, nhà xưởng công suất lớn và đội ngũ nhân sự lành nghề.",
    "Who we are": "Chúng tôi là ai", "Engineering-led metal fabrication": "Chế tạo cơ khí dẫn dắt bởi kỹ thuật",
    "Alpha Metal Fabrication (AMF) fabricates carbon, stainless and alloy steel structures, ASME pressure vessels and process equipment for the oil & gas, power and steel industries. Our investment in a large covered workshop, heavy lifting capacity and an international-standard blast & paint shop lets us take on demanding packages from a single, controlled facility.": "Alpha Metal Fabrication (AMF) chế tạo kết cấu thép carbon, thép không gỉ và thép hợp kim, bồn chịu áp lực ASME và thiết bị công nghệ cho các ngành dầu khí, điện và thép. Việc đầu tư nhà xưởng có mái che rộng lớn, năng lực nâng hạ tải nặng và xưởng làm sạch & sơn đạt tiêu chuẩn quốc tế giúp chúng tôi đảm nhận các gói công việc phức tạp ngay tại một cơ sở được kiểm soát chặt chẽ.",
    "As a newly established company, our focus is straightforward: deliver to code, on schedule, with complete documentation. We back every package with certified management systems, qualified welding procedures and full material traceability — so clients receive fabrication they can rely on from day one.": "Là một công ty mới thành lập, mục tiêu của chúng tôi rất rõ ràng: bàn giao đúng tiêu chuẩn, đúng tiến độ và đầy đủ hồ sơ. Mỗi gói công việc được hỗ trợ bởi hệ thống quản lý đạt chứng nhận, quy trình hàn được phê duyệt và truy xuất nguồn gốc vật liệu đầy đủ — để khách hàng nhận được sản phẩm chế tạo đáng tin cậy ngay từ ngày đầu.",
    "AMF workshop": "Nhà xưởng AMF", "What guides us": "Giá trị định hướng", "Our commitments": "Cam kết của chúng tôi",
    "Quality & Code Compliance": "Chất lượng & Tuân thủ tiêu chuẩn",
    "Work executed to ASME, ISO 3834 and ISO 1090 with independent inspection and full documentation.": "Công việc thực hiện theo ASME, ISO 3834 và ISO 1090 với kiểm định độc lập và hồ sơ đầy đủ.",
    "Safety & Environment": "An toàn & Môi trường",
    "An ISO 14001-aligned, safety-first culture across the workshop and yard.": "Văn hóa ưu tiên an toàn, phù hợp ISO 14001 trên toàn nhà xưởng và bãi.",
    "Delivery & Transparency": "Tiến độ & Minh bạch",
    "Realistic schedules, clear reporting and proactive communication on every package.": "Tiến độ thực tế, báo cáo rõ ràng và trao đổi chủ động trên mỗi gói công việc.",
    "Our journey": "Hành trình của chúng tôi", "Company milestones": "Cột mốc công ty",
    "Company history and milestones will appear here once published. Enable in Admin → Settings.": "Lịch sử và các cột mốc của công ty sẽ xuất hiện ở đây khi được công bố. Bật trong Quản trị → Cài đặt.",
    "Let's build it together": "Cùng nhau kiến tạo",
    "Tell us about your scope and we'll show you how AMF can deliver.": "Hãy cho chúng tôi biết phạm vi công việc của bạn và chúng tôi sẽ chứng minh AMF có thể thực hiện.",
    // Capabilities
    "Fabrication Capabilities": "Năng lực chế tạo",
    "One facility for structural steelwork, coded pressure equipment and process equipment — engineered, fabricated, blasted, painted and tested in-house.": "Một cơ sở cho kết cấu thép, thiết bị chịu áp lực theo tiêu chuẩn và thiết bị công nghệ — thiết kế, chế tạo, làm sạch, sơn và kiểm tra ngay tại xưởng.",
    "Carbon, stainless and alloy steel — frames, platforms, supports, pipe racks and heavy fabrications to ISO 1090 / AWS D1.1.": "Thép carbon, không gỉ và hợp kim — khung, sàn thao tác, gối đỡ, giá đỡ ống và kết cấu nặng theo ISO 1090 / AWS D1.1.",
    "ASME Section VIII Div. 1 vessels, drums, columns and tanks under our ASME “U” stamp and ISO 3834 welding system.": "Bồn, bình, tháp và bồn chứa theo ASME Section VIII Div. 1 với dấu ASME “U” và hệ thống hàn ISO 3834.",
    "Skids, modules, heat-transfer and non-standard equipment fabricated to client drawings and specifications.": "Skid, module, thiết bị trao đổi nhiệt và thiết bị phi tiêu chuẩn chế tạo theo bản vẽ và yêu cầu của khách hàng.",
    "Materials & processes": "Vật liệu & quy trình", "What we work with": "Vật liệu chúng tôi gia công",
    "Carbon Steel": "Thép carbon", "Structural and pressure-grade plate, sections and pipe.": "Thép tấm, thép hình và ống cấp kết cấu và chịu áp.",
    "Stainless Steel": "Thép không gỉ", "Austenitic and duplex grades for corrosive service.": "Mác austenitic và duplex cho môi trường ăn mòn.",
    "Alloy Steel": "Thép hợp kim", "Low-alloy and special grades for high-temperature / high-pressure duty.": "Mác hợp kim thấp và đặc biệt cho điều kiện nhiệt độ cao / áp suất cao.",
    "Surface Finishing": "Hoàn thiện bề mặt", "Blast & paint to international standards, up to 1,500 m²/day.": "Làm sạch & sơn theo tiêu chuẩn quốc tế, tới 1.500 m²/ngày.",
    "Need a specific capability?": "Cần một năng lực cụ thể?",
    "Send your scope and we'll confirm fit, schedule and budget.": "Gửi phạm vi công việc và chúng tôi sẽ xác nhận khả năng đáp ứng, tiến độ và chi phí.",
    // Metal products
    "Equipment baseframes & structures, ducts & stacks, dampers, shelters and offshore foundation structures in carbon, stainless and alloy steel.": "Khung bệ & kết cấu thiết bị, đường ống gió & ống khói, van điều tiết, mái che và kết cấu móng ngoài khơi bằng thép carbon, không gỉ và hợp kim.",
    "Equipment baseframes, ducting, offshore foundations and fabricated metal products in carbon, stainless and alloy steel.": "Khung bệ thiết bị, đường ống gió, móng ngoài khơi và sản phẩm kim loại chế tạo bằng thép carbon, không gỉ và hợp kim.",
    "Fabricated metal products, fully finished": "Sản phẩm kim loại gia công, hoàn thiện trọn gói",
    "AMF fabricates a wide range of metal products — from equipment baseframes and ducting to offshore foundation structures — starting from raw plate and sections through to blasted, painted and marked assemblies ready for site. Our large covered workshop and 50-tonne crane capacity (100-tonne tandem) let us handle heavy, oversized fabrications in a single controlled environment.": "AMF chế tạo đa dạng sản phẩm kim loại — từ khung bệ thiết bị và đường ống gió đến kết cấu móng ngoài khơi — bắt đầu từ thép tấm và thép hình thô đến các cụm đã được làm sạch, sơn và đánh dấu sẵn sàng đưa ra công trường. Nhà xưởng có mái che rộng lớn và cầu trục 50 tấn (nâng đôi 100 tấn) cho phép chúng tôi xử lý các sản phẩm nặng, quá khổ trong một môi trường được kiểm soát.",
    "Equipment baseframes and structures": "Khung bệ và kết cấu thiết bị",
    "Duct & stack, damper and shelter for large equipment": "Đường ống gió & ống khói, van điều tiết và mái che cho thiết bị lớn",
    "Offshore foundation structures": "Kết cấu móng ngoài khơi",
    "Platforms, walkways, stairs, handrails and access steel": "Sàn thao tác, lối đi, cầu thang, tay vịn và kết cấu tiếp cận",
    "Metal products fabrication": "Chế tạo sản phẩm kim loại",
    "Have a fabrication package?": "Bạn có gói cần chế tạo?",
    "AMF fabricates structural steel from raw plate and sections through to blasted, painted and marked assemblies ready for site. Our large covered workshop and 50-tonne crane capacity (100-tonne tandem) let us handle heavy, oversized modules in a single controlled environment.": "AMF chế tạo kết cấu thép từ thép tấm và thép hình thô đến các cụm đã được làm sạch, sơn và đánh dấu sẵn sàng đưa ra công trường. Nhà xưởng có mái che rộng lớn và cầu trục 50 tấn (nâng đôi 100 tấn) cho phép chúng tôi xử lý các module nặng, quá khổ trong một môi trường được kiểm soát.",
    "Primary & secondary structures, platforms and walkways": "Kết cấu chính & phụ, sàn thao tác và lối đi",
    "Pipe racks, support structures and equipment supports": "Giá đỡ ống, kết cấu đỡ và gối đỡ thiết bị",
    "Stairs, handrails, ladders and access steel": "Cầu thang, tay vịn, thang và kết cấu tiếp cận",
    "Heavy and oversized modular fabrications": "Kết cấu module nặng và quá khổ", "Structural fabrication": "Chế tạo kết cấu",
    "Materials": "Vật liệu", "Carbon steel, stainless steel, alloy steel": "Thép carbon, thép không gỉ, thép hợp kim",
    "Standards": "Tiêu chuẩn", "ISO 1090 (EXC1–EXC4), AWS D1.1, EN 1090, client specifications": "ISO 1090 (EXC1–EXC4), AWS D1.1, EN 1090, yêu cầu kỹ thuật của khách hàng",
    "Welding system": "Hệ thống hàn", "ISO 3834-2; qualified WPS/PQR and certified welders": "ISO 3834-2; WPS/PQR được phê duyệt và thợ hàn có chứng chỉ",
    "Surface preparation": "Chuẩn bị bề mặt", "Abrasive blasting to Sa 2.5; coating to international systems": "Phun bi làm sạch đạt Sa 2.5; sơn phủ theo hệ thống quốc tế",
    "Lifting capacity": "Năng lực nâng hạ", "Overhead cranes up to 50 t (100 t tandem lift)": "Cầu trục tới 50 tấn (nâng đôi 100 tấn)",
    "Inspection": "Kiểm tra", "Dimensional control, visual & NDT (VT, PT, MT, UT, RT)": "Kiểm soát kích thước, kiểm tra ngoại quan & NDT (VT, PT, MT, UT, RT)",
    "Have a structural package?": "Bạn có gói kết cấu cần chế tạo?",
    "Send drawings and a BOQ — we'll return a fabrication proposal.": "Gửi bản vẽ và BOQ — chúng tôi sẽ phản hồi đề xuất chế tạo.",
    // Pressure vessels
    "ASME Section VIII Div. 1 vessels and tanks under our ASME “U” stamp.": "Bồn và bình chịu áp lực theo ASME Section VIII Div. 1 với dấu ASME “U”.",
    "Coded pressure equipment, fully documented": "Thiết bị chịu áp theo tiêu chuẩn, hồ sơ đầy đủ",
    "AMF designs and fabricates pressure vessels to ASME Section VIII Division 1, holding the ASME “U” designator. Every vessel is welded under an ISO 3834-2 system with qualified procedures, inspected and pressure-tested, and delivered with a complete manufacturing data book.": "AMF thiết kế và chế tạo bồn chịu áp lực theo ASME Section VIII Division 1, sở hữu dấu ASME “U”. Mỗi bồn được hàn theo hệ thống ISO 3834-2 với quy trình được phê duyệt, được kiểm tra và thử áp, và bàn giao kèm bộ hồ sơ chế tạo đầy đủ.",
    "Pressure vessels, drums, separators and accumulators": "Bồn chịu áp lực, bình, thiết bị tách và bình tích",
    "Columns, towers and reactors": "Tháp, cột và thiết bị phản ứng",
    "Storage tanks and atmospheric vessels": "Bồn chứa và bồn thường áp",
    "Carbon, stainless and alloy steel construction": "Chế tạo bằng thép carbon, không gỉ và hợp kim",
    "ASME “U” fabrication": "Chế tạo theo ASME “U”", "Code": "Tiêu chuẩn",
    "ASME Section VIII Division 1 — ASME “U” stamp": "ASME Section VIII Division 1 — dấu ASME “U”",
    "Examination": "Kiểm tra", "RT / UT / PT / MT, PWHT as required, hydrostatic / pneumatic testing": "RT / UT / PT / MT, PWHT khi cần, thử áp bằng nước / khí",
    "Documentation": "Hồ sơ", "Full manufacturing data book with material traceability": "Bộ hồ sơ chế tạo đầy đủ kèm truy xuất nguồn gốc vật liệu",
    "Need a coded vessel?": "Cần bồn chịu áp theo tiêu chuẩn?",
    "Share your datasheet and drawings for a fabrication proposal.": "Gửi datasheet và bản vẽ để nhận đề xuất chế tạo.",
    // Process equipment
    "Engineering, fabrication, mechanical & E&I assembly and testing of skids, modules and non-standard equipment.": "Thiết kế, chế tạo, lắp ráp cơ khí & E&I và thử nghiệm các skid, module và thiết bị phi tiêu chuẩn.",
    "From customer engineering and detail design through fabrication to mechanical and E&I finished assembly and testing, AMF delivers complete, ready-to-install process equipment and modules — combining structural steel, piping, tubing and E&I into delivery-ready packages that reduce site work, improve quality control and shorten installation time on your project.": "Từ thiết kế kỹ thuật và thiết kế chi tiết theo yêu cầu khách hàng, qua chế tạo, đến lắp ráp hoàn thiện cơ khí và E&I và thử nghiệm, AMF bàn giao thiết bị công nghệ và module hoàn chỉnh, sẵn sàng lắp đặt — kết hợp kết cấu thép, đường ống, tubing và E&I thành các gói sẵn sàng bàn giao, giúp giảm khối lượng thi công tại công trường, nâng cao kiểm soát chất lượng và rút ngắn thời gian lắp đặt cho dự án của bạn.",
    "Customer engineering & detail design to client requirements": "Thiết kế kỹ thuật & thiết kế chi tiết theo yêu cầu của khách hàng",
    "Mechanical and E&I finished assembly (tubing, E&I) and testing": "Lắp ráp hoàn thiện cơ khí và E&I (tubing, điện & đo lường điều khiển) và thử nghiệm",
    "Engineering": "Thiết kế kỹ thuật",
    "Assembly": "Lắp ráp",
    "Assembly workshop": "Xưởng lắp ráp",
    "22 m clear height, 50 t tandem overhead cranes, skilled assembly workforce": "Chiều cao thông thủy 22 m, cầu trục nâng đôi 50 tấn, đội ngũ lắp ráp lành nghề",
    // Facilities — assembly workshop & logistics
    "Assembly Workshop — 22 m height": "Xưởng lắp ráp — cao 22 m",
    "Dedicated high-bay assembly workshop (22 m clear height) with 50 t tandem overhead cranes for mechanical and E&I finished assembly and testing by skilled assembly technicians.": "Xưởng lắp ráp cao tầng chuyên dụng (thông thủy 22 m) với cầu trục nâng đôi 50 tấn cho lắp ráp hoàn thiện cơ khí và E&I và thử nghiệm bởi đội ngũ kỹ thuật viên lành nghề.",
    "Location & logistics": "Vị trí & logistics",
    "Close to major ports": "Gần các cảng lớn",
    "AMF's facility sits just 20 km from the nearest container port, with three major ports within 80 km — making load-out and shipping of large, heavy fabrications straightforward for both domestic projects and export.": "Nhà máy của AMF chỉ cách cảng container gần nhất 20 km, với ba cảng lớn trong bán kính 80 km — giúp việc xuất hàng và vận chuyển các sản phẩm chế tạo lớn, nặng trở nên thuận tiện cho cả dự án trong nước và xuất khẩu.",
    "20 km from the nearest container port": "Cách cảng container gần nhất 20 km",
    "Three major ports within 80 km": "Ba cảng lớn trong bán kính 80 km",
    "Lien Chieu Port, Da Nang Port, Thaco Chu Lai Port and Gemadept Dung Quat Port": "Cảng Liên Chiểu, Cảng Đà Nẵng, Cảng Thaco Chu Lai và Cảng Gemadept Dung Quất",
    "Convenient load-out for heavy and oversized shipments": "Thuận tiện xuất hàng cho các lô hàng nặng và quá khổ",
    "Near Da Nang ports": "Gần các cảng Đà Nẵng",
    "Skids, modules and non-standard equipment fabricated to your drawings.": "Skid, module và thiết bị phi tiêu chuẩn chế tạo theo bản vẽ của bạn.",
    "Custom process equipment & modules": "Thiết bị công nghệ & module theo yêu cầu",
    "AMF fabricates process equipment and pre-assembled modules that combine structural steel, piping and equipment into delivery-ready packages. Modularising scope in our workshop reduces site work, improves quality control and shortens installation time on your project.": "AMF chế tạo thiết bị công nghệ và các module lắp sẵn kết hợp kết cấu thép, đường ống và thiết bị thành các gói sẵn sàng bàn giao. Mô-đun hóa phạm vi công việc tại xưởng giúp giảm khối lượng thi công tại công trường, nâng cao kiểm soát chất lượng và rút ngắn thời gian lắp đặt cho dự án của bạn.",
    "Process and pipe skids, modular packages": "Skid công nghệ và đường ống, gói module",
    "Piping spools and pre-fabrication": "Spool ống và chế tạo sẵn",
    "Heat-transfer and non-standard equipment": "Thiết bị trao đổi nhiệt và phi tiêu chuẩn",
    "Equipment to client drawings & specifications": "Thiết bị theo bản vẽ & yêu cầu của khách hàng",
    "Modular skid fabrication": "Chế tạo skid module", "Scope": "Phạm vi",
    "Skids, modules, piping spools, non-standard equipment": "Skid, module, spool ống, thiết bị phi tiêu chuẩn",
    "Piping standards": "Tiêu chuẩn đường ống", "ASME B31.1 / B31.3 as applicable, client specifications": "ASME B31.1 / B31.3 khi áp dụng, yêu cầu kỹ thuật của khách hàng",
    "Surface finishing": "Hoàn thiện bề mặt", "Blast & paint to international standards, up to 1,500 m²/day": "Làm sạch & sơn theo tiêu chuẩn quốc tế, tới 1.500 m²/ngày",
    "Dimensional control, NDT, testing and third-party witness": "Kiểm soát kích thước, NDT, thử nghiệm và giám định bên thứ ba",
    "Modularising a package?": "Đang mô-đun hóa một gói công việc?",
    "Let's discuss how to move scope off-site into our workshop.": "Hãy trao đổi cách chuyển phạm vi công việc về xưởng của chúng tôi.",
    // Facilities
    "Facilities & Equipment": "Nhà xưởng & Thiết bị",
    "A large-capacity workshop and yard engineered for heavy, large-scale fabrication.": "Nhà xưởng và bãi công suất lớn được thiết kế cho chế tạo hạng nặng, quy mô lớn.",
    "Overhead cranes": "Cầu trục", "Max in-shop tandem lift": "Nâng đôi tối đa trong xưởng",
    "Inside the plant": "Bên trong nhà máy", "Capacity & equipment": "Công suất & thiết bị",
    "20,000 m² Covered Workshop": "Nhà xưởng có mái che 20.000 m²",
    "A fully covered, climate-protected workshop for fabrication, fit-up and welding — keeping work on schedule and to quality in any weather.": "Nhà xưởng có mái che hoàn toàn, được bảo vệ khỏi thời tiết phục vụ chế tạo, lắp ráp và hàn — đảm bảo tiến độ và chất lượng trong mọi điều kiện thời tiết.",
    "Overhead Cranes up to 50 t": "Cầu trục tới 50 tấn",
    "Multiple overhead cranes rated up to 50 tonnes, enabling tandem lifts up to 100 tonnes for heavy modules and vessels.": "Nhiều cầu trục tải trọng tới 50 tấn, cho phép nâng đôi tới 100 tấn đối với module và bồn nặng.",
    "30,000 m² Open Yard": "Bãi ngoài trời 30.000 m²",
    "Extensive open yard for material storage, large assembly, load-out and laydown of completed packages.": "Bãi ngoài trời rộng lớn để lưu kho vật tư, lắp ráp lớn, xuất hàng và tập kết các gói đã hoàn thành.",
    "Blast & Paint — 1,500 m²/day": "Làm sạch & Sơn — 1.500 m²/ngày",
    "Dedicated blast & paint shop with a throughput of up to 1,500 m²/day, applying coating systems to international standards.": "Xưởng làm sạch & sơn chuyên dụng với công suất tới 1.500 m²/ngày, áp dụng các hệ thống sơn theo tiêu chuẩn quốc tế.",
    "Surface treatment": "Xử lý bề mặt", "International-standard blast & paint": "Làm sạch & sơn theo tiêu chuẩn quốc tế",
    "Surface preparation and coating are performed in-house, so quality and schedule stay under our control. With capacity up to 1,500 m²/day, we apply protective and high-performance coating systems specified for offshore, onshore and industrial environments.": "Chuẩn bị bề mặt và sơn phủ được thực hiện nội bộ, giúp chất lượng và tiến độ luôn trong tầm kiểm soát. Với công suất tới 1.500 m²/ngày, chúng tôi áp dụng các hệ thống sơn bảo vệ và hiệu năng cao theo yêu cầu cho môi trường ngoài khơi, trên bờ và công nghiệp.",
    "Abrasive blasting to Sa 2.5 and client specifications": "Phun bi làm sạch đạt Sa 2.5 và theo yêu cầu của khách hàng",
    "Multi-coat protective & high-build systems": "Hệ thống sơn nhiều lớp bảo vệ & sơn dày",
    "DFT, adhesion and holiday testing": "Kiểm tra chiều dày màng sơn (DFT), độ bám dính và lỗ rỗ",
    "Throughput up to 1,500 m²/day": "Công suất tới 1.500 m²/ngày", "Blast & paint shop": "Xưởng làm sạch & sơn",
    "Want to visit or audit our plant?": "Muốn tham quan hoặc đánh giá nhà máy của chúng tôi?",
    "We welcome client visits and pre-qualification audits.": "Chúng tôi hoan nghênh khách hàng tham quan và đánh giá sơ tuyển.",
    // Quality
    "Certified management systems and code compliance underpin every package we deliver.": "Hệ thống quản lý đạt chứng nhận và tuân thủ tiêu chuẩn là nền tảng cho mỗi gói công việc chúng tôi bàn giao.",
    "Accreditations": "Chứng nhận", "Our certifications": "Các chứng chỉ của chúng tôi",
    "Quality management": "Quản lý chất lượng", "Environmental management": "Quản lý môi trường",
    "Welding quality system": "Hệ thống chất lượng hàn", "Execution of steel structures": "Thực hiện kết cấu thép",
    "ASME “U” Stamp": "Dấu ASME “U”", "Pressure vessels (Sec. VIII)": "Bồn chịu áp lực (Sec. VIII)",
    "Quality assurance": "Đảm bảo chất lượng", "Control at every stage": "Kiểm soát ở mọi công đoạn",
    "Quality is planned and verified from material receipt to final dispatch. We work to project-specific Inspection & Test Plans (ITPs), qualified welding procedures and independent inspection, delivering complete documentation with full material traceability.": "Chất lượng được hoạch định và kiểm chứng từ khâu tiếp nhận vật tư đến khi xuất hàng. Chúng tôi làm việc theo Kế hoạch Kiểm tra & Thử nghiệm (ITP) riêng cho từng dự án, quy trình hàn được phê duyệt và kiểm định độc lập, bàn giao hồ sơ đầy đủ kèm truy xuất nguồn gốc vật liệu.",
    "Project ITPs and quality plans": "ITP và kế hoạch chất lượng cho dự án",
    "Qualified WPS/PQR and certified welders": "WPS/PQR được phê duyệt và thợ hàn có chứng chỉ",
    "NDT: VT, PT, MT, UT, RT": "NDT: VT, PT, MT, UT, RT",
    "Pressure testing and PWHT as required": "Thử áp và PWHT khi cần",
    "Material traceability and manufacturing data books": "Truy xuất nguồn gốc vật liệu và bộ hồ sơ chế tạo",
    "Need our certificates?": "Cần các chứng chỉ của chúng tôi?",
    "We're happy to share certification documents for pre-qualification.": "Chúng tôi sẵn sàng cung cấp tài liệu chứng nhận phục vụ sơ tuyển.",
    // Industries
    "Industries We Serve": "Lĩnh vực chúng tôi phục vụ",
    "Fabrication for the demanding oil & gas, power and steel sectors.": "Chế tạo cho các lĩnh vực dầu khí, điện và thép đầy thách thức.",
    "Upstream, midstream & downstream": "Thượng nguồn, trung nguồn & hạ nguồn",
    "AMF fabricates pressure vessels, skids, modules and structural packages for oil & gas facilities — from wellhead and process equipment to plant structures — in carbon, stainless and alloy steels, to ASME and international standards.": "AMF chế tạo bồn chịu áp lực, skid, module và gói kết cấu cho các công trình dầu khí — từ thiết bị đầu giếng và thiết bị công nghệ đến kết cấu nhà máy — bằng thép carbon, không gỉ và hợp kim, theo ASME và các tiêu chuẩn quốc tế.",
    "ASME pressure vessels, drums and columns": "Bồn chịu áp lực, bình và tháp theo ASME",
    "Process & pipe skids and modules": "Skid và module công nghệ & đường ống",
    "Pipe racks and structural steelwork": "Giá đỡ ống và kết cấu thép",
    "Thermal, gas & renewable generation": "Nhiệt điện, điện khí & năng lượng tái tạo",
    "We supply structural steel and fabricated equipment for power plants — supporting structures, platforms, ducting components, tanks and process equipment — engineered for high-temperature and heavy-duty service.": "Chúng tôi cung cấp kết cấu thép và thiết bị chế tạo cho nhà máy điện — kết cấu đỡ, sàn thao tác, chi tiết đường ống gió, bồn chứa và thiết bị công nghệ — được thiết kế cho điều kiện nhiệt độ cao và làm việc nặng.",
    "Boiler and turbine hall structures": "Kết cấu lò hơi và gian tuabin",
    "Tanks, vessels and equipment supports": "Bồn chứa, bồn áp lực và gối đỡ thiết bị",
    "Alloy steel for high-temperature duty": "Thép hợp kim cho điều kiện nhiệt độ cao",
    "Steelmaking & metals plants": "Nhà máy luyện thép & kim loại",
    "For steel and metals producers, AMF fabricates heavy structures and process equipment that withstand abrasive, high-temperature operating environments — built for durability and ease of maintenance.": "Đối với các nhà sản xuất thép và kim loại, AMF chế tạo kết cấu nặng và thiết bị công nghệ chịu được môi trường mài mòn, nhiệt độ cao — bền bỉ và dễ bảo trì.",
    "Heavy structural fabrications": "Kết cấu chế tạo hạng nặng",
    "Process and handling equipment": "Thiết bị công nghệ và vận chuyển",
    "Wear- and heat-resistant material options": "Tùy chọn vật liệu chống mài mòn và chịu nhiệt",
    "In one of these sectors?": "Bạn thuộc một trong các lĩnh vực này?",
    "Tell us your scope — we'll show how AMF fits your project.": "Hãy cho chúng tôi biết phạm vi công việc — chúng tôi sẽ chứng minh AMF phù hợp với dự án của bạn.",
    // News
    "News & Updates": "Tin tức & Cập nhật", "The latest from Alpha Metal Fabrication.": "Thông tin mới nhất từ Alpha Metal Fabrication.",
    // Contact
    "Contact & Request a Quote": "Liên hệ & Yêu cầu báo giá",
    "Send us your drawings or specifications and our team will respond promptly.": "Gửi cho chúng tôi bản vẽ hoặc yêu cầu kỹ thuật và đội ngũ của chúng tôi sẽ phản hồi nhanh chóng.",
    "Get in touch": "Liên hệ", "We'd love to hear about your project": "Chúng tôi rất mong được nghe về dự án của bạn",
    "Reach us directly, or use the form and we'll get back to you with a proposal.": "Liên hệ trực tiếp với chúng tôi, hoặc dùng biểu mẫu và chúng tôi sẽ phản hồi kèm đề xuất.",
    "Phone": "Điện thoại", "Address": "Địa chỉ", "Full name": "Họ và tên",
    "Scope of work": "Phạm vi công việc", "Other / Mixed": "Khác / Hỗn hợp", "Project details": "Chi tiết dự án",
    "Describe your scope, quantities, materials, standards and timeline…": "Mô tả phạm vi, số lượng, vật liệu, tiêu chuẩn và tiến độ…",
    "Send Request": "Gửi yêu cầu"
  };

  function normSpace(s) { return String(s).replace(/\s+/g, " ").trim(); }
  function translateText(lang) {
    var skip = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1 };
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    var nodes = [], n;
    while ((n = walker.nextNode())) nodes.push(n);
    nodes.forEach(function (node) {
      var p = node.parentNode;
      if (!p || skip[p.nodeName] || p.id === "langToggle") return;
      if (node.__en === undefined) node.__en = node.nodeValue;
      var key = normSpace(node.__en);
      if (!key) return;
      if (lang === "vi" && VI[key] != null) {
        var lead = (node.__en.match(/^\s*/) || [""])[0];
        var trail = (node.__en.match(/\s*$/) || [""])[0];
        node.nodeValue = lead + VI[key] + trail;
      } else {
        node.nodeValue = node.__en;
      }
    });
  }
  function translatePlaceholders(lang) {
    document.querySelectorAll("[placeholder]").forEach(function (el) {
      if (el.__enPh === undefined) el.__enPh = el.getAttribute("placeholder") || "";
      var key = normSpace(el.__enPh);
      el.setAttribute("placeholder", (lang === "vi" && VI[key] != null) ? VI[key] : el.__enPh);
    });
  }
  function currentLang() { try { return localStorage.getItem("amf_lang") === "vi" ? "vi" : "en"; } catch (e) { return "en"; } }
  function updateToggle(lang) {
    document.documentElement.lang = lang;
    var b = document.getElementById("langToggle");
    if (b) b.textContent = lang === "vi" ? "English" : "Tiếng Việt";
  }
  window.AMF.applyLang = function () { var l = currentLang(); translateText(l); translatePlaceholders(l); updateToggle(l); };
  window.AMF.setLang = function (l) {
    try { localStorage.setItem("amf_lang", l); } catch (e) {}
    translateText(l); translatePlaceholders(l); updateToggle(l);
  };

  /* ---------- Boot ---------- */
  function boot() {
    var h = document.getElementById("site-header");
    if (h) h.innerHTML = buildHeader();
    var f = document.getElementById("site-footer");
    if (f) f.innerHTML = buildFooter();

    wireInteractions();
    applyFeatures();
    window.AMF.applyLang(); // translate static markup immediately (no flash)

    // Load published overrides, then apply (local overrides layered on top).
    fetch("assets/data/content.json")
      .then(function (r) { return r.ok ? r.json() : {}; })
      .catch(function () { return {}; })
      .then(function (published) {
        applyContent(published);
        applyBindings(published);
        window.AMF.applyLang(); // re-translate any override-replaced nodes
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
