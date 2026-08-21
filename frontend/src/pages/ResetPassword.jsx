import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BrainCircuit,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";

import "./Login.css";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  async function handleResetPassword(e) {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Please complete both password fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setIsLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Password updated successfully.");

    navigate("/login");
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
              ACCOUNT SECURITY
            </span>

            <h1>
              Reset your password
            </h1>

            <p>
              Create a new password for your VOXA AI CRM account.
            </p>

          </div>

          <form
            className="login-form"
            onSubmit={handleResetPassword}
          >

            {/* NEW PASSWORD */}
            <div className="login-field">

              <label htmlFor="reset-password">
                New password
              </label>

              <div className="login-input-wrapper">

                <LockKeyhole
                  size={18}
                  className="login-input-icon"
                />

                <input
                  id="reset-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create your new password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete="new-password"
                  disabled={isLoading}
                />

                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current
                    )
                  }
                  disabled={isLoading}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>

            {/* CONFIRM PASSWORD */}
            <div className="login-field">

              <label htmlFor="reset-confirm-password">
                Confirm new password
              </label>

              <div className="login-input-wrapper">

                <LockKeyhole
                  size={18}
                  className="login-input-icon"
                />

                <input
                  id="reset-confirm-password"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  autoComplete="new-password"
                  disabled={isLoading}
                />

                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      (current) => !current
                    )
                  }
                  disabled={isLoading}
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirmPassword ? (
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
                  Updating password...
                </span>
              ) : (
                <>
                  <span>
                    Update password
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

      </section>

    </main>
  );
}