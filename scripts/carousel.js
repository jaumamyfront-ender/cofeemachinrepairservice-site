// ================== Настройки ==================
const IMAGES = [
  // Поставьте свои URL или локальные пути. Для примера — Picsum/Unsplash.
  "./../images/carouselimages/itemOne.png",
  "./../images/carouselimages/itemSecond.png",
  "./../images/carouselimages/itemThird.png",
  "./../images/carouselimages/itemFour.jpg",
  "./../images/carouselimages/itemFive.jpg",
];

const AUTOPLAY_MS = 3000; // интервалы автопрокрутки
const track = document.getElementById("track");
const viewport = document.getElementById("viewport");
const btnPrev = document.getElementById("prev");
const btnNext = document.getElementById("next");

// ====== Рендер слайдов ======
function createSlide(src, idx) {
  const slide = document.createElement("div");
  slide.className = "slide";
  slide.setAttribute("role", "button");
  slide.setAttribute("aria-label", `Открыть изображение ${idx + 1}`);

  const img = document.createElement("img");
  img.src = src;
  img.loading = "lazy";
  img.alt = `Изображение ${idx + 1}`;

  slide.appendChild(img);
  // Клик для открытия лайтбокса
  slide.addEventListener("click", () => openLightbox(src));

  return slide;
}

// Инициализация: добавляем все слайды в трек
IMAGES.forEach((src, i) => track.appendChild(createSlide(src, i)));

// Клонируем первые n слайдов, чтобы сделать бесконечную прокрутку
function visibleCount() {
  // вычисляем количество видимых кадров исходя из CSS-переменной
  const rootStyles = getComputedStyle(document.documentElement);
  return parseInt(rootStyles.getPropertyValue("--visible")) || 5;
}

function ensureClones() {
  const n = visibleCount();
  // удалим старые клоны
  Array.from(track.querySelectorAll(".slide.clone")).forEach((el) =>
    el.remove()
  );
  for (let i = 0; i < n; i++) {
    const clone = createSlide(IMAGES[i % IMAGES.length], i);
    clone.classList.add("clone");
    track.appendChild(clone);
  }
}

ensureClones();
window.addEventListener("resize", () => ensureClones());

// ====== Логика сдвига =====
let index = 0;
let isAnimating = false;
let autoplayId = null;

function slideWidth() {
  // ширина первого слайда (все одинаковые)
  const first = track.querySelector(".slide");
  return first ? first.getBoundingClientRect().width : 0;
}

function goToIndex(newIndex) {
  if (isAnimating) return;
  isAnimating = true;
  index = newIndex;
  const dx = -(slideWidth() + gapPx()) * index;
  track.style.transition = `transform var(--transition-ms) ease`;
  track.style.transform = `translate3d(${dx}px,0,0)`;
}

function gapPx() {
  const s = getComputedStyle(track);
  return parseFloat(s.gap) || 0;
}

function next() {
  goToIndex(index + 1);
}
function prev() {
  if (index === 0) {
    // перескакиваем к концу без анимации
    const n = IMAGES.length;
    const w = slideWidth() + gapPx();
    track.style.transition = "none";
    track.style.transform = `translate3d(${-(w * n)}px,0,0)`;
    index = n - 1;
    // в следующем кадре включим анимацию и поедем назад
    requestAnimationFrame(() => requestAnimationFrame(() => goToIndex(index)));
  } else {
    goToIndex(index - 1);
  }
}

track.addEventListener("transitionend", () => {
  const n = IMAGES.length;
  const vis = visibleCount();
  if (index >= n) {
    // Дошли до клонов: прыгаем в начало без анимации
    track.style.transition = "none";
    index = 0;
    const dx = -(slideWidth() + gapPx()) * index;
    track.style.transform = `translate3d(${dx}px,0,0)`;
  }
  isAnimating = false;
});

// Кнопки
btnNext.addEventListener("click", () => {
  stopAutoplay();
  next();
});
btnPrev.addEventListener("click", () => {
  stopAutoplay();
  prev();
});

// Автопрокрутка
function startAutoplay() {
  if (autoplayId) return;
  autoplayId = setInterval(() => next(), AUTOPLAY_MS);
}
function stopAutoplay() {
  clearInterval(autoplayId);
  autoplayId = null;
}

// Останавливаем на ховер/фокус, возобновляем при уходе
[viewport, btnNext, btnPrev].forEach((el) => {
  el.addEventListener("mouseenter", stopAutoplay);
  el.addEventListener("mouseleave", startAutoplay);
  el.addEventListener("focusin", stopAutoplay);
  el.addEventListener("focusout", startAutoplay);
});

// Стартовое положение
goToIndex(0);
startAutoplay();

// ====== Лайтбокс ======
const lb = document.getElementById("lightbox");
const lbImg = document.getElementById("lightboxImg");
const lbClose = document.getElementById("closeLb");

function openLightbox(src) {
  lbImg.src = src;
  lb.classList.add("open");
  lb.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeLightbox() {
  lb.classList.remove("open");
  lb.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  // Чтобы очистить src и принудительно перезагрузить на следующее открытие (по желанию):
  // lbImg.src = '';
}

lbClose.addEventListener("click", closeLightbox);
lb.addEventListener("click", (e) => {
  // Закрываем при клике на затемнение (но не по самому изображению)
  if (e.target === lb) closeLightbox();
});
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowRight") {
    stopAutoplay();
    next();
  }
  if (e.key === "ArrowLeft") {
    stopAutoplay();
    prev();
  }
});

// ====== Свайп для мобильных ======
let touchStartX = 0;
viewport.addEventListener(
  "touchstart",
  (e) => {
    touchStartX = e.changedTouches[0].clientX;
    stopAutoplay();
  },
  { passive: true }
);
viewport.addEventListener("touchend", (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 40) {
    if (dx < 0) next();
    else prev();
  } else {
    startAutoplay();
  }
});
