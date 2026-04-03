import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  TrendingUp,
  
  DollarSign,
  
  Edit3,
  Plus,
  Trash2,
  ArrowUpRight,
  ArrowDownLeft,
  
  Search,
  BarChart3,
  PieChart as PieChartIcon,
 
  AlertCircle,
  
  
  Menu,
  X,
  Zap,
  Target,
  Wallet,
  CreditCard,
 
  Moon,
  Sun,
  
  
  Home as HomeIcon,
 
} from "lucide-react";
import {
 
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  
  Area,
  ComposedChart,
} from "recharts";

// ============================================
// MOCK DATA - COMPLETE WITH EMOJIS & DETAILS
// ============================================

const MOCK_TRANSACTIONS = [
  {
    id: 1,
    date: "2025-01-20",
    amount: 5000,
    category: "Salary",
    type: "income",
    description: "Monthly Salary - Tech Corp",
    emoji: "💼",
    status: "completed",
  },
  {
    id: 2,
    date: "2025-01-19",
    amount: 120,
    category: "Groceries",
    type: "expense",
    description: "Whole Foods Market",
    emoji: "🛒",
    status: "completed",
  },
  {
    id: 3,
    date: "2025-01-18",
    amount: 850,
    category: "Rent",
    type: "expense",
    description: "Monthly Rent Payment",
    emoji: "🏠",
    status: "completed",
  },
  {
    id: 4,
    date: "2025-01-17",
    amount: 65,
    category: "Food & Dining",
    type: "expense",
    description: "Premium Coffee House",
    emoji: "☕",
    status: "completed",
  },
  {
    id: 5,
    date: "2025-01-16",
    amount: 2500,
    category: "Freelance",
    type: "income",
    description: "Project Payment - Design Work",
    emoji: "🎨",
    status: "completed",
  },
  {
    id: 6,
    date: "2025-01-15",
    amount: 200,
    category: "Utilities",
    type: "expense",
    description: "Electric & Internet Bill",
    emoji: "⚡",
    status: "completed",
  },
  {
    id: 7,
    date: "2025-01-14",
    amount: 150,
    category: "Food & Dining",
    type: "expense",
    description: "Restaurant Dinner",
    emoji: "🍽️",
    status: "completed",
  },
  {
    id: 8,
    date: "2025-01-13",
    amount: 45,
    category: "Transportation",
    type: "expense",
    description: "Uber - Airport Trip",
    emoji: "🚗",
    status: "completed",
  },
  {
    id: 9,
    date: "2025-01-12",
    amount: 300,
    category: "Shopping",
    type: "expense",
    description: "Designer Clothing Store",
    emoji: "👔",
    status: "completed",
  },
  {
    id: 10,
    date: "2025-01-11",
    amount: 1200,
    category: "Investment",
    type: "expense",
    description: "Stock Market Investment",
    emoji: "📈",
    status: "pending",
  },
  {
    id: 11,
    date: "2025-01-10",
    amount: 89,
    category: "Entertainment",
    type: "expense",
    description: "Netflix Premium + Spotify",
    emoji: "🎬",
    status: "completed",
  },
  {
    id: 12,
    date: "2025-01-09",
    amount: 400,
    category: "Healthcare",
    type: "expense",
    description: "Gym Membership & Checkup",
    emoji: "💪",
    status: "completed",
  },
  {
    id: 13,
    date: "2025-01-08",
    amount: 750,
    category: "Travel",
    type: "expense",
    description: "Hotel Booking - Weekend Trip",
    emoji: "✈️",
    status: "completed",
  },
  {
    id: 14,
    date: "2025-01-07",
    amount: 3000,
    category: "Bonus",
    type: "income",
    description: "Performance Bonus",
    emoji: "🎁",
    status: "completed",
  },
  {
    id: 15,
    date: "2025-01-06",
    amount: 55,
    category: "Subscriptions",
    type: "expense",
    description: "Adobe Creative Cloud",
    emoji: "🎯",
    status: "completed",
  },
];

const CATEGORIES = [
  "Salary",
  "Freelance",
  "Bonus",
  "Groceries",
  "Food & Dining",
  "Rent",
  "Utilities",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Healthcare",
  "Travel",
  "Investment",
  "Subscriptions",
];

const CATEGORY_COLORS = {
  Salary: "#10b981",
  Freelance: "#3b82f6",
  Bonus: "#f59e0b",
  Groceries: "#8b5cf6",
  "Food & Dining": "#ec4899",
  Rent: "#f97316",
  Utilities: "#06b6d4",
  Transportation: "#6366f1",
  Shopping: "#d946ef",
  Entertainment: "#14b8a6",
  Healthcare: "#65a30d",
  Travel: "#7c3aed",
  Investment: "#e11d48",
  Subscriptions: "#0891b2",
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

const calculateTotals = (transactions) => {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  return { income, expenses, balance: income - expenses };
};

const calculateSpendingByCategory = (transactions) => {
  const spending = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      spending[t.category] = (spending[t.category] || 0) + t.amount;
    });
  return Object.entries(spending)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

const calculateMonthlyTrend = (transactions) => {
  const months = {};
  transactions.forEach((t) => {
    const date = new Date(t.date);
    const key = `${date.getMonth() + 1}/${date.getDate()}`;
    if (!months[key])
      months[key] = { date: key, income: 0, expenses: 0, balance: 0 };
    if (t.type === "income") months[key].income += t.amount;
    else months[key].expenses += t.amount;
    months[key].balance = months[key].income - months[key].expenses;
  });
  return Object.values(months).sort(
    (a, b) => new Date(`2025-${a.date}`) - new Date(`2025-${b.date}`)
  );
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
};

// ============================================
// MAIN DASHBOARD COMPONENT
// ============================================

export default function FinanceDashboard() {
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [role, setRole] = useState("viewer");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [darkMode, setDarkMode] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    description: "",
    amount: "",
    category: "Groceries",
    type: "expense",
    date: new Date().toISOString().split("T")[0],
    emoji: "📝",
  });

  const filteredTransactions = useMemo(() => {
    let filtered = transactions.filter((t) => {
      const matchesSearch =
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        filterCategory === "all" || t.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, searchTerm, filterCategory]);

  const totals = useMemo(() => calculateTotals(transactions), [transactions]);
  const spendingByCategory = useMemo(
    () => calculateSpendingByCategory(transactions),
    [transactions]
  );
  const monthlyTrend = useMemo(
    () => calculateMonthlyTrend(transactions),
    [transactions]
  );

  const totalExpenses = spendingByCategory.reduce(
    (sum, cat) => sum + cat.value,
    0
  );
  const topCategory = spendingByCategory[0];

  const handleAddTransaction = useCallback(() => {
    if (!newTransaction.description || !newTransaction.amount) return;
    const tx = {
      id: Math.max(...transactions.map((t) => t.id), 0) + 1,
      ...newTransaction,
      amount: parseFloat(newTransaction.amount),
      status: "completed",
    };
    setTransactions([tx, ...transactions]);
    setNewTransaction({
      description: "",
      amount: "",
      category: "Groceries",
      type: "expense",
      date: new Date().toISOString().split("T")[0],
      emoji: "📝",
    });
    setShowAddForm(false);
  }, [transactions, newTransaction]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "dark bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
          : "bg-gradient-to-br from-blue-50 via-white to-slate-50"
      }`}
    >
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes bounce-in {
          0% { opacity: 0; transform: scale(0.9) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        
        .animate-slide-up {
          animation: slideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .animate-slide-in-left {
          animation: slideInLeft 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .animate-slide-in-right {
          animation: slideInRight 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .card-hover {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .card-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }
        
        .dark .card-hover:hover {
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .dark .gradient-text {
          background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .glass-effect {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        
        .dark .glass-effect {
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        
        .gradient-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.7) 100%);
        }
        
        .dark .gradient-card {
          background: linear-gradient(135deg, rgba(30,41,59,0.9) 0%, rgba(15,23,42,0.7) 100%);
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 animate-slide-in-left">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg animate-float">
                <DollarSign className="w-7 h-7 text-white font-bold" />
              </div>
              <div>
                <h1 className="text-2xl font-black gradient-text hidden sm:block">
                  FinanceFlow
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  Smart Money Tracker
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4 animate-slide-in-right">
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                >
                  <option value="viewer">👁️ Viewer</option>
                  <option value="admin">⚙️ Admin</option>
                </select>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2.5 rounded-lg transition-all duration-300 font-semibold flex items-center gap-2 ${
                  darkMode
                    ? "bg-slate-700 hover:bg-slate-600 text-yellow-300 shadow-lg shadow-slate-700/50"
                    : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                }`}
              >
                {darkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
                <span className="text-xs hidden sm:inline">
                  {darkMode ? "Light" : "Dark"}
                </span>
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="mt-4 flex flex-col gap-3 animate-slide-up">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
              >
                <option value="viewer">👁️ Viewer</option>
                <option value="admin">⚙️ Admin</option>
              </select>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-full px-4 py-2 rounded-lg transition-all ${
                  darkMode
                    ? "bg-blue-600 text-white"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Premium Stats Cards */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Wallet,
                label: "Total Balance",
                value: formatCurrency(totals.balance),
                gradient: "from-emerald-400 to-emerald-600",
                delay: 0,
              },
              {
                icon: ArrowDownLeft,
                label: "Total Income",
                value: formatCurrency(totals.income),
                gradient: "from-blue-400 to-blue-600",
                delay: 100,
              },
              {
                icon: ArrowUpRight,
                label: "Total Expenses",
                value: formatCurrency(totals.expenses),
                gradient: "from-red-400 to-red-600",
                delay: 200,
              },
              {
                icon: TrendingUp,
                label: "Avg Expense",
                value: formatCurrency(
                  transactions.filter((t) => t.type === "expense").length > 0
                    ? totals.expenses /
                        transactions.filter((t) => t.type === "expense").length
                    : 0
                ),
                gradient: "from-purple-400 to-purple-600",
                delay: 300,
              },
            ].map((card, idx) => (
              <div
                key={idx}
                style={{ animationDelay: `${card.delay}ms` }}
                className="animate-slide-up"
              >
                <div className="gradient-card card-hover rounded-2xl p-6 border border-slate-200 dark:border-slate-700 group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <p className="text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">
                        {card.label}
                      </p>
                      <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-1">
                        {card.value}
                      </p>
                    </div>
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${card.gradient} p-0.5 shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                    >
                      <div className="w-full h-full rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center">
                        <card.icon className="w-8 h-8 text-slate-900 dark:text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      +12%
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      vs last month
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Charts Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Main Chart - Takes 2 columns on desktop */}
          <div
            className="lg:col-span-2 animate-slide-in-left"
            style={{ animationDelay: "200ms" }}
          >
            <div className="gradient-card card-hover rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                    <BarChart3 className="text-blue-600 dark:text-blue-400 animate-float" />
                    Balance Trend
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Last 15 days performance
                  </p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <ComposedChart data={monthlyTrend}>
                  <defs>
                    <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="expenseGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={darkMode ? "#475569" : "#e2e8f0"}
                  />
                  <XAxis
                    dataKey="date"
                    stroke={darkMode ? "#94a3b8" : "#64748b"}
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis
                    stroke={darkMode ? "#94a3b8" : "#64748b"}
                    style={{ fontSize: "12px" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? "#1e293b" : "#fff",
                      border: `1px solid ${darkMode ? "#475569" : "#e2e8f0"}`,
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="income"
                    fill="url(#incomeGrad)"
                    stroke="#10b981"
                    strokeWidth={3}
                    name="Income"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    fill="url(#expenseGrad)"
                    stroke="#ef4444"
                    strokeWidth={3}
                    name="Expenses"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Spending Breakdown - Right side */}
          <div
            className="animate-slide-in-right"
            style={{ animationDelay: "300ms" }}
          >
            <div className="gradient-card card-hover rounded-2xl p-8 border border-slate-200 dark:border-slate-700 h-full">
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <PieChartIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-float" />
                Spending Breakdown
              </h3>
              {spendingByCategory.length > 0 ? (
                <div className="space-y-4">
                  {spendingByCategory.map((cat, idx) => {
                    const percentage = (cat.value / totalExpenses) * 100;
                    return (
                      <div
                        key={idx}
                        className="group animate-bounce-in"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: CATEGORY_COLORS[cat.name],
                            }}
                          />
                          <span className="text-sm font-semibold text-slate-900 dark:text-white flex-1">
                            {cat.name}
                          </span>
                          <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden group-hover:h-3 transition-all duration-300">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: CATEGORY_COLORS[cat.name],
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-48 text-slate-500">
                  No data
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Insights Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">
            Financial Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: Target,
                label: "Top Category",
                value: topCategory?.name || "N/A",
                subtext: `₹${topCategory?.value || 0}`,
                delay: 0,
              },
              {
                icon: Zap,
                label: "Transactions",
                value: transactions.length,
                subtext: "Total count",
                delay: 100,
              },
              {
                icon: CreditCard,
                label: "Expense Ratio",
                value: `${((totals.expenses / totals.income) * 100).toFixed(
                  1
                )}%`,
                subtext: "Of income",
                delay: 200,
              },
              {
                icon: Wallet,
                label: "Savings Rate",
                value: `${((totals.balance / totals.income) * 100).toFixed(
                  1
                )}%`,
                subtext: "Monthly",
                delay: 300,
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                style={{ animationDelay: `${stat.delay}ms` }}
                className="animate-slide-up"
              >
                <div className="gradient-card card-hover rounded-xl p-5 border border-slate-200 dark:border-slate-700 text-center group">
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <stat.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 uppercase font-bold mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {stat.subtext}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Transactions Section */}
        <section>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 animate-slide-in-left">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Recent Transactions
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Track your spending
              </p>
            </div>
            {role === "admin" && (
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 active:scale-95"
              >
                <Plus className="w-5 h-5" />
                Add
              </button>
            )}
          </div>

          {/* Add Form */}
          {showAddForm && role === "admin" && (
            <div className="animate-slide-up mb-6">
              <div className="gradient-card rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-black mb-4 text-slate-900 dark:text-white">
                  New Transaction
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  <input
                    type="text"
                    placeholder="Description"
                    value={newTransaction.description}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        description: e.target.value,
                      })
                    }
                    className="px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    value={newTransaction.amount}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        amount: e.target.value,
                      })
                    }
                    className="px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  />
                  <select
                    value={newTransaction.category}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        category: e.target.value,
                      })
                    }
                    className="px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <select
                    value={newTransaction.type}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        type: e.target.value,
                      })
                    }
                    className="px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                  <input
                    type="date"
                    value={newTransaction.date}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        date: e.target.value,
                      })
                    }
                    className="px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  />
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleAddTransaction}
                    className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-all duration-300 hover:shadow-lg active:scale-95"
                  >
                    Add Transaction
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 px-4 py-3 bg-slate-300 dark:bg-slate-600 text-slate-900 dark:text-white rounded-lg font-bold transition-all duration-300 hover:shadow-lg active:scale-95"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Search & Filter */}
          <div
            className="gradient-card card-hover rounded-2xl p-5 border border-slate-200 dark:border-slate-700 mb-6 animate-slide-in-right"
            style={{ animationDelay: "100ms" }}
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 min-w-max"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Transactions List */}
          <div className="gradient-card rounded-2xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700 overflow-hidden">
            {filteredTransactions.length > 0 ? (
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredTransactions.map((tx, idx) => {
                  const isIncome = tx.type === "income";
                  return (
                    <div
                      key={tx.id}
                      className="animate-bounce-in"
                      style={{ animationDelay: `${idx * 30}ms` }}
                    >
                      <div className="group flex items-center gap-4 p-5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-300 cursor-pointer">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 ${
                            isIncome
                              ? "bg-emerald-100 dark:bg-emerald-900/30"
                              : "bg-red-100 dark:bg-red-900/30"
                          }`}
                        >
                          {tx.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 dark:text-white truncate">
                            {tx.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold">
                              {tx.category}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {formatDate(tx.date)}
                            </span>
                            {tx.status === "pending" && (
                              <span className="text-xs px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-semibold animate-pulse">
                                Pending
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 flex-shrink-0">
                          <p
                            className={`text-lg font-black tabular-nums ${
                              isIncome
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-slate-900 dark:text-white"
                            }`}
                          >
                            {isIncome ? "+" : "-"}
                            {formatCurrency(tx.amount)}
                          </p>
                          {role === "admin" && (
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <button className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-300 active:scale-90">
                                <Edit3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              </button>
                              <button
                                onClick={() =>
                                  setTransactions(
                                    transactions.filter((t) => t.id !== tx.id)
                                  )
                                }
                                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors duration-300 active:scale-90"
                              >
                                <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-16 text-slate-500 animate-pulse">
                <AlertCircle className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-lg font-bold">No transactions found</p>
                <p className="text-sm">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-700 mt-16 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              © 2025 FinanceFlow Pro. Made with ❤️
            </p>
            <div className="flex gap-6">
              <button className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-300">
                Privacy
              </button>
              <button className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-300">
                Terms
              </button>
              <button className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-300">
                Contact
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
