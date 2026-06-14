(function () {

  /* =============================
     ELEMENTS
  ============================= */

  const header = document.querySelector("[data-header]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-site-nav]");
  const navLinks = document.querySelectorAll(".site-nav a");
  const sections = document.querySelectorAll("section");

  const year = document.querySelector("[data-year]");
  const canvas = document.getElementById("tech-canvas");
  const bg = document.querySelector(".reviews-bg");

  /* =============================
     BASIC UI
  ============================= */

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  /* =============================
     MOBILE MENU
  ============================= */

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        nav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* =============================
     SCROLL SYSTEM
  ============================= */

  let lastScroll = 0;
  const threshold = 100;

  window.addEventListener("scroll", () => {

    const scrollY = window.scrollY;

    /* HEADER */
    if (header) {
      header.classList.toggle("is-scrolled", scrollY > 18);

      if (scrollY < threshold) {
        header.style.transform = "translate(-50%, 0)";
      } else if (scrollY > lastScroll + 5) {
        header.style.transform = "translate(-50%, -100%)";
      } else {
        header.style.transform = "translate(-50%, 0)";
      }
    }

    lastScroll = scrollY;

    /* ACTIVE NAV */
    let current = "";

    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      if (scrollY >= top) current = section.id;
    });

    navLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href")?.includes(current)
      );
    });

    /* PARALLAX */
    if (bg) {
      bg.style.transform = `translateY(${scrollY * 0.1}px)`;
    }

  });

  /* =============================
     CANVAS (GLOBAL FULL SCREEN)
  ============================= */

  if (canvas instanceof HTMLCanvasElement) {

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particles = [];
    const traces = [];

    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;

    /* DEPTH SETTINGS */
    const depth = {
      grid: 0.2,
      traces: 0.5,
      particles: 1
    };

    /* FIT FULL SCREEN */

    function fitCanvas() {

      dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      canvas.style.width = width + "px";
      canvas.style.height = height + "px";

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      seedScene();
    }

    /* SEED */

    function seedScene() {
      particles.length = 0;
      traces.length = 0;

      const particleCount = Math.min(100, Math.max(50, width / 12));
      const traceCount = Math.min(25, Math.max(12, width / 50));

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 1 + Math.random() * 1.5,
          speed: 0.15 + Math.random() * 0.3,
          angle: Math.random() * Math.PI * 2
        });
      }

      
for (let i = 0; i < traceCount; i++) {
  traces.push({
    x: Math.random() * width,
    y: Math.random() * height,
    length: 80 + Math.random() * 150,
    speed: 0.002 + Math.random() * 0.01,
    phase: Math.random() * Math.PI * 2,
    vertical: Math.random() > 0.5,

    offset: Math.random() * 50 // ✅ NEW RANDOM OFFSET
  });
}

    }

  

function drawTraces() {
  ctx.lineCap = "round";

  traces.forEach((t) => {

    const pulse = (Math.sin(frame * t.speed + t.phase) + 1) / 2;

    // ✅ more natural movement
    const drift =
      Math.sin(frame * 0.008 + t.phase) *
      (6 + pulse * 10) *
      depth.traces;

    // ✅ depth-based alpha
    const alpha = 0.35 + pulse * 0.55;

    // ✅ depth-based thickness
    const thickness = 1.2 + pulse * 2.4;

    // ---------- GLOW LAYER (soft bloom) ----------
    ctx.save();
    ctx.strokeStyle = `rgba(64,233,255,${alpha * 0.35})`;
    ctx.lineWidth = thickness * 2.5;
    ctx.shadowBlur = 20;
    ctx.shadowColor = "rgba(64,233,255,0.5)";

    ctx.beginPath();
    if (t.vertical) {
      ctx.moveTo(t.x + drift, t.y - t.length / 2);
      ctx.lineTo(t.x + drift, t.y + t.length / 2);
    } else {
      ctx.moveTo(t.x - t.length / 2, t.y + drift);
      ctx.lineTo(t.x + t.length / 2, t.y + drift);
    }
    ctx.stroke();
    ctx.restore();

    // ---------- CORE LINE (sharp detail) ----------
    ctx.save();
    ctx.strokeStyle = `rgba(64,233,255,${alpha})`;
    ctx.lineWidth = thickness;
    ctx.shadowBlur = 6;
    ctx.shadowColor = "rgba(64,233,255,0.7)";

    ctx.beginPath();
    if (t.vertical) {
      ctx.moveTo(t.x + drift, t.y - t.length / 2);
      ctx.lineTo(t.x + drift, t.y + t.length / 2);
    } else {
      ctx.moveTo(t.x - t.length / 2, t.y + drift);
      ctx.lineTo(t.x + t.length / 2, t.y + drift);
    }
    ctx.stroke();
    ctx.restore();

  });
}





    /* DRAW PARTICLES */

    function drawParticles() {
      particles.forEach((p) => {

        p.x += Math.cos(p.angle) * p.speed * depth.particles;
        p.y += Math.sin(p.angle) * p.speed * depth.particles;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = "rgba(64,233,255,0.7)";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(64,233,255,0.4)";

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    /* LOOP */

    function draw() {
      frame++;

      ctx.clearRect(0, 0, width, height);

      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, "#040706");
      bgGrad.addColorStop(0.35, "#07100f");
      bgGrad.addColorStop(1, "#050908");

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      drawTraces();
      drawParticles();

      requestAnimationFrame(draw);
    }

    window.addEventListener("resize", fitCanvas);

    fitCanvas();
    draw();
  }

  /* =============================
     REVIEW ANIMATION
  ============================= */

  const reviews = document.querySelectorAll(".review-card");

  if (reviews.length) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    reviews.forEach((card) => observer.observe(card));
  }

})();

async function load(id, file) {
  const res = await fetch(file);
  document.getElementById(id).innerHTML = await res.text();
}

// load header/footer
load("header", "components/header.html");
load("footer", "components/footer.html");

// load all sections into main
async function loadMain() {
  const sections = [
    "hero",
    "assurance",
    "services",
    "process",
    "pricing",
    "reviews",
    "tech",
    "location",
    "faq",
    "contact"
  ];

  let content = "";

  for (let s of sections) {
    const res = await fetch(`components/${s}.html`);
    content += await res.text();
  }

  document.getElementById("main").innerHTML = content;
}

loadMain();