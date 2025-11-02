// Año dinámico si lo usas en el footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Inicia AOS para reveals suaves
window.addEventListener('load', () => {
  if (window.AOS) AOS.init({ offset: 80, duration: 700, easing: 'ease-out-cubic', once: true });
});

// Scroll suave adicional si el navegador no respeta scroll-behavior
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Animación “stack” con GSAP + ScrollTrigger
// Cada frame aparece y se queda un rato mientras scrolleas
function initStack() {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const frames = gsap.utils.toArray('.stack .frame');
  // Distribuye frames en profundidad para que no se monten mal
  frames.forEach((f, i) => f.style.zIndex = 100 - i);

  // Timeline que va “pegando” y revelando los frames en secuencia
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.stack',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      pin: '.stack-inner',
      anticipatePin: 1
    }
  });

  frames.forEach((frame, i) => {
    tl.to(frame, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }, i * 0.6);
    // Al avanzar, deja el frame un rato y luego desvanece un poco para que el siguiente brille
    tl.to(frame, { opacity: 0.35, duration: 0.5, ease: 'power2.out' }, i * 0.6 + 0.45);
  });

  // Mantén el último bien visible al final
  if (frames.length) {
    tl.to(frames[frames.length - 1], { opacity: 1, duration: 0.3 }, '>');
  }
}

window.addEventListener('load', initStack);

// Accesibilidad: si el usuario prefiere menos movimiento, reduce animaciones
try {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (media.matches) {
    document.documentElement.classList.add('reduced-motion');
    // Desactiva ScrollTrigger si es necesario
    if (window.ScrollTrigger) ScrollTrigger.killAll();
  }
} catch {}
// AOS ya lo inicializamos en load en la versión anterior.
// GSAP: entra foto e info desde lados opuestos
window.addEventListener('load', () => {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll('.show-feature').forEach((block) => {
    const photo = block.querySelector('.photo');
    const info  = block.querySelector('.info');
    const right = block.classList.contains('right');

    gsap.fromTo(photo, { x: right ? 60 : -60, opacity: 0 }, {
      x: 0, opacity: 1, duration: 0.6, ease: 'power2.out',
      scrollTrigger: { trigger: block, start: 'top 80%', toggleActions: 'play none none reverse' }
    });

    gsap.fromTo(info, { x: right ? -60 : 60, opacity: 0 }, {
      x: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.08,
      scrollTrigger: { trigger: block, start: 'top 80%', toggleActions: 'play none none reverse' }
    });
  });

  // Mini-galerías: fade-in con pequeño stagger
  document.querySelectorAll('.show-gallery').forEach((gal) => {
    const items = gal.querySelectorAll('a');
    gsap.fromTo(items, { y: 16, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.4, ease: 'power2.out', stagger: 0.08,
      scrollTrigger: { trigger: gal, start: 'top 85%', toggleActions: 'play none none reverse' }
    });
  });
});
