/**
 * Feature 2: Before vs After Optimization Comparison Panel
 * - Animated count-up stats
 * - Circular efficiency chart (SVG)
 * - Progress bars
 */
import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

/* Animated counter hook */
function useCountUp(target, duration = 1200, active = true) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active || target === 0) { setVal(target); return }
    const start = Date.now()
    const step = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setVal(Math.round(ease * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, active])
  return val
}

/* Circular progress SVG */
function CircularProgress({ pct, size = 120, stroke = 10, color = '#854f6c' }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        {/* Track */}
        <circle cx={size/2} cy={size/2} r={r}
          fill="none" stroke="rgba(93,107,107,0.12)" strokeWidth={stroke} />
        {/* Fill */}
        <motion.circle
          cx={size/2} cy={size/2} r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          style={{ filter: `drop-shadow(0 0 8px ${color}88)` }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-bold text-[#2b124c]">{Math.round(pct)}%</div>
        <div className="text-[#5d6b6b] text-xs font-semibold">efficiency</div>
      </div>
    </div>
  )
}

export default function OptimizationComparison({ analytics, participants }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  if (!analytics) return null

  const n = participants.length
  const before = n > 1 ? (n * (n - 1)) / 2 : 0  // worst-case
  const after = analytics.num_transactions
  const reduced = Math.max(0, before - after)
  const pct = before > 0 ? Math.round((reduced / before) * 100) : 0

  const beforeVal  = useCountUp(before,  1000, inView)
  const afterVal   = useCountUp(after,   1000, inView)
  const reducedVal = useCountUp(reduced, 1000, inView)

  const stats = [
    {
      label: 'Before Optimization',
      sub: 'Worst-case transactions',
      value: beforeVal,
      suffix: '',
      color: '#854f6c',
      icon: '❌',
      bar: 1,
    },
    {
      label: 'After Optimization',
      sub: 'Greedy algorithm result',
      value: afterVal,
      suffix: '',
      color: '#dfb6b2',
      icon: '✅',
      bar: before > 0 ? after / before : 0,
    },
    {
      label: 'Reduced By',
      sub: 'Unnecessary transactions removed',
      value: reducedVal,
      suffix: ` (${pct}%)`,
      color: '#fbe4d8',
      icon: '📉',
      bar: before > 0 ? reduced / before : 0,
    },
  ]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl p-6 h-full"
    >
      <div className="flex items-center gap-2 mb-6">
        <span>📊</span>
        <h2 className="text-[#2b124c] font-semibold text-lg">Before vs After Optimization</h2>
        <span className="ml-auto text-xs text-[#5d6b6b] glass px-2 py-0.5 rounded-full font-medium">
          Greedy Algorithm Result
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        {/* Stat cards */}
        <div className="lg:col-span-2 space-y-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.1 + 0.2 }}
              className="p-4 rounded-xl"
              style={{ background: `${s.color}0d`, border: `1px solid ${s.color}22` }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{s.icon}</span>
                  <div>
                    <div className="text-[#2b124c] text-sm font-semibold">{s.label}</div>
                    <div className="text-[#5d6b6b] text-xs font-medium">{s.sub}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold" style={{ color: s.color }}>
                    {s.value}
                  </span>
                  {s.suffix && (
                    <span className="text-sm font-medium ml-1" style={{ color: s.color }}>
                      {s.suffix}
                    </span>
                  )}
                  <div className="text-[#5d6b6b] text-xs font-medium">transactions</div>
                </div>
              </div>
              {/* Bar */}
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(213,229,229,0.55)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: s.color, boxShadow: `0 0 8px ${s.color}88` }}
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${Math.min(s.bar * 100, 100)}%` } : {}}
                  transition={{ duration: 1, ease: 'easeOut', delay: i * 0.1 + 0.4 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Circular efficiency ring */}
        <div className="flex flex-col items-center justify-center p-6 rounded-2xl"
          style={{ background: 'rgba(241,247,247,0.78)', border: '1px solid rgba(201,215,216,0.46)', boxShadow: '0 18px 34px rgba(93,107,107,0.08)' }}>
          <div className="text-xs text-[#5d6b6b] uppercase tracking-wider mb-4 font-semibold">
            Optimization Efficiency
          </div>
          {inView && (
            <CircularProgress
              pct={pct}
              size={130}
              stroke={11}
              color={pct >= 60 ? '#fbe4d8' : pct >= 30 ? '#dfb6b2' : '#854f6c'}
            />
          )}
          <div className="mt-4 text-center">
            <div className="text-[#2b124c] font-semibold text-sm">
              {reduced} transaction{reduced !== 1 ? 's' : ''} saved
            </div>
            <div className="text-[#5d6b6b] text-xs mt-1 font-medium">
              out of {before} possible
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
