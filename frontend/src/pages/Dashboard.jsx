import { useEffect, useRef, useState } from "react";

import { createBudget, createCategory, createTransaction, deleteBudget, deleteTransaction, getBudgets, getCategories, getDashboardSummary, getExcelExportUrl, getExpenseExcelExportUrl, getReports, getTransactions, updateTransaction } from "../api/client";
import { BudgetPanel } from "../components/BudgetPanel";
import { Header } from "../components/Header";
import { ReportsPanel } from "../components/ReportsPanel";
import { TransactionForm } from "../components/TransactionForm";

export function Dashboard({ user, onLogout, onUpdateProfile }) {
  const [summary, setSummary] = useState({ balance: "0.00", income: "0.00", expenses: "0.00", transaction_count: 0, category_totals: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [budgets, setBudgets] = useState([]);
  const [report, setReport] = useState({ monthly: [], categories: [] });
  const [transactionLimit, setTransactionLimit] = useState(10);
  const [categoryLimit, setCategoryLimit] = useState(10);
  const transactionFormRef = useRef(null);

  function refreshDashboard() {
    return Promise.allSettled([getDashboardSummary(), getTransactions(), getCategories(), getBudgets(), getReports()]).then((results) => {
      const [nextSummary, nextTransactions, nextCategories, nextBudgets, nextReport] = results;
      if (nextSummary.status === "fulfilled") setSummary(nextSummary.value);
      if (nextTransactions.status === "fulfilled") setTransactions(nextTransactions.value);
      if (nextCategories.status === "fulfilled") setCategories(nextCategories.value);
      if (nextBudgets.status === "fulfilled") setBudgets(nextBudgets.value);
      if (nextReport.status === "fulfilled") setReport(nextReport.value);
      const failed = results.some((result) => result.status === "rejected");
      if (failed) setError("Some dashboard data could not load. Check that the API and database are running.");
      else setError("");
    });
  }

  useEffect(() => {
    refreshDashboard()
      .catch(() => setError("Start the API to load your latest totals."))
      .finally(() => setLoading(false));
  }, []);

  async function saveTransaction(transaction) {
    if (editingTransaction) {
      await updateTransaction(editingTransaction.id, transaction);
    } else {
      await createTransaction(transaction);
    }
    setEditingTransaction(null);
    await refreshDashboard();
  }

  async function addCategory(event) {
    event.preventDefault();
    if (!newCategory.trim()) return;
    setCategoryError("");
    try {
      await createCategory(newCategory.trim());
      setNewCategory("");
      await refreshDashboard();
    } catch (categorySaveError) {
      setCategoryError(categorySaveError.message);
    }
  }

  async function createCustomCategory(name) {
    const category = await createCategory(name);
    await refreshDashboard();
    return category;
  }

  async function removeTransaction(id) {
    if (!window.confirm("Delete this transaction?")) return;
    await deleteTransaction(id);
    await refreshDashboard();
  }

  async function saveBudget(budget) {
    await createBudget(budget);
    await refreshDashboard();
  }

  async function removeBudget(id) {
    if (!window.confirm("Delete this budget?")) return;
    await deleteBudget(id);
    await refreshDashboard();
  }

  const visibleTransactions = transactions.slice(0, transactionLimit);
  const visibleCategoryTotals = summary.category_totals.slice(0, categoryLimit);

  return (
    <div className={`app-shell theme-${user.theme || "light"}`}>
      <Header user={user} onLogout={onLogout} onUpdateProfile={onUpdateProfile} />
      <main className="dashboard" id="dashboard">
        <section className="hero">
          <p className="eyebrow">Your financial overview</p>
          <h1>Make every rupee count.</h1>
          <p className="hero-copy">
            See what is available, what is coming in, and where your money is moving.
          </p>
        </section>
        <section className="summary-grid" aria-label="Financial summary">
          <article className="summary-card" id="balance-card">
            <span>Balance</span>
            <small>Available after income and spending</small>
            <strong className="summary-amount"><em>₹</em>{loading ? "..." : summary.balance}</strong>
          </article>
          <article className="summary-card" id="income-card">
            <span>Income</span>
            <small>Money received</small>
            <strong className="summary-amount"><em>₹</em>{loading ? "..." : summary.income}</strong>
          </article>
          <article className="summary-card" id="expenses-card">
            <span>Expenses</span>
            <small>Money spent</small>
            <strong className="summary-amount"><em>₹</em>{loading ? "..." : summary.expenses}</strong>
          </article>
        </section>
        {error && <p role="alert">{error}</p>}
        <TransactionForm transaction={editingTransaction} categories={categories} onSave={saveTransaction} onCancel={() => setEditingTransaction(null)} onCreateCategory={createCustomCategory} formRef={transactionFormRef} />
        <div id="budgets"><BudgetPanel budgets={budgets} categories={categories} onCreate={saveBudget} onDelete={removeBudget} /></div>
        <ReportsPanel report={report} excelExportUrl={getExcelExportUrl()} expenseExcelExportUrl={getExpenseExcelExportUrl()} />
        <section className="transactions-section" id="transactions">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Activity</p>
              <h2>Recent transactions</h2>
            </div>
            <span className="section-count">{summary.transaction_count} total</span>
          </div>
          {transactions.length === 0 ? (
            <p className="muted-copy">Your transactions will appear here after you add one.</p>
          ) : (
            <div className="transaction-list">
              {visibleTransactions.map((transaction) => (
                <article className="transaction-row" key={transaction.id}>
                  <div><strong>{transaction.description}</strong><span>{transaction.category ?? "Uncategorized"} · {transaction.date}</span></div>
                  <strong className={transaction.type === "income" ? "income" : "expense"}>{transaction.type === "income" ? "+" : "-"}₹{transaction.amount}</strong>
                  <div className="row-actions"><button className="text-button" type="button" onClick={() => setEditingTransaction(transaction)}>Edit</button><button className="danger-button" type="button" onClick={() => removeTransaction(transaction.id)}>Delete</button></div>
                </article>
              ))}
            </div>
          )}
          {transactions.length > transactionLimit && <button className="view-more-button" type="button" onClick={() => setTransactionLimit(transactionLimit + 10)}>View more</button>}
        </section>
        {summary.category_totals.length > 0 && <section className="category-breakdown">
          <div className="section-heading">
            <div><p className="eyebrow">Where it goes</p><h2>Expense categories</h2></div>
          </div>
          <div className="breakdown-list">{visibleCategoryTotals.map((item) => <div className="breakdown-row" key={item.category}><span>{item.category}</span><strong>₹{item.amount}</strong></div>)}</div>
          {summary.category_totals.length > categoryLimit && <button className="view-more-button" type="button" onClick={() => setCategoryLimit(categoryLimit + 10)}>View more</button>}
          <a className="expense-export-button" href={getExpenseExcelExportUrl()}>Export expense Excel</a>
        </section>}
      </main>
    </div>
  );
}
