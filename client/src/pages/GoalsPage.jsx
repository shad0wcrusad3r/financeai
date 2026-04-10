import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Target, Plus, Edit2, Trash2, Loader2, X } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const CATEGORIES = ['Emergency Fund', 'Vacation', 'Gadget', 'Education', 'Investment', 'Other'];

const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    currentAmount: 0,
    deadline: new Date().toISOString().split('T')[0],
    category: 'Emergency Fund'
  });

  const { token } = useContext(AuthContext);

  const fetchGoals = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/goals`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGoals(res.data);
    } catch (err) {
      setError('Failed to fetch goals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [token]);

  const handleOpenModal = (goal = null) => {
    if (goal) {
      setEditingId(goal._id);
      setFormData({
        title: goal.title,
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        deadline: new Date(goal.deadline).toISOString().split('T')[0],
        category: goal.category
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        targetAmount: '',
        currentAmount: 0,
        deadline: new Date().toISOString().split('T')[0],
        category: 'Emergency Fund'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/goals/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/goals`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      handleCloseModal();
      fetchGoals();
    } catch (err) {
      alert('Failed to save goal');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/goals/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchGoals();
      } catch (err) {
        alert('Failed to delete goal');
      }
    }
  };

  if (loading && goals.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Financial Goals</h1>
          <p className="text-slate-500 mt-1">Track and manage your savings goals</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-md shadow-indigo-200"
        >
          <Plus size={20} />
          <span>Add Goal</span>
        </button>
      </div>

      {error ? (
        <div className="text-rose-500 bg-rose-50 p-4 rounded-xl">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const completion = Math.min(((goal.currentAmount / goal.targetAmount) * 100), 100).toFixed(0);
            
            let barColor = "bg-rose-500";
            if (completion >= 30 && completion <= 70) barColor = "bg-amber-400";
            if (completion > 70) barColor = "bg-emerald-500";

            return (
              <div key={goal._id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative group overflow-hidden">
                <div className="absolute top-4 right-4 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleOpenModal(goal)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 bg-white shadow-sm rounded-lg"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(goal._id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 bg-white shadow-sm rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Target size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 line-clamp-1 pr-16">{goal.title}</h3>
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-wide">
                      {goal.category}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-end mb-2">
                  <div>
                    <div className="text-2xl font-bold text-slate-800">
                      ₹{goal.currentAmount.toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-500 font-medium">
                      of ₹{goal.targetAmount.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-700">{completion}%</div>
                  </div>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-2.5 mb-4 overflow-hidden">
                  <div className={`h-2.5 rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${completion}%` }}></div>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Deadline:</span>
                  <span className="font-semibold text-slate-700">
                    {new Date(goal.deadline).toLocaleDateString('en-GB')}
                  </span>
                </div>
                
                {goal.targetAmount > goal.currentAmount && (
                  <div className="text-xs text-slate-400 text-center mt-4 pt-4 border-t border-slate-50">
                    ₹{(goal.targetAmount - goal.currentAmount).toLocaleString()} remaining
                  </div>
                )}
                {goal.targetAmount <= goal.currentAmount && (
                  <div className="text-xs text-emerald-500 font-bold uppercase tracking-wider text-center mt-4 pt-4 border-t border-slate-50">
                    Goal Reached!
                  </div>
                )}
              </div>
            );
          })}
          
          {goals.length === 0 && (
            <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm border-dashed">
              <Target size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-800">No goals set</h3>
              <p className="text-slate-500 mt-1">Start saving for your dreams today.</p>
              <button 
                onClick={() => handleOpenModal()} 
                className="mt-6 text-indigo-600 font-medium hover:text-indigo-800"
              >
                Create your first goal &rarr;
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">
                {editingId ? 'Edit Goal' : 'Add Goal'}
              </h2>
              <button 
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full p-1 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Goal Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  required
                  placeholder="e.g. Dream Vacation"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Target Amount</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-slate-500 font-semibold">₹</span>
                    </div>
                    <input
                      type="number"
                      name="targetAmount"
                      value={formData.targetAmount}
                      onChange={handleFormChange}
                      required
                      min="1"
                      className="pl-8 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Current Saved</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-slate-500 font-semibold">₹</span>
                    </div>
                    <input
                      type="number"
                      name="currentAmount"
                      value={formData.currentAmount}
                      onChange={handleFormChange}
                      min="0"
                      className="pl-8 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Target Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-200 transition-colors"
                >
                  {editingId ? 'Save Changes' : 'Add Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsPage;
