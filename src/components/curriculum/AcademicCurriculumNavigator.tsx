/**
 * SAILL - SRIT AI Language Laboratory
 * Academic Curriculum Interactive Navigator
 *
 * @version 1.0.0
 * @description Renders the 9 Academic Curriculum items in a horizontal interactive strip using ContentTabs.
 */

import React from 'react';
import { ContentTabs, TabItem } from '../common/ContentTabs';
import {
  Compass,
  Target,
  Layers,
  Calendar,
  Sparkles,
  Cpu,
  Calculator,
  Library,
  Award,
  CheckCircle2,
  GraduationCap,
  BookOpen,
  Code2,
  Heart,
  ChevronRight,
  FileCheck2,
  Mic,
  Clock,
  Download,
  BookCheck,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';

export const AcademicCurriculumNavigator: React.FC = () => {
  const [activeTabId, setActiveTabId] = React.useState<string>('inst-profile');

  const curriculumTabs: TabItem[] = [
    // 1. Institution Profile
    {
      id: 'inst-profile',
      label: 'Institution Profile',
      icon: Compass,
      badge: 'SRIT',
      content: (
        <div className="space-y-6">
          <div className="border-b border-[#FAD7A0] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E67E22] bg-[#FFF8F0] px-2.5 py-1 rounded-md border border-[#FAD7A0]">
                Institutional Foundation
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#2C3E50] font-heading mt-1">
                Srinivasa Ramanujan Institute of Technology (Autonomous)
              </h3>
            </div>
            <span className="px-3 py-1 bg-[#2C3E50] text-[#FAD7A0] text-xs font-mono font-bold rounded-lg shrink-0 self-start sm:self-auto">
              Est. 2008 | Ananthapuramu
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* About SRIT */}
            <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-2">
              <strong className="text-[#D35400] font-extrabold text-xs uppercase block font-heading flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-[#D35400]" />
                <span>About SRIT</span>
              </strong>
              <p className="text-[#5D6D7E] leading-relaxed">
                Srinivasa Ramanujan Institute of Technology (Autonomous), located in Ananthapuramu, Andhra Pradesh, is a premier engineering institution committed to quality technical education, human values, and continuous innovation.
              </p>
            </div>

            {/* Vision Statement */}
            <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-2">
              <strong className="text-[#E67E22] font-extrabold text-xs uppercase block font-heading flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#E67E22]" />
                <span>Vision Statement</span>
              </strong>
              <p className="text-[#2C3E50] leading-relaxed italic font-serif">
                &ldquo;To become a premier Educational Institution in India offering the best teaching and learning environment for our students that will enable them to become complete individuals with professional competency, human touch, ethical values, service motto, and a strong sense of responsibility towards environment and society at large.&rdquo;
              </p>
            </div>

            {/* Mission Statement */}
            <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-2">
              <strong className="text-[#2C3E50] font-extrabold text-xs uppercase block font-heading flex items-center gap-1.5">
                <Target className="w-4 h-4 text-[#2C3E50]" />
                <span>Mission Statement</span>
              </strong>
              <ul className="space-y-1.5 text-[#5D6D7E]">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D35400] shrink-0 mt-0.5" />
                  <span>Continually enhance physical & human resources for excellence.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D35400] shrink-0 mt-0.5" />
                  <span>Provide learning experiences for professional competency & ethical values.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D35400] shrink-0 mt-0.5" />
                  <span>Strengthen industry interactions for real-world skill readiness.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Department & Author Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#FFF8F0] via-white to-[#FFF8F0] border-2 border-[#FAD7A0] space-y-3">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#D35400] text-white flex items-center justify-center font-black text-xl shrink-0 shadow-md">
                SRIT
              </div>
              <div className="space-y-1 text-center sm:text-left flex-1">
                <h4 className="font-extrabold text-base text-[#2C3E50]">Department of Humanities & Sciences (English)</h4>
                <p className="text-xs text-[#D35400] font-bold">SAILL Platform Founder & Chief Architect: Dr Anil Kumar D (PhD, IIT Madras)</p>
                <p className="text-xs text-[#5D6D7E]">Designed specifically for I Year B.Tech Engineering Students under R26 Autonomous Regulations.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // 2. Course Outcomes
    {
      id: 'course-outcomes',
      label: 'Course Outcomes',
      icon: Target,
      badge: 'CO1–CO5',
      content: (
        <div className="space-y-6">
          <div className="border-b border-[#FAD7A0] pb-4">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D35400] bg-[#FFF8F0] px-2.5 py-1 rounded-md border border-[#FAD7A0]">
              Outcome-Based Education
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#2C3E50] font-heading mt-1">
              Course Outcomes (COs) — R26 Communicative English Lab
            </h3>
            <p className="text-xs text-[#5D6D7E] font-medium mt-1">
              Aligned with Bloom&apos;s Taxonomy and NBA Graduate Attributes for B.Tech First-Year Undergraduates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {[
              {
                code: 'CO1',
                title: 'Fluency & Clarity',
                bloom: 'Applying',
                desc: 'Express thoughts clearly, fluently, and confidently in academic and professional contexts using context-appropriate vocabulary and syntactic accuracy.'
              },
              {
                code: 'CO2',
                title: 'Phonetic Precision',
                bloom: 'Applying',
                desc: 'Demonstrate proficiency in English phonetics, articulation of Vowels & Consonants, syllable stress patterns, intonation, and rhythm.'
              },
              {
                code: 'CO3',
                title: 'Active Listening & Comprehension',
                bloom: 'Analyzing',
                desc: 'Analyze and interpret complex spoken technical texts through active listening strategies, note-taking, and critical comprehension drills.'
              },
              {
                code: 'CO4',
                title: 'Group Discussion & Impromptu Speech',
                bloom: 'Evaluating',
                desc: 'Apply structured oral communication techniques for corporate Group Discussions, JAM 60-second sessions, extempore speaking, and debate etiquette.'
              },
              {
                code: 'CO5',
                title: 'Interview Skills & Career Readiness',
                bloom: 'Creating',
                desc: 'Formulate professional technical resumes, ATS-friendly cover letters, and demonstrate interview readiness using the STAR behavioral response methodology.'
              }
            ].map((co) => (
              <div key={co.code} className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-2 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-[#D35400] text-white font-mono font-black text-xs rounded-lg">
                    {co.code}
                  </span>
                  <span className="text-[10px] font-bold text-[#E67E22] bg-white px-2 py-0.5 rounded-full border border-[#FAD7A0]">
                    Bloom: {co.bloom}
                  </span>
                </div>
                <h4 className="font-extrabold text-sm text-[#2C3E50]">{co.title}</h4>
                <p className="text-xs text-[#5D6D7E] leading-relaxed">{co.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },

    // 3. Course Structure
    {
      id: 'course-structure',
      label: 'Course Structure',
      icon: Layers,
      badge: '1.5 Credits',
      content: (
        <div className="space-y-6">
          <div className="border-b border-[#FAD7A0] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E67E22] bg-[#FFF8F0] px-2.5 py-1 rounded-md border border-[#FAD7A0]">
                Curriculum Design
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#2C3E50] font-heading mt-1">
                Course Structure & Credit Scheme
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold">
              <span className="px-3 py-1 bg-[#D35400] text-white rounded-lg">1.5 Credits</span>
              <span className="px-3 py-1 bg-[#2C3E50] text-[#FAD7A0] rounded-lg">3 Hrs/Week</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3.5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1">
              <span className="block text-[10px] font-extrabold text-[#D35400] uppercase">Course Code</span>
              <strong className="text-sm font-black text-[#2C3E50]">R26-BS-ENG-101</strong>
            </div>
            <div className="p-3.5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1">
              <span className="block text-[10px] font-extrabold text-[#E67E22] uppercase">Regulation</span>
              <strong className="text-sm font-black text-[#2C3E50]">R26 Autonomous</strong>
            </div>
            <div className="p-3.5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1">
              <span className="block text-[10px] font-extrabold text-[#2C3E50] uppercase">Year & Sem</span>
              <strong className="text-sm font-black text-[#2C3E50]">I Year B.Tech (Sem I/II)</strong>
            </div>
            <div className="p-3.5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1">
              <span className="block text-[10px] font-extrabold text-[#D35400] uppercase">Modules</span>
              <strong className="text-sm font-black text-[#2C3E50]">12 AI Lab Modules</strong>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-[#2C3E50] uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#D35400]" />
              <span>12 AI-Powered Laboratory Modules</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
              {[
                { id: 'M01', name: 'Phonetics & IPA Symbols', focus: 'Vowels, Consonants, Minimal Pairs' },
                { id: 'M02', name: 'Syllable Stress & Intonation', focus: 'Word Stress, Pitch Movement' },
                { id: 'M03', name: 'Active Listening Strategies', focus: 'Note-Taking, Inference' },
                { id: 'M04', name: 'JAM (Just A Minute) Drills', focus: 'Impromptu Speaking, Fluency' },
                { id: 'M05', name: 'Group Discussion Etiquette', focus: 'Turn-Taking, Leadership' },
                { id: 'M06', name: 'STAR Interview Skills', focus: 'Behavioral Mock Interviews' },
                { id: 'M07', name: 'Technical Resume Building', focus: 'ATS Optimization, Bullet Points' },
                { id: 'M08', name: 'Professional Email Writing', focus: 'Corporate Correspondence' },
                { id: 'M09', name: 'Public Speaking & Presentation', focus: 'Body Language, Visual Aids' },
                { id: 'M10', name: 'Corporate Workplace Etiquette', focus: 'Interpersonal Dynamics' },
                { id: 'M11', name: 'Debate & Persuasive Discourse', focus: 'Argumentation, Rebuttal' },
                { id: 'M12', name: 'Comprehensive Portfolio Defense', focus: 'Final Viva Voce Prep' }
              ].map((m) => (
                <div key={m.id} className="p-3 rounded-xl bg-white border border-[#FAD7A0] flex items-start gap-2.5">
                  <span className="px-2 py-0.5 bg-[#D35400] text-white font-mono font-bold text-[10px] rounded-md shrink-0">
                    {m.id}
                  </span>
                  <div>
                    <h5 className="font-extrabold text-[#2C3E50] text-xs">{m.name}</h5>
                    <p className="text-[10px] text-[#5D6D7E]">{m.focus}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },

    // 4. Weekly Plan
    {
      id: 'weekly-plan',
      label: 'Weekly Plan',
      icon: Calendar,
      badge: '12 Weeks',
      content: (
        <div className="space-y-6">
          <div className="border-b border-[#FAD7A0] pb-4">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D35400] bg-[#FFF8F0] px-2.5 py-1 rounded-md border border-[#FAD7A0]">
              Laboratory Schedule
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#2C3E50] font-heading mt-1">
              12-Week Laboratory Syllabus Plan
            </h3>
            <p className="text-xs text-[#5D6D7E] font-medium mt-1">
              Structured week-by-week practical execution schedule for SRIT R26 Communicative English Laboratory.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {[
              { week: 'Week 1–2', topic: 'Phonetics & IPA Sound Systems', activities: 'Vowels, Consonants, Diphthongs, Minimal pairs visualizer, Real-time microphone audio recording.' },
              { week: 'Week 3–4', topic: 'Syllable Stress, Intonation & Accent', activities: 'Primary/Secondary stress, Pitch contours, Rhythm exercises, MTI neutralization drills.' },
              { week: 'Week 5–6', topic: 'Active Listening & Comprehension', activities: 'Audio lecture note-taking, Contextual inference, Diagnostic listening quizzes.' },
              { week: 'Week 7–8', topic: 'JAM 60-Sec & Extempore Speaking', activities: 'Impromptu topic generation, Hesitation pause detection, Words Per Minute (WPM) tracking.' },
              { week: 'Week 9–10', topic: 'Group Discussion & Debate Etiquette', activities: 'Initiation, Consensus building, Rebuttal strategies, AI GD performance diagnostic.' },
              { week: 'Week 11–12', topic: 'Resume Building & STAR Mock Interview', activities: 'ATS-friendly resume drafting, STAR behavioral questions, Portfolio submission.' }
            ].map((plan, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-[#2C3E50] text-[#FAD7A0] font-mono font-black text-xs rounded-lg">
                    {plan.week}
                  </span>
                  <span className="text-[10px] font-bold text-[#D35400]">3 Hours Session</span>
                </div>
                <h4 className="font-extrabold text-sm text-[#2C3E50]">{plan.topic}</h4>
                <p className="text-xs text-[#5D6D7E] leading-relaxed">{plan.activities}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },

    // 5. Learning Outcomes
    {
      id: 'learning-outcomes',
      label: 'Learning Outcomes',
      icon: Sparkles,
      badge: '4 Core Pillars',
      content: (
        <div className="space-y-6">
          <div className="border-b border-[#FAD7A0] pb-4">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E67E22] bg-[#FFF8F0] px-2.5 py-1 rounded-md border border-[#FAD7A0]">
              Student Mastery Goals
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#2C3E50] font-heading mt-1">
              Learning Outcomes (LOs) & Student Competencies
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-2">
              <strong className="text-[#D35400] font-extrabold text-xs uppercase block font-heading flex items-center gap-1.5">
                <Mic className="w-4 h-4 text-[#D35400]" />
                <span>1. Speech Clarity & Accent Neutralization</span>
              </strong>
              <p className="text-[#5D6D7E] leading-relaxed">
                Students will articulate standard English phonemes without significant mother-tongue influence (MTI), applying accurate syllable stress and natural intonation in spontaneous speech.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-2">
              <strong className="text-[#E67E22] font-extrabold text-xs uppercase block font-heading flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#E67E22]" />
                <span>2. Impromptu Oral Confidence</span>
              </strong>
              <p className="text-[#5D6D7E] leading-relaxed">
                Students will speak spontaneously on unfamiliar technical or general topics during 60-second JAM sessions with minimal hesitation, clear structure, and high fluency.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-2">
              <strong className="text-[#2C3E50] font-extrabold text-xs uppercase block font-heading flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#2C3E50]" />
                <span>3. Collaborative Group Communication</span>
              </strong>
              <p className="text-[#5D6D7E] leading-relaxed">
                Students will participate constructively in corporate group discussions, demonstrating active listening, professional intervention, leadership skills, and team consensus.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-2">
              <strong className="text-[#D35400] font-extrabold text-xs uppercase block font-heading flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-[#D35400]" />
                <span>4. Employability & Placement Readiness</span>
              </strong>
              <p className="text-[#5D6D7E] leading-relaxed">
                Students will create ATS-optimized technical resumes, professional emails, and successfully answer STAR behavioral interview questions for campus recruitment drives.
              </p>
            </div>
          </div>
        </div>
      )
    },

    // 6. Teaching Methodology
    {
      id: 'teaching-methodology',
      label: 'Teaching Methodology',
      icon: Cpu,
      badge: 'Pedagogy',
      content: (
        <div className="space-y-6">
          <div className="border-b border-[#FAD7A0] pb-4">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D35400] bg-[#FFF8F0] px-2.5 py-1 rounded-md border border-[#FAD7A0]">
              Pedagogical Framework
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#2C3E50] font-heading mt-1">
              AI-Augmented Teaching & Learning Methodology
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-2">
              <div className="w-8 h-8 rounded-xl bg-[#D35400] text-white flex items-center justify-center font-bold">1</div>
              <h4 className="font-extrabold text-sm text-[#2C3E50]">Interactive AI Practicum</h4>
              <p className="text-[#5D6D7E]">Direct student engagement with SAILL speech tools for instant pitch, WPM, and phonetic feedback.</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-2">
              <div className="w-8 h-8 rounded-xl bg-[#E67E22] text-white flex items-center justify-center font-bold">2</div>
              <h4 className="font-extrabold text-sm text-[#2C3E50]">Experiential Audio Recording</h4>
              <p className="text-[#5D6D7E]">Self-recording, playback analysis, and iterative improvement stored in student digital portfolios.</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-2">
              <div className="w-8 h-8 rounded-xl bg-[#2C3E50] text-white flex items-center justify-center font-bold">3</div>
              <h4 className="font-extrabold text-sm text-[#2C3E50]">Task-Based Learning (TBLT)</h4>
              <p className="text-[#5D6D7E]">Real-world simulations: mock interviews, corporate GDs, debates, and presentation drills.</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-2">
              <div className="w-8 h-8 rounded-xl bg-[#D35400] text-white flex items-center justify-center font-bold">4</div>
              <h4 className="font-extrabold text-sm text-[#2C3E50]">OBE Continuous Feedback</h4>
              <p className="text-[#5D6D7E]">Formative rubric diagnostics automatically linked to course outcome attainment metrics.</p>
            </div>
          </div>
        </div>
      )
    },

    // 7. Assessment Strategy
    {
      id: 'assessment-strategy',
      label: 'Assessment Strategy',
      icon: Calculator,
      badge: 'CIE + SEE',
      content: (
        <div className="space-y-6">
          <div className="border-b border-[#FAD7A0] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E67E22] bg-[#FFF8F0] px-2.5 py-1 rounded-md border border-[#FAD7A0]">
                Evaluation Scheme
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#2C3E50] font-heading mt-1">
                Assessment Scheme & Marks Distribution
              </h3>
            </div>
            <span className="px-3 py-1 bg-[#D35400] text-white text-xs font-mono font-bold rounded-lg shrink-0 self-start sm:self-auto">
              Total: 100 Marks (Passing: 40%)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-2">
              <span className="px-2 py-0.5 bg-[#D35400] text-white text-[10px] font-mono font-bold rounded-md">60% Weightage</span>
              <h4 className="font-extrabold text-sm text-[#2C3E50]">Day-to-Day Lab Work</h4>
              <strong className="text-lg font-black text-[#D35400] block">30 Marks</strong>
              <p className="text-[#5D6D7E] text-[11px]">Continuous evaluation of 12 lab modules saved to IndexedDB portfolio.</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-2">
              <span className="px-2 py-0.5 bg-[#E67E22] text-white text-[10px] font-mono font-bold rounded-md">Internal Exam</span>
              <h4 className="font-extrabold text-sm text-[#2C3E50]">Mid Practical Test</h4>
              <strong className="text-lg font-black text-[#E67E22] block">20 Marks</strong>
              <p className="text-[#5D6D7E] text-[11px]">Internal oral viva, phonetics transcription, and impromptu speech test.</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-2">
              <span className="px-2 py-0.5 bg-[#2C3E50] text-[#FAD7A0] text-[10px] font-mono font-bold rounded-md">Attendance</span>
              <h4 className="font-extrabold text-sm text-[#2C3E50]">Regularity & Notebook</h4>
              <strong className="text-lg font-black text-[#2C3E50] block">10 Marks</strong>
              <p className="text-[#5D6D7E] text-[11px]">Laboratory notebook record submissions and session attendance.</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-2">
              <span className="px-2 py-0.5 bg-[#D35400] text-white text-[10px] font-mono font-bold rounded-md">40% SEE</span>
              <h4 className="font-extrabold text-sm text-[#2C3E50]">End Semester Practical</h4>
              <strong className="text-lg font-black text-[#D35400] block">40 Marks</strong>
              <p className="text-[#5D6D7E] text-[11px]">External practical examination and comprehensive oral viva voce.</p>
            </div>
          </div>
        </div>
      )
    },

    // 8. Resources
    {
      id: 'resources',
      label: 'Resources',
      icon: Library,
      badge: 'Syllabus Assets',
      content: (
        <div className="space-y-6">
          <div className="border-b border-[#FAD7A0] pb-4">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D35400] bg-[#FFF8F0] px-2.5 py-1 rounded-md border border-[#FAD7A0]">
              Learning Material & References
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#2C3E50] font-heading mt-1">
              Resources, Textbooks & Media Assets
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-2">
              <strong className="text-[#D35400] font-extrabold text-xs uppercase block font-heading flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#D35400]" />
                <span>Prescribed Textbooks & Manuals</span>
              </strong>
              <ul className="space-y-1.5 text-[#5D6D7E] text-[11px]">
                <li>• <strong>SRIT R26 Communicative English Lab Manual</strong>, Dept of H&S, SRIT (Autonomous).</li>
                <li>• <em>Better English Pronunciation</em> by J.D. O&apos;Connor, Cambridge University Press.</li>
                <li>• <em>A Course in Phonetics and Spoken English</em> by J. Sethi et al., PHI Learning.</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-2">
              <strong className="text-[#E67E22] font-extrabold text-xs uppercase block font-heading flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-[#E67E22]" />
                <span>Digital AI & Audio Assets</span>
              </strong>
              <ul className="space-y-1.5 text-[#5D6D7E] text-[11px]">
                <li>• Interactive IPA Vowel & Consonant Audio Chart with Native Speaker Recordings.</li>
                <li>• AI Speech Diagnostics: WPM, Filler Word Density & Pause Detectors.</li>
                <li>• Client-Side IndexedDB Offline Portfolio & Notebook Exporter.</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },

    // 9. Evaluation Framework
    {
      id: 'evaluation-framework',
      label: 'Evaluation Framework',
      icon: Award,
      badge: 'Rubric Criteria',
      content: (
        <div className="space-y-6">
          <div className="border-b border-[#FAD7A0] pb-4">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E67E22] bg-[#FFF8F0] px-2.5 py-1 rounded-md border border-[#FAD7A0]">
              Standardized Rubrics
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#2C3E50] font-heading mt-1">
              Outcome-Based Evaluation Rubric Matrix
            </h3>
            <p className="text-xs text-[#5D6D7E] font-medium mt-1">
              Used across all 12 modules for automated AI feedback and faculty validation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-2">
              <span className="px-2 py-0.5 bg-[#D35400] text-white text-[10px] font-mono font-bold rounded-md">30% Weight</span>
              <h4 className="font-extrabold text-sm text-[#2C3E50]">Pronunciation & Phonetics</h4>
              <p className="text-[#5D6D7E] text-[11px]">Clarity of phonemes, minimal pairs, syllable stress, and intonation contour precision.</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-2">
              <span className="px-2 py-0.5 bg-[#E67E22] text-white text-[10px] font-mono font-bold rounded-md">25% Weight</span>
              <h4 className="font-extrabold text-sm text-[#2C3E50]">Fluency & Delivery Rhythm</h4>
              <p className="text-[#5D6D7E] text-[11px]">Speech rate (Words Per Minute), absence of unnatural pauses and filler words.</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-2">
              <span className="px-2 py-0.5 bg-[#2C3E50] text-[#FAD7A0] text-[10px] font-mono font-bold rounded-md">25% Weight</span>
              <h4 className="font-extrabold text-sm text-[#2C3E50]">Grammar & Syntax</h4>
              <p className="text-[#5D6D7E] text-[11px]">Correct tense agreement, sentence structure, prepositions, and structural accuracy.</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-2">
              <span className="px-2 py-0.5 bg-[#D35400] text-white text-[10px] font-mono font-bold rounded-md">20% Weight</span>
              <h4 className="font-extrabold text-sm text-[#2C3E50]">Vocabulary & Diction</h4>
              <p className="text-[#5D6D7E] text-[11px]">Appropriate contextual vocabulary, academic word list usage, and formal register.</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const activeTab = curriculumTabs.find((t) => t.id === activeTabId) || curriculumTabs[0];

  return (
    <div className="space-y-6">
      {/* 9-Card Responsive Grid Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {curriculumTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`p-4 rounded-2xl text-left border-2 transition cursor-pointer flex items-start gap-3 relative overflow-hidden ${
                isActive
                  ? 'bg-gradient-to-br from-[#FFF8F0] to-white border-[#D35400] shadow-md ring-2 ring-[#D35400]/20'
                  : 'bg-white border-[#FAD7A0] hover:border-[#E67E22] hover:bg-[#FFF8F0]/40'
              }`}
            >
              <div
                className={`p-2.5 rounded-xl shrink-0 transition ${
                  isActive
                    ? 'bg-[#D35400] text-white'
                    : 'bg-[#FFF8F0] text-[#D35400] border border-[#FAD7A0]'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1.5 mb-1">
                  <h4
                    className={`font-black text-xs sm:text-sm truncate ${
                      isActive ? 'text-[#D35400]' : 'text-[#2C3E50]'
                    }`}
                  >
                    {tab.label}
                  </h4>
                  {tab.badge && (
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
                        isActive
                          ? 'bg-[#2C3E50] text-[#FAD7A0]'
                          : 'bg-[#FFF8F0] text-[#D35400] border border-[#FAD7A0]'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-gray-600 line-clamp-1">
                  Explore {tab.label} details
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Curriculum Pillar Display */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#FAD7A0] shadow-md animate-in fade-in duration-200">
        {activeTab.content}
      </div>
    </div>
  );
};

export default AcademicCurriculumNavigator;
