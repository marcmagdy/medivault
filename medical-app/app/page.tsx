"use client";
import React, { useState, useMemo } from 'react';
import { 
  Activity, FileText, Brain, ClipboardList, FolderOpen, 
  LogOut, Plus, AlertTriangle, CheckCircle, Upload, User, 
  Heart, Thermometer, Weight, Droplet
} from 'lucide-react';

// --- TYPESCRIPT INTERFACES ---
interface AppUser { id: string; email: string; name: string; }
interface Reading { id: number; type: string; value: string; unit: string; date: string; }
interface MedicalCard { bloodType: string; age: string; allergies: string; medications: string; chronicDiseases: string; surgeries: string; [key: string]: string; }

// --- MOCK DATA ---
const MOCK_USER: AppUser = { id: '1', email: 'marc@example.com', name: 'Marc' };
const INITIAL_READINGS: Reading[] = [
  { id: 1, type: 'Heart Rate', value: '72', unit: 'bpm', date: '2026-03-26' },
  { id: 2, type: 'Blood Pressure', value: '120/80', unit: 'mmHg', date: '2026-03-25' },
  { id: 3, type: 'Temperature', value: '37.1', unit: '°C', date: '2026-03-24' },
];
const INITIAL_CARD: MedicalCard = {
  bloodType: 'O+',
  age: '24',
  allergies: 'Penicillin, Peanuts',
  medications: 'None currently',
  chronicDiseases: 'None',
  surgeries: 'Appendectomy (2015)'
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [activeTab, setActiveTab] = useState('readings');
  
  const [readings, setReadings] = useState<Reading[]>(INITIAL_READINGS);
  const [medicalCard, setMedicalCard] = useState<MedicalCard>(INITIAL_CARD);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(MOCK_USER);
  };
  const handleLogout = () => setUser(null);

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      <aside className="hidden md:flex flex-col w-64 bg-blue-700 text-white shadow-xl print:hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="w-8 h-8" />
            MediVault
          </h1>
          <p className="text-blue-200 text-sm mt-1">Hello, {user.name}</p>
        </div>
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} isMobile={false} />
        <div className="mt-auto p-4">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full p-3 hover:bg-blue-800 rounded-xl transition">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col max-h-screen overflow-hidden">
        <header className="md:hidden bg-blue-700 text-white p-4 flex justify-between items-center shadow-md print:hidden">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Activity className="w-6 h-6" /> MediVault
          </h1>
          <button onClick={handleLogout}><LogOut className="w-6 h-6" /></button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 print:p-0 print:overflow-visible">
          {activeTab === 'readings' && <ReadingsTab readings={readings} setReadings={setReadings} />}
          {activeTab === 'card' && <MedicalCardTab card={medicalCard} setCard={setMedicalCard} />}
          {activeTab === 'insights' && <InsightsTab readings={readings} />}
          {activeTab === 'reports' && <ReportsTab readings={readings} card={medicalCard} user={user} />}
          {activeTab === 'documents' && <DocumentsTab />}
        </div>
      </main>

      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 flex justify-around p-3 shadow-md print:hidden z-50">
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} isMobile={true} />
      </nav>
    </div>
  );
}

// --- NAVIGATION COMPONENT ---
function Navigation({ activeTab, setActiveTab, isMobile }: { activeTab: string, setActiveTab: (id: string) => void, isMobile: boolean }) {
  const navItems = [
    { id: 'readings', icon: Activity, label: 'Readings' },
    { id: 'card', icon: User, label: 'Medical Card' },
    { id: 'insights', icon: Brain, label: 'AI Insights' },
    { id: 'reports', icon: ClipboardList, label: 'Reports' },
    { id: 'documents', icon: FolderOpen, label: 'Vault' },
  ];

  if (isMobile) {
    return navItems.map((item) => {
      const Icon = item.icon;
      const isActive = activeTab === item.id;
      return (
        <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex flex-col items-center gap-1 p-2 rounded-lg transition ${isActive ? 'text-blue-600' : 'text-slate-500'}`}>
          <Icon className={`w-6 h-6 ${isActive ? 'fill-blue-100' : ''}`} />
          <span className="text-[10px] font-medium">{item.label}</span>
        </button>
      );
    });
  }

  return (
    <nav className="flex-1 px-4 space-y-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex items-center gap-3 w-full p-3 rounded-xl transition ${isActive ? 'bg-white text-blue-700 font-bold shadow-sm' : 'text-blue-100 hover:bg-blue-600'}`}>
            <Icon className="w-5 h-5" /> {item.label}
          </button>
        );
      })}
    </nav>
  );
}

// --- AUTH SCREEN ---
function LoginScreen({ onLogin }: { onLogin: (e: React.FormEvent) => void }) {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 p-4 rounded-full text-white shadow-lg"><Activity className="w-10 h-10" /></div>
        </div>
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <form onSubmit={onLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
            <input type="email" required defaultValue="marc@example.com" className="w-full p-3 border border-slate-300 rounded-xl outline-none text-slate-800" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Password</label>
            <input type="password" required defaultValue="password123" className="w-full p-3 border border-slate-300 rounded-xl outline-none text-slate-800" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 shadow-md">{isLogin ? 'Log In' : 'Sign Up'}</button>
        </form>
      </div>
    </div>
  );
}

// --- READINGS TAB ---
function ReadingsTab({ readings, setReadings }: { readings: Reading[], setReadings: (r: Reading[]) => void }) {
  const [showModal, setShowModal] = useState(false);
  const [newReading, setNewReading] = useState({ type: 'Heart Rate', value: '', unit: 'bpm' });

  const readingTypes = [
    { name: 'Heart Rate', unit: 'bpm', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-100' },
    { name: 'Blood Pressure', unit: 'mmHg', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-100' },
    { name: 'Glucose', unit: 'mg/dL', icon: Droplet, color: 'text-indigo-500', bg: 'bg-indigo-100' },
    { name: 'Temperature', unit: '°C', icon: Thermometer, color: 'text-orange-500', bg: 'bg-orange-100' },
    { name: 'Weight', unit: 'kg', icon: Weight, color: 'text-emerald-500', bg: 'bg-emerald-100' },
  ];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setReadings([{ ...newReading, id: Date.now(), date: new Date().toISOString().split('T')[0] }, ...readings]);
    setShowModal(false);
    setNewReading({ type: 'Heart Rate', value: '', unit: 'bpm' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Vital Signs</h2>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-full font-medium flex items-center gap-2 hover:bg-blue-700"><Plus className="w-5 h-5" /> <span className="hidden sm:inline">Add Reading</span></button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {readingTypes.map(type => (
          <div key={type.name} onClick={() => { setNewReading({ type: type.name, value: '', unit: type.unit }); setShowModal(true); }} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${type.bg} ${type.color}`}><type.icon className="w-5 h-5" /></div>
            <h3 className="text-slate-500 text-sm font-medium">{type.name}</h3>
            <p className="text-2xl font-bold text-slate-800 mt-1">{readings.find(r => r.type === type.name)?.value || '--'} <span className="text-sm font-normal text-slate-400">{type.unit}</span></p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 mt-8">
        <h3 className="font-bold text-slate-800 p-4 border-b border-slate-100 bg-slate-50">Recent History</h3>
        <ul className="divide-y divide-slate-100">
          {readings.map(r => (
            <li key={r.id} className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <div><p className="font-bold text-slate-800">{r.type}</p><p className="text-xs text-slate-400">{r.date}</p></div>
              </div>
              <p className="font-bold text-slate-700">{r.value} <span className="text-sm font-normal text-slate-400">{r.unit}</span></p>
            </li>
          ))}
        </ul>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Log {newReading.type}</h3>
            <form onSubmit={handleAdd}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-600 mb-2">Value ({newReading.unit})</label>
                <input type="text" autoFocus required value={newReading.value} onChange={e => setNewReading({...newReading, value: e.target.value})} className="w-full text-4xl font-bold p-4 text-center border-2 border-slate-200 rounded-2xl outline-none text-slate-800" placeholder="0" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl font-bold text-slate-600 bg-slate-100">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-xl font-bold text-white bg-blue-600">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- MEDICAL CARD TAB ---
function MedicalCardTab({ card, setCard }: { card: MedicalCard, setCard: (c: MedicalCard) => void }) {
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Medical Card</h2>
        <button onClick={() => setIsWizardOpen(true)} className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100">Update Info</button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-blue-600 p-6 text-white flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">{MOCK_USER.name[0]}</div>
          <div><h3 className="text-xl font-bold">{MOCK_USER.name}</h3><p className="text-blue-100">{card.age} years old • Blood: {card.bloodType}</p></div>
        </div>
        
        <div className="p-6 space-y-4">
          <InfoRow label="Allergies" value={card.allergies} alert={card.allergies !== 'None'} />
          <InfoRow label="Current Medications" value={card.medications} />
          <InfoRow label="Chronic Diseases" value={card.chronicDiseases} />
          <InfoRow label="Past Surgeries" value={card.surgeries} />
        </div>
      </div>

      {isWizardOpen && <WizardModal card={card} setCard={setCard} onClose={() => setIsWizardOpen(false)} />}
    </div>
  );
}

function InfoRow({ label, value, alert = false }: { label: string, value: string, alert?: boolean }) {
  return (
    <div className="py-3 border-b border-slate-50 last:border-0">
      <p className="text-sm text-slate-500 font-medium mb-1">{label}</p>
      <p className={`font-bold ${alert ? 'text-rose-600' : 'text-slate-800'}`}>{value}</p>
    </div>
  );
}

function WizardModal({ card, setCard, onClose }: { card: MedicalCard, setCard: (c: MedicalCard) => void, onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [tempData, setTempData] = useState<MedicalCard>(card);
  const steps = [
    { key: 'allergies', title: 'Any new allergies?' },
    { key: 'medications', title: 'Taking new medications?' },
    { key: 'chronicDiseases', title: 'Any new diagnoses?' }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else { setCard(tempData); onClose(); }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-md rounded-2xl p-6">
        <h3 className="font-bold text-slate-400 text-sm uppercase mb-6">Step {step + 1}/3</h3>
        <h2 className="text-2xl font-bold text-slate-800 mb-6">{steps[step].title}</h2>
        <textarea value={tempData[steps[step].key]} onChange={(e) => setTempData({...tempData, [steps[step].key]: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl p-4 min-h-[120px] outline-none text-slate-700 mb-6" />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 font-bold text-slate-500 bg-slate-100 rounded-xl">Cancel</button>
          <button onClick={handleNext} className="flex-1 py-3 font-bold text-white bg-blue-600 rounded-xl">{step === steps.length - 1 ? 'Save Profile' : 'Next'}</button>
        </div>
      </div>
    </div>
  );
}

// --- AI INSIGHTS TAB ---
function InsightsTab({ readings }: { readings: Reading[] }) {
  const insights = useMemo(() => {
    const alerts = [];
    const hr = readings.find(r => r.type === 'Heart Rate')?.value;
    const bp = readings.find(r => r.type === 'Blood Pressure')?.value;
    
    if (hr && parseInt(hr) > 100) alerts.push({ level: 'yellow', issue: 'Elevated Heart Rate', reason: `Recent HR is ${hr} bpm.` });
    else alerts.push({ level: 'green', issue: 'Heart Rate Normal', reason: `Recent HR is ${hr} bpm.` });

    if (bp && bp.startsWith('14')) alerts.push({ level: 'red', issue: 'Hypertension Alert', reason: `Blood pressure reading (${bp}) is high.` });
    else if (bp) alerts.push({ level: 'green', issue: 'Blood Pressure Optimal', reason: `Reading (${bp}) is normal.` });

    return alerts;
  }, [readings]);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <Brain className="absolute right-[-20px] bottom-[-20px] w-48 h-48 opacity-10" />
        <h2 className="text-2xl font-bold mb-2">AI Health Analysis</h2>
        <p className="text-blue-100">Automated insights based on your recent readings.</p>
      </div>

      <div className="space-y-4 mt-6">
        {insights.map((insight, idx) => (
          <div key={idx} className={`p-5 rounded-2xl border-l-4 flex gap-4 ${insight.level === 'red' ? 'bg-rose-50 border-rose-500' : insight.level === 'yellow' ? 'bg-amber-50 border-amber-500' : 'bg-emerald-50 border-emerald-500'}`}>
            {insight.level === 'green' ? <CheckCircle className="text-emerald-500 w-6 h-6 mt-1" /> : <AlertTriangle className={`${insight.level === 'red' ? 'text-rose-500' : 'text-amber-500'} w-6 h-6 mt-1`} />}
            <div>
              <h3 className="font-bold text-lg text-slate-800">{insight.issue}</h3>
              <p className="text-slate-600 mt-1">{insight.reason}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- REPORTS TAB ---
function ReportsTab({ readings, card, user }: { readings: Reading[], card: MedicalCard, user: AppUser }) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <h2 className="text-2xl font-bold text-slate-800">Export Report</h2>
        <button onClick={() => window.print()} className="bg-slate-800 text-white px-5 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-slate-900"><FileText className="w-5 h-5" /> Print PDF</button>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200 print:shadow-none print:border-none print:p-0">
        <div className="text-center border-b-2 border-slate-800 pb-6 mb-8">
          <h1 className="text-3xl font-black text-slate-900 uppercase">Medical Summary</h1>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-10">
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase mb-3">Patient Info</h3>
            <p className="text-xl font-bold text-slate-800">{user.name}</p>
            <p className="text-slate-600">Age: {card.age} • Blood Type: {card.bloodType}</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase mb-3">Critical Info</h3>
            <p className="text-slate-800"><span className="font-bold">Allergies:</span> {card.allergies}</p>
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">Latest Vitals</h3>
        <table className="w-full text-left">
          <thead><tr className="text-slate-400 text-sm"><th>Date</th><th>Metric</th><th>Value</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {readings.slice(0, 5).map(r => (
              <tr key={r.id}><td className="py-3 text-slate-600">{r.date}</td><td className="py-3 font-medium text-slate-800">{r.type}</td><td className="py-3 font-bold text-slate-800">{r.value} {r.unit}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- DOCUMENTS TAB ---
function DocumentsTab() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Document Vault</h2>
        <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-blue-200"><Upload className="w-4 h-4" /> Upload</button>
      </div>
      <div className="border-2 border-dashed border-slate-300 rounded-3xl p-10 flex flex-col items-center justify-center text-center bg-slate-50 cursor-pointer">
        <FolderOpen className="w-12 h-12 text-slate-400 mb-4" />
        <p className="font-bold text-slate-700">Tap or drag files here</p>
      </div>
    </div>
  );
}