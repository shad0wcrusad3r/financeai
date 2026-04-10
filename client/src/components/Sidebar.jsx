import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { LayoutDashboard, Receipt, Target, Sparkles, BrainCircuit, Bot, LogOut } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-white shadow-xl flex flex-col justify-between h-full border-r border-slate-100">
      <div className="p-6">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
            FinanceAI
          </h1>
        </div>

        <nav className="space-y-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 mt-6">
            Main
          </div>
          <Link
            to="/dashboard"
            className={`flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all ${
              isActive('/dashboard')
                ? 'bg-indigo-50 text-indigo-700 font-medium'
                : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
            }`}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/transactions"
            className={`flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all ${
              isActive('/transactions')
                ? 'bg-indigo-50 text-indigo-700 font-medium'
                : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
            }`}
          >
            <Receipt size={20} />
            <span>Transactions</span>
          </Link>
          <Link
            to="/goals"
            className={`flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all ${
              isActive('/goals')
                ? 'bg-indigo-50 text-indigo-700 font-medium'
                : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
            }`}
          >
            <Target size={20} />
            <span>Goals</span>
          </Link>

          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 mt-8">
            AI Features
          </div>
          <Link
            to="/ai/insights"
            className={`flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all ${
              isActive('/ai/insights')
                ? 'bg-indigo-50 text-indigo-700 font-medium'
                : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
            }`}
          >
            <Sparkles size={20} />
            <span>Insights</span>
          </Link>
          <Link
            to="/ai/budget"
            className={`flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all ${
              isActive('/ai/budget')
                ? 'bg-indigo-50 text-indigo-700 font-medium'
                : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
            }`}
          >
            <BrainCircuit size={20} />
            <span>Budget Planner</span>
          </Link>
          <Link
            to="/ai/advisor"
            className={`flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all ${
              isActive('/ai/advisor')
                ? 'bg-indigo-50 text-indigo-700 font-medium'
                : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
            }`}
          >
            <Bot size={20} />
            <span>Financial Advisor</span>
          </Link>
        </nav>
      </div>

      <div className="p-6 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-700">
              {user?.name || 'User'}
            </span>
          </div>
          <button
            onClick={logout}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
