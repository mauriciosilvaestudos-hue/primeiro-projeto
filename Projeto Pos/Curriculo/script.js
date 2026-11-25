document.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;
  const navbar = document.getElementById("navbar");
  const themeToggle = document.getElementById("themeToggle");
  const printBtn = document.getElementById("printBtn");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const scrollProgress = document.getElementById("scrollProgress");
  const currentYear = document.getElementById("currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  const savedTheme = localStorage.getItem("cv-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme || (prefersDark ? "dark" : "light");

  const applyTheme = (theme) => {
    html.setAttribute("data-theme", theme);
    const icon = themeToggle?.querySelector("i");
    if (icon) {
      icon.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
    }
  };

  applyTheme(initialTheme);

  themeToggle?.addEventListener("click", () => {
    const nextTheme = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    localStorage.setItem("cv-theme", nextTheme);
  });

  printBtn?.addEventListener("click", () => window.print());

  const closeMenu = () => {
    navLinks?.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    const icon = menuToggle?.querySelector("i");
    if (icon) icon.className = "fa-solid fa-bars";
  };

  menuToggle?.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    const icon = menuToggle.querySelector("i");
    if (icon) icon.className = isOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars";
  });

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  const sections = document.querySelectorAll("main section[id]");
  const navItems = document.querySelectorAll(".nav-link");

  const updateScrollUI = () => {
    const scrollTop = window.scrollY;
    const hero = document.getElementById("inicio");
    const navHeight = navbar?.offsetHeight || 76;
    const solidNav = hero ? scrollTop > hero.offsetHeight - navHeight - 48 : scrollTop > 24;
    navbar?.classList.toggle("scrolled", solidNav);

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrollProgress) scrollProgress.style.width = `${progress}%`;

    let activeId = "inicio";
    sections.forEach((section) => {
      if (scrollTop >= section.offsetTop - 140) activeId = section.id;
    });

    navItems.forEach((item) => {
      item.classList.toggle("active", item.getAttribute("href") === `#${activeId}`);
    });
  };

  window.addEventListener("scroll", updateScrollUI, { passive: true });
  updateScrollUI();

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.14 }
  );

  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  const progressObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const bar = entry.target;
        bar.style.width = `${bar.getAttribute("data-level") || "0"}%`;
        progressObserver.unobserve(bar);
      });
    },
    { threshold: 0.4 }
  );

  document.querySelectorAll(".progress-fill").forEach((bar) => progressObserver.observe(bar));

  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.getAttribute("data-count")) || 0;
        const start = performance.now();
        const duration = 900;

        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          el.textContent = String(Math.round(target * (1 - Math.pow(1 - progress, 3))));
          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
        countObserver.unobserve(el);
      });
    },
    { threshold: 0.6 }
  );

  document.querySelectorAll("[data-count]").forEach((el) => countObserver.observe(el));
});
