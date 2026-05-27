/**
 * Feature 3: Collapsible "How Optimization Works" explanation panel
 * Feature 4: DSA Algorithm Details card
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ─── Feature 3: Step-by-step algorithm explainer ────────── */
const STEPS = [
  {
    num: 1,
    icon: '📊',
    title: 'Calculate Net Balances',
    desc: 'For each person: balance = total_paid − equal_share. Positive = creditor, Negative = debtor.',
    code: 'balance[i] = paid[i] − (total / n)',
    color: '#dfb6b2',
  },
  {
    num: 2,
    icon: '🔝',
    title: 'Find Maximum Creditor',
    desc: 'Use a max-heap to extract the person owed the most money (highest positive balance).',
    code: 'creditor = heapq.heappop(max_heap)',
    color: '#fbe4d8',
  },
  {
    num: 3,
    icon: '🔻',
    title: 'Find Maximum Debtor',
    desc: 'Simultaneously extract the person who owes the most money (largest negative balance).',
    code: 'debtor = heapq.heappop(min_heap)',
    color: '#854f6c',
  },
  {
    num: 4,
    icon: '⚖️',
    title: 'Settle Minimum Amount',
    desc: 'Transfer min(|creditor_balance|, |debtor_balance|). Push any remainder back into the heap.',
    code: 'settled = min(credit, debt)\npush remainder back',
    color: '#dfb6b2',
  },
  {
    num: 5,
    icon: '🔄',
    title: 'Repeat Until Zero',
    desc: 'Loop until all balances reach zero. Each iteration produces exactly one optimized transaction.',
    code: 'while creditors and debtors:\n  settle()',
    color: '#522b5b',
  },
]

/* ─── Feature 4: DSA badges ─────────────────────────────── */
const DSA_ITEMS = [
  {
    icon: '🤑',
    title: 'Greedy Algorithm',
    detail: 'Always pick the maximum creditor and debtor at each step for a locally optimal — globally optimal — solution.',
    badge: 'O(n²)',
    color: '#dfb6b2',
  },
  {
    icon: '⛰️',
    title: 'Max Heap / Priority Queue',
    detail: 'Python heapq with negated values acts as a max-heap, enabling O(log n) extraction of extremes.',
    badge: 'O(log n)',
    color: '#854f6c',
  },
  {
    icon: '🕸️',
    title: 'Graph Data Structure',
    detail: 'Participants are nodes; each settlement is a directed weighted edge. Visualized with React Flow.',
    badge: 'O(n + e)',
    color: '#fbe4d8',
  },
  {
    icon: '🏁',
    title: 'Time Complexity',
    detail: 'n participants, each processed at most once per heap operation. Total: O(n log n) for full settlement.',
    badge: 'O(n log n)',
    color: '#dfb6b2',
  },
]

export function AlgorithmExplainer() {
  const [open, setOpen] = useState(false)
  const [activeStep, setActiveStep] = useState(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl overflow-hidden h-full"
    >
      {/* Toggle header */}
      <button
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/60 transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
            style={{ background: 'rgba(247,203,202,0.50)', border: '1px solid rgba(201,215,216,0.60)' }}>
            🧠
          </div>
          <div>
            <div className="text-[#2b124c] font-semibold text-lg">How Optimization Works</div>
            <div className="text-[#5d6b6b] text-sm font-medium">Step-by-step greedy algorithm walkthrough</div>
          </div>
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="text-[#854f6c] text-xl"
        >
          ⌄
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6">
              {/* Connector line */}
              <div className="relative">
        <div className="absolute left-[22px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#d5e5e5]/60 via-[#854f6c]/35 to-transparent" />

                <div className="space-y-3">
                  {STEPS.map((step, i) => (
                    <motion.div
                      key={step.num}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                      onClick={() => setActiveStep(activeStep === i ? null : i)}
                      className="flex gap-4 cursor-pointer group"
                    >
                      {/* Step circle */}
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold z-10 flex-shrink-0 transition-all duration-200"
                        style={{
                          background: `${step.color}22`,
                          border: `2px solid ${step.color}`,
                          boxShadow: activeStep === i ? `0 0 16px ${step.color}88` : 'none',
                        }}
                      >
                        {step.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[#2b124c] font-semibold text-base">{step.title}</span>
                          <span className="text-xs text-[#854f6c] font-semibold">Step {step.num}</span>
                        </div>
                        <p className="text-[#5d6b6b] text-sm leading-relaxed font-medium">{step.desc}</p>

                        <AnimatePresence>
                          {activeStep === i && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <pre
                                className="mt-2 px-3 py-2 rounded-lg text-xs font-mono leading-relaxed"
                                style={{
                                  background: `rgba(255,255,255,0.78)`,
                                  border: `1px solid ${step.color}33`,
                                  color: '#2b124c',
                                  whiteSpace: 'pre-wrap',
                                }}
                              >
                                {step.code}
                              </pre>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─── Feature 4: DSA Info Panel ─────────────────────────── */
export function DSAInfoPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass rounded-2xl p-6 h-full"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
          style={{ background: 'rgba(213,229,229,0.45)', border: '1px solid rgba(133,79,108,0.20)' }}>
          ⚡
        </div>
        <div>
          <h2 className="text-[#2b124c] font-semibold text-xl">Algorithm Details</h2>
          <p className="text-[#5d6b6b] text-sm font-medium">Data structures & complexity</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {DSA_ITEMS.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ scale: 1.02, translateY: -2 }}
            className="p-4 rounded-xl cursor-default transition-all duration-200"
            style={{
              background: `${item.color}0a`,
              border: `1px solid ${item.color}22`,
            }}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{item.icon}</span>
                <span className="text-[#2b124c] font-semibold text-base">{item.title}</span>
              </div>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 font-mono"
                style={{
                  background: `${item.color}22`,
                  color: item.color,
                  border: `1px solid ${item.color}44`,
                  boxShadow: `0 0 8px ${item.color}33`,
                }}
              >
                {item.badge}
              </span>
            </div>
            <p className="text-[#5d6b6b] text-sm leading-relaxed font-medium">{item.detail}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
