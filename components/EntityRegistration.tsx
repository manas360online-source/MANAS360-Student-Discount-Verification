
import React, { useState } from 'react';
import { School, Building2, Landmark, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { EntityType } from '../types';

interface RegistrationProps {
  onComplete: (entity: any) => void;
}

const EntityRegistration: React.FC<RegistrationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [type, setType] = useState<EntityType | null>(null);

  const entityTypes: { id: EntityType, label: string, icon: any }[] = [
    { id: 'school', label: 'School (K-12)', icon: School },
    { id: 'college', label: 'College/University', icon: Landmark },
    { id: 'corporate', label: 'Corporate/Startup', icon: Building2 },
    { id: 'healthcare', label: 'Healthcare Inst.', icon: Landmark },
    { id: 'government', label: 'Government Dept.', icon: Landmark },
  ];

  return (
    <div className="w-full max-w-2xl animate-in slide-in-from-bottom-12 duration-700 mx-auto">
      {step === 1 && (
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Select Entity Identity</h2>
            <p className="text-slate-500 text-lg font-medium">Unified clinical infrastructure for every institutional tier.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {entityTypes.map((item) => (
              <button
                key={item.id}
                onClick={() => { setType(item.id); setStep(2); }}
                className="flex flex-col gap-6 p-8 bg-white border border-slate-100 rounded-[40px] text-left hover:border-[#0066FF] hover:shadow-[0_20px_50px_rgba(0,102,255,0.1)] transition-all duration-500 group"
              >
                <div className="w-16 h-16 rounded-[24px] bg-blue-50 flex items-center justify-center text-blue-400 group-hover:bg-[#0066FF] group-hover:text-white transition-all duration-500">
                  <item.icon size={32} />
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-black text-slate-900 tracking-tight">{item.label}</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Register Partner Account</p>
                </div>
                <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                   Proceed <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform"/>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Administrative Audit</h2>
            <p className="text-slate-500 text-lg font-medium uppercase tracking-[0.2em] font-black">Provisioning {type} Portal</p>
          </div>

          <form className="glass p-12 rounded-[64px] shadow-2xl space-y-10" onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputGroup label="Institutional Legal Name" placeholder="e.g. Modern School" />
                <InputGroup label="Authorized Admin Name" placeholder="e.g. Dr. John Doe" />
                <InputGroup label="Official Admin Email" placeholder="admin@entity.com" type="email" />
                <InputGroup label="Est. Cohort Size" placeholder="e.g. 500" type="number" />
             </div>

             <div className="bg-[#0066FF]/5 p-6 rounded-3xl flex items-start gap-4 border border-[#0066FF]/10">
                <div className="p-3 bg-[#0066FF] rounded-2xl text-white shadow-lg shadow-blue-500/20">
                  <ShieldCheck size={24} />
                </div>
                <p className="text-sm text-blue-900/80 font-bold leading-relaxed">
                  Compliance Notice: By initializing this portal, you affirm legal authority to activate mental wellness programs for your cohort under the DPDPA 2023 guidelines.
                </p>
             </div>

             <button className="w-full py-6 bg-[#0066FF] text-white text-xl font-black rounded-full hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/30 uppercase tracking-widest">
                Authorize & Finalize
             </button>
          </form>
        </div>
      )}

      {step === 3 && (
        <div className="text-center space-y-12 py-16 animate-in zoom-in-95 duration-1000">
          <div className="flex justify-center">
            <div className="bg-[#0066FF] p-10 rounded-[40px] text-white shadow-[0_30px_60px_-10px_rgba(0,102,255,0.4)] animate-bounce">
              <CheckCircle2 size={80} strokeWidth={2.5}/>
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-5xl font-black text-slate-900 tracking-tight">Provisioning Complete</h2>
            <p className="text-slate-500 text-xl font-medium max-w-md mx-auto leading-relaxed">
              Your institutional infrastructure is now verified. You may proceed to the dashboard to begin member enrollment.
            </p>
          </div>
          <button 
            onClick={() => onComplete({ name: 'Partner Entity Hub', type: type })}
            className="w-full max-w-sm py-6 bg-slate-900 text-white text-xl font-black rounded-full hover:bg-black transition-all shadow-2xl shadow-slate-900/10 uppercase tracking-widest"
          >
            Access Portal
          </button>
        </div>
      )}
    </div>
  );
};

const InputGroup = ({ label, placeholder, type = 'text' }: { label: string, placeholder: string, type?: string }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">{label}</label>
    <input 
      type={type} 
      placeholder={placeholder}
      className="w-full px-6 py-4 bg-white border border-slate-100 rounded-[24px] focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#0066FF] transition-all text-base font-bold shadow-sm placeholder:text-slate-300"
    />
  </div>
);

export default EntityRegistration;
