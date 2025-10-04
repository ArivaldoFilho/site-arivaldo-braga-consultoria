// ==== CONFIGURAÇÕES RÁPIDAS ====
// Substitua pelo número oficial do WhatsApp (somente dígitos com DDI + DDD). Ex.: +5585987654321
const WHATSAPP_NUMBER = "+5598991170304";

// Texto padrão caso usuário não preencha a mensagem
const DEFAULT_MESSAGE = "Olá! Gostaria de falar sobre serviços de topografia/regularização.";

// ===== Utils =====
const encodeWA = (text) => encodeURIComponent(text).replace(/%20/g,'+');

const debounce = (fn, wait = 150) => {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn.apply(null, args), wait); };
};

// ==== UX helpers ====
const scrollToId = (id) => {
  const el = document.getElementById(id);
  if(el){ el.scrollIntoView({behavior:'smooth', block:'start'}); }
  closeMenu(); // fecha painel no mobile ao navegar
};

function buildMessage(name, service, message){
  const lines = [
    `Olá, sou ${name || 'cliente'}.`,
    `Tenho interesse em: ${service || 'Serviço imobiliário/engenharia'}.`,
    message && message.trim() ? `Mensagem: ${message.trim()}` : DEFAULT_MESSAGE
  ];
  return lines.filter(Boolean).join('\n');
}

function openWhatsApp(){
  const url = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g,'')}?text=${encodeWA(DEFAULT_MESSAGE)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

function sendWhatsApp(e){
  e.preventDefault();
  const form = e.target.closest('form');
  const name = form.querySelector('input[id^="nome"]')?.value || '';
  const serviceEl = form.querySelector('select[id^="servico"]');
  const service = serviceEl ? serviceEl.value : '';
  const msgEl = form.querySelector('textarea[id^="msg"]');
  const msg = msgEl ? msgEl.value : '';
  const finalMsg = buildMessage(name, service, msg);
  const url = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g,'')}?text=${encodeWA(finalMsg)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

// ===== Menu móvel acessível com scrim =====
const BREAKPOINT = 980;
const menuBtn = () => document.querySelector('.menu-btn');
const navList = () => document.getElementById('nav-list');
let scrimEl = null;

function ensureScrim(){
  if(!scrimEl){
    scrimEl = document.createElement('div');
    scrimEl.className = 'menu-scrim';
    document.body.appendChild(scrimEl);
    scrimEl.addEventListener('click', closeMenu);
  }
}

function toggleMenu(){
  const btn = menuBtn();
  const ul = navList();
  if(!btn || !ul) return;

  ensureScrim();
  const opening = !ul.classList.contains('is-open');
  ul.classList.toggle('is-open', opening);
  btn.setAttribute('aria-expanded', String(opening));
  document.body.classList.toggle('menu-open', opening);

  if(opening){
    // fecha ao clicar num link
    ul.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu, { once:true }));
    document.addEventListener('keydown', escHandler);
  }else{
    document.removeEventListener('keydown', escHandler);
  }
}

function closeMenu(){
  const btn = menuBtn();
  const ul = navList();
  if(!btn || !ul) return;
  if(ul.classList.contains('is-open')){
    ul.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }
}

function escHandler(e){ if(e.key === 'Escape') closeMenu(); }

// Recalibra ao redimensionar (volta para desktop)
const onResize = debounce(() => {
  const ul = navList();
  if(!ul) return;
  if(window.innerWidth > BREAKPOINT){
    ul.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    menuBtn()?.setAttribute('aria-expanded','false');
  }
}, 120);

window.addEventListener('resize', onResize);

// Header: classe "scrolled" para feedback visual
window.addEventListener('scroll', debounce(() => {
  if(window.scrollY > 2){ document.body.classList.add('scrolled'); }
  else { document.body.classList.remove('scrolled'); }
}, 50));

// Acessibilidade: foco visível ao navegar por teclado
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Tab') document.body.classList.add('show-focus');
});

// Ano atual + inicializações
document.addEventListener('DOMContentLoaded', ()=>{
  const y = document.getElementById('year');
  if(y) y.textContent = new Date().getFullYear();
  onResize();

  // ===== Scroll reveal (animações suaves) =====
  const revealSelectors = [
    '.hero-card','.hero-form','.section-title','.section-sub',
    '.card','.step','.testimonial','.cta-band'
  ];
  document.querySelectorAll(revealSelectors.join(',')).forEach((el, i) => {
    el.classList.add('reveal');
    el.dataset.delay = String(i % 3); // desfasagem sutil
  });

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('inview');
        io.unobserve(e.target);
      }
    });
  }, {threshold: .18, rootMargin: '0px 0px -40px 0px'});

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
});
