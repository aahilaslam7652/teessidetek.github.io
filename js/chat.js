document.addEventListener("DOMContentLoaded", () => {
  const pill = document.getElementById("contactPill");
  const bubble = document.getElementById("chatBubble");
  const messageEl = document.getElementById("chatMessage");
  const buttons = document.querySelectorAll(".pill-btn");

  if (!pill || !bubble || !messageEl) return;

  /* =========================
     MESSAGE SYSTEM
  ========================= */
const messages = [
  "MacBook repair? We’ve got you covered 🍏",
  "Need a custom gaming PC built? 🎮",
  "Gaming PC running slow? Upgrade it today ⚡",
  "Gaming PC or laptop needs repair? 🔧",
  "Same-day repairs available ✅",
  "No fix, no fee — risk free 👍",
  "Message us now — we reply fast 💬"
];

  let msgIndex = 0;
  let messageInterval;

  /* =========================
     TYPING EFFECT
  ========================= */
  function showTypingThenMessage(newMessage) {
    messageEl.innerHTML = `
      <div class="typing">
        <span></span><span></span><span></span>
      </div>
    `;

    setTimeout(() => {
      messageEl.textContent = newMessage;
    }, 1200);
  }

  /* =========================
     SHOW INITIAL BUBBLE
  ========================= */
  setTimeout(() => {
    bubble.classList.add("show");
    showTypingThenMessage(messages[0]);
  }, 2500);

  /* =========================
     ROTATE MESSAGES
  ========================= */
  function startMessageRotation() {
    messageInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % messages.length;
      showTypingThenMessage(messages[msgIndex]);
    }, 5000);
  }

  startMessageRotation();

  /* =========================
     SCROLL BEHAVIOUR
  ========================= */
  let lastScroll = window.scrollY;

  window.addEventListener("scroll", () => {
    if (window.scrollY > lastScroll + 15) {
      // scrolling down
      pill.classList.add("hidden");
      bubble.classList.remove("show");

    } else {
      // scrolling up
      pill.classList.remove("hidden");
      bubble.classList.add("show");
    }

    lastScroll = window.scrollY;
  });

  /* =========================
     INTERACTION HANDLING
  ========================= */
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      bubble.classList.remove("show");

      // stop rotation after interaction (optional UX improvement)
      clearInterval(messageInterval);
    });
  });

  /* =========================
     SMART AUTO-HIDE
  ========================= */
  setTimeout(() => {
    bubble.classList.remove("show");
  }, 15000);

  /* =========================
     RE-SHOW ON RETURN (OPTIONAL)
  ========================= */
  document.addEventListener("mouseleave", () => {
    // if user moves mouse away from page → gently re-show
    setTimeout(() => {
      bubble.classList.add("show");
    }, 2000);
  });

});