(() => {
  'use strict';
  const filters = [...document.querySelectorAll('[data-filter]')];
  const projects = [...document.querySelectorAll('.project')];
  const search = document.querySelector('#project-search');
  const status = document.querySelector('#filter-status');
  let activeFilter = 'all';
  const normalize = text => text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const searchable = new Map(projects.map(project => [project, normalize(project.textContent)]));
  function filterProjects() {
    const terms = normalize(search.value).trim().split(/\s+/).filter(Boolean);
    let count = 0;
    projects.forEach(project => {
      const categoryMatch = activeFilter === 'all' || project.dataset.category.split(' ').includes(activeFilter);
      project.hidden = !categoryMatch || !terms.every(term => searchable.get(project).includes(term));
      if (!project.hidden) count++;
    });
    status.textContent = count + ' of ' + projects.length + ' featured projects';
    document.querySelector('#no-results').hidden = count !== 0;
    filters.forEach(button => {
      const selected = button.dataset.filter === activeFilter;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }
  filters.forEach(button => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    filterProjects();
  }));
  search.addEventListener('input', filterProjects);
  document.querySelector('#reset-filters').addEventListener('click', () => {
    activeFilter = 'all'; search.value = ''; filterProjects(); search.focus();
  });
  document.querySelector('.project-controls').hidden = false;
  filterProjects();
  document.querySelector('#year').textContent = new Date().getFullYear();

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const motion = document.querySelector('#project-motion');
  let paused = reduced.matches;
  function updateMotion() {
    document.body.classList.toggle('motion-paused', paused);
    document.documentElement.classList.toggle('motion-paused', paused);
    motion.textContent = paused ? 'Motion paused' : 'Pause motion';
    motion.setAttribute('aria-pressed', String(paused));
    motion.setAttribute('aria-label', 'Pause site animations');
  }
  motion.hidden = false;
  motion.addEventListener('click', () => { paused = !paused; updateMotion(); });
  reduced.addEventListener('change', event => { paused = event.matches; updateMotion(); });
  updateMotion();
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
  }

  // Keep links shared before the five-project homepage working.
  const aliases = { 'cpp-concepts': 'cpp-systems', 'filesystem-lab': 'cpp-systems' };
  const archived = new Set(['llvm-bugsquad', 'newsscript', 'moodpet', 'quizzes-by-iron', 'bio-literature', 'android-classifier', 'image-captioning', 'decrypter-analyzer']);
  function navigateHash() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    if (archived.has(id)) {
      location.replace('archive.html#' + id);
      return;
    }
    if (aliases[id]) {
      id = aliases[id];
      history.replaceState(null, '', '#' + id);
    }
    const target = document.getElementById(id);
    if (!target) return;
    if (target.closest('.project')) {
      activeFilter = 'all'; search.value = ''; filterProjects();
    }
    const details = target.closest('details');
    if (details) details.open = true;
    requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
  }
  addEventListener('hashchange', navigateHash);
  navigateHash();
})();
