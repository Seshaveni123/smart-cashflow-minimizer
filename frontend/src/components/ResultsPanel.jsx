import { motion, AnimatePresence } from 'framer-motion'

export default function ResultsPanel({ results, onCalculate, loading }) {
  if (!results) {
    return (
      <div className="glass rounded-2xl p-12 text-center">
        <div className="text-6xl mb-4">⚡</div>
        <h3 className="text-white font-semibold text-xl mb-2">No Results Yet</h3>
        <p className="text-gray-500 text-sm mb-6">Add participants & expenses, then calculate.</p>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={onCalculate} disabled={loading}
          className="btn-primary text-white px-8 py-3 rounded-xl font-semibold"
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
          { label: 'Total Expenses', value: `₹${analytics.total_expenses}`, color: '#3b82f6' },
          { label: 'Equal Share', value: `₹${analytics.equal_share}`, color: '#8b5cf6' },
          { label: 'Transactions', value: analytics.num_transactions, color: '#06b6d4' },
          { label: 'Reduced', value: analytics.transactions_reduced, color: '#10b981' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="glass rounded-xl p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-gray-500 text-xs mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Optimized Settlements */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span>⚡</span>
              <h3 className="text-white font-semibold">Optimized Settlements</h3>
            </div>
            <span className="text-xs text-gray-500 glass px-2 py-0.5 rounded-full">
              {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
            </span>
          </div>

          {transactions.length === 0 ? (
            <p className="text-green-400 text-center py-8 text-sm">
              ✅ Everyone is already settled!
            </p>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {transactions.map((t, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="flex items-center gap-3 p-4 rounded-xl"
                    style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
                        {t.from.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-white text-sm font-medium truncate">{t.from}</div>
                    </div>
                    <div className="flex items-center gap-2 text-blue-400 flex-shrink-0">
                      <span className="text-xs">pays</span>
                      <span className="font-bold text-white text-sm px-2 py-1 rounded-lg"
                        style={{ background: 'rgba(59,130,246,0.2)' }}>
                        ₹{t.amount}
                      </span>
                      <span className="text-xs">to</span>
                    </div>
                    <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
                      <div className="text-white text-sm font-medium truncate text-right">{t.to}</div>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
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
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <span>⚖️</span>
            <h3 className="text-white font-semibold">Balance Summary</h3>
          </div>
          <div className="space-y-2.5">
            {Object.entries(balances)
              .sort((a, b) => b[1] - a[1])
              .map(([person, bal], i) => {
                const isPositive = bal >= 0
                const pct = Math.abs(bal) / (Object.values(balances).reduce((s, v) => s + Math.abs(v), 0) / 2 || 1) * 100
                return (
                  <motion.div key={person} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ background: isPositive ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#ef4444,#dc2626)' }}>
                      {person.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-white text-sm truncate">{person}</span>
                        <span className={`text-sm font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                          {isPositive ? '+' : ''}₹{bal.toFixed(2)}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(pct, 100)}%` }}
                          transition={{ delay: i * 0.05 + 0.2, duration: 0.6, ease: 'easeOut' }}
                          className="h-full rounded-full"
                          style={{ background: isPositive ? '#10b981' : '#ef4444' }}
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
            className="mt-5 w-full py-2.5 rounded-xl text-sm font-medium text-gray-300 transition-all"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            📥 Export Settlement Report
          </motion.button>
        </div>
      </div>
    </div>
  )
}
