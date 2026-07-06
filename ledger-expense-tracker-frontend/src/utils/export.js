import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrency, formatDate } from "./format";

export function exportTransactionsToCSV(transactions = []) {
  const header = ["Name", "Type", "Amount", "Date"];
  const rows = transactions.map((t) => [
    t.name,
    t.type,
    t.amount,
    formatDate(t.date || t.createdAt),
  ]);

  const csvContent = [header, ...rows]
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

export function exportReportToPDF({ stats, transactions = [] }) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Ledger — Financial Report", 14, 20);
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(`Generated on ${new Date().toLocaleDateString("en-IN")}`, 14, 27);

  const summaryRows = [
    ["Total Income", formatCurrency(stats.totalIncome)],
    ["Total Expense", formatCurrency(stats.totalExpense)],
    ["Savings", formatCurrency(stats.savings)],
    ["Highest Expense", stats.highestExpense ? `${stats.highestExpense.name} — ${formatCurrency(stats.highestExpense.amount)}` : "—"],
    ["Number of Transactions", String(stats.count)],
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
  doc.text("Transactions", 14, afterSummaryY);

  autoTable(doc, {
    startY: afterSummaryY + 4,
    head: [["Name", "Type", "Amount", "Date"]],
    body: transactions.map((t) => [
      t.name,
      t.type,
      formatCurrency(t.amount),
      formatDate(t.date || t.createdAt),
    ]),
    theme: "striped",
    headStyles: { fillColor: [99, 102, 241] },
    styles: { fontSize: 9 },
  });

  doc.save(`ledger-report-${new Date().toISOString().slice(0, 10)}.pdf`);
}
