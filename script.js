// Custom Cursor
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});

function animateRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .skill-card, .cert-card, .achieve-card, .contact-link').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
});

// Canvas Particles
const canvas = document.getElementById('canvas-bg');
const ctx = canvas.getContext('2d');
let width, height;
let particles = [];

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.size = Math.random() * 2 + 1;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = '#00e5a0';
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  const count = Math.min(Math.floor(width * height / 15000), 100);
  for (let i = 0; i < count; i++) particles.push(new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, width, height);
  particles.forEach((p, i) =>
    p.update();
    p.draw();
    for (let j = i + 1; j < particles.length; j++) {
      const dx = p.x - particles[j].x;
      const dy = p.y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0, 229, 160, ${1 - dist / 150})`;
        ctx.stroke();
      }
    }
  });
  requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', () => { resize(); initParticles(); });
resize();
initParticles();
animateParticles();

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => observer.observe(el));

// Skill bar animation on scroll
const skillBars = document.querySelectorAll('.skill-fill');
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.width = entry.target.style.getPropertyValue('--fill') ||
        getComputedStyle(entry.target).getPropertyValue('--fill');
    }
  });
}, { threshold: 0.5 });
skillBars.forEach(b => barObserver.observe(b));

// Smooth nav highlight
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.getAttribute('id');
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--accent)' : '';
  });
});
