import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { BrainCircuit, Loader2 } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const AIBudgetPage = () => {
  const [data, setData] = useState({ summary: null, goals: [] });
  const [loading, setLoading] = useState(true);
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
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [token]);

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
          <span className="text-sm font-semibold bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full uppercase tracking-wider">
            Coming Soon
          </span>
        </h1>
        <p className="text-slate-500 mt-1">Smart budgeting tailored to your goals</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Input Parameters</h3>
            <div className="space-y-3">
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="text-sm font-medium text-slate-500 mb-1">Current Income</div>
                <div className="text-xl font-bold text-emerald-600">₹{data.summary?.totalIncome.toLocaleString()}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="text-sm font-medium text-slate-500 mb-1">Active Goals Map</div>
                {data.goals.map(g => (
                  <div key={g._id} className="flex justify-between items-center text-sm py-1 border-b border-slate-200 last:border-0 mt-2">
                    <span className="text-slate-700 truncate mr-2">{g.title}</span>
                    <span className="font-semibold text-slate-800">₹{g.targetAmount.toLocaleString()}</span>
                  </div>
                ))}
                {data.goals.length === 0 && <span className="text-sm text-slate-400">No active goals</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="h-full min-h-[400px] w-full bg-slate-800 rounded-2xl p-8 relative overflow-hidden flex flex-col items-center justify-center text-center shadow-xl">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-400 via-slate-800 to-slate-900 pointer-events-none"></div>
            
            <BrainCircuit size={64} className="text-emerald-400 mb-6 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
            <h2 className="text-2xl font-bold text-white mb-4">Dynamic Budget Generation</h2>
            <p className="text-slate-300 max-w-lg mb-8 leading-relaxed">
              Your personalized budget plan will be generated here. In Phase 2, the AI will use your income, spending history, and goals to create a step-by-step monthly budget that automatically adapts when your finances change.
            </p>
            
            <div className="flex gap-4">
              <div className="h-2 w-16 bg-slate-600 rounded-full animate-pulse"></div>
              <div className="h-2 w-16 bg-slate-600 rounded-full animate-pulse delay-75"></div>
              <div className="h-2 w-16 bg-slate-600 rounded-full animate-pulse delay-150"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIBudgetPage;
