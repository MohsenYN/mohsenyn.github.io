/* Futuristic Neural-Lab interactions */
(function () {
  'use strict';

  // ---------- Neural network canvas ----------
  function startNeural(canvas, opts) {
    if (!canvas || canvas.dataset.fxStarted) return;
    canvas.dataset.fxStarted = '1';
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var density = (opts && opts.density) || 0.00012;
    var maxDist = (opts && opts.maxDist) || 150;
    var nodes = [];
    var mouse = { x: -9999, y: -9999, active: false };

    function resize() {
      var rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildNodes(rect.width, rect.height);
    }

    function buildNodes(w, h) {
      var n = Math.max(40, Math.floor(w * h * density));
      nodes = [];
      for (var i = 0; i < n; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: 1 + Math.random() * 1.8,
          hue: Math.random() < 0.7 ? 195 : (Math.random() < 0.5 ? 0 : 280) // cyan/red/purple
        });
      }
    }

    function step() {
      var rect = canvas.getBoundingClientRect();
      var w = rect.width, h = rect.height;
      ctx.clearRect(0, 0, w, h);

      // links
      for (var i = 0; i < nodes.length; i++) {
        var a = nodes[i];
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > w) a.vx *= -1;
        if (a.y < 0 || a.y > h) a.vy *= -1;

        if (mouse.active) {
          var mdx = a.x - mouse.x, mdy = a.y - mouse.y;
          var md = Math.sqrt(mdx*mdx + mdy*mdy);
          if (md < 140) {
            a.vx += (mdx / md) * 0.03;
            a.vy += (mdy / md) * 0.03;
          }
          a.vx = Math.max(-0.9, Math.min(0.9, a.vx));
          a.vy = Math.max(-0.9, Math.min(0.9, a.vy));
        }

        for (var j = i + 1; j < nodes.length; j++) {
          var b = nodes[j];
          var dx = a.x - b.x, dy = a.y - b.y;
          var d = Math.sqrt(dx*dx + dy*dy);
          if (d < maxDist) {
            var alpha = 1 - d / maxDist;
            ctx.strokeStyle = 'hsla(' + a.hue + ', 90%, 65%, ' + (alpha * 0.35) + ')';
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // nodes
      for (var k = 0; k < nodes.length; k++) {
        var p = nodes[k];
        var grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
        grad.addColorStop(0, 'hsla(' + p.hue + ', 95%, 70%, 0.95)');
        grad.addColorStop(1, 'hsla(' + p.hue + ', 95%, 50%, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'hsla(' + p.hue + ', 100%, 85%, 0.95)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(step);
    }

    canvas.addEventListener('mousemove', function (e) {
      var rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    });
    canvas.addEventListener('mouseleave', function () { mouse.active = false; });
    window.addEventListener('resize', resize);
    resize();
    step();
  }

  // ---------- Counter animation ----------
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-target')) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    var dur = 1800;
    var start = performance.now();
    function tick(t) {
      var p = Math.min(1, (t - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target * eased;
      var display = (target >= 1000) ? Math.floor(val).toLocaleString() : (Number.isInteger(target) ? Math.floor(val) : val.toFixed(1));
      el.textContent = prefix + display + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ---------- 3D tilt ----------
  function bindTilt(el) {
    var maxTilt = 12;
    el.addEventListener('mousemove', function (e) {
      var r = el.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width;
      var py = (e.clientY - r.top) / r.height;
      var rx = (py - 0.5) * -2 * maxTilt;
      var ry = (px - 0.5) *  2 * maxTilt;
      el.style.transform = 'perspective(900px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
    });
    el.addEventListener('mouseleave', function () {
      el.style.transform = 'perspective(900px) rotateX(0) rotateY(0)';
    });
  }

  // ---------- Init ----------
  function init() {
    document.querySelectorAll('canvas.fx-neural').forEach(function (c) { startNeural(c, {}); });

    // Reveal on scroll
    var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('fx-in');
          if (en.target.classList.contains('fx-stat-num')) animateCounter(en.target);
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.15 }) : null;

    if (io) {
      document.querySelectorAll('.fx-reveal, .fx-stat-num').forEach(function (el) { io.observe(el); });
    } else {
      document.querySelectorAll('.fx-reveal').forEach(function (el) { el.classList.add('fx-in'); });
      document.querySelectorAll('.fx-stat-num').forEach(animateCounter);
    }

    document.querySelectorAll('.fx-tilt').forEach(bindTilt);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
