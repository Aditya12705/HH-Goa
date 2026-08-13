/* ==========================================================================
   HH Goa 2026 Frame Studio — Canvas Export  (v2 · redesigned frames)
   Format A (PFP 2000×2000) & Format B (VIP Pass 2000×1200)
   ========================================================================== */

/* ---------- Helper: Rounded Rect Path ---------- */
function drawRoundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/* ---------- Helper: Arch Path ---------- */
function drawArchPath(ctx, x, y, w, h) {
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  ctx.lineTo(x, y + w / 2);
  ctx.arc(x + w / 2, y + w / 2, w / 2, Math.PI, 0, false);
  ctx.lineTo(x + w, y + h);
  ctx.closePath();
}

/* ---------- Helper: Quad Path (CRT-style) ---------- */
function drawQuadPath(ctx, x, y, w, h, pad) {
  pad = pad || 0;
  var x0 = x - pad, y0 = y - pad;
  var w0 = w + pad * 2, h0 = h + pad * 2;
  var pTL = { x: x0 + w0 * 0.04, y: y0 + h0 * 0.02 };
  var pTR = { x: x0 + w0 * 0.98, y: y0 + h0 * 0.01 };
  var pBR = { x: x0 + w0 * 0.96, y: y0 + h0 * 0.98 };
  var pBL = { x: x0 + w0 * 0.02, y: y0 + h0 * 0.97 };
  var cTop = { x: x0 + w0 * 0.51, y: y0 - h0 * 0.04 };
  var cRight = { x: x0 + w0 * 1.04, y: y0 + h0 * 0.5 };
  var cBottom = { x: x0 + w0 * 0.49, y: y0 + h0 * 1.04 };
  var cLeft = { x: x0 - w0 * 0.04, y: y0 + h0 * 0.5 };
  ctx.beginPath();
  ctx.moveTo(pTL.x, pTL.y);
  ctx.quadraticCurveTo(cTop.x, cTop.y, pTR.x, pTR.y);
  ctx.quadraticCurveTo(cRight.x, cRight.y, pBR.x, pBR.y);
  ctx.quadraticCurveTo(cBottom.x, cBottom.y, pBL.x, pBL.y);
  ctx.quadraticCurveTo(cLeft.x, cLeft.y, pTL.x, pTL.y);
  ctx.closePath();
}

/* ---------- Apply Photo Filters ---------- */
function applyImageFilters(ctx, filter) {
  if (filter === 'warm') {
    ctx.filter = 'sepia(0.35) contrast(1.1) saturate(1.3) brightness(1.05)';
  } else if (filter === 'emerald') {
    ctx.filter = 'hue-rotate(90deg) contrast(1.25) saturate(1.4)';
  } else if (filter === 'bw') {
    ctx.filter = 'grayscale(1) contrast(1.3) brightness(1.05)';
  } else {
    ctx.filter = 'none';
  }
}

/* ---------- B&W Jungle Green Duotone ---------- */
function applyBWDuotone(ctx, x, y, w, h) {
  try {
    var imageData = ctx.getImageData(x, y, w, h);
    var data = imageData.data;
    for (var i = 0; i < data.length; i += 4) {
      var gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
      var t = gray / 255;
      data[i]     = 4   + (247 - 4)   * t;
      data[i + 1] = 33  + (244 - 33)  * t;
      data[i + 2] = 21  + (234 - 21)  * t;
    }
    ctx.putImageData(imageData, x, y);
  } catch (e) { /* CORS tainted */ }
}

/* ---------- Draw text along arc ---------- */
function drawTextOnArc(ctx, text, cx, cy, radius, startAngle, endAngle, outward) {
  ctx.save();
  var totalAngle = endAngle - startAngle;
  var charCount = text.length;
  var anglePerChar = totalAngle / (charCount + 1);

  for (var i = 0; i < charCount; i++) {
    var charAngle = startAngle + anglePerChar * (i + 1);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(charAngle);
    if (outward) {
      ctx.translate(0, -radius);
      ctx.rotate(0);
    } else {
      ctx.translate(0, radius);
      ctx.rotate(Math.PI);
    }
    ctx.fillText(text[i], 0, 0);
    ctx.restore();
  }
  ctx.restore();
}

/* ---------- Draw diamond shape ---------- */
function drawDiamond(ctx, cx, cy, size) {
  ctx.beginPath();
  ctx.moveTo(cx, cy - size);
  ctx.lineTo(cx + size, cy);
  ctx.lineTo(cx, cy + size);
  ctx.lineTo(cx - size, cy);
  ctx.closePath();
}

/* ---------- Draw small palm tree silhouette ---------- */
function drawPalmSilhouette(ctx, baseX, baseY, height, flip) {
  ctx.save();
  var dir = flip ? -1 : 1;

  // Trunk
  ctx.beginPath();
  ctx.moveTo(baseX - 6, baseY);
  ctx.quadraticCurveTo(baseX + dir * 15, baseY - height * 0.5, baseX + dir * 8, baseY - height);
  ctx.lineTo(baseX + dir * 8 + 8, baseY - height);
  ctx.quadraticCurveTo(baseX + dir * 15 + 10, baseY - height * 0.5, baseX + 6, baseY);
  ctx.closePath();
  ctx.fill();

  // Fronds
  var topX = baseX + dir * 8 + 4;
  var topY = baseY - height;
  var fronds = [-1.2, -0.7, -0.2, 0.3, 0.8, 1.3];
  fronds.forEach(function(ang) {
    var len = 40 + Math.random() * 25;
    ctx.beginPath();
    ctx.moveTo(topX, topY);
    var ex = topX + Math.cos(ang) * len;
    var ey = topY + Math.sin(ang) * len - 10;
    ctx.quadraticCurveTo(topX + Math.cos(ang) * len * 0.5, topY + Math.sin(ang) * len * 0.4 - 15, ex, ey);
    ctx.quadraticCurveTo(topX + Math.cos(ang + 0.15) * len * 0.4, topY + Math.sin(ang + 0.15) * len * 0.3 - 5, topX, topY);
    ctx.fill();
  });

  // Coconuts
  ctx.beginPath();
  ctx.arc(topX - 5, topY + 8, 5, 0, Math.PI * 2);
  ctx.arc(topX + 5, topY + 10, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/* ---------- Draw string lights ---------- */
function drawStringLights(ctx, x1, y1, x2, y2, sag, bulbCount, bulbColor) {
  // Wire
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 2;
  var midX = (x1 + x2) / 2;
  var midY = (y1 + y2) / 2 + sag;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.quadraticCurveTo(midX, midY, x2, y2);
  ctx.stroke();

  // Bulbs
  for (var i = 0; i <= bulbCount; i++) {
    var t = i / bulbCount;
    var bx = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * midX + t * t * x2;
    var by = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * midY + t * t * y2;

    // Glow
    var glow = ctx.createRadialGradient(bx, by, 0, bx, by, 12);
    glow.addColorStop(0, bulbColor || 'rgba(255,222,0,0.5)');
    glow.addColorStop(1, 'rgba(255,222,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(bx, by, 12, 0, Math.PI * 2);
    ctx.fill();

    // Bulb dot
    ctx.fillStyle = bulbColor || 'rgba(255,222,0,0.9)';
    ctx.beginPath();
    ctx.arc(bx, by, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/* ---------- Draw tropical drink sticker ---------- */
function drawDrinkSticker(ctx, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.globalAlpha = 0.5;

  // Cup body
  ctx.fillStyle = '#FF007F';
  ctx.beginPath();
  ctx.moveTo(-12, 0);
  ctx.lineTo(-10, 35);
  ctx.lineTo(10, 35);
  ctx.lineTo(12, 0);
  ctx.closePath();
  ctx.fill();

  // Rim
  ctx.fillStyle = '#FFDE00';
  ctx.fillRect(-14, -3, 28, 5);

  // Straw
  ctx.strokeStyle = '#FFDE00';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(4, -3);
  ctx.lineTo(8, -22);
  ctx.lineTo(14, -25);
  ctx.stroke();

  // Umbrella
  ctx.fillStyle = '#056839';
  ctx.beginPath();
  ctx.arc(8, -22, 10, -Math.PI, 0);
  ctx.fill();
  ctx.strokeStyle = '#FFDE00';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-2, -22);
  ctx.lineTo(8, -22);
  ctx.lineTo(18, -22);
  ctx.stroke();

  ctx.globalAlpha = 1;
  ctx.restore();
}

/* ---------- Draw grid texture ---------- */
function drawGridTexture(ctx, w, h, color, spacing) {
  ctx.save();
  ctx.strokeStyle = color || 'rgba(10,92,54,0.08)';
  ctx.lineWidth = 1;
  for (var x = 0; x < w; x += spacing) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (var y = 0; y < h; y += spacing) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }
  ctx.restore();
}


/* ==========================================================================
   FORMAT A: PFP FRAME (2000×2000) — thick ring with curved text
   ========================================================================== */
function drawFormatA(canvas, ctx, state) {
  var w = canvas.width = 2000;
  var h = canvas.height = 2000;

  // --- Background: deep green + grid ---
  var bg = ctx.createRadialGradient(w / 2, h / 2, 200, w / 2, h / 2, 1200);
  bg.addColorStop(0, '#063D27');
  bg.addColorStop(0.6, '#042115');
  bg.addColorStop(1, '#02120B');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  drawGridTexture(ctx, w, h, 'rgba(10,92,54,0.06)', 50);

  // --- String lights across top ---
  drawStringLights(ctx, 40, 60, w - 40, 50, 50, 14, 'rgba(255,222,0,0.7)');

  // --- Corner labels ---
  ctx.font = '700 28px "Victor Mono"';
  ctx.fillStyle = 'rgba(247,244,234,0.6)';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('#FrameInGoa', 55, 100);
  ctx.textAlign = 'right';
  ctx.fillText('hhgoa.com', w - 55, 100);

  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  ctx.font = '400 24px "Victor Mono"';
  ctx.fillStyle = 'rgba(247,244,234,0.4)';
  ctx.fillText('"less noise. more signal."', 55, h - 60);
  ctx.textAlign = 'right';
  ctx.fillText('make yours →', w - 55, h - 60);

  // --- Palm tree silhouettes ---
  ctx.fillStyle = 'rgba(5,104,57,0.18)';
  drawPalmSilhouette(ctx, 160, h - 20, 260, false);
  drawPalmSilhouette(ctx, w - 130, h - 20, 220, true);

  // --- Drink sticker (bottom-right corner) ---
  drawDrinkSticker(ctx, w - 200, h - 120, 1.8);

  // --- Thick ring geometry ---
  var cx = w / 2;
  var cy = h / 2;
  var outerR = 720;
  var ringThickness = outerR * 0.14; // ~100px
  var innerR = outerR - ringThickness;

  // Photo clipping — apply mask geometry
  var photoR = innerR - 12;
  var photoX = cx - photoR;
  var photoY = cy - photoR;
  var photoDim = photoR * 2;

  // Draw the ring (yellow)
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
  ctx.arc(cx, cy, innerR, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fillStyle = '#FFDE00';
  ctx.fill();
  ctx.restore();

  // Pink inner outline
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, innerR + 6, 0, Math.PI * 2);
  ctx.strokeStyle = '#FF007F';
  ctx.lineWidth = 8;
  ctx.stroke();
  ctx.restore();

  // --- Photo inside the ring ---
  ctx.save();

  // Apply mask shape to photo
  ctx.beginPath();
  if (state.shape === 'circle') {
    ctx.arc(cx, cy, photoR, 0, Math.PI * 2);
  } else if (state.shape === 'arch') {
    drawArchPath(ctx, photoX, photoY, photoDim, photoDim);
  } else if (state.shape === 'quad') {
    drawQuadPath(ctx, photoX, photoY, photoDim, photoDim, 0);
  } else { // squircle
    drawRoundedRect(ctx, photoX, photoY, photoDim, photoDim, photoR * 0.35);
  }
  ctx.clip();

  // Dark fill behind photo
  ctx.fillStyle = '#021A0F';
  ctx.fillRect(photoX, photoY, photoDim, photoDim);

  if (state.userImg && state.userImg.complete && state.userImg.naturalWidth) {
    ctx.save();
    ctx.translate(cx + state.offsetX, cy + state.offsetY);
    ctx.rotate(state.rotation * Math.PI / 180);
    applyImageFilters(ctx, state.filter);
    var aspect = state.userImg.width / state.userImg.height;
    var dw, dh;
    if (aspect > 1) { dh = photoDim * state.zoom; dw = dh * aspect; }
    else { dw = photoDim * state.zoom; dh = dw / aspect; }
    ctx.drawImage(state.userImg, -dw / 2, -dh / 2, dw, dh);
    ctx.filter = 'none';
    ctx.restore();
    // B&W duotone
    if (state.filter === 'bw') {
      applyBWDuotone(ctx, photoX, photoY, photoDim, photoDim);
    }
  } else {
    // Placeholder — dashed circle + prompt text
    ctx.save();
    ctx.setLineDash([20, 14]);
    ctx.strokeStyle = 'rgba(255,222,0,0.25)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(cx, cy, photoR * 0.55, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(255,222,0,0.28)';
    ctx.font = '600 100px "Victor Mono"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('↑', cx, cy - 80);
    ctx.font = '600 48px "Victor Mono"';
    ctx.fillText('drop your photo', cx, cy + 60);
    ctx.restore();
  }
  ctx.restore();

  // --- Curved text on ring ---
  ctx.save();
  ctx.fillStyle = '#042115';
  ctx.font = '800 38px "Imbue"';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  var textR = innerR + ringThickness / 2;

  // Top arc: "HACKER HOUSE GOA 2026"
  drawTextOnArc(ctx, 'H A C K E R   H O U S E   G O A   2 0 2 6', cx, cy, textR, -Math.PI * 0.72, -Math.PI * 0.28, true);

  // Bottom arc: dates/facts
  ctx.font = '700 30px "Victor Mono"';
  drawTextOnArc(ctx, '28 – 31  O C T  ·  G O A ,  I N D I A  ·  2 4 7  S E A T S', cx, cy, textR, Math.PI * 0.25, Math.PI * 0.75, false);
  ctx.restore();

  // --- Diamond accents at 3 o'clock and 9 o'clock ---
  ctx.save();
  ctx.fillStyle = '#FF007F';
  drawDiamond(ctx, cx + textR, cy, 14);
  ctx.fill();
  drawDiamond(ctx, cx - textR, cy, 14);
  ctx.fill();
  ctx.restore();

  // --- Pill logo lockup at bottom of ring ---
  ctx.save();
  var pillW = 280, pillH = 60;
  var pillX = cx - pillW / 2;
  var pillY = cy + outerR - pillH / 2 - 8;

  ctx.fillStyle = '#03150C';
  drawRoundedRect(ctx, pillX, pillY, pillW, pillH, 30);
  ctx.fill();

  ctx.strokeStyle = '#FFDE00';
  ctx.lineWidth = 3;
  drawRoundedRect(ctx, pillX, pillY, pillW, pillH, 30);
  ctx.stroke();

  ctx.fillStyle = '#FFDE00';
  ctx.font = '900 22px "Imbue"';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('HACKER HOUSE', cx - 24, pillY + pillH / 2);

  // गोवा mini badge
  ctx.fillStyle = '#FF007F';
  var miniW = 52, miniH = 30;
  var miniX = cx + 68, miniY = pillY + (pillH - miniH) / 2;
  drawRoundedRect(ctx, miniX, miniY, miniW, miniH, 8);
  ctx.fill();
  ctx.fillStyle = '#FFDE00';
  ctx.font = '700 18px "Rozha One"';
  ctx.fillText('गोवा', miniX + miniW / 2, miniY + miniH / 2 + 1);
  ctx.restore();
}


/* ==========================================================================
   FORMAT B: VIP BUILDER PASS (2000×1200) — horizontal boarding-pass card
   ========================================================================== */
function drawFormatB(canvas, ctx, state) {
  var w = canvas.width = 2000;
  var h = canvas.height = 1200;

  // --- Deep green background ---
  var bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#031A10');
  bg.addColorStop(1, '#02120B');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  drawGridTexture(ctx, w, h, 'rgba(10,92,54,0.04)', 40);

  // --- Card body ---
  var cardM = 60; // margin
  var cardX = cardM, cardY = cardM;
  var cardW = w - cardM * 2, cardH = h - cardM * 2;
  var cardR = 32;

  // Card fill
  ctx.save();
  drawRoundedRect(ctx, cardX, cardY, cardW, cardH, cardR);
  ctx.fillStyle = '#042115';
  ctx.fill();
  ctx.restore();

  // Card border
  ctx.save();
  drawRoundedRect(ctx, cardX, cardY, cardW, cardH, cardR);
  ctx.strokeStyle = 'rgba(10,92,54,0.5)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  // --- Two-tone accent bar at top with string lights ---
  ctx.save();
  drawRoundedRect(ctx, cardX, cardY, cardW, 8, cardR);
  ctx.clip();
  ctx.fillStyle = '#FFDE00';
  ctx.fillRect(cardX, cardY, cardW / 2, 8);
  ctx.fillStyle = '#FF007F';
  ctx.fillRect(cardX + cardW / 2, cardY, cardW / 2, 8);
  ctx.restore();

  // String-light bulbs along top bar
  drawStringLights(ctx, cardX + 30, cardY + 4, cardX + cardW - 30, cardY + 4, 3, 20, 'rgba(255,222,0,0.5)');

  // --- Corner bracket notch marks ---
  ctx.save();
  ctx.strokeStyle = 'rgba(255,222,0,0.3)';
  ctx.lineWidth = 2;
  var bLen = 30;
  // Top-left
  ctx.beginPath();
  ctx.moveTo(cardX + 16, cardY + 16 + bLen);
  ctx.lineTo(cardX + 16, cardY + 16);
  ctx.lineTo(cardX + 16 + bLen, cardY + 16);
  ctx.stroke();
  // Top-right
  ctx.beginPath();
  ctx.moveTo(cardX + cardW - 16 - bLen, cardY + 16);
  ctx.lineTo(cardX + cardW - 16, cardY + 16);
  ctx.lineTo(cardX + cardW - 16, cardY + 16 + bLen);
  ctx.stroke();
  ctx.restore();

  // --- Layout: left column (photo) | right column (details) ---
  var leftColW = 480;
  var leftX = cardX + 50;
  var rightX = leftX + leftColW + 50;
  var topY = cardY + 50;
  var footerH = 80;
  var dashY = cardY + cardH - footerH - 30;

  // --- Dashed perforation line ---
  ctx.save();
  ctx.setLineDash([10, 8]);
  ctx.strokeStyle = 'rgba(255,222,0,0.2)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cardX + 30, dashY);
  ctx.lineTo(cardX + cardW - 30, dashY);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  // Small perforation notches at edges
  ctx.save();
  ctx.fillStyle = '#031A10';
  ctx.beginPath();
  ctx.arc(cardX, dashY, 12, -Math.PI / 2, Math.PI / 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cardX + cardW, dashY, 12, Math.PI / 2, -Math.PI / 2);
  ctx.fill();
  ctx.restore();

  // --- LEFT COLUMN: Photo panel ---
  var photoW = leftColW - 20;
  var photoH = dashY - topY - 60;
  var photoX = leftX + 10;
  var photoY = topY + 30;

  ctx.save();
  drawRoundedRect(ctx, photoX, photoY, photoW, photoH, 16);
  ctx.fillStyle = '#021A0F';
  ctx.fill();

  // Clip and draw photo
  ctx.save();
  drawRoundedRect(ctx, photoX, photoY, photoW, photoH, 16);
  ctx.clip();

  if (state.userImg && state.userImg.complete && state.userImg.naturalWidth) {
    ctx.save();
    ctx.translate(photoX + photoW / 2 + state.offsetX, photoY + photoH / 2 + state.offsetY);
    ctx.rotate(state.rotation * Math.PI / 180);
    applyImageFilters(ctx, state.filter);
    var aspect = state.userImg.width / state.userImg.height;
    var dw, dh;
    if (aspect > 1) { dh = photoH * state.zoom; dw = dh * aspect; }
    else { dw = photoW * state.zoom; dh = dw / aspect; }
    ctx.drawImage(state.userImg, -dw / 2, -dh / 2, dw, dh);
    ctx.filter = 'none';
    ctx.restore();

    if (state.filter === 'bw') {
      applyBWDuotone(ctx, photoX, photoY, photoW, photoH);
    }
  } else {
    // Placeholder — dashed border + prompt
    ctx.save();
    ctx.setLineDash([14, 10]);
    ctx.strokeStyle = 'rgba(255,222,0,0.22)';
    ctx.lineWidth = 4;
    drawRoundedRect(ctx, photoX + 20, photoY + 20, photoW - 40, photoH - 40, 10);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(255,222,0,0.28)';
    ctx.font = '600 72px "Victor Mono"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('↑', photoX + photoW / 2, photoY + photoH / 2 - 50);
    ctx.font = '600 32px "Victor Mono"';
    ctx.fillText('upload photo', photoX + photoW / 2, photoY + photoH / 2 + 40);
    ctx.restore();
  }
  ctx.restore();

  // Photo border
  drawRoundedRect(ctx, photoX, photoY, photoW, photoH, 16);
  ctx.strokeStyle = 'rgba(255,222,0,0.2)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  // --- Stamp badge (bottom-left of photo) ---
  ctx.save();
  var stampX = photoX + 16, stampY = photoY + photoH - 52;
  ctx.fillStyle = 'rgba(3,21,12,0.9)';
  drawRoundedRect(ctx, stampX, stampY, 180, 38, 19);
  ctx.fill();
  ctx.strokeStyle = '#FF007F';
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, stampX, stampY, 180, 38, 19);
  ctx.stroke();

  ctx.fillStyle = '#FFDE00';
  ctx.font = '800 14px "Victor Mono"';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  var statusText = (state.status || 'OPEN TRIALS').toUpperCase();
  ctx.fillText(statusText.length > 22 ? statusText.substring(0, 22) : statusText, stampX + 90, stampY + 19);
  ctx.restore();

  // --- Drink sticker near badge ---
  drawDrinkSticker(ctx, photoX + photoW - 40, photoY + photoH - 50, 1.2);

  // --- RIGHT COLUMN ---
  var rContentW = cardX + cardW - rightX - 50;
  var rY = topY + 20;

  // Coconut tree watermark in right column
  ctx.save();
  ctx.fillStyle = 'rgba(5,104,57,0.06)';
  drawPalmSilhouette(ctx, rightX + rContentW - 60, dashY - 20, 300, true);
  ctx.restore();

  // Logo lockup + dates (top-right)
  ctx.save();
  ctx.fillStyle = '#FFDE00';
  ctx.font = '900 42px "Imbue"';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('HACKER HOUSE', rightX, rY);

  // गोवा badge next to it
  var hhW = ctx.measureText('HACKER HOUSE').width;
  ctx.fillStyle = '#FF007F';
  var gBx = rightX + hhW + 16, gBy = rY + 2;
  drawRoundedRect(ctx, gBx, gBy, 68, 38, 10);
  ctx.fill();
  ctx.fillStyle = '#FFDE00';
  ctx.font = '700 24px "Rozha One"';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('गोवा', gBx + 34, gBy + 20);
  ctx.restore();

  // Dates line
  rY += 56;
  ctx.fillStyle = 'rgba(247,244,234,0.5)';
  ctx.font = '700 18px "Victor Mono"';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('GOA, INDIA  ·  28–31 OCT 2026', rightX, rY);

  // Eyebrow label
  rY += 50;
  ctx.fillStyle = '#FF007F';
  ctx.font = '700 16px "Victor Mono"';
  ctx.fillText('OPEN TRIALS · HHGOA\'26', rightX, rY);

  // Name — large bold display
  rY += 40;
  var name = (state.name || 'BUILDER NAME').toUpperCase();
  ctx.fillStyle = '#F7F4EA';
  ctx.font = '900 72px "Imbue"';
  ctx.fillText(name, rightX, rY);

  // Thin divider
  rY += 85;
  ctx.save();
  ctx.strokeStyle = 'rgba(255,222,0,0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(rightX, rY);
  ctx.lineTo(rightX + rContentW, rY);
  ctx.stroke();
  ctx.restore();

  // Stack / Role
  rY += 24;
  ctx.fillStyle = 'rgba(247,244,234,0.4)';
  ctx.font = '700 14px "Victor Mono"';
  ctx.fillText('STACK / ROLE', rightX, rY);

  rY += 30;
  var role = (state.role || 'DEVELOPER').toUpperCase();
  var stack = (state.stack || 'REACT, SOLANA').toUpperCase();
  ctx.fillStyle = '#FFDE00';
  ctx.font = '800 30px "Imbue"';
  ctx.fillText(stack, rightX, rY);

  rY += 44;
  ctx.fillStyle = '#F7F4EA';
  ctx.font = '700 24px "Victor Mono"';
  ctx.fillText(role + '  •  ' + (state.location || 'GOA, IN').toUpperCase(), rightX, rY);

  // Builder Class
  rY += 50;
  ctx.fillStyle = 'rgba(247,244,234,0.4)';
  ctx.font = '700 14px "Victor Mono"';
  ctx.fillText('BUILDER CLASS', rightX, rY);

  rY += 30;
  var tagline = (state.tagline || '10X BOILERPLATE DESTROYER').toUpperCase();
  ctx.fillStyle = '#FF007F';
  ctx.font = '800 28px "Imbue"';
  ctx.fillText(tagline, rightX, rY);

  // --- FOOTER STRIP below dashed line ---
  var footY = dashY + 20;

  // Hashtag pill left
  ctx.save();
  ctx.fillStyle = '#FF007F';
  drawRoundedRect(ctx, cardX + 50, footY, 170, 36, 18);
  ctx.fill();
  ctx.fillStyle = '#FFF';
  ctx.font = '800 16px "Victor Mono"';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('#FrameInGoa', cardX + 50 + 85, footY + 18);
  ctx.restore();

  // Center: make yours
  ctx.fillStyle = 'rgba(247,244,234,0.4)';
  ctx.font = '400 16px "Victor Mono"';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('make yours → hhgoa.com', w / 2, footY + 18);

  // Right: credit
  ctx.textAlign = 'right';
  ctx.fillText('2:47 pm studio', cardX + cardW - 50, footY + 18);
}
