import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Upload } from 'lucide-react';

interface FormDataShape {
  goal: string;
  target: string;
  duration: string;
  income: string;
  expenses: string;
  risk: 'Low' | 'Medium' | 'High';
}

interface SplitItem { name: string; value: number }
interface ProjectionPoint { year: number; conservative: number; moderate: number; aggressive: number }
interface ResultShape {
  savings: number;
  conservative: number;
  moderate: number;
  aggressive: number;
  investmentSplit: SplitItem[];
  projection: ProjectionPoint[];
  target: number;
  durationYears: number;
  computedAt?: number;
}

const COLORS = ['#2563eb', '#14b8a6', '#facc15'];

const toNumber = (v: unknown): number => {
  const n = parseFloat(String(v ?? '').replace(/,/g, ''));
  return Number.isFinite(n) && !Number.isNaN(n) ? n : 0;
};

const projectFV = (monthlyContribution: number, monthlyRate: number, months: number) => (
  monthlyRate > 0
    ? monthlyContribution * ((1 + monthlyRate) ** months - 1) / monthlyRate
    : monthlyContribution * months
);

const onlyDigits = (s: string) => s.replace(/\\D+/g, '');

function NumericInput({ value, onChange, placeholder, className }: { value: string; onChange: (s: string) => void; placeholder?: string; className?: string; }) {
  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={value}
      onChange={(e) => onChange(onlyDigits(e.target.value))}
      placeholder={placeholder}
      className={className}
      autoComplete="off"
      autoCorrect="off"
      spellCheck={false}
    />
  );
}

function Aurora() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-32 -left-20 w-[40rem] h-[40rem] rounded-full blur-3xl opacity-30" style={{ background: 'radial-gradient(closest-side, #60a5fa, transparent)' }} />
      <div className="absolute -bottom-40 -right-24 w-[48rem] h-[48rem] rounded-full blur-3xl opacity-25" style={{ background: 'radial-gradient(closest-side, #22d3ee, transparent)' }} />
    </div>
  );
}

type OnboardingProps = {
  step: number;
  stepsTotal: number;
  formData: FormDataShape;
  setFormData: React.Dispatch<React.SetStateAction<FormDataShape>>;
  advance: () => void;
  back: () => void;
  handleCSVUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
};

function OnboardingWizard(props: OnboardingProps) {
  const { step, stepsTotal, formData, setFormData, advance, back, handleCSVUpload, handleSubmit } = props;
  return (
    <Card className="p-8 shadow-xl rounded-2xl border border-gray-200 bg-white/70 backdrop-blur relative">
      <Aurora />
      <CardContent>
        <div className="mb-6">
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600" style={{ width: `${((step+1)/stepsTotal)*100}%` }} />
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">Step {step+1} of {stepsTotal}</p>
        </div>

        <div>
          {step === 0 && (
            <div>
              <h2 className="text-3xl font-semibold text-blue-700 text-center">Hi! I'm Finler—your AI planner.</h2>
              <p className="text-gray-600 text-center mt-2">Let's plan your goal. Pick a preset or type your own.</p>
              <div className="flex flex-wrap gap-2 justify-center mt-6">
                {['Buy a House','Buy a Car','Wedding','Education','Emergency Fund'].map(g => (
                  <button type="button" key={g} onClick={() => setFormData(v=>({ ...v, goal: g }))} className={`px-3 py-2 rounded-full border ${formData.goal===g?'bg-blue-600 text-white':'bg-white text-gray-700 hover:bg-blue-50'}`}>{g}</button>
                ))}
              </div>
              <input type="text" value={formData.goal} onChange={e=>setFormData(v=>({...v, goal: e.target.value}))} placeholder="Your goal (e.g. Buy a House)" className="mt-6 w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500" />
              <div className="mt-6 flex justify-between">
                <span />
                <button type="button" onClick={advance} disabled={!formData.goal} className="px-4 py-2 rounded-lg bg-blue-700 text-white">Next</button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-2xl font-semibold text-blue-700 text-center">How much do you want to reach?</h2>
              <NumericInput value={formData.target} onChange={(s)=>setFormData(v=>({...v, target: s}))} placeholder={`Target Amount (₹)`} className="mt-6 w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500" />
              <div className="mt-6 flex justify-between">
                <button type="button" onClick={back} className="px-4 py-2 rounded-lg border border-gray-300">Back</button>
                <button type="button" onClick={advance} disabled={!formData.target} className="px-4 py-2 rounded-lg bg-blue-700 text-white">Next</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-semibold text-blue-700 text-center">In how many years?</h2>
              <NumericInput value={formData.duration} onChange={(s)=>setFormData(v=>({...v, duration: s}))} placeholder="Duration (Years)" className="mt-6 w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500" />
              <div className="mt-6 flex justify-between">
                <button type="button" onClick={back} className="px-4 py-2 rounded-lg border border-gray-300">Back</button>
                <button type="button" onClick={advance} disabled={!formData.duration} className="px-4 py-2 rounded-lg bg-blue-700 text-white">Next</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-semibold text-blue-700 text-center">What's your monthly income?</h2>
              <NumericInput value={formData.income} onChange={(s)=>setFormData(v=>({...v, income: s}))} placeholder={`Monthly Income (₹)`} className="mt-6 w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500" />
              <div className="mt-6 flex justify-between">
                <button type="button" onClick={back} className="px-4 py-2 rounded-lg border border-gray-300">Back</button>
                <button type="button" onClick={advance} disabled={!formData.income} className="px-4 py-2 rounded-lg bg-blue-700 text-white">Next</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-2xl font-semibold text-blue-700 text-center">Monthly expenses?</h2>
              <NumericInput value={formData.expenses} onChange={(s)=>setFormData(v=>({...v, expenses: s}))} placeholder={`Monthly Expenses (₹)`} className="mt-6 w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500" />
              <label className="flex items-center gap-3 mt-4 text-gray-700 cursor-pointer">
                <Upload className="w-5 h-5 text-blue-600" />
                <span>Upload Bank Statement (CSV) — optional</span>
                <input type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" />
              </label>
              <div className="mt-6 flex justify-between">
                <button type="button" onClick={back} className="px-4 py-2 rounded-lg border border-gray-300">Back</button>
                <button type="button" onClick={advance} disabled={!formData.expenses} className="px-4 py-2 rounded-lg bg-blue-700 text-white">Next</button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="text-2xl font-semibold text-blue-700 text-center">Risk appetite?</h2>
              <div className="flex justify-center gap-3 mt-6">
                {(['Low','Medium','High'] as const).map(r => (
                  <button type="button" key={r} onClick={()=>setFormData(v=>({...v, risk: r }))} className={`px-4 py-2 rounded-lg border ${formData.risk===r?'bg-blue-700 text-white':'bg-white text-gray-700 hover:bg-blue-50'}`}>{r}</button>
                ))}
              </div>
              <div className="mt-8 flex justify-between">
                <button type="button" onClick={back} className="px-4 py-2 rounded-lg border border-gray-300">Back</button>
                <button onClick={()=>{ handleSubmit(); }} className="px-4 py-2 rounded-lg bg-green-600 text-white">Generate My Plan</button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [step, setStep] = useState<number>(0);
  const stepsTotal = 6;

  const [formData, setFormData] = useState<FormDataShape>({
    goal: '', target: '', duration: '', income: '', expenses: '', risk: 'Medium'
  });
  const [result, setResult] = useState<ResultShape | null>(null);

  const toNum = (s: string) => {
    const n = parseFloat((s || '0')); 
    return isFinite(n) ? n : 0;
  };

  const projectFV = (monthlyContribution: number, monthlyRate: number, months: number) => (
    monthlyRate > 0
      ? monthlyContribution * ((1 + monthlyRate) ** months - 1) / monthlyRate
      : monthlyContribution * months
  );

  const calculate = (income: number, expenses: number, durationYears: number, risk: FormDataShape['risk']) => {
    const savings = Math.max(0, income - expenses);
    const rC = 0.06, rM = 0.10, rA = 0.14;
    const mC = rC / 12, mM = rM / 12, mA = rA / 12;
    const n = Math.round(durationYears * 12);

    const conservative = Math.round(projectFV(savings, mC, n));
    const moderate = Math.round(projectFV(savings, mM, n));
    const aggressive = Math.round(projectFV(savings, mA, n));

    const projection: ProjectionPoint[] = Array.from({ length: Math.floor(durationYears) + 1 }, (_, y) => {
      const months = y * 12;
      return {
        year: y,
        conservative: Math.round(projectFV(savings, mC, months)),
        moderate: Math.round(projectFV(savings, mM, months)),
        aggressive: Math.round(projectFV(savings, mA, months))
      };
    });

    const investmentSplit: SplitItem[] = [
      { name: 'FD/PPF', value: risk === 'Low' ? 60 : risk === 'Medium' ? 30 : 10 },
      { name: 'SIP/Mutual Funds', value: risk === 'Low' ? 40 : risk === 'Medium' ? 50 : 60 },
      { name: 'Stocks/NPS', value: risk === 'Low' ? 0 : risk === 'Medium' ? 20 : 30 },
    ];

    return { savings, conservative, moderate, aggressive, projection, investmentSplit };
  };

  const handleSubmit = () => {
    const income = toNum(formData.income);
    const expenses = toNum(formData.expenses);
    const durationYears = toNum(formData.duration);
    const calc = calculate(income, expenses, durationYears, formData.risk);
    setResult({ ...calc, target: toNum(formData.target), durationYears, computedAt: Date.now() });
  };

  return (
    <div className="min-h-screen relative bg-gray-950 text-gray-100">
      <Aurora />
      <header className="relative bg-transparent text-white py-10">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight">Finler <span className="text-cyan-300">AI</span></h1>
          <p className="text-lg mt-3 opacity-90">The futuristic planner for India’s investors. Plan in minutes, invest with confidence.</p>
          <div className="mt-6 flex items-center justify-center gap-3 text-sm text-gray-300">
            <span>✨ AI-driven projections</span><span>•</span><span>💰 Tax-aware suggestions</span><span>•</span><span>⏱️ 2-minute setup</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-10 px-4">
        {!result ? (
          <OnboardingWizard
            step={step}
            stepsTotal={stepsTotal}
            formData={formData}
            setFormData={setFormData}
            advance={() => setStep(s => Math.min(stepsTotal - 1, s + 1))}
            back={() => setStep(s => Math.max(0, s - 1))}
            handleCSVUpload={() => {}}
            handleSubmit={handleSubmit}
          />
        ) : (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 p-6">
                <CardContent>
                  <h2 className="text-2xl font-semibold text-cyan-300">Projection (3 Scenarios)</h2>
                  <ResponsiveContainer width="100%" height={320}>
                    <LineChart data={result.projection}>
                      <XAxis dataKey="year" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip />
                      <Line type="monotone" dataKey="conservative" stroke="#22d3ee" strokeWidth={3} />
                      <Line type="monotone" dataKey="moderate" stroke="#60a5fa" strokeWidth={3} />
                      <Line type="monotone" dataKey="aggressive" stroke="#facc15" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="p-6">
                <CardContent>
                  <h3 className="text-xl font-semibold text-cyan-300">Investment Split</h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={result.investmentSplit} dataKey="value" nameKey="name" outerRadius={90}>
                        {result.investmentSplit.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      <footer className="text-center py-10 text-gray-400 text-sm border-t border-white/10 mt-10">
        © {new Date().getFullYear()} Finler. Built for Indian Investors 🇮🇳
      </footer>
    </div>
  );
}
