console.log("✅ Recent repairs JS loaded");

document.addEventListener("DOMContentLoaded", () => {

  const scroll = document.querySelector("#recent-repairs .repairs-scroll");
  const lightbox = document.getElementById("lightbox");

  if (!scroll) {
    console.error("❌ Scroll container not found");
    return;
  }

  /* =========================
     ✅ CLONE FOR INFINITE LOOP
  ========================= */

  const cards = Array.from(scroll.children);

  cards.forEach(card => {
    scroll.appendChild(card.cloneNode(true));
  });

  /* =========================
     ✅ AUTO SCROLL (SMOOTH + LOOP)
  ========================= */

  let speed = 0.8;       // adjust speed here
  let isPaused = false;

  function autoScroll() {
    if (!isPaused) {
      scroll.scrollLeft += speed;

      const originalWidth = scroll.scrollWidth / 2;

      // ✅ seamless loop (no jump)
      if (scroll.scrollLeft >= originalWidth) {
        scroll.scrollLeft -= originalWidth;
      }
    }

    requestAnimationFrame(autoScroll);
  }

  autoScroll();

  /* =========================
     ✅ PAUSE / RESUME
  ========================= */

  ["mouseenter", "mousedown", "touchstart"].forEach(evt => {
    scroll.addEventListener(evt, () => {
      isPaused = true;
    });
  });

  ["mouseleave", "mouseup", "touchend"].forEach(evt => {
    scroll.addEventListener(evt, () => {
      isPaused = false;
    });
  });

  /* =========================
     LIGHTBOX SETUP
  ========================= */

  if (!lightbox) {
    console.warn("⚠️ Lightbox not found (skipping)");
    return;
  }

  let lightboxImg = lightbox.querySelector("img");

  if (!lightboxImg) {
    lightboxImg = document.createElement("img");
    lightbox.appendChild(lightboxImg);
  }

  const repairImages = document.querySelectorAll(
    "#recent-repairs .repair-card img"
  );

  let currentIndex = 0;

  /* =========================
     OPEN LIGHTBOX
  ========================= */

  repairImages.forEach((img, index) => {
    img.addEventListener("click", (e) => {
      e.stopPropagation();

      currentIndex = index;
      isPaused = true;

      lightbox.style.display = "flex";
      lightboxImg.src = img.src;
    });
  });

  /* =========================
     ARROWS
  ========================= */

  const leftArrow = document.querySelector(".lightbox-arrow.left");
  const rightArrow = document.querySelector(".lightbox-arrow.right");

  function showImage(index) {
    lightboxImg.src = repairImages[index].src;
  }

  if (leftArrow) {
    leftArrow.addEventListener("click", (e) => {
      e.stopPropagation();

      currentIndex =
        (currentIndex - 1 + repairImages.length) %
        repairImages.length;

      showImage(currentIndex);
    });
  }

  if (rightArrow) {
    rightArrow.addEventListener("click", (e) => {
      e.stopPropagation();

      currentIndex =
        (currentIndex + 1) %
        repairImages.length;

      showImage(currentIndex);
    });
  }

  /* =========================
     CLOSE BUTTON
  ========================= */

  const closeBtn = document.querySelector(".lightbox-close");

  if (closeBtn) {
    closeBtn.onclick = () => {
      lightbox.style.display = "none";
      isPaused = false;
    };
  }

  /* =========================
     CLICK OUTSIDE CLOSE
  ========================= */

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      lightbox.style.display = "none";
      isPaused = false;
    }
  });

});