(function () {

  const canvas = document.getElementById("tech-canvas");

  if (canvas instanceof HTMLCanvasElement) {

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const particles = [];
    const traces = [];

    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;

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

    function seedScene() {

      particles.length = 0;
      traces.length = 0;

      for (let i = 0; i < 80; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 1 + Math.random(),
          speed: 0.15 + Math.random() * 0.25,
          angle: Math.random() * Math.PI * 2
        });
      }

      for (let i = 0; i < 18; i++) {
        traces.push({
          x: Math.random() * width,
          y: Math.random() * height,
          length: 80 + Math.random() * 120,
          speed: 0.002 + Math.random() * 0.008,
          phase: Math.random() * Math.PI * 2,
          vertical: Math.random() > 0.5,
          offset: Math.random() * 50
        });
      }
    }

    /* ====================
       TRACES (LINES)
    ==================== */
    function drawTraces() {

      traces.forEach((t) => {

        const pulse = (Math.sin(frame * t.speed + t.phase) + 1) / 2;

        const drift =
          Math.sin(frame * 0.008 + t.phase + t.offset) *
          (6 + pulse * 10) * 0.5;

        /* ✅ SOFTER VALUES */
        const alpha = 0.15 + pulse * 0.25;
        const thickness = 0.6 + pulse * 1.2;

        ctx.save();

        /* ✅ DIMMER COLOUR */
        ctx.strokeStyle = `rgba(40,180,200,${alpha})`;

        ctx.lineWidth = thickness;

        /* ✅ REDUCED GLOW */
        ctx.shadowBlur = 6;
        ctx.shadowColor = "rgba(40,180,200,0.2)";

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

    /* ====================
       PARTICLES
    ==================== */
    function drawParticles() {

      particles.forEach((p) => {

        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        /* ✅ SOFTER PARTICLES */
        ctx.fillStyle = "rgba(40,180,200,0.4)";
        ctx.shadowBlur = 4;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.shadowBlur = 0;
    }

    /* ====================
       CONNECTIONS
    ==================== */
    function drawConnections() {

      for (let a = 0; a < particles.length; a += 2) {
        for (let b = a + 1; b < particles.length; b += 2) {

          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distSq = dx * dx + dy * dy;

          if (distSq < 120 * 120) {

            const alpha = 1 - distSq / (120 * 120);

            /* ✅ DIMMED CONNECTIONS */
            ctx.strokeStyle = `rgba(40,180,200,${alpha * 0.3})`;
            ctx.lineWidth = 0.4;

            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    /* ====================
       LOOP
    ==================== */
    function draw() {

      frame++;

      ctx.clearRect(0, 0, width, height);

      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, "#040706");
      bgGrad.addColorStop(1, "#050908");

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      drawTraces();
      drawParticles();
      drawConnections();

      requestAnimationFrame(draw);
    }

    window.addEventListener("resize", fitCanvas);

    fitCanvas();
    draw();
  }

})();
