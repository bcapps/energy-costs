const revealItems = document.querySelectorAll(".reveal");
const firstProgramSection = document.querySelector("#whole-home");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -5% 0px",
    },
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const updateScrollShift = () => {
  if (!firstProgramSection) {
    return;
  }

  const transitionDistance = Math.max(firstProgramSection.offsetTop, 1);
  const progress = Math.min(window.scrollY / transitionDistance, 1);
  document.documentElement.style.setProperty("--scroll-shift", progress.toFixed(3));
};

updateScrollShift();
window.addEventListener("scroll", updateScrollShift, { passive: true });
window.addEventListener("resize", updateScrollShift);
