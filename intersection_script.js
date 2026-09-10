document.getElementById('tb-date').textContent = new Date().toLocaleDateString('en-US', {
  year: 'numeric', month: 'short', day: 'numeric'
});


const canvas = document.getElementById('intersection');
const ctx = canvas.getContext('2d');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const COLORS = {
  bg: '#0F1826',
  line: 'rgba(146, 162, 190, 0.4)',
  lineDim: 'rgba(146, 162, 190, 0.22)',
  amber: '#E8A33D',
  green: '#4C9A6A',
  red: '#C25B4A',
  text: 'rgba(146, 162, 190, 0.55)',
  vehicle: 'rgba(237, 239, 242, 0.85)',
};

function getCssVar(name) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

function hexToRgb(hex) {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

const bgRgb = hexToRgb(getCssVar('--bg'));

let w, h, cx, cy, dpr;
const ROAD_WIDTH = 116;

function resize() {
  dpr = window.devicePixelRatio || 1;
  w = canvas.width = canvas.offsetWidth * dpr;
  h = canvas.height = canvas.offsetHeight * dpr;
  cx = w / 2;
  cy = h / 2;
}
window.addEventListener('resize', resize);
resize();


let phase = 0;
let phaseTimer = 0;
const phaseDurations = [3400, 650, 3400, 650];

function signalColor(axis) {
  const nsGreen = phase === 0, nsAmber = phase === 1;
  const ewGreen = phase === 2, ewAmber = phase === 3;
  if (axis === 'ns' || axis === 'ns1') return nsGreen ? COLORS.green : nsAmber ? COLORS.amber : COLORS.red;
  return (phase === 2) ? COLORS.green : (phase === 3) ? COLORS.amber : COLORS.red;
}

function makeVehicle(axis, dir, stagger, speed, accel, decl) {
  const cruiseSpeed = speed;
  const acceleration = accel;
  const deceleration = decl;
  return {
    axis, dir,
    pos: -0.9 + stagger,
    speed: cruiseSpeed,
    cruiseSpeed: cruiseSpeed,
    targetSpeed: cruiseSpeed,
    acceleration: acceleration,
    deceleration: deceleration,
    len: 13 + Math.random() * 5,
  };
}

let vehicles = [];
function seedVehicles() {
  vehicles = [];
  [1, -1].forEach(dir => {
    for (let i = 0; i < 2; i++) vehicles.push(makeVehicle('ns', dir, i * 0.4 + Math.random() * 0.5, 0.0002, 0.0000001, 0.0000007));
  });
  [1, -1].forEach(dir => {
    for (let i = 0; i < 2; i++) vehicles.push(makeVehicle('ns1', dir, i * 0.4 + Math.random() * 0.5, 0.00015, 0.0000001, 0.0000004));
  });
  [1, -1].forEach(dir => {
    for (let i = 0; i < 2; i++) vehicles.push(makeVehicle('ew', dir, i * 0.4 + Math.random() * 0.5, 0.0002, 0.0000001, 0.0000007));
  });
  [1, -1].forEach(dir => {
    for (let i = 0; i < 2; i++) vehicles.push(makeVehicle('ew1', dir, i * 0.4 + Math.random() * 0.5, 0.00015, 0.0000001, 0.0000004));
  });
}
seedVehicles();

function laneOffset(axis, dir) {
  const q = (ROAD_WIDTH * dpr) / 8;
  const q1 = (ROAD_WIDTH * dpr) / 2 - (ROAD_WIDTH * dpr) / 8;
  let offset;
  if (axis === 'ns' || axis === 'ew') {
      offset = q;
  } else if (axis === 'ns1' || axis === 'ew1') {
      offset = q1;
  } else {
      offset = q;
  }
  return dir === 1 ? offset : -offset;
}


function drawRoads() {
  const rw = ROAD_WIDTH * dpr;

  ctx.strokeStyle = COLORS.line;
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.moveTo(cx - rw / 2, 0); ctx.lineTo(cx - rw / 2, cy - rw / 2);
  ctx.moveTo(cx - rw / 2, cy + rw / 2); ctx.lineTo(cx - rw / 2, h);
  ctx.moveTo(cx + rw / 2, 0); ctx.lineTo(cx + rw / 2, cy - rw / 2);
  ctx.moveTo(cx + rw / 2, cy + rw / 2); ctx.lineTo(cx + rw / 2, h);
  ctx.moveTo(0, cy - rw / 2); ctx.lineTo(cx - rw / 2, cy - rw / 2);
  ctx.moveTo(cx + rw / 2, cy - rw / 2); ctx.lineTo(w, cy - rw / 2);
  ctx.moveTo(0, cy + rw / 2); ctx.lineTo(cx - rw / 2, cy + rw / 2);
  ctx.moveTo(cx + rw / 2, cy + rw / 2); ctx.lineTo(w, cy + rw / 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(232, 163, 61, 0.4)';
  ctx.setLineDash([]);
  const off = 2.2 * dpr;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx - off, 0); ctx.lineTo(cx - off, cy - rw / 2);
  ctx.moveTo(cx - off, cy + rw / 2); ctx.lineTo(cx - off, h);
  ctx.moveTo(cx + off, 0); ctx.lineTo(cx + off, cy - rw / 2);
  ctx.moveTo(cx + off, cy + rw / 2); ctx.lineTo(cx + off, h);
  ctx.moveTo(0, cy - off); ctx.lineTo(cx - rw / 2, cy - off);
  ctx.moveTo(cx + rw / 2, cy - off); ctx.lineTo(w, cy - off);
  ctx.moveTo(0, cy + off); ctx.lineTo(cx - rw / 2, cy + off);
  ctx.moveTo(cx + rw / 2, cy + off); ctx.lineTo(w, cy + off);
  ctx.stroke();

  ctx.strokeStyle = COLORS.lineDim;
  ctx.setLineDash([7 * dpr, 9 * dpr]);
  ctx.beginPath();
  ctx.moveTo(cx - rw / 4, 0); ctx.lineTo(cx - rw / 4, cy - rw / 2);
  ctx.moveTo(cx - rw / 4, cy + rw / 2); ctx.lineTo(cx - rw / 4, h);
  ctx.moveTo(cx + rw / 4, 0); ctx.lineTo(cx + rw / 4, cy - rw / 2);
  ctx.moveTo(cx + rw / 4, cy + rw / 2); ctx.lineTo(cx + rw / 4, h);
  ctx.moveTo(0, cy - rw / 4); ctx.lineTo(cx - rw / 2, cy - rw / 4);
  ctx.moveTo(cx + rw / 2, cy - rw / 4); ctx.lineTo(w, cy - rw / 4);
  ctx.moveTo(0, cy + rw / 4); ctx.lineTo(cx - rw / 2, cy + rw / 4);
  ctx.moveTo(cx + rw / 2, cy + rw / 4); ctx.lineTo(w, cy + rw / 4);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawStopLine(x1, y1, x2, y2) {
  ctx.strokeStyle = COLORS.line;
  ctx.lineWidth = 2 * dpr;
  ctx.beginPath();
  ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.lineWidth = 1;
}

function drawCrosswalk(cxw, cyw, horizontal) {
  const stripes = 10;
  const rw = ROAD_WIDTH * dpr;
  const stripeLen = rw * 0.27;
  const gap = rw / stripes;
  ctx.strokeStyle = COLORS.lineDim;
  ctx.lineWidth = 3.2 * dpr;
  for (let i = 0; i < stripes; i++) {
    const off = -rw / 2 + gap * i + gap / 2;
    ctx.beginPath();
    if (horizontal) {
      ctx.moveTo(cxw + off, cyw - stripeLen / 2);
      ctx.lineTo(cxw + off, cyw + stripeLen / 2);
    } else {
      ctx.moveTo(cxw - stripeLen / 2, cyw + off);
      ctx.lineTo(cxw + stripeLen / 2, cyw + off);
    }
    ctx.stroke();
  }
  ctx.lineWidth = 1;
}

function drawCrosswalksAndStopLines() {
  const rw = ROAD_WIDTH * dpr;
  const setback = rw / 2 + 16 * dpr;
  const off = 2.2 * dpr

  drawCrosswalk(cx, cy - setback, true);
  drawCrosswalk(cx, cy + setback, true);
  drawCrosswalk(cx - setback, cy, false);
  drawCrosswalk(cx + setback, cy, false);

  drawStopLine(cx + rw / 2, cy - setback - 20 * dpr, cx + off, cy - setback - 20 * dpr);
  drawStopLine(cx - off, cy + setback + 20 * dpr, cx - rw / 2, cy + setback + 20 * dpr);
  drawStopLine(cx - setback - 20 * dpr, cy - off, cx - setback - 20 * dpr, cy - rw / 2);
  drawStopLine(cx + setback + 20 * dpr, cy + rw / 2, cx + setback + 20 * dpr, cy + off);
}

function drawSignalHousing(x, y, axis) {
  const bw = 11 * dpr, bh = 28 * dpr, r = 3 * dpr;
  ctx.fillStyle = 'rgba(22, 34, 58, 0.9)';
  ctx.strokeStyle = COLORS.lineDim;
  ctx.lineWidth = 1;
  roundRect(x - bw / 2, y - bh / 2, bw, bh, r);
  ctx.fill(); ctx.stroke();

  const active = signalColor(axis);
  const lamps = [COLORS.red, COLORS.amber, COLORS.green];
  const lampR = 2.6 * dpr;
  lamps.forEach((c, i) => {
    const ly = y - bh / 2 + bh * (i + 0.5) / 3;
    const lit = c === active;
    ctx.beginPath();
    ctx.arc(x, ly, lampR, 0, Math.PI * 2);
    if (lit) {
      const glow = ctx.createRadialGradient(x, ly, 0, x, ly, lampR * 4.5);
      glow.addColorStop(0, hexToRgba(c, 0.55));
      glow.addColorStop(1, hexToRgba(c, 0));
      ctx.fillStyle = glow;
      ctx.arc(x, ly, lampR * 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, ly, lampR, 0, Math.PI * 2);
      ctx.fillStyle = c;
    } else {
      ctx.fillStyle = 'rgba(146, 162, 190, 0.18)';
    }
    ctx.fill();
  });
}

function drawSignals() {
  const rw = ROAD_WIDTH * dpr;
  const off = rw / 2 + 19 * dpr;
  drawSignalHousing(cx - off, cy - off, 'ew');
  drawSignalHousing(cx + off, cy - off, 'ns');
  drawSignalHousing(cx - off, cy + off, 'ns');
  drawSignalHousing(cx + off, cy + off, 'ew');
}

function drawNorthArrow() {
  const x = w - 46 * dpr, y = 46 * dpr, r = 15 * dpr;
  ctx.strokeStyle = COLORS.lineDim;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y + r * 0.7);
  ctx.lineTo(x, y - r * 0.7);
  ctx.lineTo(x - r * 0.32, y - r * 0.2);
  ctx.moveTo(x, y - r * 0.7);
  ctx.lineTo(x + r * 0.32, y - r * 0.2);
  ctx.strokeStyle = COLORS.amber;
  ctx.stroke();
  ctx.fillStyle = COLORS.text;
  ctx.font = `${10 * dpr}px "IBM Plex Mono", monospace`;
  ctx.textAlign = 'center';
  ctx.fillText('N', x, y + r + 14 * dpr);
}

function drawLeader(fromX, fromY, toX, toY, label, align) {
  ctx.strokeStyle = COLORS.lineDim;
  ctx.setLineDash([3 * dpr, 4 * dpr]);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.beginPath();
  ctx.arc(fromX, fromY, 1.6 * dpr, 0, Math.PI * 2);
  ctx.fillStyle = COLORS.lineDim;
  ctx.fill();

  ctx.font = `${9.5 * dpr}px "IBM Plex Mono", monospace`;
  ctx.fillStyle = COLORS.text;
  ctx.textAlign = align || 'left';
  const pad = 6 * dpr * (align === 'right' ? -1 : 1);
  ctx.fillText(label, toX + pad, toY - 4 * dpr);
}

function drawAnnotations() {
  const rw = ROAD_WIDTH * dpr;
  drawLeader(cx + rw / 2 + 25 * dpr, cy - rw / 2 - 20 * dpr, cx + rw / 2 + 60 * dpr, cy - rw / 2 - 42 * dpr, 'SIGNAL HEAD, TYP.', 'left');
  drawLeader(cx + rw/2 - 12 * dpr, cy - rw / 2 - 30 * dpr, cx + 100 * dpr, cy - rw / 2 - 63 * dpr, 'CROSSWALK', 'left');
  drawLeader(cx - rw / 2 - 2 * dpr, cy + 130 * dpr, cx - rw / 2 - 50 * dpr, cy + 160 * dpr, 'E.O.P.', 'right');
  drawLeader(cx - rw / 2 + 20 * dpr, cy + 96 * dpr, cx - rw / 2 - 40 * dpr, cy + 130 * dpr, 'Stopline', 'right');
}

function roundRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function hexToRgba(hex, alpha) {
  const v = hex.replace('#', '');
  const r = parseInt(v.substring(0, 2), 16);
  const g = parseInt(v.substring(2, 4), 16);
  const b = parseInt(v.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}


function vehicleAhead(vehicle) {
  
    let nearest = null;
    vehicles.forEach(other => {
        if (other === vehicle) return;
        if (other.axis !== vehicle.axis) return;
        if (other.dir !== vehicle.dir) return;
        if (other.pos > vehicle.pos) {
            if (!nearest || other.pos < nearest.pos)
                nearest = other;
        }
    });
    return nearest;
}


const STOP_MARGIN = 0.006;

function getStopAt() {
  const rw = ROAD_WIDTH * dpr;
  const setback = rw / 2 + 16 * dpr;
  const stopLinePx = setback - 175 * dpr;
  const span = Math.max(w, h);
  return (stopLinePx / (span * 0.5)) - STOP_MARGIN;
}

function stepVehicles(dt) {
  const stopAt = getStopAt();

  vehicles.forEach(v => {
    const leader = vehicleAhead(v);
    let tooClose = false;
    if (leader) {
      const span = Math.max(w, h);
      const SAFE_GAP = ((leader.len / 2 * dpr) / (span * 0.5)) + 0.045;
      const gap = Math.abs(leader.pos - v.pos);
      if (gap < SAFE_GAP) tooClose = true;
    }

    const approachingLine = v.pos <= stopAt;
    const redOrAmber = signalColor(v.axis) !== COLORS.green;

    const brakingDistance = ((v.speed * v.speed) / (2 * v.deceleration)) * 1.6;
    const distToLine = stopAt - v.pos;

    const mustStop = approachingLine && redOrAmber && distToLine <= brakingDistance;

    v.targetSpeed = (mustStop || tooClose) ? 0 : v.cruiseSpeed;

    if (v.speed < v.targetSpeed) {
      v.speed += v.acceleration * dt;
      if (v.speed > v.targetSpeed) v.speed = v.targetSpeed;
    } else {
      v.speed -= v.deceleration * dt;
      if (v.speed < v.targetSpeed) v.speed = v.targetSpeed;
    }

    v.pos += v.speed * dt;

    if (approachingLine && redOrAmber && v.pos > stopAt) {
      v.pos = stopAt;
      v.speed = 0;
    }

    if (v.pos > 1) v.pos = -1 - Math.random() * 0.4;
  });
}


function drawVehicles() {
  const span = Math.max(w, h);
  vehicles.forEach(v => {
    const travel = v.pos * span * 0.5;
    const off = laneOffset(v.axis, v.dir);
    let x, y, vw, vh;

    if (v.axis === 'ns') {
      x = cx + off;
      y = cy + travel * v.dir;
      vw = 8 * dpr; vh = v.len * dpr;
    }
    else if (v.axis === 'ns1') {
      x = cx + off;
      y = cy + travel * v.dir;
      vw = 8 * dpr; vh = v.len * dpr;
    }
    else if (v.axis === 'ew') {
      y = cy - off;
      x = cx + travel * v.dir;
      vw = v.len * dpr; vh = 8 * dpr;
    }
    else {
      y = cy - off;
      x = cx + travel * v.dir;
      vw = v.len * dpr; vh = 8 * dpr;
    }

    ctx.fillStyle = COLORS.vehicle;
    roundRect(x - vw / 2, y - vh / 2, vw, vh, 2 * dpr);
    ctx.fill();

    ctx.fillStyle = 'rgba(232, 163, 61, 0.9)';
    ctx.beginPath();
    if (v.axis === 'ns' || v.axis === 'ns1') {
      ctx.arc(x, y + (vh / 2) * v.dir, 1.3 * dpr, 0, Math.PI * 2);
    } else {
      ctx.arc(x + (vw / 2) * v.dir, y, 1.3 * dpr, 0, Math.PI * 2);
    }
    ctx.fill();
  });
}

function drawStaticScene() {
  drawRoads();
  drawCrosswalksAndStopLines();
  drawSignals();
  drawNorthArrow();
  drawAnnotations();
}

let lastTime = performance.now();
function frame(now) {
  const dt = Math.min(now - lastTime, 50);
  lastTime = now;

  phaseTimer += dt;
  if (phaseTimer > phaseDurations[phase]) {
    phaseTimer = 0;
    phase = (phase + 1) % 4;
  }

  stepVehicles(dt);

  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = 'source-over';
  drawStaticScene();
  drawVehicles();

  requestAnimationFrame(frame);
}

if (prefersReducedMotion) {
  ctx.fillStyle = `rgba(${bgRgb}, 0)`;
  ctx.fillRect(0, 0, w, h);
  drawStaticScene();
  drawVehicles();
} else {
  requestAnimationFrame(frame);
}