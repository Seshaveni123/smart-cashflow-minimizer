import { motion } from 'framer-motion'

const Card = ({ icon, label, value, sub, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass rounded-2xl p-6 card-hover relative overflow-hidden"
  >
    {/* Background accent */}
    <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 -translate-y-8 translate-x-8"
      style={{ background: color }} />
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
        style={{ background: `${color}22`, border: `1px solid ${color}44` }}>
        {icon}
      </div>
      <span className="text-gray-400 text-sm font-medium">{label}</span>
    </div>
    <div className="text-3xl font-bold text-white">{value}</div>
    {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
  </motion.div>
)

export default function AnalyticsCards({ participants, expenses, results }) {
  const total = expenses.reduce((s, e) => s + parseFloat(e.amount || 0), 0)
  const share = participants.length > 0 ? (total / participants.length).toFixed(2) : 0
  const txCount = results?.analytics?.num_transactions ?? '—'
  const reduced = results?.analytics?.transactions_reduced ?? '—'

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card
        icon="💸"
        label="Total Expenses"
        value={`₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        sub={`₹${share} per person`}
        color="#3b82f6"
        delay={0}
      />
      <Card
        icon="👥"
        label="Participants"
        value={participants.length}
        sub={`${expenses.length} expense${expenses.length !== 1 ? 's' : ''} added`}
        color="#8b5cf6"
        delay={0.05}
      />
      <Card
        icon="⚡"
        label="Settlements"
        value={txCount}
        sub="optimized transactions"
        color="#06b6d4"
        delay={0.1}
      />
      <Card
        icon="📉"
        label="Reduced By"
        value={reduced === '—' ? '—' : `${reduced}`}
        sub="unnecessary transactions"
        color="#10b981"
        delay={0.15}
      />
    </div>
  )
}
