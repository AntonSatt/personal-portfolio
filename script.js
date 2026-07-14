// antonsatt.com v2 — progressive enhancement only.
// Every feature here degrades to working static HTML without JS.

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------
   Hero: type `kubectl apply -f anton.yaml`, then the response.
   The full text is already in the markup (no-JS fallback);
   with JS we clear it and replay the apply.
   ------------------------------------------------------------ */
(function heroTyping() {
    const cmd = document.getElementById('type-cmd');
    const resp = document.getElementById('type-resp');
    const caret = document.getElementById('type-caret');
    if (!cmd || !resp || reducedMotion) return;

    const cmdText = cmd.textContent;
    const respText = resp.textContent;
    cmd.textContent = '';
    resp.textContent = '';
    if (caret) caret.hidden = false;

    let i = 0;
    function typeCmd() {
        if (i < cmdText.length) {
            cmd.textContent += cmdText[i++];
            setTimeout(typeCmd, 34 + Math.random() * 40);
        } else {
            // "enter" pause, then the API server answers all at once
            setTimeout(() => {
                resp.textContent = respText;
            }, 420);
        }
    }
    setTimeout(typeCmd, 350);
})();

/* ------------------------------------------------------------
   Console rail: live Stockholm clock (all .clock elements).
   ------------------------------------------------------------ */
(function stockholmClock() {
    const clocks = document.querySelectorAll('.clock');
    if (!clocks.length) return;
    const fmt = new Intl.DateTimeFormat('sv-SE', {
        timeZone: 'Europe/Stockholm',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
    function tick() {
        const now = fmt.format(new Date());
        clocks.forEach(c => { c.textContent = now; });
    }
    tick();
    setInterval(tick, 1000);
})();

/* ------------------------------------------------------------
   Rollout bar: fraction of the 2-year program elapsed
   (Sept 2025 → Sept 2027), plus the week counter(s).
   ------------------------------------------------------------ */
(function programRollout() {
    const start = new Date('2025-09-01').getTime();
    const end = new Date('2027-09-01').getTime();
    const now = Date.now();
    const pct = Math.max(0, Math.min(100, ((now - start) / (end - start)) * 100));
    const week = Math.min(104, Math.max(1, Math.ceil((now - start) / (1000 * 60 * 60 * 24 * 7))));

    const bar = document.getElementById('program-progress');
    if (bar) bar.style.width = pct.toFixed(1) + '%';
    const weekEl = document.getElementById('program-week');
    if (weekEl) weekEl.textContent = week;
    const statWeek = document.getElementById('stat-week');
    if (statWeek) statWeek.textContent = week;
})();

/* ------------------------------------------------------------
   Rail nav: highlight the section currently in view.
   ------------------------------------------------------------ */
(function scrollSpy() {
    const links = document.querySelectorAll('.rail-nav a[href^="#"]');
    if (!links.length || !('IntersectionObserver' in window)) return;
    const byId = {};
    links.forEach(l => { byId[l.getAttribute('href').slice(1)] = l; });

    const spy = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                links.forEach(l => l.classList.remove('active'));
                const link = byId[entry.target.id];
                if (link) link.classList.add('active');
            }
        });
    }, { rootMargin: '-30% 0px -60% 0px' });

    Object.keys(byId).forEach(id => {
        const section = document.getElementById(id);
        if (section) spy.observe(section);
    });
})();

/* ------------------------------------------------------------
   Mobile menu.
   ------------------------------------------------------------ */
(function mobileMenu() {
    const btn = document.getElementById('menu-btn');
    const menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;
    btn.addEventListener('click', () => {
        const open = menu.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(open));
        btn.textContent = open ? 'close' : 'menu';
    });
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
            btn.textContent = 'menu';
        });
    });
})();

/* ------------------------------------------------------------
   Reveal on scroll.
   ------------------------------------------------------------ */
(function revealOnScroll() {
    const targets = document.querySelectorAll('.reveal');
    if (!targets.length) return;
    if (reducedMotion || !('IntersectionObserver' in window)) {
        targets.forEach(el => el.classList.add('is-visible'));
        return;
    }
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    targets.forEach(el => observer.observe(el));
})();

/* ------------------------------------------------------------
   Toast.
   ------------------------------------------------------------ */
let toastTimer;
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const msg = document.getElementById('toast-message');
    if (!toast || !msg) return;
    const mark = toast.querySelector('.t-mark');
    toast.classList.toggle('toast--error', type === 'error');
    if (mark) mark.textContent = type === 'error' ? '✗' : '✓';
    msg.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 4000);
}

/* ------------------------------------------------------------
   Contact form → Formspree.
   ------------------------------------------------------------ */
(function contactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    const formspreeURL = 'https://formspree.io/f/xvzqqbqd';

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const submitButton = form.querySelector('button[type="submit"]');
        const formInputs = form.querySelectorAll('input, textarea');
        const originalLabel = submitButton.textContent;

        submitButton.disabled = true;
        formInputs.forEach(input => { input.disabled = true; });
        submitButton.textContent = 'sending…';

        function restore() {
            submitButton.textContent = originalLabel;
            submitButton.disabled = false;
            formInputs.forEach(input => { input.disabled = false; });
        }

        try {
            const response = await fetch(formspreeURL, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' },
            });

            if (response.ok) {
                submitButton.textContent = '✓ message sent';
                showToast("Message sent successfully! I'll get back to you soon.", 'success');
                form.reset();
                setTimeout(restore, 3000);
            } else {
                const data = await response.json();
                if (data.errors) {
                    showToast('Error: ' + data.errors.map(error => error.message).join(', '), 'error');
                } else {
                    showToast('Failed to send message. Please try again.', 'error');
                }
                restore();
            }
        } catch (error) {
            showToast('Network error. Please check your connection and try again.', 'error');
            console.error('Form submission error:', error);
            restore();
        }
    });
})();

/* ------------------------------------------------------------
   Lightbox (case-study pages). Markup:
   <button class="zoomable" data-full="path.png">…<img></button>
   plus one <div class="lightbox"> per page.
   ------------------------------------------------------------ */
(function lightbox() {
    const box = document.querySelector('.lightbox');
    if (!box) return;
    const img = box.querySelector('img');
    let lastTrigger = null;

    function open(src, alt, trigger) {
        img.src = src;
        img.alt = alt || 'Enlarged image';
        box.classList.add('open');
        lastTrigger = trigger;
        const closeBtn = box.querySelector('.lightbox-close');
        if (closeBtn) closeBtn.focus();
    }

    function close() {
        box.classList.remove('open');
        img.src = '';
        if (lastTrigger) lastTrigger.focus();
    }

    document.querySelectorAll('.zoomable').forEach(btn => {
        btn.addEventListener('click', () => {
            const inner = btn.querySelector('img');
            open(btn.dataset.full || (inner && inner.src), inner && inner.alt, btn);
        });
    });

    box.addEventListener('click', e => {
        if (e.target === box || e.target.classList.contains('lightbox-close')) close();
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && box.classList.contains('open')) close();
    });
})();
