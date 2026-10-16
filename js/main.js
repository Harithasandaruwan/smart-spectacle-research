/**
 * Smart Spectacle Research Project (R26-IT-134)
 * Vanilla JavaScript for Interactive UI & Navigation
 * Adheres to static HTML5/CSS3 guidelines (< 20MB, No Frameworks)
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Mobile Navigation Toggle ---
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.textContent = isOpen ? '✕ Close' : '☰ Menu';
    });
  }

  // --- 2. Dropdown Menus (Touch & Keyboard support) ---
  const dropdowns = document.querySelectorAll('.nav-dropdown');

  dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    const menu = dropdown.querySelector('.dropdown-menu');

    if (toggle && menu) {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const isShown = menu.classList.toggle('show');
        toggle.setAttribute('aria-expanded', String(isShown));

        // Close other dropdowns
        dropdowns.forEach((other) => {
          if (other !== dropdown) {
            const otherMenu = other.querySelector('.dropdown-menu');
            const otherToggle = other.querySelector('.dropdown-toggle');
            if (otherMenu) otherMenu.classList.remove('show');
            if (otherToggle) otherToggle.setAttribute('aria-expanded', 'false');
          }
        });
      });
    }
  });

  // Close dropdowns on click outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-dropdown') && !e.target.closest('.nav-toggle')) {
      document.querySelectorAll('.dropdown-menu').forEach((menu) => {
        menu.classList.remove('show');
      });
      document.querySelectorAll('.dropdown-toggle').forEach((toggle) => {
        toggle.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.dropdown-menu').forEach((menu) => menu.classList.remove('show'));
      if (navLinks && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        if (navToggle) {
          navToggle.setAttribute('aria-expanded', 'false');
          navToggle.textContent = '☰ Menu';
        }
      }
    }
  });

  // --- 3. Milestones Dropdown Filter (Slide 11 Guideline) ---
  const milestoneSelect = document.getElementById('milestone-select');
  const timelineItems = document.querySelectorAll('.timeline-item');

  if (milestoneSelect && timelineItems.length > 0) {
    // Check if URL has a hash or param e.g. #milestone-1
    const currentHash = window.location.hash;
    if (currentHash && currentHash.startsWith('#milestone-')) {
      const targetId = currentHash.replace('#milestone-', '');
      milestoneSelect.value = targetId;
      filterMilestones(targetId);
    }

    milestoneSelect.addEventListener('change', (e) => {
      const selectedValue = e.target.value;
      filterMilestones(selectedValue);
    });

    function filterMilestones(value) {
      timelineItems.forEach((item) => {
        if (value === 'all') {
          item.classList.remove('hidden');
          item.style.display = '';
        } else {
          const itemId = item.getAttribute('data-milestone-id');
          if (itemId === value) {
            item.classList.remove('hidden');
            item.style.display = '';
            item.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } else {
            item.classList.add('hidden');
            item.style.display = 'none';
          }
        }
      });
    }
  }

  // --- 4. General Email Template / Contact Form (Slide 15 Guideline) ---
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');
  const mailtoBtn = document.getElementById('mailto-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('sender-name')?.value.trim() || '';
      const email = document.getElementById('sender-email')?.value.trim() || '';
      const subject = document.getElementById('sender-subject')?.value.trim() || 'Smart Spectacle Project Inquiry';
      const category = document.getElementById('sender-category')?.value || 'General Inquiry';
      const message = document.getElementById('sender-message')?.value.trim() || '';

      if (!name || !email || !message) {
        alert('Please fill in your Name, Email, and Message.');
        return;
      }

      if (formFeedback) {
        formFeedback.className = 'form-feedback success';
        formFeedback.innerHTML = `
          <strong>Thank you, ${name}!</strong><br>
          Your inquiry regarding <em>"${subject}"</em> (${category}) has been drafted successfully.<br>
          <span style="font-size: 0.85rem; color: #116a57;">You can also click the button below to send this directly via your default email application.</span>
        `;
      }

      if (mailtoBtn) {
        const mailtoSubject = encodeURIComponent(`[${category}] ${subject} - ${name}`);
        const mailtoBody = encodeURIComponent(`Dear Smart Spectacle Research Team,\n\nName: ${name}\nEmail: ${email}\nCategory: ${category}\n\nMessage:\n${message}\n\nKind regards,\n${name}`);
        mailtoBtn.href = `mailto:cdap.spectacle@sliit.lk?subject=${mailtoSubject}&body=${mailtoBody}`;
        mailtoBtn.style.display = 'inline-flex';
      }
    });
  }

  // --- 5. Image Fallbacks ---
  document.querySelectorAll('img').forEach((img) => {
    img.addEventListener('error', function () {
      this.style.display = 'none';
      const fallback = this.nextElementSibling;
      if (fallback && fallback.classList.contains('team-photo-fallback')) {
        fallback.style.display = 'grid';
      }
    });
  });
});
