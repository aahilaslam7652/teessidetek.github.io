(function () {
  const header = document.querySelector("[data-header]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-site-nav]");
  const year = document.querySelector("[data-year]");
  const canvas = document.getElementById("tech-canvas");

  /* =============================
     BASIC UI
  ============================= */

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  if (header) {
    const updateHeader = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 18);
    };
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.addEventListener("click", (event) => {
      if (event.target instanceof HTMLAnchorElement) {
        nav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* =============================
     CANVAS SETUP
  ============================= */

  if (!(canvas instanceof HTMLCanvasElement)) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const particles = [];
  const traces = [];

  let width = 0;
  let height = 0;
  let dpr = 1;
  let frame = 0;

  function fitCanvas() {
    const hero = document.querySelector(".hero");
    const rect = hero.getBoundingClientRect();

    dpr = Math.min(window.devicePixelRatio || 1, 2);

    width = rect.width;
    height = rect.height;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    seedScene(); // ✅ regenerate visuals after resize
  }

  function seedScene() {
    particles.length = 0;
    traces.length = 0;

    const particleCount = Math.min(100, Math.max(50, width / 12));

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 1 + Math.random() * 1.5,
        speed: 0.15 + Math.random() * 0.3,
        angle: Math.random() * Math.PI * 2,
      });
    }

    const traceCount = Math.min(25, Math.max(12, width / 50));

    for (let i = 0; i < traceCount; i++) {
      traces.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: 80 + Math.random() * 150,
        speed: 0.002 + Math.random() * 0.01,
        phase: Math.random() * Math.PI * 2,
        vertical: Math.random() > 0.5,
      });
    }
  }

  /* =============================
     DRAW FUNCTIONS
  ============================= */

  function drawGrid() {
    ctx.save();
    ctx.lineWidth = 1;
    const grid = 42;
    const offset = (frame * 0.1) % grid;

    for (let x = -grid + offset; x < width + grid; x += grid) {
      ctx.strokeStyle = "rgba(154,255,231,0.04)";
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = -grid + offset; y < height + grid; y += grid) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    ctx.restore();
  }

function drawParticles() {
  ctx.save();

  particles.forEach((p) => {
    p.x += Math.cos(p.angle) * p.speed;
    p.y += Math.sin(p.angle) * p.speed;

    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;

    const alpha = 0.3 + Math.sin(frame * 0.02 + p.x) * 0.15;

    ctx.fillStyle = `rgba(64,233,255,${alpha})`;

    ctx.shadowBlur = 12;
    ctx.shadowColor = "rgba(64,233,255,0.4)";

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}


function drawTraces() {
  ctx.save();
  ctx.lineCap = "round";

  traces.forEach((t) => {
    const pulse = (Math.sin(frame * t.speed + t.phase) + 1) / 2;

    ctx.strokeStyle = `rgba(64,233,255,${0.3 + pulse * 0.5})`;
    ctx.lineWidth = 1 + pulse * 2;

    ctx.shadowBlur = 15;
    ctx.shadowColor = "rgba(64,233,255,0.5)";

    ctx.beginPath();

    if (t.vertical) {
      ctx.moveTo(t.x, t.y - t.length / 2);
      ctx.lineTo(t.x, t.y + t.length / 2);
    } else {
      ctx.moveTo(t.x - t.length / 2, t.y);
      ctx.lineTo(t.x + t.length / 2, t.y);
    }

    ctx.stroke();

    ctx.shadowBlur = 0;
  });

  ctx.restore();
}

  /* =============================
     MAIN LOOP
  ============================= */

  function draw() {
    frame++;

    ctx.clearRect(0, 0, width, height);

    const bg = ctx.createLinearGradient(0, 0, width, height);
bg.addColorStop(0, "#040706");
bg.addColorStop(0.35, "#07100f");
bg.addColorStop(1, "#050908");

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    drawGrid();
    drawTraces();
    drawParticles();

    requestAnimationFrame(draw);
  }

  /* =============================
     EVENTS
  ============================= */

  window.addEventListener("resize", fitCanvas, { passive: true });

  /* =============================
     INIT
  ============================= */

  fitCanvas();
  draw();
})();
``
