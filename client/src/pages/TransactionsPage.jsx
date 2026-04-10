import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Filter, Loader2, X, Receipt } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'];
const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Utilities', 'Rent', 'Education', 'Other'];
const PAYMENT_METHODS = ['Cash', 'UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Other'];

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: 'Food',
    description: '',
    paymentMethod: 'Cash',
    date: new Date().toISOString().split('T')[0]
  });

  // Filters
  const [filters, setFilters] = useState({ type: '', category: '' });

  const { token } = useContext(AuthContext);

  const fetchTransactions = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.category) queryParams.append('category', filters.category);

      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/transactions?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(res.data);
    } catch (err) {
      setError('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filters, token]);

  const handleOpenModal = (tx = null) => {
    if (tx) {
      setEditingId(tx._id);
      setFormData({
        type: tx.type,
        amount: tx.amount,
        category: tx.category,
        description: tx.description || '',
        paymentMethod: tx.paymentMethod || 'Cash',
        date: new Date(tx.date).toISOString().split('T')[0]
      });
    } else {
      setEditingId(null);
      setFormData({
        type: 'expense',
        amount: '',
        category: 'Food',
        description: '',
        paymentMethod: 'Cash',
        date: new Date().toISOString().split('T')[0]
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-update category when type changes
    if (name === 'type') {
      setFormData({
        ...formData,
        type: value,
        category: value === 'income' ? 'Salary' : 'Food'
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/transactions/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/transactions`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      handleCloseModal();
      fetchTransactions();
    } catch (err) {
      alert('Failed to save transaction');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/transactions/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchTransactions();
      } catch (err) {
        alert('Failed to delete transaction');
      }
    }
  };

  if (loading && transactions.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  const activeCategories = formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Transactions</h1>
          <p className="text-slate-500 mt-1">Manage your income and expenses</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-md shadow-indigo-200"
        >
          <Plus size={20} />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="flex items-center text-slate-500">
          <Filter size={18} className="mr-2" />
          <span className="font-medium mr-2">Filters:</span>
        </div>
        <select
          className="bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select
          className="bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">All Categories</option>
          {INCOME_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {(filters.type || filters.category) && (
          <button 
            onClick={() => setFilters({ type: '', category: '' })}
            className="text-sm font-medium text-slate-400 hover:text-rose-500 flex items-center"
          >
            <X size={16} className="mr-1" /> Clear
          </button>
        )}
      </div>

      {error ? (
        <div className="text-rose-500 bg-rose-50 p-4 rounded-xl">{error}</div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-100 text-slate-500 text-sm">
                    <th className="p-4 font-semibold uppercase tracking-wider">Date</th>
                    <th className="p-4 font-semibold uppercase tracking-wider">Type</th>
                    <th className="p-4 font-semibold uppercase tracking-wider">Category</th>
                    <th className="p-4 font-semibold uppercase tracking-wider">Description</th>
                    <th className="p-4 font-semibold uppercase tracking-wider">Method</th>
                    <th className="p-4 font-semibold uppercase tracking-wider text-right">Amount</th>
                    <th className="p-4 font-semibold uppercase tracking-wider text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 text-slate-600 font-medium">
                        {new Date(tx.date).toLocaleDateString('en-GB')}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                          tx.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="p-4 text-slate-700">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                          {tx.category}
                        </span>
                      </td>
                      <td className="p-4 text-slate-800">{tx.description || '-'}</td>
                      <td className="p-4 text-slate-500 text-sm">{tx.paymentMethod || '-'}</td>
                      <td className={`p-4 text-right font-bold ${tx.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                      </td>
                      <td className="p-4 text-center space-x-2">
                        <button 
                          onClick={() => handleOpenModal(tx)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(tx._id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <Receipt size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-800">No transactions found</h3>
              <p className="text-slate-500 mt-1">Try adjusting your filters or add a new transaction.</p>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">
                {editingId ? 'Edit Transaction' : 'Add Transaction'}
              </h2>
              <button 
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full p-1 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex gap-4">
                <label className="flex-1 cursor-pointer">
                  <input type="radio" name="type" value="expense" checked={formData.type === 'expense'} onChange={handleFormChange} className="peer sr-only" />
                  <div className="text-center p-3 rounded-xl border-2 border-slate-100 peer-checked:border-rose-500 peer-checked:bg-rose-50 peer-checked:text-rose-600 font-semibold text-slate-500 transition-all">
                    Expense
                  </div>
                </label>
                <label className="flex-1 cursor-pointer">
                  <input type="radio" name="type" value="income" checked={formData.type === 'income'} onChange={handleFormChange} className="peer sr-only" />
                  <div className="text-center p-3 rounded-xl border-2 border-slate-100 peer-checked:border-emerald-500 peer-checked:bg-emerald-50 peer-checked:text-emerald-600 font-semibold text-slate-500 transition-all">
                    Income
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-slate-500 font-semibold">₹</span>
                  </div>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleFormChange}
                    required
                    min="0.01"
                    step="0.01"
                    className="pl-8 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  >
                    {activeCategories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                >
                  {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description (Optional)</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="What was this for?"
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
                  {editingId ? 'Save Changes' : 'Add Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsPage;
