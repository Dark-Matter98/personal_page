/* Project-page-only interactions.
   The main script.js still runs (theme toggle, reveal-on-scroll). */

(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ────────── Reading progress bar ────────── */
  const bar = document.querySelector("#readingBar");
  if (bar) {
    const update = () => {
      const doc = document.documentElement;
      const scrolled = doc.scrollTop || document.body.scrollTop;
      const max = (doc.scrollHeight - doc.clientHeight) || 1;
      bar.style.width = `${Math.min(100, (scrolled / max) * 100)}%`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  /* ────────── Animated counter for hero metrics ──────────
     Use data-count-to="<number>" data-count-suffix="..." data-count-prefix="..."
     If decimals desired, set data-count-decimals="2".
  */
  const counters = document.querySelectorAll("[data-count-to]");
  if (counters.length && !reduceMotion) {
    const animate = (el) => {
      const end = parseFloat(el.dataset.countTo);
      const decimals = parseInt(el.dataset.countDecimals || "0", 10);
      const duration = 1200;
      const start = performance.now();
      const fmt = (v) => {
        const fixed = v.toFixed(decimals);
        // Insert thousands separator if integer-style
        if (decimals === 0 && Math.abs(end) >= 1000) {
          return Number(fixed).toLocaleString();
        }
        return fixed;
      };
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = fmt(end * eased);
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = fmt(end);
      };
      requestAnimationFrame(tick);
    };

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((el) => {
      el.textContent = el.dataset.countStart || "0";
      obs.observe(el);
    });
  } else if (counters.length) {
    counters.forEach((el) => {
      const end = parseFloat(el.dataset.countTo);
      const decimals = parseInt(el.dataset.countDecimals || "0", 10);
      el.textContent = end.toFixed(decimals);
    });
  }

  /* ────────── Sidenav active-section highlighting ────────── */
  const sideLinks = [...document.querySelectorAll(".proj-sidenav a")];
  const targetIds = sideLinks
    .map((a) => a.getAttribute("href"))
    .filter((h) => h && h.startsWith("#"));
  const targets = targetIds
    .map((id) => document.querySelector(id))
    .filter(Boolean);

  if (targets.length) {
    const setActive = (id) => {
      sideLinks.forEach((a) => {
        const li = a.parentElement;
        li.classList.toggle("is-active", a.getAttribute("href") === `#${id}`);
      });
    };
    const sectObs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    targets.forEach((t) => sectObs.observe(t));
  }

  /* ────────── Citation copy button ────────── */
  document.querySelectorAll(".proj-citation__copy").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.copyTarget;
      const pre = id && document.getElementById(id);
      if (!pre) return;
      const text = pre.textContent.trim();
      try {
        await navigator.clipboard.writeText(text);
      } catch (err) {
        // Fallback for older browsers
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "absolute";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      const original = btn.innerHTML;
      btn.classList.add("is-copied");
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied';
      setTimeout(() => {
        btn.classList.remove("is-copied");
        btn.innerHTML = original;
      }, 1800);
    });
  });

  /* ────────── Lightbox for figures ────────── */
  const lightbox = document.querySelector("#lightbox");
  const lightboxImg = lightbox?.querySelector(".lightbox__img");
  const lightboxCap = lightbox?.querySelector(".lightbox__caption");
  const lightboxClose = lightbox?.querySelector(".lightbox__close");

  document.querySelectorAll(".proj-figure").forEach((fig) => {
    fig.addEventListener("click", () => {
      const img = fig.querySelector("img");
      const cap = fig.querySelector("figcaption");
      if (!img || !lightbox) return;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || "";
      lightboxCap.textContent = cap ? cap.textContent.trim() : "";
      lightbox.classList.add("is-open");
      document.body.style.overflow = "hidden";
    });
  });

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
  };

  lightboxClose?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
})();
