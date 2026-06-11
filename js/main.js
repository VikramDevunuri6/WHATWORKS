

/* ==========================================
   MOBILE NAVIGATION
========================================== */

(function() {
  const toggle = document.getElementById('navToggle');
  const drawer = document.getElementById('mobileNavDrawer');
  const closeBtn = document.getElementById('mobileNavClose');

  if (!toggle || !drawer) return;

  function openMenu() {
    drawer.classList.add('open');
    toggle.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    drawer.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    if (drawer.classList.contains('open')) closeMenu();
    else openMenu();
  });

  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  // Close on nav link tap
  drawer.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
})();

/* ==========================================
   TOUCH COMPARE SLIDER
========================================== */

(function() {
  const container = document.querySelector('.compare-container');
  const afterWrap = document.getElementById('afterWrapper');
  const handle = document.getElementById('sliderHandle');
  const line = document.querySelector('.slider-line');

  if (!container || !afterWrap || !handle) return;

  function setPosition(clientX) {
    const rect = container.getBoundingClientRect();
    let pos = clientX - rect.left;
    pos = Math.max(0, Math.min(pos, rect.width));
    afterWrap.style.width = pos + 'px';
    handle.style.left = pos + 'px';
    if (line) line.style.left = pos + 'px';
  }

  // Touch start
  container.addEventListener('touchstart', (e) => {
    e.preventDefault();
    setPosition(e.touches[0].clientX);
  }, { passive: false });

  // Touch move
  container.addEventListener('touchmove', (e) => {
    e.preventDefault();
    setPosition(e.touches[0].clientX);
  }, { passive: false });

  // Touch end — keep position
  container.addEventListener('touchend', () => {}, { passive: true });
})();

window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 2000);
  }
});



// NAV SCROLL
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
});

// MANIFESTO SCROLL
const manifestoLines = document.querySelectorAll('.manifesto-line');
const manifestoObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.4 });
manifestoLines.forEach(l => manifestoObserver.observe(l));

// REVEAL ELEMENTS
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
reveals.forEach(r => revealObs.observe(r));

// COUNTER ANIMATION
function animateCounter(el, target) {
  const duration = 2000;
  const start = performance.now();
  const isLarge = target > 999;
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 4);
    const val = Math.floor(ease * target);
    el.textContent = isLarge ? val.toLocaleString() : val;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.count').forEach(c => {
        animateCounter(c, parseInt(c.dataset.target));
      });
      counterObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
const statsGrid = document.querySelector('.stats-grid');
if (statsGrid) counterObs.observe(statsGrid);

// FACTORY OBSERVER
const factoryEls = ['factoryEyebrow', 'factoryTitle', 'pillar1', 'pillar2', 'pillar3'];
const factoryObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      factoryObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
factoryEls.forEach(id => {
  const el = document.getElementById(id);
  if (el) factoryObs.observe(el);
});

// TESTIMONIALS
const testimonialObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      testimonialObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.testimonial-card').forEach(c => testimonialObs.observe(c));

// JOURNEY STEPS INTERACTION
const steps = document.querySelectorAll('.step');
const progress = document.getElementById('journeyProgress');
let currentStep = 0;

function activateStep(idx) {
  steps.forEach((s, i) => {
    s.classList.toggle('active', i === idx);
  });
  const pct = (idx / (steps.length - 1)) * 100;
  if (progress) progress.style.height = pct + '%';
}

steps.forEach((step, i) => {
  step.addEventListener('mouseenter', () => activateStep(i));
});

// Auto-cycle steps
let stepInterval = setInterval(() => {
  currentStep = (currentStep + 1) % steps.length;
  activateStep(currentStep);
}, 2500);

const journeySection = document.getElementById('journey');
if (journeySection) {
  journeySection.addEventListener('mouseenter', () => clearInterval(stepInterval));
}

// HORIZONTAL SCROLL — SERVICES DRAG
const track = document.getElementById('servicesTrack');
if (track) {
  let isDown = false, startX, scrollLeft;
  track.addEventListener('mousedown', e => {
    isDown = true;
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });
  track.addEventListener('mouseleave', () => isDown = false);
  track.addEventListener('mouseup', () => isDown = false);
  track.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    track.scrollLeft = scrollLeft - (x - startX) * 1.5;
  });
}

// PARALLAX HERO
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const hero = document.getElementById('hero');
  if (hero && scrollY < window.innerHeight) {
    const grid = hero.querySelector('.hero-grid');
    const content = hero.querySelector('.hero-content');
    if (grid) grid.style.transform = `translateY(${scrollY * 0.3}px)`;
    if (content) content.style.transform = `translateY(${scrollY * 0.2}px)`;
    if (content) content.style.opacity = 1 - scrollY / (window.innerHeight * 0.8);
  }
});

// SMOOTH ANCHOR SCROLLING
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// FORM SUBMIT
document.querySelector('.form-submit')?.addEventListener('click', function() {
  this.textContent = 'Sending...';
  setTimeout(() => {
    this.textContent = '✓ We\'ll be in touch shortly';
    this.style.background = 'var(--gold-deep)'; this.style.color = 'var(--ink)';
  }, 1500);
});

/* EXPERIENCE CENTER AUTO GALLERY */

const experienceImages = [
    "images/experience/exp1.jpg",
    "images/experience/exp2.jpg",
    "images/experience/exp3.jpg",
    "images/experience/exp4.jpg",
    "images/experience/exp5.jpg",
    "images/experience/exp6.jpg"
];

let currentExpIndex = 0;

function changeExperienceImages() {

    const img1 = document.getElementById("expImg1");
    const img2 = document.getElementById("expImg2");
    const img3 = document.getElementById("expImg3");

    if (!img1 || !img2 || !img3) return;

    img1.classList.add("fade-out");
    img2.classList.add("fade-out");
    img3.classList.add("fade-out");

    setTimeout(() => {

        currentExpIndex =
            (currentExpIndex + 1) %
            experienceImages.length;

        img1.src =
            experienceImages[currentExpIndex];

        img2.src =
            experienceImages[
                (currentExpIndex + 1) %
                experienceImages.length
            ];

        img3.src =
            experienceImages[
                (currentExpIndex + 2) %
                experienceImages.length
            ];

        img1.classList.remove("fade-out");
        img2.classList.remove("fade-out");
        img3.classList.remove("fade-out");

    }, 400);
}

setInterval(changeExperienceImages, 4000);

/* ==========================
   STYLE QUIZ - OTHER OPTION
========================== */

const otherStyle = document.getElementById('otherStyle');
const otherStyleInput = document.getElementById('otherStyleInput');

if (otherStyle && otherStyleInput) {

  otherStyleInput.style.display = 'none';

  document.querySelectorAll('input[name="style"]').forEach(radio => {

    radio.addEventListener('change', () => {

      if (radio.id === 'otherStyle') {
        otherStyleInput.style.display = 'block';
      } else {
        otherStyleInput.style.display = 'none';
        otherStyleInput.value = '';
      }

    });

  });

}

 
/* ==========================================
   TESTIMONIAL BEFORE / AFTER SLIDER
========================================== */

const testimonialData = [

    {
        before: "images/testimonials/project1-before.jpg",
        after: "images/testimonials/project1-after.jpg",
        title: "MTC Spaces transformed our dream kitchen.",
        review: "From concept to execution, every detail was handled perfectly. The quality exceeded expectations.",
        client: "Maiteryi Yedavalli",
        location: "Hyderabad, Telangana"
    },
    
    {
        before: "images/testimonials/project2-before.jpg",
        after: "images/testimonials/project2-after.jpg",
        title: "Our living room feels like a luxury hotel.",
        review: "The design team understood our lifestyle and created something beautiful.",
        client: "Rahul Sharma",
        location: "Gachibowli, Hyderabad"
    },
    
    {
        before: "images/testimonials/project3-before.jpg",
        after: "images/testimonials/project3-after.jpg",
        title: "Worth every rupee.",
        review: "Amazing craftsmanship and premium finishing throughout the home.",
        client: "Kiran Reddy",
        location: "Jubilee Hills, Hyderabad"
    },

    {
        before: "images/testimonials/project4-before.jpg",
        after: "images/testimonials/project4-after.jpg",
        title: "Worth every rupee.",
        review: "Amazing craftsmanship and premium finishing throughout the home.",
        client: "Kiran Reddy",
        location: "Jubilee Hills, Hyderabad"
    }
    
    ];
    
    let testimonialIndex = 0;
    
    /* ==========================================
       LOAD TESTIMONIAL
    ========================================== */
    
    function loadTestimonial(index) {
    
        document.getElementById("beforeImage").src =
            testimonialData[index].before;
    
        document.getElementById("afterImage").src =
            testimonialData[index].after;
    
        document.getElementById("reviewTitle").textContent =
            testimonialData[index].title;
    
        document.getElementById("reviewText").textContent =
            testimonialData[index].review;
    
        document.getElementById("clientName").textContent =
            testimonialData[index].client;
    
        document.getElementById("clientLocation").textContent =
            testimonialData[index].location;
    
        const afterWrapper =
            document.getElementById("afterWrapper");
    
        const handle =
            document.getElementById("sliderHandle");
    
        const sliderLine =
            document.querySelector(".slider-line");
    
        if (afterWrapper && handle) {
    
            afterWrapper.style.width = "50%";
            handle.style.left = "50%";
    
            if(sliderLine){
                sliderLine.style.left = "50%";
            }
        }
    }
    
    /* ==========================================
       NEXT BUTTON
    ========================================== */
    
    document.getElementById("nextTestimonial")
    ?.addEventListener("click", () => {
    
        testimonialIndex++;
    
        if (testimonialIndex >= testimonialData.length) {
            testimonialIndex = 0;
        }
    
        loadTestimonial(testimonialIndex);
    
    });
    
    /* ==========================================
       PREVIOUS BUTTON
    ========================================== */
    
    document.getElementById("prevTestimonial")
    ?.addEventListener("click", () => {
    
        testimonialIndex--;
    
        if (testimonialIndex < 0) {
            testimonialIndex = testimonialData.length - 1;
        }
    
        loadTestimonial(testimonialIndex);
    
    });
    
    /* ==========================================
       HOVER FOLLOW COMPARISON SLIDER
    ========================================== */
    
    const compareContainer =
    document.querySelector(".compare-container");
    
    const handle =
    document.getElementById("sliderHandle");
    
    const afterWrapper =
    document.getElementById("afterWrapper");
    
    const sliderLine =
    document.querySelector(".slider-line");
    
    if (
        compareContainer &&
        handle &&
        afterWrapper
    ) {
    
        compareContainer.addEventListener(
            "mousemove",
            (e) => {
    
            const rect =
            compareContainer.getBoundingClientRect();
    
            let position =
            e.clientX - rect.left;
    
            position = Math.max(
                0,
                Math.min(position, rect.width)
            );
    
            afterWrapper.style.width =
                position + "px";
    
            handle.style.left =
                position + "px";
    
            if(sliderLine){
                sliderLine.style.left =
                    position + "px";
            }
    
        });
    
        compareContainer.addEventListener(
            "mouseleave",
            () => {
    
            afterWrapper.style.width =
                "50%";
    
            handle.style.left =
                "50%";
    
            if(sliderLine){
                sliderLine.style.left =
                    "50%";
            }
    
        });
    
    }
    
    /* ==========================================
       INITIAL LOAD
    ========================================== */
    
    loadTestimonial(0);
/* ==========================================
   GOOGLE SHEETS LEAD FORM
========================================== */

const submitBtn = document.getElementById("submitForm");

if (submitBtn) {

  submitBtn.addEventListener("click", async (e) => {

    e.preventDefault();

    const message = document.getElementById("formMessage");

    const data = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      service: document.getElementById("service").value,
      newsletter: document.getElementById("newsletter").checked ? "Yes" : "No"
    };

    try {

      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbyI1lDeFsMWjUsT0fdDqzx6uDIysWeS6QWs-hfbb7gAIaho-Srk5Q8iswBpfpEGuypXig/exec",
        {
          method: "POST",
          body: JSON.stringify(data)
        }
      );

      const result = await response.text();

      console.log("Response:", result);

      if (response.ok) {

        message.innerHTML =
          "✅ Thank you! Our team will contact you shortly.";

        message.style.color = "#8DB600";

        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("phone").value = "";
        document.getElementById("service").selectedIndex = 0;
        document.getElementById("newsletter").checked = false;

      } else {

        throw new Error(result);

      }

    } catch (error) {

      console.error(error);

      message.innerHTML =
        "❌ Something went wrong. Please try again.";

      message.style.color = "red";

    }

  });

}
/* ==========================================
   STYLE QUIZ GOOGLE SHEETS
========================================== */

const quizForm = document.getElementById("styleQuizForm");

if (quizForm) {

  quizForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const getValue = (name) => {
      const selected = document.querySelector(
        `input[name="${name}"]:checked`
      );
      return selected ? selected.value : "";
    };

    const data = {
      formType: "quiz",
      style: getValue("style"),
      feel: getValue("feel"),
      palette: getValue("palette"),
      kitchen: getValue("kitchen"),
      finish: getValue("finish"),
      storage: getValue("storage"),
      bedroom: getValue("bedroom"),
      budget: getValue("budget"),
      mustHave: document.getElementById("mustHave").value
    };

    const message = document.getElementById("quizMessage");

    try {

      message.innerHTML = "Submitting...";
      message.style.color = "#666";

      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbxtU--gvYNsOBm8xj7vnOgh0x7qryDVXC51BW0nOF_HdLGPh_-jIAYvCYT6KQRTGO8f/exec",
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "text/plain;charset=utf-8"
          },
          body: JSON.stringify(data)
        }
      );

      const result = await response.text();

      console.log("Response:", result);

      message.innerHTML =
        "✅ Checklist submitted successfully.";

      message.style.color = "#8DB600";

      quizForm.reset();

    } catch (error) {

      console.error(
        "QUIZ SUBMISSION ERROR:",
        error
      );

      message.innerHTML =
        `❌ Submission failed.<br>${error.message}`;

      message.style.color = "red";

    }

  });

}