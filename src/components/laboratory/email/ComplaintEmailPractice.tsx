import React, { useState } from 'react';
import { AlertOctagon, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ComplaintScenario {
  id: string;
  title: string;
  category: string;
  recipient: string;
  context: string;
  prompt?: string;
  sampleSubject: string;
  sampleBody: string;
}

const COMPLAINT_SCENARIOS: ComplaintScenario[] = [
  {
    id: 'delayed_service',
    title: '1. Delayed Service',
    category: 'Vendor Services',
    recipient: 'Support Manager, Campus Canteen Vendors',
    context: 'Order for college department refreshment catering delayed by 2 hours during an academic guest workshop.',
    sampleSubject: '[Urgent Complaint] Delayed Refreshment Catering - Language Lab Workshop',
    sampleBody: 'Dear Catering Manager,\n\nI am writing to express my disappointment regarding the refreshment catering order (Order #3042) scheduled for 11:00 AM today at the Language Laboratory.\n\nThe order arrived over two hours late, causing significant disruption to our ongoing guest workshop. I would appreciate an explanation and a partial refund as per your service level agreement.\n\nRegards,\nAnil Kumar\nStudent Coordinator, SRIT'
  },
  {
    id: 'damaged_product',
    title: '2. Damaged Product',
    category: 'Procurement',
    recipient: 'Customer Support, Lab Equipment Supplier',
    context: 'Received a shipment of 5 digital USB headsets with broken microphones for the English Language Lab.',
    sampleSubject: '[Complaint & Replacement] Damaged Headsets - Order #SRIT-9041',
    sampleBody: 'Dear Customer Support Team,\n\nUpon unpacking our recent shipment of 20 USB headsets (Order #SRIT-9041), we noticed that 5 units had cracked microphone booms and non-functional audio channels.\n\nKindly arrange for a replacement of these 5 defective headsets at your earliest convenience.\n\nSincerely,\nSRIT Language Lab In-Charge'
  },
  {
    id: 'incorrect_billing',
    title: '3. Incorrect Billing',
    category: 'Finance & Accounts',
    recipient: 'Accounts Section, SRIT',
    prompt: 'Report an erroneous fee charge for exam re-evaluation that was already paid online.',
    context: 'Exam fee portal charged your account twice for Mid-1 re-evaluation.',
    sampleSubject: '[Billing Issue] Duplicate Exam Fee Charge - Roll No 264G1A0501',
    sampleBody: 'Dear Finance Officer,\n\nI would like to bring to your attention a billing error on the student portal. My account was debited twice (INR 500 x 2) for the Mid-1 re-evaluation fee on July 10, 2026.\n\nI have attached both transaction receipts for your verification and kindly request a refund for the duplicate transaction.\n\nThank you for your assistance.\n\nBest regards,\nAnil Kumar (264G1A0501)'
  },
  {
    id: 'software_issue',
    title: '4. Software Issue',
    category: 'IT Helpdesk',
    recipient: 'IT Support, SRIT Campus',
    context: 'Compiler software crashing repeatedly during Python laboratory sessions on Lab PC 12.',
    sampleSubject: '[Technical Complaint] Repeated Compiler Crash - Language Lab PC 12',
    sampleBody: 'Dear IT Support Team,\n\nI am writing to report a persistent software issue on System PC 12 in Language Lab 01. The Python IDE crashes with a segmentation fault whenever running multi-threaded scripts.\n\nCould you please inspect or re-install the environment before tomorrow\'s lab session?\n\nRegards,\nAnil Kumar\nB.Tech CSE'
  },
  {
    id: 'internet_issue',
    title: '5. Internet Connectivity',
    category: 'IT Helpdesk',
    recipient: 'Network Administrator',
    context: 'Campus Wi-Fi network dropping connection continuously in the Central Library digital reading room.',
    sampleSubject: '[Network Complaint] Intermittent Wi-Fi Disconnection - Central Library',
    sampleBody: 'Dear Network Administrator,\n\nStudents using the Central Library digital reading room have been experiencing frequent Wi-Fi disconnections over the past three days. This is impacting online journal access for project research.\n\nWe request your team to inspect the wireless access point in the library reading wing.\n\nThank you,\nLibrary Student Committee'
  },
  {
    id: 'hostel_maint',
    title: '6. Hostel Maintenance',
    category: 'Facilities',
    recipient: 'Hostel Warden, Block-B',
    context: 'Water leakage in the third-floor washroom causing inconvenience to students.',
    sampleSubject: '[Maintenance Complaint] Water Leakage - Hostel Block-B, 3rd Floor',
    sampleBody: 'Dear Hostel Warden,\n\nI am writing to report a persistent water pipe leakage in the 3rd-floor washroom of Hostel Block-B. The leakage has created slippery floor conditions.\n\nWe request the maintenance team to repair the valve at the earliest.\n\nRespectfully,\nHostel Resident Representative'
  },
  {
    id: 'library_issue',
    title: '7. Library System Issue',
    category: 'Library Admin',
    recipient: 'Chief Librarian',
    prompt: 'Report an error in book return status showing overdue fine despite physical return.',
    context: 'Returned textbook physically on Monday, but portal shows overdue status.',
    sampleSubject: '[Library Issue] Incorrect Overdue Status - Roll No 264G1A0501',
    sampleBody: 'Dear Chief Librarian,\n\nI returned the textbook "Engineering Communication by Dr. Sharma" at the library counter on July 20. However, the portal still lists the book as unreturned with an overdue fine.\n\nKindly update the circulation database record.\n\nThank you,\nAnil Kumar (264G1A0501)'
  },
  {
    id: 'lab_equip',
    title: '8. Laboratory Equipment',
    category: 'Lab Admin',
    recipient: 'Lab Technician',
    context: 'Audio headsets in Language Lab 03 suffering from heavy background static noise during pronunciation drills.',
    sampleSubject: '[Lab Equipment] Static Audio Noise - Systems 05 to 08 (Lab 03)',
    sampleBody: 'Dear Lab Technician,\n\nDuring our morning speech drill, systems 05 through 08 in Language Lab 03 exhibited severe static noise through the headphones. This hindered audio clarity.\n\nKindly check the audio cable connections or replace the headsets.\n\nBest regards,\nCSE Section A Class Representative'
  }
];

interface ComplaintEmailPracticeProps {
  onCompleteActivity: () => void;
}

export const ComplaintEmailPractice: React.FC<ComplaintEmailPracticeProps> = ({ onCompleteActivity }) => {
  const [selectedId, setSelectedId] = useState<string>('delayed_service');
  const [subject, setSubject] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [evaluation, setEvaluation] = useState<{
    tone: number;
    courtesy: number;
    problemDesc: number;
    resolution: number;
    overall: number;
    feedback: string[];
  } | null>(null);

  const activeScenario = COMPLAINT_SCENARIOS.find((s) => s.id === selectedId) || COMPLAINT_SCENARIOS[0];

  const handleSelectScenario = (id: string) => {
    setSelectedId(id);
    const sc = COMPLAINT_SCENARIOS.find((s) => s.id === id);
    if (sc) {
      setSubject(sc.sampleSubject);
      setBody(sc.sampleBody);
    }
    setEvaluation(null);
  };

  const evaluateComplaint = () => {
    if (!body.trim()) return;

    let tone = 8;
    let courtesy = 8;
    let problemDesc = 8;
    let resolution = 8;
    const feedback: string[] = [];

    // Polite phrases check
    if (/regards|sincerely|thank you|kindly|please/i.test(body)) {
      courtesy += 1;
    } else {
      courtesy -= 2;
      feedback.push('Add a courteous closing ("Thank you", "Kind regards").');
    }

    // Modal verbs check
    if (/would appreciate|request|could you/i.test(body)) {
      tone += 1;
    } else {
      tone -= 2;
      feedback.push('Use modal verbs ("I would appreciate", "Could you kindly...") to maintain a constructive tone.');
    }

    // Problem specifics check
    if (body.length > 50) {
      problemDesc += 1;
    } else {
      problemDesc -= 2;
      feedback.push('Elaborate on the specific problem details (time, location, system number).');
    }

    tone = Math.min(10, Math.max(5, tone));
    courtesy = Math.min(10, Math.max(5, courtesy));
    problemDesc = Math.min(10, Math.max(5, problemDesc));
    resolution = Math.min(10, Math.max(5, resolution));

    const overall = Math.round((tone + courtesy + problemDesc + resolution) / 4);

    if (feedback.length === 0) {
      feedback.push('Outstanding professional complaint draft! Firm yet courteous and problem-solution oriented.');
    }

    setEvaluation({
      tone,
      courtesy,
      problemDesc,
      resolution,
      overall,
      feedback
    });
  };

  return (
    <div className="space-y-6">
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
        {/* Header */}
        <div className="border-b border-[#FAD7A0] pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest bg-[#D35400] text-white px-2 py-0.5 rounded-md">
              Section 5
            </span>
            <span className="text-xs text-[#5D6D7E] font-bold">R26 Communicative English Laboratory</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-[#D35400]" />
            5. Professional Complaint Email Practice
          </h2>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Learn to express grievances, service delays, or equipment faults firmly yet courteously without aggressive language.
          </p>
        </div>

        {/* Scenarios Grid */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#D35400] uppercase tracking-wider block">
            Select Complaint Scenario (8 Workplace & Campus Scenarios):
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {COMPLAINT_SCENARIOS.map((sc) => {
              const isSelected = sc.id === selectedId;
              return (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => handleSelectScenario(sc.id)}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#D35400] text-white border-[#D35400] shadow-2xs'
                      : 'bg-white text-[#2C3E50] border-[#FAD7A0] hover:bg-[#FFF8F0]'
                  }`}
                >
                  <span className="text-[9px] uppercase font-bold opacity-80">{sc.category}</span>
                  <span className="text-xs font-bold mt-1 leading-snug">{sc.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Complaint Composition Area */}
        <div className="p-5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-4">
          <div className="space-y-1 border-b border-[#FAD7A0] pb-3">
            <span className="text-[10px] font-bold uppercase text-[#D35400]">{activeScenario.category}</span>
            <h3 className="text-sm font-extrabold text-[#2C3E50]">{activeScenario.title}</h3>
            <p className="text-xs text-[#5D6D7E]">{activeScenario.context}</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#FAD7A0] space-y-3 font-mono text-xs">
            <div>
              <span className="text-gray-400 font-sans block text-[10px] font-bold">To: {activeScenario.recipient}</span>
            </div>
            <div>
              <span className="text-gray-400 font-sans block text-[10px] font-bold">Subject:</span>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full font-bold text-[#2C3E50] border-b border-gray-200 pb-1 focus:outline-none focus:border-[#D35400]"
              />
            </div>
            <div>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={8}
                className="w-full text-xs text-[#2C3E50] focus:outline-none leading-relaxed resize-y"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={evaluateComplaint}
            className="px-6 py-2.5 bg-[#D35400] hover:bg-[#B04300] text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-xs"
          >
            <Sparkles className="w-4 h-4" /> Evaluate Complaint Professionalism
          </button>
        </div>

        {/* Evaluation Output */}
        {evaluation && (
          <div className="p-5 bg-white border-2 border-[#FAD7A0] rounded-2xl space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h4 className="text-sm font-bold text-[#2C3E50] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Complaint Email Evaluation
              </h4>
              <span className="text-base font-black text-[#D35400] bg-[#FFF8F0] px-3 py-1 rounded-xl border border-[#FAD7A0]">
                {evaluation.overall} / 10 Marks
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-[10px] text-gray-500 font-bold block uppercase">Professional Tone</span>
                <span className="text-base font-bold text-[#2C3E50]">{evaluation.tone} / 10</span>
              </div>
              <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-[10px] text-gray-500 font-bold block uppercase">Courtesy</span>
                <span className="text-base font-bold text-[#2C3E50]">{evaluation.courtesy} / 10</span>
              </div>
              <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-[10px] text-gray-500 font-bold block uppercase">Problem Description</span>
                <span className="text-base font-bold text-[#2C3E50]">{evaluation.problemDesc} / 10</span>
              </div>
              <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-[10px] text-gray-500 font-bold block uppercase">Requested Resolution</span>
                <span className="text-base font-bold text-[#2C3E50]">{evaluation.resolution} / 10</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#D35400] uppercase">Feedback & Guidance:</span>
              <ul className="space-y-1 text-xs text-[#5D6D7E]">
                {evaluation.feedback.map((f, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E67E22]" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-[#FAD7A0]">
          <span className="text-xs text-[#5D6D7E]">
            Practice formal request emails next in Section 6.
          </span>

          <button
            type="button"
            onClick={onCompleteActivity}
            className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#B04300] transition flex items-center gap-2"
          >
            Continue to Request Email Practice <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
