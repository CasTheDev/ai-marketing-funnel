import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";

import "./Register.css";

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();

    if (
  !firstName.trim() ||
  !lastName.trim() ||
  !companyName.trim() ||
  !email.trim() ||
  !password ||
  !confirmPassword
) {
  toast.error(
    "Please complete your name, company, email, and password."
  );
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

    const { error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      first_name: firstName,
      last_name: lastName,
      company_name: companyName,
      job_title: jobTitle,
    },
  },
});

    setIsLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(
      "Registration successful! Please check your email to verify your account."
    );

    navigate("/login");
  }

  return (
    <div className="register-page">

      {/* =====================================================
          BRAND
      ===================================================== */}

      <div className="register-brand">
        <div className="register-brand-icon">
          <span>✣</span>
        </div>

        <div>
          <strong>VOXA</strong>
          <span>AI CRM</span>
        </div>
      </div>

      {/* =====================================================
          REGISTER CARD
      ===================================================== */}

      <div className="register-card">

        <div className="register-heading">
          <span className="register-eyebrow">
            GET STARTED
          </span>

          <h1>
            Create your CRM account
          </h1>

          <p>
            Start managing your leads with VOXA AI CRM.
          </p>
        </div>

        <form
          className="register-form"
          onSubmit={handleRegister}
        >

          {/* EMAIL */}

          <div className="register-field">

            <label htmlFor="register-email">
              Email address
            </label>

            <div className="register-input-wrapper">

              <Mail size={18} />

              <input
                id="register-email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />

            </div>

          </div>

          {/* FIRST NAME */}

<div className="register-field">

  <label htmlFor="register-first-name">
    First name
  </label>

  <div className="register-input-wrapper">

    <input
      id="register-first-name"
      type="text"
      placeholder="Your first name"
      value={firstName}
      onChange={(e) => setFirstName(e.target.value)}
      autoComplete="given-name"
    />

  </div>

</div>

{/* LAST NAME */}

<div className="register-field">

  <label htmlFor="register-last-name">
    Last name
  </label>

  <div className="register-input-wrapper">

    <input
      id="register-last-name"
      type="text"
      placeholder="Your last name"
      value={lastName}
      onChange={(e) => setLastName(e.target.value)}
      autoComplete="family-name"
    />

  </div>

</div>

{/* COMPANY NAME */}

<div className="register-field">

  <label htmlFor="register-company-name">
    Company name
  </label>

  <div className="register-input-wrapper">

    <input
      id="register-company-name"
      type="text"
      placeholder="Your company name"
      value={companyName}
      onChange={(e) => setCompanyName(e.target.value)}
      autoComplete="organization"
    />

  </div>

</div>

{/* JOB TITLE */}

<div className="register-field">

  <label htmlFor="register-job-title">
    Job title
  </label>

  <div className="register-input-wrapper">

    <input
      id="register-job-title"
      type="text"
      placeholder="Your role"
      value={jobTitle}
      onChange={(e) => setJobTitle(e.target.value)}
      autoComplete="organization-title"
    />

  </div>

</div>

          {/* PASSWORD */}

          <div className="register-field">

            <label htmlFor="register-password">
              Password
            </label>

            <div className="register-input-wrapper">

              <LockKeyhole size={18} />

              <input
                id="register-password"
                type={showPassword ? "text" : "password"}
                placeholder="Create your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />

              <button
                type="button"
                className="register-password-toggle"
                onClick={() =>
                  setShowPassword((current) => !current)
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}
              </button>

            </div>

          </div>

          {/* CONFIRM PASSWORD */}

          <div className="register-field">

            <label htmlFor="register-confirm-password">
              Confirm password
            </label>

            <div className="register-input-wrapper">

              <LockKeyhole size={18} />

              <input
                id="register-confirm-password"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                autoComplete="new-password"
              />

              <button
                type="button"
                className="register-password-toggle"
                onClick={() =>
                  setShowConfirmPassword(
                    (current) => !current
                  )
                }
                aria-label={
                  showConfirmPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}
              </button>

            </div>

          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            className="register-submit"
            disabled={isLoading}
          >
            {isLoading ? (
              "Creating account..."
            ) : (
              <>
                Create account
                <ArrowRight size={18} />
              </>
            )}
          </button>

        </form>

        {/* SECURITY */}

        <div className="register-security">

          <ShieldCheck size={15} />

          <span>
            Your account is secured with Supabase Authentication.
          </span>

        </div>

      </div>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div className="register-bottom">

        <span>Already have an account?</span>

        <button
          type="button"
          onClick={() => navigate("/login")}
        >
          Sign in
        </button>

      </div>

      <div className="register-copyright">
        VOXA AI CRM&nbsp;&nbsp;·&nbsp;&nbsp;CRM Intelligence Platform
      </div>

    </div>
  );
}