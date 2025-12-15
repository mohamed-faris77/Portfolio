document.addEventListener('DOMContentLoaded', () => {
  // === Theme Toggle ===
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  const icon = themeToggle.querySelector('i');

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    body.classList.add('light-mode');
    icon.classList.remove('bi-moon-fill');
    icon.classList.add('bi-sun-fill');
  }

  themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    const isLight = body.classList.contains('light-mode');

    if (isLight) {
      icon.classList.remove('bi-moon-fill');
      icon.classList.add('bi-sun-fill');
      localStorage.setItem('theme', 'light');
    } else {
      icon.classList.remove('bi-sun-fill');
      icon.classList.add('bi-moon-fill');
      localStorage.setItem('theme', 'dark');
    }
  });

  // === Mobile Menu ===
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function toggleMenu() {
    mobileToggle.classList.toggle('open');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  }

  mobileToggle.addEventListener('click', toggleMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMenu();
    });
  });

  // Close menu when clicking outside
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
      toggleMenu();
    }
  });

  // === Smooth Scrolling for Navbar Links ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Offset for fixed header
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    });
  });

  // === Scroll Animations (IntersectionObserver) ===
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Select elements to animate
  const animateElements = document.querySelectorAll('.section-title, .section-subtitle, .about-text, .info-card, .skill-item, .timeline-item, .project-card, .contact-wrapper');

  animateElements.forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });

  // === Navbar Scroll Effect ===
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.background = 'var(--nav-bg)';
      navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  });

  // === Active Link on Scroll ===
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.scrollY;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('active');
      }
    });
  });

  // === Contact Form Submission ===
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Basic Validation
      let valid = true;
      const inputs = contactForm.querySelectorAll('input[required], textarea[required]');

      inputs.forEach(input => {
        const errorDiv = document.getElementById(input.id + 'Error');
        errorDiv.textContent = '';

        if (!input.value.trim()) {
          errorDiv.textContent = 'This field is required';
          valid = false;
        }

        if (input.type === 'email' && input.value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(input.value)) {
            errorDiv.textContent = 'Please enter a valid email';
            valid = false;
          }
        }

        if (input.type === 'tel' && input.value) {
          const phoneRegex = /^[0-9]{10}$/;
          if (!phoneRegex.test(input.value)) {
            errorDiv.textContent = 'Please enter a valid 10-digit number';
            valid = false;
          }
        }
      });

      if (!valid) return;

      // Submit logic (Netlify)
      const btn = document.getElementById('subBtn');
      const originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;

      const formData = new FormData(contactForm);

      fetch('/', {
        method: 'POST',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString()
      })
        .then(() => {
          alert("Thank you! Your message has been sent successfully. ❤️");
          contactForm.reset();
        })
        .catch((error) => {
          console.error('Error:', error);
          alert("Oops! Something went wrong. Please try again.");
        })
        .finally(() => {
          btn.textContent = originalText;
          btn.disabled = false;
        });
    });
  }
});