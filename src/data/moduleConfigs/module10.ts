import { ModuleConfig } from '../../types/moduleConfig';

export const module10Config: ModuleConfig = {
  moduleId: 'debate-skills',
  code: 'R26-LAB-10',
  title: 'Debate Skills & Persuasive Argumentation',
  syllabusTopic: 'ARE Argument Structure, Rebuttal Framing, Fallacy Spotting, Cross-Examination & Persuasive Rhetoric',
  description: 'Master structured debate mechanics, ARE (Assertion, Reasoning, Evidence) argument construction, refutation methods, fallacy detection, and persuasive cross-examination.',

  notebookConfig: {
    experimentNumber: 'EXP-10',
    aim: 'To construct structured debate arguments using the ARE framework, formulate logical rebuttals, and spot cognitive fallacies in policy and tech motions.',
    apparatus: ['SAILL Debate Motion Simulator', 'ARE Argument Validator', 'Logical Fallacy Detector'],
    theory: 'Formal debate relies on logical ARE structure (Assertion + Reasoning + Evidence), targeted rebuttal (They said X, However Y, Because Z), and avoiding logical fallacies (Ad Hominem, Strawman, Slippery Slope).',
    procedure: [
      'Select a motion (e.g. "This House Would Mandate Open-Source Algorithms for Public AI").',
      'Build 2 Proposition arguments using ARE (Assertion, Reasoning, Evidence).',
      'Formulate Opposing rebuttals using the 4-Step Refutation Method.',
      'Identify and dismantle logical fallacies in sample opposition speeches.'
    ],
    defaultStudentWork: `LABORATORY OUTPUT - DEBATE SKILLS & ARGUMENTATION (EXP-10):

DEBATE MOTION: "This House Would Mandate Open-Source Algorithms for Public Governance AI."

1. PROPOSITION ARGUMENT (ARE FRAMEWORK):
   - Assertion: Open-source AI algorithms prevent algorithmic bias and ensure democratic accountability in public service allocation.
   - Reasoning: When governance algorithms (e.g., loan processing, welfare eligibility) operate as proprietary black boxes, systemic bias remains hidden from public scrutiny.
   - Evidence: In 2023, independent audits of proprietary automated welfare systems revealed a 22% false-disqualification rate among low-income applicants.

2. OPPOSITION REBUTTAL (4-STEP REFUTATION):
   - Step 1 (They Said): The proposition claims open-sourcing governance AI ensures safety and fairness.
   - Step 2 (However): However, publishing raw model weights enables malicious actors to exploit zero-day adversarial prompt vulnerabilities.
   - Step 3 (Because): Because public infrastructure security requires defense-in-depth, open-sourcing entire model architectures exposes government databases to cyber attacks.
   - Step 4 (Therefore): Therefore, independent third-party auditing is far safer than releasing public open-source weights.

3. LOGICAL FALLACY SPOTTED:
   - Sample Fallacy: "If we regulate AI algorithms, innovation will immediately collapse and tech companies will go bankrupt."
   - Fallacy Type: Slippery Slope & False Dilemma.`,
    defaultReflection: 'Structuring arguments using ARE prevented me from making emotional claims. The 4-step refutation method gave me a clear template to answer counter-arguments calmly.',
    rubricCriteria: [
      { name: 'ARE Structure Execution', maxScore: 20, description: 'Clear Assertion, compelling Reasoning, and verified Empirical Evidence.' },
      { name: 'Rebuttal Precision (4-Step)', maxScore: 20, description: 'Directly addresses opponent logic using They Said / However / Because / Therefore.' },
      { name: 'Logical Fallacy Detection', maxScore: 20, description: 'Accurately identifies Ad Hominem, Strawman, and Slippery Slope fallacies.' },
      { name: 'Persuasive Rhetoric & POI', maxScore: 20, description: 'Effective use of rhetorical framing and Points of Information (POI).' },
      { name: 'POISE & Cross-Examination', maxScore: 20, description: 'Maintains composure, clear vocal posture, and respectful debate etiquette.' }
    ],
    targetOutputs: ['ARE Debate Case Document', '4-Step Rebuttal Log', 'Fallacy Detection Sheet'],
    facultySampleRemarks: 'Excellent structured argument logic. Rebuttal followed 4-step method impeccably and fallacy analysis was spot on. Approved.'
  },

  knowledgeCheck: {
    title: 'Debate Skills & Argumentation Knowledge Check',
    passingScore: 75,
    shuffleQuestions: true,
    questions: [
      {
        id: 'd-q1',
        type: 'mcq',
        prompt: 'What are the three core structural pillars of the ARE framework for constructing debate arguments?',
        options: [
          'Assertion (Claim), Reasoning (Logical rationale), Evidence (Concrete data/facts)',
          'Action, Reaction, Evaluation',
          'Analyze, Read, Explain',
          'Argument, Rebuttal, Example'
        ],
        correctAnswer: 'Assertion (Claim), Reasoning (Logical rationale), Evidence (Concrete data/facts)',
        explanation: 'ARE ensures every claim has logical justification (Reasoning) and verifiable factual backing (Evidence).'
      },
      {
        id: 'd-q2',
        type: 'mcq',
        prompt: 'Which logical fallacy occurs when a debater misrepresents an opponent\'s argument into an exaggerated or ridiculous caricature to make it easier to attack?',
        options: [
          'Straw Man Fallacy',
          'Ad Hominem',
          'Circular Reasoning (Begging the Question)',
          'Red Herring'
        ],
        correctAnswer: 'Straw Man Fallacy',
        explanation: 'The Straw Man fallacy distorts an opponent\'s position into an extreme, undefendable version rather than answering the actual claim.'
      },
      {
        id: 'd-q3',
        type: 'mcq',
        prompt: 'What characterizes an "Ad Hominem" fallacy in argumentative discourse?',
        options: [
          'Attacking the personal character or motives of the speaker rather than addressing the substance of their logical argument',
          'Quoting too many scientific peer-reviewed research papers',
          'Presenting statistical evidence in the wrong chronological order',
          'Speaking for longer than the assigned debate timer'
        ],
        correctAnswer: 'Attacking the personal character or motives of the speaker rather than addressing the substance of their logical argument',
        explanation: 'Ad Hominem is an informal fallacy where personal insults replace logical counter-arguments.'
      },
      {
        id: 'd-q4',
        type: 'mcq',
        prompt: '"If we allow engineers to use open-source libraries, no software company will ever earn revenue again, and the entire global technology economy will collapse." Which logical fallacy is exemplified here?',
        options: [
          'Slippery Slope Fallacy',
          'False Analogy',
          'Bandwagon Fallacy (Ad Populum)',
          'Appeal to Ignorance'
        ],
        correctAnswer: 'Slippery Slope Fallacy',
        explanation: 'Slippery Slope asserts without evidence that a minor initial step will inevitably trigger an extreme chain reaction of catastrophic consequences.'
      },
      {
        id: 'd-q5',
        type: 'mcq',
        prompt: 'What is the recommended 4-step sequence for delivering a clear and systematic rebuttal to an opposing argument?',
        options: [
          'Step 1: "They Said..." -> Step 2: "However..." -> Step 3: "Because..." -> Step 4: "Therefore..."',
          'Step 1: Interrupt -> Step 2: Shout -> Step 3: Deny -> Step 4: Leave',
          'Step 1: Agree -> Step 2: Apologize -> Step 3: Rephrase -> Step 4: Concede',
          'Step 1: Repeat your opening -> Step 2: Repeat your opening -> Step 3: Repeat -> Step 4: Stop'
        ],
        correctAnswer: 'Step 1: "They Said..." -> Step 2: "However..." -> Step 3: "Because..." -> Step 4: "Therefore..."',
        explanation: 'The 4-step model (They Said -> However -> Because -> Therefore) provides a rigorous, crystal-clear structure for point-by-point refutation.'
      },
      {
        id: 'd-q6',
        type: 'mcq',
        prompt: 'In Parliamentary Debate formats, what is the role and protocol of a Point of Information (POI)?',
        options: [
          'A brief (under 15 seconds) question or interjection offered by the opposing team during the speaker\'s unprotected constructive time',
          'A penalty card issued by the adjudicator to disqualify a team',
          'A written letter mailed to the university chancellor after the debate',
          'A 5-minute uninterrupted speech by the audience'
        ],
        correctAnswer: 'A brief (under 15 seconds) question or interjection offered by the opposing team during the speaker\'s unprotected constructive time',
        explanation: 'A POI allows opponents to challenge an argument mid-speech, testing the speaker\'s spontaneous composure and mastery.'
      },
      {
        id: 'd-q7',
        type: 'mcq',
        prompt: 'In persuasive engineering debates, what does the appeal to "Logos" signify?',
        options: [
          'Persuasion grounded in logical reasoning, verified empirical data, and rigorous mathematical proofs',
          'Persuasion relying purely on the speaker\'s company logo and graphic design',
          'Persuasion based exclusively on emotional storytelling and dramatic pauses',
          'Persuasion derived from celebrity endorsements'
        ],
        correctAnswer: 'Persuasion grounded in logical reasoning, verified empirical data, and rigorous mathematical proofs',
        explanation: 'Logos appeals directly to rationality through deductive reasoning, verifiable data, statistics, and causal logic.'
      },
      {
        id: 'd-q8',
        type: 'mcq',
        prompt: 'What constitutes a "False Dilemma" (Bifurcation) fallacy in policy debates?',
        options: [
          'Falsely claiming only two extreme mutually exclusive alternatives exist, when viable intermediate solutions are available',
          'Providing three different technical options',
          'Forgetting the definition of a technical term',
          'Citing data that is older than 5 years'
        ],
        correctAnswer: 'Falsely claiming only two extreme mutually exclusive alternatives exist, when viable intermediate solutions are available',
        explanation: 'A False Dilemma artificially restricts a nuanced debate spectrum into a black-or-white choice, ignoring nuanced middle grounds.'
      },
      {
        id: 'd-q9',
        type: 'mcq',
        prompt: 'In a standard Parliamentary Debate on a policy motion (e.g., "This House Would Mandate Algorithmic Audits"), which side carries the primary "Burden of Proof" to demonstrate problem urgency and model solvency?',
        options: [
          'The Government / Affirmative / Proposition side',
          'The Opposition side',
          'The Audience members',
          'The Timekeeper'
        ],
        correctAnswer: 'The Government / Affirmative / Proposition side',
        explanation: 'The Proposition/Government advocating change bears the burden of proof to demonstrate the problem, propose a model, and prove solvency.'
      },
      {
        id: 'd-q10',
        type: 'mcq',
        prompt: 'When delivering a 3-minute Rebuttal or Reply speech, how should a debater prioritize their time?',
        options: [
          'Group arguments around the 2-3 fundamental thematic "Clash Points" of the debate and prove why your side\'s impacts outweigh the opposition\'s',
          'Attempt to respond to every minor sentence uttered by the opponent in chronological order until time runs out',
          'Introduce completely new arguments that were never mentioned in constructive speeches',
          'Read an unrelated newspaper article aloud'
        ],
        correctAnswer: 'Group arguments around the 2-3 fundamental thematic "Clash Points" of the debate and prove why your side\'s impacts outweigh the opposition\'s',
        explanation: 'Strategic debaters synthesize arguments into major clash themes, weighing comparative impacts rather than getting bogged down in line-by-line minutiae.'
      }
    ]
  },

  resources: [
    {
      id: 'res-d1',
      title: 'ARE Argument Construction & 4-Step Refutation Guide',
      type: 'reference',
      description: 'Master debate case building, argument hierarchy, and refutation mechanics.',
      content: `DEBATE MECHANICS & REFUTATION GUIDE

1. THE ARE FRAMEWORK:
   - Assertion: State your claim clearly. ("Nuclear energy is essential for carbon neutrality.")
   - Reasoning: Explain the logical mechanism. ("Because nuclear plants provide 24/7 baseline power independent of weather conditions.")
   - Evidence: Cite verifiable statistics or studies. ("According to IPCC reports, nuclear energy generates <12g CO2 per kWh, comparable to wind power.")

2. THE 4-STEP REFUTATION METHOD:
   - Step 1: "They said..." (Summarize opponent argument)
   - Step 2: "However..." (State your counter-claim)
   - Step 3: "Because..." (Provide logical reasoning and evidence)
   - Step 4: "Therefore..." (State the impact on the debate motion)`
    }
  ],

  recordWork: {
    title: 'Debate Skills Audio & Written Submissions',
    instructions: 'Upload audio or written debate cases, speeches, and rebuttal logs for AI logical evaluation.',
    allowedFormats: ['audio', 'pdf'],
    sampleAudioPrompts: [
      'Record a 2-minute Proposition constructive speech on "Autonomous Vehicles in Public Transport".',
      'Record a 60-second rebuttal against "Social Media Ban for Minors".'
    ],
    submissionGuidelines: [
      'State ARE components explicitly.',
      'Maintain respectful debate etiquette throughout speech.'
    ]
  },

  reflectionConfig: {
    title: 'Module 10 Reflection & Argumentation Growth',
    instructions: 'Reflect on your debate logic, rebuttal speed, and fallacy identification.',
    questions: [
      'How easily were you able to support your assertions with concrete empirical evidence?',
      'How did using the 4-Step Refutation Method improve your composure during rebuttals?',
      'Which logical fallacy do you encounter most often in online technology discussions?',
      'How will persuasive argumentation help you defend technical proposals in engineering meetings?'
    ],
    rubricFocus: ['Logical rigour', 'Refutation speed']
  },

  portfolioConfig: {
    title: 'Debate Skills & Argumentation Portfolio',
    artifactCategories: ['Constructive Speech Audio', 'ARE Debate Case Sheet', 'Refutation & Fallacy Log'],
    rubricCriteria: ['Logical Reasoning (40%)', 'Rebuttal Precision (30%)', 'Rhetoric & Delivery (30%)']
  },

  statusConfig: {
    targetScore: 90,
    requiredTasks: [
      'Record 2-Minute Debate Constructive Speech',
      'Submit ARE Argument Case Sheet',
      'Score 75%+ on Knowledge Check',
      'Submit Digital Lab Notebook EXP-10'
    ],
    skillsMastered: ['ARE Framework', '4-Step Refutation', 'Fallacy Detection', 'Persuasive Rhetoric'],
    recommendations: [
      'Practice identifying fallacies in editorials and tech debate panels.',
      'Always prepare at least 2 empirical statistics for every debate motion.'
    ],
    passingThreshold: 75
  }
};
