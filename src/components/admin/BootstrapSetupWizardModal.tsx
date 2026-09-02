import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Building2,
  User,
  Mail,
  Phone,
  Lock,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  School,
  Globe,
  MapPin,
  Clock,
  Calendar,
  Sliders,
  Settings,
  Cpu,
  Database,
  Bell,
  Check,
  Layers,
  FileCheck2,
  Image as ImageIcon,
  BadgeCheck,
  HelpCircle
} from 'lucide-react';
import {
  PlatformInitializationService,
  InstitutionConfig,
  BootstrapAdminData,
  SystemConfig
} from '../../services/PlatformInitializationService';
import { AuthService } from '../../services/AuthService';

interface BootstrapSetupWizardModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const BootstrapSetupWizardModal: React.FC<BootstrapSetupWizardModalProps> = ({
  isOpen,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Institution Configuration
  const [institution, setInstitution] = useState<InstitutionConfig>({
    institutionName: 'Srinivasa Ramanujan Institute of Technology',
    institutionShortName: 'SRIT',
    logoUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=200&h=200&fit=crop',
    academicYear: '2026-2027',
    timeZone: 'Asia/Kolkata (IST - UTC+05:30)',
    country: 'India',
    state: 'Andhra Pradesh',
    city: 'Ananthapuramu'
  });

  // Step 2: Bootstrap Administrator
  const [bootstrapAdmin, setBootstrapAdmin] = useState<BootstrapAdminData & { password: string; confirmPassword: string }>({
    fullName: '',
    email: '',
    mobile: '',
    employeeId: 'EMP-SRIT-ADMIN01',
    password: '',
    confirmPassword: ''
  });

  // Step 3: System Configuration
  const [system, setSystem] = useState<SystemConfig>({
    theme: 'SRIT Saffron & Slate Theme',
    language: 'English (India)',
    sessionTimeoutMinutes: 60,
    aiProvider: 'Google Gemini 2.5 / 3.0 Engine',
    academicCalendar: 'CBCS R26 Semester Framework',
    emailNotificationsEnabled: true,
    storageBackend: 'IndexedDB + LocalStorage Sync'
  });

  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      try {
        const existingConfig = PlatformInitializationService.getPlatformConfig();
        if (existingConfig) {
          if (existingConfig.institution) {
            setInstitution(prev => ({ ...prev, ...existingConfig.institution }));
          }
          if (existingConfig.bootstrapAdmin && existingConfig.bootstrapAdmin.fullName) {
            setBootstrapAdmin(prev => ({
              ...prev,
              fullName: existingConfig.bootstrapAdmin.fullName || '',
              email: existingConfig.bootstrapAdmin.email || '',
              mobile: existingConfig.bootstrapAdmin.mobile || '',
              employeeId: existingConfig.bootstrapAdmin.employeeId || 'EMP-SRIT-ADMIN01'
            }));
          }
          if (existingConfig.system) {
            setSystem(prev => ({ ...prev, ...existingConfig.system }));
          }
        }
      } catch {
        // ignore load errors
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Validation functions per step
  const validateStep1 = (): boolean => {
    if (!institution.institutionName.trim()) {
      setErrorMsg('Please enter the Institution Name.');
      return false;
    }
    if (!institution.institutionShortName.trim()) {
      setErrorMsg('Please enter the Institution Short Name (e.g. SRIT).');
      return false;
    }
    if (!institution.city.trim() || !institution.state.trim() || !institution.country.trim()) {
      setErrorMsg('Please complete location details (City, State, and Country).');
      return false;
    }
    return true;
  };

  const validateStep2 = (): boolean => {
    if (!bootstrapAdmin.fullName.trim()) {
      setErrorMsg('Please enter the Administrator Full Name.');
      return false;
    }
    if (!bootstrapAdmin.email.trim() || !bootstrapAdmin.email.includes('@')) {
      setErrorMsg('Please enter a valid Official Email Address.');
      return false;
    }
    if (!bootstrapAdmin.mobile.trim() || bootstrapAdmin.mobile.length < 10) {
      setErrorMsg('Please enter a valid 10-digit Mobile Number.');
      return false;
    }
    if (!bootstrapAdmin.password || bootstrapAdmin.password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return false;
    }
    if (bootstrapAdmin.password !== bootstrapAdmin.confirmPassword) {
      setErrorMsg('Password and Confirm Password do not match.');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setErrorMsg('');
    if (currentStep === 1) {
      if (!validateStep1()) return;
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!validateStep2()) return;
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    }
  };

  const handlePrev = () => {
    setErrorMsg('');
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleFinalInitialize = async () => {
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      // Complete platform initialization
      const config = await PlatformInitializationService.completePlatformInitialization(
        institution,
        {
          fullName: bootstrapAdmin.fullName,
          email: bootstrapAdmin.email,
          mobile: bootstrapAdmin.mobile,
          employeeId: bootstrapAdmin.employeeId
        },
        system,
        bootstrapAdmin.password
      );

      // Save Session for immediate command center access
      AuthService.saveSession({
        id: 'BOOTSTRAP_ADMIN',
        email: bootstrapAdmin.email.trim().toLowerCase(),
        name: bootstrapAdmin.fullName.trim(),
        role: 'ADMINISTRATOR',
        username: 'BOOTSTRAP_ADMIN',
        department: 'System Governance & Academic Administration',
        mobile: bootstrapAdmin.mobile,
        employeeId: bootstrapAdmin.employeeId
      });

      setIsSuccess(true);

      setTimeout(() => {
        onComplete();
      }, 1800);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Failed to initialize platform. Please check parameters and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F2C38]/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-3xl bg-white rounded-3xl border-2 border-[#FAD7A0] shadow-2xl overflow-hidden my-8"
      >
        {/* BRAND HEADER */}
        <div className="p-6 bg-gradient-to-r from-[#2C3E50] via-[#34495E] to-[#1F2C38] text-white border-b border-[#FAD7A0]/30 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#D35400] text-white rounded-2xl shadow-md border border-[#FAD7A0]/40 shrink-0">
                <ShieldCheck className="w-8 h-8 text-[#FAD7A0]" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#FFF8F0]/20 text-[#FAD7A0] rounded-full text-[10px] font-black uppercase tracking-wider mb-1">
                  <Sparkles className="w-3 h-3 text-[#FAD7A0]" />
                  <span>Platform Initialization Engine (PIE)</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#FAD7A0] font-serif tracking-tight">
                  Initial Platform Setup Wizard
                </h2>
                <p className="text-xs text-gray-200">
                  Configure SAILL Language Laboratory for First-Time Enterprise Deployment
                </p>
              </div>
            </div>

            <div className="bg-[#1F2C38]/80 px-3 py-1.5 rounded-xl border border-[#FAD7A0]/30 text-right shrink-0">
              <span className="text-[10px] text-gray-300 uppercase font-bold block">Current Status</span>
              <span className="text-xs font-black text-[#FAD7A0] font-mono">STEP {currentStep} OF 4</span>
            </div>
          </div>
        </div>

        {/* STEP PROGRESS INDICATOR */}
        <div className="bg-[#FFF8F0] px-6 py-4 border-b border-[#FAD7A0]/60">
          <div className="grid grid-cols-4 gap-2">
            {[
              { num: 1, label: 'Institution', icon: School },
              { num: 2, label: 'Administrator', icon: User },
              { num: 3, label: 'System Config', icon: Sliders },
              { num: 4, label: 'Confirmation', icon: FileCheck2 }
            ].map((step) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.num;
              const isDone = currentStep > step.num;

              return (
                <div
                  key={step.num}
                  className={`flex items-center gap-2 p-2 rounded-xl transition ${
                    isActive
                      ? 'bg-[#2C3E50] text-[#FAD7A0] shadow-md font-bold'
                      : isDone
                      ? 'bg-emerald-100 text-emerald-800 font-bold'
                      : 'bg-white/80 text-gray-400 border border-gray-200 font-medium'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                      isActive
                        ? 'bg-[#D35400] text-white'
                        : isDone
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {isDone ? <Check className="w-3.5 h-3.5" /> : step.num}
                  </div>
                  <div className="hidden sm:block text-left truncate">
                    <p className="text-[11px] leading-none uppercase tracking-wider">{step.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* PROGRESS BAR */}
          <div className="w-full bg-gray-200 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#D35400] to-[#E67E22] h-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* WIZARD FORM CONTENT */}
        <div className="p-6 sm:p-8 space-y-6">
          {errorMsg && (
            <div className="p-3.5 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isSuccess ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-black text-[#2C3E50] font-serif">
                Platform Successfully Initialized!
              </h3>
              <p className="text-sm text-[#5D6D7E] max-w-lg mx-auto">
                SAILL has been successfully configured. The Bootstrap Administrator profile is ready. The Initial Setup Wizard is now permanently locked.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] rounded-xl text-xs font-bold">
                <Sparkles className="w-4 h-4" />
                <span>Redirecting to Administrator Command Center...</span>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1: INSTITUTION CONFIGURATION */}
              {currentStep === 1 && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                    <School className="w-5 h-5 text-[#D35400]" />
                    <h3 className="text-base font-black text-[#2C3E50] font-serif">
                      Step 1: Institution Details & Location Configuration
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Institution Name */}
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="block text-xs font-bold text-[#2C3E50] uppercase tracking-wider">
                        Institution Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={institution.institutionName}
                          onChange={(e) => setInstitution({ ...institution, institutionName: e.target.value })}
                          placeholder="e.g. Srinivasa Ramanujan Institute of Technology"
                          className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#2C3E50] font-medium focus:ring-2 focus:ring-[#D35400] outline-none"
                          required
                        />
                      </div>
                    </div>

                    {/* Short Name */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[#2C3E50] uppercase tracking-wider">
                        Institution Abbreviation / Short Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={institution.institutionShortName}
                        onChange={(e) => setInstitution({ ...institution, institutionShortName: e.target.value })}
                        placeholder="e.g. SRIT"
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#2C3E50] font-medium focus:ring-2 focus:ring-[#D35400] outline-none"
                        required
                      />
                    </div>

                    {/* Academic Year */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[#2C3E50] uppercase tracking-wider">
                        Academic Year
                      </label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={institution.academicYear}
                          onChange={(e) => setInstitution({ ...institution, academicYear: e.target.value })}
                          placeholder="2026-2027"
                          className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#2C3E50] font-medium outline-none"
                        />
                      </div>
                    </div>

                    {/* City */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[#2C3E50] uppercase tracking-wider">
                        City <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={institution.city}
                          onChange={(e) => setInstitution({ ...institution, city: e.target.value })}
                          placeholder="Ananthapuramu"
                          className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#2C3E50] font-medium outline-none"
                          required
                        />
                      </div>
                    </div>

                    {/* State */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[#2C3E50] uppercase tracking-wider">
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={institution.state}
                        onChange={(e) => setInstitution({ ...institution, state: e.target.value })}
                        placeholder="Andhra Pradesh"
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#2C3E50] font-medium outline-none"
                        required
                      />
                    </div>

                    {/* Country */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[#2C3E50] uppercase tracking-wider">
                        Country
                      </label>
                      <div className="relative">
                        <Globe className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={institution.country}
                          onChange={(e) => setInstitution({ ...institution, country: e.target.value })}
                          placeholder="India"
                          className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#2C3E50] font-medium outline-none"
                        />
                      </div>
                    </div>

                    {/* Time Zone */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[#2C3E50] uppercase tracking-wider">
                        Time Zone
                      </label>
                      <div className="relative">
                        <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={institution.timeZone}
                          onChange={(e) => setInstitution({ ...institution, timeZone: e.target.value })}
                          placeholder="Asia/Kolkata (IST)"
                          className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#2C3E50] font-medium outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: BOOTSTRAP ADMINISTRATOR */}
              {currentStep === 2 && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                    <User className="w-5 h-5 text-[#D35400]" />
                    <h3 className="text-base font-black text-[#2C3E50] font-serif">
                      Step 2: Root Bootstrap Administrator Account Creation
                    </h3>
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4 shrink-0 text-[#D35400]" />
                    <span>
                      Assigns role <strong>BOOTSTRAP_ADMIN</strong> with unrestricted system-wide administrative permissions.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[#2C3E50] uppercase tracking-wider">
                        Administrator Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={bootstrapAdmin.fullName}
                          onChange={(e) => setBootstrapAdmin({ ...bootstrapAdmin, fullName: e.target.value })}
                          placeholder="e.g. Dr. A. Srinivasulu"
                          className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#2C3E50] font-medium focus:ring-2 focus:ring-[#D35400] outline-none"
                          required
                        />
                      </div>
                    </div>

                    {/* Official Email */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[#2C3E50] uppercase tracking-wider">
                        Official Institutional Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        <input
                          type="email"
                          value={bootstrapAdmin.email}
                          onChange={(e) => setBootstrapAdmin({ ...bootstrapAdmin, email: e.target.value })}
                          placeholder="admin@srit.ac.in"
                          className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#2C3E50] font-medium focus:ring-2 focus:ring-[#D35400] outline-none"
                          required
                        />
                      </div>
                    </div>

                    {/* Mobile Number */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[#2C3E50] uppercase tracking-wider">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        <input
                          type="tel"
                          value={bootstrapAdmin.mobile}
                          onChange={(e) => setBootstrapAdmin({ ...bootstrapAdmin, mobile: e.target.value })}
                          placeholder="e.g. 9848012345"
                          className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#2C3E50] font-medium focus:ring-2 focus:ring-[#D35400] outline-none"
                          required
                        />
                      </div>
                    </div>

                    {/* Employee ID */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[#2C3E50] uppercase tracking-wider">
                        Employee / Faculty ID (Optional)
                      </label>
                      <input
                        type="text"
                        value={bootstrapAdmin.employeeId}
                        onChange={(e) => setBootstrapAdmin({ ...bootstrapAdmin, employeeId: e.target.value })}
                        placeholder="EMP-SRIT-ADMIN01"
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#2C3E50] font-medium outline-none"
                      />
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[#2C3E50] uppercase tracking-wider">
                        Create Secure Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        <input
                          type="password"
                          value={bootstrapAdmin.password}
                          onChange={(e) => setBootstrapAdmin({ ...bootstrapAdmin, password: e.target.value })}
                          placeholder="Min. 8 characters"
                          className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#2C3E50] font-medium focus:ring-2 focus:ring-[#D35400] outline-none"
                          required
                        />
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[#2C3E50] uppercase tracking-wider">
                        Confirm Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        <input
                          type="password"
                          value={bootstrapAdmin.confirmPassword}
                          onChange={(e) => setBootstrapAdmin({ ...bootstrapAdmin, confirmPassword: e.target.value })}
                          placeholder="Re-enter password"
                          className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#2C3E50] font-medium focus:ring-2 focus:ring-[#D35400] outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: SYSTEM CONFIGURATION */}
              {currentStep === 3 && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                    <Sliders className="w-5 h-5 text-[#D35400]" />
                    <h3 className="text-base font-black text-[#2C3E50] font-serif">
                      Step 3: Platform System Defaults & Runtime Configuration
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {/* Theme */}
                    <div className="space-y-1.5">
                      <label className="block font-bold text-[#2C3E50] uppercase tracking-wider">
                        Institution Theme
                      </label>
                      <select
                        value={system.theme}
                        onChange={(e) => setSystem({ ...system, theme: e.target.value })}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none"
                      >
                        <option value="SRIT Saffron & Slate Theme">SRIT Warm Saffron & Deep Slate (Default)</option>
                        <option value="Classic Navy Institutional">Classic Navy Institutional</option>
                      </select>
                    </div>

                    {/* AI Provider */}
                    <div className="space-y-1.5">
                      <label className="block font-bold text-[#2C3E50] uppercase tracking-wider">
                        AI Provider Engine
                      </label>
                      <div className="relative">
                        <Cpu className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={system.aiProvider}
                          onChange={(e) => setSystem({ ...system, aiProvider: e.target.value })}
                          className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none"
                        />
                      </div>
                    </div>

                    {/* Session Timeout */}
                    <div className="space-y-1.5">
                      <label className="block font-bold text-[#2C3E50] uppercase tracking-wider">
                        Session Timeout (Minutes)
                      </label>
                      <select
                        value={system.sessionTimeoutMinutes}
                        onChange={(e) => setSystem({ ...system, sessionTimeoutMinutes: Number(e.target.value) })}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none"
                      >
                        <option value={30}>30 Minutes</option>
                        <option value={60}>60 Minutes (Standard)</option>
                        <option value={120}>120 Minutes</option>
                      </select>
                    </div>

                    {/* Academic Calendar */}
                    <div className="space-y-1.5">
                      <label className="block font-bold text-[#2C3E50] uppercase tracking-wider">
                        Academic Calendar Framework
                      </label>
                      <input
                        type="text"
                        value={system.academicCalendar}
                        onChange={(e) => setSystem({ ...system, academicCalendar: e.target.value })}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none"
                      />
                    </div>

                    {/* Storage Backend */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="block font-bold text-[#2C3E50] uppercase tracking-wider">
                        Local Storage Engine & Offline Synchronization
                      </label>
                      <div className="relative">
                        <Database className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={system.storageBackend}
                          onChange={(e) => setSystem({ ...system, storageBackend: e.target.value })}
                          className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: CONFIRMATION SUMMARY */}
              {currentStep === 4 && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                    <FileCheck2 className="w-5 h-5 text-[#D35400]" />
                    <h3 className="text-base font-black text-[#2C3E50] font-serif">
                      Step 4: Platform Initialization Confirmation & Launch
                    </h3>
                  </div>

                  <div className="p-4 bg-[#FFF8F0] rounded-2xl border border-[#FAD7A0] space-y-4 text-xs">
                    <h4 className="font-extrabold text-[#D35400] uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Configuration Review Summary
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-gray-200">
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Institution</p>
                        <p className="font-bold text-[#2C3E50] text-sm">{institution.institutionName}</p>
                        <p className="text-gray-600 font-medium">
                          {institution.institutionShortName} • {institution.city}, {institution.state}
                        </p>
                        <p className="text-gray-500 font-mono text-[10px] mt-1">AY: {institution.academicYear}</p>
                      </div>

                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Bootstrap Administrator</p>
                        <p className="font-bold text-[#2C3E50] text-sm">{bootstrapAdmin.fullName}</p>
                        <p className="text-gray-600 font-medium">{bootstrapAdmin.email}</p>
                        <p className="text-emerald-700 font-bold text-[10px] mt-1">Role: BOOTSTRAP_ADMIN</p>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-gray-200 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      <div>
                        <span className="text-gray-400 font-bold uppercase mr-1">AI Engine:</span>
                        <span className="font-bold text-[#2C3E50]">{system.aiProvider}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-bold uppercase mr-1">Session:</span>
                        <span className="font-bold text-[#2C3E50]">{system.sessionTimeoutMinutes} Mins</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-bold uppercase mr-1">Storage:</span>
                        <span className="font-bold text-[#2C3E50]">{system.storageBackend}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* NAVIGATION BUTTONS */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#2C3E50] text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                ) : (
                  <span className="text-[10px] text-gray-400 font-semibold">
                    * Step 1 of 4: Institution Setup
                  </span>
                )}

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2.5 bg-[#2C3E50] hover:bg-[#34495E] text-[#FAD7A0] text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinalInitialize}
                    disabled={isSubmitting}
                    className="px-7 py-3 bg-gradient-to-r from-[#D35400] to-[#E67E22] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isSubmitting ? 'Initializing Platform...' : 'Initialize Platform'}</span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
