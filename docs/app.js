(() => {
  'use strict';
  const filters = [...document.querySelectorAll('[data-filter]')];
  const projects = [...document.querySelectorAll('[data-category]')];
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
      const textMatch = terms.every(term => searchable.get(project).includes(term));
      project.hidden = !categoryMatch || !textMatch;
      if (!project.hidden) count++;
    });
    status.textContent = `${count} of ${projects.length} projects and contribution highlights shown`;
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
  const canvas = document.querySelector('#orb');
  const context = canvas.getContext('2d');
  if (!context) return;
  const scene = document.querySelector('#scene');
  const astronaut = document.querySelector('#astronaut');
  const button = document.querySelector('#motion');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduced.matches, frame = 0, width = 0, height = 0, angle = 0.3, last = 0, visible = true, elapsed = 0;
  let pointer = { x: 0, y: 0 }, rotation = { x: 0, y: 0 };
  // Seeded stars keep the galaxy stable across reloads and viewport changes.
  let seed = 938;
  function random() { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }
  function scatter() { return (random() + random() + random() - 1.5); }
  const stars = [];
  const background = Array.from({ length: 130 }, () => ({
    x: random(), y: random(), size: .35 + random() * 1.1, alpha: .12 + random() * .45, phase: random() * Math.PI * 2
  }));
  for (let i = 0; i < 3400; i++) {
    const radius = .06 + Math.pow(random(), .7) * 2.15;
    const arm = i % 4 * Math.PI / 2;
    const theta = arm + radius * 2.6 + scatter() * (.15 + radius * .16);
    const spread = .025 + radius * .09;
    stars.push({
      x: Math.cos(theta) * radius + scatter() * spread,
      y: Math.sin(theta) * radius + scatter() * spread,
      z: scatter() * (.05 + .1 * Math.exp(-radius * 2)),
      size: .35 + Math.pow(random(), 3) * 1.5,
      alpha: .25 + random() * .65,
      color: radius < .55 ? '#ffe6b0' : ['#a8c4ff', '#c6b7ff', '#e1eaff', '#8ca9ed'][i % 4]
    });
  }
  // A spherical central bulge gives the disk a luminous, dimensional core.
  for (let i = 0; i < 700; i++) {
    const theta = random() * Math.PI * 2, phi = Math.acos(2 * random() - 1);
    const radius = Math.pow(random(), 2) * .55;
    stars.push({ x: radius * Math.sin(phi) * Math.cos(theta),
      y: radius * Math.sin(phi) * Math.sin(theta), z: radius * Math.cos(phi) * .5,
      size: .4 + random() * .8, alpha: .25 + random() * .65, color: '#ffe5ba' });
  }
  function project(star) {
    const spin = angle;
    const x = star.x * Math.cos(spin) - star.y * Math.sin(spin);
    const y = star.x * Math.sin(spin) + star.y * Math.cos(spin);
    const tilt = 1.02 + rotation.y;
    const vertical = y * Math.cos(tilt) - star.z * Math.sin(tilt);
    const depth = y * Math.sin(tilt) + star.z * Math.cos(tilt);
    const roll = -.38 + rotation.x;
    const scale = Math.min(width, height) * .205 * 5 / (5 + depth);
    return [width / 2 + (x * Math.cos(roll) - vertical * Math.sin(roll)) * scale,
      height * .5 + (x * Math.sin(roll) + vertical * Math.cos(roll)) * scale,
      5 / (5 + depth)];
  }
  function halo(x, y, radius, color) {
    const glow = context.createRadialGradient(x, y, 0, x, y, radius);
    glow.addColorStop(0, color); glow.addColorStop(1, 'rgba(0,0,0,0)');
    context.fillStyle = glow; context.fillRect(x-radius, y-radius, radius*2, radius*2);
  }
  function draw(time = 0) {
    frame = 0;
    const delta = last ? Math.min(time-last,40) : 0;
    last = time;
    if (!paused) {
      angle += delta * .000065;
      elapsed += delta / 1000;
      rotation.x += (pointer.x-rotation.x)*.045;
      rotation.y += (pointer.y-rotation.y)*.045;
    }
    if (astronaut) {
      const driftX = Math.sin(elapsed * .34) * 12 + rotation.x * 22;
      const driftY = Math.cos(elapsed * .48) * 13 + rotation.y * 14;
      astronaut.style.transform = `translate3d(${driftX}px, ${driftY}px, 0) rotate(${16 + Math.sin(elapsed * .3) * 9}deg)`;
    }
    context.clearRect(0,0,width,height);
    for (const star of background) {
      context.globalAlpha = star.alpha * (.8 + .2 * Math.sin(elapsed * .7 + star.phase));
      context.fillStyle = '#d1ddf5';
      context.fillRect(star.x * width, 40 + star.y * (height-80), star.size, star.size);
    }
    context.globalAlpha = 1;
    // Fine orbital arcs frame the galaxy without covering the stars.
    context.save();
    context.translate(width*.5, height*.5);
    context.rotate(-.38 + rotation.x);
    context.strokeStyle = 'rgba(154,180,227,.13)';
    context.lineWidth = .7;
    context.setLineDash([2,7]);
    context.beginPath();
    context.ellipse(0,0,Math.min(width,height)*.47,Math.min(width,height)*.21,0,0,Math.PI*2);
    context.stroke();
    context.restore();
    // One brief meteor every twelve seconds; no flashes or abrupt bursts.
    const meteor = elapsed % 12;
    if (meteor > 8 && meteor < 9.4) {
      const progress = (meteor-8)/1.4;
      const x = width*(.18 + progress*.55), y = height*(.1 + progress*.28);
      const trail = context.createLinearGradient(x-65,y-30,x,y);
      trail.addColorStop(0,'rgba(164,195,255,0)');
      trail.addColorStop(1,`rgba(210,225,255,${Math.sin(progress*Math.PI)*.65})`);
      context.strokeStyle = trail;
      context.lineWidth = 1.2;
      context.beginPath();context.moveTo(x-65,y-30);context.lineTo(x,y);context.stroke();
    }
    context.save();
    context.translate(width/2, height*.5);
    context.rotate(-.38 + rotation.x);
    context.scale(1, .48);
    context.globalCompositeOperation = 'lighter';
    halo(0, 0, Math.min(width,height)*.47, 'rgba(95,111,230,.16)');
    halo(0, 0, Math.min(width,height)*.21, 'rgba(216,177,240,.16)');
    context.restore();
    context.globalCompositeOperation = 'lighter';
    // Additive starlight avoids per-frame sorting and keeps mobile rendering light.
    for (const star of stars) {
      const [x,y,depth] = project(star);
      const size = star.size * depth;
      context.globalAlpha = star.alpha;
      context.fillStyle = star.color;
      context.fillRect(x-size/2, y-size/2, size, size);
      if (star.size > 1.65) {
        context.globalAlpha = star.alpha * .08;
        context.fillRect(x-size*2, y-size*2, size*4, size*4);
      }
    }
    context.globalAlpha = 1;
    halo(width/2, height*.5, Math.min(width,height)*.11, 'rgba(255,220,166,.48)');
    halo(width/2, height*.5, Math.min(width,height)*.035, 'rgba(255,245,218,.8)');
    context.globalCompositeOperation = 'source-over';
    if (!paused && visible && !document.hidden) frame=requestAnimationFrame(draw);
  }
  function requestDraw(){if(!frame) frame=requestAnimationFrame(draw);}
  function resize(){const rect=scene.getBoundingClientRect();width=rect.width;height=rect.height;const ratio=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);context.setTransform(ratio,0,0,ratio,0,0);requestDraw();}
  function updateButton(){button.textContent=paused?'Play motion ▷':'Pause motion Ⅱ';button.setAttribute('aria-pressed',String(paused));}
  button.addEventListener('click',()=>{paused=!paused;last=0;updateButton();requestDraw();});
  scene.addEventListener('pointermove',event=>{if(paused||reduced.matches)return;const rect=scene.getBoundingClientRect();pointer.x=((event.clientX-rect.left)/rect.width-.5)*.45;pointer.y=((event.clientY-rect.top)/rect.height-.5)*.3;});
  scene.addEventListener('pointerleave',()=>{pointer={x:0,y:0};});
  reduced.addEventListener('change',event=>{paused=event.matches;updateButton();requestDraw();});
  document.addEventListener('visibilitychange',()=>{last=0;if(!document.hidden)requestDraw();});
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){last=0;requestDraw();}},{threshold:0}).observe(scene);
  new ResizeObserver(resize).observe(scene);
  updateButton();resize();
})();
