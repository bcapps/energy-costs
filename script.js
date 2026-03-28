const revealItems = document.querySelectorAll(".reveal");
const firstProgramSection = document.querySelector("#whole-home");
const solarSwitchButtons = document.querySelectorAll("[data-solar-target]");
const solarPanels = document.querySelectorAll("[data-solar-panel]");

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

if (solarSwitchButtons.length && solarPanels.length) {
  const setActiveSolarPanel = (target) => {
    solarSwitchButtons.forEach((button) => {
      const isActive = button.dataset.solarTarget === target;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", String(isActive));
      button.tabIndex = isActive ? 0 : -1;
    });

    solarPanels.forEach((panel) => {
      panel.hidden = panel.dataset.solarPanel !== target;
    });
  };

  solarSwitchButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setActiveSolarPanel(button.dataset.solarTarget);
    });

    button.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
        return;
      }

      event.preventDefault();

      const buttons = Array.from(solarSwitchButtons);
      const currentIndex = buttons.indexOf(button);
      let nextIndex = currentIndex;

      if (event.key === "ArrowRight") {
        nextIndex = (currentIndex + 1) % buttons.length;
      } else if (event.key === "ArrowLeft") {
        nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = buttons.length - 1;
      }

      const nextButton = buttons[nextIndex];
      setActiveSolarPanel(nextButton.dataset.solarTarget);
      nextButton.focus();
    });
  });

  setActiveSolarPanel("community");
}
