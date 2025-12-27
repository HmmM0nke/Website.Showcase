document.addEventListener("DOMContentLoaded", () => {

// ------------------------
// FADE-IN CARDS + WATER HERO
// ------------------------
const cards = document.querySelectorAll(".fade-in-card");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const card = entry.target;
    const waves = card.querySelector(".waves");
    const waterBase = card.querySelector(".water-base");

    if(entry.isIntersecting) {
      card.classList.add("visible");
      card.classList.add("active"); // for water hero

      if (waves) {
        waves.style.transition = "bottom 3s ease-out";
        waves.style.bottom = "70%"; // waves rise
      }

      if (waterBase) {
        waterBase.style.transition = "bottom 3s ease-out";
        waterBase.style.bottom = "-10%"; // water rises under waves
      }

    } else {
      card.classList.remove("visible");

      if (waves) {
        waves.style.bottom = "-100%"; // reset waves
      }

      if (waterBase) {
        waterBase.style.bottom = "-100%"; // reset water base
      }
    }
  });
}, { threshold: 0.3 });

cards.forEach(card => observer.observe(card));


  // ------------------------
  // READ MORE BUTTON
  // ------------------------
  document.querySelectorAll(".toggle-more").forEach(button => {
    button.addEventListener("click", () => {
      const moreText = button.previousElementSibling;
      const isOpen = moreText.classList.contains("open");

      if (!isOpen) {
        // OPEN
        moreText.classList.add("open");
        const fullHeight = moreText.scrollHeight;
        moreText.style.height = fullHeight + "px";
        button.textContent = "Read less";
      } else {
        // CLOSE
        moreText.style.height = moreText.scrollHeight + "px";
        requestAnimationFrame(() => {
          moreText.style.height = "0px";
          moreText.classList.remove("open");
        });
        button.textContent = "Read more";
      }
    });
  });


  // ------------------------
  // LIGHTBOX HERO + BIO
  // ------------------------
  const lightbox = document.createElement("div");
  lightbox.className = "hero-lightbox";
  const lightboxImg = document.createElement("img");
  lightbox.appendChild(lightboxImg);
  document.body.appendChild(lightbox);

  function closeLightbox() {
    lightbox.classList.remove("active");
    lightboxImg.src = "";
  }

  document.querySelectorAll(".hero-img, .bio-image img").forEach(img => {
    img.addEventListener("click", () => {
      lightboxImg.src = img.src;
      lightbox.classList.add("active");
    });
  });

  lightbox.addEventListener("click", closeLightbox);

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && lightbox.classList.contains("active")) {
      closeLightbox();
    }
  });


  // ------------------------
  // NYAN CAT + RAINBOW HERO2
  // ------------------------
  const heroCards = document.querySelectorAll(".hero-card");
  const hero2Card = heroCards[1]; // second hero card
  if(hero2Card) {
    const nyan = hero2Card.querySelector(".nyan-cat-gif");
    const rainbow = hero2Card.querySelector(".rainbow-gif");
    let played = false;

    const nyanObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting && !played) {
          played = true;
          const cardWidth = hero2Card.offsetWidth;
          const nyanWidth = nyan.offsetWidth;
          const distance = cardWidth + nyanWidth;

          nyan.style.left = `${cardWidth}px`;
          rainbow.style.left = `${cardWidth}px`;

          nyan.animate(
            [{ transform: "translateY(-50%) translateX(0)" }, 
             { transform: `translateY(-50%) translateX(-${distance}px)` }],
            { duration: 3000, easing: "linear", fill: "forwards" }
          );

          rainbow.animate(
            [{ transform: "translateY(-50%) translateX(0)" }, 
             { transform: `translateY(-50%) translateX(-${distance}px)` }],
            { duration: 0, easing: "linear", fill: "forwards" }
          );
        }

        if(!entry.isIntersecting) {
          played = false;
          nyan.style.transform = "translateY(-50%) translateX(0)";
          rainbow.style.transform = "translateY(-50%) translateX(0)";
        }
      });
    }, { threshold: 0.5 });

    nyanObserver.observe(hero2Card);
  }


  // ------------------------
  // SCRATCH CANVAS
  // ------------------------
  const canvas = document.getElementById('scratchCanvas');
  if(canvas) {
    const ctx = canvas.getContext('2d');
    const topImage = new Image();
    const bottomImage = new Image();
    topImage.src = 'assets/images/uhm.png';
    bottomImage.src = 'assets/images/yay.png';
    let isDrawing = false;
    let lastX, lastY;

    topImage.onload = () => {
      canvas.width = 1000;
      canvas.height = 600;
      ctx.drawImage(topImage, 0, 0, canvas.width, canvas.height);
    };

    function getMousePos(canvas, e) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
    }

    canvas.addEventListener('mousedown', e => {
      isDrawing = true;
      const pos = getMousePos(canvas, e);
      lastX = pos.x;
      lastY = pos.y;
    });

    canvas.addEventListener('mousemove', e => {
      if(!isDrawing) return;
      const pos = getMousePos(canvas, e);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
      ctx.lineWidth = 50;
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      lastX = pos.x;
      lastY = pos.y;
    });

    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mouseleave', () => isDrawing = false);

    function updateCanvasBackground() {
      ctx.globalCompositeOperation = 'destination-over';
      ctx.drawImage(bottomImage, 0, 0, canvas.width, canvas.height);
      requestAnimationFrame(updateCanvasBackground);
    }
    updateCanvasBackground();
  }


  // ------------------------
  // BACK TO TOP BUTTON
  // ------------------------
  const backToTopBtn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if(backToTopBtn) backToTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
  });
  if(backToTopBtn) backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  // ------------------------
  // MUSIC TOGGLE
  // ------------------------
  const audio = document.getElementById("bgMusic");
  const toggleBtn = document.getElementById("musicToggle");
  if(audio && toggleBtn) {
    audio.loop = true;
    audio.volume = 0.5;

    const savedTime = localStorage.getItem("musicTime");
    const isPaused = localStorage.getItem("musicPaused") === "true";
    if(savedTime) audio.currentTime = parseFloat(savedTime);

    let unlocked = false;
    function unlockAudio() {
      if(unlocked || isPaused) return;
      unlocked = true;
      audio.play().catch(()=>{});
    }
    document.addEventListener("click", unlockAudio, { once: true });
    document.addEventListener("keydown", unlockAudio, { once: true });

    toggleBtn.addEventListener("click", () => {
      if(audio.paused) {
        audio.play();
        toggleBtn.textContent = "⏸";
        localStorage.setItem("musicPaused","false");
      } else {
        audio.pause();
        toggleBtn.textContent = "▶";
        localStorage.setItem("musicPaused","true");
      }
    });

    toggleBtn.textContent = isPaused ? "▶" : "⏸";

    setInterval(() => {
      if(!audio.paused) localStorage.setItem("musicTime", audio.currentTime);
    }, 500);
  }

});
// CUSTOM CURSOR FOR HERO 3//
const hero3 = document.querySelector(".hero-card.water-hero");

// Create the custom cursor div
const customCursor = document.createElement("div");
customCursor.className = "custom-cursor";
document.body.appendChild(customCursor);

// Track mouse inside hero 3
hero3.addEventListener("mousemove", e => {
    customCursor.style.left = `${e.clientX}px`;
    customCursor.style.top = `${e.clientY}px`;
});

// Show/hide cursor and hide native cursor
hero3.addEventListener("mouseenter", () => {
    customCursor.style.display = "block";
    hero3.classList.add("hide-native-cursor");
});
hero3.addEventListener("mouseleave", () => {
    customCursor.style.display = "none";
    hero3.classList.remove("hide-native-cursor");
});

// Change cursor image over clickable items
const clickables = hero3.querySelectorAll("a, button, .hero-img.clickable");
clickables.forEach(item => {
    item.addEventListener("mouseenter", () => {
        customCursor.style.backgroundImage = "url('assets/images/FrutigerAeroPointer.png')";
    });
    item.addEventListener("mouseleave", () => {
        customCursor.style.backgroundImage = "url('assets/images/FrutigerAeroCursor.png')";
    });
});


const slidesContainer = document.querySelector(".slides");
const slides = document.querySelectorAll(".slides .hero-card");
let sliderIndex = 0;

const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

function showSlide(index) {
    sliderIndex = (index + slides.length) % slides.length;
    slidesContainer.style.transform = `translateX(-${sliderIndex * 100}%)`;
}

if(nextBtn) nextBtn.addEventListener("click", () => showSlide(sliderIndex + 1));
if(prevBtn) prevBtn.addEventListener("click", () => showSlide(sliderIndex - 1));




