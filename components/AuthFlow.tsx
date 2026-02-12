
import React, { useState, useEffect } from 'react';
import { UserCircle, Phone, Lock, ChevronRight, CheckCircle2, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import { checkAccountStatus, requestActivationOTP, verifyActivationOTP, loginUser } from '../services/mockApi';
import { UserProfile } from '../types';

interface AuthFlowProps {
  onComplete: (user: UserProfile) => void;
}

const AuthFlow: React.FC<AuthFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'id' | 'phone' | 'otp' | 'login'>('id');
  const [memberId, setMemberId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [expiryTimer, setExpiryTimer] = useState(300);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let interval: any;
    if (step === 'otp') {
      interval = setInterval(() => {
        setExpiryTimer(t => (t > 0 ? t - 1 : 0));
        setResendCooldown(c => (c > 0 ? c - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step]);

  const handleIdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await checkAccountStatus(memberId);
      if (res.exists) {
        setFirstName(res.first_name || '');
        if (res.requires_activation) {
          setStep('phone');
        } else {
          setStep('login');
        }
      } else {
        setError("Institutional ID not found. Contact your Admin to verify enrollment.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await requestActivationOTP(memberId, phoneNumber);
      if (res.success) {
        setStep('otp');
        setExpiryTimer(res.expires_in);
        setResendCooldown(30); // Rule: Resend after 30 seconds
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (expiryTimer === 0) {
      setError("OTP expired. Please request a new one.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await verifyActivationOTP(memberId, phoneNumber, otp);
      if (res.success && res.user) {
        onComplete(res.user);
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await loginUser(memberId, phoneNumber);
      if (res.success && res.user) {
        onComplete(res.user);
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-xl animate-in slide-in-from-bottom-8 duration-700 mx-auto">
      <div className="text-center space-y-4 mb-10">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">
          {step === 'id' && "Institutional Portal"}
          {step === 'phone' && "Account Activation"}
          {step === 'otp' && "Verify Mobile"}
          {step === 'login' && `Welcome Back, ${firstName}`}
        </h2>
        <p className="text-slate-500 text-lg font-medium">
          {step === 'id' && "Enter your Employee/Student ID (e.g. TC-2024-001)"}
          {step === 'phone' && `Hello ${firstName}! Let's link your mobile number.`}
          {step === 'otp' && "A 6-digit code was sent via SMS."}
          {step === 'login' && "Sign in with your 10-digit mobile number."}
        </p>
      </div>

      <div className="glass p-12 rounded-[64px] shadow-2xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
           <div className={`h-full bg-[#0066FF] transition-all duration-1000 ${step === 'id' ? 'w-1/4' : step === 'phone' ? 'w-1/2' : step === 'otp' ? 'w-3/4' : 'w-full'}`}></div>
        </div>

        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 text-sm font-bold animate-in fade-in zoom-in-95">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form className="space-y-6" onSubmit={
          step === 'id' ? handleIdSubmit : 
          step === 'phone' ? handlePhoneSubmit : 
          step === 'otp' ? handleOtpSubmit : 
          handleLoginSubmit
        }>
          {step === 'id' && (
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">Identification ID</label>
              <div className="relative">
                <UserCircle className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={24} />
                <input 
                  type="text" required value={memberId} onChange={e => setMemberId(e.target.value)}
                  placeholder="e.g. SCH2024-10A-001"
                  className="w-full pl-16 pr-6 py-5 bg-white border border-slate-100 rounded-[28px] focus:ring-4 focus:ring-blue-500/10 focus:border-[#0066FF] text-lg font-bold shadow-sm uppercase placeholder:normal-case"
                />
              </div>
            </div>
          )}

          {(step === 'phone' || step === 'login') && (
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">10-Digit Mobile Number</label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">+91</span>
                <input 
                  type="tel" required pattern="[6-9][0-9]{9}" maxLength={10} value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)}
                  placeholder="98765 43210"
                  className="w-full pl-20 pr-6 py-5 bg-white border border-slate-100 rounded-[28px] focus:ring-4 focus:ring-blue-500/10 focus:border-[#0066FF] text-lg font-bold shadow-sm"
                />
              </div>
            </div>
          )}

          {step === 'otp' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">6-Digit SMS Code</label>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={24} />
                  <input 
                    type="text" required maxLength={6} pattern="\d{6}" value={otp} onChange={e => setOtp(e.target.value)}
                    placeholder="••••••"
                    className="w-full pl-16 pr-6 py-5 bg-white border border-slate-100 rounded-[28px] focus:ring-4 focus:ring-blue-500/10 focus:border-[#0066FF] text-3xl font-black tracking-[0.5em] shadow-sm text-center"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center px-2">
                <p className={`text-xs font-bold ${expiryTimer < 60 ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}>
                   Expires in {formatTime(expiryTimer)}
                </p>
                <button 
                  type="button" 
                  onClick={handlePhoneSubmit}
                  disabled={resendCooldown > 0 || isLoading} 
                  className="text-xs font-black uppercase text-blue-600 hover:underline disabled:text-slate-300 transition-colors"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
                </button>
              </div>
            </div>
          )}

          <button 
            disabled={isLoading}
            className="w-full py-6 bg-[#0066FF] text-white text-xl font-black rounded-full hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/30 flex items-center justify-center gap-3 uppercase tracking-widest active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? <RefreshCw className="animate-spin" size={24} /> : (
              <>
                {step === 'otp' ? 'Activate Account' : 'Confirm'}
                <ArrowRight size={24} />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center">
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">
             {step === 'id' ? "Validation Protocol" : step === 'otp' ? "Verification Layer" : "Secure Gateway"}
           </p>
        </div>
      </div>
    </div>
  );
};

export default AuthFlow;
