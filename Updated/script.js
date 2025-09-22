// SPA Navigation and Section Switching
document.addEventListener("DOMContentLoaded", function () {
  function showSection(id) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    const section = document.getElementById(id);
    if (section) section.classList.add('active');
    // Update nav active state
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + id);
    });
    // Scroll to top for mobile UX
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Initial load: show About
  showSection('about');

  // Navbar link click
  document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const target = this.getAttribute('href').replace('#', '');
      showSection(target);
      // Collapse navbar on mobile after click
      const navbarCollapse = document.querySelector('.navbar-collapse');
      if (navbarCollapse.classList.contains('show')) {
        new bootstrap.Collapse(navbarCollapse).hide();
      }
    });
  });

  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  const icon = themeToggle.querySelector('i');
  function setTheme(dark) {
    if (dark) {
      body.classList.add('dark-mode');
      icon.classList.remove('bi-moon-fill');
      icon.classList.add('bi-sun-fill');
    } else {
      body.classList.remove('dark-mode');
      icon.classList.add('bi-moon-fill');
      icon.classList.remove('bi-sun-fill');
    }
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }
  // On load
  setTheme(localStorage.getItem('theme') === 'dark');
  themeToggle.addEventListener('click', function () {
    const dark = !body.classList.contains('dark-mode');
    setTheme(dark);
  });

  // Smooth scroll and nav active
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').replace('#', '');
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.offsetTop - 70,
          behavior: 'smooth'
        });
      }
    });
  });

  // Set nav active on scroll
  window.addEventListener('scroll', function () {
    const scrollPos = window.scrollY + 80;
    document.querySelectorAll('.section').forEach(section => {
      if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
        const id = section.getAttribute('id');
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  });

  // Contact form validation and submission
  window.sub = async function () {
    let fName = document.getElementById("fName");
    let pNum = document.getElementById("pNum");
    let mailId = document.getElementById("mailId");
    let userMsg = document.getElementById("userMsg");
    let fNameError = document.getElementById("fNameError");
    let pNumError = document.getElementById("pNumError");
    let mailIdError = document.getElementById("mailIdError");
    let userMsgError = document.getElementById("userMsgError");

    // Clear previous errors
    fNameError.textContent = "";
    pNumError.textContent = "";
    mailIdError.textContent = "";
    userMsgError.textContent = "";

    let valid = true;

    // Validation
    if (fName.value.trim() == "" || fName.value.length < 3) {
      fNameError.textContent = "Please Enter Your Full Name";
      valid = false;
    }
    if (pNum.value.trim() === "") {
      pNumError.textContent = "Enter Your Phone Number ";
      valid = false;
    }
    else if (!pNum.checkValidity()) {
      pNumError.textContent = "Enter a valid 10-digit phone number ";
      valid = false;
    }
    if (mailId.value.trim() === "") {
      mailIdError.textContent = "Enter Your Email Id";
      valid = false;
    }
    else if (!mailId.checkValidity()) {
      mailIdError.textContent = "Enter a valid Email Id ";
      valid = false;
    }
    if (userMsg.value.trim() === "") {
      userMsgError.textContent = "Type Your Suggestion";
      valid = false;
    }

    if (valid) {
      try {
        // Show loading state
        const submitBtn = document.getElementById("subBtn");
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "Sending...";
        submitBtn.disabled = true;

        // Prepare data for backend
        const formData = {
          name: fName.value.trim(),
          number: pNum.value.trim(),
          email: mailId.value.trim(),
          message: userMsg.value.trim()
        };

        // Send data to backend
        // PRODUCTION: Use environment variable for API URL
        // For Netlify deployment, set API_URL in environment variables
        // Fallback to localhost for development
        const apiUrl = window.ENV?.API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/adduser`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          // Success - show success message
          alert("Thank You ❤️ Your message has been sent successfully!");
          document.getElementById("contactForm").reset();
        } else {
          // Backend error
          const errorData = await response.json();
          alert("Sorry, there was an error sending your message. Please try again later.");
          console.error('Backend error:', errorData);
        }
      } catch (error) {
        // Network or other error
        alert("Sorry, there was an error connecting to the server. Please check if the backend server is running and try again.");
        console.error('Network error:', error);
      } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    }
  };

  // Scroll-triggered animations using Intersection Observer
  const observerOptions = {
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fadeInUp');
        entry.target.classList.remove('animate-on-scroll');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
});