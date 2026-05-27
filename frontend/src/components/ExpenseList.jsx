import { motion, AnimatePresence } from 'framer-motion'

const CATEGORY_ICONS = {
  Food: '🍕', Transport: '🚗', Accommodation: '🏠',
  Entertainment: '🎬', Utilities: '💡', Shopping: '🛍️', General: '📦'
}

const CATEGORY_COLORS = {
  Food: '#fbcfe8', Transport: '#c7d2fe', Accommodation: '#ddd6fe',
  Entertainment: '#fde68a', Utilities: '#bae6fd', Shopping: '#fecdd3', General: '#e5e7eb'
}

export default function ExpenseList({ expenses, onRemove }) {
  const total = expenses.reduce((s, e) => s + parseFloat(e.amount || 0), 0)

  return (
    <div className="glass rounded-2xl p-6 flex h-full flex-col">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-lg">📋</span>
        <h2 className="text-[#2b124c] font-semibold text-xl">Expense History</h2>
        <span className="ml-auto text-base font-semibold text-[#2b124c]">
          ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        <AnimatePresence>
          {expenses.length === 0 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-[#5d6b6b] text-sm text-center py-12 font-medium">
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
                  style={{ background: `${color}33`, border: `1px solid ${color}55` }}>
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[#2b124c] text-base font-semibold truncate">{exp.description}</div>
                  <div className="text-[#5d6b6b] text-xs font-medium">{exp.payer} • {exp.category}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-[#2b124c] font-bold text-base">
                    ₹{parseFloat(exp.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <button
                    onClick={() => onRemove(exp.id)}
                    className="text-[#7a8190] hover:text-[#2b124c] text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all"
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
