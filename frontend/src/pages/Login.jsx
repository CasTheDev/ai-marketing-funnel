import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";
import {
  BrainCircuit,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Please enter your email and password.");
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      return;
    }

    toast.success("Login successful!");
    navigate("/dashboard");
  }

  return (
    <main className="login-page">

      <div className="login-background-glow login-background-glow-one" />
      <div className="login-background-glow login-background-glow-two" />

      <section className="login-container">

        {/* BRAND */}
        <div className="login-brand">

          <div className="login-brand-icon">
            <BrainCircuit size={25} strokeWidth={2} />
          </div>

          <div>
            <div className="login-brand-name">
              VOXA
            </div>

            <div className="login-brand-product">
              AI CRM
            </div>
          </div>

        </div>

        {/* CARD */}
        <div className="login-card">

          <div className="login-card-header">

            <span className="login-eyebrow">
              Welcome back
            </span>

            <h1>
              Sign in to your CRM
            </h1>

            <p>
              Access your leads, analytics and CRM intelligence.
            </p>

          </div>

          <form
            className="login-form"
            onSubmit={handleLogin}
          >

            {/* EMAIL */}
            <div className="login-field">

              <label htmlFor="login-email">
                Email address
              </label>

              <div className="login-input-wrapper">

                <Mail
                  size={18}
                  className="login-input-icon"
                />

                <input
                  id="login-email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  disabled={isLoading}
                />

              </div>

            </div>

            {/* PASSWORD */}
            <div className="login-field">

              <label htmlFor="login-password">
                Password
              </label>

              <div className="login-input-wrapper">

                <LockKeyhole
                  size={18}
                  className="login-input-icon"
                />

                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  disabled={isLoading}
                />

                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() =>
                    setShowPassword((current) => !current)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              className="login-submit"
              disabled={isLoading}
            >

              {isLoading ? (
                <span>
                  Signing in...
                </span>
              ) : (
                <>
                  <span>
                    Sign in
                  </span>

                  <ArrowRight
                    size={18}
                    strokeWidth={2}
                  />
                </>
              )}

            </button>

          </form>

          {/* SECURITY */}
          <div className="login-security">

            <ShieldCheck size={16} />

            <span>
              Your account is secured with Supabase Authentication.
            </span>

          </div>

        </div>

        {/* FOOTER */}
        <p className="login-footer">
          VOXA AI CRM
          <span>•</span>
          CRM Intelligence Platform
        </p>

      </section>

    </main>
  );
}