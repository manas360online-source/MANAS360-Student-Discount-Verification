
import React, { useState } from 'react';
import { ShieldCheck, ChevronLeft, HeartPulse, Building2, UserCircle, QrCode, Sparkles, CheckCircle, LogIn } from 'lucide-react';
import { AppStep, VerificationResult, Entity, UserProfile } from './types';
import Scanner from './components/Scanner';
import ResultView from './components/ResultView';
import AdminDashboard from './components/AdminDashboard';
import EntityRegistration from './components/EntityRegistration';
import AuthFlow from './components/AuthFlow';
import { verifyEntityMember } from './services/mockApi';
import { analyzeIdImage } from './services/idAnalysis';
import { MOCK_ENTITIES, MOCK_ANALYTICS } from './constants';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.WELCOME);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Verifying...");
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [currentEntity, setCurrentEntity] = useState<Entity | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  const handleStartMemberFlow = () => setStep(AppStep.SCANNING);
  const handleStartAdminFlow = () => setStep(AppStep.ADMIN_REGISTRATION);
  const handleStartAuthFlow = () => setStep(AppStep.AUTH_FLOW);

  const handleQRScan = async (data: string) => {
    setStep(AppStep.RESULT);
    setIsLoading(true);
    setLoadingText("Authenticating member...");
    try {
      const result = await verifyEntityMember(data);
      setVerificationResult(result);
    } catch (error) {
      setVerificationResult({ success: false, has_partnership: false, message: "Verification failed." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setStep(AppStep.RESULT);
    setIsLoading(true);
    setLoadingText("AI vision analyzing ID...");
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      try {
        const result = await analyzeIdImage(base64);
        setVerificationResult(result);
      } catch (error) {
        setVerificationResult({ success: false, has_partnership: false, message: "AI Error." });
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAdminComplete = (entity: any) => {
    setCurrentEntity(MOCK_ENTITIES[0]);
    setStep(AppStep.ADMIN_DASHBOARD);
  };

  const handleAuthComplete = (user: UserProfile) => {
    setCurrentUser(user);
    setStep(AppStep.CONFIRMED);
  };

  const handleReset = () => {
    setStep(AppStep.WELCOME);
    setVerificationResult(null);
    setCurrentEntity(null);
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center selection:bg-blue-100 overflow-x-hidden pb-20" style={{ backgroundColor: '#F0F7FF' }}>
      <nav className="w-full max-w-7xl px-8 py-10 flex justify-between items-center z-10">
        <div className="flex items-center gap-3 text-slate-900 cursor-pointer group" onClick={handleReset}>
          <div className="bg-[#0066FF] p-3 rounded-2xl text-white shadow-xl shadow-blue-600/30 group-hover:scale-105 transition-transform duration-300">
            <HeartPulse size={28} strokeWidth={2.5} />
          </div>
          <span className="text-3xl font-black tracking-tighter">MANAS360</span>
        </div>
        
        {step !== AppStep.WELCOME && (
          <button 
            onClick={handleReset}
            className="px-6 py-3 glass rounded-full text-slate-500 hover:text-[#0066FF] hover:border-[#0066FF]/20 transition-all flex items-center gap-2 font-bold text-xs uppercase tracking-widest shadow-sm"
          >
            <ChevronLeft size={16} />
            Back to Home
          </button>
        )}
      </nav>

      <main className={`flex-1 w-full flex flex-col items-center justify-center ${step === AppStep.ADMIN_DASHBOARD ? 'max-w-7xl' : 'max-w-6xl'} px-8`}>
        
        {step === AppStep.WELCOME && (
          <div className="w-full grid grid-cols-1 lg:grid-cols-5 gap-16 py-12 animate-in fade-in zoom-in-95 duration-1000">
            <div className="lg:col-span-3 space-y-10 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-black uppercase tracking-widest self-start">
                <Sparkles size={14} />
                Unified Entity Partnership
              </div>
              <div className="space-y-4">
                <h1 className="text-6xl xl:text-7xl font-black text-slate-900 tracking-tight leading-[1.05]">
                  Mental Wellness for <br/><span className="text-[#0066FF]">Every Community.</span>
                </h1>
                <p className="text-slate-500 text-xl font-medium leading-relaxed max-w-xl">
                  Unified clinical infrastructure for schools, corporates, and government departments.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
                 {[
                   "Global Partnership Network",
                   "AI-Powered Verification",
                   "OTP-Based Activation",
                   "Clinical SOS Protocols"
                 ].map(text => (
                   <div key={text} className="flex items-center gap-3 text-base font-bold text-slate-700">
                      <div className="w-6 h-6 rounded-full bg-[#0066FF] text-white flex items-center justify-center flex-shrink-0">
                        <CheckCircle size={14} strokeWidth={3} />
                      </div>
                      {text}
                   </div>
                 ))}
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4 flex flex-col justify-center">
              <button 
                onClick={handleStartMemberFlow}
                className="w-full group p-8 bg-white border border-slate-100 rounded-[40px] text-left hover:border-[#0066FF] hover:shadow-xl transition-all duration-500 shadow-lg shadow-blue-200/20"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-[20px] bg-blue-50 flex items-center justify-center text-[#0066FF]">
                    <QrCode size={30} />
                  </div>
                  <div className="px-3 py-1 bg-blue-100 text-[#0066FF] text-[10px] font-bold rounded-full uppercase tracking-widest">New Member</div>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Claim Your Benefit</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">Scan your ID to apply subsidized pricing instantly.</p>
              </button>

              <button 
                onClick={handleStartAuthFlow}
                className="w-full group p-8 bg-white border border-slate-100 rounded-[40px] text-left hover:border-[#0066FF] hover:shadow-xl transition-all duration-500 shadow-lg shadow-blue-200/20"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-[20px] bg-blue-50 flex items-center justify-center text-[#0066FF]">
                    <LogIn size={30} />
                  </div>
                  <div className="px-3 py-1 bg-blue-100 text-[#0066FF] text-[10px] font-bold rounded-full uppercase tracking-widest">Sign In</div>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Member Portal</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">Activate your account via OTP or login with ID.</p>
              </button>

              <button 
                onClick={handleStartAdminFlow}
                className="w-full group p-8 bg-slate-900 border border-slate-800 rounded-[40px] text-left hover:bg-slate-950 transition-all duration-500 shadow-lg shadow-slate-900/20"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-[20px] bg-white/10 flex items-center justify-center text-white">
                    <Building2 size={30} />
                  </div>
                  <div className="px-3 py-1 bg-white/10 text-white text-[10px] font-bold rounded-full uppercase tracking-widest">Admin</div>
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Setup Partnership</h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">Manage institutional contracts and data.</p>
              </button>
            </div>
          </div>
        )}

        {step === AppStep.AUTH_FLOW && (
          <AuthFlow onComplete={handleAuthComplete} />
        )}

        {step === AppStep.ADMIN_REGISTRATION && (
          <EntityRegistration onComplete={handleAdminComplete} />
        )}

        {step === AppStep.ADMIN_DASHBOARD && currentEntity && (
          <AdminDashboard entity={currentEntity} data={MOCK_ANALYTICS[currentEntity.id]} />
        )}

        {step === AppStep.SCANNING && (
          <Scanner onScan={handleQRScan} onUpload={handleFileUpload} onClose={handleReset} />
        )}

        {step === AppStep.RESULT && isLoading && (
          <div className="text-center space-y-8 animate-in fade-in duration-500">
            <div className="relative inline-block">
              <div className="w-28 h-28 rounded-[40px] border-[6px] border-blue-100 border-t-[#0066FF] animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="text-[#0066FF] animate-pulse" size={32} />
              </div>
            </div>
            <h2 className="text-3xl font-black text-slate-900">{loadingText}</h2>
          </div>
        )}

        {step === AppStep.RESULT && !isLoading && verificationResult && (
          <ResultView 
            result={verificationResult} 
            onContinue={() => setStep(AppStep.CONFIRMED)}
            onRetry={handleReset}
          />
        )}

        {step === AppStep.CONFIRMED && (
          <div className="text-center glass p-20 rounded-[64px] shadow-2xl space-y-10 max-w-xl animate-in zoom-in-95 duration-700">
             <div className="w-24 h-24 bg-[#0066FF] rounded-[32px] mx-auto flex items-center justify-center text-white shadow-2xl shadow-blue-500/40">
                <CheckCircle size={56} strokeWidth={2.5} />
             </div>
             <div className="space-y-4">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Welcome, {currentUser?.first_name || 'Member'}</h2>
                <p className="text-slate-500 text-lg font-medium max-w-sm mx-auto">Your institutional mental health program is active and ready for you.</p>
             </div>
             <button onClick={handleReset} className="w-full max-w-xs py-5 bg-[#0066FF] text-white text-lg font-bold rounded-full hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30">
                Go to Therapy Hub
             </button>
          </div>
        )}

      </main>
    </div>
  );
};

const ArrowRight = ({ className, size }: { className?: string; size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
);

export default App;