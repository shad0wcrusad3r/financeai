import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Bot, Send, Loader2 } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const AIAdvisorPage = () => {
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

  const top3Expenses = [...(data.summary?.expensesByCategory || [])]
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);
    
  const savingsRate = data.summary?.totalIncome > 0 
    ? (((data.summary.totalIncome - data.summary.totalExpenses) / data.summary.totalIncome) * 100).toFixed(1)
    : 0;

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          AI Financial Advisor
          <span className="text-sm font-semibold bg-rose-100 text-rose-600 px-3 py-1 rounded-full uppercase tracking-wider">
            Coming Soon
          </span>
        </h1>
        <p className="text-slate-500 mt-1">Chat directly with your personalized assistant</p>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Context Sidebar */}
        <div className="w-80 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col hidden lg:flex overflow-y-auto">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-slate-100 p-3 rounded-xl">
              <Bot size={24} className="text-slate-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Current Context</h3>
              <p className="text-xs text-slate-500">Data fed to assistant</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="pt-4 border-t border-slate-100">
              <div className="text-sm text-slate-500 mb-1">Net Balance</div>
              <div className="font-semibold text-slate-800">₹{data.summary?.netBalance.toLocaleString()}</div>
            </div>
            <div className="pt-4 border-t border-slate-100">
              <div className="text-sm text-slate-500 mb-1">Savings Rate</div>
              <div className="font-semibold text-slate-800">{savingsRate}%</div>
            </div>
            <div className="pt-4 border-t border-slate-100">
              <div className="text-sm text-slate-500 mb-2">Top 3 Expenses</div>
              {top3Expenses.map(exp => (
                <div key={exp.name} className="flex justify-between items-center text-sm mb-1">
                  <span className="text-slate-600">{exp.name}</span>
                  <span className="font-medium text-slate-800">₹{exp.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-slate-100">
              <div className="text-sm text-slate-500 mb-1">Active Goals</div>
              <div className="font-semibold text-slate-800">{data.goals.length} tracked goals</div>
            </div>
          </div>
        </div>

        {/* Chat Interface Mockup */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col relative overflow-hidden">
          {/* Chat History Area (Placeholder) */}
          <div className="flex-1 p-6 relative overflow-y-auto">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                <Bot size={20} className="text-indigo-600" />
              </div>
              <div className="bg-slate-50 rounded-2xl rounded-tl-none p-4 max-w-lg border border-slate-100 text-slate-700">
                <p>Hello! I have analyzed your financial context. Since you're currently saving for {data.goals.length > 0 ? `"${data.goals[0].title}"` : 'your future'} and your largest expense is {top3Expenses[0]?.name || 'uncategorized'}, I can offer specific advice.</p>
                <p className="mt-2 text-sm text-slate-500 italic">Chat functionality is disabled in Phase 1 and will go live in Phase 2.</p>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50">
            <div className="relative">
              <input
                type="text"
                disabled
                placeholder="Ask me anything about your finances..."
                className="w-full pl-4 pr-12 py-3 bg-white rounded-xl border border-slate-200 text-slate-400 cursor-not-allowed shadow-inner focus:outline-none"
              />
              <button disabled className="absolute right-2 top-2 p-1.5 bg-slate-200 text-white rounded-lg cursor-not-allowed">
                <Send size={18} />
              </button>
            </div>
            <p className="text-center text-xs text-slate-400 mt-2">Chat functionality coming in Phase 2.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAdvisorPage;
