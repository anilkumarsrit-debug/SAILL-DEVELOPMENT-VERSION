import { ModuleConfig } from '../../types/moduleConfig';

export const module4Config: ModuleConfig = {
  moduleId: 'group-discussion',
  code: 'R26-LAB-04',
  title: 'Group Discussion & Peer Dynamics',
  syllabusTopic: 'Group Discussion (GD) Roles, Turn-Taking, Polite Interruption, Conflict Resolution & Consensus Building',
  description: 'Master GD leadership dynamics, initiating/summarizing techniques, active listening, polite intervention phrases, and collaborative consensus building for recruitment rounds.',

  notebookConfig: {
    experimentNumber: 'EXP-04',
    aim: 'To demonstrate collaborative communication, structured intervention, polite contradiction, and consensus building in campus recruitment Group Discussions.',
    apparatus: ['SAILL Multi-Avatar GD Simulator', 'Turn-Taking Analytics Log', 'Polite Intervention Matrix'],
    theory: 'Group Discussion evaluates candidate leadership, subject knowledge, active listening, teamwork, and verbal diplomacy rather than aggressive argument.',
    procedure: [
      'Select a GD topic type (Factual, Abstract, or Case-Study).',
      'Log opening intervention strategies (Initiator, Moderator, or Summarizer).',
      'Record polite interventions using phrases like "I see your point, however..."',
      'Draft a synthesis summary capturing group consensus and diverse perspectives.'
    ],
    defaultStudentWork: `LABORATORY OUTPUT - GROUP DISCUSSION & PEER DYNAMICS (EXP-04):

GD TOPIC: "Should Remote Work Remain a Permanent Standard in Engineering Companies?"

1. INTERVENTION STRATEGY & ROLE LOG:
   - Initial Role Taken: Moderator & Contributor
   - Entry Point: Entered at Minute 1:15 after Candidate 2 presented initial stats.

2. POLITE INTERVENTION PHRASES USED:
   - Agreement & Addition: "I completely align with Candidate 2's point on developer productivity; additionally, remote setups reduce infrastructure overhead."
   - Diplomatic Contradiction: "While Candidate 4 raised valid concerns regarding team bonding, we can mitigate this through hybrid quarterly meetups rather than mandatory daily office presence."

3. CONSENSUS SYNTHESIS SUMMARY:
   The group unanimously recognized that full remote work enhances software developer autonomy and widens global talent access. However, to preserve corporate culture and collaborative cross-team brainstorming, a hybrid model with flexible remote options emerges as the optimal compromise for modern tech firms.`,
    defaultReflection: 'I focused on active listening rather than shouting over peers. Using polite intervention bridges helped me steer the group back to the core topic when discussion drifted.',
    rubricCriteria: [
      { name: 'Subject Knowledge & Logic', maxScore: 20, description: 'Relevant facts, structured arguments, and clear domain insights.' },
      { name: 'Active Listening & Body Language', maxScore: 20, description: 'Attentive listening, eye contact, and nodding to acknowledge peers.' },
      { name: 'Polite Intervention & Diplomacy', maxScore: 20, description: 'Smooth entry phrases without aggressive interruption.' },
      { name: 'Team Player & Inclusivity', maxScore: 20, description: 'Encouraging quiet members and steering discussion productively.' },
      { name: 'Summarizing & Consensus Building', maxScore: 20, description: 'Accurate, objective summary capturing all core viewpoints.' }
    ],
    targetOutputs: ['GD Transcript Log', 'Polite Intervention Sheet', 'Consensus Summary Report'],
    facultySampleRemarks: 'Excellent leadership demonstrated. Smooth polite interventions used and group consensus summarized effectively. Approved.'
  },

  knowledgeCheck: {
    title: 'Group Discussion & Peer Dynamics Knowledge Check',
    passingScore: 75,
    shuffleQuestions: true,
    questions: [
      {
        id: 'gd-q1',
        type: 'mcq',
        prompt: 'What is the primary evaluation goal of evaluators during a campus recruitment Group Discussion?',
        options: [
          'Interpreting collaborative teamwork, leadership, and communication skills',
          'Winning the argument at all costs',
          'Speaking continuously for the maximum duration',
          'Interrupting others to show dominance'
        ],
        correctAnswer: 'Interpreting collaborative teamwork, leadership, and communication skills',
        explanation: 'Evaluators look for teamwork, active listening, logical reasoning, and leadership, not loud domination.'
      },
      {
        id: 'gd-q2',
        type: 'mcq',
        prompt: 'Which phrase represents a polite diplomatic contradiction in a GD?',
        options: [
          '"I understand your perspective; however, looking at the data..."',
          '"You are completely wrong!"',
          '"Quiet down and let me speak."',
          '"That point makes no sense."'
        ],
        correctAnswer: '"I understand your perspective; however, looking at the data..."',
        explanation: 'Polite bridging acknowledges the speaker before introducing a alternative counter-argument.'
      },
      {
        id: 'gd-q3',
        type: 'mcq',
        prompt: 'When is initiating a Group Discussion most advantageous for a candidate?',
        options: [
          'Only when you possess solid factual knowledge and can define the topic scope clearly',
          'In every single GD regardless of whether you understand the topic',
          'Only if you intend to speak for the entire duration of the round',
          'When you want to prevent all other participants from speaking'
        ],
        correctAnswer: 'Only when you possess solid factual knowledge and can define the topic scope clearly',
        explanation: 'Initiating with clarity and structured framework earns leadership marks, whereas speaking without clarity creates a poor initial impression.'
      },
      {
        id: 'gd-q4',
        type: 'mcq',
        prompt: 'The participant who encapsulates all group perspectives and presents the final consensus is called the ______.',
        options: [
          'Summarizer',
          'Aggressor',
          'Monopolizer',
          'Observer'
        ],
        correctAnswer: 'Summarizer',
        explanation: 'The summarizer synthesizes points objectively without introducing new arguments.'
      }
    ]
  },

  resources: [
    {
      id: 'res-gd1',
      title: 'Group Discussion Role Strategies & Intervention Phrases',
      type: 'reference',
      description: 'Handy cheat sheet for GD initiation, building bridges, polite disagreement, and summarizing.',
      content: `GD INTERVENTION PHRASES CHEAT SHEET

1. Initiating the Discussion:
   - "Good morning friends. Today's topic for discussion is... Let us begin by defining the scope."
   - "Welcome everyone. To set the context for our discussion on..."

2. Agreeing & Adding Value:
   - "I agree with Candidate 3, and I would like to build upon that point by adding..."
   - "That is a crucial point raised by Candidate 1. Furthermore..."

3. Disagreeing Diplomatically:
   - "I appreciate Candidate 4's viewpoint; however, if we examine the market data..."
   - "While that holds true in specific cases, we must also consider..."

4. Involving Silent Members:
   - "We have heard great insights. Let us hear Candidate 5's thoughts on this aspect."

5. Summarizing:
   - "To wrap up our discussion, our group discussed both pros and cons, arriving at the consensus that..."`
    }
  ],

  recordWork: {
    title: 'Group Discussion Audio & Transcript Submissions',
    instructions: 'Upload audio or written logs of mock Group Discussions and self/peer evaluation metrics.',
    allowedFormats: ['audio', 'pdf'],
    sampleAudioPrompts: [
      'Record a 90-second opening statement for a GD on "AI vs Human Creativity".',
      'Record a 60-second objective summary for a GD on "Electric Vehicles Infrastructure".'
    ],
    submissionGuidelines: [
      'Maintain diplomatic tone throughout.',
      'Provide clear logical evidence in support of assertions.'
    ]
  },

  reflectionConfig: {
    title: 'Module 4 Reflection & Team Dynamics',
    instructions: 'Reflect on your team dynamics and diplomatic speaking habits in group settings.',
    questions: [
      'How comfortably did you enter the discussion without interrupting aggressively?',
      'How well did you listen and acknowledge points made by other group members?',
      'What strategies helped steer the discussion back on track when it went off-topic?',
      'How will you refine your GD skills for upcoming company placement drives?'
    ],
    rubricFocus: ['Diplomatic maturity', 'Team awareness']
  },

  portfolioConfig: {
    title: 'Group Discussion Artifacts Portfolio',
    artifactCategories: ['GD Intervention Log', 'Mock GD Audio/Transcript', 'Peer Evaluation Form'],
    rubricCriteria: ['Logical Reasoning (35%)', 'Diplomacy & Tone (35%)', 'Team Contribution (30%)']
  },

  statusConfig: {
    targetScore: 90,
    requiredTasks: [
      'Participate in Mock Group Discussion Simulation',
      'Submit GD Intervention Log Sheet',
      'Score 75%+ on Knowledge Check',
      'Submit Digital Lab Notebook EXP-04'
    ],
    skillsMastered: ['GD Leadership', 'Polite Intervention', 'Active Listening', 'Consensus Synthesis'],
    recommendations: [
      'Practice taking 10-second notes while listening to news debates.',
      'Master 3 polite intervention phrases for instant entry in group discussions.'
    ],
    passingThreshold: 75
  }
};
