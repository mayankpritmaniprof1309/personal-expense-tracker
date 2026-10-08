import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrency, formatDate } from "./format";

export function exportTransactionsToCSV(transactions = []) {
  const header = ["Transaction Name", "Type", "Transaction Mode", "Amount", "Date"];
  const rows = transactions.map((t) => [
    t.name,
    t.type ? t.type.toUpperCase() : "EXPENSE",
    (t.transactionMode || "upi").toUpperCase(),
    t.amount,
    formatDate(t.date || t.createdAt),
  ]);

  // Prepend UTF-8 BOM (\uFEFF) for seamless Microsoft Excel rendering
  const csvContent =
    "\uFEFF" +
    [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `ledger-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportTransactionsToExcel(transactions = []) {
  exportTransactionsToCSV(transactions);
}

export function exportReportToPDF({ stats, transactions = [] }) {
  const doc = new jsPDF();

  const income = transactions.filter((t) => t.type === "income");
  const expense = transactions.filter((t) => t.type === "expense");
  const totalIncome = income.reduce((s, t) => s + Number(t.amount || 0), 0);
  const totalExpense = expense.reduce((s, t) => s + Number(t.amount || 0), 0);
  const highestExpense = expense.reduce(
    (max, t) => (Number(t.amount) > Number(max?.amount || 0) ? t : max),
    null
  );

  const effectiveStats = stats || {
    totalIncome,
    totalExpense,
    savings: totalIncome - totalExpense,
    highestExpense,
    count: transactions.length,
  };

  doc.setFontSize(18);
  doc.text("Ledger — Financial Report", 14, 20);
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(`Generated on ${new Date().toLocaleDateString("en-IN")} — ${transactions.length} Total Records`, 14, 27);

  const summaryRows = [
    ["Total Income", formatCurrency(effectiveStats.totalIncome)],
    ["Total Expense", formatCurrency(effectiveStats.totalExpense)],
    ["Savings", formatCurrency(effectiveStats.savings)],
    ["Highest Expense", effectiveStats.highestExpense ? `${effectiveStats.highestExpense.name} — ${formatCurrency(effectiveStats.highestExpense.amount)}` : "—"],
    ["Number of Transactions", String(effectiveStats.count)],
  ];

  autoTable(doc, {
    startY: 34,
    head: [["Metric", "Value"]],
    body: summaryRows,
    theme: "grid",
    headStyles: { fillColor: [139, 92, 246] },
    styles: { fontSize: 10 },
  });

  const afterSummaryY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(13);
  doc.setTextColor(20);
  doc.text(`Transactions (${transactions.length})`, 14, afterSummaryY);

  autoTable(doc, {
    startY: afterSummaryY + 4,
    head: [["Transaction Name", "Type", "Transaction Mode", "Amount", "Date"]],
    body: transactions.map((t) => [
      t.name,
      t.type ? t.type.toUpperCase() : "EXPENSE",
      (t.transactionMode || "upi").toUpperCase(),
      formatCurrency(t.amount),
      formatDate(t.date || t.createdAt),
    ]),
    theme: "striped",
    headStyles: { fillColor: [99, 102, 241] },
    styles: { fontSize: 9 },
    showHead: "everyPage",
    didDrawPage: (data) => {
      const str = `Page ${doc.internal.getNumberOfPages()}`;
      doc.setFontSize(8);
      doc.setTextColor(150);
      const pageSize = doc.internal.pageSize;
      const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
      doc.text(str, data.settings.margin.left, pageHeight - 10);
    },
  });

  doc.save(`ledger-transactions-${new Date().toISOString().slice(0, 10)}.pdf`);
}
