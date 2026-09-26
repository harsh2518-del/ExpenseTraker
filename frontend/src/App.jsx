import { useEffect, useState } from "react";

import { getCurrentUser, login, register, updateProfile } from "./api/client";
import { AuthForm } from "./components/AuthForm";
import { Dashboard } from "./pages/Dashboard";

function App() {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [authMode, setAuthMode] = useState("login");
  const [sessionError, setSessionError] = useState("");

  useEffect(() => {
    document.documentElement.dataset.theme = user?.theme || "light";
  }, [user?.theme]);

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch((error) => {
        if (error.message !== "authentication required") setSessionError("We could not reach your account. Start the API and refresh.");
        setUser(null);
      })
      .finally(() => setCheckingSession(false));
  }, []);

  async function submitAuth(email, password) {
    const authenticatedUser = authMode === "register" ? await register(email, password) : await login(email, password);
    setUser(authenticatedUser);
  }

  async function saveProfile(profile) {
    setUser((currentUser) => ({ ...currentUser, ...profile }));
    try {
      const updatedUser = await updateProfile(profile);
      setUser(updatedUser);
    } catch (error) {
      setSessionError(error.message);
    }
  }

  if (checkingSession) return <main className="auth-shell"><p>Loading your workspace...</p></main>;
  if (!user) return <><AuthForm mode={authMode} onSubmit={submitAuth} onSwitchMode={() => setAuthMode(authMode === "login" ? "register" : "login")} />{sessionError && <p className="auth-error" role="alert">{sessionError}</p>}</>;
  return <Dashboard user={user} onLogout={() => setUser(null)} onUpdateProfile={saveProfile} />;
}

export default App;
