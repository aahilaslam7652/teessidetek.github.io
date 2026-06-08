(function () {
  const header = document.querySelector("[data-header]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-site-nav]");
  const year = document.querySelector("[data-year]");

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

  const canvas = document.getElementById("tech-canvas");
  if (!(canvas instanceof HTMLCanvasElement)) {
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pointer = { x: 0, y: 0, active: false };
  const particles = [];
  const traces = [];
  let width = 0;
  let height = 0;
  let dpr = 1;
  let frame = 0;

function fitCanvas() {
  const heroSection = document.querySelector(".hero");
  const rect = heroSection.getBoundingClientRect(); // ✅ KEY FIX
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = rect.width;
  const height = rect.height;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = rect.width + "px";
  canvas.style.height = rect.height + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

  function seedScene() {
    particles.length = 0;
    traces.length = 0;

    const particleCount = Math.round(Math.min(115, Math.max(58, width / 13)));
    for (let index = 0; index < particleCount; index += 1) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.7 + Math.random() * 1.8,
        speed: 0.12 + Math.random() * 0.38,
        angle: Math.random() * Math.PI * 2,
        phase: Math.random() * Math.PI * 2,
        tone: Math.random() > 0.72 ? "amber" : Math.random() > 0.45 ? "green" : "cyan",
      });
    }

    const traceCount = Math.round(Math.min(26, Math.max(14, width / 54)));
    for (let index = 0; index < traceCount; index += 1) {
      const y = height * (0.18 + Math.random() * 0.68);
      const x = width * (0.34 + Math.random() * 0.58);
      traces.push({
        x,
        y,
        length: 80 + Math.random() * 190,
        phase: Math.random() * Math.PI * 2,
        speed: 0.006 + Math.random() * 0.012,
        vertical: Math.random() > 0.55,
      });
    }
  }

  function colorFor(tone, alpha) {
    if (tone === "green") {
      return `rgba(98, 255, 183, ${alpha})`;
    }
    if (tone === "amber") {
      return `rgba(255, 204, 102, ${alpha})`;
    }
    return `rgba(64, 233, 255, ${alpha})`;
  }

  function roundedRect(x, y, w, h, radius) {
    const r = Math.min(radius, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawGrid() {
    ctx.save();
    ctx.lineWidth = 1;
    const grid = 42;
    const offset = (frame * 0.12) % grid;

    for (let x = -grid + offset; x < width + grid; x += grid) {
      ctx.strokeStyle = "rgba(154, 255, 231, 0.035)";
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = -grid + offset; y < height + grid; y += grid) {
      ctx.strokeStyle = "rgba(154, 255, 231, 0.035)";
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawWorkbench() {
    const baseY = height * 0.72;
    const benchX = width * 0.48;
    const benchW = Math.min(width * 0.46, 620);
    const benchH = Math.min(height * 0.2, 170);
    const phoneW = Math.min(140, width * 0.13);
    const phoneH = phoneW * 1.82;
    const laptopW = Math.min(360, width * 0.32);
    const laptopH = laptopW * 0.5;
    const parallaxX = pointer.active ? (pointer.x / width - 0.5) * 18 : Math.sin(frame * 0.008) * 5;
    const parallaxY = pointer.active ? (pointer.y / height - 0.5) * 10 : Math.cos(frame * 0.009) * 4;

    ctx.save();
    ctx.translate(parallaxX, parallaxY);

    const benchGradient = ctx.createLinearGradient(benchX - benchW / 2, baseY, benchX + benchW / 2, baseY + benchH);
    benchGradient.addColorStop(0, "rgba(12, 27, 25, 0.78)");
    benchGradient.addColorStop(0.55, "rgba(20, 35, 32, 0.86)");
    benchGradient.addColorStop(1, "rgba(8, 14, 14, 0.9)");

    roundedRect(benchX - benchW / 2, baseY, benchW, benchH, 18);
    ctx.fillStyle = benchGradient;
    ctx.fill();
    ctx.strokeStyle = "rgba(98, 255, 183, 0.22)";
    ctx.stroke();

    ctx.shadowBlur = 32;
    ctx.shadowColor = "rgba(64, 233, 255, 0.22)";
    ctx.strokeStyle = "rgba(64, 233, 255, 0.42)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(benchX - benchW * 0.42, baseY + benchH * 0.34);
    ctx.lineTo(benchX - benchW * 0.12, baseY + benchH * 0.34);
    ctx.lineTo(benchX - benchW * 0.02, baseY + benchH * 0.55);
    ctx.lineTo(benchX + benchW * 0.36, baseY + benchH * 0.55);
    ctx.stroke();
    ctx.shadowBlur = 0;

    const laptopX = benchX + benchW * 0.03;
    const laptopY = baseY - laptopH * 0.52;
    roundedRect(laptopX, laptopY, laptopW, laptopH, 12);
    ctx.fillStyle = "rgba(9, 20, 19, 0.86)";
    ctx.fill();
    ctx.strokeStyle = "rgba(64, 233, 255, 0.36)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "rgba(64, 233, 255, 0.055)";
    roundedRect(laptopX + 16, laptopY + 15, laptopW - 32, laptopH - 32, 8);
    ctx.fill();

    ctx.strokeStyle = "rgba(98, 255, 183, 0.42)";
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 5; i += 1) {
      const y = laptopY + 35 + i * 20;
      ctx.beginPath();
      ctx.moveTo(laptopX + 36, y);
      ctx.lineTo(laptopX + laptopW - 46 - i * 18, y);
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(64, 233, 255, 0.9)";
    for (let i = 0; i < 4; i += 1) {
      ctx.beginPath();
      ctx.arc(laptopX + laptopW - 46, laptopY + 37 + i * 22, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.beginPath();
    ctx.moveTo(laptopX - 24, laptopY + laptopH + 8);
    ctx.lineTo(laptopX + laptopW + 24, laptopY + laptopH + 8);
    ctx.lineTo(laptopX + laptopW + 52, laptopY + laptopH + 34);
    ctx.lineTo(laptopX - 52, laptopY + laptopH + 34);
    ctx.closePath();
    ctx.fillStyle = "rgba(12, 23, 22, 0.94)";
    ctx.fill();
    ctx.strokeStyle = "rgba(194, 255, 232, 0.16)";
    ctx.stroke();

    const phoneX = benchX - benchW * 0.34;
    const phoneY = baseY - phoneH * 0.64;
    roundedRect(phoneX, phoneY, phoneW, phoneH, 18);
    ctx.fillStyle = "rgba(5, 10, 10, 0.94)";
    ctx.fill();
    ctx.strokeStyle = "rgba(98, 255, 183, 0.52)";
    ctx.lineWidth = 2;
    ctx.stroke();

    roundedRect(phoneX + 10, phoneY + 16, phoneW - 20, phoneH - 32, 12);
    ctx.fillStyle = "rgba(22, 255, 184, 0.055)";
    ctx.fill();

    ctx.strokeStyle = "rgba(64, 233, 255, 0.52)";
    ctx.lineWidth = 1.3;
    const chipX = phoneX + phoneW * 0.34;
    const chipY = phoneY + phoneH * 0.37;
    roundedRect(chipX, chipY, phoneW * 0.32, phoneW * 0.32, 6);
    ctx.stroke();

    for (let i = 0; i < 4; i += 1) {
      const legY = chipY + 8 + i * 8;
      ctx.beginPath();
      ctx.moveTo(chipX - 15, legY);
      ctx.lineTo(chipX, legY);
      ctx.moveTo(chipX + phoneW * 0.32, legY);
      ctx.lineTo(chipX + phoneW * 0.32 + 15, legY);
      ctx.stroke();
    }

    const toolX = benchX + benchW * 0.24;
    const toolY = baseY + benchH * 0.55;
    ctx.translate(toolX, toolY);
    ctx.rotate(-0.32);
    roundedRect(-8, -78, 16, 96, 6);
    ctx.fillStyle = "rgba(255, 204, 102, 0.78)";
    ctx.fill();
    ctx.fillStyle = "rgba(194, 255, 232, 0.8)";
    ctx.fillRect(-4, -118, 8, 42);
    ctx.restore();
  }

  function drawTraces() {
    ctx.save();
    ctx.lineCap = "round";
    traces.forEach((trace) => {
      const pulse = (Math.sin(frame * trace.speed + trace.phase) + 1) / 2;
      const glow = 0.14 + pulse * 0.42;
      ctx.strokeStyle = `rgba(64, 233, 255, ${glow})`;
      ctx.lineWidth = 1 + pulse * 1.8;
      ctx.shadowBlur = 12 + pulse * 18;
      ctx.shadowColor = "rgba(64, 233, 255, 0.55)";

      ctx.beginPath();
      if (trace.vertical) {
        ctx.moveTo(trace.x, trace.y - trace.length / 2);
        ctx.lineTo(trace.x, trace.y + trace.length / 2);
      } else {
        ctx.moveTo(trace.x - trace.length / 2, trace.y);
        ctx.lineTo(trace.x + trace.length / 2, trace.y);
      }
      ctx.stroke();

      ctx.fillStyle = "rgba(98, 255, 183, 0.8)";
      ctx.beginPath();
      ctx.arc(
        trace.x + (trace.vertical ? 0 : (pulse - 0.5) * trace.length),
        trace.y + (trace.vertical ? (pulse - 0.5) * trace.length : 0),
        3,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    });
    ctx.restore();
  }

  function drawParticles() {
    ctx.save();
    particles.forEach((particle) => {
      if (!prefersReducedMotion) {
        particle.x += Math.cos(particle.angle) * particle.speed;
        particle.y += Math.sin(particle.angle) * particle.speed;
        particle.angle += Math.sin(frame * 0.002 + particle.phase) * 0.006;
      }

      if (particle.x < -20) particle.x = width + 20;
      if (particle.x > width + 20) particle.x = -20;
      if (particle.y < -20) particle.y = height + 20;
      if (particle.y > height + 20) particle.y = -20;

      const alpha = 0.28 + Math.sin(frame * 0.018 + particle.phase) * 0.12;
      ctx.fillStyle = colorFor(particle.tone, alpha);
      ctx.shadowBlur = 12;
      ctx.shadowColor = colorFor(particle.tone, 0.45);
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  function draw() {
    frame += prefersReducedMotion ? 0 : 1;
    ctx.clearRect(0, 0, width, height);

    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, "#040706");
    bg.addColorStop(0.42, "#081211");
    bg.addColorStop(1, "#06100f");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    drawGrid();
    drawTraces();
    drawParticles();
    drawWorkbench();

    if (!prefersReducedMotion) {
      requestAnimationFrame(draw);
    }
  }

  window.addEventListener("resize", fitCanvas, { passive: true });
  window.addEventListener(
    "pointermove",
    (event) => {
      pointer.active = true;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    },
    { passive: true },
  );
  window.addEventListener("pointerleave", () => {
    pointer.active = false;
  });

  fitCanvas();
  draw();
})();
