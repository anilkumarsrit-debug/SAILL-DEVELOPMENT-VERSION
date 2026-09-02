import { QuestionBankItem } from '../../types/knowledgeCheck';

export const module10Questions: QuestionBankItem[] = [
  {
    id: 'qb-deb-001',
    moduleId: 'debate-skills',
    topic: 'The ARE Argumentation Framework',
    courseOutcome: 'CO3',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What are the three core structural pillars of the ARE framework for constructing debate arguments?',
    options: [
      'Assertion (Claim), Reasoning (Logical rationale), Evidence (Concrete data/facts)',
      'Action, Reaction, Evaluation',
      'Analyze, Read, Explain',
      'Argument, Rebuttal, Example'
    ],
    correctAnswer: 'Assertion (Claim), Reasoning (Logical rationale), Evidence (Concrete data/facts)',
    explanation: 'ARE ensures every claim has logical justification (Reasoning) and verifiable factual backing (Evidence).',
    keywords: ['ARE Framework', 'Argument Construction', 'Debate Structure'],
    estimatedTimeSeconds: 20
  },
  {
    id: 'qb-deb-002',
    moduleId: 'debate-skills',
    topic: 'Straw Man Fallacy',
    courseOutcome: 'CO3',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Which logical fallacy occurs when a debater misrepresents an opponent\'s argument into an exaggerated or ridiculous caricature to make it easier to attack?',
    options: [
      'Straw Man Fallacy',
      'Ad Hominem',
      'Circular Reasoning (Begging the Question)',
      'Red Herring'
    ],
    correctAnswer: 'Straw Man Fallacy',
    explanation: 'The Straw Man fallacy distorts an opponent\'s position into an extreme, undefendable version rather than answering the actual claim.',
    keywords: ['Straw Man', 'Fallacy', 'Refutation'],
    estimatedTimeSeconds: 20
  },
  {
    id: 'qb-deb-003',
    moduleId: 'debate-skills',
    topic: 'Ad Hominem Fallacy',
    courseOutcome: 'CO3',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What characterizes an "Ad Hominem" fallacy in argumentative discourse?',
    options: [
      'Attacking the personal character or motives of the speaker rather than addressing the substance of their logical argument',
      'Quoting too many scientific peer-reviewed research papers',
      'Presenting statistical evidence in the wrong chronological order',
      'Speaking for longer than the assigned debate timer'
    ],
    correctAnswer: 'Attacking the personal character or motives of the speaker rather than addressing the substance of their logical argument',
    explanation: 'Ad Hominem is an informal fallacy where personal insults replace logical counter-arguments.',
    keywords: ['Ad Hominem', 'Logical Fallacy', 'Debate Ethics'],
    estimatedTimeSeconds: 20
  },
  {
    id: 'qb-deb-004',
    moduleId: 'debate-skills',
    topic: 'Slippery Slope Fallacy',
    courseOutcome: 'CO3',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: '"If we allow engineers to use open-source libraries, no software company will ever earn revenue again, and the entire global technology economy will collapse." Which logical fallacy is exemplified here?',
    options: [
      'Slippery Slope Fallacy',
      'False Analogy',
      'Bandwagon Fallacy (Ad Populum)',
      'Appeal to Ignorance'
    ],
    correctAnswer: 'Slippery Slope Fallacy',
    explanation: 'Slippery Slope asserts without evidence that a minor initial step will inevitably trigger an extreme chain reaction of catastrophic consequences.',
    keywords: ['Slippery Slope', 'Cognitive Fallacy', 'Argument Analysis'],
    estimatedTimeSeconds: 25
  },
  {
    id: 'qb-deb-005',
    moduleId: 'debate-skills',
    topic: '4-Step Refutation Method',
    courseOutcome: 'CO3',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'What is the recommended 4-step sequence for delivering a clear and systematic rebuttal to an opposing argument?',
    options: [
      'Step 1: "They Said..." -> Step 2: "However..." -> Step 3: "Because..." -> Step 4: "Therefore..."',
      'Step 1: Interrupt -> Step 2: Shout -> Step 3: Deny -> Step 4: Leave',
      'Step 1: Agree -> Step 2: Apologize -> Step 3: Rephrase -> Step 4: Concede',
      'Step 1: Repeat your opening -> Step 2: Repeat your opening -> Step 3: Repeat -> Step 4: Stop'
    ],
    correctAnswer: 'Step 1: "They Said..." -> Step 2: "However..." -> Step 3: "Because..." -> Step 4: "Therefore..."',
    explanation: 'The 4-step model (They Said -> However -> Because -> Therefore) provides a rigorous, crystal-clear structure for point-by-point refutation.',
    keywords: ['4-Step Refutation', 'Rebuttal Template', 'Clash'],
    estimatedTimeSeconds: 30
  },
  {
    id: 'qb-deb-006',
    moduleId: 'debate-skills',
    topic: 'Point of Information (POI) Protocol',
    courseOutcome: 'CO3',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'In Parliamentary Debate formats, what is the role and protocol of a Point of Information (POI)?',
    options: [
      'A brief (under 15 seconds) question or interjection offered by the opposing team during the speaker\'s unprotected constructive time',
      'A penalty card issued by the adjudicator to disqualify a team',
      'A written letter mailed to the university chancellor after the debate',
      'A 5-minute uninterrupted speech by the audience'
    ],
    correctAnswer: 'A brief (under 15 seconds) question or interjection offered by the opposing team during the speaker\'s unprotected constructive time',
    explanation: 'A POI allows opponents to challenge an argument mid-speech, testing the speaker\'s spontaneous composure and mastery.',
    keywords: ['POI', 'Parliamentary Debate', 'Cross-Examination'],
    estimatedTimeSeconds: 30
  },
  {
    id: 'qb-deb-007',
    moduleId: 'debate-skills',
    topic: 'Aristotle\'s Rhetorical Appeals: Ethos, Pathos, Logos',
    courseOutcome: 'CO3',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'In persuasive engineering debates, what does the appeal to "Logos" signify?',
    options: [
      'Persuasion grounded in logical reasoning, verified empirical data, and rigorous mathematical proofs',
      'Persuasion relying purely on the speaker\'s company logo and graphic design',
      'Persuasion based exclusively on emotional storytelling and dramatic pauses',
      'Persuasion derived from celebrity endorsements'
    ],
    correctAnswer: 'Persuasion grounded in logical reasoning, verified empirical data, and rigorous mathematical proofs',
    explanation: 'Logos appeals directly to rationality through deductive reasoning, verifiable data, statistics, and causal logic.',
    keywords: ['Logos', 'Rhetorical Appeals', 'Logic', 'Empirical Proof'],
    estimatedTimeSeconds: 25
  },
  {
    id: 'qb-deb-008',
    moduleId: 'debate-skills',
    topic: 'False Dilemma / Either-Or Fallacy',
    courseOutcome: 'CO3',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'What constitutes a "False Dilemma" (Bifurcation) fallacy in policy debates?',
    options: [
      'Falsely claiming only two extreme mutually exclusive alternatives exist, when viable intermediate solutions are available',
      'Providing three different technical options',
      'Forgetting the definition of a technical term',
      'Citing data that is older than 5 years'
    ],
    correctAnswer: 'Falsely claiming only two extreme mutually exclusive alternatives exist, when viable intermediate solutions are available',
    explanation: 'A False Dilemma artificially restricts a nuanced debate spectrum into a black-or-white choice, ignoring nuanced middle grounds.',
    keywords: ['False Dilemma', 'Bifurcation', 'Fallacy Spotting'],
    estimatedTimeSeconds: 25
  },
  {
    id: 'qb-deb-009',
    moduleId: 'debate-skills',
    topic: 'Parliamentary Debate Roles & Burden of Proof',
    courseOutcome: 'CO3',
    difficulty: 'Hard',
    type: 'mcq',
    prompt: 'In a standard Parliamentary Debate on a policy motion (e.g., "This House Would Mandate Algorithmic Audits"), which side carries the primary "Burden of Proof" to demonstrate problem urgency and model solvency?',
    options: [
      'The Government / Affirmative / Proposition side',
      'The Opposition side',
      'The Audience members',
      'The Timekeeper'
    ],
    correctAnswer: 'The Government / Affirmative / Proposition side',
    explanation: 'The Proposition/Government advocating change bears the burden of proof to demonstrate the problem, propose a model, and prove solvency.',
    keywords: ['Burden of Proof', 'Proposition', 'Government Burden'],
    estimatedTimeSeconds: 35
  },
  {
    id: 'qb-deb-010',
    moduleId: 'debate-skills',
    topic: 'Rebuttal Strategy & Core Clash Points',
    courseOutcome: 'CO3',
    difficulty: 'Hard',
    type: 'mcq',
    prompt: 'When delivering a 3-minute Rebuttal or Reply speech, how should a debater prioritize their time?',
    options: [
      'Group arguments around the 2-3 fundamental thematic "Clash Points" of the debate and prove why your side\'s impacts outweigh the opposition\'s',
      'Attempt to respond to every minor sentence uttered by the opponent in chronological order until time runs out',
      'Introduce completely new arguments that were never mentioned in constructive speeches',
      'Read an unrelated newspaper article aloud'
    ],
    correctAnswer: 'Group arguments around the 2-3 fundamental thematic "Clash Points" of the debate and prove why your side\'s impacts outweigh the opposition\'s',
    explanation: 'Strategic debaters synthesize arguments into major clash themes, weighing comparative impacts rather than getting bogged down in line-by-line minutiae.',
    keywords: ['Clash Points', 'Rebuttal Strategy', 'Impact Weighing'],
    estimatedTimeSeconds: 35
  }
];
