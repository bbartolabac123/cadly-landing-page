(() => {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const header = document.querySelector(".site-header");
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealEls = document.querySelectorAll(".reveal");

  if (reduceMotion) {
    revealEls.forEach((el) => el.classList.add("is-inview"));
  } else {
    // threshold: 0 so tall blocks (e.g. legal pages) still reveal when any
    // part enters the viewport — a fractional threshold can never be met.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-inview");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -40px 0px", threshold: 0 }
    );

    revealEls.forEach((el) => observer.observe(el));
  }

  const rail = document.querySelector(".shot-rail");
  if (!rail) return;

  let pointerId = null;
  let startX = 0;
  let startScroll = 0;
  let dragged = false;

  const endDrag = (event) => {
    if (pointerId === null || event.pointerId !== pointerId) return;
    rail.releasePointerCapture(pointerId);
    pointerId = null;
    rail.classList.toggle("is-dragging", false);
  };

  rail.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch") return;
    if (event.button !== 0) return;
    pointerId = event.pointerId;
    startX = event.clientX;
    startScroll = rail.scrollLeft;
    dragged = false;
    rail.setPointerCapture(pointerId);
    rail.classList.add("is-dragging");
  });

  rail.addEventListener("pointermove", (event) => {
    if (pointerId === null || event.pointerId !== pointerId) return;
    const delta = event.clientX - startX;
    if (Math.abs(delta) > 4) dragged = true;
    rail.scrollLeft = startScroll - delta;
  });

  rail.addEventListener("pointerup", endDrag);
  rail.addEventListener("pointercancel", endDrag);

  rail.addEventListener("click", (event) => {
    if (!dragged) return;
    event.preventDefault();
    event.stopPropagation();
    dragged = false;
  }, true);

  rail.addEventListener("keydown", (event) => {
    const step = Math.round(rail.clientWidth * 0.7);
    if (event.key === "ArrowRight") {
      event.preventDefault();
      rail.scrollBy({ left: step, behavior: reduceMotion ? "auto" : "smooth" });
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      rail.scrollBy({ left: -step, behavior: reduceMotion ? "auto" : "smooth" });
    }
  });
})();
