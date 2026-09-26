const tabs = [...document.querySelectorAll('.tab')];
const panels = [...document.querySelectorAll('[role="tabpanel"]')];

function showTab(name) {
  tabs.forEach((tab) => {
    const selected = tab.dataset.tab === name;
    tab.classList.toggle('active', selected);
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  panels.forEach((panel) => {
    const selected = panel.id === name;
    panel.hidden = !selected;
    panel.classList.toggle('active', selected);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => showTab(tab.dataset.tab));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let nextIndex = index;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = tabs.length - 1;
    tabs[nextIndex].focus();
    showTab(tabs[nextIndex].dataset.tab);
  });
});

document.querySelectorAll('[data-go]').forEach((button) => {
  button.addEventListener('click', () => showTab(button.dataset.go));
});

const phrases = [
  'Qué bonito coincidir contigo en esta vida.',
  'Eres mi pensamiento favorito en los días normales.',
  'Contigo, hasta lo cotidiano tiene un poquito de magia.',
  'Si pudiera elegir un lugar, elegiría tu abrazo.',
  'Gracias por hacer que mi mundo se sienta más bonito.',
  'No necesito un día especial para celebrar que existes.'
];
const randomPhraseButton = document.getElementById('random-phrase');
const toast = document.getElementById('toast');
let toastTimer;

function announce(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}

randomPhraseButton.addEventListener('click', () => {
  const phrase = phrases[Math.floor(Math.random() * phrases.length)];
  announce(phrase);
  makeHeartBurst(8);
});

document.querySelectorAll('.phrase-card').forEach((card) => {
  card.addEventListener('click', async () => {
    const phrase = card.dataset.copy;
    try {
      await navigator.clipboard.writeText(phrase);
      announce('Frase copiada, guárdala cerquita ♡');
    } catch {
      announce(phrase);
    }
    const status = document.getElementById('copy-status');
    status.textContent = '♡ ' + phrase;
  });
});

const reasons = [
  'Porque tu existencia hace que todo tenga un poquito más de luz.',
  'Porque sabes convertir un momento simple en un recuerdo bonito.',
  'Porque tu forma de ser no se parece a ninguna otra.',
  'Porque hasta en silencio, contigo se siente bien.',
  'Porque el mundo es más amable cuando estás cerca.',
  'Porque siempre encuentro algo nuevo que admirar en ti.',
  'Porque tu risa merece ser patrimonio de mis días felices.',
  'Porque contigo puedo ser exactamente quien soy.',
  'Porque haces que un «¿cómo estás?» se sienta como un abrazo.',
  'Porque sí. Porque eres tú. Y eso ya es una razón enorme.'
];
let reasonIndex = 0;
document.getElementById('next-reason').addEventListener('click', () => {
  reasonIndex = (reasonIndex + 1) % reasons.length;
  const number = document.getElementById('reason-number');
  const text = document.getElementById('reason-text');
  number.textContent = String(reasonIndex + 1).padStart(2, '0');
  text.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 350, easing: 'ease-out' });
  text.textContent = reasons[reasonIndex];
  document.querySelectorAll('.reason-dots .dot').forEach((dot, index) => dot.classList.toggle('active', index === reasonIndex % 5));
});

const modal = document.getElementById('hug-modal');
const openModalButton = document.getElementById('open-surprise');
const closeModalButton = document.getElementById('close-surprise');
function openModal() {
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  closeModalButton.focus();
  makeHeartBurst(22);
}
function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  openModalButton.focus();
}
openModalButton.addEventListener('click', openModal);
closeModalButton.addEventListener('click', closeModal);
modal.addEventListener('click', (event) => {
  if (event.target === modal) closeModal();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.classList.contains('open')) closeModal();
});

function makeHeartBurst(amount) {
  const container = document.getElementById('heart-burst');
  const symbols = ['♥', '♡', '✦'];
  for (let i = 0; i < amount; i += 1) {
    const heart = document.createElement('span');
    heart.className = 'burst-heart';
    heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.animationDelay = `${Math.random() * 0.7}s`;
    heart.style.fontSize = `${12 + Math.random() * 18}px`;
    container.appendChild(heart);
    heart.addEventListener('animationend', () => heart.remove(), { once: true });
  }
}
