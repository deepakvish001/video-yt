// ---------- "Why rereading notes doesn't work (and what does)" ----------
const C = (base, extra) => Object.assign({}, base, extra);
const handheld = (t, a = 4) => shake(t * .35, a, 1, 2);
const RED = { cols: ['#e0392f', '#e0392f'], hat: 'hair', hairCol: '#2b1d16', belt: false };
const BLUE = { cols: ['#2f63c9', '#2f63c9'], hat: 'hair', hairCol: '#6a3f1f', hairStyle: 2, belt: false };
const GREEN = { cols: ['#3fa35b', '#3fa35b'], hat: 'hair', hairCol: '#1d1a24', belt: false };
const YEL = { cols: ['#f2b52a', '#f2b52a'], hat: 'hair', hairCol: '#a3532a', hairStyle: 2, belt: false };
// progress of whichever page flip is running (0 when none)
const flipAt = (lt, starts, d = .4) => { for (const s of starts) if (lt >= s && lt < s + d) return (lt - s) / d; return 0; };
const popIn = (lt, at, d = .3) => backOut(clamp((lt - at) / d));
// hands on a notebook; the right hand follows a turning page
const readArms = (s, fp) => ({ L: { ik: [-.22, onDeskY(s)], bend: 1 }, R: { ik: [.24 - .34 * Math.sin(Math.PI * fp), onDeskY(s) - .1 * Math.sin(Math.PI * fp)], bend: -1 } });
function floorBand(ctx, base, col) { ctx.fillStyle = col; ctx.fillRect(-600, base, 2300, 1400); line(ctx, -600, base, 1700, base, 9); }
function confetti(ctx, x, y, k, seed) {
  if (k <= 0 || k >= 1) return; const R = rng(seed); const cols = ['#e0392f', '#2f63c9', '#f2b52a', '#3fa35b', '#7a4bc4', '#fff'];
  for (let i = 0; i < 26; i++) { const a = R() * TAU, v = 300 + R() * 500; const px = x + Math.cos(a) * v * k, py = y + Math.sin(a) * v * k * .7 + 900 * k * k; ctx.save(); ctx.translate(px, py); ctx.rotate(R() * 6 + k * 8); ctx.globalAlpha = 1 - k; rrect(ctx, -12, -7, 24, 14, 3); fillStroke(ctx, cols[i % 6], 3); ctx.restore(); }
}

const SHOTS = [];
const NIGHT = { s: 720, DB: 1010, DF: 1150, x: 540 };

// A — hook: cramming at night, the facts drift right back out
SHOTS.push({ start: 0, end: 3.52, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0], y: 930 + hh[1], z: 1.02 + lt * .04, r: Math.sin(t * .6) * .006 };
  roomNight(ctx, cam, t);
  const { s, DB, DF, x } = NIGHT;
  const fp = flipAt(lt, [-.15, .45, 1.0, 1.55, 2.1]);
  const lost = clamp((lt - 2.62) / .3);
  deskScene(ctx, RED, { x, s, DB, DF,
    onDesk: c => drawNotebook(c, x, DB + 12, DF - 14, 200, 240, { flip: fp, hl: [1, 3, 5] }),
    fig: { arms: readArms(s, fp), lean: .02, headTilt: lost > 0 ? -.1 * lost : .05,
      face: lost > 0 ? { eyes: 'wide', mouth: 'o', look: [0, -.5], browUp: 1 } : { eyes: 'normal', look: [Math.sin(t * 9) * .7, .8], mouth: 'flat', browAng: .15 } },
    front: c => drawLamp(c, 140, DB + 75, 1.05, 1) });
  glow(ctx, 330, 1020, 760, '255,200,110', .32);
  [['1857', -1], ['x+y', 1], ['DNA', -1], ['abc', 1], ['E=mc2', 1]].forEach(([str, sd], i) => {
    const k = clamp((lt - 2.5 - i * .1) / .9); if (k <= 0) return;
    drawChip(ctx, x + sd * (70 + k * 250 + i * 12), 540 - k * 300 - i * 14, str, 1 - k * k, sd * k * .4);
  });
  if (lost > 0) sweat(ctx, x + 160, 540 + (lt - 2.8) * 40, 30, lost);
} });

// B — everyone rereads the night before, and it feels great
SHOTS.push({ start: 3.52, end: 7.52, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0] + lt * 8, y: 960 + hh[1], z: 1.0 + lt * .03, r: 0 };
  wallDay(ctx, cam, '#ffd36e', '#f6a95a');
  shelf(ctx, 200, 640); shelf(ctx, 200, 420);
  ctx.save(); ctx.translate(820, 400); ctx.rotate(.04);
  rrect(ctx, -170, -150, 340, 300, 16); fillStroke(ctx, '#fff', 8);
  ctx.save(); rrect(ctx, -170, -150, 340, 300, 16); ctx.clip(); ctx.fillStyle = '#e0392f'; ctx.fillRect(-180, -160, 360, 82); ctx.restore();
  line(ctx, -170, -68, 170, -68, 8);
  text(ctx, 'EXAM', 0, -108, 50, '#fff', null, 0); text(ctx, 'TOMORROW', 0, 20, 40, INK, null, 0);
  ctx.beginPath(); ctx.ellipse(0, 20, 158, 52, -.04, 0, TAU); ctx.lineWidth = 8; ctx.strokeStyle = '#e0392f'; ctx.stroke();
  for (const sx of [-90, 90]) { circle(ctx, sx, -150, 14); fillStroke(ctx, '#8d97a8', 5); }
  ctx.restore();
  applyCam(ctx, cam, 1);
  const DB = 1080, DF = 1200, s = 520;
  drawDeskTop(ctx, -150, 1230, DB, DF);
  const M = ctx.getTransform();
  const ok = clamp((lt - 2.68) / .2);
  [[GREEN, 190, .1, '#3fa35b'], [RED, 540, 0, '#e0392f'], [BLUE, 890, .3, '#2f63c9']].forEach(([ch, x, ph, cov], i) => {
    const fp = ok > 0 ? 0 : flipAt((lt + ph * 2) % 1.3, [.5], .45);
    drawStick(ctx, C(ch, { x, y: DB + .27 * s, s, shadow: false, armLen: 1.35, legs: SIT_LEGS, headTilt: Math.sin(t * 5 + i) * .03,
      propBehind: (c, k) => { if (k === 'L') { c.save(); c.setTransform(M); drawNotebook(c, x, DB + 10, DF - 12, 130, 160, { flip: fp, cover: cov }); c.restore(); } },
      arms: ok > 0 && i === 1 ? { L: { ik: [-.2, onDeskY(s)], bend: 1 }, R: [2.5, .35] } : readArms(s, fp),
      face: ok > 0 ? { eyes: 'smug', mouth: 'smirk', browAng: .2 } : { eyes: 'normal', look: [Math.sin(t * 8 + i) * .6, .8], mouth: 'flat' } }));
  });
  drawDeskFront(ctx, -150, 1230, DF);
  const ck = clamp((lt - 3.0) / .3);
  drawCheck(ctx, 540, 560, .9, ck);
  if (ck > 0) for (let i = 0; i < 4; i++) { const a = t * 2 + i * 1.6; sparkle(ctx, 540 + Math.cos(a) * 170, 560 + Math.sin(a) * 130, 28, ck); }
} });

// C — the page looks familiar, so the brain says "I know this"
SHOTS.push({ start: 7.52, end: 10.8, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0], y: 960 + hh[1], z: 1.0 + lt * .025, r: 0 };
  roomNight(ctx, cam, t, { poster: false, winX: 900 });
  applyCam(ctx, cam, 1);
  const fam = clamp((lt - .55) / .3), brainK = clamp((lt - 1.62) / .3), say = clamp((lt - 2.42) / .25);
  drawStick(ctx, C(RED, { x: 360, y: 1440, s: 1200, shadow: false, legs: SIT_LEGS, arms: { L: [.15, -.1], R: [.15, -.1] }, headTilt: .06,
    face: brainK > 0 ? { eyes: 'smug', mouth: 'smirk', look: [.6, -.2], browAng: .2 } : { eyes: 'normal', look: [.2, .9], mouth: 'flat' } }));
  drawPageClose(ctx, 540, 1330, 1000, 1000, -.05, fam, t);
  glow(ctx, 360, 900, 900, '255,200,110', .22);
  if (brainK > 0) {
    ctx.save(); ctx.translate(790, 650); const sc = backOut(brainK); ctx.scale(sc, sc); drawBrain(ctx, 0, 0, 150, t, { smug: say > 0, look: -1 }); ctx.restore();
    for (let i = 0; i < 3; i++) { const a = t * 2 + i * 2.1; sparkle(ctx, 790 + Math.cos(a) * 210, 650 + Math.sin(a) * 175, 26, brainK); }
  }
  drawBubble(ctx, 720, 330, 470, 150, 780, 500, 'I know this!', 58, { scale: backOut(say) });
} });

// D — exam day: the feeling pops, the page stays blank
SHOTS.push({ start: 10.8, end: 13.2, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 4);
  const blank = lt > .72;
  const sh = blank ? shake(t, 7 * clamp(1 - (lt - .72) / .6), 3) : [0, 0];
  const cam = { x: 540 + hh[0] + sh[0], y: 960 + hh[1] + sh[1], z: kf(lt, [[0, 1.1], [2.4, 1.0]]), r: 0 };
  wallDay(ctx, cam, '#9fdccf', '#6fbfb0');
  drawClock(ctx, 210, 340, 100, t);
  applyCam(ctx, cam, .6);
  drawDeskTop(ctx, -250, 1330, 770, 830, '#d9a26a');
  [[150, GREEN], [930, YEL]].forEach(([x, ch], i) => drawStick(ctx, C(ch, { x, y: 770 + .27 * 300, s: 300, shadow: false, legs: SIT_LEGS, prop: pen,
    arms: { L: { ik: [-.15, onDeskY(300, 28)], bend: 1 }, R: { ik: [.12 + Math.sin(t * 9 + i) * .04, onDeskY(300, 28)], bend: -1 } }, face: { eyes: 'normal', look: [0, .9], mouth: 'flat' } })));
  drawDeskFront(ctx, -250, 1330, 830, 1400, '#b97a42');
  applyCam(ctx, cam, 1);
  const s = 720, DB = 1060, DF = 1190, x = 540;
  deskScene(ctx, RED, { x, s, DB, DF,
    onDesk: c => drawExamPaper(c, x, DB + 12, DF - 14, 190, 225),
    fig: { arms: { L: { ik: [-.22, onDeskY(s)], bend: 1 }, R: { ik: [.16, onDeskY(s) - .02], bend: -1 } }, prop: pen,
      face: blank ? { eyes: 'wide', mouth: 'teeth', browAng: -.35, browUp: 1, look: [0, .6] } : { eyes: 'smug', mouth: 'smirk', look: [0, .7] } } });
  if (!blank) drawBubble(ctx, 770, 420, 420, 140, 640, 560, 'I know this!', 52, { thought: true });
  else {
    const k = clamp((lt - .72) / .4);
    ctx.save(); ctx.globalAlpha = 1 - k; burst(ctx, 770, 420, 110 + k * 90, 12, '#fff', 8, .5); ctx.restore();
    puff(ctx, 770, 420, 80 + 120 * k, t, '#ffffff', 5, 1 - k);
    sweat(ctx, x + 170, 600 + (lt - .8) * 50, 34, clamp((lt - .8) * 4)); sweat(ctx, x - 175, 640 + (lt - 1.1) * 40, 26, clamp((lt - 1.1) * 4));
    const q = clamp((lt - 1.5) / .3); if (q > 0) { ctx.save(); ctx.globalAlpha = q; text(ctx, '?', 770, 470 - q * 30, 150, '#fff', INK, 16); text(ctx, '?', 870, 400 - q * 20, 100, '#fff', INK, 12); ctx.restore(); }
  }
} });

// E — the experiment, group A: read it four times
SHOTS.push({ start: 13.2, end: 16.64, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0], y: 960 + hh[1], z: 1.0 + lt * .03, r: 0 };
  wallDay(ctx, cam, '#7ec4e8', '#4f9fcf');
  applyCam(ctx, cam, .5);
  drawBoard(ctx, 540, 470, 900, 520);
  chalkText(ctx, 'EXPERIMENT', 540, 300, 84, clamp((lt - .05) / .7));
  chalkText(ctx, 'GROUP A', 300, 440, 60, clamp((lt - 1.0) / .4));
  const reads = [1.68, 2.0, 2.48, 2.8];
  const n = reads.filter(r => lt >= r).length;
  if (n > 0) { const k = clamp((lt - reads[n - 1]) / .25); ctx.save(); ctx.translate(730, 580); const sc = 1.35 - .35 * backOut(k); ctx.scale(sc, sc); chalkText(ctx, 'READ ×' + n, 0, 0, 92); ctx.restore(); }
  applyCam(ctx, cam, 1);
  const s = 640, DB = 1060, DF = 1190, x = 540;
  const fp = flipAt(lt, reads.map(r => r - .12));
  deskScene(ctx, RED, { x, s, DB, DF,
    onDesk: c => drawNotebook(c, x, DB + 12, DF - 14, 190, 230, { flip: fp, hl: [] }),
    fig: { arms: readArms(s, fp), headTilt: .04,
      face: n >= 3 ? { eyes: 'half', mouth: 'flat', look: [0, .9] } : { eyes: 'normal', look: [Math.sin(t * 8) * .6, .85], mouth: 'flat' } } });
} });

// F — a week later: forty percent
SHOTS.push({ start: 16.64, end: 19.04, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0], y: 960 + hh[1], z: 1.0 + lt * .02, r: 0 };
  wallDay(ctx, cam, '#ffc98f', '#ff9f7a', .3);
  applyCam(ctx, cam, 1);
  const base = 1180; floorBand(ctx, base, '#e8875f');
  const tears = [0, 1, 2, 3, 4, 5, 6].map(i => .02 + i * .1);
  const nt = tears.filter(v => lt >= v).length;
  drawCalendar(ctx, 290, 450, 1.0, 1 + nt, nt ? clamp((lt - tears[nt - 1]) / .3) : 1);
  const h = kf(lt, [[.95, 0], [1.45, 360, easeOut]]);
  drawBar(ctx, 720, base, 280, h, '#e0392f', '40%', clamp((lt - 1.3) / .2));
  const meh = lt > 1.45;
  drawStick(ctx, C(RED, { x: 720, y: base - h, s: 380, arms: meh ? { L: [.15, 0], R: [.15, 0] } : POSE.idle.arms,
    face: meh ? { eyes: 'half', mouth: 'frown', browAng: -.2 } : { eyes: 'normal', mouth: 'flat', look: [0, -.3] }, headTilt: meh ? -.08 : 0, lean: meh ? .04 : 0 }));
  if (meh) sweat(ctx, 720 + 85, base - h - 300 + (lt - 1.5) * 30, 22, clamp((lt - 1.5) * 4));
} });

// G — group B: read it once, then try to recall it three times
SHOTS.push({ start: 19.04, end: 22.4, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0], y: 960 + hh[1], z: 1.0 + lt * .03, r: 0 };
  wallDay(ctx, cam, '#7ec4e8', '#4f9fcf');
  applyCam(ctx, cam, .5);
  drawBoard(ctx, 540, 470, 900, 520);
  chalkText(ctx, 'GROUP B', 380, 300, 84, clamp(lt / .5));
  chalkText(ctx, 'READ ×1', 300, 470, 64, clamp((lt - .32) / .35));
  const recalls = [1.92, 2.36, 2.8];
  const n = recalls.filter(r => lt >= r).length;
  if (n > 0) { const k = clamp((lt - recalls[n - 1]) / .25); ctx.save(); ctx.translate(320, 600); const sc = 1.35 - .35 * backOut(k); ctx.scale(sc, sc); chalkText(ctx, 'RECALL ×' + n, 0, 0, 70); ctx.restore(); }
  applyCam(ctx, cam, 1);
  const s = 640, DB = 1060, DF = 1190, x = 540;
  const close = clamp((lt - .6) / .28);
  const think = lt > 1.4;
  const att = recalls.findIndex(r => lt >= r - .42 && lt < r);
  deskScene(ctx, BLUE, { x, s, DB, DF,
    onDesk: c => drawNotebook(c, x, DB + 12, DF - 14, 190, 230, { close, cover: '#2f63c9', hl: [2, 4] }),
    fig: { arms: think ? { L: { ik: [-.25, onDeskY(s)], bend: 1 }, R: { ik: [.06, -.69], bend: -1 } } : readArms(s, close > 0 ? close * .6 : 0), headTilt: think ? -.06 : .04,
      face: att >= 0 ? { eyes: 'squint', mouth: 'teeth', browAng: .3 } : think ? { eyes: 'normal', look: [.6, -.7], mouth: 'flat', browAng: -.15 } : { eyes: 'normal', look: [0, .9], mouth: 'flat' } } });
  if (close >= 1 && lt < 1.1) puff(ctx, x + 150, DB + 40, 70 + (lt - .88) * 200, t, '#f2e6cc', 9, 1 - (lt - .88) / .22);
  const bk = popIn(lt, 1.45);
  drawBubble(ctx, 800, 430, 360, 190, 640, 580, null, 0, { thought: true, scale: bk, draw: (c, bx, by) => {
    const w = 3 + n * 3.5;
    const sp = att >= 0 ? (lt - (recalls[att] - .42)) / .42 : null;
    drawMemPath(c, bx, by + 6, 125, { width: w, col: mix('#b9b4c9', '#f6c13a', n / 3), spark: sp, sparkA: 1 });
  } });
} });

// H — sixty one percent
SHOTS.push({ start: 22.4, end: 24.24, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0], y: 960 + hh[1], z: 1.04 - lt * .02, r: 0 };
  wallDay(ctx, cam, '#a9e0ff', '#6cb8f0', .3);
  applyCam(ctx, cam, 1);
  const base = 1180; floorBand(ctx, base, '#5aa0d8');
  drawBar(ctx, 300, base, 260, 360, '#e0392f', '40%');
  drawStick(ctx, C(RED, { x: 300, y: base - 360, s: 380, arms: { L: [.15, 0], R: [.15, 0] }, face: { eyes: 'half', mouth: 'frown', look: [.8, -.2] }, headTilt: -.06 }));
  const h = kf(lt, [[.12, 0], [.72, 549, easeOut]]);
  const win = lt > .72;
  if (win) { const k = clamp((lt - .72) / .5); ctx.save(); ctx.globalAlpha = 1 - k; burst(ctx, 780, base - h - 150, 200 + k * 140, 14, '#ffe14d', 11, .55); ctx.restore(); }
  drawBar(ctx, 780, base, 260, h, '#2f63c9', '61%', clamp((lt - .55) / .2));
  const jump = win ? Math.abs(Math.sin((lt - .72) * 9)) * 60 * Math.exp(-(lt - .72) * 1.5) : 0;
  drawStick(ctx, C(BLUE, { x: 780, y: base - h - jump, s: 380, arms: win ? POSE.handsUp.arms : POSE.idle.arms,
    face: win ? { eyes: 'happy', mouth: 'grin', browUp: 1 } : { eyes: 'wide', mouth: 'o', look: [0, -.5] } }));
  confetti(ctx, 780, base - h - 200, clamp((lt - .72) / 1.1), 31);
} });

// I — the mechanism: every pull strengthens the trail from question to answer
SHOTS.push({ start: 24.24, end: 27.92, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 2);
  const cam = { x: 540 + hh[0], y: 960 + hh[1], z: kf(lt, [[0, 1.08], [3.6, 1.0]]), r: 0 };
  wallDay(ctx, cam, '#7a5cc9', '#4a3a99', .3);
  applyCam(ctx, cam, 1);
  const HX = 540, HY = 860, HR = 470;
  rrect(ctx, HX - 400, HY + HR - 90, 800, 800, 220); fillStroke(ctx, '#e0392f', 11);
  ctx.save(); rrect(ctx, HX - 400, HY + HR - 90, 800, 800, 220); ctx.clip(); ctx.fillStyle = 'rgba(30,10,40,.18)'; ctx.fillRect(HX + 120, HY, 400, 1400); ctx.restore();
  circle(ctx, HX, HY, HR); ctx.fillStyle = HEAD; ctx.fill();
  ctx.save(); circle(ctx, HX, HY, HR); ctx.clip(); ctx.beginPath(); ctx.arc(HX, HY, HR + 10, 0, TAU); ctx.arc(HX - 110, HY - 100, HR, 0, TAU, true); ctx.fillStyle = HEAD_SH; ctx.fill(); ctx.restore();
  ctx.save(); circle(ctx, HX, HY, HR); ctx.clip(); drawHair(ctx, HX, HY, HR, '#2b1d16', 1, 11); ctx.restore();
  circle(ctx, HX, HY, HR); fillStroke(ctx, null, 11);
  ellipse(ctx, HX, HY - 200, 385, 220); fillStroke(ctx, '#f7c3cf', 10);
  ctx.save(); ellipse(ctx, HX, HY - 200, 385, 220); ctx.clip(); ctx.strokeStyle = 'rgba(208,106,133,.35)'; ctx.lineWidth = 9; ctx.lineCap = 'round';
  for (let i = 0; i < 9; i++) { const R = rng(i + 40); const sx = HX - 340 + R() * 680, sy = HY - 380 + R() * 360; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo(sx + 50, sy - 40, sx + 100, sy + 10); ctx.stroke(); }
  ctx.restore();
  const passes = [[.1, .7], [1.2, .65], [2.18, .62]];
  let spark = null, grown = 0;
  passes.forEach(([s0, d]) => { if (lt >= s0 && lt < s0 + d) spark = (lt - s0) / d; grown += clamp((lt - s0 - d) / .2); });
  const strong = clamp((lt - 3.0) / .3);
  drawMemPath(ctx, HX, HY - 200, 300, { width: 6 + 13 * grown, col: mix('#b9b4c9', '#f6c13a', grown / 3), glow: strong + (grown >= 3 ? .3 : 0), spark, sparkA: 1 });
  if (strong > 0) for (let i = 0; i < 5; i++) { const p = memAt(i / 4); sparkle(ctx, HX + p[0] * 300 + Math.sin(t * 4 + i) * 20, HY - 200 + p[1] * 300 - 60, 30, strong); }
  const effort = spark != null, happy = lt > 3.05;
  for (const sd of [-1, 1]) {
    const ex = HX + sd * 150, ey = HY + 125;
    ctx.lineWidth = 15; ctx.strokeStyle = INK; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (happy) { ctx.beginPath(); ctx.arc(ex, ey + 22, 52, Math.PI * 1.12, Math.PI * 1.88); ctx.stroke(); }
    else if (effort) { ctx.beginPath(); ctx.moveTo(ex + sd * 42, ey - 38); ctx.lineTo(ex - sd * 42, ey); ctx.lineTo(ex + sd * 42, ey + 38); ctx.stroke(); }
    else { circle(ctx, ex, ey, 60); fillStroke(ctx, '#fff', 12); circle(ctx, ex, ey - 12, 27); ctx.fillStyle = INK; ctx.fill(); circle(ctx, ex - 9, ey - 21, 8); ctx.fillStyle = '#fff'; ctx.fill(); }
    ctx.save(); ctx.translate(ex, ey - 95); ctx.rotate(effort ? sd * .3 : 0); ctx.beginPath(); ctx.moveTo(-50, 8); ctx.quadraticCurveTo(0, -14, 50, 8); ctx.lineWidth = 15; ctx.stroke(); ctx.restore();
  }
  const my = HY + 255;
  if (happy) { ctx.beginPath(); ctx.moveTo(HX - 95, my - 20); ctx.quadraticCurveTo(HX, my - 5, HX + 95, my - 20); ctx.quadraticCurveTo(HX + 80, my + 70, HX, my + 66); ctx.quadraticCurveTo(HX - 80, my + 70, HX - 95, my - 20); fillStroke(ctx, '#7a2630', 13); }
  else if (effort) { rrect(ctx, HX - 80, my - 26, 160, 54, 16); fillStroke(ctx, '#fff', 12); line(ctx, HX - 80, my, HX + 80, my, 7); for (let i = -2; i <= 2; i++) line(ctx, HX + i * 27, my - 26, HX + i * 27, my + 28, 6); }
  else line(ctx, HX - 50, my, HX + 50, my, 15);
  if (effort) sweat(ctx, HX + 330, HY - 20 + Math.sin(t * 6) * 6, 44, 1);
} });

// J — rereading just shows the same page again; the trail never gets used
SHOTS.push({ start: 27.92, end: 30.64, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0], y: 930 + hh[1], z: 1.04 + lt * .02, r: 0 };
  roomNight(ctx, cam, t, { winX: 760 });
  const { s, DB, DF, x } = NIGHT;
  const flips = [.62, 1.18, 1.74];
  const fp = flipAt(lt, flips);
  const yawn = lt > 2.25 && lt < 2.7;
  deskScene(ctx, RED, { x, s, DB, DF,
    onDesk: c => drawNotebook(c, x, DB + 12, DF - 14, 200, 240, { flip: fp, hl: [1, 3, 5] }),
    fig: { arms: readArms(s, fp), headTilt: .08 + Math.sin(t * 1.5) * .03,
      face: { eyes: yawn ? 'squint' : 'half', mouth: yawn ? 'o' : 'flat', look: [0, .9] } },
    front: c => drawLamp(c, 140, DB + 75, 1.05, 1) });
  glow(ctx, 330, 1020, 760, '255,200,110', .3);
  const last = flips.filter(f => lt >= f).pop();
  const sp = last != null ? clamp((lt - last) / .5) * .3 : null;
  drawBubble(ctx, 800, 330, 380, 200, 640, 520, null, 0, { thought: true, scale: popIn(lt, .1), draw: (c, bx, by) => {
    drawMemPath(c, bx, by + 6, 130, { faint: true, width: 7, col: 'rgba(120,110,150,.6)', spark: sp, sparkA: sp != null ? 1 - sp / .3 : 0 });
  } });
} });

// K — close the notebook and ask yourself
SHOTS.push({ start: 30.64, end: 34.08, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const slam = lt > .4 && lt < .7 ? shake(t, 8 * (1 - (lt - .4) / .3), 3) : [0, 0];
  const cam = { x: 540 + hh[0] + slam[0], y: kf(lt, [[0, 930], [3.4, 860]]) + hh[1] + slam[1], z: kf(lt, [[0, 1.0], [3.4, 1.12]]), r: 0 };
  roomNight(ctx, cam, t);
  const { s, DB, DF, x } = NIGHT;
  const close = clamp((lt - .12) / .26);
  const think = lt > 1.2;
  deskScene(ctx, RED, { x, s, DB, DF,
    onDesk: c => drawNotebook(c, x, DB + 12, DF - 14, 200, 240, { close, hl: [1, 3, 5] }),
    fig: { arms: think ? { L: { ik: [-.25, onDeskY(s)], bend: 1 }, R: { ik: [.06, -.69], bend: -1 } } : readArms(s, close * .6), headTilt: think ? -.07 : 0,
      face: lt > 2.85 ? { eyes: 'squint', mouth: 'flat', browAng: .3 } : think ? { eyes: 'normal', look: [.6, -.7], mouth: 'flat', browAng: -.15 } : { eyes: 'normal', mouth: 'flat', look: [0, .8], browAng: .25 } },
    front: c => drawLamp(c, 140, DB + 75, 1.05, 1) });
  glow(ctx, 330, 1020, 760, '255,200,110', .3);
  if (close >= 1 && lt < .9) { const k = (lt - .38) / .5; puff(ctx, x - 230, DB + 40, 70 + k * 120, t, '#f2e6cc', 3, 1 - k); puff(ctx, x + 40, DB + 50, 60 + k * 110, t, '#f2e6cc', 4, 1 - k); }
  drawBubble(ctx, 690, 330, 600, 170, 610, 515, 'what did I just read?', 46, { thought: true, scale: popIn(lt, 1.5) });
} });

// L — struggling to remember is how you learn
SHOTS.push({ start: 34.08, end: 38.2, tr: 'cut', draw(ctx, lt, t) {
  const hard = lt < 2.05;
  const sh = hard ? shake(t, 4, 2.5) : [0, 0];
  const cam = { x: 540 + sh[0], y: 700 + sh[1], z: kf(lt, [[0, 1.3], [3.6, 1.45]]), r: 0 };
  roomNight(ctx, cam, t);
  const { s, DB, DF, x } = NIGHT;
  const idea = clamp((lt - 2.06) / .25);
  deskScene(ctx, RED, { x, s, DB, DF,
    onDesk: c => drawNotebook(c, x, DB + 12, DF - 14, 200, 240, { close: 1 }),
    fig: { arms: hard ? { L: { ik: [-.2, -.78], bend: 1 }, R: { ik: [.2, -.78], bend: -1 } } : { L: { ik: [-.25, onDeskY(s)], bend: 1 }, R: [2.7, .15] },
      headTilt: hard ? Math.sin(t * 7) * .04 : .05,
      face: hard ? { eyes: 'squint', mouth: 'teeth', browAng: .35 } : { eyes: 'happy', mouth: 'grin', browUp: 1 } },
    front: c => drawLamp(c, 140, DB + 75, 1.05, 1) });
  glow(ctx, 330, 1020, 760, '255,200,110', .3);
  if (hard) { sweat(ctx, x + 160, 560 + (lt % 1) * 40, 26, 1); sweat(ctx, x - 165, 600 + ((lt + .5) % 1) * 35, 20, 1); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (idea > 0) {
    drawBulb(ctx, 540, 430, .8 * backOut(idea), idea, t);
    for (let i = 0; i < 5; i++) { const a = t * 1.5 + i * TAU / 5; star5(ctx, 540 + Math.cos(a) * 330, 700 + Math.sin(a) * 120, 26, t * 2, '#ffe14d'); }
  }
} });
