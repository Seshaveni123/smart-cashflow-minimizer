import { motion, AnimatePresence } from 'framer-motion'

export default function ResultsPanel({ results, onCalculate, loading }) {
  if (!results) {
    return (
      <div className="glass rounded-2xl p-12 text-center">
        <div className="text-6xl mb-4">⚡</div>
        <h3 className="text-[#2b124c] font-semibold text-2xl mb-2">No Results Yet</h3>
        <p className="text-[#5d6b6b] text-base mb-6 font-medium">Add participants & expenses, then calculate.</p>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={onCalculate} disabled={loading}
          className="btn-primary text-[#2b124c] px-8 py-3 rounded-xl font-semibold"
        >
          {loading ? 'Calculating...' : 'Calculate Now'}
        </motion.button>
      </div>
    )
  }

  const { transactions, balances, analytics } = results

  // Export as text
  const exportReport = () => {
    const lines = [
      'Smart Cash Flow Minimizer - Settlement Report',
      '='.repeat(50),
      `Total Expenses: ₹${analytics.total_expenses}`,
      `Equal Share: ₹${analytics.equal_share}`,
      `Participants: ${analytics.num_participants}`,
      `Optimized Transactions: ${analytics.num_transactions}`,
      '',
      'SETTLEMENTS:',
      ...transactions.map((t, i) => `${i + 1}. ${t.from} → ${t.to}: ₹${t.amount}`),
      '',
      'BALANCES:',
      ...Object.entries(balances).map(([p, b]) => `${p}: ${b >= 0 ? '+' : ''}₹${b}`)
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'settlement-report.txt'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Summary row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Expenses', value: `₹${analytics.total_expenses}`, color: '#2b124c' },
          { label: 'Equal Share', value: `₹${analytics.equal_share}`, color: '#522b5b' },
          { label: 'Transactions', value: analytics.num_transactions, color: '#854f6c' },
          { label: 'Reduced', value: analytics.transactions_reduced, color: '#5d6b6b' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="glass rounded-xl p-4 text-center">
            <div className="text-3xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[#5d6b6b] text-sm mt-1 font-semibold">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Optimized Settlements */}
        <div className="glass rounded-2xl p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span>⚡</span>
              <h3 className="text-[#2b124c] font-semibold text-xl">Optimized Settlements</h3>
            </div>
            <span className="text-xs text-[#5d6b6b] glass px-2 py-0.5 rounded-full font-medium">
              {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
            </span>
          </div>

          {transactions.length === 0 ? (
            <p className="text-[#5d6b6b] text-center py-8 text-sm font-medium">
              ✅ Everyone is already settled!
            </p>
          ) : (
            <div className="flex-1 space-y-3">
              <AnimatePresence>
                {transactions.map((t, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="flex items-center gap-3 p-4 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(43,18,76,0.08)' }}>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-[#2b124c] flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, rgba(109,40,217,0.18), rgba(255,255,255,0.94) 70%)' }}>
                        {t.from.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-[#2b124c] text-sm font-medium truncate">{t.from}</div>
                    </div>
                    <div className="flex items-center gap-2 text-[#5d6b6b] flex-shrink-0">
                      <span className="text-xs">pays</span>
                      <span className="font-bold text-[#2b124c] text-sm px-2 py-1 rounded-lg"
                        style={{ background: 'rgba(255,255,255,0.98)', border: '1px solid rgba(43,18,76,0.10)' }}>
                        ₹{t.amount}
                      </span>
                      <span className="text-xs">to</span>
                    </div>
                    <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
                      <div className="text-[#2b124c] text-sm font-medium truncate text-right">{t.to}</div>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-[#2b124c] flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.18), rgba(255,255,255,0.94) 70%)' }}>
                        {t.to.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Balance Summary */}
        <div className="glass rounded-2xl p-6 h-full flex flex-col">
          <div className="flex items-center gap-2 mb-5">
            <span>⚖️</span>
            <h3 className="text-[#2b124c] font-semibold text-xl">Balance Summary</h3>
          </div>
          <div className="flex-1 space-y-2.5">
            {Object.entries(balances)
              .sort((a, b) => b[1] - a[1])
              .map(([person, bal], i) => {
                const isPositive = bal >= 0
                const pct = Math.abs(bal) / (Object.values(balances).reduce((s, v) => s + Math.abs(v), 0) / 2 || 1) * 100
                return (
                  <motion.div key={person} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-[#2b124c] flex-shrink-0"
                      style={{ background: isPositive ? 'linear-gradient(135deg, rgba(109,40,217,0.18), rgba(255,255,255,0.94) 72%)' : 'linear-gradient(135deg, rgba(124,58,237,0.18), rgba(255,255,255,0.94) 72%)' }}>
                      {person.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[#2b124c] text-base font-semibold truncate">{person}</span>
                        <span className={`text-sm font-semibold ${isPositive ? 'text-[#6d28d9]' : 'text-[#7c3aed]'}`}>
                          {isPositive ? '+' : ''}₹{bal.toFixed(2)}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[#d5e5e5]/50 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(pct, 100)}%` }}
                          transition={{ delay: i * 0.05 + 0.2, duration: 0.6, ease: 'easeOut' }}
                          className="h-full rounded-full"
                          style={{ background: isPositive ? 'rgba(37,99,235,0.88)' : 'rgba(124,58,237,0.88)' }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )
              })}
          </div>

          {/* Export button */}
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={exportReport}
            className="mt-5 w-full py-2.5 rounded-xl text-sm font-medium text-[#5d6b6b] transition-all"
            style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(43,18,76,0.12)', boxShadow: '0 12px 24px rgba(43,18,76,0.08)' }}
          >
            📥 Export Settlement Report
          </motion.button>
        </div>
      </div>
    </div>
  )
}
