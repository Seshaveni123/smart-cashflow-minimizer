# Smart Cash Flow Minimizer

A full-stack fintech web application that minimizes transactions between friends using a **Greedy Algorithm** + **Max Heap / Priority Queue**.

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React + Vite + Tailwind CSS + Framer Motion |
| Backend   | Python Flask                        |
| Algorithm | Greedy + Max Heap (heapq)           |
| Graph     | React Flow                          |
| Charts    | Recharts                            |

## Algorithm

1. Calculate total expenses and equal share per person
2. Compute net balance: `balance = paid - equal_share`
3. Greedy loop: pick max creditor + max debtor, settle minimum, repeat
4. Result: minimum number of transactions needed

## Project Structure

```
├── backend/
│   ├── app.py          # Flask API + greedy algorithm
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── AnalyticsCards.jsx
│   │   │   ├── ParticipantsPanel.jsx
│   │   │   ├── ExpenseForm.jsx
│   │   │   ├── ExpenseList.jsx
│   │   │   ├── ResultsPanel.jsx
│   │   │   ├── GraphView.jsx
│   │   │   └── PieChartPanel.jsx
│   │   └── index.css
│   └── vite.config.js
└── README.md
```

## Installation & Running

### Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
# Runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

## API Endpoints

| Method | Endpoint     | Description                  |
|--------|--------------|------------------------------|
| POST   | /calculate   | Minimize transactions        |
| POST   | /reset       | Clear all data               |
| GET    | /health      | Health check                 |

## Features

- Add participants with avatars
- Add expenses with categories
- Greedy algorithm minimizes number of transactions
- Animated React Flow graph visualization
- Pie chart by expense category
- Export settlement report
- Full dark mode glassmorphism UI
