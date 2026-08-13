/* ==========================================================================
   HH Goa 2026 Frame Studio — Share Module
   X/Twitter share modal, Web Share API for mobile
   ========================================================================== */

(function() {
  'use strict';

  /* ---------- Open Share Modal ---------- */
  window.openShareModal = function openShareModal() {
    var tagline = (document.getElementById('inpTagline') || {}).value || '';
    var format = (window.studioState || {}).format || 'A';
    var caption = '';

    if (format === 'A') {
      caption = "I'm getting ready for Hacker House Goa 2026! 🌴⚡\n" +
        "Check out my official PFP pass.\n\n" +
        "See you in Goa Oct 28-31! #FrameInGoa #HHGoa2026\n\n" +
        "Build yours at: hhgoa.com";
    } else {
      caption = "Claimed my official Hacker House Goa 2026 Builder Pass! 🌴🚀\n" +
        '"' + tagline + '"\n\n' +
        "Ready to build, ship, and launch in Goa! #FrameInGoa #HHGoa2026\n\n" +
        "Generate your pass: hhgoa.com";
    }

    document.getElementById('tweetCaption').value = caption;

    var overlay = document.getElementById('shareModal');
    if (overlay) overlay.classList.remove('hidden');

    // On mobile, try native share first
    if (navigator.share && navigator.canShare && /Mobi|Android/i.test(navigator.userAgent)) {
      shareNative(caption);
    }
  };

  /* ---------- Close Share Modal ---------- */
  window.closeShareModal = function closeShareModal() {
    var overlay = document.getElementById('shareModal');
    if (overlay) overlay.classList.add('hidden');
  };

  /* ---------- Copy Tweet Text ---------- */
  window.copyTweetText = function copyTweetText() {
    var text = document.getElementById('tweetCaption').value;
    navigator.clipboard.writeText(text).then(function() {
      var btn = document.querySelector('.share-btn-copy');
      if (btn) {
        var orig = btn.textContent;
        btn.textContent = '✓ Copied!';
        setTimeout(function() { btn.textContent = orig; }, 2000);
      }
    }).catch(function() {
      // Fallback
      var ta = document.getElementById('tweetCaption');
      ta.select();
      document.execCommand('copy');
    });
  };

  /* ---------- Launch Tweet on X ---------- */
  window.executeTweetShare = function executeTweetShare() {
    var text = encodeURIComponent(document.getElementById('tweetCaption').value);
    window.open('https://twitter.com/intent/tweet?text=' + text, '_blank');
  };

  /* ---------- Native Web Share (Mobile) ---------- */
  async function shareNative(caption) {
    try {
      var studioCanvas = (window.studioState || {}).canvas || document.getElementById('stage');
      if (!studioCanvas) return;

      var blob = await new Promise(function(resolve) {
        studioCanvas.toBlob(resolve, 'image/png', 1.0);
      });

      if (!blob) return;

      var file = new File([blob], 'HHGoa2026.png', { type: 'image/png' });
      var shareData = {
        title: 'Hacker House Goa 2026',
        text: caption,
        files: [file]
      };

      if (navigator.canShare(shareData)) {
        await navigator.share(shareData);
        closeShareModal();
      }
    } catch (err) {
      // User cancelled or Web Share not supported — fallback to modal
      console.log('Web Share cancelled or unavailable');
    }
  }

  /* ---------- Close on overlay click ---------- */
  var overlay = document.getElementById('shareModal');
  if (overlay) {
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeShareModal();
    });
  }

})();
