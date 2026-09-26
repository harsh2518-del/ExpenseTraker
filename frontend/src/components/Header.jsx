import { logout } from "../api/client";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "./BrandLogo";

export function Header({ user, onLogout, onUpdateProfile }) {
  const [open, setOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    function closeOnOutsideClick(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) setOpen(false);
    }
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, []);
  async function handleLogout() {
    await logout();
    onLogout();
  }

  return (
    <header className="topbar">
      <a className="brand" href="#dashboard" aria-label="Expanse home">
        <BrandLogo compact />
        <span>expanse</span>
      </a>
      <nav aria-label="Primary navigation">
        <a className="active" href="#dashboard">
          Dashboard
        </a>
        <a href="#transactions">Transactions</a>
        <a href="#budgets">Budgets</a>
      </nav>
      <div className="profile-menu" ref={profileRef}>
        <button className="profile-button" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Open profile menu">
          <span>{user.email.slice(0, 1).toUpperCase()}</span>
        </button>
        {open && <div className="profile-popover">
          <strong>Your profile</strong>
          <small>{user.email}</small>
          <div className="theme-toggle"><span>Theme</span><button type="button" aria-pressed={user.theme !== "dark"} className={user.theme === "dark" ? "theme-option" : "theme-option selected"} onClick={() => onUpdateProfile({ theme: "light" })}>Light</button><button type="button" aria-pressed={user.theme === "dark"} className={user.theme === "dark" ? "theme-option selected" : "theme-option"} onClick={() => onUpdateProfile({ theme: "dark" })}>Dark</button></div>
          <button className="signout-button" type="button" onClick={handleLogout}>Sign out</button>
        </div>}
      </div>
    </header>
  );
}
