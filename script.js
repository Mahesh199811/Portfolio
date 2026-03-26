/* ============================
   1. CANVAS PARTICLE BACKGROUND
============================ */
(function initCanvas() {
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animId;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function randomBetween(a, b) { return a + Math.random() * (b - a); }

  function createParticle() {
    return {
      x: randomBetween(0, W),
      y: randomBetween(0, H),
      r: randomBetween(0.5, 2),
      vx: randomBetween(-0.3, 0.3),
      vy: randomBetween(-0.4, -0.1),
      alpha: randomBetween(0.2, 0.8),
      color: Math.random() > 0.6 ? '#00ff88' : Math.random() > 0.5 ? '#00d4ff' : '#ffffff'
    };
  }

  function initParticles() {
    particles = [];
    const count = Math.floor((W * H) / 6000);
    for (let i = 0; i < count; i++) particles.push(createParticle());
  }

  function drawConnections() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 255, 136, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);

    // Draw subtle gradient background
    const gradient = ctx.createRadialGradient(W * 0.5, H * 0.3, 0, W * 0.5, H * 0.3, W * 0.8);
    gradient.addColorStop(0, 'rgba(0, 255, 136, 0.03)');
    gradient.addColorStop(0.5, 'rgba(0, 212, 255, 0.02)');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);

    drawConnections();

    particles.forEach((p, idx) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.y < -5 || p.x < -5 || p.x > W + 5) {
        particles[idx] = createParticle();
        particles[idx].y = H + 5;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Glow for green particles
      if (p.color === '#00ff88' && p.r > 1.2) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 255, 136, 0.06)';
        ctx.fill();
      }
    });

    animId = requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => { resize(); initParticles(); });
  resize();
  initParticles();
  animate();
})();


/* ============================
   2. TYPING ANIMATION
============================ */
(function initTyping() {
  const el = document.getElementById('typing-text');
  const phrases = ['.NET MAUI Developer', 'Xamarin Developer', 'Desktop App Engineer', 'Transitioning to DevOps', 'AWS Cloud Enthusiast'];
  let phraseIdx = 0, charIdx = 0, deleting = false, pauseTimer = null;

  function type() {
    const current = phrases[phraseIdx];

    if (!deleting) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        pauseTimer = setTimeout(type, 1800);
        return;
      }
      setTimeout(type, 75);
    } else {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 40);
    }
  }

  setTimeout(type, 800);
})();


/* ============================
   3. TERMINAL ANIMATION
============================ */
(function initTerminal() {
  const body = document.getElementById('terminal-body');

  const lines = [
    { type: 'prompt', text: 'docker build -t mahesh/api:v2.1.0 .' },
    { type: 'output', text: '[+] Building 12.4s (8/8) FINISHED' },
    { type: 'success', text: '✓  Successfully tagged mahesh/api:v2.1.0' },
    { type: 'blank' },
    { type: 'prompt', text: 'kubectl apply -f k8s/deployment.yaml' },
    { type: 'info', text: 'deployment.apps/api-service configured' },
    { type: 'info', text: 'service/api-service unchanged' },
    { type: 'success', text: '✓  Rollout: 3/3 pods ready' },
    { type: 'blank' },
    { type: 'prompt', text: 'terraform plan -out=tfplan' },
    { type: 'warn', text: '~ Plan: 2 to add, 1 to change, 0 to destroy' },
    { type: 'blank' },
    { type: 'prompt', text: 'terraform apply tfplan' },
    { type: 'success', text: '✓  Apply complete! Resources: 2 added.' },
    { type: 'blank' },
    { type: 'prompt', text: 'kubectl get pods -n production' },
    { type: 'output', text: 'NAME                    READY   STATUS    AGE' },
    { type: 'output', text: 'api-service-7d4f9-xk2   1/1     Running   2m' },
    { type: 'output', text: 'web-frontend-5c8b-lp1   1/1     Running   2m' },
    { type: 'output', text: 'db-proxy-9g3r-mn8       1/1     Running   5m' },
    { type: 'blank' },
    { type: 'prompt', text: 'argocd app sync my-app --force' },
    { type: 'success', text: '✓  Synced to HEAD (a3f91bc)' },
  ];

  function renderLine(line) {
    const el = document.createElement('div');
    el.className = 'terminal-line';

    if (line.type === 'blank') {
      el.innerHTML = '&nbsp;';
      el.className = 'terminal-line visible';
      body.appendChild(el);
      return el;
    }

    if (line.type === 'prompt') {
      el.innerHTML = `<span class="prompt">❯</span><span class="cmd"> ${escHtml(line.text)}</span>`;
    } else if (line.type === 'output') {
      el.innerHTML = `<span class="cmd-output">${escHtml(line.text)}</span>`;
    } else if (line.type === 'success') {
      el.innerHTML = `<span class="cmd-success">${escHtml(line.text)}</span>`;
    } else if (line.type === 'info') {
      el.innerHTML = `<span class="cmd-info">${escHtml(line.text)}</span>`;
    } else if (line.type === 'warn') {
      el.innerHTML = `<span class="cmd-warn">${escHtml(line.text)}</span>`;
    }

    body.appendChild(el);
    return el;
  }

  function escHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  let idx = 0;
  function showNext() {
    if (idx >= lines.length) {
      // Restart after delay
      setTimeout(() => {
        body.innerHTML = '';
        idx = 0;
        showNext();
      }, 3000);
      return;
    }

    const line = lines[idx++];
    const el = renderLine(line);

    requestAnimationFrame(() => {
      setTimeout(() => {
        el.classList.add('visible');
        // Scroll terminal body to bottom
        body.scrollTop = body.scrollHeight;
        const delay = line.type === 'prompt' ? 600 : line.type === 'blank' ? 100 : 200;
        setTimeout(showNext, delay);
      }, 30);
    });
  }

  showNext();
})();


/* ============================
   4. NAVBAR SCROLL BEHAVIOR
============================ */
const navbar = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  if (scrollY > 50) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');

  if (scrollY > 400) scrollTopBtn.classList.add('visible');
  else scrollTopBtn.classList.remove('visible');

  // Active nav link highlight
  const sections = ['about', 'skills', 'projects', 'experience', 'contact'];
  sections.forEach(id => {
    const sec = document.getElementById(id);
    if (!sec) return;
    const top = sec.offsetTop - 100;
    const bottom = top + sec.offsetHeight;
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      if (scrollY >= top && scrollY < bottom) link.classList.add('active');
      else link.classList.remove('active');
    }
  });
});


/* ============================
   5. HAMBURGER MENU
============================ */
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('nav-mobile');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMobile.classList.toggle('open');
  document.body.style.overflow = navMobile.classList.contains('open') ? 'hidden' : '';
});

function closeMobileNav() {
  hamburger.classList.remove('open');
  navMobile.classList.remove('open');
  document.body.style.overflow = '';
}


/* ============================
   6. INTERSECTION OBSERVER — SCROLL REVEAL
============================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('revealed');
      }, entry.target.dataset.delay || 0);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

// Stagger cards in grids
document.querySelectorAll('.projects-grid .project-card').forEach((el, i) => {
  el.dataset.delay = i * 80;
});

document.querySelectorAll('.skills-categories .skill-category-card').forEach((el, i) => {
  el.dataset.delay = i * 60;
});

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});


/* ============================
   7. SKILL BAR ANIMATION
============================ */
const skillBarObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        const width = bar.dataset.width;
        setTimeout(() => { bar.style.width = width + '%'; }, 200);
      });
      skillBarObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-category-card').forEach(card => {
  skillBarObserver.observe(card);
});


/* ============================
   8. RESUME DOWNLOAD (WORD)
============================ */
function cleanText(value) {
  return (value || '').replace(/\s+/g, ' ').trim();
}

function safeText(value) {
  return cleanText(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getContactValue(label) {
  const items = Array.from(document.querySelectorAll('.contact-detail-item'));
  const found = items.find((item) => {
    const currentLabel = cleanText(item.querySelector('.label')?.textContent).toLowerCase();
    return currentLabel === label.toLowerCase();
  });

  return cleanText(found?.querySelector('.value')?.textContent || '');
}

function buildResumeWordHtml() {
  const fullName = cleanText(document.querySelector('.hero-name')?.textContent) || 'Mahesh Gadhave';
  const summary = cleanText(document.querySelector('.hero-desc')?.textContent) || 'DevOps & AWS-focused engineer with hands-on experience in CI/CD, containers, and cloud automation.';
  const role = cleanText(document.querySelector('.hero-role-wrapper')?.textContent) || 'DevOps & AWS-focused Engineer';

  const email = getContactValue('Email');
  const phone = getContactValue('Phone');
  const location = getContactValue('Location');
  const linkedin = document.querySelector('a[title="LinkedIn"]')?.getAttribute('href') || '';

  const skillSet = Array.from(document.querySelectorAll('.skill-name'))
    .map((el) => safeText(el.textContent))
    .filter(Boolean);

  const projects = Array.from(document.querySelectorAll('.project-card')).map((card) => {
    const title = safeText(card.querySelector('.project-title')?.textContent);
    const desc = safeText(card.querySelector('.project-desc')?.textContent);
    const tech = Array.from(card.querySelectorAll('.tech-tag'))
      .map((tag) => safeText(tag.textContent))
      .filter(Boolean)
      .join(', ');

    return { title, desc, tech };
  });

  const experiences = Array.from(document.querySelectorAll('.timeline-item')).map((item) => {
    const period = safeText(item.querySelector('.tl-period')?.textContent);
    const mode = safeText(item.querySelector('.tl-company')?.textContent);
    const roleName = safeText(item.querySelector('.tl-role')?.textContent);
    const company = safeText(item.querySelector('.tl-company-name')?.textContent);
    const desc = safeText(item.querySelector('.tl-desc')?.textContent);
    const bullets = Array.from(item.querySelectorAll('.tl-bullets li'))
      .map((li) => `<li>${safeText(li.textContent)}</li>`)
      .join('');

    return { period, mode, roleName, company, desc, bullets };
  });

  const educationTitle = safeText(document.querySelector('section .fa-graduation-cap')?.closest('div')?.nextElementSibling?.querySelector('div')?.textContent || 'Bachelor of Engineering (B.E.)');
  const educationMeta = safeText(document.querySelector('section .fa-graduation-cap')?.closest('div')?.nextElementSibling?.querySelectorAll('div')?.[1]?.textContent || 'RTMNU, Nagpur · 2020');
  const educationScore = safeText(document.querySelector('section .fa-graduation-cap')?.closest('div')?.nextElementSibling?.querySelectorAll('div')?.[2]?.textContent || 'CGPA: 7.38');

  return `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <title>${safeText(fullName)} - Resume</title>
  <style>
    body { font-family: Calibri, Arial, sans-serif; color: #111; margin: 30px; line-height: 1.45; }
    h1 { font-size: 28px; margin: 0 0 4px; }
    h2 { font-size: 16px; margin: 18px 0 8px; border-bottom: 1px solid #dcdcdc; padding-bottom: 4px; text-transform: uppercase; letter-spacing: 0.6px; }
    h3 { font-size: 14px; margin: 0 0 4px; }
    p { margin: 0 0 10px; }
    ul { margin: 6px 0 10px 18px; }
    li { margin: 2px 0; }
    .headline { font-size: 13px; color: #2b2b2b; margin-bottom: 8px; }
    .contact { font-size: 12px; color: #333; margin-bottom: 14px; }
    .row { margin-bottom: 12px; }
    .meta { color: #444; font-size: 12px; margin-bottom: 4px; }
    .chips { font-size: 12px; }
    .project { margin-bottom: 12px; }
    .project-tech { font-size: 12px; color: #333; }
  </style>
</head>
<body>
  <h1>${safeText(fullName)}</h1>
  <div class="headline">${safeText(role)}</div>
  <div class="contact">
    ${safeText(email)} | ${safeText(phone)} | ${safeText(location)}${linkedin ? ` | LinkedIn: ${safeText(linkedin)}` : ''}
  </div>

  <h2>Professional Summary</h2>
  <p>${safeText(summary)}</p>

  <h2>Skills</h2>
  <p class="chips">${skillSet.join(' • ')}</p>

  <h2>Experience</h2>
  ${experiences.map((exp) => `
    <div class="row">
      <h3>${exp.roleName}</h3>
      <div class="meta">${exp.company} | ${exp.period}${exp.mode ? ` | ${exp.mode}` : ''}</div>
      <p>${exp.desc}</p>
      <ul>${exp.bullets}</ul>
    </div>
  `).join('')}

  <h2>Projects</h2>
  ${projects.map((project) => `
    <div class="project">
      <h3>${project.title}</h3>
      <p>${project.desc}</p>
      <div class="project-tech"><strong>Tech:</strong> ${project.tech}</div>
    </div>
  `).join('')}

  <h2>Education</h2>
  <div class="row">
    <h3>${educationTitle}</h3>
    <div class="meta">${educationMeta}</div>
    <p>${educationScore}</p>
  </div>
</body>
</html>`;
}

function downloadResumeAsWord() {
  const wordHtml = buildResumeWordHtml();
  const blob = new Blob(['\ufeff', wordHtml], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = 'Mahesh_Gadhave_Resume.doc';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

const downloadResumeBtn = document.getElementById('download-resume-btn');
if (downloadResumeBtn) {
  downloadResumeBtn.addEventListener('click', downloadResumeAsWord);
}

/* ============================
   9. SMOOTH ACTIVE STATE FOR NAV
============================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
