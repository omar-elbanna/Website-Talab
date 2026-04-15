/* ===== Talab – Main JavaScript ===== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Navbar scroll effect ---------- */
  const navbar = document.querySelector('.navbar');
  const handleNavScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  /* ---------- Smooth scroll for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      // Close mobile menu if open
      mobileMenu.classList.remove('open');
      mobileToggle.classList.remove('active');
    });
  });

  /* ---------- Mobile menu ---------- */
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    mobileMenu.classList.toggle('open');
  });

  /* ---------- Scroll reveal animations ---------- */
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.parentElement;
      const answer = item.querySelector('.faq-answer');
      const isActive = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.faq-item').forEach(faq => {
        faq.classList.remove('active');
        faq.querySelector('.faq-answer').style.maxHeight = null;
      });

      // Open clicked (if it was closed)
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Counter animation for stat cards ---------- */
  const animateCounters = () => {
    document.querySelectorAll('[data-count]').forEach(el => {
      const target = el.getAttribute('data-count');
      const suffix = el.getAttribute('data-suffix') || '';
      const prefix = el.getAttribute('data-prefix') || '';
      const isNum = !isNaN(parseFloat(target));

      if (!isNum) {
        el.textContent = target;
        return;
      }

      const num = parseFloat(target);
      const duration = 1800;
      const start = performance.now();

      const step = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(num * eased);
        el.textContent = prefix + current + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    });
  };

  // Trigger counter animation when results section is visible
  const resultsSection = document.querySelector('.results-section');
  if (resultsSection) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    counterObserver.observe(resultsSection);
  }

  /* ---------- Form submission (demo) ---------- */
  const ctaForm = document.querySelector('.cta-form');
  if (ctaForm) {
    ctaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = ctaForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Sent! We\'ll be in touch.';
      btn.style.background = '#22c55e';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
        ctaForm.reset();
      }, 3000);
    });
  }

  /* ---------- Active nav link highlight ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-links a[href^="#"]');

  const highlightNav = () => {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinksAll.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + id) {
            link.style.color = 'var(--gold)';
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });

  /* ---------- Typed effect for hero headline ---------- */
  const heroHL = document.querySelector('.hero-headline-dynamic');
  if (heroHL) {
    const words = ['Close More Deals', 'Convert More Leads', 'Book More Appointments', 'Grow Your Revenue'];
    let wordIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let pause = 0;

    const type = () => {
      const word = words[wordIdx];
      if (pause > 0) {
        pause--;
        setTimeout(type, 60);
        return;
      }

      if (!deleting) {
        heroHL.textContent = word.substring(0, charIdx + 1);
        charIdx++;
        if (charIdx === word.length) {
          pause = 30;
          deleting = true;
        }
      } else {
        heroHL.textContent = word.substring(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
          deleting = false;
          wordIdx = (wordIdx + 1) % words.length;
        }
      }
      setTimeout(type, deleting ? 35 : 65);
    };

    setTimeout(type, 800);
  }

});
