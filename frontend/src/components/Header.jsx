import { motion } from 'framer-motion'

export default function Header({ onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between mb-10"
    >
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl pulse-glow"
          style={{ background: 'linear-gradient(135deg, #f7cbca, #d5e5e5 55%, #c9d7d8)', boxShadow: '0 12px 24px rgba(133,79,108,0.18)' }}>
          💰
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold gradient-text leading-tight">
            Smart Cash Flow Minimizer
          </h1>
          <p className="text-[#5d6b6b] text-sm sm:text-base mt-1 font-medium">
            Greedy Algorithm • Heap Optimization • Graph Visualization
          </p>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onReset}
        className="btn-danger text-[#f1f7f7] text-sm font-medium px-5 py-2.5 rounded-xl flex items-center gap-2"
      >
        🔄 Reset All
      </motion.button>
    </motion.div>
  )
}
