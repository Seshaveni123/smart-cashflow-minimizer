import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { motion } from 'framer-motion'

const COLORS = ['#f7cbca', '#dfb6b2', '#c9d7d8', '#d5e5e5', '#f1f7f7', '#854f6c', '#5d6b6b']

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass px-3 py-2 rounded-xl text-sm">
      <div className="text-[#2b124c] font-semibold">{payload[0].name}</div>
      <div className="text-[#5d6b6b]">₹{payload[0].value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
    </div>
  )
}

export default function PieChartPanel({ categoryTotals }) {
  const data = Object.entries(categoryTotals).map(([name, value]) => ({ name, value }))

  if (data.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6 h-full"
    >
      <div className="flex items-center gap-2 mb-5">
        <span>🥧</span>
        <h2 className="text-[#2b124c] font-semibold text-lg">Expense by Category</h2>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((_, idx) => (
              <Cell
                key={idx}
                fill={COLORS[idx % COLORS.length]}
                stroke="transparent"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => <span style={{ color: '#5d6b6b', fontSize: 12 }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
