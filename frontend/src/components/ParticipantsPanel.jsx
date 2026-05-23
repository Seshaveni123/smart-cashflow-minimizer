import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const AVATAR_COLORS = [
  ['#3b82f6', '#1d4ed8'],
  ['#8b5cf6', '#6d28d9'],
  ['#06b6d4', '#0284c7'],
  ['#10b981', '#059669'],
  ['#f59e0b', '#d97706'],
  ['#ef4444', '#dc2626'],
  ['#ec4899', '#db2777'],
  ['#14b8a6', '#0d9488'],
]

function getColor(idx) {
  return AVATAR_COLORS[idx % AVATAR_COLORS.length]
}

export default function ParticipantsPanel({ participants, onAdd, onRemove, expenses }) {
  const [name, setName] = useState('')

  const handleAdd = () => {
    if (name.trim()) {
      onAdd(name.trim())
      setName('')
    }
  }

  // Compute total paid per person from expenses
  const paid = {}
  for (const p of participants) paid[p] = 0
  for (const e of expenses) {
    if (e.payer in paid) paid[e.payer] += parseFloat(e.amount || 0)
  }

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-lg">👥</span>
        <h2 className="text-white font-semibold text-lg">Participants</h2>
        <span className="ml-auto glass px-2.5 py-0.5 rounded-full text-xs text-gray-400">
          {participants.length}
        </span>
      </div>

      {/* Add participant */}
      <div className="flex gap-2 mb-5">
        <input
          className="input-field flex-1"
          placeholder="Enter name (e.g. Alice)"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
        />
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={handleAdd}
          className="btn-primary text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          Add
        </motion.button>
      </div>

      {/* Participant list */}
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        <AnimatePresence>
          {participants.length === 0 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-gray-600 text-sm text-center py-8">
              No participants yet. Add some above.
            </motion.p>
          )}
          {participants.map((p, idx) => {
            const [c1, c2] = getColor(idx)
            return (
              <motion.div
                key={p}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3 glass p-3 rounded-xl group"
              >
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
                  {p.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium text-sm truncate">{p}</div>
                  <div className="text-gray-500 text-xs">
                    Paid ₹{paid[p]?.toFixed(2) || '0.00'}
                  </div>
                </div>
                <button
                  onClick={() => onRemove(p)}
                  className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all text-lg leading-none"
                >
                  ×
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
