/* ==============================
   PARTICLE BACKGROUND WITH GENTLE GRAVITATION
   ============================== */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let particles = [];
const particleCount = 80;
let mouse = { x: null, y: null };

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

window.addEventListener("mousemove", (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 1;
    this.baseX = this.x;
    this.baseY = this.y;
    this.dx = (Math.random() - 0.5) * 0.5;
    this.dy = (Math.random() - 0.5) * 0.5;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = "#64ffda";
    ctx.fill();
  }
  update() {
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 150) {
      this.x += dx / 50;
      this.y += dy / 50;
    } else {
      this.x += this.dx;
      this.y += this.dy;
    }
    this.draw();
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function connectParticles() {
  for (let a = 0; a < particles.length; a++) {
    for (let b = a; b < particles.length; b++) {
      let dx = particles[a].x - particles[b].x;
      let dy = particles[a].y - particles[b].y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 120) {
        ctx.strokeStyle = "rgba(100, 255, 218, 0.2)";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p) => p.update());
  connectParticles();
  requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

/* ==============================
   TYPING ANIMATION
   ============================== */
const taglineEl = document.querySelector(".tagline");
const taglineText = ["FL-Researcher", "Problem Solver", "AI Enthusiast"];
let tagIndex = 0;
let charIndex = 0;

function typeTagline() {
  if (charIndex < taglineText[tagIndex].length) {
    taglineEl.textContent += taglineText[tagIndex].charAt(charIndex);
    charIndex++;
    setTimeout(typeTagline, 100);
  } else {
    setTimeout(() => {
      taglineEl.textContent = "";
      charIndex = 0;
      tagIndex = (tagIndex + 1) % taglineText.length;
      typeTagline();
    }, 2000);
  }
}
typeTagline();

/* ==============================
   SMOOTH SCROLL
   ============================== */
document.querySelectorAll('nav#navbar a').forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelector(link.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

/* ==============================
   SCROLL REVEAL ANIMATION
   ============================== */
const revealCards = document.querySelectorAll(".card");
window.addEventListener("scroll", () => {
  const triggerBottom = window.innerHeight * 0.85;
  revealCards.forEach((card) => {
    const boxTop = card.getBoundingClientRect().top;
    if (boxTop < triggerBottom) {
      card.classList.add("visible");
    }
  });
});

/* ==============================
   LOAD PROJECTS FROM JSON
   ============================== */
const projectsGrid = document.getElementById("projects-grid");
fetch("projects.json")
  .then((res) => res.json())
  .then((projects) => {
    projects.forEach((proj) => {
      const card = document.createElement("div");
      card.classList.add("project-card", "tilt-card");
      card.innerHTML = `
        <h3>${proj.title}</h3>
        <p>${proj.shortDesc}</p>
        <p class="project-tech">${proj.tech.join(", ")}</p>
        <a href="#" class="view-more" data-title="${proj.title}">View More</a>
      `;
      projectsGrid.appendChild(card);
    });
    addProjectModalLogic(projects);
    initTilt();
  });

/* ==============================
   LOAD RESEARCH FROM JSON
   ============================== */
const researchGrid = document.getElementById("research-grid");
fetch("research.json")
  .then((res) => res.json())
  .then((research) => {
    research.forEach((item) => {
      const card = document.createElement("div");
      card.classList.add("project-card", "tilt-card");
      card.innerHTML = `
        <h3>${item.title}</h3>
        <p><em>${item.conference}</em></p>
        <p>${item.summary}</p>
        <p class="project-tech">${item.methods.join(", ")}</p>
        <a href="#" class="view-research" data-title="${item.title}">View More</a>
      `;
      researchGrid.appendChild(card);
    });
    addResearchModalLogic(research);
    initTilt();
  });

/* ==============================
   PROJECT MODAL LOGIC
   ============================== */


function addProjectModalLogic(projects) {
  const modal = document.getElementById("project-modal");
  const modalBody = document.getElementById("modal-body");
  const closeBtn = document.querySelector(".modal-close");

  document.querySelectorAll(".view-more").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const title = btn.getAttribute("data-title");
      const project = projects.find((p) => p.title === title);

      // Split into sections
      const sections = [
        { key: "Problem", icon: "📌" },
        { key: "Solution", icon: "💡" },
        { key: "Impact", icon: "🚀" },
        { key: "Features", icon: "🛠" }
      ];

      let formattedDesc = "";
      sections.forEach(({ key, icon }) => {
        const regex = new RegExp(`\\*\\*${key}:\\*\\*(.*?)((?=\\*\\*)|$)`, "s");
        const match = project.longDesc.match(regex);
        if (match) {
          formattedDesc += `<div class="modal-section">
            <h3>${icon} ${key}</h3>
            <p>${match[1].trim()}</p>
          </div>`;
        }
      });

      modalBody.innerHTML = `
        <div class="modal-content-container">
          <h2>${project.title}</h2>
          ${formattedDesc}
          <div class="modal-section">
            <h3>🔧 Tech Stack</h3>
            <p>${project.tech.join(", ")}</p>
          </div>
          <div class="modal-links">
            ${project.github ? `<a href="${project.github}" target="_blank" class="modal-btn"><i class="fab fa-github"></i> GitHub</a>` : ""}
            ${project.demo ? `<a href="${project.demo}" target="_blank" class="modal-btn"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ""}
          </div>
        </div>
      `;
      modal.style.display = "block";
    });
  });

  closeBtn.addEventListener("click", () => (modal.style.display = "none"));
  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });
}


/* ==============================
   RESEARCH MODAL LOGIC
   ============================== */
function addResearchModalLogic(research) {
  const modal = document.getElementById("project-modal");
  const modalBody = document.getElementById("modal-body");
  const closeBtn = document.querySelector(".modal-close");

  document.querySelectorAll(".view-research").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const title = btn.getAttribute("data-title");
      const paper = research.find((r) => r.title === title);
      modalBody.innerHTML = `
        <h2>${paper.title}</h2>
        <p><strong>Conference:</strong> ${paper.conference}</p>
        <p>${paper.summary}</p>
        <p><strong>Methods:</strong> ${paper.methods.join(", ")}</p>
        <p><strong>Datasets:</strong> ${paper.datasets.join(", ")}</p>
        <ul>${paper.results.map(r => `<li>${r}</li>`).join("")}</ul>
        ${paper.link ? `<p><a href="${paper.link}" target="_blank">View Project</a></p>` : ""}
      `;
      modal.style.display = "block";
    });
  });

  closeBtn.addEventListener("click", () => (modal.style.display = "none"));
  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });
}

/* ==============================
   MAGNETIC BUTTONS
   ============================== */
document.querySelectorAll(".magnetic").forEach((btn) => {
  btn.addEventListener("mousemove", (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "";
  });
});

/* ==============================
   3D TILT EFFECT
   ============================== */
function initTilt() {
  const tiltCards = document.querySelectorAll(".tilt-card");
  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * 5;
      const rotateY = ((x - centerX) / centerX) * 5;
      card.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}
