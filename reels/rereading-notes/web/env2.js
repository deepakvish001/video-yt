// ---------- study props for "Why rereading notes doesn't work" ----------
const WOOD = '#c98a4b', WOOD_D = '#9a5a2a', PAPER = '#fbf7ee', CHALK = '#f4f1e6';

// soft additive light
function glow(ctx, x, y, r, col = '255,210,120', a = .5) {
  if (a <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(x, y, r * .05, x, y, r); g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(1, `rgba(${col},0)`);
  ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.restore();
}

// hair cap for students (hat: 'hair'), drawn in head space like the other hats
function drawHair(ctx, hx, hy, hr, col, style, lw) {
  const R = hr + .012, a = .45;
  const xR = hx + Math.cos(-a) * R, xL = hx + Math.cos(Math.PI + a) * R;
  const yF = hy - hr * .58;
  ctx.beginPath(); ctx.arc(hx, hy, R, Math.PI + a, -a);
  const n = 7;
  for (let i = 1; i <= n; i++) {
    const k = i / n, x = lerp(xR, xL, k);
    const dip = i % 2 ? .05 : 0;
    const sweep = style === 2 ? (1 - k) * .06 : 0;
    ctx.lineTo(x, yF + dip - sweep + (i === n ? .07 : 0));
  }
  ctx.closePath(); fillStroke(ctx, col, lw);
  ellipse(ctx, hx - hr * .32, hy - hr * .8, hr * .24, hr * .07, -.35); ctx.fillStyle = 'rgba(255,255,255,.22)'; ctx.fill();
}

// ---------- rooms ----------
function roomNight(ctx, cam, t, o = {}) {
  applyCam(ctx, cam, .35);
  const g = ctx.createLinearGradient(0, -200, 0, 1300); g.addColorStop(0, '#2e2a63'); g.addColorStop(1, '#5d4994');
  ctx.fillStyle = g; ctx.fillRect(-1500, -1500, 4080, 4500);
  const wx = o.winX ?? 780, wy = 360;
  rrect(ctx, wx - 170, wy - 210, 340, 400, 18); fillStroke(ctx, '#162252', 10);
  ctx.save(); rrect(ctx, wx - 170, wy - 210, 340, 400, 18); ctx.clip();
  const sg = ctx.createLinearGradient(0, wy - 210, 0, wy + 190); sg.addColorStop(0, '#0f1840'); sg.addColorStop(1, '#30458f'); ctx.fillStyle = sg; ctx.fillRect(wx - 180, wy - 220, 360, 420);
  const R = rng(9);
  for (let i = 0; i < 14; i++) { const sx = wx - 160 + R() * 320, sy = wy - 200 + R() * 330; const tw = .5 + .5 * Math.sin(t * 3 + i * 1.7); circle(ctx, sx, sy, 2.5 + tw * 2.5); ctx.fillStyle = `rgba(255,248,200,${.45 + tw * .55})`; ctx.fill(); }
  circle(ctx, wx + 70, wy - 90, 46); fillStroke(ctx, '#fff4c8', 6); circle(ctx, wx + 52, wy - 100, 10); ctx.fillStyle = 'rgba(200,180,120,.5)'; ctx.fill();
  ctx.restore();
  line(ctx, wx, wy - 210, wx, wy + 190, 10); line(ctx, wx - 170, wy - 10, wx + 170, wy - 10, 10);
  for (const sd of [-1, 1]) {
    const c0 = wx + sd * 175; ctx.beginPath();
    ctx.moveTo(c0 - sd * 10, wy - 250); ctx.lineTo(c0 + sd * 90, wy - 250); ctx.quadraticCurveTo(c0 + sd * 70, wy + 40, c0 + sd * 110, wy + 260);
    ctx.lineTo(c0 - sd * 20, wy + 260); ctx.quadraticCurveTo(c0 - sd * 50, wy, c0 - sd * 10, wy - 250); fillStroke(ctx, '#d0475a', 7);
  }
  rrect(ctx, wx - 300, wy - 270, 600, 26, 12); fillStroke(ctx, '#8a5a3a', 6);
  shelf(ctx, o.shelfX ?? 200, 640);
  if (o.poster !== false) { ctx.save(); ctx.translate(200, 330); ctx.rotate(-.05); rrect(ctx, -110, -120, 220, 240, 8); fillStroke(ctx, '#ffe9a8', 6); star5(ctx, 0, -25, 60, .2, '#f2b52a'); text(ctx, 'A+', 0, 72, 52, '#e0392f', INK, 0); ctx.restore(); }
  applyCam(ctx, cam, 1);
}
function shelf(ctx, bx, by) {
  rrect(ctx, bx - 160, by, 320, 26, 6); fillStroke(ctx, WOOD_D, 6);
  const cols = ['#e0392f', '#2f63c9', '#f2b52a', '#3fa35b', '#7a4bc4', '#f08a5d'];
  let x = bx - 145;
  for (let i = 0; i < 7; i++) {
    const w = 30 + (i * 7) % 16, h = 120 + (i * 23) % 50, lean = i === 5 ? .22 : 0;
    ctx.save(); ctx.translate(x + w / 2, by); ctx.rotate(lean); rrect(ctx, -w / 2, -h, w, h, 5); fillStroke(ctx, cols[i % 6], 5);
    line(ctx, -w / 2 + 7, -h + 24, w / 2 - 7, -h + 24, 4, 'rgba(255,255,255,.6)'); ctx.restore();
    x += w + 4 + (lean ? 22 : 0);
  }
}
function wallDay(ctx, cam, top, bot, depth = .35) {
  applyCam(ctx, cam, depth);
  const g = ctx.createLinearGradient(0, -200, 0, 1300); g.addColorStop(0, top); g.addColorStop(1, bot);
  ctx.fillStyle = g; ctx.fillRect(-1500, -1500, 4080, 4500);
}
function drawBoard(ctx, x, y, w, h) {
  rrect(ctx, x - w / 2 - 22, y - h / 2 - 22, w + 44, h + 44, 14); fillStroke(ctx, WOOD, 8);
  rrect(ctx, x - w / 2, y - h / 2, w, h, 6); fillStroke(ctx, '#2f5a46', 6);
  ctx.save(); rrect(ctx, x - w / 2, y - h / 2, w, h, 6); ctx.clip();
  const R = rng(4); ctx.fillStyle = 'rgba(255,255,255,.05)';
  for (let i = 0; i < 9; i++) { ellipse(ctx, x - w / 2 + R() * w, y - h / 2 + R() * h, 60 + R() * 120, 18 + R() * 30, R() - .5); ctx.fill(); }
  ctx.restore();
  rrect(ctx, x - w / 2 + 40, y + h / 2 + 4, w - 80, 22, 6); fillStroke(ctx, WOOD_D, 5);
  rrect(ctx, x + w / 2 - 200, y + h / 2 - 6, 60, 16, 6); fillStroke(ctx, '#fff', 4);
}
// chalk text that writes itself in from the left (k: 0..1)
function chalkText(ctx, str, x, y, size, k = 1, align = 'center') {
  if (k <= 0) return;
  ctx.save(); ctx.font = `700 ${size}px Poppins`; const w = ctx.measureText(str).width;
  const x0 = align === 'center' ? x - w / 2 : x;
  ctx.beginPath(); ctx.rect(x0 - 10, y - size, (w + 20) * clamp(k), size * 2); ctx.clip();
  ctx.globalAlpha = .93; text(ctx, str, x, y, size, CHALK, null, 0, 'Poppins', 700, align); ctx.restore();
}

// ---------- desk + student ----------
function drawDeskTop(ctx, x0, x1, DB, DF, col = WOOD) {
  const pts = [[x0 + 40, DB], [x1 - 40, DB], [x1, DF], [x0, DF]];
  path(ctx, pts); fillStroke(ctx, col, 7);
  ctx.save(); path(ctx, pts); ctx.clip(); ctx.strokeStyle = 'rgba(90,40,10,.13)'; ctx.lineWidth = 4;
  for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(x0, lerp(DB, DF, i / 4)); ctx.lineTo(x1, lerp(DB, DF, i / 4) + 6); ctx.stroke(); }
  ctx.restore();
}
function drawDeskFront(ctx, x0, x1, DF, bottom = 2400, col = WOOD_D) {
  rrect(ctx, x0, DF, x1 - x0, 30, 6); fillStroke(ctx, '#b0703a', 7);
  rrect(ctx, x0 + 20, DF + 30, x1 - x0 - 40, bottom - DF, 4); fillStroke(ctx, col, 7);
  ctx.save(); rrect(ctx, x0 + 20, DF + 30, x1 - x0 - 40, bottom - DF, 4); ctx.clip(); ctx.fillStyle = 'rgba(30,10,0,.2)'; ctx.fillRect(x0, DF + 30, x1 - x0, 50); ctx.restore();
}
// a student sitting behind a desk. o: {x, s, DB, DF, x0, x1, fig, onDesk(ctx), front(ctx)}
// legs fold up behind the torso; whatever onDesk draws sits between the body and the arms (so hands rest on it)
const SIT_LEGS = { L: [Math.PI, 0], R: [Math.PI, 0] };
function deskScene(ctx, ch, o) {
  const { x, s, DB, DF } = o;
  drawDeskTop(ctx, o.x0 ?? -120, o.x1 ?? 1200, DB, DF);
  if (o.behind) o.behind(ctx);
  const M = ctx.getTransform();
  drawStick(ctx, C(ch, Object.assign({ x, y: DB + .27 * s, s, shadow: false, armLen: 1.35, legs: SIT_LEGS,
    propBehind: (c, k) => { if (k === 'L' && o.onDesk) { c.save(); c.setTransform(M); o.onDesk(c); c.restore(); } } }, o.fig)));
  drawDeskFront(ctx, o.x0 ?? -120, o.x1 ?? 1200, DF);
  if (o.front) o.front(ctx);
}
// hand target on the desk, in the figure's own units
const onDeskY = (s, px = 45) => px / s - .27;

function drawLamp(ctx, x, y, s = 1, on = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ellipse(ctx, 0, 0, 70, 20); fillStroke(ctx, '#2f63c9', 6);
  for (const [w, c] of [[16, INK], [8, '#4b7be0']]) { line(ctx, 0, -10, 40, -170, w, c); line(ctx, 40, -170, 150, -240, w, c); }
  circle(ctx, 40, -170, 13); fillStroke(ctx, '#2f63c9', 5);
  ctx.save(); ctx.translate(150, -240); ctx.rotate(-.55);
  ctx.beginPath(); ctx.moveTo(-30, -20); ctx.lineTo(30, -20); ctx.lineTo(72, 70); ctx.lineTo(-72, 70); ctx.closePath(); fillStroke(ctx, '#2f63c9', 6);
  ellipse(ctx, 0, 70, 72, 16); fillStroke(ctx, on ? '#fff6c0' : '#a8b3c4', 5);
  ctx.restore(); ctx.restore();
}

// open notebook lying on a desk (a trapezoid spread). o: {flip 0..1 right page turns over, close 0..1, hl:[line indices], cover, glowHl}
function drawNotebook(ctx, cx, T, B, wt, wb, o = {}) {
  const P = (u, v) => [cx + u * lerp(wt, wb, v), lerp(T, B, v)];
  const cover = o.cover || '#e0392f';
  const close = o.close || 0;
  const L = (T - B) * -1.5;
  const F = (u, v, p) => { const c = Math.cos(Math.PI * p), s = Math.sin(Math.PI * p); const [x, y] = P(u * c, v); return [x, y - u * s * L]; };
  const hl = o.hl || [1, 4];
  const lines = (side, pf, glowA) => {
    for (let i = 0; i < 7; i++) {
      const v = (i + 1.2) / 8.4; const end = .88 - (i * 37 % 5) * .08;
      const a = pf ? pf(side * .12, v) : P(side * .12, v), b = pf ? pf(side * end, v) : P(side * end, v);
      if (hl.includes(i) && side > 0 === (o.hlRight !== false)) { line(ctx, a[0], a[1], b[0], b[1], 16, glowA ? `rgba(255,236,80,${.6 + .4 * glowA})` : 'rgba(255,226,60,.75)'); }
      line(ctx, a[0], a[1], b[0], b[1], 5, 'rgba(60,60,90,.45)');
    }
  };
  // cover under the pages
  path(ctx, [P(-1.05, -.07), P(1.05, -.07), P(1.05, 1.08), P(-1.05, 1.08)]); fillStroke(ctx, cover, 6);
  // left page
  path(ctx, [P(-1, 0), P(0, 0), P(0, 1), P(-1, 1)]); fillStroke(ctx, PAPER, 5); lines(-1, null, 0);
  // right page (or the closing half)
  if (close <= 0) {
    path(ctx, [P(0, 0), P(1, 0), P(1, 1), P(0, 1)]); fillStroke(ctx, PAPER, 5); lines(1, null, o.glowHl || 0);
  } else {
    path(ctx, [P(0, -.07), P(1.05, -.07), P(1.05, 1.08), P(0, 1.08)]); ctx.fillStyle = 'rgba(30,10,20,.25)'; ctx.fill();
  }
  line(ctx, P(0, 0)[0], P(0, 0)[1], P(0, 1)[0], P(0, 1)[1], 5, 'rgba(60,40,40,.5)');
  const flip = o.flip || 0;
  if (flip > 0 && flip < 1 && close <= 0) {
    const poly = [F(0, 0, flip), F(1, 0, flip), F(1, 1, flip), F(0, 1, flip)];
    path(ctx, poly); fillStroke(ctx, flip < .5 ? PAPER : '#efe9da', 5);
    if (Math.abs(flip - .5) > .12) lines(1, (u, v) => F(u, v, flip), 0);
  }
  if (close > 0) {
    const p = clamp(close);
    const poly = [F(0, -.07, p), F(1.05, -.07, p), F(1.05, 1.08, p), F(0, 1.08, p)];
    path(ctx, poly); fillStroke(ctx, p < .5 ? PAPER : cover, 6);
    if (p >= .5) { ctx.save(); path(ctx, poly); ctx.clip(); const m = F(.52, .5, p); ellipse(ctx, m[0], m[1], 80 * Math.abs(Math.cos(Math.PI * p)) + 1, 26, 0); ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fill(); ctx.restore(); }
  }
}
// a page seen from above, filling the frame (close-up)
function drawPageClose(ctx, x, y, w, h, rot, hlGlow = 0, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  rrect(ctx, -w / 2 + 16, -h / 2 + 22, w, h, 14); ctx.fillStyle = 'rgba(30,10,30,.25)'; ctx.fill();
  rrect(ctx, -w / 2, -h / 2, w, h, 14); fillStroke(ctx, PAPER, 9);
  line(ctx, -w / 2 + 110, -h / 2 + 10, -w / 2 + 110, h / 2 - 10, 5, 'rgba(224,57,47,.55)');
  for (let i = 0; i < 12; i++) {
    const yy = -h / 2 + 90 + i * 74; if (yy > h / 2 - 40) break;
    line(ctx, -w / 2 + 20, yy + 24, w / 2 - 20, yy + 24, 3, 'rgba(47,99,201,.25)');
    const R = rng(i + 3); let xx = -w / 2 + 140;
    const hl = i === 1 || i === 2 || i === 4;
    if (hl) { const a = .65 + .35 * hlGlow; rrect(ctx, xx - 12, yy - 26, w - 230, 46, 10); ctx.fillStyle = `rgba(255,232,60,${a})`; ctx.fill(); }
    while (xx < w / 2 - 80) { const ww = 50 + R() * 120; rrect(ctx, xx, yy - 9, Math.min(ww, w / 2 - 60 - xx), 18, 9); ctx.fillStyle = 'rgba(40,40,70,.55)'; ctx.fill(); xx += ww + 26; }
    if (hl && hlGlow > 0) { sparkle(ctx, w / 2 - 110 + Math.sin(t * 5 + i) * 20, yy - 30, 34 * hlGlow, hlGlow); }
  }
  ctx.restore();
}
function drawExamPaper(ctx, cx, T, B, wt, wb) {
  const P = (u, v) => [cx + u * lerp(wt, wb, v), lerp(T, B, v)];
  path(ctx, [P(-1, 0), P(1, 0), P(1, 1), P(-1, 1)]); fillStroke(ctx, '#ffffff', 6);
  const h0 = P(-.8, .2); text(ctx, 'EXAM', h0[0], h0[1], 34, '#e0392f', null, 0, 'Poppins', 700, 'left');
  for (let i = 0; i < 3; i++) { const v = .45 + i * .2; const a = P(-.8, v), b = P(.8, v); text(ctx, `Q${i + 1}.`, a[0], a[1] - 4, 22, INK, null, 0, 'Poppins', 700, 'left'); line(ctx, a[0] + 60, a[1] + 8, b[0], b[1] + 8, 4, 'rgba(60,60,90,.35)'); }
}
function pen(c, k, h, a, side) {
  if (k !== 'R') return;
  c.save(); c.translate(h[0], h[1]); c.rotate(-.5); rrect(c, -.012, -.17, .024, .2, .008); fillStroke(c, '#f2b52a', .009);
  c.beginPath(); c.moveTo(-.012, .03); c.lineTo(.012, .03); c.lineTo(0, .065); c.closePath(); fillStroke(c, '#f5d7a0', .008); c.restore();
}

// ---------- bubbles, brain, bulb, clock, calendar, bars ----------
function drawBubble(ctx, x, y, w, h, tx, ty, str, size = 56, o = {}) {
  const sc = o.scale ?? 1; if (sc <= .01) return;
  ctx.save(); ctx.translate(tx, ty); ctx.scale(sc, sc); ctx.translate(-tx, -ty);
  if (o.thought) { for (let i = 0; i < 3; i++) { const k = (i + 1) / 4; circle(ctx, lerp(tx, x, k * .85), lerp(ty, y + h / 2, k * .85), 9 + i * 7); fillStroke(ctx, '#fff', 5); } }
  else { ctx.beginPath(); ctx.moveTo(x - 34, y + h / 2 - 10); ctx.lineTo(tx, ty); ctx.lineTo(x + 34, y + h / 2 - 10); ctx.closePath(); fillStroke(ctx, '#fff', 7); }
  rrect(ctx, x - w / 2, y - h / 2, w, h, Math.min(h * .45, 80)); fillStroke(ctx, '#fff', 7);
  if (str) text(ctx, str, x, y + 2, size, o.col || INK, null, 0);
  if (o.draw) o.draw(ctx, x, y);
  ctx.restore();
}
function drawBrain(ctx, x, y, r, t, f = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 3) * .04);
  const B = [[-.55, .1, .5], [-.3, -.35, .5], [.2, -.4, .52], [.6, -.05, .45], [.35, .35, .45], [-.2, .35, .48]];
  const shape = () => { ctx.beginPath(); B.forEach(([bx, by, br]) => { ctx.moveTo(bx * r + br * r, by * r); ctx.arc(bx * r, by * r, br * r, 0, TAU); }); };
  shape(); ctx.lineWidth = r * .13; ctx.strokeStyle = INK; ctx.stroke();
  shape(); ctx.fillStyle = '#f7a1b5'; ctx.fill();
  ctx.strokeStyle = '#d06a85'; ctx.lineWidth = r * .045; ctx.lineCap = 'round';
  [[[-.75, -.05], [-.5, -.3], [-.35, -.08]], [[-.15, -.62], [0, -.35], [.28, -.58]], [[.55, -.3], [.75, .02], [.55, .22]], [[-.6, .38], [-.35, .2], [-.15, .45]], [[.15, .5], [.3, .38], [.45, .55]]]
    .forEach(([a, b, c]) => { ctx.beginPath(); ctx.moveTo(a[0] * r, a[1] * r); ctx.quadraticCurveTo(b[0] * r, b[1] * r, c[0] * r, c[1] * r); ctx.stroke(); });
  const ey = .02 * r;
  for (const s of [-1, 1]) {
    circle(ctx, s * .25 * r, ey, .15 * r); fillStroke(ctx, '#fff', r * .04);
    circle(ctx, s * .25 * r + (f.look || 0) * .05 * r, ey + .03 * r, .065 * r); ctx.fillStyle = INK; ctx.fill();
    if (f.smug) { ctx.save(); circle(ctx, s * .25 * r, ey, .17 * r); ctx.clip(); ctx.fillStyle = '#f7a1b5'; ctx.fillRect(s * .25 * r - .2 * r, ey - .2 * r, .4 * r, .17 * r); ctx.restore(); line(ctx, s * .25 * r - .16 * r, ey - .03 * r, s * .25 * r + .16 * r, ey - .03 * r, r * .045); }
  }
  ctx.beginPath(); ctx.moveTo(-.18 * r, .3 * r); ctx.quadraticCurveTo(.02 * r, .44 * r, .22 * r, .24 * r); ctx.lineWidth = r * .05; ctx.strokeStyle = INK; ctx.stroke();
  ctx.restore();
}
function drawBulb(ctx, x, y, s, on, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (on > 0) {
    glow(ctx, 0, -20, 300, '255,230,120', .6 * on);
    for (let i = 0; i < 10; i++) { const a = i / 10 * TAU + .3; const r0 = 115, r1 = 140 + 40 * on; line(ctx, Math.cos(a) * r0, Math.sin(a) * r0 - 20, Math.cos(a) * r1, Math.sin(a) * r1 - 20, 11, `rgba(255,200,40,${on})`); }
  }
  ctx.beginPath(); ctx.arc(0, -20, 82, Math.PI * .78, Math.PI * .22); ctx.lineTo(32, 72); ctx.lineTo(-32, 72); ctx.closePath(); fillStroke(ctx, on > .4 ? '#ffe45a' : '#eef3f6', 8);
  ellipse(ctx, -32, -52, 18, 30, .5); ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(-18, 70); ctx.lineTo(-10, 10); ctx.lineTo(0, 30); ctx.lineTo(10, 10); ctx.lineTo(18, 70); ctx.lineWidth = 5; ctx.strokeStyle = on > .4 ? '#c47a10' : '#8a8a96'; ctx.stroke();
  for (let i = 0; i < 3; i++) { rrect(ctx, -36, 72 + i * 16, 72, 16, 6); fillStroke(ctx, i % 2 ? '#8d97a8' : '#b7c0cf', 5); }
  ctx.restore();
}
function drawClock(ctx, x, y, r, t) {
  circle(ctx, x + 8, y + 10, r); ctx.fillStyle = 'rgba(20,30,40,.18)'; ctx.fill();
  circle(ctx, x, y, r); fillStroke(ctx, '#fff', 9); circle(ctx, x, y, r * .9); fillStroke(ctx, null, 4);
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; line(ctx, x + Math.cos(a) * r * .72, y + Math.sin(a) * r * .72, x + Math.cos(a) * r * .84, y + Math.sin(a) * r * .84, i % 3 ? 4 : 8); }
  line(ctx, x, y, x + Math.cos(-2.1) * r * .45, y + Math.sin(-2.1) * r * .45, 10);
  line(ctx, x, y, x + Math.cos(-.9) * r * .66, y + Math.sin(-.9) * r * .66, 7);
  const sa = Math.floor(t * 2) / 2 * TAU / 60 * 6 - Math.PI / 2;
  line(ctx, x, y, x + Math.cos(sa) * r * .78, y + Math.sin(sa) * r * .78, 4, '#e0392f');
  circle(ctx, x, y, 9); ctx.fillStyle = INK; ctx.fill();
}
// tear-off calendar. day: the page on top; tear: 0..1 the page above it flying away
function drawCalendar(ctx, x, y, s, day, tear) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const page = (d) => {
    rrect(ctx, -150, -150, 300, 320, 16); fillStroke(ctx, '#fff', 8);
    ctx.save(); rrect(ctx, -150, -150, 300, 320, 16); ctx.clip(); ctx.fillStyle = '#e0392f'; ctx.fillRect(-160, -160, 320, 90); ctx.restore();
    line(ctx, -150, -70, 150, -70, 8);
    text(ctx, 'DAY', 0, -108, 40, '#fff', null, 0);
    text(ctx, String(d), 0, 60, 150, INK, null, 0);
  };
  rrect(ctx, -142, -140, 300, 320, 16); fillStroke(ctx, '#ddd6c8', 8);
  page(day);
  for (const sx of [-80, 80]) { circle(ctx, sx, -150, 16); fillStroke(ctx, '#8d97a8', 6); }
  if (tear > 0 && tear < 1) {
    ctx.save(); ctx.translate(-150 - tear * 500, -150 - tear * 420); ctx.rotate(-tear * 1.4); ctx.globalAlpha = 1 - tear * .6; ctx.translate(150, 150); page(day - 1); ctx.restore();
  }
  ctx.restore();
}
function drawBar(ctx, x, base, w, h, col, label, labelA = 1) {
  if (h > 2) {
    rrect(ctx, x - w / 2, base - h, w, h, 18); fillStroke(ctx, col, 9);
    ctx.save(); rrect(ctx, x - w / 2, base - h, w, h, 18); ctx.clip(); ctx.fillStyle = 'rgba(255,255,255,.22)'; ctx.fillRect(x - w / 2 + 16, base - h, 24, h); ctx.fillStyle = 'rgba(20,0,30,.16)'; ctx.fillRect(x + w / 2 - 50, base - h, 50, h); ctx.restore();
  }
  if (label && labelA > 0 && h > 120) { ctx.save(); ctx.globalAlpha = labelA; text(ctx, label, x, base - h + 75, 80, '#fff', INK, 14); ctx.restore(); }
}
function drawCheck(ctx, x, y, s, k) {
  if (k <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * backOut(clamp(k)), s * backOut(clamp(k)));
  circle(ctx, 0, 0, 110); fillStroke(ctx, '#3fa35b', 10);
  ctx.beginPath(); ctx.moveTo(-52, 4); ctx.lineTo(-14, 44); ctx.lineTo(58, -40); ctx.lineWidth = 30; ctx.strokeStyle = '#fff'; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();
  ctx.restore();
}
// floating "thing you read" chips that drift out of a head and fade
function drawChip(ctx, x, y, str, a, rot) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = clamp(a); ctx.translate(x, y); ctx.rotate(rot);
  ctx.font = '700 44px Poppins'; const w = ctx.measureText(str).width + 44;
  rrect(ctx, -w / 2, -36, w, 72, 20); fillStroke(ctx, '#fff8d8', 6); text(ctx, str, 0, 2, 44, INK, null, 0);
  ctx.restore();
}

// ---------- the memory trail (from question to answer) ----------
const MEMPTS = [[-1, .25], [-.62, -.35], [-.2, .3], [.22, -.38], [.62, .2], [1, -.15]];
const MEMPATH = (() => {
  const out = [], P = MEMPTS;
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
    for (let k = 0; k < 24; k++) { const s = k / 24, s2 = s * s, s3 = s2 * s; out.push([0, 1].map(j => .5 * (2 * p1[j] + (-p0[j] + p2[j]) * s + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * s2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * s3))); }
  }
  out.push(P[P.length - 1]); return out;
})();
function memAt(f) { const i = clamp(f) * (MEMPATH.length - 1); const a = Math.floor(i), b = Math.min(MEMPATH.length - 1, a + 1); return [lerp(MEMPATH[a][0], MEMPATH[b][0], i - a), lerp(MEMPATH[a][1], MEMPATH[b][1], i - a)]; }
// o: {width, col, glow, faint, spark (0..1 or null), sparkA}
function drawMemPath(ctx, cx, cy, sc, o = {}) {
  const tr = p => [cx + p[0] * sc, cy + p[1] * sc];
  const stroke = (lw, c, dash) => { ctx.beginPath(); MEMPATH.forEach((p, i) => { const [x, y] = tr(p); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.setLineDash(dash || []); ctx.lineWidth = lw; ctx.strokeStyle = c; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke(); ctx.setLineDash([]); };
  const w = o.width || 8;
  if (o.glow) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; stroke(w * 3.2, `rgba(255,190,60,${.3 * o.glow})`); ctx.restore(); }
  if (o.faint) stroke(w, o.col || 'rgba(255,255,255,.55)', [w * .2, w * 2.4]);
  else { stroke(w + 12 * sc / 300, INK); stroke(w, o.col || '#f6c13a'); }
  const node = (p, col, ch) => { const [x, y] = tr(p); const r = 38 * sc / 300; circle(ctx, x, y, r); fillStroke(ctx, col, 7 * sc / 300); text(ctx, ch, x, y + 3 * sc / 300, 48 * sc / 300, '#fff', null, 0); };
  node(MEMPTS[0], '#2f63c9', '?'); node(MEMPTS[MEMPTS.length - 1], '#3fa35b', '!');
  if (o.spark != null && (o.sparkA ?? 1) > 0) { const [x, y] = tr(memAt(o.spark)); glow(ctx, x, y, 90 * sc / 300, '255,230,140', .9 * (o.sparkA ?? 1)); sparkle(ctx, x, y, 34 * sc / 300, o.sparkA ?? 1); }
}
