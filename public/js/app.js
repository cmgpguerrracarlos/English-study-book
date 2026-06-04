const state = {
  placementAnswers: new Map()
};

const views = document.querySelectorAll("[data-view]");
const navButtons = document.querySelectorAll("[data-view-link]");

function showView(viewName) {
  views.forEach((view) => view.classList.toggle("is-visible", view.dataset.view === viewName));
  navButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.viewLink === viewName);
  });
}

function renderSkills() {
  const container = document.querySelector("#skillCards");
  container.innerHTML = learningData.skills.map((skill) => `
    <article class="skill-card tone-${skill.tone}">
      <div class="skill-card-header">
        <h3>${skill.name}</h3>
        <span>${skill.score}%</span>
      </div>
      <div class="progress-track" aria-hidden="true">
        <span style="width: ${skill.score}%"></span>
      </div>
      <p>${skill.focus}</p>
    </article>
  `).join("");
}

function renderPlacement() {
  const container = document.querySelector("#placementQuestions");
  container.innerHTML = learningData.placement.map((item, questionIndex) => `
    <article class="question-card">
      <h3>${item.question}</h3>
      <div class="option-list">
        ${item.options.map((option) => `
          <button type="button" data-question="${questionIndex}" data-answer="${option}">${option}</button>
        `).join("")}
      </div>
    </article>
  `).join("");
}

function updatePlacementResult() {
  const total = learningData.placement.length;
  const correct = learningData.placement.filter((item, index) => state.placementAnswers.get(index) === item.answer).length;
  const result = document.querySelector("#placementResult");

  if (state.placementAnswers.size < total) {
    result.textContent = `${state.placementAnswers.size}/${total} preguntas respondidas.`;
    return;
  }

  const level = correct >= 3 ? "B2" : correct === 2 ? "B1+" : "B1";
  result.textContent = `Nivel estimado: ${level}. Recomendacion: empezar con Modal verbs for nuance y Error correction clinic.`;
}

function renderPath() {
  const container = document.querySelector("#studyPath");
  container.innerHTML = learningData.path.map((unit, index) => `
    <article class="path-item">
      <span class="path-index">${index + 1}</span>
      <div>
        <p class="eyebrow">${unit.level} - ${unit.status}</p>
        <h3>${unit.title}</h3>
        <p>${unit.goal}</p>
      </div>
    </article>
  `).join("");
}

function renderExercises() {
  const container = document.querySelector("#exerciseGrid");
  container.innerHTML = learningData.exercises.map((exercise, index) => `
    <article class="exercise-card">
      <p class="eyebrow">${exercise.type}</p>
      <h3>${exercise.prompt}</h3>
      <button type="button" data-exercise="${index}">Show feedback</button>
      <div class="feedback" id="feedback-${index}" hidden>
        <strong>Answer: ${exercise.answer}</strong>
        <p>${exercise.explanation}</p>
        <small>Common mistake: ${exercise.mistake}</small>
      </div>
    </article>
  `).join("");
}

function renderReviews() {
  const container = document.querySelector("#reviewGrid");
  container.innerHTML = learningData.reviews.map((card) => `
    <article class="review-card">
      <span>${card.tag}</span>
      <h3>${card.front}</h3>
      <p>${card.back}</p>
    </article>
  `).join("");
}

document.addEventListener("click", (event) => {
  const viewLink = event.target.closest("[data-view-link]");
  if (viewLink) {
    showView(viewLink.dataset.viewLink);
  }

  const placementOption = event.target.closest("[data-question]");
  if (placementOption) {
    const questionIndex = Number(placementOption.dataset.question);
    const siblings = placementOption.parentElement.querySelectorAll("button");
    siblings.forEach((button) => button.classList.remove("is-selected"));
    placementOption.classList.add("is-selected");
    state.placementAnswers.set(questionIndex, placementOption.dataset.answer);
    updatePlacementResult();
  }

  const exerciseButton = event.target.closest("[data-exercise]");
  if (exerciseButton) {
    const feedback = document.querySelector(`#feedback-${exerciseButton.dataset.exercise}`);
    feedback.hidden = !feedback.hidden;
  }
});

renderSkills();
renderPlacement();
renderPath();
renderExercises();
renderReviews();
