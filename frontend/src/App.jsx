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
    <div
      className="relative flex min-h-screen w-screen flex-col overflow-x-hidden text-[#2b124c]"
      style={{
        background:
          'radial-gradient(circle at 12% 14%, rgba(124,58,237,0.18), transparent 22%), radial-gradient(circle at 86% 12%, rgba(6,182,212,0.18), transparent 20%), radial-gradient(circle at 72% 80%, rgba(236,72,153,0.16), transparent 24%), radial-gradient(circle at 18% 82%, rgba(250,204,21,0.12), transparent 26%), linear-gradient(135deg, #f7fbff 0%, #f4f7fb 40%, #fff7fb 100%)',
      }}
    >
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-18%] left-[-10%] w-96 h-96 rounded-full opacity-35 float-soft"
          style={{ background: 'radial-gradient(circle,rgba(124,58,237,0.45),transparent 68%)', filter: 'blur(4px)' }} />
        <div className="absolute top-[10%] right-[-8%] w-[28rem] h-[28rem] rounded-full opacity-30 float-soft"
          style={{ background: 'radial-gradient(circle,rgba(6,182,212,0.42),transparent 68%)', animationDelay: '2s', filter: 'blur(6px)' }} />
        <div className="absolute bottom-[-18%] right-[10%] w-[26rem] h-[26rem] rounded-full opacity-26 float-soft"
          style={{ background: 'radial-gradient(circle,rgba(236,72,153,0.34),transparent 68%)', animationDelay: '4s', filter: 'blur(10px)' }} />
        <div className="absolute top-[42%] left-[48%] w-72 h-72 rounded-full opacity-18 pulse-glow"
          style={{ background: 'radial-gradient(circle,rgba(250,204,21,0.28),transparent 68%)', transform: 'translate(-50%,-50%)' }} />
      </div>

      <main className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 min-h-0 flex-col px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 xl:px-12">
        <Header onReset={reset} />

        {/* Tab nav + Demo button */}
        <div className="mb-6 flex w-full flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5 glass-strong rounded-2xl p-1.5 shadow-[0_18px_38px_rgba(43,18,76,0.12)]">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'btn-primary text-white shadow-[0_14px_30px_rgba(124,58,237,0.24)] scale-[1.02]'
                    : 'text-[#5f6472] hover:text-[#22113f] hover:bg-white/86 border border-transparent hover:border-[#7c3aed]/20'
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
            style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899 50%, #06b6d4)', boxShadow: '0 14px 32px rgba(124,58,237,0.24), 0 0 28px rgba(6,182,212,0.20)' }}
          >
            🎯 Load Demo Data
          </motion.button>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-6 px-4 py-3 rounded-xl text-sm glass"
              style={{ border: '1px solid rgba(124,58,237,0.18)', color: '#7c3aed', background: 'rgba(255,255,255,0.92)' }}>
              ⚠️ {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex w-full flex-1 min-h-0 flex-col">
        <AnimatePresence mode="wait">
          {/* DASHBOARD */}
          {activeTab === 'dashboard' && (
            <motion.div key="dashboard"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
              className="flex w-full flex-1 min-h-0 flex-col">
              <AnalyticsCards participants={participants} expenses={expenses} results={results} />
              <div className="mt-6 grid flex-1 grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
                <ParticipantsPanel participants={participants} onAdd={addParticipant} onRemove={removeParticipant} expenses={expenses} />
                <ExpenseForm participants={participants} onAdd={addExpense} />
              </div>
              <motion.div className="mt-8 flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => calculate()} disabled={loading}
                  className="btn-primary text-white font-semibold px-12 py-4 rounded-2xl text-lg flex items-center gap-3 disabled:opacity-50 shadow-[0_18px_36px_rgba(124,58,237,0.24)]"
                >
                  {loading
                    ? <><div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Calculating...</>
                    : <>⚡ Minimize Transactions</>}
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {/* EXPENSES */}
          {activeTab === 'expenses' && (
            <motion.div key="expenses"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
              className="flex w-full flex-1 min-h-0 flex-col">
              <div className="grid flex-1 grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
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
              exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
              className="flex w-full flex-1 min-h-0 flex-col">
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
              exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
              className="flex w-full flex-1 min-h-0 flex-col">
              <GraphView results={results} participants={participants} expenses={expenses} />
            </motion.div>
          )}

          {/* INSIGHTS */}
          {activeTab === 'insights' && (
            <motion.div key="insights"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
              className="flex w-full flex-1 flex-col">
              <div className="space-y-6">
                <AlgorithmExplainer />
                <DSAInfoPanel />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
