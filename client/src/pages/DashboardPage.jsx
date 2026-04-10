import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { 
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend
} from 'recharts';
import { Wallet, TrendingUp, TrendingDown, Target, Loader2 } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1'];

const DashboardPage = () => {
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
        setError('Failed to fetch dashboard data');
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 mt-1">Here's your financial overview</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <TrendingUp size={64} className="text-emerald-500" />
          </div>
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-slate-500 font-medium tracking-wide text-sm uppercase">Total Income</h3>
          </div>
          <div className="text-3xl font-bold text-slate-800">₹{summary.totalIncome.toLocaleString()}</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <TrendingDown size={64} className="text-rose-500" />
          </div>
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-rose-100 text-rose-600 rounded-xl">
              <TrendingDown size={24} />
            </div>
            <h3 className="text-slate-500 font-medium tracking-wide text-sm uppercase">Total Expenses</h3>
          </div>
          <div className="text-3xl font-bold text-slate-800">₹{summary.totalExpenses.toLocaleString()}</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <Wallet size={64} className="text-indigo-500" />
          </div>
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
              <Wallet size={24} />
            </div>
            <h3 className="text-slate-500 font-medium tracking-wide text-sm uppercase">Net Balance</h3>
          </div>
          <div className="text-3xl font-bold text-slate-800">₹{summary.netBalance.toLocaleString()}</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <Target size={64} className="text-violet-500" />
          </div>
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-violet-100 text-violet-600 rounded-xl">
              <Target size={24} />
            </div>
            <h3 className="text-slate-500 font-medium tracking-wide text-sm uppercase">Savings Rate</h3>
          </div>
          <div className="text-3xl font-bold text-slate-800">{savingsRate}%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expenses by Category Pie Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-1">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Expenses by Category</h3>
          {summary.expensesByCategory.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={summary.expensesByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {summary.expensesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value) => `₹${value}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400">No expense data yet</div>
          )}
        </div>

        {/* Monthly Trend Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Income vs Expenses (6 Months)</h3>
          {summary.monthlyTrend.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary.monthlyTrend} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} tickFormatter={(value) => `₹${value}`} />
                  <RechartsTooltip cursor={{ fill: '#f8fafc' }} formatter={(value) => `₹${value}`} />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400">No trend data yet</div>
          )}
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Recent Transactions</h3>
        {summary.recentTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-sm">
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Description</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium text-right">Amount</th>
                  <th className="pb-3 font-medium text-center">Type</th>
                </tr>
              </thead>
              <tbody>
                {summary.recentTransactions.map((tx) => (
                  <tr key={tx._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="py-4 text-slate-600">
                      {new Date(tx.date).toLocaleDateString('en-GB')}
                    </td>
                    <td className="py-4 text-slate-800 font-medium">
                      {tx.description || 'No description'}
                    </td>
                    <td className="py-4 text-slate-500">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                        {tx.category}
                      </span>
                    </td>
                    <td className={`py-4 text-right font-bold ${tx.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                    </td>
                    <td className="py-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                        tx.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400">No recent transactions found</div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
