let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let gridX = mouseX;
let gridY = mouseY;
let blockX = mouseX;
let blockY = mouseY;

const background = document.querySelector('.background');
window.addEventListener("scroll", () => {

    const scroll = window.scrollY * 0.15;

    background.style.setProperty(
        "--scroll",
        `${-scroll}px`
    );
    allBlocks.forEach(block => {
    block.style.transform =
        `translateY(${-scroll}px)`;
});

});

const scrollLayer = document.querySelector('.background-scroll');
const baseBlocks = document.querySelector('.blocks-base');
const highlightBlocks = document.querySelector('.blocks-highlight');

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});
function animate() {

    gridX += (mouseX - gridX) * 0.14;
    gridY += (mouseY - gridY) * 0.14;

    blockX += (mouseX - blockX) * 0.07;
    blockY += (mouseY - blockY) * 0.07;

    background.style.setProperty("--gridX", `${gridX}px`);
    background.style.setProperty("--gridY", `${gridY}px`);

    background.style.setProperty("--blockX", `${blockX}px`);
    background.style.setProperty("--blockY", `${blockY}px`);

    requestAnimationFrame(animate);

}
animate();

let probe = document.getElementById("size-probe");
if (!probe) {
    probe = document.createElement("div");
    probe.id = "size-probe";
    document.body.appendChild(probe);
}
function getCSSLength(variable) {
    probe.style.width = `var(${variable})`;
    return probe.getBoundingClientRect().width;
}

let cells = [];
function generateCells(col, size) {
  const pageHeight = document.documentElement.scrollHeight;
  const row = Math.ceil(pageHeight / size);

  cells = [];
  for (let y = 0; y < row; y++) {
    for (let x = 0; x < col; x++) {
      cells.push({ x, y });
    }
  }
  cells.sort(() => Math.random() - 0.5);
}

let allBlocks;
function placeBlocks() {
  const blockCount = Math.round(
    Math.max(200, Math.min(window.innerWidth * 5, 1000))
  );
  const blockSize = getCSSLength("--blockSize");
  const width = document.documentElement.clientWidth;
  const col = Math.floor(width / blockSize);
  const blockWidth = width / col;

  document.documentElement.style.setProperty('--blockWidth', `${blockWidth}px`);

  generateCells(col, blockSize);

  baseBlocks.innerHTML = '';
  highlightBlocks.innerHTML = '';

  cells.slice(0, blockCount).forEach(cell => {
    const left = cell.x * blockWidth;
    const top = cell.y * blockSize;

    const b1 = document.createElement('div');
    const b2 = document.createElement('div');
    const baseAlpha = 0.004 + Math.random() * 0.04;
    const highlightAlpha = baseAlpha * 7;

    b1.className = 'block';
    b2.className = 'block';

    b1.style.left = left + 'px';
    b1.style.top = top + 'px';
    b1.style.width = blockWidth + 'px';
    b1.style.background = `rgba(255,255,255,${baseAlpha})`;

    b2.style.left = left + 'px';
    b2.style.top = top + 'px';
    b2.style.width = blockWidth + 'px';
    b2.style.background = `rgba(255,255,255,${highlightAlpha})`;

    baseBlocks.appendChild(b1);
    highlightBlocks.appendChild(b2);
  });

  allBlocks = document.querySelectorAll(".block");
}
placeBlocks();

let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(placeBlocks, 100);
});













// AUDIO
///////////////////////////////////////////
(function () {
  const sound1 = new Audio('audio/1.mp3');
  const sound2 = new Audio('audio/2.mp3');
  const soundClick = new Audio('audio/m.mp3');
  const soundHover = new Audio('audio/hover.mp3');

  let isMuted = false;

  function playSound(src) {
    if (isMuted) return;
    const clip = src.cloneNode();
    clip.play().catch(() => {});
  }

  document.addEventListener('click', (e) => {
    if (e.target.closest('.nav-cell')) return;
    playSound(soundClick);
  });

  document.querySelectorAll('.button-86').forEach(btn => {
    btn.addEventListener('pointerenter', () => {
      playSound(soundHover);
    });
  });

  let activeButton = null;
  let turningOn = true;

  function applyEffect(btn) {
    if (btn.classList.contains('nav-theme')) {
      document.documentElement.classList.toggle('light-mode-on');
    }

    if (btn.classList.contains('nav-flash')) {
      document.querySelector('.blocks-highlight').classList.toggle('alt-mode');
      document.querySelector('.grid-highlight').classList.toggle('alt-mode');
    }

    if (btn.classList.contains('nav-audio')) {
      isMuted = !isMuted;
      document.querySelectorAll('audio, video').forEach(media => {
        media.muted = isMuted;
      });
    }
  }

  document.querySelectorAll('.nav-cell').forEach(btn => {
    btn.addEventListener('pointerdown', (e) => {
      if (activeButton) return;
      if (e.button !== undefined && e.button !== 0) return;

      activeButton = btn;
      turningOn = !btn.classList.contains('is-on');

      playSound(turningOn ? sound1 : sound2);
      btn.classList.add('is-pressed');
    });
  });

  document.addEventListener('pointerup', () => {
    if (!activeButton) return;

    playSound(turningOn ? sound2 : sound1);
    activeButton.classList.toggle('is-on');
    activeButton.classList.remove('is-pressed');

    applyEffect(activeButton);

    activeButton = null;
  });

  document.addEventListener('pointercancel', () => {
    if (!activeButton) return;

    playSound(turningOn ? sound2 : sound1);
    activeButton.classList.toggle('is-on');
    activeButton.classList.remove('is-pressed');

    applyEffect(activeButton);

    activeButton = null;
  });

})();


// MAIL ME BUTTON
/////////////////////////////////////////////
(function () {
  const mailLink = document.getElementById('mail-link');
  const mailDot = document.getElementById('mail-dot');
  if (!mailLink || !mailDot) return;

  const KEY = 'mailLinkOpened';

  if (sessionStorage.getItem(KEY)) {
    mailDot.classList.add('is-opened');
  }

  mailLink.addEventListener('click', () => {
    sessionStorage.setItem(KEY, 'true');
    mailDot.classList.add('is-opened');
  });
})();







































// VIBE CODING ARTERY
// //////////////////////////////////////////////////
(function () {
  const track = document.getElementById('artery-track');
  const prevBtn = document.querySelector('.artery-nav--prev');
  const nextBtn = document.querySelector('.artery-nav--next');
  const progressFill = document.getElementById('artery-progress-fill');
  const hint = document.getElementById('artery-hint');
  if (!track) return;

  function step() {
    const panel = track.querySelector('.artery-panel');
    if (!panel) return 400;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 20;
    return panel.getBoundingClientRect().width + gap;
  }

  function dismissHint() {
    if (hint) hint.classList.add('is-dismissed');
  }

  function updateUI() {
    const max = track.scrollWidth - track.clientWidth;
    const ratio = max > 0 ? track.scrollLeft / max : 0;
    if (progressFill) progressFill.style.width = `${10 + ratio * 90}%`;
    if (prevBtn) prevBtn.disabled = track.scrollLeft <= 4;
    if (nextBtn) nextBtn.disabled = track.scrollLeft >= max - 4;
  }

  prevBtn?.addEventListener('click', () => { track.scrollBy({ left: -step(), behavior: 'smooth' }); dismissHint(); });
  nextBtn?.addEventListener('click', () => { track.scrollBy({ left: step(), behavior: 'smooth' }); dismissHint(); });

  let isDown = false, dragStartX = 0, dragStartScroll = 0, dragDistance = 0;

  track.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'touch') return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    isDown = true;
    dragDistance = 0;
    dragStartX = e.clientX;
    dragStartScroll = track.scrollLeft;
    track.classList.add('is-dragging');
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDown) return;
    const delta = e.clientX - dragStartX;
    dragDistance = Math.abs(delta);
    track.scrollLeft = dragStartScroll - delta;
  });

  window.addEventListener('pointerup', () => {
    if (!isDown) return;
    isDown = false;
    track.classList.remove('is-dragging');
    if (dragDistance > 4) dismissHint();
  });

  track.addEventListener('click', (e) => {
    if (dragDistance > 4) { e.preventDefault(); e.stopPropagation(); }
    dragDistance = 0;
  }, true);

  track.addEventListener('scroll', updateUI, { passive: true });
  track.addEventListener('touchstart', dismissHint, { passive: true });
  window.addEventListener('resize', updateUI);
  window.addEventListener('load', updateUI);

  updateUI();
})();

const arteryWrap = document.querySelector('.artery-gallery-wrap');
if (arteryWrap && 'IntersectionObserver' in window) {
  arteryWrap.classList.add('will-reveal');
  const arteryObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        arteryObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  arteryObserver.observe(arteryWrap);
}


















//Skills filter
///////////////////////////////////////////////////////////////
(function () {
  const section = document.querySelector('.skills-section');
  const filterBtns = document.querySelectorAll('.skills-filter-btn');
  if (!section || !filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      section.dataset.filter = btn.dataset.filterValue;

      filterBtns.forEach(b => {
        const isActive = b === btn;
        b.classList.toggle('is-active', isActive);
        b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
    });
  });
})();

const skillCategories = document.querySelectorAll('.skills-category');
if (skillCategories.length && 'IntersectionObserver' in window) {
  skillCategories.forEach((cat, i) => {
    cat.classList.add('will-reveal');
    cat.style.transitionDelay = `${i * 100}ms`;
  });

  const skillsCatObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        skillsCatObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  skillCategories.forEach(cat => skillsCatObserver.observe(cat));
}














// PUBLICATIONS SECTION///////////////////////////////
/////////////////////////////////////////////////////////
const pubCards = document.querySelectorAll('.pub-card');
if (pubCards.length && 'IntersectionObserver' in window) {
  pubCards.forEach((card, i) => {
    card.classList.add('will-reveal');
    card.style.transitionDelay = `${i * 100}ms`;
  });

  const pubObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        pubObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  pubCards.forEach(card => pubObserver.observe(card));
}

















// BEYOND TRAFFIC SECTION/////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
const beyondFrame = document.querySelector('.beyond-frame');
if (beyondFrame && 'IntersectionObserver' in window) {
  beyondFrame.classList.add('will-reveal');

  const beyondObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        beyondObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  beyondObserver.observe(beyondFrame);
}
(function () {
  const btn = document.getElementById('beyond-toggle');
  const more = document.getElementById('beyond-more');
  if (!btn || !more) return;

  btn.addEventListener('click', () => {
    const isOpen = more.classList.toggle('is-open');
    btn.classList.toggle('is-open', isOpen);
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    btn.querySelector('.beyond-toggle-label').textContent = isOpen ? 'Show less' : 'Read the rest';
  });
})();






















// NOT GOOD AT
////////////////////////////////////////////////////////////////////////////////////
const ngaWrap = document.querySelector('.nga-wrap');
if (ngaWrap && 'IntersectionObserver' in window) {
  ngaWrap.classList.add('will-reveal');

  const ngaObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        ngaObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  ngaObserver.observe(ngaWrap); // was tlWrap
}

























// TIMELINE SECTION//////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
const tlWrap = document.querySelector('.tl-ruler-wrap');
if (tlWrap && 'IntersectionObserver' in window) {
  tlWrap.classList.add('will-reveal');

  const tlObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        tlObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  tlObserver.observe(tlWrap);
}
























// MASTER'S JOURNEY SECTION//////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
const mjFrame = document.querySelector('.mj-frame');
if (mjFrame && 'IntersectionObserver' in window) {
  mjFrame.classList.add('will-reveal');

  const mjObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        mjObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  mjObserver.observe(mjFrame);
}

























// ABOUT ME SECTION///////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
const aboutContent = document.querySelector('.about-content');
if (aboutContent && 'IntersectionObserver' in window) {
  aboutContent.classList.add('will-reveal');

  const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        aboutObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  aboutObserver.observe(aboutContent);
}




















//TIME LINE ///////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
(function setTitleBlockDate() {
  const dateEl = document.getElementById('tb-date');
  if (!dateEl) return;
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const now = new Date();
  dateEl.textContent = `${String(now.getDate()).padStart(2,'0')} ${months[now.getMonth()]} ${now.getFullYear()}`;
})();

(function () {
  const karachiEl = document.getElementById('tb-karachi-time');
  const tokyoEl = document.getElementById('tb-tokyo-time');
  if (!karachiEl || !tokyoEl) return;

  function tick() {
    const now = new Date();
    karachiEl.textContent = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Karachi', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    }).format(now);
    tokyoEl.textContent = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    }).format(now);
  }
  tick();
  setInterval(tick, 1000);
})();

(function () {
  const el = document.getElementById('tb-countdown');
  if (!el) return;
  const target = new Date('2026-10-01T00:00:00+09:00');
  const diffDays = Math.ceil((target - new Date()) / (1000 * 60 * 60 * 24));
  el.textContent = diffDays > 0 ? `T–${diffDays}d` : 'Arrived';
})();

(function () {
  const btn = document.getElementById('tb-email-btn');
  const feedback = document.getElementById('tb-copy-feedback');
  if (!btn || !feedback) return;

  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.email);
    } catch (err) {
      return;
    }
    feedback.classList.add('is-shown');
    clearTimeout(btn._copyTimeout);
    btn._copyTimeout = setTimeout(() => feedback.classList.remove('is-shown'), 1500);
  });
})();

const tbWrap = document.querySelector('.tb-wrap');
if (tbWrap && 'IntersectionObserver' in window) {
  tbWrap.classList.add('will-reveal');
  const tbObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        tbObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  tbObserver.observe(tbWrap);
}




















//NOT GOOD AT//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
(function () {
  const GAP = 8;
  const MIN_UNIT = 75;
  const MAX_UNIT = 160;
  const ABSOLUTE_MAX_UNIT = 220;

  const STATES = [
    { cols: 6,  rows: 5 },
    { cols: 10, rows: 3 },
    { cols: 15, rows: 2 },
  ];
  const NARROWEST = STATES[0];
  const STANDARD  = STATES[1];
  const WIDEST    = STATES[2];

  const container = document.getElementById('nga-tiles');
  if (!container) return;

  let currentCols = parseInt(container.dataset.state, 10) || STANDARD.cols;

  function unitFor(cols, width) {
    return (width - (cols - 1) * GAP) / cols;
  }

  function pickState(width) {
    const current = STATES.find(s => s.cols === currentCols);

    if (current) {
      const u = unitFor(current.cols, width);
      if (u >= MIN_UNIT && u <= MAX_UNIT) return { state: current, mode: 'fill' };

      if (current === WIDEST && u > MAX_UNIT && u <= ABSOLUTE_MAX_UNIT) {
        return { state: current, mode: 'fill' };
      }
    }

    const inRange = STATES.filter(s => {
      const u = unitFor(s.cols, width);
      return u >= MIN_UNIT && u <= MAX_UNIT;
    });
    if (inRange.length) {
      const closest = inRange.reduce((a, b) =>
        Math.abs(a.cols - currentCols) < Math.abs(b.cols - currentCols) ? a : b
      );
      return { state: closest, mode: 'fill' };
    }

    const uWidest = unitFor(WIDEST.cols, width);
    if (uWidest > MAX_UNIT) {
      if (uWidest <= ABSOLUTE_MAX_UNIT) {
        return { state: WIDEST, mode: 'fill' };
      }
      return { state: STANDARD, mode: 'capped-left' };
    }

    return { state: NARROWEST, mode: 'clamp-min' };
  }

  function update() {
    const width = container.clientWidth;
    if (!width) return;

    const { state, mode } = pickState(width);
    currentCols = state.cols;

    let unit;
    if (mode === 'clamp-min') unit = MIN_UNIT;
    else if (mode === 'capped-left') unit = ABSOLUTE_MAX_UNIT;
    else unit = unitFor(state.cols, width);

    container.dataset.state = state.cols;
    container.style.setProperty('--unit', `${unit}px`);
  }

  container.querySelectorAll('.nga-tile').forEach(tile => {
    tile.setAttribute('tabindex', '0');
    tile.setAttribute('role', 'button');
    tile.addEventListener('click', () => tile.classList.toggle('is-flipped'));
    tile.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tile.click(); }
    });
  });

  if ('ResizeObserver' in window) {
    new ResizeObserver(update).observe(container);
  } else {
    window.addEventListener('resize', update);
  }
  update();
})();




















// ABOUT ME SECTION////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
(function () {
  const canvas = document.getElementById('about-pixel-avatar');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const GRID_W = 40, GRID_H = 25;

  const RLE = 
[
  [[40,null]],
  [[11,null],[3,'#4a4a4a'],[3,'#181818'],[5,'#4a4a4a'],[1,'#242424'],[2,'#181818'],[3,'#4a4a4a'],[12,null]],
  [[10,null],[1,'#4a4a4a'],[1,'#333333'],[2,'#181818'],[1,'#0a0a0a'],[13,'#181818'],[1,'#4a4a4a'],[11,null]],
  [[10,null],[1,'#4a4a4a'],[1,'#0a0a0a'],[2,'#181818'],[8,'#242424'],[6,'#181818'],[1,'#333333'],[11,null]],
  [[10,null],[1,'#4a4a4a'],[1,'#0a0a0a'],[1,'#181818'],[1,'#4a4a4a'],[1,null],[3,'#4a4a4a'],[3,'#5c6a70'],[1,'#8fa3aa'],[1,'#c3d4d9'],[2,'#8fa3aa'],[1,'#5c6a70'],[2,'#181818'],[1,'#4a4a4a'],[11,null]],
  [[10,null],[1,'#4a4a4a'],[2,'#181818'],[1,'#4a4a4a'],[2,null],[2,'#4a4a4a'],[3,'#181818'],[1,'#4a4a4a'],[2,'#c3d4d9'],[1,'#8fa3aa'],[1,'#5c6a70'],[2,'#181818'],[1,'#4a4a4a'],[11,null]],
  [[10,null],[1,'#4a4a4a'],[1,'#0a0a0a'],[15,'#181818'],[1,'#0a0a0a'],[1,'#4a4a4a'],[11,null]],
  [[10,null],[1,'#4a4a4a'],[16,'#181818'],[1,'#0a0a0a'],[1,'#4a4a4a'],[11,null]],
  [[11,null],[1,'#242424'],[2,'#181818'],[6,'#242424'],[4,'#181818'],[2,'#242424'],[1,'#181818'],[1,'#0a0a0a'],[1,'#4a4a4a'],[11,null]],
  [[11,null],[1,'#242424'],[2,'#181818'],[1,'#242424'],[3,'#181818'],[2,'#242424'],[1,'#181818'],[1,'#242424'],[2,'#181818'],[1,'#242424'],[2,'#181818'],[1,'#0a0a0a'],[1,'#4a4a4a'],[11,null]],
  [[10,null],[1,'#4a4a4a'],[2,'#0a0a0a'],[2,'#181818'],[3,'#0a0a0a'],[3,'#181818'],[1,'#333333'],[2,'#0a0a0a'],[2,'#181818'],[2,'#0a0a0a'],[1,'#4a4a4a'],[11,null]],
  [[10,null],[1,'#4a4a4a'],[1,'#181818'],[1,'#0a0a0a'],[1,'#181818'],[2,'#242424'],[2,'#0a0a0a'],[1,'#181818'],[1,'#333333'],[2,'#4a4a4a'],[1,'#0a0a0a'],[1,'#181818'],[1,'#242424'],[1,'#181818'],[1,'#0a0a0a'],[1,'#181818'],[1,'#4a4a4a'],[11,null]],
  [[11,null],[1,'#333333'],[2,'#0a0a0a'],[2,'#4a4a4a'],[2,'#0a0a0a'],[1,'#181818'],[1,'#4a4a4a'],[1,'#f2e9e1'],[1,'#4a4a4a'],[1,'#0a0a0a'],[1,'#333333'],[1,'#4a4a4a'],[2,'#0a0a0a'],[1,'#333333'],[1,'#4a4a4a'],[11,null]],
  [[11,null],[1,'#4a4a4a'],[2,'#0a0a0a'],[2,'#4a4a4a'],[1,'#181818'],[1,'#333333'],[2,'#4a4a4a'],[1,'#f2e9e1'],[1,'#4a4a4a'],[1,'#181818'],[2,'#4a4a4a'],[1,'#242424'],[1,'#0a0a0a'],[2,'#4a4a4a'],[11,null]],
  [[11,null],[1,'#4a4a4a'],[2,'#0a0a0a'],[2,'#4a4a4a'],[1,'#333333'],[1,'#4a4a4a'],[3,'#f2e9e1'],[1,'#4a4a4a'],[1,'#242424'],[1,'#4a4a4a'],[1,null],[1,'#333333'],[1,'#0a0a0a'],[1,'#4a4a4a'],[12,null]],
  [[5,null],[6,'#4a4a4a'],[1,'#242424'],[1,'#4a4a4a'],[13,'#f2e9e1'],[1,'#4a4a4a'],[1,'#181818'],[6,'#4a4a4a'],[6,null]],
  [[5,null],[1,'#4a4a4a'],[6,'#181818'],[1,'#333333'],[2,'#4a4a4a'],[9,'#f2e9e1'],[3,'#4a4a4a'],[6,'#181818'],[1,'#4a4a4a'],[6,null]],
  [[5,null],[1,'#4a4a4a'],[6,'#181818'],[2,'#242424'],[1,'#333333'],[9,'#4a4a4a'],[1,'#333333'],[2,'#242424'],[6,'#181818'],[1,'#4a4a4a'],[6,null]],
  [[5,null],[1,'#4a4a4a'],[6,'#181818'],[1,'#242424'],[2,'#333333'],[1,'#4a4a4a'],[2,'#333333'],[2,'#4a4a4a'],[2,'#333333'],[1,'#242424'],[2,'#333333'],[2,'#242424'],[1,'#181818'],[3,'#242424'],[2,'#181818'],[1,'#4a4a4a'],[6,null]],
  [[5,null],[1,'#4a4a4a'],[3,'#181818'],[1,'#242424'],[3,'#181818'],[1,'#0a0a0a'],[1,'#242424'],[7,'#333333'],[1,'#242424'],[3,'#333333'],[1,'#242424'],[1,'#181818'],[3,'#242424'],[2,'#181818'],[1,'#4a4a4a'],[6,null]],
  [[5,null],[1,'#4a4a4a'],[6,'#181818'],[2,'#0a0a0a'],[1,'#242424'],[7,'#333333'],[1,'#242424'],[3,'#333333'],[1,'#242424'],[2,'#181818'],[1,'#242424'],[3,'#181818'],[1,'#4a4a4a'],[6,null]],
  [[5,null],[1,'#4a4a4a'],[6,'#181818'],[6,'#0a0a0a'],[3,'#181818'],[2,'#0a0a0a'],[3,'#333333'],[1,'#242424'],[6,'#181818'],[1,'#4a4a4a'],[6,null]],
  [[5,null],[1,'#4a4a4a'],[6,'#181818'],[3,'#0a0a0a'],[1,'#181818'],[2,'#0a0a0a'],[3,'#181818'],[2,'#0a0a0a'],[3,'#333333'],[1,'#242424'],[6,'#181818'],[1,'#4a4a4a'],[6,null]],
  [[5,null],[1,'#4a4a4a'],[2,'#181818'],[2,'#242424'],[3,'#181818'],[1,'#0a0a0a'],[2,'#181818'],[2,'#0a0a0a'],[1,'#242424'],[2,'#181818'],[2,'#0a0a0a'],[3,'#333333'],[1,'#242424'],[6,'#181818'],[1,'#4a4a4a'],[6,null]],
  [[5,null],[1,'#4a4a4a'],[2,'#181818'],[3,'#242424'],[2,'#181818'],[1,'#0a0a0a'],[2,'#181818'],[2,'#0a0a0a'],[1,'#242424'],[2,'#181818'],[2,'#0a0a0a'],[3,'#333333'],[1,'#242424'],[1,'#181818'],[2,'#242424'],[3,'#181818'],[1,'#4a4a4a'],[6,null]]
];

  const cells = [];
  RLE.forEach((row, y) => {
    let x = 0;
    row.forEach(([count, color]) => {
      if (color) cells.push({ x, y, w: count, color });
      x += count;
    });
  });

  let cellSize = 0;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    cellSize = canvas.width / GRID_W;
    ctx.imageSmoothingEnabled = false;
    draw();
  }

  function draw(glitchSet) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cells.forEach((cell, i) => {
      ctx.fillStyle = (glitchSet && glitchSet[i]) || cell.color;
      ctx.fillRect(
        Math.round(cell.x * cellSize),
        Math.round(cell.y * cellSize),
        Math.ceil(cell.w * cellSize) + 1,
        Math.ceil(cellSize) + 1
      );
    });
  }

  window.addEventListener('resize', resize);
  resize();

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let sweeping = false, sweepFrame;
  function sweepStep(t0) {
    return function step(t) {
      if (!sweeping) return;
      draw();
      const progress = ((t - t0) / 1400) % 1;
      const sweepY = progress * canvas.height;
      const grad = ctx.createLinearGradient(0, sweepY - 24, 0, sweepY + 24);
      grad.addColorStop(0, 'rgba(229,72,77,0)');
      grad.addColorStop(0.5, 'rgba(229,72,77,0.16)');
      grad.addColorStop(1, 'rgba(229,72,77,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      sweepFrame = requestAnimationFrame(step);
    };
  }
  canvas.addEventListener('mouseenter', () => {
    if (reduceMotion) return;
    sweeping = true;
    sweepFrame = requestAnimationFrame(sweepStep(performance.now()));
  });
  canvas.addEventListener('mouseleave', () => {
    sweeping = false;
    if (sweepFrame) cancelAnimationFrame(sweepFrame);
    draw();
  });

  canvas.addEventListener('click', () => {
    if (reduceMotion) return;
    const glitchColors = ['#e5484d', '#c3d4d9', '#f2e9e1'];
    let frame = 0;
    const id = setInterval(() => {
      const glitchSet = {};
      for (let i = 0; i < 14; i++) {
        glitchSet[Math.floor(Math.random() * cells.length)] =
          glitchColors[Math.floor(Math.random() * glitchColors.length)];
      }
      draw(glitchSet);
      frame++;
      if (frame > 5) { clearInterval(id); draw(); }
    }, 55);
  });
})();













































// EMOJISSSSSSS////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', () => {
  twemoji.parse(document.body, {
    folder: 'svg',
    ext: '.svg'
  });
});
(function () {
  const initialHash = location.hash;
  if (!initialHash) return;

  let target;
  try {
    target = document.querySelector(initialHash);
  } catch (e) {
    return;
  }
  if (!target) return;

  let userScrolled = false;
  const markScrolled = () => { userScrolled = true; };
  window.addEventListener('wheel', markScrolled, { passive: true, once: true });
  window.addEventListener('touchmove', markScrolled, { passive: true, once: true });
  window.addEventListener('keydown', (e) => {
    if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(e.key)) markScrolled();
  }, { once: true });

  function scrollToTarget() {
    if (userScrolled) return;
    target.scrollIntoView({ behavior: 'auto', block: 'start' });
  }

  window.addEventListener('load', () => requestAnimationFrame(scrollToTarget));

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(scrollToTarget);
  }

  history.replaceState(null, '', location.pathname + location.search);
})();