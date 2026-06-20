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

  /* =============================
     CANVAS (GLOBAL FULL SCREEN)
  ============================= */

  if (canvas instanceof HTMLCanvasElement) {

    const ctx = canvas.getContext("2d", { willReadFrequently: false });

    if (!ctx) {
      console.warn("Canvas not supported");
    } else {

      const particles = [];
      const traces = [];

      let width = 0;
      let height = 0;
      let dpr = 1;
      let frame = 0;

      let running = true;
      let lastTime = 0;
      let animationId;

      const FPS = 60;
      const frameInterval = 1000 / FPS;

      let lastWidth = 0;

      const isMobile = window.innerWidth < 768;

      /* DEPTH SETTINGS */
      const depth = {
        traces: 0.5,
        particles: 1
      };

      /* VISIBILITY (PERFORMANCE) */
      document.addEventListener("visibilitychange", () => {
        running = !document.hidden;
      });

      /* FIT FULL SCREEN */
      function fitCanvas() {

        dpr = Math.min(window.devicePixelRatio || 1, 2);

        const oldWidth = width;

        width = window.innerWidth;
        height = window.innerHeight;

        canvas.width = width * dpr;
        canvas.height = height * dpr;

        canvas.style.width = width + "px";
        canvas.style.height = height + "px";

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        if (Math.abs(width - oldWidth) > 100) {
          seedScene();
        }
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
            offset: Math.random() * 50
          });
        }
      }

      /* DRAW TRACES */
      function drawTraces() {

        traces.forEach((t) => {

          const pulse = (Math.sin(frame * t.speed + t.phase) + 1) / 2;

          const drift =
            Math.sin(frame * 0.008 + t.phase + t.offset) *
            (6 + pulse * 10) *
            depth.traces;

          const alpha = 0.35 + pulse * 0.55;
          const thickness = 1.2 + pulse * 2.4;

          t.x += Math.sin(frame * t.speed + t.phase) * 0.2;
          t.y += Math.cos(frame * t.speed + t.phase) * 0.2;

          if (t.x < 0) t.x = width;
          if (t.x > width) t.x = 0;
          if (t.y < 0) t.y = height;
          if (t.y > height) t.y = 0;

          ctx.save();

          ctx.strokeStyle = `rgba(64,233,255,${alpha})`;
          ctx.lineWidth = thickness;
          ctx.shadowBlur = 15;
          ctx.shadowColor = "rgba(64,233,255,0.6)";

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
          ctx.shadowBlur = 8;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.shadowBlur = 0;
      }

      /* CONNECTIONS */
      function drawConnections() {

        for (let a = 0; a < particles.length; a += 2) {
          for (let b = a + 1; b < particles.length; b += 2) {

            const dx = particles[a].x - particles[b].x;
            const dy = particles[a].y - particles[b].y;
            const distSq = dx * dx + dy * dy;

            if (distSq < 120 * 120) {

              const alpha = 1 - distSq / (120 * 120);

              ctx.strokeStyle = `rgba(64,233,255,${alpha})`;
              ctx.lineWidth = 0.5;

              ctx.beginPath();
              ctx.moveTo(particles[a].x, particles[a].y);
              ctx.lineTo(particles[b].x, particles[b].y);
              ctx.stroke();
            }
          }
        }
      }

      /* LOOP */
      function draw(time = 0) {

        if (!running) {
          animationId = requestAnimationFrame(draw);
          return;
        }

        const delta = time - lastTime;

        if (delta < frameInterval) {
          animationId = requestAnimationFrame(draw);
          return;
        }

        lastTime = time;
        frame++;

        ctx.clearRect(0, 0, width, height);

        const bgGrad = ctx.createLinearGradient(0, 0, width, height);
        bgGrad.addColorStop(0, "#040706");
        bgGrad.addColorStop(0.4, "#07100f");
        bgGrad.addColorStop(1, "#050908");

        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        drawTraces();
        drawParticles();

        if (!isMobile) {
          drawConnections();
        }

        animationId = requestAnimationFrame(draw);
      }

      window.addEventListener("resize", fitCanvas);

      fitCanvas();
      draw();
    }
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

/* =============================
   SAFE LOAD FUNCTION
============================= */

async function load(id, file) {
  try {
    const res = await fetch(file);
    document.getElementById(id).innerHTML = await res.text();
  } catch (err) {
    console.error("Load failed:", err);
  }
}