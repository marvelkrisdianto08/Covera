/* ================================================================
   deco.js  — decorative enhancement layer
   Drop a <script src="deco.js"></script> before </body>
   Works by hooking into the existing show() function and running
   additive visual layers. Never removes or replaces existing code.
   ================================================================ */

(function () {
  'use strict';

  /* ── helpers ──────────────────────────────────────────────────── */
  function rand(min, max) { return min + Math.random() * (max - min); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function css(el, props) { Object.assign(el.style, props); }
  function make(tag, classes, parent) {
    const el = document.createElement(tag);
    if (classes) el.className = classes;
    if (parent) parent.appendChild(el);
    return el;
  }

  /* ── wait for DOM ready ─────────────────────────────────────────── */
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {

    /* ================================================================
       1. LANDING — animated stardust ring around each card
       ================================================================ */
    document.querySelectorAll('.btn-friend-img').forEach(function (btn, i) {
      const isMarco = i === 0;
      const color   = isMarco ? '251,191,36' : '96,165,250';

      // cursor sparkle trail on hover
      btn.addEventListener('mousemove', function (e) {
        const rect = btn.getBoundingClientRect();
        spawnCursorSpark(e.clientX, e.clientY, color);
      });
    });

    function spawnCursorSpark(x, y, color) {
      const el = make('div', null, document.body);
      css(el, {
        position:     'fixed',
        left:         x + 'px',
        top:          y  + 'px',
        width:        '6px',
        height:       '6px',
        borderRadius: '50%',
        background:   `rgba(${color},0.9)`,
        boxShadow:    `0 0 8px rgba(${color},0.7)`,
        pointerEvents:'none',
        zIndex:       '9999',
        transform:    'translate(-50%,-50%)',
        transition:   'transform 0.6s ease, opacity 0.6s ease',
      });
      requestAnimationFrame(function () {
        css(el, {
          transform: `translate(calc(-50% + ${rand(-30,30)}px), calc(-50% + ${rand(-40,-10)}px)) scale(0.2)`,
          opacity:   '0',
        });
      });
      setTimeout(function () { el.remove(); }, 660);
    }

    /* ================================================================
       2. LANDING — floating orb swarm (subtle, behind cards)
       ================================================================ */
    const landing = document.getElementById('landing');
    if (landing) {
      for (let i = 0; i < 12; i++) {
        const orb = make('div', null, landing);
        const size = rand(8, 24);
        const isWarm = Math.random() > 0.5;
        css(orb, {
          position:     'absolute',
          width:         size + 'px',
          height:        size + 'px',
          borderRadius: '50%',
          left:          rand(2, 96) + '%',
          top:           rand(5, 90) + '%',
          background:   isWarm
            ? `radial-gradient(circle, rgba(251,191,36,0.55), rgba(249,115,22,0.15))`
            : `radial-gradient(circle, rgba(96,165,250,0.5),  rgba(59,130,246,0.1))`,
          pointerEvents: 'none',
          zIndex:        '0',
          animation:     `decoOrbFloat ${rand(8,16)}s ease-in-out ${rand(0,6)}s infinite`,
          filter:        `blur(${rand(2,5)}px)`,
        });
      }
    }
    injectKeyframes('decoOrbFloat', `
      0%,100% { transform: translateY(0)     scale(1);    opacity: 0.45; }
      33%     { transform: translateY(-18px) scale(1.08); opacity: 0.75; }
      66%     { transform: translateY(-8px)  scale(0.95); opacity: 0.55; }
    `);

    /* ================================================================
       3. PASSWORD SCREENS — sparkle burst on correct unlock
          (hooks into existing checkPw via form submit button click)
       ================================================================ */
    document.querySelectorAll('.btn-enter').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const card = btn.closest('.pw-card');
        if (!card) return;
        const isMarco = card.classList.contains('marco-card');
        const color   = isMarco ? '251,191,36' : '96,165,250';
        // fire after a short delay to let the password check run
        setTimeout(function () {
          // only burst if we're no longer on the pw screen (unlock was correct)
          const screen = card.closest('.screen');
          if (screen && screen.classList.contains('hidden')) {
            burstConfetti(card, color, 24);
          }
        }, 150);
      });
    });

    function burstConfetti(anchor, color, count) {
      const rect  = anchor.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const shapes = ['●', '★', '✦', '✨', '◆'];

      for (let i = 0; i < count; i++) {
        const el = make('div', null, document.body);
        const angle = (i / count) * Math.PI * 2;
        const speed = rand(80, 200);
        const tx    = Math.cos(angle) * speed;
        const ty    = Math.sin(angle) * speed - rand(40, 80);
        css(el, {
          position:     'fixed',
          left:          cx + 'px',
          top:           cy + 'px',
          fontSize:      rand(10, 18) + 'px',
          color:        `rgba(${color},${rand(0.7, 1)})`,
          pointerEvents: 'none',
          zIndex:        '9998',
          transform:    'translate(-50%,-50%)',
          transition:   `transform ${rand(0.6,1.1)}s cubic-bezier(.2,.8,.4,1), opacity 0.9s ease`,
          textShadow:   `0 0 8px rgba(${color},0.8)`,
        });
        el.textContent = pick(shapes);
        requestAnimationFrame(function () {
          css(el, {
            transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0.3) rotate(${rand(-180,180)}deg)`,
            opacity:   '0',
          });
        });
        setTimeout(function () { el.remove(); }, 1200);
      }
    }

    /* ================================================================
       4. MARCO LETTER — parallax coin shimmer on scroll
       ================================================================ */
    const letterMarco = document.getElementById('letter-marco');
    if (letterMarco) {
      letterMarco.addEventListener('scroll', function () {
        const coins = letterMarco.querySelectorAll('.letter-gold-coin');
        coins.forEach(function (coin, idx) {
          const offset = letterMarco.scrollTop * (0.03 + idx * 0.008);
          coin.style.transform = `translateY(${-offset}px)`;
        });
      });
    }

    /* ================================================================
       5. RAN LETTER — firefly path animation (positional movement)
          The existing code handles glow; we add smooth XY wandering.
       ================================================================ */
    const FF_COUNT = 7;
    const ffs = [];
    for (let i = 0; i < FF_COUNT; i++) {
      const el = document.getElementById('ff-' + i);
      if (el) {
        ffs.push({
          el,
          x:    rand(5, 90),
          y:    rand(10, 85),
          vx:   rand(-0.04, 0.04),
          vy:   rand(-0.04, 0.04),
          phase: rand(0, Math.PI * 2),
        });
      }
    }

    let ffAnimId = null;
    let ffRunning = false;

    function fireflyLoop(t) {
      if (!ffRunning) return;
      ffs.forEach(function (f) {
        f.phase += 0.012;
        f.x += f.vx + Math.sin(f.phase) * 0.12;
        f.y += f.vy + Math.cos(f.phase * 0.7) * 0.1;
        if (f.x < 2)  { f.x = 2;  f.vx =  Math.abs(f.vx); }
        if (f.x > 95) { f.x = 95; f.vx = -Math.abs(f.vx); }
        if (f.y < 5)  { f.y = 5;  f.vy =  Math.abs(f.vy); }
        if (f.y > 90) { f.y = 90; f.vy = -Math.abs(f.vy); }
        css(f.el, {
          left:   f.x + 'vw',
          top:    f.y + 'vh',
        });
        // pulse the "landed" class to trigger existing glow CSS
        const lit = Math.sin(f.phase * 1.4 + f.x * 0.1) > 0.2;
        f.el.classList.toggle('landed', lit);
      });
      ffAnimId = requestAnimationFrame(fireflyLoop);
    }

    /* ================================================================
       6. MEMORY CARDS — entrance stagger enhancement
       ================================================================ */
    function enhanceMemoryCards(screenId) {
      const screen = document.getElementById(screenId);
      if (!screen) return;
      screen.querySelectorAll('.mem-card').forEach(function (card, idx) {
        card.style.animationDelay = (idx * 0.09 + 0.04) + 's';
        card.style.animationName  = 'cardAppear';
        // icon micro-bounce on hover
        const icon = card.querySelector('.mem-icon');
        if (icon) {
          card.addEventListener('mouseenter', function () {
            icon.style.transition = 'transform 0.35s cubic-bezier(.34,1.56,.64,1)';
            icon.style.transform  = 'scale(1.35) rotate(-8deg)';
          });
          card.addEventListener('mouseleave', function () {
            icon.style.transform = 'scale(1) rotate(0deg)';
          });
        }
      });
    }
    enhanceMemoryCards('memories-marco');
    enhanceMemoryCards('memories-ran');

    /* ================================================================
       7. CREDITS — stat row counter-up animation
       ================================================================ */
    function animateStatNumbers(crawlId) {
      const crawl = document.getElementById(crawlId);
      if (!crawl) return;
      crawl.querySelectorAll('.credits-stat-value').forEach(function (el) {
        const raw  = el.textContent.trim();
        const num  = parseFloat(raw);
        if (!isNaN(num) && num > 0 && num <= 1000) {
          const suffix = raw.replace(/[\d.]/g, '');
          const dur    = Math.min(1800, num * 6);
          const start  = performance.now();
          el.style.fontVariantNumeric = 'tabular-nums';
          function tick(now) {
            const t = Math.min(1, (now - start) / dur);
            const eased = 1 - Math.pow(1 - t, 3); // cubic ease-out
            el.textContent = Math.round(eased * num) + suffix;
            if (t < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        }
      });
    }

    /* ================================================================
       8. LANDING — cursor ripple effect
       ================================================================ */
    document.addEventListener('click', function (e) {
      const activeScreen = document.querySelector('.screen.visible');
      if (!activeScreen) return;
      const id = activeScreen.id;
      // only on landing and letter screens where a ripple fits
      if (!['landing', 'letter-marco', 'letter-ran'].includes(id)) return;
      const isMarco = (id === 'landing' || id.includes('marco'));
      const color   = isMarco ? '251,191,36' : '96,165,250';
      const ripple  = make('div', null, document.body);
      css(ripple, {
        position:     'fixed',
        left:          e.clientX + 'px',
        top:           e.clientY + 'px',
        width:        '12px',
        height:       '12px',
        borderRadius: '50%',
        border:       `2px solid rgba(${color},0.8)`,
        transform:    'translate(-50%,-50%) scale(0)',
        pointerEvents:'none',
        zIndex:       '9999',
        transition:   'transform 0.5s ease, opacity 0.5s ease',
      });
      requestAnimationFrame(function () {
        css(ripple, {
          transform: 'translate(-50%,-50%) scale(8)',
          opacity:   '0',
        });
      });
      setTimeout(function () { ripple.remove(); }, 550);
    });

    /* ================================================================
       9. BOTTLE MESSAGE — wave animation inside popup on open
       ================================================================ */
    const bottleWrap = document.getElementById('bottleWrap');
    const bottleMsg  = document.getElementById('bottleMsg');
    if (bottleWrap && bottleMsg) {
      // inject a tiny wave bar below the message body
      const wave = make('div', null, bottleMsg);
      css(wave, {
        position:   'absolute',
        bottom:     '0',
        left:       '0',
        right:      '0',
        height:     '38px',
        overflow:   'hidden',
        borderRadius:'0 0 22px 22px',
        pointerEvents: 'none',
        opacity:    '0.18',
      });
      wave.innerHTML = `
        <svg viewBox="0 0 340 38" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" width="100%" height="38">
          <path id="wp1" d="M0 24 Q 42.5 12 85 24 Q 127.5 36 170 24 Q 212.5 12 255 24 Q 297.5 36 340 24 L340 38 L0 38Z"
                fill="rgba(96,165,250,0.8)" opacity="0.8">
            <animateTransform attributeName="transform" type="translate" from="0,0" to="-170,0" dur="3s" repeatCount="indefinite"/>
          </path>
          <path d="M0 28 Q 42.5 18 85 28 Q 127.5 38 170 28 Q 212.5 18 255 28 Q 297.5 38 340 28 L340 38 L0 38Z"
                fill="rgba(147,197,253,0.6)" opacity="0.6">
            <animateTransform attributeName="transform" type="translate" from="-85,0" to="85,0" dur="4s" repeatCount="indefinite"/>
          </path>
        </svg>`;
    }

    /* ================================================================
       10. HOOK INTO show() — start/stop enhancements per screen
       ================================================================ */
    const _origDecoPrev = window.show;
    window.show = function (id) {
      _origDecoPrev(id);

      // fireflies: only on Ran's letter
      if (id === 'letter-ran') {
        ffRunning = true;
        fireflyLoop();
      } else {
        ffRunning = false;
        if (ffAnimId) { cancelAnimationFrame(ffAnimId); ffAnimId = null; }
      }

      // credit stat counter-up animation (run once when screen appears)
      if (id === 'credits-marco') animateStatNumbers('crawl-marco');
      if (id === 'credits-ran')   animateStatNumbers('crawl-ran');

      // Marco map — subtle parallax on mouse move
      if (id === 'map-marco') {
        enableMapParallax('marco');
      } else {
        disableMapParallax('marco');
      }
      if (id === 'map-ran') {
        enableMapParallax('ran');
      } else {
        disableMapParallax('ran');
      }
    };

    /* ================================================================
       11. MAP PARALLAX — doodle layers shift slightly with mouse
       ================================================================ */
    const parallaxListeners = {};

    function enableMapParallax(who) {
      const layer = document.getElementById(who + '-doodle-layer') ||
                    document.getElementById(who + '-map-doodle-layer');
      if (!layer) return;
      if (parallaxListeners[who]) return; // already attached

      function onMove(e) {
        const cx  = window.innerWidth  / 2;
        const cy  = window.innerHeight / 2;
        const dx  = (e.clientX - cx) / cx; // -1 … +1
        const dy  = (e.clientY - cy) / cy;
        layer.style.transform = `translate(${dx * 8}px, ${dy * 6}px)`;
      }
      window.addEventListener('mousemove', onMove);
      parallaxListeners[who] = onMove;
    }

    function disableMapParallax(who) {
      const layer = document.getElementById(who + '-doodle-layer') ||
                    document.getElementById(who + '-map-doodle-layer');
      if (layer) layer.style.transform = '';
      if (parallaxListeners[who]) {
        window.removeEventListener('mousemove', parallaxListeners[who]);
        delete parallaxListeners[who];
      }
    }

    /* ================================================================
       12. GLOBAL — tilt effect on memory cards (gyro / mouse)
       ================================================================ */
    document.querySelectorAll('.mem-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        const cx   = rect.left + rect.width  / 2;
        const cy   = rect.top  + rect.height / 2;
        const rx   = ((e.clientY - cy) / (rect.height / 2)) * -7;
        const ry   = ((e.clientX - cx) / (rect.width  / 2)) *  7;
        card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px) scale(1.02)`;
      });
      card.addEventListener('mouseleave', function () {
        // restore original odd/even slight tilt
        const isEven = Array.from(card.parentElement.children).indexOf(card) % 2 === 1;
        card.style.transform = isEven ? 'rotate(1deg) translateY(1rem)' : 'rotate(-1deg)';
        setTimeout(function () { card.style.transition = ''; }, 300);
      });
      card.style.transition  = 'transform 0.1s ease, box-shadow 0.3s ease';
      card.style.perspective = '800px';
      card.style.willChange  = 'transform';
    });

    /* ================================================================
       13. SPARKLES on letter cards — gently re-seed positions
       ================================================================ */
    ['letter-marco', 'letter-ran'].forEach(function (sid) {
      const screen = document.getElementById(sid);
      if (!screen) return;
      screen.querySelectorAll('.sparkle').forEach(function (sp) {
        sp.style.top  = rand(8, 80) + '%';
        sp.style.left = rand(2, 90) + '%';
      });
    });

    /* ================================================================
       14. UTIL — inject @keyframes into a <style> tag
       ================================================================ */
    function injectKeyframes(name, body) {
      const st = document.createElement('style');
      st.textContent = `@keyframes ${name} { ${body} }`;
      document.head.appendChild(st);
    }

    // Inject the orb keyframes (referenced in the CSS above but also needed here)
    injectKeyframes('decoOrbFloat', `
      0%,100% { transform:translateY(0) scale(1); opacity:.45; }
      33%     { transform:translateY(-18px) scale(1.08); opacity:.75; }
      66%     { transform:translateY(-8px) scale(.95); opacity:.55; }
    `);

    /* ================================================================
       15. GOLD MINE CANVAS — enhance existing with extra sparkle layer
           (The existing goldmine canvas handles the main animation;
            we add a fixed overlay of tiny star-sparks.)
       ================================================================ */
    const creditsMarco = document.getElementById('credits-marco');
    if (creditsMarco) {
      const sparkCanvas = make('canvas', null, creditsMarco);
      css(sparkCanvas, {
        position:      'absolute',
        inset:         '0',
        width:         '100%',
        height:        '100%',
        pointerEvents: 'none',
        zIndex:        '2',
        opacity:       '0.55',
      });

      let sparkRaf = null;
      const sparks = Array.from({ length: 40 }, function () {
        return {
          x:  Math.random(),
          y:  Math.random(),
          r:  rand(1, 3),
          a:  rand(0, Math.PI * 2),
          spd: rand(0.004, 0.012),
        };
      });

      function drawSparks() {
        const W = sparkCanvas.width  = creditsMarco.offsetWidth;
        const H = sparkCanvas.height = creditsMarco.offsetHeight;
        const ctx = sparkCanvas.getContext('2d');
        ctx.clearRect(0, 0, W, H);
        sparks.forEach(function (s) {
          s.a += s.spd;
          const alpha = (Math.sin(s.a) + 1) / 2;
          ctx.beginPath();
          ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(252,211,77,${alpha * 0.9})`;
          ctx.shadowColor = 'rgba(251,191,36,0.8)';
          ctx.shadowBlur  = 8;
          ctx.fill();
          ctx.shadowBlur  = 0;
        });
        sparkRaf = requestAnimationFrame(drawSparks);
      }

      // Start/stop with screen visibility
      const _origPrev2 = window.show;
      window.show = function (id) {
        _origPrev2(id);
        if (id === 'credits-marco') {
          if (!sparkRaf) drawSparks();
        } else {
          if (sparkRaf) { cancelAnimationFrame(sparkRaf); sparkRaf = null; }
        }
      };
    }

    /* ================================================================
       16. INITIAL DECOR ACTIVATION
           Trigger any effects for the initially-visible landing screen
       ================================================================ */
    // memory card entrance already set; nothing active to trigger

  }); // end ready()
})();
