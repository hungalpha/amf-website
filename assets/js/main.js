// APSE — homepage interactions
(function () {
  // Sticky header shadow on scroll
  var header = document.getElementById('header');
  var onScroll = function () {
    if (window.scrollY > 8) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile nav toggle
  var navToggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') nav.classList.remove('open');
    });
  }

  // Language toggle stub (wire to i18n later)
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    langToggle.addEventListener('click', function () {
      var html = document.documentElement;
      html.lang = html.lang === 'vi' ? 'en' : 'vi';
      langToggle.textContent = html.lang === 'vi' ? 'VI / EN' : 'EN / VI';
    });
  }
})();
