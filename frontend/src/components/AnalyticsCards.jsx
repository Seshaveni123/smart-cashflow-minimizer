import { motion } from 'framer-motion'

const Card = ({ icon, label, value, sub, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass rounded-2xl p-6 card-hover relative overflow-hidden"
  >
    {/* Background accent */}
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 -translate-y-8 translate-x-8 blur-[1px]"
      style={{ background: color }} />
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl pulse-glow"
        style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.96) 0%, ${color}22 100%)`, border: `1px solid ${color}33`, boxShadow: `0 6px 14px ${color}16` }}>
        {icon}
      </div>
      <span className="text-[#5d6b6b] text-base font-semibold">{label}</span>
    </div>
    <div className="text-4xl font-bold text-[#2b124c] tracking-tight">{value}</div>
    {sub && <div className="text-sm text-[#5d6b6b] mt-1 font-medium">{sub}</div>}
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
      color="#6d28d9"
      delay={0}
      />
      <Card
        icon="👥"
        label="Participants"
        value={participants.length}
        sub={`${expenses.length} expense${expenses.length !== 1 ? 's' : ''} added`}
        color="#2563eb"
        delay={0.05}
      />
      <Card
        icon="⚡"
        label="Settlements"
        value={txCount}
        sub="optimized transactions"
        color="#7c3aed"
        delay={0.1}
      />
      <Card
        icon="📉"
        label="Reduced By"
        value={reduced === '—' ? '—' : `${reduced}`}
        sub="unnecessary transactions"
        color="#be185d"
        delay={0.15}
      />
    </div>
  )
}
