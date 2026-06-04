const STORAGE_KEY = "english-study-progress";

const state = {
  placementAnswers: new Map(),
  progress: loadProgress()
};

const views = document.querySelectorAll("[data-view]");
const navButtons = document.querySelectorAll("[data-view-link]");

function loadProgress() {
  const fallback = { attempts: [], completedLessons: [], reviewQueue: [] };
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || fallback;
  } catch (error) {
    return fallback;
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
}

function normalizeAnswer(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[.?!]/g, "")
    .replace(/\s+/g, " ");
}

function getAccuracy() {
  if (state.progress.attempts.length === 0) {
    return 68;
  }

  const correct = state.progress.attempts.filter((attempt) => attempt.isCorrect).length;
  return Math.round((correct / state.progress.attempts.length) * 100);
}

function getWeakSkillCount() {
  const incorrectAttempts = state.progress.attempts.filter((attempt) => !attempt.isCorrect);
  return Math.max(learningData.reviews.length, incorrectAttempts.length);
}

function showView(viewName) {
  views.forEach((view) => view.classList.toggle("is-visible", view.dataset.view === viewName));
  navButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.viewLink === viewName);
  });
}

function renderDashboard() {
  document.querySelector("#accuracyMetric").textContent = `${getAccuracy()}%`;
  document.querySelector("#attemptsMetric").textContent = state.progress.attempts.length;
  document.querySelector("#reviewMetric").textContent = getWeakSkillCount();
  document.querySelector("#streakMetric").textContent = state.progress.attempts.length > 0 ? 2 : 1;
  document.querySelector("#nextLessonTitle").textContent = learningData.lesson.title;
  document.querySelector("#nextLessonGoal").textContent = learningData.lesson.goal;
}

function renderSkills() {
  const container = document.querySelector("#skillCards");
  container.innerHTML = learningData.skills.map((skill) => {
    const skillAttempts = state.progress.attempts.filter((attempt) => attempt.skill === skill.name);
    const skillScore = skillAttempts.length
      ? Math.round((skillAttempts.filter((attempt) => attempt.isCorrect).length / skillAttempts.length) * 100)
      : skill.score;

    return `
    <article class="skill-card tone-${skill.tone}">
      <div class="skill-card-header">
        <h3>${skill.name}</h3>
        <span>${skillScore}%</span>
      </div>
      <div class="progress-track" aria-hidden="true">
        <span style="width: ${skillScore}%"></span>
      </div>
      <p>${skill.focus}</p>
    </article>
  `;
  }).join("");
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

function renderLesson() {
  document.querySelector("#lessonLevel").textContent = `${learningData.lesson.level} lesson`;
  document.querySelector("#lessonTitle").textContent = learningData.lesson.title;
  document.querySelector("#lessonGoal").textContent = learningData.lesson.goal;
  document.querySelector("#lessonFocus").textContent = learningData.lesson.focus;
  document.querySelector("#lessonTeacherNote").textContent = learningData.lesson.teacherNote;
  document.querySelector("#lessonChecklist").innerHTML = learningData.lesson.checklist
    .map((item) => `<li>${item}</li>`)
    .join("");
}

function renderExercises() {
  const container = document.querySelector("#exerciseGrid");
  container.innerHTML = learningData.exercises.map((exercise, index) => `
    <article class="exercise-card">
      <p class="eyebrow">${exercise.type} - ${exercise.difficulty}</p>
      <h3>${exercise.prompt}</h3>
      <label class="answer-field">
        <span>Your answer</span>
        <input type="text" data-answer-input="${index}" placeholder="Write your answer">
      </label>
      <button type="button" data-submit-exercise="${index}">Check answer</button>
      <div class="feedback" id="feedback-${index}" hidden>
        <strong>Answer: ${exercise.answer}</strong>
        <p>${exercise.explanation}</p>
        <small>Common mistake: ${exercise.mistake}</small>
        <em>Example: ${exercise.example}</em>
      </div>
    </article>
  `).join("");

  renderPracticeSummary();
}

function renderReviews() {
  const container = document.querySelector("#reviewGrid");
  const missedCards = state.progress.attempts
    .filter((attempt) => !attempt.isCorrect)
    .map((attempt) => ({
      front: attempt.prompt,
      back: attempt.answer,
      tag: attempt.skill
    }));
  const cards = [...missedCards, ...learningData.reviews];

  container.innerHTML = cards.map((card) => `
    <article class="review-card">
      <span>${card.tag}</span>
      <h3>${card.front}</h3>
      <p>${card.back}</p>
    </article>
  `).join("");
}

function renderPracticeSummary() {
  const container = document.querySelector("#practiceSummary");
  const attempts = state.progress.attempts.length;
  const accuracy = getAccuracy();
  const lastAttempt = state.progress.attempts.at(-1);
  const lastAttemptText = lastAttempt
    ? `Ultimo intento: ${lastAttempt.isCorrect ? "correcto" : "a revisar"} en ${lastAttempt.skill}.`
    : "Aun no hay intentos guardados en esta sesion.";

  container.innerHTML = `
    <article>
      <strong>${attempts}</strong>
      <span>attempts</span>
    </article>
    <article>
      <strong>${accuracy}%</strong>
      <span>accuracy</span>
    </article>
    <p>${lastAttemptText}</p>
  `;
}

function submitExercise(index) {
  const exercise = learningData.exercises[index];
  const input = document.querySelector(`[data-answer-input="${index}"]`);
  const feedback = document.querySelector(`#feedback-${index}`);
  const normalizedAnswer = normalizeAnswer(input.value);
  const acceptedAnswers = exercise.acceptedAnswers.map(normalizeAnswer);
  const isCorrect = acceptedAnswers.includes(normalizedAnswer);

  if (!normalizedAnswer) {
    input.focus();
    return;
  }

  state.progress.attempts.push({
    id: exercise.id,
    prompt: exercise.prompt,
    answer: exercise.answer,
    userAnswer: input.value,
    isCorrect,
    skill: exercise.skill,
    topic: exercise.topic,
    createdAt: new Date().toISOString()
  });

  feedback.hidden = false;
  feedback.classList.toggle("is-correct", isCorrect);
  feedback.classList.toggle("is-incorrect", !isCorrect);
  feedback.dataset.result = isCorrect ? "Correct" : "Review";
  saveProgress();
  renderDashboard();
  renderSkills();
  renderReviews();
  renderPracticeSummary();
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

  const exerciseButton = event.target.closest("[data-submit-exercise]");
  if (exerciseButton) {
    submitExercise(Number(exerciseButton.dataset.submitExercise));
  }
});

renderDashboard();
renderSkills();
renderPlacement();
renderPath();
renderLesson();
renderExercises();
renderReviews();
