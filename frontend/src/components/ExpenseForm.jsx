import { useState } from 'react'
import { motion } from 'framer-motion'

const CATEGORIES = ['Food', 'Transport', 'Accommodation', 'Entertainment', 'Utilities', 'Shopping', 'General']

export default function ExpenseForm({ participants, onAdd }) {
  const [form, setForm] = useState({
    description: '',
    amount: '',
    payer: '',
    category: 'General'
  })
  const [touched, setTouched] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched(true)
    if (!form.description || !form.amount || !form.payer) return
    if (parseFloat(form.amount) <= 0) return
    onAdd(form)
    setForm({ description: '', amount: '', payer: '', category: 'General' })
    setTouched(false)
  }

  const err = (f) => touched && !form[f]

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-lg">💳</span>
        <h2 className="text-white font-semibold text-lg">Add Expense</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-gray-400 text-xs mb-1.5 block">Description</label>
          <input
            className={`input-field ${err('description') ? 'border-red-500/60' : ''}`}
            placeholder="e.g. Dinner at restaurant"
            value={form.description}
            onChange={e => set('description', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-gray-400 text-xs mb-1.5 block">Amount (₹)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className={`input-field ${err('amount') ? 'border-red-500/60' : ''}`}
              placeholder="0.00"
              value={form.amount}
              onChange={e => set('amount', e.target.value)}
            />
          </div>
          <div>
            <label className="text-gray-400 text-xs mb-1.5 block">Category</label>
            <select
              className="select-field"
              value={form.category}
              onChange={e => set('category', e.target.value)}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-gray-400 text-xs mb-1.5 block">Paid By</label>
          {participants.length === 0 ? (
            <div className="input-field text-gray-600 cursor-not-allowed">Add participants first</div>
          ) : (
            <select
              className={`select-field ${err('payer') ? 'border-red-500/60' : ''}`}
              value={form.payer}
              onChange={e => set('payer', e.target.value)}
            >
              <option value="">Select payer...</option>
              {participants.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          type="submit"
          className="btn-primary text-white w-full py-3 rounded-xl font-semibold text-sm"
        >
          + Add Expense
        </motion.button>
      </form>
    </div>
  )
}
