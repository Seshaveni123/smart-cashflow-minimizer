"""
Smart Cash Flow Minimizer - Flask Backend
Uses Greedy Algorithm + Max Heap to minimize transactions
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import heapq

app = Flask(__name__)
CORS(app)

# In-memory storage (no database, no auth)
expenses_store = []
participants_store = []


def minimize_transactions(participants, expenses):
    """
    Core algorithm: Greedy + Max Heap to minimize number of transactions.

    Steps:
    1. Compute total amount each person paid
    2. Compute equal share (total / n)
    3. Calculate net balance = paid - equal_share
    4. Use greedy: repeatedly settle max creditor vs max debtor
    """
    if not participants or not expenses:
        return [], {}, 0

    # Step 1: Total paid by each participant
    paid = {p: 0.0 for p in participants}
    for exp in expenses:
        payer = exp["payer"]
        amount = float(exp["amount"])
        if payer in paid:
            paid[payer] += amount

    total = sum(paid.values())
    n = len(participants)
    share = total / n  # Equal share per person

    # Step 2: Net balance (positive = creditor, negative = debtor)
    balance = {p: round(paid[p] - share, 2) for p in participants}

    # Step 3: Separate into creditors and debtors using max heaps
    # Python's heapq is a min-heap, so negate for max-heap behavior
    creditors = []  # (amount, name) - those owed money
    debtors = []    # (amount, name) - those who owe money

    for person, bal in balance.items():
        if bal > 0.001:
            heapq.heappush(creditors, (-bal, person))
        elif bal < -0.001:
            heapq.heappush(debtors, (bal, person))  # already negative

    transactions = []
    original_tx_count = (n * (n - 1)) // 2  # Worst case without optimization

    # Step 4: Greedy settlement
    while creditors and debtors:
        max_credit_neg, creditor = heapq.heappop(creditors)
        max_credit = -max_credit_neg  # convert back to positive

        min_debt_neg, debtor = heapq.heappop(debtors)
        min_debt = -min_debt_neg  # make positive

        # Settle the minimum of the two
        settled = round(min(max_credit, min_debt), 2)

        transactions.append({
            "from": debtor,
            "to": creditor,
            "amount": settled
        })

        remaining_credit = round(max_credit - settled, 2)
        remaining_debt = round(min_debt - settled, 2)

        if remaining_credit > 0.001:
            heapq.heappush(creditors, (-remaining_credit, creditor))
        if remaining_debt > 0.001:
            heapq.heappush(debtors, (-remaining_debt, debtor))

    reduced = max(0, original_tx_count - len(transactions))

    return transactions, balance, reduced


@app.route("/calculate", methods=["POST"])
def calculate():
    """
    POST /calculate
    Body: { participants: [...], expenses: [{payer, amount, description, category}] }
    Returns: optimized transactions, balances, analytics
    """
    data = request.get_json()
    participants = data.get("participants", [])
    expenses = data.get("expenses", [])

    if not participants:
        return jsonify({"error": "No participants provided"}), 400

    transactions, balances, reduced = minimize_transactions(participants, expenses)

    # Analytics
    total_expenses = sum(float(e["amount"]) for e in expenses)
    equal_share = round(total_expenses / len(participants), 2) if participants else 0

    # Expense by category breakdown
    category_totals = {}
    for exp in expenses:
        cat = exp.get("category", "General")
        category_totals[cat] = round(category_totals.get(cat, 0) + float(exp["amount"]), 2)

    # Per-person paid summary
    paid_summary = {p: 0.0 for p in participants}
    for exp in expenses:
        if exp["payer"] in paid_summary:
            paid_summary[exp["payer"]] += float(exp["amount"])
    paid_summary = {k: round(v, 2) for k, v in paid_summary.items()}

    return jsonify({
        "transactions": transactions,
        "balances": balances,
        "analytics": {
            "total_expenses": round(total_expenses, 2),
            "equal_share": equal_share,
            "num_participants": len(participants),
            "num_transactions": len(transactions),
            "transactions_reduced": reduced,
            "category_totals": category_totals,
            "paid_summary": paid_summary
        }
    })


@app.route("/reset", methods=["POST"])
def reset():
    """
    POST /reset
    Clears all in-memory data
    """
    global expenses_store, participants_store
    expenses_store = []
    participants_store = []
    return jsonify({"message": "Data reset successfully"})


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "Smart Cash Flow Minimizer"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
