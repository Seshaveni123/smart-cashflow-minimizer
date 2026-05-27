/**
 * Enhanced Graph Visualization (Feature 1 + Feature 5)
 * - Color-coded creditor / debtor nodes
 * - Animated glowing edges
 * - Floating legend card
 * - Node hover tooltips
 * - Particle background
 */
import { useMemo } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  MarkerType,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { motion } from 'framer-motion'

/* ─── Legend Card ─────────────────────────────────────────── */
function GraphLegend() {
  const items = [
    { icon: '🟢', color: '#2563eb', label: 'Creditor', desc: 'Receives money' },
    { icon: '🔴', color: '#6d28d9', label: 'Debtor',   desc: 'Owes money' },
    { icon: '⚪', color: '#5f6472', label: 'Settled',  desc: 'Net zero balance' },
    { icon: '→',  color: '#be185d', label: 'Arrows',   desc: 'Optimized flow' },
    { icon: '💰', color: '#f59e0b', label: 'Labels',   desc: 'Settlement amount' },
  ]
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="absolute top-16 right-4 z-10 glass-strong rounded-2xl p-4 min-w-[190px]"
      style={{ border: '1px solid rgba(201,215,216,0.42)' }}
    >
      <div className="text-xs font-semibold text-[#2b124c] uppercase tracking-wider mb-3">
        Legend
      </div>
      <div className="space-y-2.5">
        {items.map(item => (
          <motion.div
            key={item.label}
            whileHover={{ x: 3 }}
            className="flex items-center gap-2.5 cursor-default"
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{
                background: `${item.color}22`,
                border: `1.5px solid ${item.color}88`,
                boxShadow: `0 0 8px ${item.color}44`,
              }}
            >
              {item.label === 'Arrows' ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 7h10M8 4l3 3-3 3" stroke={item.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <span>{item.icon}</span>
              )}
            </div>
            <div>
              <div className="text-[#2b124c] text-xs font-semibold leading-tight">{item.label}</div>
              <div className="text-[#5d6b6b] text-xs leading-tight font-medium">{item.desc}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

/* ─── Node color by balance ───────────────────────────────── */
function getNodeStyle(name, balances) {
  const bal = balances?.[name]
  let color, glow
  if (bal === undefined || Math.abs(bal) < 0.01) {
    color = '#d1d5db'; glow = '#cbd5e144'
  } else if (bal > 0) {
    color = '#bfdbfe'; glow = '#60a5fa33'  // creditor = light blue
  } else {
    color = '#ddd6fe'; glow = '#a78bfa33'  // debtor   = light purple
  }
  return {
    background: `radial-gradient(circle at 35% 35%, ${color}ff, ${color}dd 58%, rgba(255,255,255,0.86) 100%)`,
    border: `2.5px solid ${color}`,
    borderRadius: '50%',
    color: '#22113f',
    fontWeight: 700,
    fontSize: 12,
    width: 68,
    height: 68,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    boxShadow: `0 0 16px ${glow}, 0 0 24px ${glow}, inset 0 1px 0 rgba(255,255,255,0.8)`,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    padding: 4,
    lineHeight: '1.2',
    zIndex: 20,
  }
}

function buildNodes(participants, balances) {
  const n = participants.length
  if (n === 0) return []
  const radius = n <= 2 ? 140 : n <= 4 ? 200 : 250
  return participants.map((p, i) => {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2
    const x = 320 + radius * Math.cos(angle)
    const y = 240 + radius * Math.sin(angle)
    return {
      id: p,
      position: { x, y },
      data: {
        label: (
          <div className="flex flex-col items-center gap-0.5">
            <span style={{ fontSize: 13 }}>{p.charAt(0).toUpperCase()}</span>
            <span style={{ fontSize: 9, opacity: 0.95 }}>{p}</span>
            {balances?.[p] !== undefined && (
              <span style={{
                fontSize: 8,
                color: '#22113f',
                fontWeight: 600
              }}>
                {balances[p] >= 0 ? '+' : ''}₹{Math.abs(balances[p]).toFixed(0)}
              </span>
            )}
          </div>
        )
      },
      style: getNodeStyle(p, balances),
    }
  })
}

function buildEdges(transactions) {
  const edgeColors = ['#6d28d9', '#2563eb', '#be185d', '#b45309', '#15803d']
  return transactions.map((t, i) => ({
    id: `e${i}`,
    source: t.from,
    target: t.to,
    label: `₹${t.amount}`,
    labelStyle: { fill: '#22113f', fontWeight: 700, fontSize: 12 },
    labelBgStyle: { fill: 'rgba(255,255,255,0.90)', rx: 8, ry: 8 },
    labelBgPadding: [7, 5],
    animated: true,
    style: {
      stroke: edgeColors[i % edgeColors.length],
      strokeWidth: 3,
      filter: `drop-shadow(0 0 8px ${edgeColors[i % edgeColors.length]}cc)`,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: edgeColors[i % edgeColors.length],
      width: 20,
      height: 20,
    },
  }))
}

export default function GraphView({ results, participants }) {
  const balances = results?.balances || {}
  const transactions = results?.transactions || []

  const syncedNodes = useMemo(() => buildNodes(participants, balances), [participants, balances])
  const syncedEdges = useMemo(() => buildEdges(transactions), [transactions])

  if (participants.length === 0) {
    return (
      <div className="glass rounded-2xl p-16 text-center">
        <div className="text-7xl mb-4">🔗</div>
        <h3 className="text-[#2b124c] font-semibold text-xl mb-2">Transaction Graph</h3>
        <p className="text-[#5d6b6b] text-sm font-medium">Add participants and calculate settlements to see the animated graph.</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass relative flex h-[700px] min-h-[700px] w-full flex-col overflow-hidden rounded-2xl"
    >
      {/* Header */}
      <div className="px-6 pt-5 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>🔗</span>
          <h2 className="text-[#2b124c] font-semibold text-lg">Transaction Graph</h2>
          <span className="text-xs text-[#5d6b6b] glass px-2 py-0.5 rounded-full ml-2 font-medium">
            {participants.length} nodes • {transactions.length} edges
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-[#5d6b6b]">
          {transactions.length === 0 && results && (
            <span className="text-[#854f6c] font-semibold">✅ All settled — no transfers needed!</span>
          )}
        </div>
      </div>

      {/* React Flow */}
      <div className="relative z-10 w-full h-[700px]">
        <ReactFlow
          nodes={syncedNodes}
          edges={syncedEdges}
          fitView
          fitViewOptions={{ padding: 0.35 }}
          nodesDraggable
          nodesConnectable={false}
          elementsSelectable={false}
          style={{ width: '100%', height: '100%', background: 'transparent' }}
        >
          <Background
            variant="dots"
            color="#c9d7d8"
            gap={18}
            size={1.4}
          />
          <Controls
            style={{
              background: 'rgba(255,255,255,0.76)',
              border: '1px solid rgba(201,215,216,0.70)',
              borderRadius: 12,
              bottom: 16,
              left: 16,
            }}
          />
          <MiniMap
            style={{
              background: 'rgba(255,255,255,0.76)',
              border: '1px solid rgba(201,215,216,0.70)',
              borderRadius: 10,
            }}
            nodeColor={(node) => {
              const bal = balances[node.id]
      if (!bal || Math.abs(bal) < 0.01) return '#8b95a7'
      return bal > 0 ? '#bfdbfe' : '#ddd6fe'
            }}
          />
        </ReactFlow>
      </div>

      {/* Floating Legend */}
      <GraphLegend />
    </motion.div>
  )
}
