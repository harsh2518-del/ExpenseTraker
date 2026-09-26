import { useState } from "react";

export function ReportsPanel({ report, excelExportUrl, expenseExcelExportUrl }) {
  const [categoryLimit, setCategoryLimit] = useState(10);
  const maxCategory = Math.max(...report.categories.map((item) => Number(item.amount)), 1);
  const visibleCategories = report.categories.slice(0, categoryLimit);

  return (
    <section className="reports-section" aria-label="Reports and insights">
      <div className="section-heading">
        <div><p className="eyebrow">Patterns</p><h2>Reports and insights</h2></div>
        <div className="report-actions"><a className="text-button" href={excelExportUrl}>All Excel</a></div>
      </div>
      {report.monthly.length === 0 ? <p className="muted-copy">Add transactions to see monthly trends.</p> : <div className="report-grid">
        <div className="monthly-report"><h3>Monthly movement</h3>{report.monthly.map((item) => <div className="monthly-row" key={item.month}><div><strong>{item.month}</strong><span>Income ₹{item.income} · Expenses ₹{item.expenses}</span></div><strong className={Number(item.net) >= 0 ? "income" : "expense"}>{Number(item.net) >= 0 ? "+" : "-"}₹{Math.abs(Number(item.net)).toFixed(2)}</strong></div>)}</div>
        <div className="category-report"><h3>Top expense categories</h3>{visibleCategories.map((item) => <div className="report-category" key={item.category}><div><span>{item.category}</span><strong>₹{item.amount}</strong></div><div className="report-bar"><span style={{ width: `${(Number(item.amount) / maxCategory) * 100}%` }} /></div></div>)}{report.categories.length > categoryLimit && <button className="view-more-button" type="button" onClick={() => setCategoryLimit(categoryLimit + 5)}>View more</button>}<a className="expense-export-button" href={expenseExcelExportUrl}>Export expense Excel</a></div>
      </div>}
    </section>
  );
}