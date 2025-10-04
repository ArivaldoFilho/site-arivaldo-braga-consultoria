// ==== CONFIGURAÇÕES RÁPIDAS ====
// Substitua pelo número oficial do WhatsApp (somente dígitos com DDI + DDD). Ex.: +5585987654321
const WHATSAPP_NUMBER = "+5598991170304";

// Texto padrão caso usuário não preencha a mensagem
const DEFAULT_MESSAGE = "Olá! Gostaria de falar sobre serviços de topografia/regularização.";

// ===== Utilidades =====
const encodeWA = (text) => encodeURIComponent(text).replace(/%20/g,'+');

const debounce = (fn, wait = 150) => {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn.apply(null, args), wait); };
};

// ==== UX helpers ====
const scrollToId = (id) => {
  const el = document.getElementById(id);
  if(el){ el.scrollIntoView({behavior:'smooth', block:'start'}); }
  // fecha menu em navegação no mobile
  closeMenu();
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

// ===== Menu móvel acessível =====
const BREAKPOINT = 980; // deve espelhar o CSS
const menuBtn = () => document.querySelector('.menu-btn');
const navList = () => document.getElementById('nav-list');

function toggleMenu(){
  const btn = menuBtn();
  const ul = navList();
  if(!btn || !ul) return;

  const isHidden = getComputedStyle(ul).display === 'none';
  ul.style.display = isHidden ? 'flex' : 'none';
  btn.setAttribute('aria-expanded', String(isHidden));
  document.body.classList.toggle('menu-open', isHidden);

  // fecha ao clicar num link
  if(isHidden){
    ul.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeMenu, { once:true });
    });
    // clique fora
    document.addEventListener('click', clickOutsideHandler);
    // tecla ESC
    document.addEventListener('keydown', escHandler);
  }else{
    document.removeEventListener('click', clickOutsideHandler);
    document.removeEventListener('keydown', escHandler);
  }
}

function closeMenu(){
  const btn = menuBtn();
  const ul = navList();
  if(!btn || !ul) return;
  if(getComputedStyle(ul).display !== 'none'){
    ul.style.display = 'none';
    btn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    document.removeEventListener('click', clickOutsideHandler);
    document.removeEventListener('keydown', escHandler);
  }
}

function clickOutsideHandler(e){
  const ul = navList();
  const btn = menuBtn();
  if(!ul || !btn) return;
  const withinMenu = ul.contains(e.target) || btn.contains(e.target);
  if(!withinMenu) closeMenu();
}

function escHandler(e){
  if(e.key === 'Escape') closeMenu();
}

// Recalibra ao redimensionar (ex.: voltar do mobile para desktop)
const onResize = debounce(() => {
  const ul = navList();
  if(!ul) return;
  if(window.innerWidth > BREAKPOINT){
    ul.style.display = 'flex';
    document.body.classList.remove('menu-open');
    menuBtn()?.setAttribute('aria-expanded','false');
  }else{
    // em mobile, painel inicia fechado
    ul.style.display = 'none';
  }
}, 150);

window.addEventListener('resize', onResize);

// Acessibilidade: foco visível ao navegar por teclado
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Tab') document.body.classList.add('show-focus');
});

// Ano atual no footer
document.addEventListener('DOMContentLoaded', ()=>{
  const y = document.getElementById('year');
  if(y) y.textContent = new Date().getFullYear();
  // garante estado correto ao carregar
  onResize();
});
