
import React, { useState } from 'react';
import { 
  Users, Activity, Heart, AlertCircle, TrendingUp, PieChart, 
  UserPlus, ShieldAlert, Settings, ClipboardList, CheckCircle2, Upload,
  RefreshCw, ShieldCheck, Lock, Sparkles, Download, FileSpreadsheet
} from 'lucide-react';
import { AnalyticsData, Entity, Counselor } from '../types';
import { MOCK_COUNSELORS } from '../constants';

interface DashboardProps {
  entity: Entity;
  data: AnalyticsData;
}

const AdminDashboard: React.FC<DashboardProps> = ({ entity, data }) => {
  const [activeTab, setActiveTab] = useState<'insights' | 'members' | 'counselors' | 'settings'>('insights');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadReport, setUploadReport] = useState<{ success: number; failed: number } | null>(null);

  const handleDownloadTemplate = () => {
    // Exact 7 fields from Specification Part 1
    const headers = "First Name*,Last Name*,Email*,Gender*,Employee/Student ID*,Department/Grade,Designation/Section\n";
    const sample1 = "Arjun,Reddy,arjun.reddy@techcorp.com,Male,TC-2024-001,Engineering,Senior Developer\n";
    const sample2 = "Aarav,Sharma,aarav.sharma@school.edu,Male,SCH2024-10A-001,Grade 10,Section A\n";
    const blob = new Blob([headers + sample1 + sample2], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'MANAS360_Institutional_Bulk_Upload.csv';
    a.click();
  };

  const handleBulkUpload = () => {
    setIsUploading(true);
    setUploadReport(null);
    setTimeout(() => {
      setIsUploading(false);
      setUploadReport({ success: 485, failed: 15 });
    }, 2500);
  };

  return (
    <div className="w-full space-y-12 pb-24 animate-in fade-in duration-1000">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 border-b border-slate-200/50 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest">{entity.type}</span>
             <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Institutional Portal</span>
          </div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tight">{entity.name}</h2>
        </div>
        
        <div className="flex p-1.5 glass rounded-3xl w-full lg:w-auto shadow-sm">
          <TabButton active={activeTab === 'insights'} onClick={() => setActiveTab('insights')} icon={<TrendingUp size={18}/>} label="Overview" />
          <TabButton active={activeTab === 'members'} onClick={() => setActiveTab('members')} icon={<Users size={18}/>} label="Management" />
          <TabButton active={activeTab === 'counselors'} onClick={() => setActiveTab('counselors')} icon={<Heart size={18}/>} label="Staff" />
          <TabButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={18}/>} label="Protocols" />
        </div>
      </header>

      {activeTab === 'members' && (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="glass p-12 rounded-[56px] text-center space-y-10 border-2 border-dashed border-blue-100 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-blue-50 rounded-[32px] flex items-center justify-center text-blue-500">
                <FileSpreadsheet size={40} />
              </div>
              <div className="space-y-3">
                <h3 className="text-3xl font-black text-slate-900">Bulk Member Upload</h3>
                <p className="text-slate-500 text-base font-medium max-w-sm mx-auto leading-relaxed">
                  Upload employee or student data. System will create "inactive" accounts automatically. 
                  <span className="block mt-2 font-bold text-blue-600">No phone numbers required upfront.</span>
                </p>
              </div>
              
              <div className="w-full max-w-sm space-y-4">
                 <button 
                  onClick={handleDownloadTemplate}
                  className="w-full py-4 bg-white border-2 border-blue-100 text-[#0066FF] font-bold rounded-full flex items-center justify-center gap-3 hover:bg-blue-50 transition-all shadow-md"
                 >
                   <Download size={20} /> Download CSV Template
                 </button>
                 <button 
                  onClick={handleBulkUpload}
                  disabled={isUploading}
                  className="w-full py-5 bg-[#0066FF] text-white text-lg font-bold rounded-full flex items-center justify-center gap-3 hover:bg-blue-700 transition-all disabled:opacity-50 shadow-2xl shadow-blue-600/30"
                 >
                   {isUploading ? <><RefreshCw className="animate-spin" size={24} /> Validating Pipeline...</> : <><Upload size={24} /> Upload Data File</>}
                 </button>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Max 10,000 rows per batch</p>
              </div>
            </div>

            <div className="space-y-6">
              {uploadReport && (
                <div className="bg-white p-8 rounded-[48px] shadow-xl border border-blue-100 space-y-6 animate-in zoom-in-95">
                  <h4 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="text-green-500" size={24}/>
                    Upload Summary
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-green-50 rounded-3xl border border-green-100 text-center">
                      <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">Successfully Created</p>
                      <p className="text-4xl font-black text-green-700">{uploadReport.success}</p>
                    </div>
                    <div className="p-6 bg-red-50 rounded-3xl border border-red-100 text-center">
                      <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">Rejected/Failed</p>
                      <p className="text-4xl font-black text-red-700">{uploadReport.failed}</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl space-y-2">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Validation Errors Found:</p>
                    <ul className="text-xs text-red-600 font-medium space-y-1">
                      <li>• 10 rows: Duplicate email within database</li>
                      <li>• 5 rows: Invalid ID format (Non-alphanumeric)</li>
                    </ul>
                  </div>
                </div>
              )}

              <div className="glass p-10 rounded-[56px] space-y-6">
                <h4 className="text-xl font-black text-slate-900">Required Attributes</h4>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    "First Name (Letters & Spaces only)",
                    "Last Name (Letters & Spaces only)",
                    "Email (Must be unique)",
                    "Gender (Male, Female, Other, PNT say)",
                    "Employee/Student ID (Case-insensitive)",
                    "Department/Grade (Optional)",
                    "Designation/Section (Optional)"
                  ].map((field, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                       <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                       {field}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OVERVIEW TAB */}
      {activeTab === 'insights' && (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard icon={<Users className="text-blue-600" size={24}/>} label="Active Users" value={`${data.participation.rate}%`} subtext={`${data.participation.total_active} Engaged Members`} />
            <StatCard icon={<Activity className="text-blue-500" size={24}/>} label="Weekly Sessions" value={data.engagement.therapy_sessions.toString()} subtext="Completed Clinical Hours" />
            <StatCard icon={<Heart className="text-blue-400" size={24}/>} label="Community Health" value={`${data.wellness.avg_mood}/10`} subtext="Avg Sentiment Score" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 glass p-10 rounded-[48px] shadow-sm space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ClipboardList size={24} className="text-blue-600" />
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Clinical Index Aggregate</h3>
                </div>
                <button className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline">Export Report</button>
              </div>
              <div className="space-y-8">
                <MetricBar label="Average Depression (PHQ-9)" value={data.wellness.avg_phq9} max={27} color="bg-[#0066FF]" />
                <MetricBar label="Average Anxiety (GAD-7)" value={data.wellness.avg_gad7} max={21} color="bg-blue-400" />
              </div>
              <div className="bg-[#0066FF]/5 p-6 rounded-3xl flex gap-4 border border-[#0066FF]/10">
                <div className="w-12 h-12 rounded-2xl bg-[#0066FF] text-white flex items-center justify-center flex-shrink-0">
                   <Sparkles size={24} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-black text-blue-900 uppercase tracking-wide">AI Recommendation</p>
                  <p className="text-sm text-blue-800/80 font-medium leading-relaxed">
                    {data.wellness.interpretation}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 glass p-10 rounded-[48px] shadow-sm space-y-8">
              <div className="flex items-center gap-3">
                <PieChart size={24} className="text-blue-800" />
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Primary Indicators</h3>
              </div>
              <div className="space-y-6">
                {Object.entries(data.top_concerns).map(([concern, percentage]) => (
                  <MetricBar key={concern} label={concern} value={percentage as number} max={100} color="bg-blue-500" small />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'counselors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
          {MOCK_COUNSELORS.map(c => (
            <div key={c.id} className="bg-white p-8 rounded-[40px] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 border border-white">
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 rounded-[24px] bg-blue-50 flex items-center justify-center text-blue-600">
                  <Heart size={32} />
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${c.status === 'online' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                  {c.status}
                </div>
              </div>
              <div className="mb-6">
                <h4 className="text-xl font-black text-slate-900 mb-1">{c.name}</h4>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest text-[10px]">{c.specialty}</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                  <span>Patient Load</span>
                  <span>{c.assigned_members}/{c.max_capacity}</span>
                </div>
                <div className="w-full h-2.5 bg-blue-50 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0066FF]" style={{ width: `${(c.assigned_members/c.max_capacity)*100}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="lg:col-span-7 space-y-10">
            <div className="space-y-4">
               <h3 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                 <ShieldAlert className="text-red-500" size={32} />
                 Emergency Escalation
               </h3>
               <p className="text-slate-500 font-medium text-lg">Defined protocols for critical sentiment detection.</p>
            </div>
            
            <div className="glass p-10 rounded-[56px] border border-red-50 shadow-lg space-y-8">
               <div className="divide-y divide-slate-100">
                  <ProtocolField label="Detection Logic" value="AI Semantic Sentiment Trigger" />
                  <ProtocolField label="Primary Contact" value="Campus Wellness Lead" />
                  <ProtocolField label="Escalation Delay" value="Zero Latency (Instant)" />
               </div>
               <button className="w-full py-5 border-2 border-red-100 text-red-600 text-lg font-black rounded-full hover:bg-red-50 transition-colors uppercase tracking-widest">
                 Update Crisis Node
               </button>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-10">
             <div className="bg-[#0066FF] text-white p-12 rounded-[56px] space-y-8 shadow-2xl shadow-blue-600/30">
               <div className="space-y-3">
                 <h4 className="text-2xl font-black flex items-center gap-3"><ShieldCheck size={28} className="text-blue-200"/> Integrity Shield</h4>
                 <p className="text-sm text-blue-100/70 font-bold uppercase tracking-widest">Continuous Compliance</p>
               </div>
               <div className="space-y-4">
                  <IntegrityRow label="Member Anonymity" status="SHIELDED" />
                  <IntegrityRow label="DPDPA Compliance" status="VERIFIED" />
               </div>
               <button className="w-full py-4 bg-white/10 border border-white/20 rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-white/20 transition-all">
                 Download Audit Log
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

const IntegrityRow = ({ label, status }: { label: string, status: string }) => (
  <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/5">
    <span className="text-sm font-bold tracking-tight">{label}</span>
    <span className="text-[10px] bg-blue-400 text-white px-3 py-1 rounded-full font-black uppercase tracking-widest">{status}</span>
  </div>
);

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl text-sm font-black transition-all whitespace-nowrap tracking-wide ${active ? 'bg-white text-[#0066FF] shadow-lg border border-blue-50 scale-105' : 'text-slate-400 hover:text-slate-600'}`}
  >
    {icon}
    {label}
  </button>
);

const StatCard = ({ icon, label, value, subtext }: { icon: React.ReactNode, label: string, value: string, subtext: string }) => (
  <div className="bg-white p-10 rounded-[48px] shadow-sm space-y-4 border border-white hover:shadow-xl transition-all duration-500 group">
    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:bg-[#0066FF] group-hover:text-white transition-colors duration-500">{icon}</div>
    <div className="space-y-1">
      <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
      <p className="text-4xl font-black text-slate-900 tracking-tighter">{value}</p>
    </div>
    <p className="text-sm text-slate-500 font-medium">{subtext}</p>
  </div>
);

const MetricBar: React.FC<{ label: string, value: number, max: number, color: string, small?: boolean }> = ({ label, value, max, color, small = false }) => (
  <div className="space-y-3">
    <div className="flex justify-between text-xs font-black uppercase tracking-[0.15em] text-slate-500">
      <span>{label}</span>
      <span className="text-slate-900">{value}{max === 100 ? '%' : ''}</span>
    </div>
    <div className={`w-full ${small ? 'h-2' : 'h-3'} bg-slate-100 rounded-full overflow-hidden shadow-inner`}>
      <div className={`h-full ${color} rounded-full transition-all duration-1000 ease-out shadow-sm`} style={{ width: `${(value/max)*100}%` }}></div>
    </div>
  </div>
);

const ProtocolField = ({ label, value }: { label: string, value: string }) => (
  <div className="flex justify-between items-center py-6 border-b border-slate-50 last:border-0">
    <span className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">{label}</span>
    <span className="text-lg font-black text-slate-900 tracking-tight">{value}</span>
  </div>
);

export default AdminDashboard;
