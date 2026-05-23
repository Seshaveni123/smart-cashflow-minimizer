/**
 * Smart Cash Flow Minimizer - Main App
 * Enhanced: Demo Data, Algorithm Explainer, DSA Panel,
 *           Optimization Comparison, improved Graph + Export
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import AnalyticsCards from './components/AnalyticsCards'
import ParticipantsPanel from './components/ParticipantsPanel'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import ResultsPanel from './components/ResultsPanel'
import GraphView from './components/GraphView'
import PieChartPanel from './components/PieChartPanel'
import OptimizationComparison from './components/OptimizationComparison'
import { AlgorithmExplainer, DSAInfoPanel } from './components/AlgorithmExplainer'

/* ─── Demo preset (Feature 6) ───────────────────────────── */
const DEMO_PARTICIPANTS = ['Alice', 'Bob', 'Charlie', 'David']
const DEMO_EXPENSES_TEMPLATE = [
  { description: 'Hotel booking', amount: '4000', payer: 'Alice',   category: 'Accommodation' },
  { description: 'Food & dinner', amount: '2000', payer: 'Bob',     category: 'Food' },
  { description: 'Petrol costs',  amount: '1000', payer: 'Charlie', category: 'Transport' },
]

export default function App() {
  const [participants, setParticipants] = useState([])
  const [expenses, setExpenses]         = useState([])
  const [results, setResults]           = useState(null)
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState('')
  const [activeTab, setActiveTab]       = useState('dashboard')

  const addParticipant = (name) => {
    const t = name.trim()
    if (!t || participants.includes(t)) return
    setParticipants(p => [...p, t]); setResults(null)
  }
  const removeParticipant = (name) => {
    setParticipants(p => p.filter(x => x !== name))
    setExpenses(e => e.filter(x => x.payer !== name)); setResults(null)
  }
  const addExpense = (expense) => {
    setExpenses(e => [...e, { ...expense, id: Date.now() + Math.random() }]); setResults(null)
  }
  const removeExpense = (id) => {
    setExpenses(e => e.filter(x => x.id !== id)); setResults(null)
  }

  const calculate = async (parts, exps) => {
    const p = parts ?? participants
    const e = exps  ?? expenses
    if (p.length < 2) { setError('Add at least 2 participants.'); return }
    if (e.length === 0) { setError('Add at least one expense.'); return }
    setError(''); setLoading(true)
    try {
      const res = await fetch('/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participants: p, expenses: e }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Calculation failed')
      setResults(data); setActiveTab('results')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const reset = async () => {
    try { await fetch('/reset', { method: 'POST' }) } catch (_) {}
    setParticipants([]); setExpenses([]); setResults(null); setError(''); setActiveTab('dashboard')
  }

  /* Feature 6: load demo data then auto-calculate */
  const loadDemo = async () => {
    setError('')
    const demoExps = DEMO_EXPENSES_TEMPLATE.map((e, i) => ({ ...e, id: Date.now() + i }))
    setParticipants(DEMO_PARTICIPANTS)
    setExpenses(demoExps)
    await calculate(DEMO_PARTICIPANTS, demoExps)
  }

  const tabs = [
    { id: 'dashboard', label: '🏠 Dashboard'  },
    { id: 'expenses',  label: '💳 Expenses'   },
    { id: 'results',   label: '⚡ Settlements' },
    { id: 'graph',     label: '🔗 Graph'       },
    { id: 'insights',  label: '🧠 Insights'    },
  ]

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg,#0a0e1a 0%,#0f1629 50%,#0a1628 100%)' }}>
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle,#3b82f6,transparent 70%)' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle,#8b5cf6,transparent 70%)' }} />
        <div className="absolute top-[40%] left-[50%] w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle,#06b6d4,transparent 70%)', transform: 'translate(-50%,-50%)' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Header onReset={reset} />

        {/* Tab nav + Demo button */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div className="flex gap-1 glass rounded-2xl p-1.5 flex-wrap">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'btn-primary text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Feature 6 button */}
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={loadDemo} disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', boxShadow: '0 4px 15px rgba(245,158,11,0.3)' }}
          >
            🎯 Load Demo Data
          </motion.button>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-6 px-4 py-3 rounded-xl text-sm text-red-300 glass"
              style={{ border: '1px solid rgba(239,68,68,0.3)' }}>
              ⚠️ {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {/* DASHBOARD */}
          {activeTab === 'dashboard' && (
            <motion.div key="dashboard"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              <AnalyticsCards participants={participants} expenses={expenses} results={results} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <ParticipantsPanel participants={participants} onAdd={addParticipant} onRemove={removeParticipant} expenses={expenses} />
                <ExpenseForm participants={participants} onAdd={addExpense} />
              </div>
              <motion.div className="mt-8 flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => calculate()} disabled={loading}
                  className="btn-primary text-white font-semibold px-12 py-4 rounded-2xl text-lg flex items-center gap-3 disabled:opacity-50"
                >
                  {loading
                    ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Calculating...</>
                    : <>⚡ Minimize Transactions</>}
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {/* EXPENSES */}
          {activeTab === 'expenses' && (
            <motion.div key="expenses"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ExpenseForm participants={participants} onAdd={addExpense} />
                <ExpenseList expenses={expenses} onRemove={removeExpense} />
              </div>
              {results?.analytics?.category_totals && Object.keys(results.analytics.category_totals).length > 0 && (
                <div className="mt-6">
                  <PieChartPanel categoryTotals={results.analytics.category_totals} />
                </div>
              )}
            </motion.div>
          )}

          {/* RESULTS */}
          {activeTab === 'results' && (
            <motion.div key="results"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              <div className="space-y-6">
                {results?.analytics && (
                  <OptimizationComparison analytics={results.analytics} participants={participants} />
                )}
                <ResultsPanel
                  results={results}
                  onCalculate={() => calculate()}
                  loading={loading}
                  expenses={expenses}
                  participants={participants}
                />
              </div>
            </motion.div>
          )}

          {/* GRAPH */}
          {activeTab === 'graph' && (
            <motion.div key="graph"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              <GraphView results={results} participants={participants} expenses={expenses} />
            </motion.div>
          )}

          {/* INSIGHTS */}
          {activeTab === 'insights' && (
            <motion.div key="insights"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              <div className="space-y-6">
                <AlgorithmExplainer />
                <DSAInfoPanel />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
