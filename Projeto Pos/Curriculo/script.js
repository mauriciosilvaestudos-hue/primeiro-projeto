document.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const printBtn = document.getElementById("printBtn");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const scrollProgress = document.getElementById("scrollProgress");
  const currentYear = document.getElementById("currentYear");

  // Ano atual no rodapé
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // Tema claro / escuro com persistência
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

  // Botão imprimir / salvar PDF
  printBtn?.addEventListener("click", () => {
    window.print();
  });

  // Menu mobile
  menuToggle?.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    const icon = menuToggle.querySelector("i");
    if (icon) {
      icon.className = isOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars";
    }
  });

  // Fecha menu mobile ao clicar em um link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
      const icon = menuToggle?.querySelector("i");
      if (icon) icon.className = "fa-solid fa-bars";
    });
  });

  // Barra de progresso de leitura + destaque da seção ativa na navbar
  const sections = document.querySelectorAll("main section[id]");
  const navItems = document.querySelectorAll(".nav-link");

  const updateScrollUI = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (scrollProgress) {
      scrollProgress.style.width = `${progress}%`;
    }

    let activeId = "inicio";
    sections.forEach((section) => {
      const top = section.offsetTop - 130;
      if (scrollTop >= top) {
        activeId = section.id;
      }
    });

    navItems.forEach((item) => {
      const href = item.getAttribute("href");
      item.classList.toggle("active", href === `#${activeId}`);
    });
  };

  window.addEventListener("scroll", updateScrollUI, { passive: true });
  updateScrollUI();

  // Animação de entrada (Scroll Reveal)
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  // Animação das barras de progresso de idiomas ao entrar na tela
  const progressObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const level = bar.getAttribute("data-level") || "0";
          bar.style.width = `${level}%`;
          progressObserver.unobserve(bar);
        }
      });
    },
    { threshold: 0.35 }
  );

  document.querySelectorAll(".progress-fill").forEach((bar) => progressObserver.observe(bar));

  // Filtro interativo da seção de projetos
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");

      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      projectCards.forEach((card) => {
        const category = card.getAttribute("data-category");
        const shouldShow = filter === "all" || category === filter;
        card.classList.toggle("hidden", !shouldShow);
      });
    });
  });
});
