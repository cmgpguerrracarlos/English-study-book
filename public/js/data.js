const learningData = {
  skills: [
    { name: "Grammar", score: 68, focus: "Modal nuance and conditionals", tone: "blue" },
    { name: "Vocabulary", score: 74, focus: "Workplace collocations", tone: "green" },
    { name: "Reading", score: 81, focus: "Inference and detail", tone: "amber" },
    { name: "Writing", score: 56, focus: "Paragraph structure", tone: "red" }
  ],
  placement: [
    {
      question: "Choose the best option: If I had known about the meeting, I ___ earlier.",
      options: ["would have arrived", "would arrive", "arrived"],
      answer: "would have arrived"
    },
    {
      question: "Which phrase sounds most natural in a professional email?",
      options: ["I am writing to follow up on...", "I write for follow...", "I am write because..."],
      answer: "I am writing to follow up on..."
    },
    {
      question: "What does 'to bring up a topic' mean?",
      options: ["to mention it", "to forget it", "to finish it"],
      answer: "to mention it"
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
  exercises: [
    {
      type: "Sentence transformation",
      prompt: "Rewrite: It is possible that she forgot the deadline.",
      answer: "She may have forgotten the deadline.",
      explanation: "'May have + past participle' expresses a possible explanation about the past.",
      mistake: "Using 'may forgot' misses the perfect form after modal verbs."
    },
    {
      type: "Error correction",
      prompt: "Correct: I am agree with your suggestion.",
      answer: "I agree with your suggestion.",
      explanation: "'Agree' is a main verb, so it does not need 'am'.",
      mistake: "Spanish speakers often transfer 'estar de acuerdo' directly."
    },
    {
      type: "Vocabulary",
      prompt: "Choose a natural collocation: make / do / take progress",
      answer: "make progress",
      explanation: "English uses 'make progress' as a fixed collocation.",
      mistake: "'Do progress' is understandable but unnatural."
    }
  ],
  reviews: [
    { front: "bring up", back: "mention a topic", tag: "phrasal verb" },
    { front: "make progress", back: "improve over time", tag: "collocation" },
    { front: "may have done", back: "possible past explanation", tag: "grammar" },
    { front: "I agree", back: "not 'I am agree'", tag: "error clinic" }
  ]
};
