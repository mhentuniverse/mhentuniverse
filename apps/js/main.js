// Main JS for MHEnt Universe Apps Hub
document.addEventListener('DOMContentLoaded', () => {
  initCosmicCanvas();
  bindDownloadButtons();
  handleAutoDownload();
});

// Subtle ambient cosmic stars canvas
function initCosmicCanvas() {
  const canvas = document.querySelector('.cosmic-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const stars = [];
  const starCount = Math.floor((width * height) / 12000);

  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.7 + 0.2,
      speed: Math.random() * 0.005 + 0.002
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    stars.forEach(s => {
      s.alpha += Math.sin(Date.now() * s.speed) * 0.01;
      s.alpha = Math.max(0.1, Math.min(0.85, s.alpha));
      ctx.fillStyle = `rgba(180, 220, 255, ${s.alpha})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(render);
  }
  render();
}

// Bind config values to download buttons
function bindDownloadButtons() {
  const cfg = window.MHENT_APPS_CONFIG;
  if (!cfg) return;

  // Horizon Buttons
  const horizonBtns = document.querySelectorAll('[data-app="horizon"]');
  horizonBtns.forEach(btn => {
    if (btn.tagName === 'A' && cfg.horizon?.downloadUrl) {
      btn.href = cfg.horizon.downloadUrl;
    }
  });

  // Orbit Buttons
  const orbitBtns = document.querySelectorAll('[data-app="orbit"]');
  orbitBtns.forEach(btn => {
    if (btn.tagName === 'A' && cfg.orbit?.downloadUrl) {
      btn.href = cfg.orbit.downloadUrl;
    }
  });
}

// Handle auto-download query (?download=true or ?direct=1)
function handleAutoDownload() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('download') === '1' || params.get('download') === 'true') {
    const mainBtn = document.querySelector('.download-btn-main');
    if (mainBtn && mainBtn.href && mainBtn.href !== '#' && !mainBtn.href.startsWith('javascript:')) {
      const notice = document.createElement('div');
      notice.className = 'hero-pill';
      notice.style.marginTop = '16px';
      notice.innerHTML = '<span class="hero-pill-dot"></span> Đang bắt đầu tải xuống bản cài đặt...';
      mainBtn.parentNode.insertBefore(notice, mainBtn.nextSibling);

      setTimeout(() => {
        window.location.href = mainBtn.href;
      }, 1200);
    }
  }
}
