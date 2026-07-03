/**
 * StudySprint AI — Mock AI engine.
 *
 * Every export here is a deterministic-but-varied stand-in for a real LLM call.
 * Outputs are driven by the user's actual inputs (deadline, difficulty,
 * confidence, subject, study type, available time, status …) so the app feels
 * intelligent without a network call.
 *
 * ---------------------------------------------------------------------------
 * Swapping in a real provider
 * ---------------------------------------------------------------------------
 * Each generator funnels through `callAI()`. To use OpenAI / Anthropic / etc.,
 * replace the body of `callAI()` with a fetch to your endpoint and have these
 * functions parse the structured response instead of building it locally.
 */

import type {
  Assignment,
  PriorityLevel,
  Difficulty,
  Confidence,
  StudyType,
  SprintLength,
  StudySprint,
  SprintStep,
  StudyPlan,
  PlanDay,
  PlanBlock,
  PlannerStyle,
  Flashcard,
  Quiz,
  QuizQuestion,
  QuizQuestionType,
  QuizResult,
  QuizAnswerRecord,
  NoteSummary,
  NoteStyle,
  TermDefinition,
  AIRecommendation,
  Subject,
  StudySession,
  QuizScore,
} from "@/types";

/* -------------------------------------------------------------------------- */
/* Seam for a real AI backend                                                 */
/* -------------------------------------------------------------------------- */
export interface AIRequest {
  task: string;
  input: Record<string, unknown>;
}

/** Replace this body to route through a real provider. */
export async function callAI<T>(_req: AIRequest, build: () => T): Promise<T> {
  // Simulated model latency so loading states are visible.
  await new Promise((r) => setTimeout(r, 550 + Math.floor(Math.random() * 500)));
  return build();
}

/* -------------------------------------------------------------------------- */
/* Small utilities                                                            */
/* -------------------------------------------------------------------------- */
export function uid(prefix = "id"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/** Stable pick from a list seeded by a string — same input, same variety. */
function pick<T>(list: T[], seed: string): T {
  return list[hash(seed) % list.length];
}

function hoursUntil(iso?: string): number {
  if (!iso) return Infinity;
  return (new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60);
}

function toMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function fromMinutes(total: number): string {
  const h24 = Math.floor(total / 60) % 24;
  const m = total % 60;
  const ampm = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

const DIFF_LABEL: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

/* ========================================================================== */
/* 1. calculatePriority                                                       */
/* ========================================================================== */
export function calculatePriority(a: {
  dueDate: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  status: string;
  gradeWeight?: number;
}): PriorityLevel {
  if (a.status === "completed") return "low";

  const hrs = hoursUntil(a.dueDate);
  let score = 0;

  // Urgency (dominant factor)
  if (hrs < 0) score += 50;
  else if (hrs <= 24) score += 40;
  else if (hrs <= 72) score += 28;
  else if (hrs <= 168) score += 16;
  else score += 6;

  // Difficulty
  score += a.difficulty === "hard" ? 16 : a.difficulty === "medium" ? 9 : 3;

  // Grade weight (up to ~25 pts)
  score += Math.min(25, ((a.gradeWeight ?? 5) / 100) * 45);

  // Effort remaining
  score += a.estimatedMinutes > 90 ? 10 : a.estimatedMinutes > 45 ? 6 : 3;

  // Status adjustments
  if (a.status === "needs-review") score += 6;
  else if (a.status === "almost-done") score -= 10;
  else if (a.status === "in-progress") score -= 4;

  if (score >= 72) return "critical";
  if (score >= 48) return "high";
  if (score >= 26) return "medium";
  return "low";
}

export function priorityWeight(p: PriorityLevel): number {
  return p === "critical" ? 4 : p === "high" ? 3 : p === "medium" ? 2 : 1;
}

/* ========================================================================== */
/* 2. generateStudySprint                                                     */
/* ========================================================================== */
export interface SprintInput {
  subject: string;
  subjectId?: string;
  goal: string;
  length: SprintLength;
  difficulty: Difficulty;
  studyType: StudyType;
  confidence: Confidence;
  deadline?: string;
}

const STUDY_TYPE_LABEL: Record<StudyType, string> = {
  reading: "Reading",
  practice: "Practice Problems",
  memorization: "Memorization",
  essay: "Essay Writing",
  "exam-review": "Exam Review",
  flashcards: "Flashcards",
  "quiz-practice": "Quiz Practice",
  project: "Project Work",
};

function sprintMaterials(subject: string, type: StudyType): string[] {
  const base = ["Your class notes", `${subject} textbook`];
  const byType: Record<StudyType, string[]> = {
    reading: ["Highlighter", "A notebook for margin notes"],
    practice: ["Practice worksheet", "Scratch paper", "Calculator"],
    memorization: ["Flashcards", "A blank sheet for active recall"],
    essay: ["Essay prompt", "Outline template", "Cited sources"],
    "exam-review": ["Past quizzes", "Study guide", "Flashcards"],
    flashcards: ["Existing flashcard deck", "Blank cards for gaps"],
    "quiz-practice": ["Practice quiz", "Answer key", "Timer"],
    project: ["Project brief", "Reference materials", "Task checklist"],
  };
  const subj = subject.toLowerCase();
  if (subj.includes("math") || subj.includes("physics") || subj.includes("chem"))
    base.push("Calculator", "Formula sheet");
  return Array.from(new Set([...base, ...byType[type]]));
}

function buildBreakdown(input: SprintInput): SprintStep[] {
  const { length, difficulty, confidence, studyType } = input;

  // Base proportions, then tilt by difficulty & confidence.
  let warm = 0.15;
  let core = 0.45;
  let recall = 0.2;
  let wrap = 0.2;

  if (confidence === "low") {
    warm += 0.05;
    core += 0.05;
    recall -= 0.05;
    wrap -= 0.05;
  } else if (confidence === "high") {
    warm -= 0.03;
    recall += 0.03;
  }
  if (difficulty === "hard") {
    core += 0.05;
    wrap -= 0.05;
  } else if (difficulty === "easy") {
    core -= 0.05;
    recall += 0.05;
  }

  const mins = (f: number) => Math.max(3, Math.round((length * f) / 5) * 5);
  let warmM = mins(warm);
  let coreM = mins(core);
  let recallM = mins(recall);
  let wrapM = length - warmM - coreM - recallM;
  if (wrapM < 3) {
    wrapM = 3;
    coreM = length - warmM - recallM - wrapM;
  }

  // Study-type flavored labels
  const coreDetail: Record<StudyType, string> = {
    reading: "Read the assigned section actively — summarize each paragraph in one line.",
    practice: "Work the hardest practice problems first while your focus is fresh.",
    memorization: "Drill the toughest terms using repetition and mnemonics.",
    essay: "Draft your thesis and the strongest supporting paragraph.",
    "exam-review": "Attack the concepts you're least confident about first.",
    flashcards: "Run your deck, sorting cards into 'know' and 'need review'.",
    "quiz-practice": "Take a timed practice set under exam-like conditions.",
    project: "Complete the highest-impact task on your project checklist.",
  };
  const recallDetail: Record<StudyType, string> = {
    reading: "Close the book and recall the main ideas from memory.",
    practice: "Redo one problem from scratch without looking at your notes.",
    memorization: "Cover the answers and self-test on every term.",
    essay: "Explain your argument out loud as if teaching it.",
    "exam-review": "Write out everything you remember on a blank page.",
    flashcards: "Re-run only the cards you marked 'need review'.",
    "quiz-practice": "Redo the questions you missed and note why.",
    project: "Review your work against the rubric and fix gaps.",
  };

  return [
    {
      label: "Warm-up",
      minutes: warmM,
      detail:
        confidence === "low"
          ? "Skim your notes and write down the 3 main topics — build a map before diving in."
          : "Quickly review your notes and identify the main topics to focus on.",
    },
    {
      label: "Core study",
      minutes: coreM,
      detail: coreDetail[studyType],
    },
    {
      label: "Active recall",
      minutes: recallM,
      detail: recallDetail[studyType],
    },
    {
      label: "Wrap-up",
      minutes: wrapM,
      detail:
        "Answer 2-3 practice questions and write a one-sentence summary of what you learned.",
    },
  ];
}

export async function generateStudySprint(
  input: SprintInput
): Promise<StudySprint> {
  return callAI({ task: "sprint", input: input as never }, () => {
    const goalText = input.goal.trim() || `Study ${input.subject}`;
    const urgencyNote =
      hoursUntil(input.deadline) <= 48 && input.deadline
        ? " Your deadline is close, so prioritize understanding over perfection."
        : "";

    const opener = pick(
      [
        `Master ${goalText.toLowerCase()}`,
        `Make real progress on ${goalText.toLowerCase()}`,
        `Build confidence in ${goalText.toLowerCase()}`,
      ],
      goalText + input.subject
    );

    return {
      id: uid("sprint"),
      subject: input.subject,
      subjectId: input.subjectId,
      goal: goalText,
      length: input.length,
      difficulty: input.difficulty,
      studyType: input.studyType,
      confidence: input.confidence,
      deadline: input.deadline,
      sprintGoal: `${opener} in a focused ${input.length}-minute ${STUDY_TYPE_LABEL[
        input.studyType
      ].toLowerCase()} session (${DIFF_LABEL[input.difficulty]} difficulty).${urgencyNote}`,
      breakdown: buildBreakdown(input),
      materials: sprintMaterials(input.subject, input.studyType),
      reflectionPrompts: [
        "What did I finish?",
        "What was confusing or slowed me down?",
        "What should I review or tackle next?",
      ],
      createdAt: new Date().toISOString(),
      completed: false,
    };
  });
}

/* ========================================================================== */
/* 3. generateStudyPlan                                                       */
/* ========================================================================== */
export interface PlannerSubjectInput {
  name: string;
  difficulty: Difficulty;
  confidence: Confidence;
  hasExam: boolean;
  examInDays?: number;
}

export interface PlannerInput {
  subjects: PlannerSubjectInput[];
  assignments: string; // free text list
  availableMinutesPerDay: number;
  sessionLength: SprintLength;
  breakPreference: "short" | "medium" | "long";
  style: PlannerStyle;
  goal: string;
  startTime: string; // "16:00"
  days: number; // how many days to plan
}

function subjectScore(s: PlannerSubjectInput): number {
  let score = 0;
  if (s.hasExam) score += 30;
  if (s.examInDays !== undefined) score += Math.max(0, 20 - s.examInDays * 3);
  score += s.difficulty === "hard" ? 15 : s.difficulty === "medium" ? 8 : 3;
  score += s.confidence === "low" ? 15 : s.confidence === "medium" ? 7 : 2;
  return score;
}

const STYLE_CONFIG: Record<
  PlannerStyle,
  { load: number; breakMult: number; label: string }
> = {
  relaxed: { load: 0.65, breakMult: 1.5, label: "Relaxed" },
  balanced: { load: 0.85, breakMult: 1, label: "Balanced" },
  aggressive: { load: 1.1, breakMult: 0.6, label: "Aggressive" },
  "exam-cram": { load: 1.25, breakMult: 0.5, label: "Exam Cram" },
};

function planActivity(s: PlannerSubjectInput, seed: string): string {
  const options = s.hasExam
    ? [`${s.name} Exam Review`, `${s.name} Practice Test`, `${s.name} Flashcards`]
    : [
        `${s.name} Review`,
        `${s.name} Practice Problems`,
        `${s.name} Reading`,
        `${s.name} Flashcards`,
      ];
  return pick(options, seed);
}

export async function generateStudyPlan(
  input: PlannerInput
): Promise<StudyPlan> {
  return callAI({ task: "plan", input: input as never }, () => {
    const style = STYLE_CONFIG[input.style];
    const ranked = [...input.subjects].sort(
      (a, b) => subjectScore(b) - subjectScore(a)
    );
    const breakMins = Math.round(
      (input.breakPreference === "short"
        ? 5
        : input.breakPreference === "long"
          ? 20
          : 10) * style.breakMult
    );

    const dayNames = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    const dailyBudget = Math.round(input.availableMinutesPerDay * style.load);
    const days: PlanDay[] = [];
    let rotation = 0;

    for (let d = 0; d < Math.min(input.days, 7); d++) {
      const blocks: PlanBlock[] = [];
      let cursor = toMinutes(input.startTime);
      let used = 0;

      while (used + input.sessionLength <= dailyBudget && ranked.length) {
        // Weight the rotation toward higher-priority subjects.
        const subj =
          ranked[rotation % ranked.length] ??
          ranked[0];
        // Exam-cram front-loads the top subject on early days.
        const chosen =
          input.style === "exam-cram" && d < 2 ? ranked[0] : subj;

        const start = fromMinutes(cursor);
        const end = fromMinutes(cursor + input.sessionLength);
        blocks.push({
          start,
          end,
          subject: chosen.name,
          activity: planActivity(chosen, chosen.name + d + used),
          minutes: input.sessionLength,
        });
        cursor += input.sessionLength + breakMins;
        used += input.sessionLength;
        rotation++;
      }
      days.push({ day: dayNames[d], blocks });
    }

    const top = ranked[0];
    const priorityExplanation = top
      ? `${top.name} is ranked highest because ${
          top.hasExam
            ? `the exam is ${
                top.examInDays !== undefined
                  ? `in ${top.examInDays} day${top.examInDays === 1 ? "" : "s"}`
                  : "coming up"
              }, `
            : ""
        }its difficulty is ${top.difficulty}, and your confidence level is ${
          top.confidence
        }. Lower-priority subjects are spread across later sessions.`
      : "Add subjects to generate a prioritized plan.";

    const totalMinutes = days.reduce(
      (sum, day) => sum + day.blocks.reduce((s, b) => s + b.minutes, 0),
      0
    );
    const dailyAverage = days.length ? Math.round(totalMinutes / days.length) : 0;

    const overloadRatio = dailyAverage / (input.availableMinutesPerDay || 1);
    const balance = {
      status:
        overloadRatio > 1.05
          ? ("overloaded" as const)
          : overloadRatio < 0.55
            ? ("light" as const)
            : ("balanced" as const),
      totalMinutes,
      dailyAverage,
      message:
        overloadRatio > 1.05
          ? `This ${style.label.toLowerCase()} plan books about ${dailyAverage} min/day against your ${input.availableMinutesPerDay} min budget. Consider dropping a low-priority subject or switching to a balanced style.`
          : overloadRatio < 0.55
            ? `You have spare capacity — about ${
                input.availableMinutesPerDay - dailyAverage
              } min/day free. You could add a deep-study block or take it easy.`
            : `Nicely balanced: ~${dailyAverage} min/day of focused study with ${breakMins}-minute breaks. Sustainable and on target.`,
    };

    // Catch-up buckets
    const catchUp = {
      mustDo: ranked.slice(0, 2).map((s) => `${s.name}: ${s.hasExam ? "exam prep" : "priority review"}`),
      deepStudy: ranked
        .filter((s) => s.difficulty === "hard" || s.confidence === "low")
        .slice(0, 2)
        .map((s) => `${s.name}: schedule a long, distraction-free block`),
      quickReview: ranked
        .filter((s) => s.confidence !== "low")
        .slice(0, 3)
        .map((s) => `${s.name}: 15-min flashcard refresh`),
      canDelay: ranked
        .filter((s) => !s.hasExam && s.confidence === "high")
        .map((s) => `${s.name}: revisit next week`),
    };

    return {
      id: uid("plan"),
      style: input.style,
      goal: input.goal.trim() || "Stay on top of every subject",
      days,
      priorityExplanation,
      catchUp,
      balance,
      createdAt: new Date().toISOString(),
    };
  });
}

/* ========================================================================== */
/* 4. generateFlashcards                                                      */
/* ========================================================================== */
export interface FlashcardInput {
  subject: string;
  content: string;
  count: number;
  difficulty: Difficulty;
}

function splitConcepts(content: string): { term: string; def: string }[] {
  const pairs: { term: string; def: string }[] = [];
  const lines = content
    .split(/\n|•|;/)
    .map((l) => l.trim())
    .filter(Boolean);

  for (const line of lines) {
    const colon = line.match(/^(.{2,60}?)\s*[:\-–]\s*(.+)$/);
    if (colon) {
      pairs.push({ term: colon[1].trim(), def: colon[2].trim() });
      continue;
    }
    const isDef = line.match(/^(.{2,40}?)\s+(is|are|means|refers to|describes)\s+(.+)$/i);
    if (isDef) {
      pairs.push({
        term: isDef[1].trim(),
        def: `${isDef[2]} ${isDef[3]}`.trim(),
      });
      continue;
    }
    if (line.length > 15) {
      const words = line.split(/\s+/);
      const term = words.slice(0, Math.min(4, words.length)).join(" ");
      pairs.push({ term, def: line });
    }
  }
  return pairs;
}

export async function generateFlashcards(
  input: FlashcardInput
): Promise<Flashcard[]> {
  return callAI({ task: "flashcards", input: input as never }, () => {
    const concepts = splitConcepts(input.content);
    const frontTemplates =
      input.difficulty === "hard"
        ? [
            (t: string) => `Explain the significance of "${t}".`,
            (t: string) => `How does "${t}" apply in practice?`,
            (t: string) => `Compare and contrast "${t}" with a related idea.`,
          ]
        : input.difficulty === "medium"
          ? [
              (t: string) => `What is "${t}"?`,
              (t: string) => `Define: ${t}`,
              (t: string) => `Describe "${t}" in your own words.`,
            ]
          : [
              (t: string) => `${t}?`,
              (t: string) => `What does "${t}" mean?`,
            ];

    const cards: Flashcard[] = [];
    const source = concepts.length
      ? concepts
      : [
          { term: `${input.subject} key idea 1`, def: "Add notes to generate real cards." },
          { term: `${input.subject} key idea 2`, def: "Paste vocabulary or a study guide." },
        ];

    for (let i = 0; i < input.count; i++) {
      const c = source[i % source.length];
      const tmpl = pick(frontTemplates, c.term + i);
      cards.push({
        id: uid("card"),
        status: "new",
        front:
          concepts.length && input.difficulty !== "easy"
            ? tmpl(c.term)
            : c.term.endsWith("?")
              ? c.term
              : `${c.term}`,
        back: c.def,
      });
    }
    return cards;
  });
}

/* ========================================================================== */
/* 5. generateQuiz                                                            */
/* ========================================================================== */
export interface QuizInput {
  topic: string;
  subject: string;
  material?: string;
  count: number;
  type: QuizQuestionType | "mixed";
  difficulty: Difficulty;
}

function extractTopics(input: QuizInput): string[] {
  const fromMaterial = (input.material ?? "")
    .split(/[\n.,;]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 6 && s.length < 60);
  const base = fromMaterial.length
    ? fromMaterial
    : [input.topic, `${input.subject} fundamentals`, `${input.topic} applications`];
  return base.slice(0, Math.max(3, input.count));
}

function makeQuestion(
  topicText: string,
  subject: string,
  type: QuizQuestionType,
  difficulty: Difficulty,
  i: number
): QuizQuestion {
  const seed = topicText + subject + i;
  const short = topicText.length > 40 ? topicText.slice(0, 40) + "…" : topicText;

  if (type === "true-false") {
    const truthy = hash(seed) % 2 === 0;
    return {
      id: uid("q"),
      type,
      topic: short,
      question: truthy
        ? `True or False: "${short}" is a core concept in ${subject}.`
        : `True or False: "${short}" has no relevance to ${subject}.`,
      correctAnswer: truthy ? "True" : "False",
      explanation: truthy
        ? `Correct — ${short} is central to understanding ${subject}.`
        : `${short} is actually relevant to ${subject}, so the statement is false.`,
    };
  }

  if (type === "short-answer") {
    return {
      id: uid("q"),
      type,
      topic: short,
      question:
        difficulty === "hard"
          ? `In 1-2 sentences, explain how ${short} works and why it matters in ${subject}.`
          : `Briefly define: ${short}.`,
      correctAnswer: `${short} — a key ${subject} concept. Any answer capturing its main idea is correct.`,
      explanation: `A strong answer names ${short} and explains its role in ${subject}.`,
    };
  }

  if (type === "fill-blank") {
    return {
      id: uid("q"),
      type,
      topic: short,
      question: `Fill in the blank: The concept of ______ is essential to ${short} in ${subject}.`,
      correctAnswer: short,
      explanation: `The blank refers to ${short}.`,
    };
  }

  // multiple-choice
  const correct = `The principle behind ${short}`;
  const distractors = [
    `An unrelated ${subject} rule`,
    `A common misconception about ${short}`,
    `The opposite of ${short}`,
  ];
  const options = [correct, ...distractors];
  // shuffle deterministically
  const order = options
    .map((o, idx) => ({ o, k: hash(seed + idx) }))
    .sort((a, b) => a.k - b.k)
    .map((x) => x.o);
  return {
    id: uid("q"),
    type: "multiple-choice",
    topic: short,
    question:
      difficulty === "hard"
        ? `Which statement best captures ${short} in ${subject}?`
        : `What best describes ${short}?`,
    options: order,
    correctIndex: order.indexOf(correct),
    explanation: `${correct} is what makes ${short} important in ${subject}.`,
  };
}

export async function generateQuiz(input: QuizInput): Promise<Quiz> {
  return callAI({ task: "quiz", input: input as never }, () => {
    const topics = extractTopics(input);
    const types: QuizQuestionType[] = [
      "multiple-choice",
      "true-false",
      "short-answer",
      "fill-blank",
    ];
    const questions: QuizQuestion[] = [];
    for (let i = 0; i < input.count; i++) {
      const type =
        input.type === "mixed" ? types[i % types.length] : input.type;
      questions.push(
        makeQuestion(topics[i % topics.length], input.subject, type, input.difficulty, i)
      );
    }
    return {
      id: uid("quiz"),
      topic: input.topic,
      subject: input.subject,
      difficulty: input.difficulty,
      questions,
      createdAt: new Date().toISOString(),
    };
  });
}

/** Grade a quiz against user answers and produce a result with follow-up. */
export function gradeQuiz(
  quiz: Quiz,
  responses: Record<string, string>
): QuizResult {
  const answers: QuizAnswerRecord[] = quiz.questions.map((q) => {
    const given = (responses[q.id] ?? "").trim();
    let correct = false;
    if (q.type === "multiple-choice") {
      correct = given !== "" && Number(given) === q.correctIndex;
    } else if (q.type === "true-false") {
      correct = given.toLowerCase() === (q.correctAnswer ?? "").toLowerCase();
    } else if (q.type === "fill-blank") {
      correct =
        given.length > 0 &&
        (q.correctAnswer ?? "").toLowerCase().includes(given.toLowerCase());
    } else {
      // short answer — lenient: any substantive answer counts
      correct = given.split(/\s+/).filter(Boolean).length >= 3;
    }
    return { questionId: q.id, correct, given };
  });

  const correctCount = answers.filter((a) => a.correct).length;
  const total = quiz.questions.length;
  const score = total ? Math.round((correctCount / total) * 100) : 0;

  const weakTopics = Array.from(
    new Set(
      quiz.questions
        .filter((q) => !answers.find((a) => a.questionId === q.id)?.correct)
        .map((q) => q.topic ?? quiz.topic)
    )
  ).slice(0, 4);

  const recommendation =
    weakTopics.length === 0
      ? `Excellent — you scored ${score}%. Lock it in with a quick 15-minute ${quiz.subject} review sprint.`
      : `You missed questions about ${weakTopics
          .slice(0, 2)
          .join(" and ")}. Start a 25-minute ${quiz.subject} review sprint focused on ${weakTopics[0]}.`;

  return {
    id: uid("result"),
    quizId: quiz.id,
    topic: quiz.topic,
    subject: quiz.subject,
    score,
    correct: correctCount,
    total,
    weakTopics,
    answers,
    recommendation,
    createdAt: new Date().toISOString(),
  };
}

/* ========================================================================== */
/* 6. summarizeNotes                                                          */
/* ========================================================================== */
export interface NotesInput {
  title?: string;
  notes: string;
  style: NoteStyle;
}

function extractTerms(sentences: string[]): TermDefinition[] {
  const terms: TermDefinition[] = [];
  for (const s of sentences) {
    const m =
      s.match(/^(.{2,40}?)\s*[:\-–]\s*(.+)$/) ||
      s.match(/^(.{2,40}?)\s+(?:is|are|means|refers to)\s+(.+)$/i);
    if (m) {
      terms.push({ term: m[1].trim().replace(/^the\s+/i, ""), definition: m[2].trim() });
    }
    if (terms.length >= 6) break;
  }
  return terms;
}

export async function summarizeNotes(
  input: NotesInput
): Promise<NoteSummary> {
  return callAI({ task: "summarize", input: input as never }, () => {
    const clean = input.notes.replace(/\s+/g, " ").trim();
    const sentences = input.notes
      .split(/(?<=[.!?])\s+|\n/)
      .map((s) => s.trim())
      .filter((s) => s.length > 12);

    const words = clean.split(/\s+/);
    const freq = new Map<string, number>();
    for (const w of words) {
      const t = w.toLowerCase().replace(/[^a-z]/g, "");
      if (t.length > 4) freq.set(t, (freq.get(t) ?? 0) + 1);
    }
    const topWords = [...freq.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([w]) => w);

    const summary =
      sentences.slice(0, 3).join(" ").slice(0, 400) ||
      "Paste some notes above and StudySprint AI will condense them into a clean summary.";

    const keyPoints = sentences
      .slice(0, 6)
      .map((s) => s.replace(/\s+/g, " ").slice(0, 120));

    const terms = extractTerms(sentences);

    const examTopics =
      topWords.length > 0
        ? topWords.map((w) => w[0].toUpperCase() + w.slice(1))
        : ["Add notes to surface likely exam topics"];

    const practiceQuestions = sentences.slice(0, 4).map((s, i) => {
      const stem = s.split(/\s+/).slice(0, 6).join(" ");
      return i % 2 === 0
        ? `Explain: ${stem}…?`
        : `Why is "${stem}…" important?`;
    });

    const sprintMinutes =
      input.style === "exam-review" ? 45 : input.style === "study-guide" ? 45 : 25;

    return {
      id: uid("summary"),
      title: input.title?.trim() || "Untitled notes",
      style: input.style,
      summary,
      keyPoints,
      terms,
      examTopics,
      practiceQuestions,
      suggestedSprint: `Start a ${sprintMinutes}-minute exam-review sprint covering ${examTopics
        .slice(0, 2)
        .join(" and ")}.`,
      createdAt: new Date().toISOString(),
    };
  });
}

/* ========================================================================== */
/* 7. generateRecommendations                                                 */
/* ========================================================================== */
export function generateRecommendations(
  assignments: Assignment[],
  subjects: Subject[]
): AIRecommendation[] {
  const recs: AIRecommendation[] = [];
  const open = assignments.filter((a) => a.status !== "completed");
  const subjOf = (id: string) => subjects.find((s) => s.id === id);

  const byPriority = [...open].sort((a, b) => {
    const pa = priorityWeight(calculatePriority(a));
    const pb = priorityWeight(calculatePriority(b));
    if (pa !== pb) return pb - pa;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const top = byPriority[0];
  if (top) {
    const subj = subjOf(top.subjectId);
    recs.push({
      id: uid("rec"),
      title: `Focus on ${top.title}`,
      reason: `It's your highest-priority item — ${
        subj?.confidence === "low" ? "low confidence, " : ""
      }${top.difficulty} difficulty, and due ${
        hoursUntil(top.dueDate) <= 24 ? "within a day" : "soon"
      }. Knock it out first.`,
      subjectId: top.subjectId,
      action: "prioritize",
      intensity: "high",
    });
  }

  const quick = [...open].sort(
    (a, b) => a.estimatedMinutes - b.estimatedMinutes
  )[0];
  if (quick && quick.id !== top?.id) {
    recs.push({
      id: uid("rec"),
      title: `Quick win: ${quick.title}`,
      reason: `Only ~${quick.estimatedMinutes} minutes. Clear it to build momentum before deeper work.`,
      subjectId: quick.subjectId,
      action: "study",
      intensity: "low",
    });
  }

  const lowConf = subjects.find((s) => s.confidence === "low");
  if (lowConf) {
    recs.push({
      id: uid("rec"),
      title: `Rebalance toward ${lowConf.name}`,
      reason: `${lowConf.name} is a low-confidence subject. A short review sprint now prevents a scramble later.`,
      subjectId: lowConf.id,
      action: "balance",
      intensity: "medium",
    });
  }

  return recs.slice(0, 3);
}

/* ========================================================================== */
/* 8. generateProgressInsights                                                */
/* ========================================================================== */
export interface ProgressInsight {
  label: string;
  detail: string;
  tone: "positive" | "neutral" | "warning";
}

export function generateProgressInsights(
  sessions: StudySession[],
  quizScores: QuizScore[],
  subjects: Subject[]
): ProgressInsight[] {
  const insights: ProgressInsight[] = [];

  const totalMin = sessions.reduce((s, x) => s + x.durationMinutes, 0);
  insights.push({
    label: "Study volume",
    detail: `You've logged ${Math.round(totalMin / 60)}h ${totalMin % 60}m across ${sessions.length} sessions.`,
    tone: totalMin > 240 ? "positive" : "neutral",
  });

  // Subject balance
  const perSubject = new Map<string, number>();
  for (const s of sessions)
    perSubject.set(s.subjectId, (perSubject.get(s.subjectId) ?? 0) + 1);
  const sorted = [...perSubject.entries()].sort((a, b) => b[1] - a[1]);
  if (sorted.length >= 2) {
    const most = subjects.find((s) => s.id === sorted[0][0])?.name;
    const least = subjects.find(
      (s) => s.id === sorted[sorted.length - 1][0]
    )?.name;
    insights.push({
      label: "Balance",
      detail: `You've studied ${most} ${sorted[0][1]}× but ${least} only ${sorted[sorted.length - 1][1]}×. Consider evening it out.`,
      tone: "warning",
    });
  }

  // Weakest quiz subject
  if (quizScores.length) {
    const worst = [...quizScores].sort((a, b) => a.score - b.score)[0];
    const name = subjects.find((s) => s.id === worst.subjectId)?.name;
    insights.push({
      label: "Focus area",
      detail: `${name} is your lowest quiz score (${worst.score}%). Target it with a review sprint this week.`,
      tone: worst.score < 70 ? "warning" : "neutral",
    });
  }

  return insights;
}
