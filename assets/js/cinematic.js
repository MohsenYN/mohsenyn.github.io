/* ============================================================
   GUELPH DRY BEAN — CINEMATIC SCROLL ENGINE
   Maps window scroll inside the .reel to a 0..1 timeline,
   then fades + scales each .scene like a Kling-style camera
   pull-back: tablet -> drones -> satellite/DNA -> AI -> beans.
   No GSAP, no React — vanilla, tiny, GitHub-Pages friendly.
   ============================================================ */

(() => {
  const reel  = document.querySelector('.reel');
  const stage = document.querySelector('.stage');
  if (!reel || !stage) return;

  const scenes  = Array.from(stage.querySelectorAll('.scene'));
  const intro   = stage.querySelector('.intro');
  const hint    = stage.querySelector('.hint');
  const scrub   = document.querySelector('.scrub__bar');
  const nav     = document.querySelector('.cine-nav');

  /* Each scene owns a slice of the 0..1 timeline.
     Scenes overlap a little so transitions cross-dissolve. */
  const N = scenes.length;
  const span = 1 / N;          // base width per scene
  const overlap = span * 0.45; // cross-fade region

  /* Smoothstep easing for buttery transitions. */
  const smooth = (t) => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    return t * t * (3 - 2 * t);
  };

  /* For each scene compute opacity in [0,1] given timeline t.
     Each scene rises in over (start..start+overlap) and falls
     out over (end-overlap..end). The first scene starts visible,
     the last stays visible at the end. */
  const sceneOpacity = (idx, t) => {
    const start = idx * span;
    const end   = start + span;
    const fadeIn  = idx === 0      ? 0 : smooth((t - start) / overlap);
    const fadeOut = idx === N - 1  ? 0 : smooth((t - (end - overlap)) / overlap);
    return Math.max(0, Math.min(1, fadeIn - fadeOut + (idx === 0 ? 1 : 0) - (idx === N - 1 ? 0 : 0)));
  };

  /* Cinematic zoom: each scene starts very large (we are inside it),
     settles to scale 1 at its peak, then continues shrinking as we
     pull further back. This gives the dolly-out feel. */
  const sceneScale = (idx, t) => {
    const center = idx * span + span * 0.5;
    const d = (t - center) / span; // -0.5 .. +0.5 around its peak
    // Scale from 1.6 (still zooming out from this layer) at d<0
    // to 0.55 (we've left it behind) at d>0
    const s = 1 - d * 0.9;
    return Math.max(0.45, Math.min(1.7, s));
  };

  /* Caption visibility — show only when scene is mostly on. */
  const captionOpacity = (idx, t) => {
    const start = idx * span;
    const end   = start + span;
    const mid   = (start + end) / 2;
    const dist  = Math.abs(t - mid) / (span / 2);
    return Math.max(0, 1 - dist * 1.4);
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

  /* Smoothing for the timeline so scroll feels filmic. */
  const tick = () => {
    progress += (target - progress) * 0.18;
    if (Math.abs(target - progress) < 0.0005) progress = target;

    const t = progress;
    const introOpacity = Math.max(0, 1 - t * 6); // gone fast after first nudge

    if (intro) intro.style.setProperty('--intro-opacity', introOpacity.toFixed(3));
    if (hint)  hint.style.setProperty('--hint-opacity', (introOpacity * 0.9).toFixed(3));

    scenes.forEach((sc, i) => {
      sc.style.setProperty('--scene-opacity', sceneOpacity(i, t).toFixed(3));
      sc.style.setProperty('--scene-scale',   sceneScale(i, t).toFixed(3));
      const cap = sc.querySelector('.scene__caption');
      if (cap) cap.style.setProperty('--cap-opacity', captionOpacity(i, t).toFixed(3));
    });

    if (scrub) scrub.style.setProperty('--reel-progress', (t * 100).toFixed(1) + '%');

    if (Math.abs(target - progress) > 0.0005) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = null;
    }
  };

  /* Init scenes to a sane state on first paint. */
  scenes.forEach((sc, i) => {
    sc.style.setProperty('--scene-opacity', i === 0 ? '1' : '0');
    sc.style.setProperty('--scene-scale',   '1');
  });

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

  /* ---------- Bean-tree tooltip ---------- */
  const tip = document.querySelector('.tree-tip');
  const treeNodes = document.querySelectorAll('.bean-pod, .bean-leaf');
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
      node.addEventListener('click', () => {
        const href = node.getAttribute('data-href');
        if (href) window.location.href = href;
      });
      /* Keyboard access */
      node.setAttribute('tabindex', '0');
      node.setAttribute('role', 'link');
      node.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const href = node.getAttribute('data-href');
          if (href) window.location.href = href;
        }
      });
    });
  }
})();
