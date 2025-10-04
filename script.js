// ==== CONFIGURAÇÕES RÁPIDAS ====
// Substitua pelo número oficial do WhatsApp (somente dígitos com DDI + DDD). Ex.: +5585987654321
const WHATSAPP_NUMBER = "+5598991170304";

// Texto padrão caso usuário não preencha a mensagem
const DEFAULT_MESSAGE = "Olá! Gostaria de falar sobre serviços de topografia/regularização.";

// ==== UX helpers ====
const scrollToId = (id) => {
  const el = document.getElementById(id);
  if(el){ el.scrollIntoView({behavior:'smooth', block:'start'}); }
}

const toggleMenu = () => {
  const ul = document.getElementById('nav-list');
  const visible = getComputedStyle(ul).display !== 'none';
  ul.style.display = visible ? 'none' : 'flex';
  ul.style.flexDirection = 'column';
  ul.style.gap = '12px';
  ul.style.marginTop = '12px';
  ul.style.background = 'rgba(15,23,48,.95)';
  ul.style.padding = '12px';
  ul.style.border = '1px solid rgba(59,130,246,.25)';
  ul.style.borderRadius = '12px';
}

const encodeWA = (text) => encodeURIComponent(text).replace(/%20/g,'+');

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
  window.open(url, '_blank');
}

function sendWhatsApp(e){
  e.preventDefault();
  const form = e.target.closest('form');
  const name = form.querySelector('input[id^="nome"]').value;
  const serviceEl = form.querySelector('select[id^="servico"]');
  const service = serviceEl ? serviceEl.value : '';
  const msgEl = form.querySelector('textarea[id^="msg"]');
  const msg = msgEl ? msgEl.value : '';
  const finalMsg = buildMessage(name, service, msg);
  const url = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g,'')}?text=${encodeWA(finalMsg)}`;
  window.open(url, '_blank');
}

// Acessibilidade: foco visível ao navegar por teclado
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Tab') document.body.classList.add('show-focus');
});

// Ano atual no footer
document.getElementById('year').textContent = new Date().getFullYear();
