(() => {
  'use strict';
  const filters = [...document.querySelectorAll('[data-filter]')];
  const projects = [...document.querySelectorAll('[data-category]')];
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', String(item === button)); });
    let count = 0;
    projects.forEach(project => { project.hidden = button.dataset.filter !== 'all' && !project.dataset.category.split(' ').includes(button.dataset.filter); if (!project.hidden) count++; });
    document.querySelector('#filter-status').textContent = `${count} projects shown`;
  }));
  document.querySelector('#year').textContent = new Date().getFullYear();
  const canvas = document.querySelector('#orb');
  const context = canvas.getContext('2d');
  if (!context) return;
  const scene = document.querySelector('#scene');
  const button = document.querySelector('#motion');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduced.matches, frame = 0, width = 0, height = 0, angle = 0.3, last = 0, visible = true;
  let pointer = { x: 0, y: 0 }, rotation = { x: 0, y: 0 };
  const rings = [];
  for (let j = 0; j < 30; j++) {
    const ring = [];
    for (let i = 0; i <= 140; i++) {
      const u = i / 140 * Math.PI * 2, v = j / 30 * Math.PI * 2;
      const radius = 1.25 + .47 * Math.cos(v);
      ring.push([radius * Math.cos(u), radius * Math.sin(u), .47 * Math.sin(v)]);
    }
    rings.push(ring);
  }
  function project(point, spin) {
    const [x,y,z] = point;
    const a = .9 + rotation.y, b = spin + rotation.x;
    const yy = y * Math.cos(a) - z * Math.sin(a), zz = y * Math.sin(a) + z * Math.cos(a);
    const xx = x * Math.cos(b) + zz * Math.sin(b), depth = -x * Math.sin(b) + zz * Math.cos(b);
    const c = -.43;
    const rx = xx * Math.cos(c) - yy * Math.sin(c), ry = xx * Math.sin(c) + yy * Math.cos(c);
    const scale = Math.min(width,height) * .26 * 4.5 / (4.5 + depth);
    return [width / 2 + rx * scale, height / 2 + ry * scale, depth];
  }
  function draw(time = 0) {
    frame = 0;
    const delta = last ? Math.min(time-last,40) : 0;
    last = time;
    if (!paused) angle += delta * .000095;
    rotation.x += (pointer.x-rotation.x)*.045; rotation.y += (pointer.y-rotation.y)*.045;
    context.clearRect(0,0,width,height);
    const glow = context.createRadialGradient(width/2,height*.52,10,width/2,height*.52,width*.44);
    glow.addColorStop(0,'rgba(172,208,112,.09)'); glow.addColorStop(1,'rgba(172,208,112,0)');
    context.fillStyle=glow; context.fillRect(0,0,width,height);
    const rendered = rings.map(ring => ring.map(point => project(point,angle)));
    rendered.sort((a,b) => b.reduce((s,p)=>s+p[2],0)-a.reduce((s,p)=>s+p[2],0));
    rendered.forEach(ring => {
      for(let i=1;i<ring.length;i++) {
        const depth = (ring[i][2]+1.8)/3.6;
        context.strokeStyle=`rgba(${Math.round(207-depth*66)},${Math.round(236-depth*63)},${Math.round(154-depth*60)},${.22+(1-depth)*.55})`;
        context.lineWidth=.65+(1-depth)*.7;
        context.beginPath();context.moveTo(ring[i-1][0],ring[i-1][1]);context.lineTo(ring[i][0],ring[i][1]);context.stroke();
      }
    });
    for(let i=0;i<16;i++) {
      const t=i/16*Math.PI*2;
      const p=project([2.05*Math.cos(t),2.05*Math.sin(t),.1],angle*.35);
      context.fillStyle='rgba(198,224,152,.45)';context.fillRect(p[0],p[1],1.5,1.5);
    }
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
