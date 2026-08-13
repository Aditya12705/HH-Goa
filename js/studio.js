/* ==========================================================================
   HH Goa 2026 Frame Studio — Studio Controller
   Upload, controls, filters, masks, canvas interaction
   ========================================================================== */

(function() {
  'use strict';

  /* ---------- State ---------- */
  var currentFormat = 'A';
  var currentShape = 'quad';
  var currentFilter = 'none';
  var passNumber = 'HH26-' + String(Math.floor(Math.random() * 9000 + 1000));

  /* ---------- Canvas & Context ---------- */
  var canvas = document.getElementById('stage');
  var ctx = canvas.getContext('2d');

  /* ---------- User photo — null until explicitly uploaded ---------- */
  var userImg = null;

  /* ---------- Background Images ---------- */
  var bgImgA = new Image();
  bgImgA.onload = function() { renderCanvas(); };
  bgImgA.onerror = function() { console.warn('BG A load issue'); };
  bgImgA.src = (typeof bgDataUrlA !== 'undefined') ? bgDataUrlA : '1.png';

  var bgImgB = new Image();
  bgImgB.onload = function() { renderCanvas(); };
  bgImgB.onerror = function() { console.warn('BG B load issue'); };
  bgImgB.src = (typeof bgDataUrlB !== 'undefined') ? bgDataUrlB : '2.png';

  /* ---------- Dragging State ---------- */
  var isDragging = false;
  var startX, startY, initialOffsetX, initialOffsetY;

  /* ---------- Init ---------- */
  document.fonts.ready.then(function() {
    renderCanvas();
  });

  /* ---------- Get Control Values ---------- */
  function getControls() {
    return {
      zoom: parseFloat(document.getElementById('zoom').value),
      rotation: parseFloat(document.getElementById('rotation').value),
      offsetX: parseFloat(document.getElementById('offsetX').value),
      offsetY: parseFloat(document.getElementById('offsetY').value)
    };
  }

  /* ---------- Build State Object ---------- */
  function buildState() {
    var ctrl = getControls();
    return {
      format: currentFormat,
      shape: currentShape,
      filter: currentFilter,
      zoom: ctrl.zoom,
      rotation: ctrl.rotation,
      offsetX: ctrl.offsetX,
      offsetY: ctrl.offsetY,
      userImg: userImg,
      bgImgA: bgImgA,
      bgImgB: bgImgB,
      name: (document.getElementById('inpName') || {}).value || '',
      role: (document.getElementById('inpRole') || {}).value || '',
      location: (document.getElementById('inpLocation') || {}).value || '',
      tagline: (document.getElementById('inpTagline') || {}).value || '',
      stack: (document.getElementById('inpStack') || {}).value || '',
      status: (document.getElementById('inpStatus') || {}).value || '',
      passNumber: passNumber
    };
  }

  /* ---------- Render Canvas ---------- */
  window.renderCanvas = function renderCanvas() {
    var t0 = performance.now();
    var state = buildState();
    if (state.format === 'A') {
      document.getElementById('resLabel').innerText = '2000 × 2000 (HD PFP)';
      drawFormatA(canvas, ctx, state);
    } else {
      document.getElementById('resLabel').innerText = '2000 × 1200 (Builder ID)';
      drawFormatB(canvas, ctx, state);
    }
    var elapsed = (performance.now() - t0).toFixed(1);
    var renderTimeEl = document.getElementById('renderTime');
    if (renderTimeEl) renderTimeEl.innerText = 'rendered in ' + elapsed + 'ms';
  };

  /* ---------- Update Control Display Values ---------- */
  window.updateControls = function updateControls() {
    document.getElementById('valZoom').innerText = parseFloat(document.getElementById('zoom').value).toFixed(2) + 'x';
    document.getElementById('valRotate').innerText = document.getElementById('rotation').value + '°';
    document.getElementById('valOffsetX').innerText = document.getElementById('offsetX').value;
    document.getElementById('valOffsetY').innerText = document.getElementById('offsetY').value;
  };

  /* ---------- Reset Photo Transform ---------- */
  window.resetPhotoTransform = function resetPhotoTransform() {
    document.getElementById('zoom').value = 1.0;
    document.getElementById('rotation').value = 0;
    document.getElementById('offsetX').value = 0;
    document.getElementById('offsetY').value = 0;
    updateControls();
    renderCanvas();
  };

  /* ---------- Format Switcher ---------- */
  window.setFormat = function setFormat(fmt) {
    currentFormat = fmt;
    var tabA = document.getElementById('tabFormatA');
    var tabB = document.getElementById('tabFormatB');
    var builderForm = document.getElementById('builderForm');
    var shapeSection = document.getElementById('shapeSection');

    if (fmt === 'A') {
      tabA.classList.add('active');
      tabB.classList.remove('active');
      builderForm.classList.add('hidden');
      shapeSection.classList.remove('hidden');
    } else {
      tabB.classList.add('active');
      tabA.classList.remove('active');
      builderForm.classList.remove('hidden');
      shapeSection.classList.add('hidden');
    }
    renderCanvas();
  };

  /* ---------- Shape Switcher ---------- */
  window.setShape = function setShape(shape) {
    currentShape = shape;
    ['quad', 'squircle', 'circle', 'arch'].forEach(function(s) {
      var btn = document.getElementById('shape' + s.charAt(0).toUpperCase() + s.slice(1));
      if (btn) {
        if (s === shape) btn.classList.add('active');
        else btn.classList.remove('active');
      }
    });
    renderCanvas();
  };

  /* ---------- Filter Switcher ---------- */
  window.setFilter = function setFilter(flt) {
    currentFilter = flt;
    var map = { none: 'None', warm: 'Warm', emerald: 'Emerald', bw: 'BW' };
    Object.keys(map).forEach(function(key) {
      var btn = document.getElementById('filter' + map[key]);
      if (btn) {
        if (key === flt) btn.classList.add('active');
        else btn.classList.remove('active');
      }
    });
    renderCanvas();
  };

  /* ---------- Image Upload (JPG, PNG, HEIC) ---------- */
  window.handleImageUpload = async function handleImageUpload(e) {
    var file = e.target ? e.target.files[0] : (e.files ? e.files[0] : null);
    if (!file) return;

    var statusText = document.getElementById('uploadStatusText');
    if (statusText) statusText.innerText = 'Processing Photo...';

    var blob = file;
    if (file.name && file.name.toLowerCase().endsWith('.heic')) {
      try {
        var converted = await heic2any({ blob: file, toType: 'image/jpeg' });
        blob = Array.isArray(converted) ? converted[0] : converted;
      } catch (err) {
        alert('Could not convert HEIC photo. Please try JPG/PNG.');
        if (statusText) statusText.innerText = 'Upload Failed';
        return;
      }
    }

    var reader = new FileReader();
    reader.onload = function(ev) {
      var img = new Image();
      img.onload = function() {
        userImg = img;
        if (statusText) {
          statusText.innerText = 'Photo Ready!';
          statusText.style.color = '#FFDE00';
        }
        var sub = document.getElementById('uploadSubtext');
        if (sub) sub.innerText = file.name;
        resetPhotoTransform();
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(blob);
  };

  /* ---------- Selfie Capture ---------- */
  window.captureSelfie = async function captureSelfie() {
    try {
      var stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 1080, height: 1080 } });
      var video = document.createElement('video');
      video.srcObject = stream;
      video.setAttribute('playsinline', '');
      await video.play();

      // Wait a bit for camera to warm up
      await new Promise(function(r) { setTimeout(r, 800); });

      var offCanvas = document.createElement('canvas');
      offCanvas.width = video.videoWidth;
      offCanvas.height = video.videoHeight;
      offCanvas.getContext('2d').drawImage(video, 0, 0);

      stream.getTracks().forEach(function(t) { t.stop(); });

      var img = new Image();
      img.onload = function() {
        userImg = img;
        var st = document.getElementById('uploadStatusText');
        if (st) { st.innerText = 'Selfie Captured!'; st.style.color = '#FFDE00'; }
        resetPhotoTransform();
      };
      img.src = offCanvas.toDataURL('image/jpeg', 0.9);
    } catch (err) {
      alert('Camera access denied or unavailable.');
    }
  };

  /* ---------- Drag & Drop Setup ---------- */
  var dropZone = document.getElementById('dropZone');
  if (dropZone) {
    dropZone.addEventListener('dragover', function(e) {
      e.preventDefault();
      dropZone.classList.add('drag-over');
    });
    dropZone.addEventListener('dragleave', function() {
      dropZone.classList.remove('drag-over');
    });
    dropZone.addEventListener('drop', function(e) {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleImageUpload({ target: { files: e.dataTransfer.files } });
      }
    });
  }

  /* ---------- Canvas Drag-to-Position ---------- */
  var canvasWrapper = document.getElementById('canvasWrapper');
  if (canvasWrapper) {
    // Mouse
    canvasWrapper.addEventListener('mousedown', function(e) {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      initialOffsetX = parseFloat(document.getElementById('offsetX').value);
      initialOffsetY = parseFloat(document.getElementById('offsetY').value);
    });
    window.addEventListener('mousemove', function(e) {
      if (!isDragging) return;
      document.getElementById('offsetX').value = initialOffsetX + (e.clientX - startX) * 1.5;
      document.getElementById('offsetY').value = initialOffsetY + (e.clientY - startY) * 1.5;
      updateControls();
      renderCanvas();
    });
    window.addEventListener('mouseup', function() { isDragging = false; });

    // Touch
    canvasWrapper.addEventListener('touchstart', function(e) {
      if (e.touches.length === 1) {
        isDragging = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        initialOffsetX = parseFloat(document.getElementById('offsetX').value);
        initialOffsetY = parseFloat(document.getElementById('offsetY').value);
      }
    });
    window.addEventListener('touchmove', function(e) {
      if (!isDragging || e.touches.length !== 1) return;
      document.getElementById('offsetX').value = initialOffsetX + (e.touches[0].clientX - startX) * 1.5;
      document.getElementById('offsetY').value = initialOffsetY + (e.touches[0].clientY - startY) * 1.5;
      updateControls();
      renderCanvas();
    });
    window.addEventListener('touchend', function() { isDragging = false; });
  }

  /* ---------- Download Output ---------- */
  window.downloadOutput = function downloadOutput() {
    var formatName = currentFormat === 'A' ? 'PFP_Overlay' : 'VIP_Builder_Pass';
    var filename = 'HHGoa2026_' + formatName + '.png';

    try {
      var dataUrl = canvas.toDataURL('image/png', 1.0);
      if (dataUrl && dataUrl.length > 100) {
        var link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }
    } catch (err) {
      console.warn('toDataURL failed:', err);
    }

    try {
      canvas.toBlob(function(blob) {
        if (blob) {
          var url = URL.createObjectURL(blob);
          var link = document.createElement('a');
          link.download = filename;
          link.href = url;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(function() { URL.revokeObjectURL(url); }, 1500);
        } else {
          alert('Could not generate image download.');
        }
      }, 'image/png', 1.0);
    } catch (e) {
      alert('Download error: ' + e.message);
    }
  };

  /* ---------- Expose for inline handlers ---------- */
  window.studioState = {
    get format() { return currentFormat; },
    get canvas() { return canvas; }
  };

})();
