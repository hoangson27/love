// Smooth scrolling variables
let currentSection = 0;
const totalSections = 6;
let isScrolling = false;
let noButtonClickCount = 0;

// TRENDING: Enhanced variables
let viralModeActive = false;
let lastNoButtonPosition = { x: 0, y: 0 };
const trendingMessages = [
  "🙅‍♀️ Ơ kìa, không nha anh ơi!",
  "😳 Anh nói gì lạ vậy trời...",
  "🏃‍♀️ Em chạy trước đây!",
  "🤔 Anh nghiêm túc đó hả?",
  "😅 Em ngại quá à...",
  "😶 Anh làm tim em loạn rồi này...",
  "🥺 Em... không biết nói sao luôn...",
  "❤️ Thật ra... em cũng thích anh từ lâu rồi!",
  "💖 Em đồng ý làm người yêu anh!",
];

// Loading screen
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loadingOverlay").classList.add("hidden");
    showViralHint();
  }, 2000);
});

// TRENDING: Show viral hint
function showViralHint() {
  const viralHint = document.getElementById("viralHint");
  setTimeout(() => {
    viralHint.classList.add("show");
    setTimeout(() => {
      viralHint.classList.remove("show");
    }, 3000);
  }, 1000);
}

// Enhanced smooth scrolling
function scrollToSection(index, duration = 800) {
  if (isScrolling || index < 0 || index >= totalSections) return;

  isScrolling = true;
  currentSection = index;

  const wrapper = document.getElementById("sectionsWrapper");
  const targetY = -index * 100;

  // Smooth animation using requestAnimationFrame
  const startTime = performance.now();
  const startY =
    parseFloat(
      wrapper.style.transform.replace("translateY(", "").replace("vh)", "")
    ) || 0;

  function animate(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function for smooth animation
    const easeOutCubic = 1 - Math.pow(1 - progress, 3);
    const currentY = startY + (targetY - startY) * easeOutCubic;

    wrapper.style.transform = `translateY(${currentY}vh)`;

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      isScrolling = false;
      updateVisibleSection();
    }
  }

  requestAnimationFrame(animate);
}

function nextSection() {
  if (currentSection < totalSections - 1) {
    scrollToSection(currentSection + 1);
  }
}

function prevSection() {
  if (currentSection > 0) {
    scrollToSection(currentSection - 1);
  }
}

function updateVisibleSection() {
  const sections = document.querySelectorAll(".section");
  sections.forEach((section, index) => {
    if (index === currentSection) {
      section.classList.add("visible");

      // Animate promise cards
      if (section.id === "section-4") {
        const promiseCards = section.querySelectorAll(".promise-card");
        promiseCards.forEach((card, cardIndex) => {
          setTimeout(() => {
            card.classList.add("visible");
          }, cardIndex * 200);
        });
      }

      // Show viral hint when reaching final section
      if (section.id === "section-5" && !viralModeActive) {
        viralModeActive = true;
        setTimeout(showViralHint, 500);
      }
    } else {
      section.classList.remove("visible");
    }
  });
}

// Enhanced wheel scrolling
let scrollTimeout;
document.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();

    if (isScrolling) return;

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      if (e.deltaY > 0) {
        nextSection();
      } else {
        prevSection();
      }
    }, 50);
  },
  { passive: false }
);

// Enhanced touch support for mobile
let touchStartY = 0;
let touchEndY = 0;
let touchStartTime = 0;

document.addEventListener(
  "touchstart",
  (e) => {
    touchStartY = e.changedTouches[0].screenY;
    touchStartTime = Date.now();
  },
  { passive: true }
);

document.addEventListener(
  "touchend",
  (e) => {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
  },
  { passive: true }
);

function handleSwipe() {
  if (isScrolling) return;

  const swipeThreshold = 50;
  const timeThreshold = 500; // Maximum swipe time
  const diff = touchStartY - touchEndY;
  const timeDiff = Date.now() - touchStartTime;

  if (Math.abs(diff) > swipeThreshold && timeDiff < timeThreshold) {
    if (diff > 0) {
      nextSection();
    } else {
      prevSection();
    }
  }
}

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (isScrolling) return;

  switch (e.key) {
    case "ArrowDown":
    case " ":
      e.preventDefault();
      nextSection();
      break;
    case "ArrowUp":
      e.preventDefault();
      prevSection();
      break;
    case "Home":
      e.preventDefault();
      scrollToSection(0);
      break;
    case "End":
      e.preventDefault();
      scrollToSection(totalSections - 1);
      break;
  }
});

// Particle system
function createParticle() {
  const particle = document.createElement("div");
  particle.className = "particle";
  particle.style.left = Math.random() * 100 + "%";
  particle.style.width = particle.style.height = Math.random() * 4 + 2 + "px";
  particle.style.animationDuration = Math.random() * 3 + 5 + "s";
  particle.style.animationDelay = Math.random() * 2 + "s";

  document.getElementById("particles").appendChild(particle);

  setTimeout(() => {
    particle.remove();
  }, 8000);
}

setInterval(createParticle, 300);

// TRENDING: Super Enhanced No Button with Viral Elements
function runAwayNoTrending(event) {
  event.preventDefault();

  const noButton = document.getElementById("noButton");
  const container = noButton.parentElement;
  const containerRect = container.getBoundingClientRect();
  const attemptCounter = document.getElementById("attemptCounter");

  noButtonClickCount++;
  // Cập nhật nền theo cảm xúc tăng dần
  document.body.style.background = `linear-gradient(to top, #ffe0e9, #ffffff ${Math.min(
    noButtonClickCount * 10,
    90
  )}%)`;
  // Haptic feedback simulation for mobile
  if (navigator.vibrate) {
    navigator.vibrate([50, 30, 50]);
  }

  // Update attempt counter
  attemptCounter.textContent = `Lần thử: ${noButtonClickCount}`;
  attemptCounter.classList.add("show");

  // Generate random position within safe bounds
  const buttonRect = noButton.getBoundingClientRect();
  const maxX = Math.min(
    containerRect.width - buttonRect.width,
    window.innerWidth - buttonRect.width - 40
  );
  const maxY = Math.min(
    containerRect.height - buttonRect.height,
    window.innerHeight - buttonRect.height - 40
  );

  const randomX = (Math.random() - 0.5) * maxX * 0.9;
  const randomY = (Math.random() - 0.5) * maxY * 0.9;
  const randomRotate = (Math.random() - 0.5) * 30;

  // Set CSS variables for animation
  noButton.style.setProperty("--escape-x", randomX + "px");
  noButton.style.setProperty("--escape-y", randomY + "px");
  noButton.style.setProperty("--escape-rotate", randomRotate + "deg");

  // Add different animations based on attempt count
  noButton.classList.remove("running", "shake", "pulse", "flip");

  if (noButtonClickCount % 4 === 1) {
    noButton.classList.add("shake");
  } else if (noButtonClickCount % 4 === 2) {
    noButton.classList.add("pulse");
  } else if (noButtonClickCount % 4 === 3) {
    noButton.classList.add("flip");
  } else {
    noButton.classList.add("running");
  }

  // Change text with trending messages
  if (noButtonClickCount < trendingMessages.length) {
    noButton.innerHTML =
      trendingMessages[noButtonClickCount] +
      '<div class="attempt-counter show" id="attemptCounter">Lần thử: ' +
      noButtonClickCount +
      "</div>";
  }

  // Special effects for certain attempts
  if (noButtonClickCount === 3) {
    createMiniCelebration();
  } else if (noButtonClickCount === 5) {
    showViralHint();
  } else if (noButtonClickCount === 7) {
    createHeartRain();
  }

  // Auto agree after 8 attempts with special celebration
  if (noButtonClickCount >= trendingMessages.length - 1) {
    noButton.style.cursor = "default"; // không còn né tránh
    setTimeout(() => {
      createMegaCelebration();
      setTimeout(() => {
        handleAnswer("yes");
      }, 1000);
    }, 1000);
  }
  // Reset animation classes
  setTimeout(() => {
    noButton.classList.remove("running", "shake", "pulse", "flip");
  }, 800);
}

// TRENDING: Mini celebration for persistence
function createMiniCelebration() {
  const emojis = ["😂", "🤣", "😅", "🙈"];
  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      const emoji = document.createElement("div");
      emoji.className = "celebration-heart";
      emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      emoji.style.left = Math.random() * 100 + "%";
      emoji.style.top = "100%";
      emoji.style.fontSize = Math.random() * 10 + 20 + "px";
      emoji.style.animationDuration = "2s";

      document.body.appendChild(emoji);

      setTimeout(() => {
        emoji.remove();
      }, 2000);
    }, i * 100);
  }
}

// TRENDING: Heart rain effect
function createHeartRain() {
  const hearts = ["💖", "💕", "💗", "💓"];
  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      const heart = document.createElement("div");
      heart.className = "celebration-heart";
      heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      heart.style.left = Math.random() * 100 + "%";
      heart.style.top = "-50px";
      heart.style.fontSize = Math.random() * 15 + 15 + "px";
      heart.style.animationDuration = Math.random() * 1 + 2 + "s";

      document.body.appendChild(heart);

      setTimeout(() => {
        heart.remove();
      }, 3000);
    }, i * 150);
  }
}

// TRENDING: Mega celebration for final surrender
function createMegaCelebration() {
  const emojis = ["🎉", "🎊", "🥳", "🎈", "🎁", "💖", "💕", "🌟", "✨", "🎆"];

  // Create multiple waves of celebration
  for (let wave = 0; wave < 5; wave++) {
    setTimeout(() => {
      for (let i = 0; i < 15; i++) {
        setTimeout(() => {
          const emoji = document.createElement("div");
          emoji.className = "celebration-heart";
          emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
          emoji.style.left = Math.random() * 100 + "%";
          emoji.style.top = "100%";
          emoji.style.fontSize = Math.random() * 20 + 20 + "px";
          emoji.style.animationDuration = Math.random() * 1 + 2.5 + "s";

          document.body.appendChild(emoji);

          setTimeout(() => {
            emoji.remove();
          }, 3500);
        }, i * 80);
      }
    }, wave * 400);
  }

  // Screen flash effect
  const flash = document.createElement("div");
  flash.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: radial-gradient(circle, rgba(255,107,107,0.6) 0%, transparent 70%);
                pointer-events: none; z-index: 9999;
                animation: flashEffect 1s ease-out;
            `;

  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 1000);
}

// Enhanced modal functions
function showModal(icon, title, text, showGift = false) {
  const modal = document.getElementById("modalOverlay");
  const modalIcon = document.getElementById("modalIcon");
  const modalTitle = document.getElementById("modalTitle");
  const modalText = document.getElementById("modalText");
  const giftContainer = document.getElementById("giftContainer");
  const modalButtons = document.getElementById("modalButtons");

  modalIcon.textContent = icon;
  modalTitle.textContent = title;
  modalText.textContent = text;

  if (showGift) {
    giftContainer.style.display = "flex";
    modalButtons.innerHTML =
      '<button class="modal-btn" onclick="closeModal()">Đóng</button>';
  } else {
    giftContainer.style.display = "none";
    modalButtons.innerHTML =
      '<button class="modal-btn" onclick="closeModal()">Đóng</button>';
  }

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const modal = document.getElementById("modalOverlay");
  modal.classList.remove("active");
  document.body.style.overflow = "auto";

  // Reset gift box
  const giftBox = document.getElementById("giftBox");
  const giftMessage = document.getElementById("giftMessage");
  giftBox.classList.remove("opening");
  giftMessage.classList.remove("visible");
}

// Enhanced gift box functionality
function openGift() {
  const giftBox = document.getElementById("giftBox");
  const giftMessage = document.getElementById("giftMessage");
  const giftSparkles = document.getElementById("giftSparkles");

  giftBox.classList.add("opening");

  // Haptic feedback
  if (navigator.vibrate) {
    navigator.vibrate([100, 50, 100]);
  }

  // Create sparkles with enhanced mobile support
  const sparkleCount = window.innerWidth < 768 ? 15 : 20;
  for (let i = 0; i < sparkleCount; i++) {
    setTimeout(() => {
      const sparkle = document.createElement("div");
      sparkle.className = "sparkle";
      sparkle.textContent = "✨";
      sparkle.style.left = Math.random() * 100 + "%";
      sparkle.style.top = Math.random() * 100 + "%";
      sparkle.style.animationDelay = Math.random() * 0.5 + "s";
      giftSparkles.appendChild(sparkle);

      setTimeout(() => {
        sparkle.remove();
      }, 2000);
    }, i * 100);
  }

  // Show message after animation
  setTimeout(() => {
    giftMessage.classList.add("visible");
  }, 800);
}

// Answer handling
function handleAnswer(answer) {
  if (answer === "yes") {
    createAdvancedCelebration();
    setTimeout(() => {
      showModal(
        "💖",
        "Cảm ơn em đã đồng ý!",
        "Anh hạnh phúc lắm! Anh có một món quà đặc biệt dành cho em. Hãy nhấn vào hộp quà để mở nhé! 🎁",
        true
      );
    }, 1000);
  }
}

// Enhanced celebration effect with mobile optimization
function createAdvancedCelebration() {
  const emojis = [
    "💖",
    "💕",
    "💗",
    "💓",
    "💝",
    "💘",
    "🌹",
    "✨",
    "🎉",
    "🎊",
    "💐",
    "🌺",
    "🦋",
    "🌟",
  ];
  const isMobile = window.innerWidth < 768;
  const waveCount = isMobile ? 3 : 4;
  const heartsPerWave = isMobile ? 15 : 25;

  // Haptic feedback for success
  if (navigator.vibrate) {
    navigator.vibrate([200, 100, 200, 100, 200]);
  }

  // Create multiple waves
  for (let wave = 0; wave < waveCount; wave++) {
    setTimeout(() => {
      for (let i = 0; i < heartsPerWave; i++) {
        setTimeout(() => {
          const heart = document.createElement("div");
          heart.className = "celebration-heart";
          heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
          heart.style.left = Math.random() * 100 + "%";
          heart.style.top = "100%";
          heart.style.fontSize = Math.random() * 10 + 15 + "px";
          heart.style.animationDelay = Math.random() * 0.5 + "s";
          heart.style.animationDuration = Math.random() * 1 + 2.5 + "s";

          document.body.appendChild(heart);

          setTimeout(() => {
            heart.remove();
          }, 3500);
        }, i * 80);
      }
    }, wave * 600);
  }

  // Screen flash effect
  const flash = document.createElement("div");
  flash.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: radial-gradient(circle, rgba(255,107,107,0.4) 0%, transparent 70%);
                pointer-events: none; z-index: 9999;
                animation: flashEffect 0.8s ease-out;
            `;

  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 800);
}

// Close modal on outside click
document.getElementById("modalOverlay").addEventListener("click", (e) => {
  if (e.target.id === "modalOverlay") {
    closeModal();
  }
});

// Close modal with Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
  }
});

// Prevent zoom on double tap for mobile
let lastTouchEnd = 0;
document.addEventListener(
  "touchend",
  function (event) {
    const now = new Date().getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  },
  false
);

// Optimize performance for mobile
if (window.innerWidth < 768) {
  // Reduce particle frequency on mobile
  setInterval(createParticle, 500);
}

// Handle orientation change
window.addEventListener("orientationchange", function () {
  setTimeout(() => {
    // Recalculate dimensions after orientation change
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }, 100);
});

// Set initial viewport height for mobile
const vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty("--vh", `${vh}px`);

// Handle window resize
window.addEventListener("resize", () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
});
