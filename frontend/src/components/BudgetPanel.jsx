import { useState } from "react";

export function BudgetPanel({ budgets, categories, onCreate, onDelete }) {
  const [form, setForm] = useState({ amount: "", category_id: "", month: new Date().toISOString().slice(0, 7) });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function submitBudget(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onCreate({ ...form, amount: Number(form.amount), category_id: Number(form.category_id) });
      setForm({ ...form, amount: "" });
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="budget-section" aria-label="Monthly budgets">
      <div className="section-heading">
        <div><p className="eyebrow">Guardrails</p><h2>Monthly budgets</h2></div>
        <span className="section-count">{budgets.length} active</span>
      </div>
      <form className="budget-form" onSubmit={submitBudget}>
        <label>Category<select name="category_id" value={form.category_id} onChange={updateField} required><option value="">Choose category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
        <label>Limit<input name="amount" type="number" min="0.01" step="0.01" value={form.amount} onChange={updateField} required /></label>
        <label>Month<input name="month" type="month" value={form.month} onChange={updateField} required /></label>
        <button className="primary-button" type="submit" disabled={saving}>{saving ? "Saving..." : "Set budget"}</button>
      </form>
      {error && <p className="form-error" role="alert">{error}</p>}
      {budgets.length > 0 && <div className="budget-list">{budgets.map((budget) => <article className="budget-card" key={budget.id}><div className="budget-card-heading"><div><strong>{budget.category}</strong><span>{budget.month.slice(0, 7)}</span></div><button className="danger-button" type="button" onClick={() => onDelete(budget.id)}>Delete</button></div><div className="budget-track"><span style={{ width: `${budget.percentage}%` }} /></div><div className="budget-card-meta"><span>₹{budget.spent} spent of ₹{budget.amount}</span><strong className={Number(budget.remaining) < 0 ? "expense" : "income"}>{Number(budget.remaining) < 0 ? "₹" + Math.abs(Number(budget.remaining)).toFixed(2) + " over " : " Now ₹ " + budget.remaining + " left"}</strong></div></article>)}</div>}
      {budgets.length === 0 && <p className="muted-copy">Set a category limit to give your spending a clear boundary.</p>}
    </section>
  );
}