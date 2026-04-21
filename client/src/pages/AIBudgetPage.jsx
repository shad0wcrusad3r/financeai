import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { BrainCircuit, Loader2, Play } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const AIBudgetPage = () => {
  const [data, setData] = useState({ summary: null, goals: [] });
  const [loading, setLoading] = useState(true);

  const [goalsInput, setGoalsInput] = useState('');
  const [situationInput, setSituationInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [summaryRes, goalsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/transactions/summary`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/goals`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setData({ summary: summaryRes.data, goals: goalsRes.data });

        // Auto-populate inputs based on the user's data
        const mappedGoals = goalsRes.data.map(g => `${g.title} (Target: ₹${g.targetAmount})`).join(', ');
        setGoalsInput(mappedGoals || 'I want to save more money.');

        setSituationInput(`I have a total income of ₹${summaryRes.data.totalIncome}.`);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [token]);

  const handleGeneratePlan = async () => {
    if (!goalsInput.trim() || !situationInput.trim()) return;

    setAiLoading(true);
    setAiResult('');
    setErrorMsg('');

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/ai/budget-plan`,
        { financial_goals: goalsInput, current_situation: situationInput },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAiResult(res.data.output);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.error || 'Failed to communicate with AI server. Please check configurations.');
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          AI Budget Planner
          <span className="text-sm font-semibold bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full uppercase tracking-wider">
            Active
          </span>
        </h1>
        <p className="text-slate-500 mt-1">Smart budgeting tailored to your goals powered by Deepseek R1</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
            <h3 className="text-lg font-bold text-slate-800">Your AI Context</h3>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-600 block">Financial Goals</label>
              <textarea
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm resize-none focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                rows={4}
                value={goalsInput}
                onChange={e => setGoalsInput(e.target.value)}
                placeholder="What are your goals?"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-600 block">Current Situation</label>
              <textarea
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm resize-none focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                rows={4}
                value={situationInput}
                onChange={e => setSituationInput(e.target.value)}
                placeholder="Describe your current income and situation..."
              />
            </div>

            <button
              onClick={handleGeneratePlan}
              disabled={aiLoading}
              className="mt-2 w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-70"
            >
              {aiLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Play size={18} fill="currentColor" />
              )}
              {aiLoading ? 'Generating Plan...' : 'Generate Plan'}
            </button>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className={`h-full min-h-[400px] w-full rounded-2xl p-8 relative overflow-hidden flex flex-col shadow-xl border ${aiResult && !aiLoading ? 'bg-white border-slate-200 justify-start' : 'bg-slate-800 border-slate-800 items-center justify-center text-center'}`}>

            {(!aiResult && !aiLoading) && (
              <>
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-400 via-slate-800 to-slate-900 pointer-events-none"></div>
                <BrainCircuit size={64} className="text-emerald-400 mb-6 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
                <h2 className="text-2xl font-bold text-white mb-4">Dynamic Budget Generation</h2>
                <p className="text-slate-300 max-w-lg mb-8 leading-relaxed">
                  Click 'Generate Plan' to create a personalized financial plan. The AI will use your input to create a step-by-step monthly budget that automatically adapts when your finances change.
                </p>
              </>
            )}

            {aiLoading && (
              <div className="flex flex-col items-center justify-center">
                <BrainCircuit size={48} className="text-emerald-400 mb-6 animate-pulse" />
                <div className="flex gap-4">
                  <div className="h-2 w-16 bg-slate-600 rounded-full animate-pulse"></div>
                  <div className="h-2 w-16 bg-slate-600 rounded-full animate-pulse delay-75"></div>
                  <div className="h-2 w-16 bg-slate-600 rounded-full animate-pulse delay-150"></div>
                </div>
              </div>
            )}

            {errorMsg && !aiLoading && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center w-full max-w-md">
                <span className="font-semibold block mb-1">Error Generating Plan</span>
                <span className="text-sm">{errorMsg}</span>
              </div>
            )}

            {aiResult && !aiLoading && (
              <div className="prose prose-slate max-w-none text-sm md:text-base prose-headings:text-slate-800 prose-a:text-emerald-600 bg-white">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiResult}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIBudgetPage;
