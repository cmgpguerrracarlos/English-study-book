const STORAGE_KEY = "english-study-progress";

const state = {
  placementAnswers: new Map(),
  progress: loadProgress()
};

const views = document.querySelectorAll("[data-view]");
const navButtons = document.querySelectorAll("[data-view-link]");

function loadProgress() {
  const fallback = { attempts: [], completedLessons: [], reviewQueue: [], writings: [] };
  try {
    return { ...fallback, ...(JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}) };
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

function countWords(text) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
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

function getSkillSnapshot() {
  return learningData.skills.map((skill) => {
    const attempts = state.progress.attempts.filter((attempt) => attempt.skill === skill.name);
    const score = attempts.length
      ? Math.round((attempts.filter((attempt) => attempt.isCorrect).length / attempts.length) * 100)
      : skill.score;

    return { ...skill, score };
  });
}

function getWeakestSkill() {
  const snapshot = getSkillSnapshot().sort((left, right) => left.score - right.score);
  return snapshot[0];
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
  document.querySelector("#streakMetric").textContent =
    state.progress.attempts.length + state.progress.writings.length > 0 ? 2 : 1;
  document.querySelector("#nextLessonTitle").textContent = learningData.lesson.title;
  document.querySelector("#nextLessonGoal").textContent = learningData.lesson.goal;
}

function renderSkills() {
  const container = document.querySelector("#skillCards");
  container.innerHTML = getSkillSnapshot().map((skill) => `
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

function renderRecommendations() {
  const weakestSkill = getWeakestSkill();
  const container = document.querySelector("#recommendationList");
  const lines = learningData.recommendations[weakestSkill.name] || [];

  container.innerHTML = `
    <article class="recommendation-card">
      <p class="eyebrow">Priority skill</p>
      <h3>${weakestSkill.name}</h3>
      <p>${weakestSkill.focus}</p>
    </article>
    ${lines.map((line) => `
      <article class="recommendation-card">
        <p>${line}</p>
      </article>
    `).join("")}
  `;
}

function renderPlacement() {
  const container = document.querySelector("#placementQuestions");
  const sections = [...new Set(learningData.placement.map((item) => item.section))];

  container.innerHTML = sections.map((section) => {
    const items = learningData.placement.filter((item) => item.section === section);
    return `
      <section class="placement-section">
        <div class="section-heading compact-heading">
          <p class="eyebrow">${section}</p>
        </div>
        ${items.map((item) => {
          const questionIndex = learningData.placement.indexOf(item);
          if (item.type === "text") {
            return `
              <article class="question-card">
                <h3>${item.question}</h3>
                <label class="answer-field">
                  <span>Answer</span>
                  <input type="text" data-placement-text="${questionIndex}" placeholder="Write a short answer">
                </label>
              </article>
            `;
          }

          return `
            <article class="question-card">
              <h3>${item.question}</h3>
              <div class="option-list">
                ${item.options.map((option) => `
                  <button type="button" data-question="${questionIndex}" data-answer="${option}">${option}</button>
                `).join("")}
              </div>
            </article>
          `;
        }).join("")}
      </section>
    `;
  }).join("");
}

function updatePlacementResult() {
  const total = learningData.placement.length;
  const entries = learningData.placement.map((item, index) => {
    const rawAnswer = state.placementAnswers.get(index);
    const normalizedRawAnswer = rawAnswer ? normalizeAnswer(rawAnswer) : "";
    const expectedAnswers = item.acceptedAnswers ? item.acceptedAnswers.map(normalizeAnswer) : [normalizeAnswer(item.answer)];
    return {
      ...item,
      isCorrect: expectedAnswers.includes(normalizedRawAnswer)
    };
  });
  const answered = entries.filter((item, index) => state.placementAnswers.has(index)).length;
  const correct = entries.filter((item) => item.isCorrect).length;
  const result = document.querySelector("#placementResult");
  const summary = document.querySelector("#placementSkillSummary");

  if (answered < total) {
    result.textContent = `${answered}/${total} preguntas respondidas.`;
    summary.innerHTML = "";
    return;
  }

  const skills = ["Grammar", "Vocabulary", "Reading", "Writing"];
  const skillScores = skills.map((skill) => {
    const items = entries.filter((item) => item.skill === skill);
    const score = Math.round((items.filter((item) => item.isCorrect).length / items.length) * 100);
    return { skill, score };
  });
  const average = Math.round(skillScores.reduce((sum, item) => sum + item.score, 0) / skillScores.length);
  const level = average >= 85 ? "C1" : average >= 65 ? "B2" : average >= 45 ? "B1+" : "B1";
  const weakestSkill = [...skillScores].sort((left, right) => left.score - right.score)[0];

  summary.innerHTML = skillScores.map((item) => `
    <article>
      <strong>${item.score}%</strong>
      <span>${item.skill}</span>
    </article>
  `).join("");
  result.textContent = `Nivel estimado: ${level}. Skill prioritaria: ${weakestSkill.skill}. Ruta recomendada: ${level === "C1" ? "Advanced precision path" : level === "B2" ? "Fluency Builder B2" : "Bridge to B2"}.`;
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
      tag: attempt.skill,
      due: "Now"
    }));
  const cards = [...missedCards, ...learningData.reviews.map((card, index) => ({
    ...card,
    due: index < 2 ? "Today" : "This week"
  }))];

  container.innerHTML = cards.map((card) => `
    <article class="review-card">
      <span>${card.tag} · ${card.due}</span>
      <h3>${card.front}</h3>
      <p>${card.back}</p>
    </article>
  `).join("");

  renderReviewOverview(cards);
}

function renderReviewOverview(cards) {
  const dueNow = cards.filter((card) => card.due === "Now").length;
  const dueToday = cards.filter((card) => card.due === "Today").length;
  const total = cards.length;
  const container = document.querySelector("#reviewOverview");

  container.innerHTML = `
    <article>
      <strong>${total}</strong>
      <span>cards</span>
    </article>
    <article>
      <strong>${dueNow}</strong>
      <span>due now</span>
    </article>
    <article>
      <strong>${dueToday}</strong>
      <span>today</span>
    </article>
  `;
}

function renderHistory() {
  const container = document.querySelector("#historyList");
  const entries = [
    ...state.progress.attempts.map((attempt) => ({ ...attempt })),
    ...state.progress.writings.map((writing) => ({
      skill: "Writing",
      isCorrect: writing.average >= 3.5,
      prompt: learningData.writing.title,
      topic: `score ${writing.average}/4`,
      createdAt: writing.createdAt
    }))
  ]
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .slice(0, 5);

  if (entries.length === 0) {
    container.innerHTML = `
      <article class="history-card">
        <p>No hay historial todavia. El primer intento aparecera aqui con skill, resultado y fecha.</p>
      </article>
    `;
    return;
  }

  container.innerHTML = entries.map((attempt) => `
    <article class="history-card">
      <div class="history-header">
        <strong>${attempt.skill}</strong>
        <span class="${attempt.isCorrect ? "status-ok" : "status-review"}">${attempt.isCorrect ? "Correct" : "Review"}</span>
      </div>
      <p>${attempt.prompt}</p>
      <small>${new Date(attempt.createdAt).toLocaleDateString("es-UY")} · ${attempt.topic}</small>
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

function renderWritingLab() {
  document.querySelector("#writingTitle").textContent = learningData.writing.title;
  document.querySelector("#writingPrompt").textContent = learningData.writing.prompt;
  document.querySelector("#writingWordTarget").textContent = learningData.writing.wordTarget;
  document.querySelector("#writingChecklist").innerHTML = learningData.writing.checklist
    .map((item) => `<li>${item}</li>`)
    .join("");
  document.querySelector("#writingRubric").innerHTML = learningData.writing.rubric
    .map((item) => `
      <article class="rubric-card">
        <strong>${item.name}</strong>
        <p>${item.description}</p>
      </article>
    `).join("");

  const lastWriting = state.progress.writings.at(-1);
  document.querySelector("#writingInput").value = lastWriting?.draft || "";
  updateWritingWordCount();
  renderWritingFeedback(lastWriting);
}

function updateWritingWordCount() {
  const draft = document.querySelector("#writingInput").value;
  const words = countWords(draft);
  document.querySelector("#writingWordCount").textContent = words;
  document.querySelector("#writingStatus").textContent = words === 0 ? "Draft" : words < 140 ? "Developing" : "Ready";
}

function evaluateWritingDraft(draft) {
  const words = countWords(draft);
  const lowerDraft = draft.toLowerCase();
  const hasModal = /(may|might|could|should)\b/.test(lowerDraft);
  const hasSteps = /(first|next|finally|step|follow up|schedule|clarify)/.test(lowerDraft);
  const hasProfessionalTone = /(regards|best|thank you|i would|i suggest|i recommend)/.test(lowerDraft);
  const scores = {
    Content: words >= 120 && hasSteps ? 4 : words >= 90 ? 3 : 2,
    Organization: /(dear|hello|hi)/.test(lowerDraft) && /(regards|best)/.test(lowerDraft) ? 4 : words >= 110 ? 3 : 2,
    Language: hasModal ? 4 : 3,
    Register: hasProfessionalTone ? 4 : 3
  };
  const average = Math.round((Object.values(scores).reduce((sum, value) => sum + value, 0) / 4) * 10) / 10;
  const strengths = [];
  const nextSteps = [];

  if (hasModal) {
    strengths.push("You used modal language to express possibility or recommendation.");
  } else {
    nextSteps.push("Add at least one modal such as 'may have' or 'should' to show nuance.");
  }

  if (hasProfessionalTone) {
    strengths.push("The tone is appropriately professional for an internal email.");
  } else {
    nextSteps.push("Soften the tone with phrases like 'I would suggest' or 'It may be useful to'.");
  }

  if (words < 140) {
    nextSteps.push("Develop the message a little more so the task feels complete.");
  } else {
    strengths.push("The draft is close to the expected length for this task.");
  }

  if (!hasSteps) {
    nextSteps.push("Include two concrete next steps for the manager.");
  } else {
    strengths.push("You included action-oriented follow-up ideas.");
  }

  return { draft, words, scores, average, strengths, nextSteps, createdAt: new Date().toISOString() };
}

function renderWritingFeedback(result) {
  const container = document.querySelector("#writingFeedback");

  if (!result) {
    container.innerHTML = `
      <article class="lesson-panel">
        <h3>Feedback</h3>
        <p>Evalua un borrador para ver puntuacion por criterio, puntos fuertes y siguientes pasos.</p>
      </article>
    `;
    return;
  }

  container.innerHTML = `
    <article class="lesson-panel">
      <p class="eyebrow">Average score</p>
      <h3>${result.average}/4</h3>
      <div class="score-grid">
        ${Object.entries(result.scores).map(([name, score]) => `
          <article class="score-card">
            <strong>${score}/4</strong>
            <span>${name}</span>
          </article>
        `).join("")}
      </div>
    </article>
    <article class="lesson-panel">
      <h3>Strengths</h3>
      <ul class="feedback-list">
        ${result.strengths.map((item) => `<li>${item}</li>`).join("")}
      </ul>
    </article>
    <article class="lesson-panel">
      <h3>Next steps</h3>
      <ul class="feedback-list">
        ${result.nextSteps.map((item) => `<li>${item}</li>`).join("")}
      </ul>
    </article>
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
  renderRecommendations();
  renderReviews();
  renderHistory();
  renderPracticeSummary();
}

function saveWritingEvaluation() {
  const draft = document.querySelector("#writingInput").value.trim();

  if (!draft) {
    document.querySelector("#writingInput").focus();
    return;
  }

  const result = evaluateWritingDraft(draft);
  state.progress.writings.push(result);
  saveProgress();
  renderDashboard();
  renderRecommendations();
  renderHistory();
  renderWritingFeedback(result);
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
  }

  const exerciseButton = event.target.closest("[data-submit-exercise]");
  if (exerciseButton) {
    submitExercise(Number(exerciseButton.dataset.submitExercise));
  }

  if (event.target.id === "evaluateWriting") {
    saveWritingEvaluation();
  }

  if (event.target.id === "submitPlacement") {
    updatePlacementResult();
  }
});

document.addEventListener("input", (event) => {
  if (event.target.id === "writingInput") {
    updateWritingWordCount();
  }

  if (event.target.matches("[data-placement-text]")) {
    state.placementAnswers.set(Number(event.target.dataset.placementText), event.target.value);
  }
});

renderDashboard();
renderSkills();
renderRecommendations();
renderPlacement();
renderPath();
renderLesson();
renderExercises();
renderWritingLab();
renderReviews();
renderHistory();
