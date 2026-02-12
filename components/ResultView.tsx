
import React from 'react';
import { CheckCircle, XCircle, ChevronRight, Mail, ArrowRight } from 'lucide-react';
import { VerificationResult } from '../types';

interface ResultViewProps {
  result: VerificationResult;
  onContinue: () => void;
  onRetry: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ result, onContinue, onRetry }) => {
  if (!result.success) {
    return (
      <div className="space-y-6 text-center animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-center">
          <div className="bg-red-50 p-4 rounded-full">
            <XCircle className="text-red-500" size={48} />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Verification Failed</h2>
          <p className="text-slate-600 leading-relaxed max-w-xs mx-auto">
            {result.message}
          </p>
        </div>
        <button 
          onClick={onRetry}
          className="w-full py-4 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 transition-all shadow-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      {result.has_partnership ? (
        <div className="space-y-6">
          <div className="text-center space-y-3">
             <div className="flex justify-center">
               <div className="bg-blue-50 p-4 rounded-full">
                 <CheckCircle className="text-[#0066FF]" size={48} />
               </div>
             </div>
             <h2 className="text-2xl font-bold text-slate-900 tracking-tight leading-snug">
               🎓 Great news! {result.institution_name} has partnered with MANAS360.
             </h2>
             <p className="text-slate-600 font-medium">Your institutional benefit is now active.</p>
          </div>

          <div className="bg-white border border-blue-100 rounded-[40px] p-8 space-y-6 shadow-xl shadow-blue-500/5">
            <div className="flex justify-between items-center pb-4 border-b border-blue-50">
              <span className="text-slate-500 font-medium">Pricing Status</span>
              <span className="bg-[#0066FF] text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full">
                Benefit Applied
              </span>
            </div>

            <div className="flex justify-between items-baseline">
              <div className="space-y-1">
                <span className="block text-sm text-slate-500">Standard Price</span>
                <span className="text-xl text-slate-300 line-through font-medium">₹{result.original_price}</span>
              </div>
              <ArrowRight className="text-blue-200" size={20} />
              <div className="text-right space-y-1">
                <span className="block text-sm text-[#0066FF] font-bold uppercase tracking-wider">Your Price</span>
                <span className="text-4xl font-black text-slate-900">₹{result.final_price}<small className="text-sm font-normal text-slate-500">/mo</small></span>
              </div>
            </div>

            <div className="bg-blue-50 rounded-2xl p-4 flex justify-between items-center text-sm font-bold text-blue-700">
              <span>Monthly Savings:</span>
              <span>₹{result.discount_amount}</span>
            </div>

            <div className="text-center pt-2">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                Verification valid for current term
              </p>
            </div>
          </div>

          <button 
            onClick={onContinue}
            className="w-full py-5 bg-[#0066FF] text-white font-bold rounded-full hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2"
          >
            Continue with Discount
            <ChevronRight size={18} />
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-center space-y-3">
             <div className="flex justify-center">
               <div className="bg-slate-100 p-4 rounded-full">
                 <XCircle className="text-slate-400" size={48} />
               </div>
             </div>
             <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Institution Not Partnered</h2>
             <p className="text-slate-600 leading-relaxed px-4">
               {result.message}
             </p>
          </div>

          <div className="bg-white rounded-[40px] p-8 space-y-4 border border-slate-100 shadow-xl">
             <div className="flex justify-between items-center text-sm">
               <span className="text-slate-500">Standard Pricing:</span>
               <span className="text-slate-900 font-black text-xl">₹{result.price}/mo</span>
             </div>
             <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="text-[#0066FF]" size={20} />
                  <div className="flex-1">
                    <p className="font-bold text-blue-900">Request Partnership</p>
                    <p className="text-blue-700 text-xs">Tell your college about MANAS360 wellness.</p>
                  </div>
                </div>
                <button className="w-full mt-4 py-2 border-2 border-[#0066FF] text-[#0066FF] text-sm font-bold rounded-xl hover:bg-white transition-colors">
                  Send Referral Email
                </button>
             </div>
          </div>

          <button 
            onClick={onContinue}
            className="w-full py-5 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center gap-2"
          >
            Continue at Standard Rate
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ResultView;