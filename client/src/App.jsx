import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import PrivateRoute from './components/PrivateRoute';
import Sidebar from './components/Sidebar';
import AuthContext from './context/AuthContext';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import GoalsPage from './pages/GoalsPage';
import AIInsightsPage from './pages/AIInsightsPage';
import AIBudgetPage from './pages/AIBudgetPage';
import AIAdvisorPage from './pages/AIAdvisorPage';

const AppLayout = () => {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="container mx-auto px-6 py-8">
          <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/ai/insights" element={<AIInsightsPage />} />
            <Route path="/ai/budget" element={<AIBudgetPage />} />
            <Route path="/ai/advisor" element={<AIAdvisorPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

function App() {
  const { token } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <RegisterPage />} />
        <Route path="/" element={<PrivateRoute />}>
          <Route path="/*" element={<AppLayout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
