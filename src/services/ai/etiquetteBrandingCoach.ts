import { getAICoachStatus } from './index';

export interface PersonaEvaluationResult {
  score: number; // 0 to 10
  performanceLevel: string; // 'Outstanding' | 'Excellent' | 'Very Good' | 'Good' | 'Satisfactory' | 'Needs Improvement' | 'Requires Additional Practice'
  dimensions: {
    communicationStyle: number;
    digitalPresence: number;
    profileCompleteness: number;
    grammarAndTone: number;
    personalBranding: number;
    careerReadiness: number;
  };
  strengths: string[];
  areasForImprovement: string[];
  improvedBrandingStatement: string;
  linkedInRecommendations: string[];
  executiveFeedback: string;
}

export interface BrandingInput {
  branch: string;
  specialization: string;
  coreStrengths: string[];
  careerValues: string[];
  targetRole: string;
  keyProjects: string;
}

export class EtiquetteBrandingCoach {
  static generateBrandingStatements(input: BrandingInput) {
    const branch = input.branch || 'B.Tech Engineering';
    const spec = input.specialization || 'Software & IoT';
    const strengths = input.coreStrengths.length > 0 ? input.coreStrengths.join(', ') : 'Analytical Problem Solving, Technical Communication';
    const values = input.careerValues.length > 0 ? input.careerValues.join(', ') : 'Innovation, Integrity, Continuous Learning';
    const role = input.targetRole || 'Engineering Specialist';

    return {
      executive: `Passionate ${branch} undergraduate at SRIT specializing in ${spec}. Driven by ${values}, with core expertise in ${strengths}. Committed to delivering impactful engineering solutions as a future ${role}.`,
      innovative: `Future-focused ${branch} Innovator @ SRIT | Leveraging ${strengths} to engineer high-efficiency ${spec} systems. Passionate about ${role} opportunities guided by ${values}.`,
      research: `${branch} Student & Tech Enthusiast @ SRIT | Dedicated to advancing ${spec} through ${strengths}. Driven by a vision of ${values} to excel as a ${role}.`
    };
  }

  static generateLinkedInSuggestions(section: 'headline' | 'about' | 'skills' | 'projects', input: BrandingInput) {
    const branch = input.branch || 'Computer Science & Engineering';
    const role = input.targetRole || 'Software Development Engineer';

    switch (section) {
      case 'headline':
        return [
          `${branch} Student @ SRIT | ${input.specialization || 'Full-Stack Development & AI'} | Aspiring ${role}`,
          `B.Tech ${branch} Candidate | Specialized in ${input.keyProjects || 'Cloud Systems & Data Engineering'} | SRIT '27`,
          `Engineering Innovator @ SRIT | ${input.coreStrengths[0] || 'Problem Solver'} | Building Next-Gen ${role} Solutions`
        ];
      case 'about':
        return [
          `I am a driven ${branch} student at Srinivasa Ramanujan Institute of Technology (SRIT) with a strong foundation in modern engineering methodologies and technical communication. My technical journey is anchored in ${input.specialization || 'software development and system architecture'}.\n\nThroughout my academic coursework and hands-on laboratory projects, I have developed a reputation for ${input.coreStrengths.join(', ') || 'analytical problem solving, rigorous testing, and clear team communication'}. Guided by values of ${input.careerValues.join(' and ') || 'integrity and innovation'}, I am actively seeking internship and project opportunities in ${role}.\n\nLet's connect to discuss technology, engineering innovation, and collaborative B.Tech initiatives!`,
          `Driven by curiosity and engineering rigor, I am currently pursuing B.Tech in ${branch} at SRIT. My focus centers on solving real-world challenges through ${input.keyProjects || 'intelligent technology systems'}.\n\nKey Strengths: ${input.coreStrengths.join(' • ') || 'Agile Mindset • Technical Writing • Cross-functional Leadership'}.\nGoal: To contribute as a high-impact ${role} in progressive engineering organizations.`
        ];
      case 'skills':
        return [
          'Technical Communication & IEEE Documentation',
          'Workplace Etiquette & Professional Netiquette',
          'Cross-Functional Team Collaboration',
          'Project Presentation & Elevator Pitching',
          'Digital Persona & Brand Management',
          'Agile Methodologies & Problem Solving'
        ];
      case 'projects':
        return [
          {
            title: `SRIT R26 Capstone Project - ${input.keyProjects || 'IoT & AI System'}`,
            description: `Engineered a comprehensive ${input.keyProjects || 'AI-powered monitoring application'} applying IEEE documentation standards, precise technical report structures, and executive summary formulas.`
          }
        ];
      default:
        return [];
    }
  }

  static evaluateDigitalPersona(data: {
    linkedInHeadline: string;
    linkedInAbout: string;
    brandingStatement: string;
    elevatorPitch: string;
    workplaceScenarioScore: number; // 0 to 10
    netiquetteScore: number; // 0 to 10
  }): PersonaEvaluationResult {
    const headlineLen = data.linkedInHeadline?.length || 0;
    const aboutLen = data.linkedInAbout?.length || 0;
    const brandingLen = data.brandingStatement?.length || 0;
    const pitchLen = data.elevatorPitch?.length || 0;

    // Dimension scoring (out of 10)
    const communicationStyle = Math.min(10, Math.max(6, Math.round((brandingLen > 30 ? 3 : 1) + (pitchLen > 40 ? 3 : 1) + (data.workplaceScenarioScore * 0.4))));
    const digitalPresence = Math.min(10, Math.max(5, Math.round((headlineLen > 25 ? 4 : 2) + (data.netiquetteScore * 0.6))));
    const profileCompleteness = Math.min(10, Math.max(4, Math.round((headlineLen > 20 ? 3 : 1) + (aboutLen > 80 ? 4 : 2) + (brandingLen > 20 ? 3 : 1))));
    const grammarAndTone = Math.min(10, Math.max(7, Math.round(7.5 + (aboutLen > 100 ? 1.5 : 0.5) + (data.netiquetteScore * 0.1))));
    const personalBranding = Math.min(10, Math.max(5, Math.round((brandingLen > 30 ? 5 : 2) + (pitchLen > 30 ? 4 : 2))));
    const careerReadiness = Math.min(10, Math.round((communicationStyle + digitalPresence + profileCompleteness + personalBranding) / 4));

    const totalScore = Math.min(10, parseFloat(((communicationStyle + digitalPresence + profileCompleteness + grammarAndTone + personalBranding + careerReadiness) / 6).toFixed(1)));

    let performanceLevel = 'Good';
    if (totalScore >= 9.5) performanceLevel = 'Outstanding';
    else if (totalScore >= 9.0) performanceLevel = 'Excellent';
    else if (totalScore >= 8.0) performanceLevel = 'Very Good';
    else if (totalScore >= 7.0) performanceLevel = 'Good';
    else if (totalScore >= 6.0) performanceLevel = 'Satisfactory';
    else if (totalScore >= 5.0) performanceLevel = 'Needs Improvement';
    else performanceLevel = 'Requires Additional Practice';

    const strengths: string[] = [];
    const areasForImprovement: string[] = [];

    if (headlineLen > 25) strengths.push('Headline clearly indicates engineering discipline and target role.');
    else areasForImprovement.push('Expand LinkedIn headline to include target technical domains alongside SRIT affiliation.');

    if (aboutLen > 80) strengths.push('LinkedIn About section demonstrates professional tone and structured paragraphs.');
    else areasForImprovement.push('Elaborate on LinkedIn About summary to detail core technical competencies and project outcomes.');

    if (brandingLen > 25) strengths.push('Personal branding statement effectively encapsulates core strengths and career values.');
    else areasForImprovement.push('Refine personal branding statement into a crisp, 2-sentence executive value proposition.');

    if (pitchLen > 30) strengths.push('Elevator pitch covers background, current focus, and future value proposition clearly.');
    else areasForImprovement.push('Practice delivering a 30-60 second elevator pitch covering your SRIT B.Tech trajectory and career vision.');

    if (strengths.length === 0) {
      strengths.push('Demonstrates initial understanding of professional digital presence guidelines.');
    }

    const improvedBrandingStatement = data.brandingStatement.trim().length > 15
      ? `${data.brandingStatement.trim()} Driven by engineering excellence at SRIT, committed to deploying high-impact technological solutions.`
      : 'B.Tech Engineering Innovator @ SRIT | Leveraging analytical problem-solving and software expertise to build scalable, high-integrity solutions.';

    return {
      score: totalScore,
      performanceLevel,
      dimensions: {
        communicationStyle,
        digitalPresence,
        profileCompleteness,
        grammarAndTone,
        personalBranding,
        careerReadiness
      },
      strengths,
      areasForImprovement,
      improvedBrandingStatement,
      linkedInRecommendations: [
        'Add a high-resolution, professional photo with neutral background and formal corporate dress code.',
        'Customize your LinkedIn public URL (e.g., linkedin.com/in/first-last-srit).',
        'Request 2-3 endorsements or recommendations from SRIT faculty leads or project mentors.',
        'Attach capstone project reports and presentation slides to your Featured section.',
        'List relevant R26 Communicative English & B.Tech course certifications.'
      ],
      executiveFeedback: `Your digital persona demonstrates a ${performanceLevel.toLowerCase()} level of professional alignment. Strengthening your LinkedIn headline and practicing your 45-second elevator pitch will elevate your visibility to recruiters.`
    };
  }

  static rewriteNetiquetteMessage(informalMessage: string): { professionalVersion: string; keyImprovements: string[] } {
    const lower = informalMessage.toLowerCase();
    let professionalVersion = '';
    const keyImprovements: string[] = [];

    if (lower.includes('hey') || lower.includes('bro') || lower.includes('u ') || lower.includes('gimme')) {
      professionalVersion = 'Dear Sir/Madam,\n\nI hope this message finds you well. I am writing to respectfully request the laboratory schedule and project documentation for Module 12. Kindly let me know a suitable time when I may review these materials.\n\nThank you for your guidance and time.\n\nSincerely,\nB.Tech Student, SRIT';
      keyImprovements.push('Replaced informal greeting ("Hey/Bro") with formal salutation ("Dear Sir/Madam").');
      keyImprovements.push('Substituted text slang ("u", "gimme") with professional phrasing ("request", "kindly let me know").');
      keyImprovements.push('Added a professional closing and sign-off.');
    } else if (lower.includes('late') || lower.includes('sorry') || lower.includes('missed')) {
      professionalVersion = 'Dear Professor,\n\nPlease accept my sincere apologies for my late arrival to today\'s virtual laboratory session due to an unexpected technical connectivity issue. I have reviewed the recorded lecture notes and completed the required Netiquette reflection entries.\n\nThank you for your understanding.\n\nBest regards,\nB.Tech Student, SRIT';
      keyImprovements.push('Framed apology with professional accountability and proactive follow-up.');
      keyImprovements.push('Used polite, objective business language suitable for academic and corporate settings.');
    } else {
      professionalVersion = `Dear Team,\n\n${informalMessage.replace(/\bhey\b/gi, 'Hello').replace(/\bpls\b/gi, 'please').replace(/\bu\b/gi, 'you')}\n\nI look forward to your feedback and continued collaboration.\n\nBest regards,\nSRIT Engineering Team Lead`;
      keyImprovements.push('Enhanced sentence structure, punctuation, and formal tone.');
      keyImprovements.push('Maintained clear, respectful workplace communication standards.');
    }

    return { professionalVersion, keyImprovements };
  }
}
