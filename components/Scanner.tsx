
import React, { useState, useEffect, useRef } from 'react';
import { Camera, X, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';
import { SAMPLE_VALID_QR } from '../constants';

interface ScannerProps {
  onScan: (data: string) => void;
  onUpload: (file: File) => void;
  onClose: () => void;
}

const Scanner: React.FC<ScannerProps> = ({ onScan, onUpload, onClose }) => {
  const [cameraState, setCameraState] = useState<'initializing' | 'active' | 'error'>('initializing');
  const [errorMessage, setErrorMessage] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
        });
        
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraState('active');
        }
      } catch (err: any) {
        console.error("Camera access error:", err);
        setCameraState('error');
        setErrorMessage(err.name === 'NotAllowedError' ? "Permission denied. Please enable camera access in your browser settings." : "Camera not found or already in use.");
      }
    }

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="relative w-full max-w-4xl bg-white rounded-[56px] shadow-2xl border border-white overflow-hidden flex flex-col md:flex-row h-[600px] animate-in zoom-in-95 duration-500">
        
        {/* Left Side: Scanner Preview */}
        <div className="md:w-3/5 relative bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
          <button 
            onClick={onClose}
            className="md:hidden absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-30"
          >
            <X size={20} />
          </button>

          <div className="relative w-full h-full flex items-center justify-center">
            {cameraState === 'initializing' && (
              <div className="flex flex-col items-center justify-center space-y-6 z-20">
                <RefreshCw className="text-blue-500 animate-spin" size={48} />
                <p className="text-blue-500/80 font-bold text-sm uppercase tracking-[0.2em]">Accessing Camera...</p>
              </div>
            )}

            {cameraState === 'error' && (
              <div className="flex flex-col items-center justify-center space-y-6 z-20 p-8 text-center">
                <div className="bg-red-500/10 p-4 rounded-full text-red-500">
                  <AlertCircle size={40} />
                </div>
                <div className="space-y-2">
                  <p className="text-white font-bold text-lg">Hardware Error</p>
                  <p className="text-slate-400 text-sm max-w-xs">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Video Feed */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${cameraState === 'active' ? 'opacity-100' : 'opacity-0'}`}
            />

            {cameraState === 'active' && (
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 z-10"></div>
                <div className="relative w-full aspect-square max-w-[320px] border-2 border-blue-400/30 rounded-3xl overflow-hidden group z-20">
                   <div className="absolute inset-0 border-[3px] border-blue-400/20 animate-pulse rounded-3xl"></div>
                   <div className="absolute -top-1 -left-1 w-12 h-12 border-t-4 border-l-4 border-blue-400 rounded-tl-2xl"></div>
                   <div className="absolute -top-1 -right-1 w-12 h-12 border-t-4 border-r-4 border-blue-400 rounded-tr-2xl"></div>
                   <div className="absolute -bottom-1 -left-1 w-12 h-12 border-b-4 border-l-4 border-blue-400 rounded-bl-2xl"></div>
                   <div className="absolute -bottom-1 -right-1 w-12 h-12 border-b-4 border-r-4 border-blue-400 rounded-br-2xl"></div>
                   
                   <div className="absolute left-0 right-0 h-1.5 bg-blue-500 shadow-[0_0_30px_rgba(59,130,246,1)] animate-[scan_2.5s_ease-in-out_infinite]"></div>
                </div>
                
                <div className="absolute bottom-10 text-center w-full px-12 z-20">
                  <p className="text-white/80 text-xs font-black uppercase tracking-[0.3em] drop-shadow-lg">
                    Optical ID Verification
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Side: Controls */}
        <div className="md:w-2/5 p-12 flex flex-col justify-center space-y-10 bg-white">
          <div className="hidden md:flex justify-end absolute top-8 right-8">
            <button 
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all"
            >
              <X size={28} />
            </button>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Verify <br/>Benefit</h2>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">Place your institutional ID card within the frame to automatically apply your discount.</p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={() => onScan(SAMPLE_VALID_QR)}
              className="w-full bg-[#0066FF] text-white font-bold py-5 px-6 rounded-full hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-blue-600/30 active:scale-[0.98]"
            >
              <Camera size={22} />
              Simulate Analysis
            </button>

            <div className="relative flex items-center gap-4 py-2">
               <div className="flex-1 h-px bg-slate-100"></div>
               <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Manual Method</span>
               <div className="flex-1 h-px bg-slate-100"></div>
            </div>
            
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-slate-50 text-blue-600 font-bold py-5 px-6 rounded-full border border-blue-100 hover:bg-blue-50 transition-all flex items-center justify-center gap-3 active:scale-[0.98] group"
            >
              <Sparkles size={22} className="group-hover:rotate-12 transition-transform duration-300" />
              Upload Image
            </button>
          </div>

          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl">
             <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
             <p className="text-[10px] text-blue-700 font-bold uppercase tracking-widest">
               End-to-end Encrypted Session
             </p>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0%, 100% { top: 5%; }
          50% { top: 95%; }
        }
      `}} />
    </div>
  );
};

export default Scanner;
