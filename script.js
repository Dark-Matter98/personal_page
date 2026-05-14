const root = document.documentElement;
const themeToggle = document.querySelector("#themeToggle");
const themeIcon = themeToggle?.querySelector("i");
const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
  root.dataset.theme = savedTheme;
}

function syncThemeIcon() {
  const isLight = root.dataset.theme === "light";
  themeIcon?.classList.toggle("fa-sun", isLight);
  themeIcon?.classList.toggle("fa-moon", !isLight);
}

syncThemeIcon();

themeToggle?.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "light" ? "dark" : "light";
  root.dataset.theme = nextTheme;
  localStorage.setItem("theme", nextTheme);
  syncThemeIcon();
});

document.querySelectorAll("[data-avatar]").forEach((image) => {
  image.addEventListener("error", () => {
    image.classList.add("is-missing");
  });
});

const roles = [
  "Industrial Engineer",
  "Advanced Manufacturing Researcher",
  "AI Hardware Materials Scientist",
  "Digital Twin Developer",
  "Manufacturing ML Practitioner"
];

const target = document.querySelector("#typeTarget");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (target && !reduceMotion) {
  let roleIndex = 0;
  let charIndex = 0;
  let removing = false;

  function typeRole() {
    const role = roles[roleIndex];
    target.textContent = role.slice(0, charIndex);

    if (!removing && charIndex < role.length) {
      charIndex += 1;
      setTimeout(typeRole, 54);
      return;
    }

    if (!removing && charIndex === role.length) {
      removing = true;
      setTimeout(typeRole, 1300);
      return;
    }

    if (removing && charIndex > 0) {
      charIndex -= 1;
      setTimeout(typeRole, 32);
      return;
    }

    removing = false;
    roleIndex = (roleIndex + 1) % roles.length;
    setTimeout(typeRole, 260);
  }

  typeRole();
}

const reveals = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

reveals.forEach((element) => revealObserver.observe(element));

const navLinks = [...document.querySelectorAll(".nav__links a")];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
);

sections.forEach((section) => activeObserver.observe(section));

const year = document.querySelector("#year");
if (year) {
  year.textContent = new Date().getFullYear();
}
