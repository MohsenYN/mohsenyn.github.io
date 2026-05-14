/* ============================================================
   GUELPH DRY BEAN — CINEMATIC SCROLL ENGINE (video edition)
   Maps window scroll inside the .reel to a 0..1 timeline,
   then drives video.currentTime so scroll IS the seek bar
   (per PDF Ch.05: keyframe-per-frame encode + explicit
   video.load() before seek on iOS Safari).
   Vanilla JS, no GSAP, GitHub-Pages friendly.
   ============================================================ */

(() => {
  const reel    = document.querySelector('.reel');
  const stage   = document.querySelector('.stage');
  if (!reel || !stage) return;

  const video   = stage.querySelector('.hero-video');
  const captions= Array.from(document.querySelectorAll('.scene-caption'));
  const intro   = stage.querySelector('.intro');
  const hint    = stage.querySelector('.hint');
  const scrub   = document.querySelector('.scrub__bar');
  const nav     = document.querySelector('.cine-nav');

  /* ---------- Video setup (iOS Safari quirks live here) ---------- */
  let videoReady = false;
  if (video) {
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    // iOS Safari needs an explicit load() before any seek will work.
    try { video.load(); } catch (_) {}
    const markReady = () => { videoReady = true; tick(); };
    if (video.readyState >= 2) markReady();
    else {
      video.addEventListener('loadeddata', markReady, { once: true });
      video.addEventListener('canplay',    markReady, { once: true });
    }
    // Some browsers (and posters with playsinline) try to autoplay; we
    // want the video paused so currentTime stays under our control.
    video.addEventListener('play', () => video.pause());
  }

  /* Smoothstep easing for buttery transitions. */
  const smooth = (t) => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    return t * t * (3 - 2 * t);
  };

  /* Caption opacity from [data-in .. data-out] range with a 12% cross-fade. */
  const captionOpacity = (cap, t) => {
    const a = parseFloat(cap.dataset.in);
    const b = parseFloat(cap.dataset.out);
    const fade = Math.max(0.04, (b - a) * 0.12);
    const fIn  = smooth((t - a) / fade);
    const fOut = smooth((t - (b - fade)) / fade);
    return Math.max(0, Math.min(1, fIn - fOut));
  };

  let progress = 0;
  let target   = 0;
  let raf      = null;

  const compute = () => {
    const rect = reel.getBoundingClientRect();
    const total = reel.offsetHeight - window.innerHeight;
    const scrolled = -rect.top;
    target = Math.max(0, Math.min(1, scrolled / total));
    if (!raf) raf = requestAnimationFrame(tick);
  };

  /* Smoothed timeline + currentTime drive. */
  const tick = () => {
    progress += (target - progress) * 0.22;
    if (Math.abs(target - progress) < 0.0005) progress = target;

    const t = progress;

    // Intro and scroll-hint fade out as soon as the user starts scrolling.
    const introOpacity = Math.max(0, 1 - t * 6);
    if (intro) intro.style.setProperty('--intro-opacity', introOpacity.toFixed(3));
    if (hint)  hint.style.setProperty('--hint-opacity',   (introOpacity * 0.9).toFixed(3));

    // Drive the video. duration may be NaN until metadata loads.
    if (video && videoReady && isFinite(video.duration) && video.duration > 0) {
      const seekTo = t * (video.duration - 0.03);  // tiny epsilon avoids end-of-stream black frame
      // Only seek when noticeably different to spare CPU on dense scrolls.
      if (Math.abs(seekTo - video.currentTime) > 1 / 60) {
        try { video.currentTime = seekTo; } catch (_) {}
      }
    }

    // Caption fades.
    captions.forEach(cap => {
      cap.style.setProperty('--cap-opacity', captionOpacity(cap, t).toFixed(3));
    });

    if (scrub) scrub.style.setProperty('--reel-progress', (t * 100).toFixed(1) + '%');

    if (Math.abs(target - progress) > 0.0005) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = null;
    }
  };

  compute();
  window.addEventListener('scroll', compute, { passive: true });
  window.addEventListener('resize', compute);

  /* ---------- Nav blur on scroll ---------- */
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 60) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- IntersectionObserver reveals ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.18 });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in'));
  }

  /* ---------- Bean-tree tooltip ----------
     Pods are now native SVG <a class="bean-pod" href="..."> anchors, so
     click/keyboard navigation works for free. We only enhance with a
     mouse-following label tooltip. */
  const tip = document.querySelector('.tree-tip');
  const treeNodes = document.querySelectorAll('.bean-hot');
  if (tip && treeNodes.length) {
    treeNodes.forEach(node => {
      node.addEventListener('mouseenter', () => {
        const label = node.getAttribute('data-label') || '';
        const sub   = node.getAttribute('data-sub')   || '';
        tip.innerHTML = label + (sub ? `<span class="tip-sub">${sub}</span>` : '');
        tip.classList.add('show');
      });
      node.addEventListener('mouseleave', () => tip.classList.remove('show'));
      node.addEventListener('mousemove', (e) => {
        tip.style.transform = `translate(${e.clientX}px, ${e.clientY - 18}px) translate(-50%, -100%)`;
      });
      /* Hide tooltip on focus blur (keyboard users) */
      node.addEventListener('blur',  () => tip.classList.remove('show'));
    });
  }
})();
