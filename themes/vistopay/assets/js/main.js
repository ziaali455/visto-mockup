// ===== VistoPay Dynamic Interactions =====

// Cursor glow effect
document.addEventListener('mousemove', (e) => {
  const glow = document.getElementById('cursorGlow');
  if (glow) {
    glow.style.left = (e.clientX - 150) + 'px';
    glow.style.top = (e.clientY - 150) + 'px';
  }
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }
});

// Mobile menu toggle
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');
if (mobileToggle && navLinks) {
  mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

// Scroll reveal
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

revealElements.forEach(el => revealObserver.observe(el));

// ===== Animated counter for stats =====
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const suffix = counter.getAttribute('data-suffix') || '';
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += step;
      if (current < target) {
        counter.textContent = Math.floor(current).toLocaleString() + suffix;
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target.toLocaleString() + suffix;
      }
    };
    updateCounter();
  });
}

const statsSection = document.querySelector('.stats-bar');
if (statsSection) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  statsObserver.observe(statsSection);
}

// ===== Survey Logic =====
const surveyQuestions = [
  {
    question: "What is the primary purpose of your trip to the US?",
    subtitle: "This helps us understand your visa category",
    options: ["Business meetings or conferences", "Tourism or visiting family", "Medical treatment", "Short-term training or education"],
    scores: [3, 2, 2, 2]
  },
  {
    question: "What is your current country of residence?",
    subtitle: "Your home country affects visa processing",
    options: ["Country with US visa waiver program", "Country with standard visa requirements", "Country with additional screening", "I already have a valid US visa"],
    scores: [3, 2, 1, 3]
  },
  {
    question: "Do you have strong ties to your home country?",
    subtitle: "Property, employment, family, etc.",
    options: ["Yes - full-time job, property, and family", "Yes - employed with family ties", "Somewhat - I'm a student with family", "Limited ties currently"],
    scores: [3, 3, 2, 1]
  },
  {
    question: "Have you previously traveled internationally?",
    subtitle: "Travel history demonstrates compliance",
    options: ["Yes, extensively (5+ countries)", "Yes, a few countries (2-4)", "Only neighboring countries", "This would be my first international trip"],
    scores: [3, 2, 1, 1]
  },
  {
    question: "How long do you plan to stay in the US?",
    subtitle: "Duration affects your visa application",
    options: ["Less than 2 weeks", "2-4 weeks", "1-3 months", "3-6 months"],
    scores: [3, 3, 2, 1]
  },
  {
    question: "Can you demonstrate sufficient financial means?",
    subtitle: "Proof of funds for your stay",
    options: ["Yes - stable income and savings", "Yes - sponsored by employer/organization", "Partially - have some savings", "I will need financial support"],
    scores: [3, 3, 2, 1]
  }
];

let currentQuestion = 0;
let answers = [];

function initSurvey() {
  const container = document.getElementById('surveyApp');
  if (!container) return;
  renderQuestion();
}

function renderQuestion() {
  const container = document.getElementById('surveyApp');
  if (!container) return;

  if (currentQuestion >= surveyQuestions.length) {
    renderResult();
    return;
  }

  const q = surveyQuestions[currentQuestion];

  let progressBars = '';
  for (let i = 0; i < surveyQuestions.length; i++) {
    let cls = 'bar';
    if (i < currentQuestion) cls += ' completed';
    else if (i === currentQuestion) cls += ' active';
    progressBars += '<div class="' + cls + '"></div>';
  }

  let optionsHTML = '';
  q.options.forEach((opt, idx) => {
    const selected = answers[currentQuestion] === idx ? ' selected' : '';
    optionsHTML += '<div class="survey-option' + selected + '" onclick="selectOption(' + idx + ')">' +
      '<div class="radio"></div>' +
      '<span>' + opt + '</span>' +
      '</div>';
  });

  container.innerHTML =
    '<div class="survey-progress">' + progressBars + '</div>' +
    '<div class="survey-card">' +
      '<p class="section-label">Question ' + (currentQuestion + 1) + ' of ' + surveyQuestions.length + '</p>' +
      '<h2>' + q.question + '</h2>' +
      '<p class="question-subtitle">' + q.subtitle + '</p>' +
      '<div class="survey-options">' + optionsHTML + '</div>' +
      '<div class="survey-nav">' +
        (currentQuestion > 0
          ? '<button class="btn btn-outline" onclick="prevQuestion()">Back</button>'
          : '<div></div>') +
        '<button class="btn btn-primary" onclick="nextQuestion()" id="nextBtn"' +
          (answers[currentQuestion] === undefined ? ' style="opacity:0.5;pointer-events:none;"' : '') +
        '>Continue</button>' +
      '</div>' +
    '</div>';
}

function selectOption(idx) {
  answers[currentQuestion] = idx;
  renderQuestion();
}

function nextQuestion() {
  if (answers[currentQuestion] === undefined) return;
  currentQuestion++;
  renderQuestion();
}

function prevQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    renderQuestion();
  }
}

function renderResult() {
  const container = document.getElementById('surveyApp');
  if (!container) return;

  let totalScore = 0;
  let maxScore = surveyQuestions.length * 3;
  answers.forEach((ansIdx, qIdx) => {
    totalScore += surveyQuestions[qIdx].scores[ansIdx];
  });

  const percentage = Math.round((totalScore / maxScore) * 100);
  const passed = percentage >= 60;

  let progressBars = '';
  for (let i = 0; i < surveyQuestions.length; i++) {
    progressBars += '<div class="bar completed"></div>';
  }

  container.innerHTML =
    '<div class="survey-progress">' + progressBars + '</div>' +
    '<div class="survey-card result-card">' +
      '<div class="result-icon">' + (passed ? '\u2728' : '\u{1F4CB}') + '</div>' +
      '<div class="score-circle">' +
        '<span class="score-value">' + percentage + '%</span>' +
        '<span class="score-label">Score</span>' +
      '</div>' +
      '<h2>' + (passed
        ? 'Great News! You Likely Qualify'
        : 'Let\u2019s Strengthen Your Application') +
      '</h2>' +
      '<p>' + (passed
        ? 'Based on your responses, you show strong eligibility indicators for a B1/B2 visa. You\'re now eligible to join the VistoPay debit card roadmap for seamless spending in the US.'
        : 'Your profile shows some areas that could be strengthened. We recommend consulting with an immigration advisor. You can still join the VistoPay waitlist to get your debit card when ready.') +
      '</p>' +
      '<div class="hero-buttons">' +
        '<a href="/roadmap/" class="btn btn-primary">' +
          (passed ? 'View Your Roadmap' : 'Join Waitlist') +
          ' \u2192</a>' +
        '<button class="btn btn-outline" onclick="resetSurvey()">Retake Survey</button>' +
      '</div>' +
    '</div>';
}

function resetSurvey() {
  currentQuestion = 0;
  answers = [];
  renderQuestion();
}

// Initialize survey if on survey page
document.addEventListener('DOMContentLoaded', initSurvey);

// ===== Typed text effect for hero =====
function typeEffect(element, text, speed) {
  if (!element) return;
  let i = 0;
  element.textContent = '';
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

document.addEventListener('DOMContentLoaded', () => {
  const typedEl = document.querySelector('.typed-text');
  if (typedEl) {
    const text = typedEl.getAttribute('data-text');
    typeEffect(typedEl, text, 50);
  }
});
