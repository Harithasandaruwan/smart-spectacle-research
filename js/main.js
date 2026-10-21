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

  // --- 4. Contact email template ---
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');
  const copyTemplateBtn = document.getElementById('copy-template');

  if (contactForm) {
    const recipients = [
      'IT22074690@my.sliit.lk',
      'IT22153418@my.sliit.lk',
      'IT22234384@my.sliit.lk',
      'IT22063014@my.sliit.lk'
    ];

    function showContactFeedback(message, type) {
      if (!formFeedback) return;
      formFeedback.textContent = message;
      formFeedback.className = `form-feedback ${type}`;
    }

    function getDraft() {
      if (!contactForm.reportValidity()) return null;
      const name = document.getElementById('sender-name').value.trim();
      const email = document.getElementById('sender-email').value.trim();
      const subject = document.getElementById('sender-subject').value.trim();
      const message = document.getElementById('sender-message').value.trim();
      if (!name || !email || !subject || !message) {
        showContactFeedback('Please complete every field before creating your email.', 'error');
        return null;
      }
      return {
        subject,
        body: `Dear Smart Spectacle Research Team,\n\n${message}\n\nKind regards,\n${name}\n${email}`
      };
    }

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const draft = getDraft();
      if (!draft) return;
      const gmail = 'https://mail.google.com/mail/?view=cm&fs=1'
        + '&to=' + encodeURIComponent(recipients.join(','))
        + '&su=' + encodeURIComponent(draft.subject)
        + '&body=' + encodeURIComponent(draft.body);
      const opened = window.open(gmail, '_blank', 'noopener');
      if (opened) {
        showContactFeedback('Gmail opened in a new tab with your message ready to send.', 'success');
      } else {
        showContactFeedback('Your browser blocked the new tab. Please allow pop-ups, or use Copy template.', 'error');
      }
    });

    copyTemplateBtn?.addEventListener('click', async () => {
      const draft = getDraft();
      if (!draft) return;
      try {
        await navigator.clipboard.writeText(`To: ${recipients.join(', ')}\nSubject: ${draft.subject}\n\n${draft.body}`);
        showContactFeedback('Email template copied to the clipboard.', 'success');
      } catch {
        showContactFeedback('Copying is unavailable in this browser. Please use Open email app.', 'error');
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
