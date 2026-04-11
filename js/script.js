// ══════════════════════════════════════════════════
// MENU MOBILE
// ══════════════════════════════════════════════════
const menuToggle = document.getElementById('menu-toggle');
const nav = document.getElementById('nav');

menuToggle?.addEventListener('click', () => {
  nav.classList.toggle('active');
  menuToggle.innerText = nav.classList.contains('active') ? '✕' : '☰';
});

nav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('active');
    menuToggle.innerText = '☰';
  });
});

// ══════════════════════════════════════════════════
// HEADER SCROLL
// ══════════════════════════════════════════════════
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  header?.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ══════════════════════════════════════════════════
// FADE IN AL HACER SCROLL
// ══════════════════════════════════════════════════
const fadeEls = document.querySelectorAll('.fade-in');
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeEls.forEach(el => fadeObserver.observe(el));

// ══════════════════════════════════════════════════
// VIDEOS — HOVER en desktop / SCROLL en móvil
// ══════════════════════════════════════════════════
const isMobile = window.matchMedia('(hover: none)').matches;

document.querySelectorAll('.producto-img-wrap').forEach(wrap => {
  const video = wrap.querySelector('video');
  if (!video) return;

  if (!isMobile) {
    wrap.addEventListener('mouseenter', () => {
      if (video.dataset.src) {
        video.src = video.dataset.src;
        delete video.dataset.src;
      }
      video.play().catch(() => {});
      wrap.classList.add('playing');
    });

    wrap.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
      wrap.classList.remove('playing');
    });

  } else {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (video.dataset.src) {
          video.src = video.dataset.src;
          delete video.dataset.src;
        }
        video.play().catch(() => {});
        wrap.classList.add('playing');
      } else {
        video.pause();
        wrap.classList.remove('playing');
      }
    }, { threshold: 0.4 });

    observer.observe(wrap);
  }
});

// ══════════════════════════════════════════════════
// MODAL — VIDEO o IMAGEN según la card
// ══════════════════════════════════════════════════
const modal = document.getElementById('videoModal');
const modalVideo = document.getElementById('modalVideo');
const modalImg = document.getElementById('modalImg');
const closeBtn = document.getElementById('videoModalClose');

document.querySelectorAll('.producto-card').forEach(card => {
  card.style.cursor = 'pointer';

  card.addEventListener('click', (e) => {
    if (e.target.closest('.btn-buy')) return;

    const wrap = card.querySelector('.producto-img-wrap');
    const video = wrap?.querySelector('video');
    const img = wrap?.querySelector('img');
    const nombre = card.querySelector('h4')?.innerText || '';
    const waBtn = modal.querySelector('.btn-whatsapp');

    if (waBtn) {
      waBtn.href = `https://wa.me/19792035376?text=${encodeURIComponent('Hi, interested in: ' + nombre)}`;
    }

    if (video) {
      // Card con video — mostrar video
      const src = video.src || video.dataset.src;
      if (!src) return;
      modalVideo.src = src;
      modalVideo.muted = true;
      modalVideo.style.display = 'block';
      if (modalImg) modalImg.style.display = 'none';
      modalVideo.play().catch(() => {});
    } else if (img) {
      // Card solo con imagen — mostrar imagen
      modalVideo.pause();
      modalVideo.src = '';
      modalVideo.style.display = 'none';
      if (modalImg) {
        modalImg.src = img.src;
        modalImg.style.display = 'block';
      }
    }

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  });
});

function cerrarModal() {
  modal?.classList.remove('show');
  if (modalVideo) { modalVideo.pause(); modalVideo.src = ''; }
  document.body.style.overflow = 'auto';
}

closeBtn?.addEventListener('click', cerrarModal);
modal?.addEventListener('click', (e) => { if (e.target === modal) cerrarModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrarModal(); });

// ══════════════════════════════════════════════════
// FILTROS
// ══════════════════════════════════════════════════
document.querySelectorAll('.filtro-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filtro = btn.dataset.filtro;

    document.querySelectorAll('.producto-card').forEach(card => {
      card.classList.toggle('hidden', filtro !== 'all' && card.dataset.categoria !== filtro);
    });

    document.querySelectorAll('.section-divider').forEach(div => {
      div.classList.toggle('hidden', filtro !== 'all' && div.dataset.categoria !== filtro);
    });
  });
});

// ══════════════════════════════════════════════════
// WHATSAPP DINÁMICO
// ══════════════════════════════════════════════════
document.querySelectorAll('.btn-buy').forEach(btn => {
  const nombre = btn.closest('.producto-card')?.querySelector('h4')?.innerText || 'a product';
  btn.href = `https://wa.me/19792035376?text=${encodeURIComponent('Hi, interested in: ' + nombre)}`;
  btn.target = '_blank';
});

// ══════════════════════════════════════════════════
// Deshabilitar clic derecho en videos e imágenes
// ══════════════════════════════════════════════════
document.querySelectorAll('video, .producto-img-wrap img').forEach(el => {
  el.addEventListener('contextmenu', e => e.preventDefault());
});