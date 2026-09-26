import { useEffect, useState } from "react";

const initialForm = {
  amount: "",
  type: "expense",
  description: "",
  date: new Date().toISOString().slice(0, 10),
  category_id: "",
};

export function TransactionForm({ transaction, categories, onSave, onCancel, onCreateCategory, formRef }) {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);

  useEffect(() => {
    setForm(transaction ? {
      amount: transaction.amount,
      type: transaction.type,
      description: transaction.description,
      date: transaction.date,
      category_id: transaction.category_id ?? "",
    } : initialForm);
    if (transaction && formRef?.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      formRef.current.querySelector("input[name=amount]")?.focus({ preventScroll: true });
    }
  }, [transaction, formRef]);

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleCategoryChange(event) {
    const value = event.target.value;
    if (value !== "__custom__") {
      updateField(event);
      return;
    }
    setForm({ ...form, category_id: "__custom__" });
  }

  async function createCustomCategory() {
    if (!customCategory.trim()) return;
    setCreatingCategory(true);
    setError("");
    try {
      const category = await onCreateCategory(customCategory.trim());
      setForm({ ...form, category_id: String(category.id) });
      setCustomCategory("");
    } catch (categoryError) {
      setError(categoryError.message);
    } finally {
      setCreatingCategory(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (form.category_id === "__custom__") {
      setError("Add your custom category before saving the transaction.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSave({ ...form, amount: Number(form.amount), category_id: form.category_id ? Number(form.category_id) : null });
      setForm(initialForm);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="transaction-form" ref={formRef} onSubmit={handleSubmit}>
      <div className="form-heading">
        <div>
          <p className="eyebrow">Transaction</p>
          <h2>{transaction ? "Edit transaction" : "Add a transaction"}</h2>
        </div>
        {transaction && <button className="text-button" type="button" onClick={onCancel}>Cancel</button>}
      </div>
      <div className="form-grid">
        <label>
          Type
          <select name="type" value={form.type} onChange={updateField}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </label>
        <label>
          Category
          <select name="category_id" value={form.category_id} onChange={handleCategoryChange}>
            <option value="">Uncategorized</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
          <button className="custom-category-cta" type="button" onClick={() => setForm({ ...form, category_id: "__custom__" })}>
            <span aria-hidden="true">+</span> Add category
          </button>
        </label>
        <label>
          Amount
          <input name="amount" type="number" min="0.01" step="0.01" value={form.amount} onChange={updateField} required />
        </label>
        <label>
          Description
          <input name="description" value={form.description} onChange={updateField} placeholder="e.g. Groceries" required />
        </label>
        <label>
          Date
          <input name="date" type="date" value={form.date} onChange={updateField} required />
        </label>
      </div>
      {form.category_id === "__custom__" && <div className="custom-category-row">
        <input id="custom-cat" value={customCategory} onChange={(event) => setCustomCategory(event.target.value)} placeholder="Name your category" aria-label="Custom category name" />
        <button className="text-button"  id="add-button" type="button" onClick={createCustomCategory} disabled={creatingCategory}>{creatingCategory ? "Adding..." : "Add category"}</button>
      </div>}
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="form-actions"><button className="primary-button" type="submit" disabled={saving}>{saving ? "Saving..." : transaction ? "Save changes" : "Add transaction"}</button></div>
    </form>
  );
}