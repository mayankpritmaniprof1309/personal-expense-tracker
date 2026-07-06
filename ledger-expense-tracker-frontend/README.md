# Ledger — Personal Expense Tracker (Frontend)

A production-quality React frontend for a personal finance dashboard. Dark
glassmorphism theme, bento-grid landing page, full auth flow, and a
transaction dashboard with live charts, search/filter/pagination, and
PDF/CSV export.

## Stack

React 19 · Vite · Tailwind CSS · React Router DOM · Axios · Recharts ·
Framer Motion · Lucide React · React Hot Toast · jsPDF

## Getting started

```bash
npm install
cp .env.example .env
# edit .env and point VITE_API_BASE_URL at your backend
npm run dev
```

Build for production with `npm run build` (outputs to `dist/`).

## Project structure

```
src/
├── pages/            Home, Login, Signup, Dashboard, Reports, NotFound
├── components/        Navbar, Hero, Features, Footer, TransactionForm,
│                      TransactionTable, SummaryCards, ExpensePieChart,
│                      IncomeExpenseBarChart, MonthlyReport, DashboardShell,
│                      ProtectedRoute, ConfirmModal, LoadingSkeleton, ...
├── services/          apiClient.js (axios instance), authService.js,
│                      transactionService.js
├── context/           AuthContext.jsx
├── hooks/             useAuth.js
├── utils/             format.js, export.js (CSV/PDF)
└── App.jsx
```

## Backend API contract

This frontend expects a backend exposing exactly these routes, prefixed by
`VITE_API_BASE_URL` (default `http://localhost:5000/api`):

| Method | Endpoint | Auth |
|---|---|---|
| POST | `/auth/register` | — |
| POST | `/auth/login` | — |
| POST | `/transaction/createTransaction` | Bearer token |
| GET | `/transaction/getTransaction` | Bearer token |
| GET | `/transaction/getTransactionById/:id` | Bearer token |
| PUT | `/transaction/updateTransaction/:id` | Bearer token |
| DELETE | `/transaction/deleteTransaction/:id` | Bearer token |
| GET | `/transaction/summary` | Bearer token |

**Login response** is expected as:
```json
{ "message": "Login successful", "token": "jwt_token", "user": { "id": "...", "email": "..." } }
```
The token is stored in `localStorage` and attached to every request via an
axios interceptor (`src/services/apiClient.js`). A `401` response anywhere
clears the session and redirects to `/login`.

**Summary response** is expected as:
```json
{ "income": { "totalAmount": 50000, "count": 10 }, "expense": { "totalAmount": 20000, "count": 15 }, "balance": 30000 }
```

**Transaction payload** (create/update):
```json
{ "name": "Salary", "type": "income", "amount": 50000, "isDefault": false }
```

If your backend wraps responses differently (e.g. `{ data: [...] }` or
`{ transactions: [...] }`), the pages already unwrap either shape — adjust
`Dashboard.jsx` / `Reports.jsx` if your shape differs further.

## Notes

- The dashboard uses **optimistic updates**: new/edited/deleted transactions
  update the UI immediately, then reconcile with the server response. Failed
  requests roll back and surface a toast.
- Charts derive their data from whatever transactions are currently loaded,
  so they update live as you add/edit/delete.
- CSV/PDF export in the Reports page work entirely client-side from the
  loaded transaction list.
- Tailwind's dark glass theme, tokens, and animations live in
  `tailwind.config.js` and `src/index.css`.
