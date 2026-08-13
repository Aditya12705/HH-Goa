/* ==========================================================================
   HH Goa 2026 Frame Studio — Main JS
   Nav, Marquee, Scroll, Stat Counters, FAQ Accordion
   ========================================================================== */

(function() {
  'use strict';

  /* ---------- Smooth Scroll for Anchor Links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- Animated Stat Counters ---------- */
  function animateCounters() {
    var counters = document.querySelectorAll('[data-count]');
    counters.forEach(function(el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var prefix = el.getAttribute('data-prefix') || '';
      var duration = 2000;
      var start = 0;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        // Ease out quad
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.floor(eased * target);
        el.textContent = prefix + current.toLocaleString() + suffix;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = prefix + target.toLocaleString() + suffix;
        }
      }

      requestAnimationFrame(step);
    });
  }

  // Use IntersectionObserver to trigger counters on scroll
  var statsSection = document.querySelector('.stats-strip');
  if (statsSection) {
    var observed = false;
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting && !observed) {
          observed = true;
          animateCounters();
        }
      });
    }, { threshold: 0.3 });
    observer.observe(statsSection);
  }

  /* ---------- Sticky Nav Shadow on Scroll ---------- */
  var nav = document.querySelector('.site-nav');
  if (nav) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 10) {
        nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.5)';
      } else {
        nav.style.boxShadow = 'none';
      }
    });
  }

  /* ---------- Fade-in on Scroll ---------- */
  var fadeEls = document.querySelectorAll('.fade-on-scroll');
  if (fadeEls.length > 0) {
    var fadeObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    fadeEls.forEach(function(el) {
      el.style.opacity = '0';
      fadeObserver.observe(el);
    });
  }

})();
