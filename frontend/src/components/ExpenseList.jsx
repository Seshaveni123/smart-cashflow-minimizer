import { motion, AnimatePresence } from 'framer-motion'

const CATEGORY_ICONS = {
  Food: '🍕', Transport: '🚗', Accommodation: '🏠',
  Entertainment: '🎬', Utilities: '💡', Shopping: '🛍️', General: '📦'
}

const CATEGORY_COLORS = {
  Food: '#f59e0b', Transport: '#3b82f6', Accommodation: '#10b981',
  Entertainment: '#8b5cf6', Utilities: '#06b6d4', Shopping: '#ec4899', General: '#6b7280'
}

export default function ExpenseList({ expenses, onRemove }) {
  const total = expenses.reduce((s, e) => s + parseFloat(e.amount || 0), 0)

  return (
    <div className="glass rounded-2xl p-6 flex flex-col">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-lg">📋</span>
        <h2 className="text-white font-semibold text-lg">Expense History</h2>
        <span className="ml-auto text-sm font-semibold text-blue-400">
          ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 max-h-96 pr-1">
        <AnimatePresence>
          {expenses.length === 0 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-gray-600 text-sm text-center py-12">
              No expenses added yet.
            </motion.p>
          )}
          {[...expenses].reverse().map((exp) => {
            const icon = CATEGORY_ICONS[exp.category] || '📦'
            const color = CATEGORY_COLORS[exp.category] || '#6b7280'
            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-3 p-3 glass rounded-xl group"
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                  style={{ background: `${color}22`, border: `1px solid ${color}44` }}>
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium truncate">{exp.description}</div>
                  <div className="text-gray-500 text-xs">{exp.payer} • {exp.category}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-white font-semibold text-sm">
                    ₹{parseFloat(exp.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <button
                    onClick={() => onRemove(exp.id)}
                    className="text-gray-600 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition-all"
                  >
                    Remove
                  </button>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
