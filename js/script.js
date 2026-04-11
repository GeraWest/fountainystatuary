// ══════════════════════════════════════════════════
// 🔥 FIX BACK/FORWARD CACHE
// ══════════════════════════════════════════════════
window.addEventListener("pageshow", () => {
  const cards = document.querySelectorAll('.producto-card');
  const dividers = document.querySelectorAll('.section-divider');
  cards.forEach(card => {
    card.classList.remove('hidden');
    card.classList.add('visible');
  });
  dividers.forEach(divider => {
    divider.classList.remove('hidden');
  });
  document.querySelectorAll('.filtro-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector('.filtro-btn[data-filtro="all"]')?.classList.add('active');
});

// ══════════════════════════════════════════════════
// 🔥 MENU MOBILE
// ══════════════════════════════════════════════════
const menuToggle = document.getElementById('menu-toggle');
const nav = document.getElementById('nav');
menuToggle?.addEventListener('click', () => {
  nav.classList.toggle('active');
  // Toggle icon between ☰ and ✕
  menuToggle.innerText = nav.classList.contains('active') ? '✕' : '☰';
});

// Close menu when a link is clicked
nav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('active');
    menuToggle.innerText = '☰';
  });
});

// ══════════════════════════════════════════════════
// 🔥 HEADER SCROLL & FADE-IN
// ══════════════════════════════════════════════════
const header = document.querySelector('.header');
const elementos = document.querySelectorAll('.fade-in');

const mostrarElemento = () => {
  const trigger = window.innerHeight * 0.85;
  elementos.forEach(el => {
    if (el.getBoundingClientRect().top < trigger) el.classList.add('show');
  });
};

let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      header?.classList.toggle('scrolled', window.scrollY > 50);
      mostrarElemento();
      if (esMobil()) autoplayPorScroll();
      ticking = false;
    });
    ticking = true;
  }
});

// ══════════════════════════════════════════════════
// 🔥 WHATSAPP MENSAJES DINÁMICOS
// ══════════════════════════════════════════════════
function configurarWhatsApp() {
  const WHATSAPP_NUM = "19792035376";
  const botonesBuy = document.querySelectorAll('.btn-buy');
  botonesBuy.forEach(btn => {
    const card = btn.closest('.producto-card');
    const productName = card?.querySelector('h4')?.innerText || "a product";
    const mensaje = encodeURIComponent(`Hi, I'd like to inquire about this piece: ${productName}`);
    btn.href = `https://wa.me/${WHATSAPP_NUM}?text=${mensaje}`;
    btn.target = "_blank";
  });
}

// ══════════════════════════════════════════════════
// 🔥 DETECCIÓN DE DISPOSITIVO & VIDEOS
// ══════════════════════════════════════════════════
function esMobil() { return window.matchMedia('(hover: none)').matches; }

function iniciarVideos() {
  document.querySelectorAll('.producto-img-wrap').forEach(wrap => {
    const video = wrap.querySelector('video');
    if (!video) return;
    if (esMobil()) configurarAutoplayMovil(wrap, video);
    else configurarHoverDesktop(wrap, video);
  });
}

function configurarHoverDesktop(wrap, video) {
  wrap.addEventListener('mouseenter', () => {
    cargarVideoSiNecesario(video);
    video.play().catch(() => {});
  });
  wrap.addEventListener('mouseleave', () => {
    video.pause();
    video.currentTime = 0;
  });
}

function configurarAutoplayMovil(wrap, video) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Delay to avoid saturation during fast scroll
        const playTimeout = setTimeout(() => {
          if (entry.isIntersecting) {
            cargarVideoSiNecesario(video);
            video.play()
              .then(() => wrap.classList.add('playing'))
              .catch(() => {});
          }
        }, 150);
        video.dataset.playTimeout = playTimeout;
      } else {
        clearTimeout(video.dataset.playTimeout);
        video.pause();
        wrap.classList.remove('playing');
      }
    });
  }, { 
    threshold: 0.1,
    rootMargin: '50px' // Start loading slightly before entering viewport
  });
  observer.observe(wrap);
}

function autoplayPorScroll() {
  if ('IntersectionObserver' in window) return;
  const vh = window.innerHeight;
  // Usar requestAnimationFrame para suavizar el scroll
  requestAnimationFrame(() => {
    document.querySelectorAll('.producto-img-wrap').forEach(wrap => {
      const video = wrap.querySelector('video');
      if (!video) return;
      const rect = wrap.getBoundingClientRect();
      const visible = rect.top < vh * 0.8 && rect.bottom > vh * 0.2;
      if (visible) {
        cargarVideoSiNecesario(video);
        video.play().then(() => wrap.classList.add('playing')).catch(() => {});
      } else {
        video.pause();
        wrap.classList.remove('playing');
      }
    });
  });
}

function cargarVideoSiNecesario(video) {
  if (video.dataset.src && !video.src) {
    // Hide poster once video starts playing to ensure clean transition
    video.addEventListener('playing', () => {
      video.removeAttribute('poster');
    }, { once: true });
    
    video.src = video.dataset.src;
    video.load();
  }
}

// ══════════════════════════════════════════════════
// 🔥 FILTROS
// ══════════════════════════════════════════════════
const filtrosBtns = document.querySelectorAll('.filtro-btn');
const productoCards = document.querySelectorAll('.producto-card');
const sectionDividers = document.querySelectorAll('.section-divider');

filtrosBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filtrosBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const filtro = btn.getAttribute('data-filtro');

    // Filtrar Cards
    productoCards.forEach(card => {
      const categoria = card.getAttribute('data-categoria');
      if (filtro === 'all' || categoria === filtro) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });

    // Filtrar Section Dividers
    sectionDividers.forEach(divider => {
      const categoria = divider.getAttribute('data-categoria');
      if (filtro === 'all' || categoria === filtro) {
        divider.classList.remove('hidden');
      } else {
        divider.classList.add('hidden');
      }
    });
  });
});

// ══════════════════════════════════════════════════
// 🔥 MODAL VIDEO (CLIC EN CARD -> VIDEO)
// ══════════════════════════════════════════════════
function activarModalVideos() {
  const modal = document.getElementById('videoModal');
  const modalVideo = document.getElementById('modalVideo');
  const closeBtn = document.getElementById('videoModalClose');

  document.querySelectorAll('.producto-card').forEach(card => {
    const wrap = card.querySelector('.producto-img-wrap');
    if (!wrap) return;

    card.style.cursor = 'pointer'; // Indicar que es clicable
    card.addEventListener('click', (e) => {
      // Don't open modal if clicking the WhatsApp button (Request Info)
      if (e.target.closest('.btn-buy')) return;

      const video = wrap.querySelector('video');
      if (!video) return;

      cargarVideoSiNecesario(video);
      modal.classList.add('show');
      modalVideo.src = video.src || video.dataset.src;
      modalVideo.muted = true; // Asegurar que el modal esté silenciado
      modalVideo.load();
      modalVideo.play().catch(() => {});
      document.body.style.overflow = 'hidden';
      
      const productName = card.querySelector('h4').innerText;
      const modalWhatsappBtn = modal.querySelector('.btn-whatsapp');
      if (modalWhatsappBtn) {
        modalWhatsappBtn.href = `https://wa.me/19792035376?text=${encodeURIComponent("Hi, I'm interested in this piece: " + productName)}`;
      }
    });
  });

  closeBtn?.addEventListener('click', cerrarModalVideo);
  modal?.addEventListener('click', (e) => { if (e.target === modal) cerrarModalVideo(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrarModalVideo(); });

  function cerrarModalVideo() {
    modal.classList.remove('show');
    modalVideo.pause();
    modalVideo.src = "";
    document.body.style.overflow = 'auto';
  }
}

// ══════════════════════════════════════════════════
// 🔥 INIT
// ══════════════════════════════════════════════════
window.addEventListener('load', () => {
  mostrarElemento();
  iniciarVideos();
  activarModalVideos();
  configurarWhatsApp();
  productoCards.forEach(card => {
    card.classList.remove('hidden');
    card.classList.add('visible');
  });
});
