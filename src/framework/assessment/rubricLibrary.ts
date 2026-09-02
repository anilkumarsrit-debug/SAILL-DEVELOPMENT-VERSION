/**
 * Centralized Rubric Library for UALAF
 * Standardized rubrics across all assessment types & learning journeys
 */

import { RubricDefinition, RubricCategory } from './types';

export const RUBRIC_LIBRARY: Record<RubricCategory, RubricDefinition> = {
  pronunciation: {
    rubricId: 'rubric-pronunciation-v1',
    category: 'pronunciation',
    title: 'AI Phonetic Accuracy & Intonation Standard',
    description: 'Evaluates vowel clarity, consonant articulation, intonation contours, and speech rhythm.',
    totalMaxScore: 100,
    criteria: [
      {
        id: 'p1-phoneme-clarity',
        title: 'Phonemic Articulation',
        weight: 0.3,
        maxMarks: 30,
        description: 'Accuracy of individual phonemes, minimal pairs, and silent letters.',
        descriptors: {
          foundation: 'Frequent phonemic substitutions; non-native accent hinders intelligibility.',
          intermediate: 'Mostly clear phonemes with occasional accent interference on complex sounds.',
          advanced: 'Native-like phonetic clarity across all English sounds and diphthongs.'
        }
      },
      {
        id: 'p2-intonation',
        title: 'Intonation & Pitch Movement',
        weight: 0.25,
        maxMarks: 25,
        description: 'Rising/falling intonation in questions, statements, and expressive phrasing.',
        descriptors: {
          foundation: 'Monotone pitch or inappropriate pitch drops at phrase boundaries.',
          intermediate: 'Appropriate pitch variations in basic sentence structures.',
          advanced: 'Natural expressive cadence with nuanced pitch modulation for emphasis.'
        }
      },
      {
        id: 'p3-fluency-rate',
        title: 'Speaking Pace & Pause Placement',
        weight: 0.25,
        maxMarks: 25,
        description: 'Words-per-minute (WPM) cadence and meaningful breath pauses.',
        descriptors: {
          foundation: 'Halting speech (<80 WPM) or frequent unnatural pauses mid-phrase.',
          intermediate: 'Steady rhythm (100–130 WPM) with occasional self-correction pauses.',
          advanced: 'Fluid cadence (130–160 WPM) with natural thought-group pauses.'
        }
      },
      {
        id: 'p4-connected-speech',
        title: 'Connected Speech Phenomena',
        weight: 0.2,
        maxMarks: 20,
        description: 'Linking, elision, assimilation, and weak forms in fluid sentences.',
        descriptors: {
          foundation: 'Over-articulated robotic word separation without natural linking.',
          intermediate: 'Basic linking between consonant-vowel word boundaries.',
          advanced: 'Smooth application of elision, assimilation, and stress-timed rhythm.'
        }
      }
    ]
  },

  word_stress: {
    rubricId: 'rubric-word-stress-v1',
    category: 'word_stress',
    title: 'Syllabic Stress & Accentuation Standards',
    description: 'Measures primary, secondary, and unaccented syllabic stress in multi-syllabic words and sentences.',
    totalMaxScore: 100,
    criteria: [
      {
        id: 'ws1-primary-stress',
        title: 'Primary Syllable Stress Placement',
        weight: 0.4,
        maxMarks: 40,
        description: 'Correct identification and emphasis of primary stressed syllables.',
        descriptors: {
          foundation: 'Misplaces primary stress on >40% of multi-syllabic words.',
          intermediate: 'Accurate stress on common words; occasional errors on academic/technical terms.',
          advanced: 'Flawless primary stress across general, technical, and domain-specific vocabulary.'
        }
      },
      {
        id: 'ws2-vowel-reduction',
        title: 'Unstressed Syllable Reduction (Schwa /ə/)',
        weight: 0.3,
        maxMarks: 30,
        description: 'Proper reduction of unaccented vowels to neutral schwa sounds.',
        descriptors: {
          foundation: 'Gives full phonetic weight to all vowels, resulting in unnatural rhythm.',
          intermediate: 'Reduces unstressed vowels in high-frequency words.',
          advanced: 'Consistent schwa reduction maintaining natural English stress timing.'
        }
      },
      {
        id: 'ws3-sentence-stress',
        title: 'Content vs. Function Word Stress',
        weight: 0.3,
        maxMarks: 30,
        description: 'Emphasizing key nouns, verbs, and adjectives while weakening articles/prepositions.',
        descriptors: {
          foundation: 'Stresses function words equally with content words.',
          intermediate: 'Emphasizes main content words with occasional function word over-stressing.',
          advanced: 'Dynamic contrast between focused content words and reduced functional grammar.'
        }
      }
    ]
  },

  vocabulary: {
    rubricId: 'rubric-vocabulary-v1',
    category: 'vocabulary',
    title: 'Lexical Range & Collocation Competency',
    description: 'Assesses vocabulary variety, domain-specific terminology, idiom use, and register appropriateness.',
    totalMaxScore: 100,
    criteria: [
      {
        id: 'v1-lexical-diversity',
        title: 'Lexical Diversity & Precision',
        weight: 0.35,
        maxMarks: 35,
        description: 'Range of vocabulary used beyond high-frequency repetitive words.',
        descriptors: {
          foundation: 'Relies on basic repetitive vocabulary (A1/A2 levels); frequent word searches.',
          intermediate: 'Uses varied intermediate vocabulary (B1/B2) with good semantic accuracy.',
          advanced: 'Deploys rich, precise vocabulary (C1/C2) suited for nuance and academic context.'
        }
      },
      {
        id: 'v2-collocation-idioms',
        title: 'Collocations & Phrasal Precision',
        weight: 0.35,
        maxMarks: 35,
        description: 'Natural word combinations, phrasal verbs, and professional idioms.',
        descriptors: {
          foundation: 'Literal word-for-word translations causing unnatural phraseology.',
          intermediate: 'Correct use of common collocations and fixed expressions.',
          advanced: 'Sophisticated deployment of academic/business collocations and natural idioms.'
        }
      },
      {
        id: 'v3-register-appropriateness',
        title: 'Register & Contextual Tone',
        weight: 0.3,
        maxMarks: 30,
        description: 'Selecting formal, informal, or technical terms matching the target audience.',
        descriptors: {
          foundation: 'Inappropriate mix of casual slang and stiff formal words.',
          intermediate: 'Consistent professional or academic register in standard prompts.',
          advanced: 'Flawless register control adapted dynamically to executive or technical audiences.'
        }
      }
    ]
  },

  grammar: {
    rubricId: 'rubric-grammar-v1',
    category: 'grammar',
    title: 'Grammatical Accuracy & Structural Complexity',
    description: 'Evaluates syntactic correctness, tense consistency, agreement, and complex clause structures.',
    totalMaxScore: 100,
    criteria: [
      {
        id: 'g1-grammatical-accuracy',
        title: 'Morphosyntactic Precision',
        weight: 0.4,
        maxMarks: 40,
        description: 'Absence of subject-verb, article, preposition, or plurals errors.',
        descriptors: {
          foundation: 'Frequent systematic errors in basic verb tenses and agreement.',
          intermediate: 'Good control of simple/compound structures; rare errors in complex forms.',
          advanced: 'Near-zero grammatical defects across extended complex responses.'
        }
      },
      {
        id: 'g2-structural-complexity',
        title: 'Syntactic Variety & Clauses',
        weight: 0.35,
        maxMarks: 35,
        description: 'Use of relative clauses, conditionals, passive voice, and sub-clauses.',
        descriptors: {
          foundation: 'Short simple sentences (SVO) connected only by basic conjunctions (and, but).',
          intermediate: 'Effective mix of simple, compound, and complex sentences.',
          advanced: 'Masterful subordination, inversion, conditional constructs, and complex framing.'
        }
      },
      {
        id: 'g3-tense-aspect-consistency',
        title: 'Tense & Aspect Alignment',
        weight: 0.25,
        maxMarks: 25,
        description: 'Correct deployment of perfect, continuous, and modal auxiliary tenses.',
        descriptors: {
          foundation: 'Tense jumping mid-paragraph without chronological justification.',
          intermediate: 'Accurate past, present, and future time frames in narrative and analytical tasks.',
          advanced: 'Seamless modal, subjunctive, and perfect aspect control.'
        }
      }
    ]
  },

  listening: {
    rubricId: 'rubric-listening-v1',
    category: 'listening',
    title: 'Auditory Comprehension & Detail Extraction',
    description: 'Measures gist understanding, specific fact retrieval, inference, and tone recognition.',
    totalMaxScore: 100,
    criteria: [
      {
        id: 'l1-gist-main-idea',
        title: 'Main Idea & Core Message Identification',
        weight: 0.35,
        maxMarks: 35,
        description: 'Capturing the central thesis or goal of spoken audio passages.',
        descriptors: {
          foundation: 'Struggles to identify the main topic from authentic speech samples.',
          intermediate: 'Accurately identifies main ideas and primary speaker intentions.',
          advanced: 'Extracts overarching arguments, subtle themes, and implicit conclusions.'
        }
      },
      {
        id: 'l2-detail-extraction',
        title: 'Detail & Data Extraction',
        weight: 0.35,
        maxMarks: 35,
        description: 'Retrieving precise names, numbers, dates, and specific qualifiers.',
        descriptors: {
          foundation: 'Misses critical factual details; easily confused by fast pacing.',
          intermediate: 'Retrieves key numbers, facts, and steps in structured audio.',
          advanced: 'Precisely transcribes and extracts nuanced facts even amidst background noise.'
        }
      },
      {
        id: 'l3-inference-speaker-tone',
        title: 'Inference & Speaker Attitude',
        weight: 0.3,
        maxMarks: 30,
        description: 'Deducing implied meanings, speaker emotions, sarcasm, and stance.',
        descriptors: {
          foundation: 'Interprets all speech literally; misses speaker stance or mood.',
          intermediate: 'Recognizes clear tone markers (enthusiasm, hesitation, urgency).',
          advanced: 'Detects subtle irony, professional nuance, unstated assumptions, and bias.'
        }
      }
    ]
  },

  reading: {
    rubricId: 'rubric-reading-v1',
    category: 'reading',
    title: 'Textual Comprehension, Analysis & Speed',
    description: 'Measures skimming, scanning, deep analytical comprehension, and critical reasoning.',
    totalMaxScore: 100,
    criteria: [
      {
        id: 'r1-literal-comprehension',
        title: 'Literal Understanding & Fact Retrieval',
        weight: 0.35,
        maxMarks: 35,
        description: 'Locating and comprehending stated information in texts.',
        descriptors: {
          foundation: 'Frequent misinterpretations of basic sentence meanings and key facts.',
          intermediate: 'Accurately answers direct factual questions from dense paragraphs.',
          advanced: 'Effortless understanding of complex technical documentation and essays.'
        }
      },
      {
        id: 'r2-critical-analysis',
        title: 'Critical Inference & Text Structure',
        weight: 0.35,
        maxMarks: 35,
        description: 'Analyzing author arguments, logical fallacies, and paragraph cohesion.',
        descriptors: {
          foundation: 'Cannot distinguish author opinion from verified evidence.',
          intermediate: 'Identifies text organization, author perspective, and implied points.',
          advanced: 'Critically evaluates argument strength, underlying assumptions, and evidence.'
        }
      },
      {
        id: 'r3-lexical-context',
        title: 'Contextual Vocabulary Decoding',
        weight: 0.3,
        maxMarks: 30,
        description: 'Inferring word meanings from surrounding sentence and paragraph context.',
        descriptors: {
          foundation: 'Stops reading when encountering unfamiliar words; fails to infer.',
          intermediate: 'Deduces meanings of unfamiliar terms using context clues effectively.',
          advanced: 'Rapidly decodes complex jargon and metaphorical usage in technical contexts.'
        }
      }
    ]
  },

  writing: {
    rubricId: 'rubric-writing-v1',
    category: 'writing',
    title: 'Written Task Achievement, Cohesion & Register',
    description: 'Evaluates prompt fulfillment, paragraph organization, transition markers, and academic/business style.',
    totalMaxScore: 100,
    criteria: [
      {
        id: 'w1-task-achievement',
        title: 'Task Achievement & Response Relevance',
        weight: 0.35,
        maxMarks: 35,
        description: 'Fulfilling all parts of the writing prompt with well-developed ideas.',
        descriptors: {
          foundation: 'Incomplete response; off-topic or under-developed arguments (<100 words).',
          intermediate: 'Fully addresses all requirements of the prompt with clear examples.',
          advanced: 'Thorough, insightful expansion of all prompt elements with compelling reasoning.'
        }
      },
      {
        id: 'w2-cohesion-coherence',
        title: 'Coherence, Paragraphing & Connectors',
        weight: 0.35,
        maxMarks: 35,
        description: 'Logical flow, clear topic sentences, and transition words (however, furthermore).',
        descriptors: {
          foundation: 'Disjointed sentences without logical paragraph structure or connectors.',
          intermediate: 'Organized into paragraphs with clear introductory and concluding ideas.',
          advanced: 'Flawless logical progression, subtle cohesive devices, and seamless transitions.'
        }
      },
      {
        id: 'w3-lexicogrammar-writing',
        title: 'Written Syntax & Lexical Mechanics',
        weight: 0.3,
        maxMarks: 30,
        description: 'Spelling, punctuation, sentence complexity, and academic vocabulary.',
        descriptors: {
          foundation: 'Frequent punctuation errors and spelling mistakes affecting readability.',
          intermediate: 'Accurate spelling and punctuation with varied sentence structures.',
          advanced: 'Sophisticated prose style, elegant sentence variety, and impeccable mechanics.'
        }
      }
    ]
  },

  interview: {
    rubricId: 'rubric-interview-v1',
    category: 'interview',
    title: 'Professional Technical & Behavioral Interview Standard',
    description: 'Evaluates STAR method usage, confidence, conciseness, body language indicators, and technical clarity.',
    totalMaxScore: 100,
    criteria: [
      {
        id: 'i1-star-method',
        title: 'STAR Method Structure (Situation, Task, Action, Result)',
        weight: 0.35,
        maxMarks: 35,
        description: 'Structuring behavioral responses with quantifiable results and clear ownership.',
        descriptors: {
          foundation: 'Vague, rambling answers lacking structured Situation or concrete Results.',
          intermediate: 'Clear Situation and Action; includes basic measurable outcome or takeaway.',
          advanced: 'Masterful STAR structure with concise framing and impactful quantified metrics.'
        }
      },
      {
        id: 'i2-communication-clarity',
        title: 'Conciseness, Filler Avoidance & Confidence',
        weight: 0.35,
        maxMarks: 35,
        description: 'Direct answers without excessive fillers (um, like, you know) or hedging.',
        descriptors: {
          foundation: 'Heavy filler usage (>10 per min); hesitant tone or excessive hedging.',
          intermediate: 'Direct communication with minimal filler pauses; professional poise.',
          advanced: 'Articulate, compelling executive presence with crisp delivery.'
        }
      },
      {
        id: 'i3-technical-domain-depth',
        title: 'Domain Accuracy & Problem-Solving Approach',
        weight: 0.3,
        maxMarks: 30,
        description: 'Demonstrating subject matter knowledge and structured analytical thinking.',
        descriptors: {
          foundation: 'Superficial understanding of core engineering/business concepts.',
          intermediate: 'Solid technical explanation with correct terminology and trade-off analysis.',
          advanced: 'Deep domain expertise, architectural foresight, and clear trade-off rationale.'
        }
      }
    ]
  },

  business_communication: {
    rubricId: 'rubric-business-communication-v1',
    category: 'business_communication',
    title: 'Corporate Communication & Cross-Cultural Diplomacy',
    description: 'Measures executive summaries, email etiquette, stakeholder framing, and persuasive negotiation.',
    totalMaxScore: 100,
    criteria: [
      {
        id: 'bc1-stakeholder-framing',
        title: 'Stakeholder Audience Alignment',
        weight: 0.35,
        maxMarks: 35,
        description: 'Adapting technical details for business leaders, clients, or cross-functional peers.',
        descriptors: {
          foundation: 'Over-technical or tone-deaf communication ignoring audience needs.',
          intermediate: 'Clear value proposition framed appropriately for business stakeholders.',
          advanced: 'Executive-level framing highlighting strategic ROI, risks, and next steps.'
        }
      },
      {
        id: 'bc2-brevity-format',
        title: 'Corporate Formatting & Brevity',
        weight: 0.35,
        maxMarks: 35,
        description: 'Effective use of action headers, bullet points, callouts, and call-to-actions.',
        descriptors: {
          foundation: 'Wall of unformatted text without clear action items or subject lines.',
          intermediate: 'Clean bulleted layout with clear action items and deadline framing.',
          advanced: 'Impeccable executive brief format; scannable, persuasive, and time-saving.'
        }
      },
      {
        id: 'bc3-diplomacy-negotiation',
        title: 'Tactful Diplomacy & Conflict Resolution',
        weight: 0.3,
        maxMarks: 30,
        description: 'Managing pushback, delivering bad news, and negotiating compromises gracefully.',
        descriptors: {
          foundation: 'Aggressive, passive, or blunt phrasing causing relational friction.',
          intermediate: 'Polite, constructive tone when raising objections or alternative solutions.',
          advanced: 'Diplomatic mastery that builds rapport, resolves friction, and secures buy-in.'
        }
      }
    ]
  }
};

/**
 * Helper to retrieve rubric by category or fallback to pronunciation
 */
export function getRubricByCategory(category: RubricCategory): RubricDefinition {
  return RUBRIC_LIBRARY[category] || RUBRIC_LIBRARY.pronunciation;
}
