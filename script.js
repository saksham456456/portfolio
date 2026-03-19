const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const revealElements = [...document.querySelectorAll('.reveal, .reveal-delay')];
const staggerGroups = [...document.querySelectorAll('.stagger-group')];
const navLinks = [...document.querySelectorAll('.nav__link')];
const sections = [...document.querySelectorAll('[data-section]')];
const activePill = document.querySelector('.nav__active-pill');
const navLinksContainer = document.querySelector('.nav__links');
const timeline = document.querySelector('.timeline');
const timelineProgress = document.querySelector('.timeline__progress');
const chatPanel = document.querySelector('[data-chat-panel]');
const chatToggles = [...document.querySelectorAll('[data-chat-toggle]')];
const magneticTargets = [...document.querySelectorAll('.magnetic')];

const setActiveNav = (id) => {
  const nextLink = navLinks.find((link) => link.getAttribute('href') === `#${id}`);
  if (!nextLink || !activePill || !navLinksContainer) return;

  navLinks.forEach((link) => {
    link.classList.toggle('is-active', link === nextLink);
  });

  const linkRect = nextLink.getBoundingClientRect();
  const containerRect = navLinksContainer.getBoundingClientRect();

  activePill.style.opacity = '1';
  activePill.style.width = `${linkRect.width}px`;
  activePill.style.height = `${linkRect.height}px`;
  activePill.style.transform = `translate3d(${linkRect.left - containerRect.left}px, ${linkRect.top - containerRect.top}px, 0)`;
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.18, rootMargin: '0px 0px -8%' }
);

revealElements.forEach((element) => revealObserver.observe(element));

staggerGroups.forEach((group) => {
  [...group.children].forEach((child, index) => {
    child.classList.add('stagger-item');
    child.style.transitionDelay = `${Math.min(index * 70, 280)}ms`;
    revealObserver.observe(child);
  });
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visibleEntries = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    if (visibleEntries[0]) {
      setActiveNav(visibleEntries[0].target.id);
    }
  },
  { threshold: [0.3, 0.55, 0.8], rootMargin: '-20% 0px -45%' }
);

sections.forEach((section) => sectionObserver.observe(section));

const updateTimelineProgress = () => {
  if (!timeline || !timelineProgress) return;
  const rect = timeline.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const total = rect.height + viewportHeight * 0.35;
  const progress = Math.min(Math.max((viewportHeight * 0.72 - rect.top) / total, 0), 1);
  timelineProgress.style.transform = `scaleY(${progress})`;
};

const setChatState = (expanded) => {
  if (!chatPanel) return;
  chatPanel.classList.toggle('is-collapsed', !expanded);
  chatPanel.setAttribute('aria-hidden', String(!expanded));
};

let chatExpanded = true;
chatToggles.forEach((toggle) => {
  toggle.addEventListener('click', () => {
    chatExpanded = !chatExpanded;
    setChatState(chatExpanded);
  });
});

if (chatPanel) {
  chatPanel.addEventListener('transitionend', () => {
    const input = chatPanel.querySelector('input');
    if (chatExpanded && input) input.focus({ preventScroll: true });
  });
}

magneticTargets.forEach((target) => {
  target.addEventListener('pointermove', (event) => {
    if (prefersReducedMotion.matches) return;
    const rect = target.getBoundingClientRect();
    const offsetX = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
    const offsetY = ((event.clientY - rect.top) / rect.height - 0.5) * 12;
    target.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
  });

  const resetTransform = () => {
    target.style.transform = 'translate3d(0, 0, 0)';
  };

  target.addEventListener('pointerleave', resetTransform);
  target.addEventListener('blur', resetTransform);
});

window.addEventListener('scroll', () => {
  updateTimelineProgress();
}, { passive: true });

window.addEventListener('resize', () => {
  const current = document.querySelector('.nav__link.is-active')?.getAttribute('href')?.replace('#', '') || sections[0]?.id;
  if (current) setActiveNav(current);
  updateTimelineProgress();
});

window.addEventListener('load', () => {
  const current = document.querySelector('.nav__link.is-active')?.getAttribute('href')?.replace('#', '') || sections[0]?.id;
  if (current) setActiveNav(current);
  updateTimelineProgress();
  setChatState(chatExpanded);

  if (prefersReducedMotion.matches) {
    document.querySelectorAll('.reveal, .reveal-delay, .stagger-item').forEach((element) => {
      element.classList.add('is-visible');
    });
  }
});

document.querySelector('.chat-panel__composer')?.addEventListener('submit', (event) => {
  event.preventDefault();
});
