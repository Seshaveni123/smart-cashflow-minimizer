import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const AVATAR_COLORS = [
  ['#d8b4fe', '#f5d0fe'],
  ['#bfdbfe', '#dbeafe'],
  ['#f9a8d4', '#fce7f3'],
  ['#fde68a', '#fef3c7'],
  ['#c7d2fe', '#e0e7ff'],
  ['#fecdd3', '#fff1f2'],
  ['#bae6fd', '#ecfeff'],
  ['#ddd6fe', '#f5f3ff'],
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
    <div className="glass rounded-2xl p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-lg">👥</span>
        <h2 className="text-[#2b124c] font-semibold text-xl">Participants</h2>
        <span className="ml-auto glass px-2.5 py-0.5 rounded-full text-xs text-[#2b124c] font-semibold">
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
          className="btn-primary text-[#2b124c] px-4 py-2 rounded-lg text-sm font-medium"
        >
          Add
        </motion.button>
      </div>

      {/* Participant list */}
      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        <AnimatePresence>
          {participants.length === 0 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-[#5d6b6b] text-sm text-center py-8 font-medium">
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
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-[#2b124c] flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${c1}99, ${c2}cc)` }}>
                  {p.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[#2b124c] font-semibold text-base truncate">{p}</div>
                  <div className="text-[#5d6b6b] text-xs font-medium">
                    Paid ₹{paid[p]?.toFixed(2) || '0.00'}
                  </div>
                </div>
                <button
                  onClick={() => onRemove(p)}
                  className="opacity-0 group-hover:opacity-100 text-[#7a8190] hover:text-[#2b124c] transition-all text-lg leading-none"
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
