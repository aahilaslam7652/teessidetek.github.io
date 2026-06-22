console.log("✅ Recent repairs JS loaded");

document.addEventListener("DOMContentLoaded", () => {

  const scroll = document.querySelector("#recent-repairs .repairs-scroll");
  const lightbox = document.getElementById("lightbox");

  let autoScroll;
  let currentIndex = 0;

  /* =========================
     AUTO SCROLL
  ========================= */

  function startAutoScroll() {
    if (!scroll) return;

    autoScroll = setInterval(() => {
      const maxScroll = scroll.scrollWidth - scroll.clientWidth;

      if (scroll.scrollLeft >= maxScroll) {
        scroll.scrollLeft = 0;
      } else {
        scroll.scrollLeft += 2;
      }
    }, 16);
  }

  function stopAutoScroll() {
    clearInterval(autoScroll);
  }

  if (scroll) {
    startAutoScroll();

    scroll.addEventListener("mouseenter", stopAutoScroll);
    scroll.addEventListener("mouseleave", startAutoScroll);
    scroll.addEventListener("mousedown", stopAutoScroll);
  }

  /* =========================
     LIGHTBOX SETUP
  ========================= */

  if (!lightbox) {
    console.error("❌ Lightbox missing");
    return;
  }

  let lightboxImg = lightbox.querySelector("img");

  if (!lightboxImg) {
    lightboxImg = document.createElement("img");
    lightbox.appendChild(lightboxImg);
  }

  const repairImages = document.querySelectorAll("#recent-repairs .repair-card img");

  console.log("✅ Images found:", repairImages.length);

  /* =========================
     OPEN LIGHTBOX
  ========================= */

  repairImages.forEach((img, index) => {

    img.addEventListener("click", (e) => {
      e.stopPropagation();

      currentIndex = index; // ✅ track index

      stopAutoScroll();

      lightbox.style.display = "flex";
      lightboxImg.src = img.src;
    });

  });

  /* =========================
     ARROWS (NOW WORKING)
  ========================= */

  const leftArrow = document.querySelector(".lightbox-arrow.left");
  const rightArrow = document.querySelector(".lightbox-arrow.right");

  function showImage(index) {
    lightboxImg.src = repairImages[index].src;
  }

  if (leftArrow) {
    leftArrow.addEventListener("click", (e) => {
      e.stopPropagation();

      currentIndex = (currentIndex - 1 + repairImages.length) % repairImages.length;
      showImage(currentIndex);
    });
  }

  if (rightArrow) {
    rightArrow.addEventListener("click", (e) => {
      e.stopPropagation();

      currentIndex = (currentIndex + 1) % repairImages.length;
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
      startAutoScroll();
    };
  }

  /* =========================
     CLICK OUTSIDE CLOSE
  ========================= */

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      lightbox.style.display = "none";
      startAutoScroll();
    }
  });

});