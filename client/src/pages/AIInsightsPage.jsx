import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Sparkles, Loader2, ArrowRight } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const AIInsightsPage = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/transactions/summary`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSummary(res.data);
      } catch (err) {
        setError('Failed to load data for AI');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [token]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  if (error) {
    return <div className="text-rose-500 bg-rose-50 p-4 rounded-xl">{error}</div>;
  }

  const savingsRate = summary.totalIncome > 0 
    ? (((summary.totalIncome - summary.totalExpenses) / summary.totalIncome) * 100).toFixed(1)
    : 0;

  const topCategory = [...summary.expensesByCategory].sort((a, b) => b.value - a.value)[0]?.name || 'N/A';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          AI Spending Insights 
          <span className="text-sm font-semibold bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full uppercase tracking-wider">
            Coming Soon
          </span>
        </h1>
        <p className="text-slate-500 mt-1">Powered by Generative AI to understand your habits</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Financial Snapshot</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Total Income</span>
                <span className="font-semibold text-emerald-500">₹{summary.totalIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Total Expenses</span>
                <span className="font-semibold text-rose-500">₹{summary.totalExpenses.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Net Balance</span>
                <span className="font-bold text-indigo-600">₹{summary.netBalance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                <span className="text-slate-500">Savings Rate</span>
                <span className="font-semibold text-violet-500">{savingsRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Top Spend</span>
                <span className="font-semibold text-slate-700">{topCategory}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
             <h3 className="text-lg font-bold text-slate-800 mb-4">Current Breakdown</h3>
             <div className="space-y-3">
                {summary.expensesByCategory.map(cat => (
                  <div key={cat.name} className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">{cat.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-slate-800">₹{cat.value.toLocaleString()}</span>
                      <span className="text-slate-400 text-xs w-8 text-right">
                        {((cat.value / summary.totalExpenses) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
                {summary.expensesByCategory.length === 0 && (
                  <p className="text-slate-400 text-sm text-center py-2">No expenses logged</p>
                )}
             </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {/* Glowing Placeholder Area */}
          <div className="relative h-full min-h-[400px] w-full rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 p-1 overflow-hidden group border border-indigo-100 flex items-center justify-center">
            
            {/* Animated shimmer background */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2.5s_infinite] skew-x-12"></div>
            
            <div className="relative z-10 text-center px-6 max-w-lg">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Sparkles size={40} className="text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-3">AI Analysis Engine</h2>
              <p className="text-slate-500 leading-relaxed mb-6">
                Your spending patterns will be analyzed here. In Phase 2, our AI will generate personalized insights, catch unusual spending, and suggest ways to optimize your finances automatically.
              </p>
              <button disabled className="bg-white border border-slate-200 text-slate-400 rounded-xl px-6 py-3 font-medium flex items-center justify-center mx-auto space-x-2 cursor-not-allowed">
                <span>View Demo Report</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsightsPage;
