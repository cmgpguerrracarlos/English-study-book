const learningData = {
  skills: [
    { name: "Grammar", score: 68, focus: "Modal nuance and conditionals", tone: "blue" },
    { name: "Vocabulary", score: 74, focus: "Workplace collocations", tone: "green" },
    { name: "Reading", score: 81, focus: "Inference and detail", tone: "amber" },
    { name: "Writing", score: 56, focus: "Paragraph structure", tone: "red" }
  ],
  placement: [
    {
      section: "Grammar",
      type: "choice",
      question: "Choose the best option: If I had known about the meeting, I ___ earlier.",
      options: ["would have arrived", "would arrive", "arrived"],
      answer: "would have arrived",
      skill: "Grammar"
    },
    {
      section: "Grammar",
      type: "text",
      question: "Complete the sentence with one modal phrase: She ___ forgotten the attachment, because the email was sent in a rush.",
      acceptedAnswers: ["may have", "might have", "could have"],
      answer: "may have",
      skill: "Grammar"
    },
    {
      section: "Vocabulary",
      type: "choice",
      question: "Which phrase sounds most natural in a professional email?",
      options: ["I am writing to follow up on...", "I write for follow...", "I am write because..."],
      answer: "I am writing to follow up on...",
      skill: "Vocabulary"
    },
    {
      section: "Vocabulary",
      type: "choice",
      question: "What does 'to bring up a topic' mean?",
      options: ["to mention it", "to forget it", "to finish it"],
      answer: "to mention it",
      skill: "Vocabulary"
    },
    {
      section: "Reading",
      type: "choice",
      question: "Read the sentence: 'Although the proposal seemed promising, the team postponed the launch due to unresolved technical risks.' Why was the launch postponed?",
      options: ["The proposal was rejected immediately", "There were still technical issues", "The team had no budget"],
      answer: "There were still technical issues",
      skill: "Reading"
    },
    {
      section: "Reading",
      type: "text",
      question: "One-word reading task: In the sentence 'Her tone was hesitant, but she eventually agreed', was she confident or unsure?",
      acceptedAnswers: ["unsure"],
      answer: "unsure",
      skill: "Reading"
    },
    {
      section: "Writing",
      type: "choice",
      question: "Which opening is more appropriate for a message to your manager?",
      options: ["Hey, I need to tell you something", "I am writing to update you on the client meeting", "Listen, there is a problem"],
      answer: "I am writing to update you on the client meeting",
      skill: "Writing"
    },
    {
      section: "Writing",
      type: "text",
      question: "Write one diplomatic linker to introduce a suggestion in a professional email.",
      acceptedAnswers: ["i would suggest", "it may be useful to", "i recommend"],
      answer: "I would suggest",
      skill: "Writing"
    }
  ],
  path: [
    {
      title: "Tenses in real communication",
      level: "B1+",
      goal: "Use past, present and future forms with clearer meaning.",
      status: "Ready"
    },
    {
      title: "Modal verbs for nuance",
      level: "B2",
      goal: "Express probability, advice and obligation naturally.",
      status: "Recommended"
    },
    {
      title: "Collocations for natural English",
      level: "B2",
      goal: "Replace translated phrases with native-like combinations.",
      status: "Locked"
    },
    {
      title: "Writing better emails",
      level: "B2",
      goal: "Structure professional messages with the right register.",
      status: "Locked"
    }
  ],
  lesson: {
    title: "Modal verbs for nuance",
    level: "B2",
    goal: "Use modal verbs to sound precise when discussing past situations and professional decisions.",
    focus: "Use may have, might have and could have for possible past explanations. Use should have for regret or criticism, and would have for unreal past results.",
    teacherNote: "At B2, the challenge is not knowing the modal verb; it is choosing the meaning. Ask: am I showing possibility, advice, regret or an unreal result?",
    checklist: [
      "Identify the meaning before choosing the modal.",
      "Use modal + have + past participle for past meanings.",
      "Avoid translating Spanish structures word by word.",
      "Explain your choice with one clear reason."
    ]
  },
  writing: {
    title: "Professional email response",
    prompt: "You attended an online meeting with a client, but several points were left unclear. Write an email to your manager summarizing what may have caused the confusion and suggesting two next steps.",
    wordTarget: "140-190 words",
    checklist: [
      "Open with the purpose of the email.",
      "Use diplomatic language when describing the problem.",
      "Include at least one modal for possibility or recommendation.",
      "Close with two clear next steps."
    ],
    rubric: [
      { name: "Content", description: "Answers the task and covers the missing points." },
      { name: "Organization", description: "Has a clear opening, development and closing." },
      { name: "Language", description: "Uses accurate grammar and useful workplace vocabulary." },
      { name: "Register", description: "Sounds professional and appropriately diplomatic." }
    ]
  },
  exercises: [
    {
      id: "modal-past-possibility",
      type: "Sentence transformation",
      skill: "Grammar",
      topic: "modals",
      difficulty: "B2",
      prompt: "Rewrite: It is possible that she forgot the deadline.",
      answer: "She may have forgotten the deadline.",
      acceptedAnswers: [
        "she may have forgotten the deadline",
        "she might have forgotten the deadline",
        "she could have forgotten the deadline"
      ],
      explanation: "'May have + past participle' expresses a possible explanation about the past.",
      mistake: "Using 'may forgot' misses the perfect form after modal verbs.",
      example: "He might have missed the train because the meeting ran late."
    },
    {
      id: "agree-error-correction",
      type: "Error correction",
      skill: "Grammar",
      topic: "verb patterns",
      difficulty: "B1+",
      prompt: "Correct: I am agree with your suggestion.",
      answer: "I agree with your suggestion.",
      acceptedAnswers: ["i agree with your suggestion"],
      explanation: "'Agree' is a main verb, so it does not need 'am'.",
      mistake: "Spanish speakers often transfer 'estar de acuerdo' directly.",
      example: "I agree with the proposal, but I would change the timeline."
    },
    {
      id: "progress-collocation",
      type: "Vocabulary",
      skill: "Vocabulary",
      topic: "collocations",
      difficulty: "B1+",
      prompt: "Choose a natural collocation: make / do / take progress",
      answer: "make progress",
      acceptedAnswers: ["make progress"],
      explanation: "English uses 'make progress' as a fixed collocation.",
      mistake: "'Do progress' is understandable but unnatural.",
      example: "You have made clear progress with your writing this month."
    },
    {
      id: "hedging-choice",
      type: "Professional English",
      skill: "Writing",
      topic: "hedging",
      difficulty: "B2",
      prompt: "Choose the best phrase for a diplomatic email: 'You are wrong' / 'I see it slightly differently'",
      answer: "I see it slightly differently",
      acceptedAnswers: ["i see it slightly differently"],
      explanation: "Hedging softens disagreement while keeping the message clear and professional.",
      mistake: "Direct disagreement can sound harsher than intended in professional English.",
      example: "I see it slightly differently, and I think the second option may be more realistic."
    }
  ],
  reviews: [
    { front: "bring up", back: "mention a topic", tag: "phrasal verb" },
    { front: "make progress", back: "improve over time", tag: "collocation" },
    { front: "may have done", back: "possible past explanation", tag: "grammar" },
    { front: "I agree", back: "not 'I am agree'", tag: "error clinic" }
  ],
  recommendations: {
    Grammar: [
      "Repeat modal verbs for past speculation before moving to conditionals.",
      "Review verb patterns that usually transfer badly from Spanish."
    ],
    Vocabulary: [
      "Do one short collocation block before your next writing task.",
      "Recycle workplace phrases inside a sentence, not as isolated words."
    ],
    Reading: [
      "Practice inference questions after scanning for the main idea first.",
      "Summarize each paragraph in one sentence to improve retention."
    ],
    Writing: [
      "Use softer disagreement and clearer topic sentences in longer answers.",
      "Draft first, then revise for register and sentence linking."
    ]
  }
};
