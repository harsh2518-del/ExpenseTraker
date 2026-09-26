import { useState } from "react";
import { BrandLogo } from "./BrandLogo";

export function AuthForm({ mode, onSubmit, onSwitchMode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const isRegistering = mode === "register";

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSubmit(email, password);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <div className="auth-brand"><BrandLogo /><span>expanse</span></div>
        <h1>{isRegistering ? "Start tracking clearly." : "Welcome back."}</h1>
        <p className="hero-copy">{isRegistering ? "Create your private financial workspace." : "Sign in to see your financial overview."}</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
          <label>Password<div className="password-field"><input type={showPassword ? "text" : "password"} minLength="8" value={password} onChange={(event) => setPassword(event.target.value)} required /><button className="password-toggle" type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword}>{showPassword ? "Hide" : "Show"}</button></div></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="primary-button" type="submit" disabled={saving}>{saving ? "Please wait..." : isRegistering ? "Create account" : "Sign in"}</button>
        </form>
        <button className="auth-switch" type="button" onClick={onSwitchMode}>{isRegistering ? "Already have an account? Sign in" : "Need an account? Create one"}</button>
      </section>
    </main>
  );
}